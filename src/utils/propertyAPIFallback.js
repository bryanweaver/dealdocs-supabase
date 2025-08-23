import axios from "axios";

// Configuration for different property data APIs
const API_CONFIGS = {
  primary: {
    name: "Current Primary API",
    // This would be your existing API configuration
  },
  rentcast: {
    name: "RentCast",
    baseUrl: "https://api.rentcast.io/v1",
    // Note: Requires API key from RentCast
    endpoints: {
      property: "/property",
      valuation: "/avm/value",
      rental: "/avm/rent",
    },
  },
  // Add more APIs as needed
};

/**
 * Searches for property data using multiple API sources as fallbacks
 * @param {Object} address - Address object with street, city, state, zip
 * @param {String} primaryApiResponse - Response from primary API
 * @returns {Object} Property data or null if no data found
 */
export async function getPropertyDataWithFallbacks(
  address,
  primaryApiResponse = null,
) {
  console.log("🔍 Starting property data search with fallbacks...");

  // First, check if primary API returned valid data
  if (
    primaryApiResponse &&
    primaryApiResponse.data?.records?.length > 0 &&
    primaryApiResponse.data?.num_found > 0
  ) {
    console.log("✅ Primary API returned data, using it");
    return {
      source: "primary",
      data: primaryApiResponse.data.records[0],
      success: true,
    };
  }

  // Log the specific API response for debugging
  if (primaryApiResponse?.data) {
    console.log("⚠️ Primary API response:", {
      num_found: primaryApiResponse.data.num_found,
      records_length: primaryApiResponse.data.records?.length || 0,
      total_cost: primaryApiResponse.data.total_cost,
    });
  }

  console.log("⚠️ Primary API returned no records, trying fallback APIs...");

  // Fallback 1: Try RentCast API (if API key available)
  try {
    const rentcastData = await tryRentCastAPI(address);
    if (rentcastData) {
      console.log("✅ RentCast API found property data");
      return {
        source: "rentcast",
        data: rentcastData,
        success: true,
      };
    }
  } catch (error) {
    console.warn("RentCast API failed:", error.message);
  }

  // Fallback 2: Try other APIs here (add more as needed)
  // ... additional fallback APIs

  // Fallback 3: Return failure instead of generating minimal data
  // This allows the UI to show "no results found" message
  console.log("❌ All APIs failed, no property data available");
  return {
    source: "none",
    data: null,
    success: false,
    error: "No property data available from any source",
  };
}

/**
 * Attempts to fetch property data from RentCast API
 * @param {Object} address - Address object
 * @returns {Object|null} Property data or null
 */
async function tryRentCastAPI(address) {
  const apiKey = process.env.VITE_RENTCAST_API_KEY;
  if (!apiKey) {
    console.log("⚠️ RentCast API key not configured");
    return null;
  }

  // Handle different address object formats
  const houseNumber =
    address.houseNumber || address.streetLine?.split(" ")[0] || "";
  const streetName =
    address.streetName ||
    address.streetLine?.substring(address.streetLine.indexOf(" ") + 1) ||
    "";
  const city = address.city || "";
  const state = address.state || address.province || "";
  const zipCode = address.zipCode || address.zipcode || "";

  const fullAddress = `${houseNumber} ${streetName}, ${city}, ${state} ${zipCode}`;

  try {
    const response = await axios.get(
      `${API_CONFIGS.rentcast.baseUrl}${API_CONFIGS.rentcast.endpoints.property}`,
      {
        params: {
          address: fullAddress,
        },
        headers: {
          "X-API-Key": apiKey,
        },
        timeout: 10000, // 10 second timeout
      },
    );

    if (response.data && response.data.id) {
      // Try to get additional valuation data
      const valuationData = await getRentCastValuation(
        response.data.id,
        apiKey,
      );

      // Map RentCast data to our format
      return mapRentCastData(response.data, valuationData);
    }

    return null;
  } catch (error) {
    console.error("RentCast API error:", error.message);
    return null;
  }
}

/**
 * Gets property valuation from RentCast
 * @param {String} propertyId - RentCast property ID
 * @param {String} apiKey - API key
 * @returns {Object|null} Valuation data
 */
async function getRentCastValuation(propertyId, apiKey) {
  try {
    const [valueResponse, rentResponse] = await Promise.all([
      axios.get(
        `${API_CONFIGS.rentcast.baseUrl}${API_CONFIGS.rentcast.endpoints.valuation}`,
        {
          params: { propertyId },
          headers: { "X-API-Key": apiKey },
          timeout: 5000,
        },
      ),
      axios.get(
        `${API_CONFIGS.rentcast.baseUrl}${API_CONFIGS.rentcast.endpoints.rental}`,
        {
          params: { propertyId },
          headers: { "X-API-Key": apiKey },
          timeout: 5000,
        },
      ),
    ]);

    return {
      value: valueResponse.data,
      rent: rentResponse.data,
    };
  } catch (error) {
    console.warn("Failed to get RentCast valuation:", error.message);
    return null;
  }
}

/**
 * Maps RentCast API response to our internal format
 * @param {Object} rentcastData - RentCast property data
 * @param {Object} valuationData - RentCast valuation data
 * @returns {Object} Mapped property data
 */
function mapRentCastData(rentcastData, valuationData) {
  return {
    // Basic property info
    address: rentcastData.address || "",
    city: rentcastData.city || "",
    province: rentcastData.state || "", // Maps to our 'province' field
    postalCode: rentcastData.zipCode || "",
    county: rentcastData.county || "",

    // Property characteristics
    yearBuilt: rentcastData.yearBuilt || null,
    numBedroom: rentcastData.bedrooms || null,
    numBathroom: rentcastData.bathrooms || null,
    floorSizeValue: rentcastData.squareFootage || null,
    floorSizeUnit: "sqft",
    lotSizeValue: rentcastData.lotSize || null,
    lotSizeUnit: "sqft",

    // Financial data
    mostRecentPriceAmount:
      valuationData?.value?.price || rentcastData.lastSalePrice || null,
    mostRecentPriceDate: rentcastData.lastSaleDate || null,

    // Valuation estimates
    estimatedValue: valuationData?.value?.price || null,
    estimatedRent: valuationData?.rent?.price || null,

    // Metadata
    dataSource: "RentCast",
    lastUpdated: new Date().toISOString(),

    // RentCast specific fields
    rentcast: {
      propertyId: rentcastData.id,
      confidence: valuationData?.value?.confidence || null,
    },
  };
}

/**
 * Generates minimal property data when all APIs fail
 * @param {Object} address - Address object
 * @returns {Object} Minimal property data
 */
// eslint-disable-next-line no-unused-vars
function generateMinimalPropertyData(address) {
  // Handle different address object formats
  const houseNumber =
    address.houseNumber || address.streetLine?.split(" ")[0] || "";
  const streetName =
    address.streetName ||
    address.streetLine?.substring(address.streetLine.indexOf(" ") + 1) ||
    "";
  const city = address.city || "";
  const state = address.state || address.province || "";
  const zipCode = address.zipCode || address.zipcode || "";

  return {
    // Basic address info (what we know for sure)
    address: `${houseNumber} ${streetName}`,
    city: city,
    province: state,
    postalCode: zipCode,
    county: "", // Unknown

    // Set reasonable defaults/nulls for unknown fields
    yearBuilt: null,
    numBedroom: null,
    numBathroom: null,
    floorSizeValue: null,
    floorSizeUnit: "sqft",
    lotSizeValue: null,
    lotSizeUnit: "sqft",

    // Financial data - unknown
    mostRecentPriceAmount: null,
    mostRecentPriceDate: null,

    // Metadata
    dataSource: "Generated (Minimal)",
    lastUpdated: new Date().toISOString(),
    isMinimalData: true,

    // Add a note for the user
    dataNote:
      "Limited property data available. This property may be new or not in public records.",
  };
}

/**
 * Validates if property data has sufficient information
 * @param {Object} propertyData - Property data to validate
 * @returns {Boolean} Whether data is sufficient
 */
export function hasMinimalPropertyData(propertyData) {
  return (
    propertyData &&
    propertyData.address &&
    propertyData.city &&
    propertyData.province
  );
}

/**
 * Gets a user-friendly message about data source
 * @param {String} source - Data source identifier
 * @returns {String} User-friendly message
 */
export function getDataSourceMessage(source) {
  const messages = {
    primary: "Property data from our primary database",
    rentcast: "Property data from RentCast real estate database",
    generated: "Basic property information only - full data not available",
  };

  return messages[source] || "Property data from alternative source";
}
