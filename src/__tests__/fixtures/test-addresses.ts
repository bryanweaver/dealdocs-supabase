/**
 * Test data for address validation and property search scenarios
 */

export const validTexasAddresses = [
  {
    input: "1234 Maple Drive, Houston, TX 77082",
    parsed: {
      streetNumber: "1234",
      streetName: "Maple Drive",
      city: "Houston",
      state: "TX",
      zipCode: "77082",
    },
    components: {
      streetLine: "1234 Maple Drive",
      secondary: "",
      city: "Houston",
      state: "TX",
      zipcode: "77082",
    },
  },
  {
    input: "5678 Oak Avenue, Austin, TX 78701",
    parsed: {
      streetNumber: "5678",
      streetName: "Oak Avenue",
      city: "Austin",
      state: "TX",
      zipCode: "78701",
    },
    components: {
      streetLine: "5678 Oak Avenue",
      secondary: "",
      city: "Austin",
      state: "TX",
      zipcode: "78701",
    },
  },
  {
    input: "9876 Pine Street, Dallas, TX 75201",
    parsed: {
      streetNumber: "9876",
      streetName: "Pine Street",
      city: "Dallas",
      state: "TX",
      zipCode: "75201",
    },
    components: {
      streetLine: "9876 Pine Street",
      secondary: "",
      city: "Dallas",
      state: "TX",
      zipcode: "75201",
    },
  },
  {
    input: "1440 Waseca Street, Houston, TX 77055",
    parsed: {
      streetNumber: "1440",
      streetName: "Waseca Street",
      city: "Houston",
      state: "TX",
      zipCode: "77055",
    },
    components: {
      streetLine: "1440 Waseca Street",
      secondary: "",
      city: "Houston",
      state: "TX",
      zipcode: "77055",
    },
  },
];

export const invalidAddresses = [
  {
    input: "Invalid Address Format",
    error: "Unable to parse address components",
  },
  {
    input: "123 Fake St, Nowhere, ZZ 00000",
    error: "Invalid state code",
  },
  {
    input: "123 Main St, Houston, TX invalid-zip",
    error: "Invalid ZIP code format",
  },
  {
    input: "",
    error: "Address cannot be empty",
  },
];

export const addressWithUnits = [
  {
    input: "1234 Main St Apt 5B, Houston, TX 77001",
    parsed: {
      streetNumber: "1234",
      streetName: "Main St",
      unit: "Apt 5B",
      city: "Houston",
      state: "TX",
      zipCode: "77001",
    },
    components: {
      streetLine: "1234 Main St",
      secondary: "Apt 5B",
      city: "Houston",
      state: "TX",
      zipcode: "77001",
    },
  },
  {
    input: "5678 Oak Ave Unit 202, Austin, TX 78701",
    parsed: {
      streetNumber: "5678",
      streetName: "Oak Ave",
      unit: "Unit 202",
      city: "Austin",
      state: "TX",
      zipCode: "78701",
    },
    components: {
      streetLine: "5678 Oak Ave",
      secondary: "Unit 202",
      city: "Austin",
      state: "TX",
      zipcode: "78701",
    },
  },
];

export const lotBlockTestCases = [
  {
    input: "LT 1 BLK 1 WYNFIELD ESTATES SEC 3A",
    expected: {
      lot: "1",
      block: "1",
      legalDescription: "LT 1 BLK 1 WYNFIELD ESTATES SEC 3A",
    },
  },
  {
    input: "LOT 5 BLOCK 3 SUNRISE ADDITION",
    expected: {
      lot: "5",
      block: "3",
      legalDescription: "LOT 5 BLOCK 3 SUNRISE ADDITION",
    },
  },
  {
    input: "PARCEL 7 LT 2 BLK 4 MEADOWBROOK",
    expected: {
      lot: "2",
      block: "4",
      legalDescription: "PARCEL 7 LT 2 BLK 4 MEADOWBROOK",
    },
  },
  {
    input: "LOT 10A, BLOCK 2, SUNSET MEADOWS SUBDIVISION",
    expected: {
      lot: "10A",
      block: "2",
      legalDescription: "LOT 10A, BLOCK 2, SUNSET MEADOWS SUBDIVISION",
    },
  },
  {
    input: "NO LOT BLOCK INFO",
    expected: {
      lot: "",
      block: "",
      legalDescription: "NO LOT BLOCK INFO",
    },
  },
];

export const propertySearchTestData = [
  {
    searchInput: "1440 Waseca",
    expectedDropdownOptions: [
      "1440 Waseca St, Houston, TX 77055",
      "1440 Waseca Drive, Houston, TX 77055",
      "1440 Waseca Lane, Houston, TX 77055",
    ],
    selectedOption: "1440 Waseca St, Houston, TX 77055",
  },
  {
    searchInput: "1234 Maple",
    expectedDropdownOptions: [
      "1234 Maple Dr, Houston, TX 77082",
      "1234 Maple Street, Houston, TX 77082",
      "1234 Maple Ave, Houston, TX 77082",
    ],
    selectedOption: "1234 Maple Dr, Houston, TX 77082",
  },
  {
    searchInput: "5678 Oak",
    expectedDropdownOptions: [
      "5678 Oak Ave, Austin, TX 78701",
      "5678 Oak Street, Austin, TX 78701",
      "5678 Oak Blvd, Austin, TX 78701",
    ],
    selectedOption: "5678 Oak Ave, Austin, TX 78701",
  },
];

export const malformedAddresses = [
  "123 Main St Houston TX", // Missing comma separators
  "123, Main, Street, Houston, TX, 77001", // Too many commas
  "123 Main St, Houston TX 77001", // Missing comma before state
  "Main Street, Houston, TX 77001", // Missing street number
  "123, Houston, TX 77001", // Missing street name
  "123 Main St, TX 77001", // Missing city
  "123 Main St, Houston, 77001", // Missing state
  "123 Main St, Houston, TX", // Missing zip code
];

/**
 * Factory function to create address test data
 */
export function createAddressTestCase(
  input: string,
  expected: any,
  shouldFail: boolean = false,
) {
  return {
    input,
    expected,
    shouldFail,
    description: shouldFail
      ? `Should fail to parse: ${input}`
      : `Should parse successfully: ${input}`,
  };
}

/**
 * Common Texas cities for address generation
 */
export const texasCities = [
  { name: "Houston", zipCodes: ["77001", "77002", "77055", "77082", "77027"] },
  { name: "Austin", zipCodes: ["78701", "78702", "78703", "78731", "78759"] },
  { name: "Dallas", zipCodes: ["75201", "75202", "75203", "75220", "75230"] },
  {
    name: "San Antonio",
    zipCodes: ["78201", "78202", "78203", "78210", "78240"],
  },
  {
    name: "Fort Worth",
    zipCodes: ["76101", "76102", "76103", "76110", "76120"],
  },
];

/**
 * Common street names for realistic address generation
 */
export const streetNames = [
  "Main St",
  "Oak Ave",
  "Pine St",
  "Maple Dr",
  "Cedar Ln",
  "First St",
  "Second St",
  "Park Rd",
  "Washington Ave",
  "Lincoln Blvd",
  "Elm St",
  "Broadway",
  "Market St",
  "Church St",
  "School St",
  "Mill Rd",
  "Hill St",
  "Valley Dr",
  "River Rd",
  "Lake Ave",
];

/**
 * Generate random but realistic Texas address
 */
export function generateRandomTexasAddress() {
  const houseNumber = Math.floor(1000 + Math.random() * 9000);
  const streetName =
    streetNames[Math.floor(Math.random() * streetNames.length)];
  const cityData = texasCities[Math.floor(Math.random() * texasCities.length)];
  const zipCode =
    cityData.zipCodes[Math.floor(Math.random() * cityData.zipCodes.length)];

  return `${houseNumber} ${streetName}, ${cityData.name}, TX ${zipCode}`;
}
