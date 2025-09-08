/**
 * Field Mapping Utilities for Supabase Integration
 * 
 * This utility handles the systematic mapping between Vuex store field names
 * and Supabase database field names, ensuring backward compatibility.
 * 
 * Vuex Store (Frontend) Field Names:
 * - property, buyers, sellers, finance, title, leases, survey, etc.
 * 
 * Supabase Database Field Names:
 * - property_info, parties, finance_info, title_info, leases_info, survey_info, etc.
 */

/**
 * Maps Vuex store section names to Supabase database field names
 */
export const VUEX_TO_SUPABASE_FIELD_MAP: Record<string, string> = {
  // Core form sections
  property: 'property_info',
  buyers: 'parties', // Special case: buyers/sellers are combined into parties
  sellers: 'parties', // Special case: buyers/sellers are combined into parties  
  finance: 'finance_info',
  title: 'title_info',
  leases: 'leases_info',
  survey: 'survey_info',
  
  // Additional form sections
  homeownersAssociationAddendum: 'hoa_addendum',
  titleObjections: 'title_objections',
  titleNotices: 'title_notices',
  propertyCondition: 'property_condition',
  brokerDisclosure: 'broker_disclosure',
  closing: 'closing_info',
  possession: 'possession_info',
  buyerProvisions: 'buyer_provisions',
  buyerNotices: 'buyer_notices',
  buyerAttorney: 'buyer_attorney',
  // listingAgent is handled specially - goes into additional_info.listing_agent
  
  // These fields may not need mapping (used as-is)
  // markedQuestions: 'marked_questions',
  // progress: 'progress',
  // status: 'status',
  // created_at: 'created_at',
  // updated_at: 'updated_at'
};

/**
 * Reverse mapping from Supabase field names to Vuex store section names
 */
export const SUPABASE_TO_VUEX_FIELD_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(VUEX_TO_SUPABASE_FIELD_MAP).map(([vuex, supabase]) => [supabase, vuex])
);

/**
 * Special fields that need custom handling
 */
export const SPECIAL_FIELD_MAPPINGS = {
  // parties field contains both buyers and sellers
  PARTIES_FIELD: 'parties',
  BUYERS_KEY: 'buyers',
  SELLERS_KEY: 'sellers',
  
  // Legacy compatibility
  LEGACY_PROPERTY_FIELD: 'property',
  NEW_PROPERTY_FIELD: 'property_info'
};

/**
 * Transform form data from Vuex format to Supabase format for saving
 * @param vuexFormData - Form data from Vuex store
 * @returns Transformed data ready for Supabase insertion/update
 */
export function transformVuexDataForSupabase(vuexFormData: any): any {
  const supabaseData: any = {};
  
  Object.entries(vuexFormData).forEach(([vuexFieldName, fieldData]) => {
    if (!fieldData || (typeof fieldData === 'object' && Object.keys(fieldData).length === 0)) {
      // Skip empty/null sections
      return;
    }
    
    // Handle special cases
    if (vuexFieldName === 'buyers' || vuexFieldName === 'sellers') {
      // Combine buyers and sellers into parties object
      if (!supabaseData.parties) {
        supabaseData.parties = {};
      }
      supabaseData.parties[vuexFieldName] = fieldData;
      return;
    }
    
    // Handle listingAgent specially - it should go into additional_info, not as a top-level field
    if (vuexFieldName === 'listingAgent') {
      if (!supabaseData.additional_info) {
        supabaseData.additional_info = {};
      }
      supabaseData.additional_info.listing_agent = fieldData;
      return;
    }
    
    // Handle regular field mappings
    const supabaseFieldName = VUEX_TO_SUPABASE_FIELD_MAP[vuexFieldName] || vuexFieldName;
    supabaseData[supabaseFieldName] = fieldData;
  });
  
  // Ensure we use property_info (the correct column name), not property
  if (supabaseData.property && !supabaseData.property_info) {
    supabaseData.property_info = supabaseData.property;
    delete supabaseData.property; // Remove the incorrect field name
  }
  
  return supabaseData;
}

/**
 * Transform data from Supabase format to Vuex format for loading
 * @param supabaseData - Raw data from Supabase
 * @returns Transformed data ready for Vuex store
 */
export function transformSupabaseDataForVuex(supabaseData: any): any {
  const vuexData: any = {};
  
  Object.entries(supabaseData).forEach(([supabaseFieldName, fieldData]) => {
    if (!fieldData) {
      return;
    }
    
    // Handle special cases
    if (supabaseFieldName === 'parties' && typeof fieldData === 'object') {
      // Split parties back into buyers and sellers
      if (fieldData.buyers) {
        vuexData.buyers = fieldData.buyers;
      }
      if (fieldData.sellers) {
        vuexData.sellers = fieldData.sellers;
      }
      // Also handle legacy format where parties might contain primaryBuyer/primarySeller
      if (fieldData.primaryBuyer || fieldData.buyer) {
        vuexData.buyers = fieldData.primaryBuyer || fieldData.buyer || fieldData.buyers;
      }
      if (fieldData.primarySeller || fieldData.seller) {
        vuexData.sellers = fieldData.primarySeller || fieldData.seller || fieldData.sellers;
      }
      return;
    }
    
    // Handle backward compatibility for property/property_info
    if (supabaseFieldName === 'property_info' || supabaseFieldName === 'property') {
      vuexData.property = fieldData;
      return;
    }
    
    // Handle regular field mappings
    const vuexFieldName = SUPABASE_TO_VUEX_FIELD_MAP[supabaseFieldName] || supabaseFieldName;
    vuexData[vuexFieldName] = fieldData;
  });
  
  return vuexData;
}

/**
 * Ensure backward compatibility when loading existing contracts
 * @param contractData - Raw contract data from Supabase
 * @returns Normalized contract data with consistent field names
 */
export function normalizeContractData(contractData: any): any {
  if (!contractData) return null;
  
  const normalized = { ...contractData };
  
  // Handle property/property_info backward compatibility
  if (normalized.property_info && !normalized.property) {
    normalized.property = normalized.property_info;
  } else if (normalized.property && !normalized.property_info) {
    normalized.property_info = normalized.property;
  }
  
  // Handle parties structure
  if (normalized.parties) {
    if (typeof normalized.parties === 'object') {
      // Already in the correct structure
    } else if (normalized.buyers || normalized.sellers) {
      // Convert individual buyer/seller fields to parties structure
      normalized.parties = {};
      if (normalized.buyers) normalized.parties.buyers = normalized.buyers;
      if (normalized.sellers) normalized.parties.sellers = normalized.sellers;
    }
  } else {
    // Create parties from individual buyer/seller fields
    if (normalized.buyers || normalized.sellers) {
      normalized.parties = {};
      if (normalized.buyers) normalized.parties.buyers = normalized.buyers;
      if (normalized.sellers) normalized.parties.sellers = normalized.sellers;
    }
  }
  
  // Handle listing agent mapping
  if (normalized.listing_agent && !normalized.listingAgent) {
    normalized.listingAgent = normalized.listing_agent;
  } else if (normalized.listing_agent_info && !normalized.listingAgent) {
    normalized.listingAgent = normalized.listing_agent_info;
  }
  
  return normalized;
}

/**
 * Create a contract data payload for API operations
 * @param vuexFormData - Complete form data from Vuex store
 * @param additionalFields - Any additional fields to include
 * @returns Complete contract data ready for API calls
 */
export function createContractPayload(vuexFormData: any, additionalFields: any = {}): any {
  const transformedData = transformVuexDataForSupabase(vuexFormData);
  
  // Remove listing_agent_info from additionalFields as it's not a valid column
  // It should be stored within the additional_info JSON field instead
  const { listing_agent_info, ...cleanAdditionalFields } = additionalFields;
  
  // Build the additional_info object with listing agent data
  const additional_info = {
    ...(transformedData.additional_info || {}),
    ...(listing_agent_info && { listing_agent: listing_agent_info })
  };
  
  return {
    ...transformedData,
    ...cleanAdditionalFields,
    // Store listing agent and other additional data in additional_info JSON field
    ...(Object.keys(additional_info).length > 0 && { additional_info }),
    // Ensure marked questions are properly serialized
    marked_questions: additionalFields.markedQuestions ? 
      JSON.stringify(additionalFields.markedQuestions) : null,
    updated_at: new Date().toISOString()
  };
}

/**
 * Validate that required sections are present for contract creation
 * @param formData - Form data to validate
 * @returns boolean indicating if data is valid for contract creation
 */
export function isValidForContractCreation(formData: any): boolean {
  // At minimum, we need property information
  return !!(formData?.property?.streetAddress || 
           formData?.property?.address || 
           formData?.property_info?.streetAddress ||
           formData?.property_info?.address);
}

/**
 * Get searchable field values for contract indexing
 * @param contractData - Contract data (either Vuex or Supabase format)
 * @returns Object with searchable fields extracted
 */
export function extractSearchableFields(contractData: any): {
  mls_number?: string;
  property_address?: string;
  buyer_name?: string;
  seller_name?: string;
} {
  const normalized = normalizeContractData(contractData);
  
  return {
    mls_number: normalized.property?.mlsNumber || 
               normalized.property_info?.mlsNumber || 
               normalized.mls_number,
               
    property_address: normalized.property?.streetAddress || 
                     normalized.property?.address || 
                     normalized.property_info?.streetAddress || 
                     normalized.property_info?.address ||
                     normalized.property_address,
                     
    buyer_name: normalized.parties?.buyers?.primaryName ||
               normalized.parties?.buyer?.name ||
               normalized.buyers?.primaryName ||
               normalized.buyer_name,
               
    seller_name: normalized.parties?.sellers?.primaryName ||
                normalized.parties?.seller?.name ||
                normalized.sellers?.primaryName ||
                normalized.seller_name
  };
}