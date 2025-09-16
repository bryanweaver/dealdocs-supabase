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
 * Based on the actual database schema with JSONB columns:
 * - property_info, parties, financial_details, title_closing, legal_sections, additional_info
 */
export const VUEX_TO_SUPABASE_FIELD_MAP: Record<string, string> = {
  // These map directly to database columns
  property: 'property_info',
  buyers: 'parties', // Special case: buyers/sellers are combined into parties
  sellers: 'parties', // Special case: buyers/sellers are combined into parties  
  
  // These don't have direct columns - they should go into JSONB fields
  // We'll handle them separately in transformVuexDataForSupabase
  // finance: 'financial_details',
  // title: 'title_closing',
  // leases: 'legal_sections',
  // survey: 'legal_sections',
  // homeownersAssociationAddendum: 'legal_sections',
  // titleObjections: 'title_closing',
  // titleNotices: 'title_closing',
  // propertyCondition: 'additional_info',
  // brokerDisclosure: 'additional_info',
  // closing: 'title_closing',
  // possession: 'additional_info',
  // buyerProvisions: 'legal_sections',
  // buyerNotices: 'legal_sections',
  // buyerAttorney: 'legal_sections',
  // listingAgent is handled specially - goes into additional_info.listing_agent
  
  // These fields need snake_case conversion
  markedQuestions: 'marked_questions',
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
 * Groups fields into the correct JSONB columns based on the database schema
 * @param vuexFormData - Form data from Vuex store
 * @returns Transformed data ready for Supabase insertion/update
 */
export function transformVuexDataForSupabase(vuexFormData: any): any {
  const supabaseData: any = {
    property_info: {},
    parties: {},
    financial_details: {},
    title_closing: {},
    legal_sections: {},
    additional_info: {}
  };
  
  Object.entries(vuexFormData).forEach(([vuexFieldName, fieldData]) => {
    if (!fieldData || (typeof fieldData === 'object' && Object.keys(fieldData).length === 0)) {
      // Skip empty/null sections
      return;
    }
    
    // Skip markedQuestions here - it will be handled separately in createContractPayload
    if (vuexFieldName === 'markedQuestions') {
      return;
    }
    
    // Group fields into the correct JSONB columns
    switch(vuexFieldName) {
      // Property info column
      case 'property':
        supabaseData.property_info = { ...supabaseData.property_info, ...fieldData };
        break;
        
      // Parties column (buyers and sellers)
      case 'buyers':
      case 'sellers':
        supabaseData.parties[vuexFieldName] = fieldData;
        break;
        
      // Financial details column
      case 'finance':
        console.log('Saving finance data to financial_details:', fieldData);
        supabaseData.financial_details = { ...supabaseData.financial_details, finance: fieldData };
        break;
        
      // Title and closing column
      case 'title':
      case 'closing':
      case 'titleObjections':
      case 'titleNotices':
        supabaseData.title_closing[vuexFieldName] = fieldData;
        break;
        
      // Legal sections column
      case 'leases':
      case 'survey':
      case 'homeownersAssociationAddendum':
      case 'buyerProvisions':
      case 'buyerNotices':
      case 'buyerAttorney':
        supabaseData.legal_sections[vuexFieldName] = fieldData;
        break;
        
      // Additional info column
      case 'listingAgent':
        supabaseData.additional_info.listing_agent = fieldData;
        break;
      case 'propertyCondition':
      case 'brokerDisclosure':
      case 'possession':
        supabaseData.additional_info[vuexFieldName] = fieldData;
        break;
        
      // Any other fields go to additional_info
      default:
        if (!['progress', 'status', 'created_at', 'updated_at', 'id'].includes(vuexFieldName)) {
          supabaseData.additional_info[vuexFieldName] = fieldData;
        }
        break;
    }
  });
  
  // Clean up empty JSONB objects
  Object.keys(supabaseData).forEach(key => {
    if (typeof supabaseData[key] === 'object' && Object.keys(supabaseData[key]).length === 0) {
      delete supabaseData[key];
    }
  });
  
  return supabaseData;
}

/**
 * Transform data from Supabase format to Vuex format for loading
 * Extracts fields from JSONB columns back to Vuex structure
 * @param supabaseData - Raw data from Supabase
 * @returns Transformed data ready for Vuex store
 */
export function transformSupabaseDataForVuex(supabaseData: any): any {
  const vuexData: any = {};
  
  Object.entries(supabaseData).forEach(([supabaseFieldName, fieldData]) => {
    if (!fieldData) {
      return;
    }
    
    switch(supabaseFieldName) {
      // Property info
      case 'property_info':
        vuexData.property = fieldData;
        break;
        
      // Parties (buyers and sellers)
      case 'parties':
        if (typeof fieldData === 'object') {
          if (fieldData.buyers) {
            vuexData.buyers = fieldData.buyers;
          }
          if (fieldData.sellers) {
            vuexData.sellers = fieldData.sellers;
          }
          // Handle legacy format
          if (fieldData.primaryBuyer || fieldData.buyer) {
            vuexData.buyers = fieldData.primaryBuyer || fieldData.buyer || fieldData.buyers;
          }
          if (fieldData.primarySeller || fieldData.seller) {
            vuexData.sellers = fieldData.primarySeller || fieldData.seller || fieldData.sellers;
          }
        }
        break;
        
      // Financial details
      case 'financial_details':
        console.log('Loading financial_details from database:', fieldData);
        if (typeof fieldData === 'object') {
          // Check if it's stored as nested or flat
          if (fieldData.finance) {
            console.log('Found nested finance data:', fieldData.finance);
            vuexData.finance = fieldData.finance;
          } else if (Object.keys(fieldData).length > 0) {
            // It's stored flat, so use it directly
            console.log('Using flat financial_details as finance:', fieldData);
            vuexData.finance = fieldData;
          }
        }
        break;
        
      // Title and closing
      case 'title_closing':
        if (typeof fieldData === 'object') {
          // Extract individual sections
          Object.entries(fieldData).forEach(([key, value]) => {
            vuexData[key] = value;
          });
        }
        break;
        
      // Legal sections
      case 'legal_sections':
        if (typeof fieldData === 'object') {
          // Extract individual sections
          Object.entries(fieldData).forEach(([key, value]) => {
            vuexData[key] = value;
          });
        }
        break;
        
      // Additional info
      case 'additional_info':
        if (typeof fieldData === 'object') {
          // Extract listing agent
          if (fieldData.listing_agent) {
            vuexData.listingAgent = fieldData.listing_agent;
          }
          // Extract other sections
          Object.entries(fieldData).forEach(([key, value]) => {
            if (key !== 'listing_agent') {
              vuexData[key] = value;
            }
          });
        }
        break;
        
      // Marked questions
      case 'marked_questions':
        if (Array.isArray(fieldData)) {
          vuexData.markedQuestions = formatMarkedQuestionsFromDatabase(fieldData);
        }
        break;
        
      // Other fields pass through
      default:
        if (!['id', 'user_id', 'status', 'created_at', 'updated_at', 'legacy_id', 
               'mls_number', 'property_address', 'buyer_name', 'seller_name', 
               'contract_date', 'pdf_url', 'pdf_generated_at', 'signed_pdf_url', 
               'signed_at', 'progress'].includes(supabaseFieldName)) {
          vuexData[supabaseFieldName] = fieldData;
        }
        break;
    }
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
  
  // Apply the full transformation to extract all fields from JSONB columns
  const transformedData = transformSupabaseDataForVuex(normalized);
  
  // Merge the transformed data back with the original to preserve any metadata fields
  Object.assign(normalized, transformedData);
  
  // Preserve important metadata fields from the original
  if (contractData.id) normalized.id = contractData.id;
  if (contractData.status) normalized.status = contractData.status;
  if (contractData.created_at) normalized.created_at = contractData.created_at;
  if (contractData.updated_at) normalized.updated_at = contractData.updated_at;
  if (contractData.user_id) normalized.user_id = contractData.user_id;
  
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
  
  const payload = {
    ...transformedData,
    ...cleanAdditionalFields,
    // Store listing agent and other additional data in additional_info JSON field
    ...(Object.keys(additional_info).length > 0 && { additional_info }),
    // Ensure marked questions are properly formatted as an array
    // The database expects TEXT[] array type, not JSON string
    marked_questions: additionalFields.markedQuestions ? 
      formatMarkedQuestionsForDatabase(additionalFields.markedQuestions) : [],
    updated_at: new Date().toISOString()
  };
  
  console.log('Final contract payload:', payload);
  console.log('marked_questions in payload:', payload.marked_questions);
  console.log('marked_questions type:', typeof payload.marked_questions, Array.isArray(payload.marked_questions));
  
  return payload;
}

/**
 * Format marked questions for database storage
 * Converts the markedQuestions object structure into a flat array of strings
 * @param markedQuestions - Object with section keys containing arrays of field IDs
 * @returns Array of strings in format "sectionId.fieldId"
 */
function formatMarkedQuestionsForDatabase(markedQuestions: any): string[] {
  const result: string[] = [];
  
  if (!markedQuestions || typeof markedQuestions !== 'object') {
    console.log('formatMarkedQuestionsForDatabase - Invalid input:', markedQuestions);
    return result;
  }
  
  console.log('formatMarkedQuestionsForDatabase - Input:', JSON.stringify(markedQuestions));
  console.log('formatMarkedQuestionsForDatabase - Type:', typeof markedQuestions);
  console.log('formatMarkedQuestionsForDatabase - Keys:', Object.keys(markedQuestions));
  
  // markedQuestions is an object like: { buyers: ['primaryName', 'phone'], sellers: ['name'] }
  Object.entries(markedQuestions).forEach(([sectionId, fieldIds]) => {
    console.log(`Processing section ${sectionId}:`, fieldIds);
    if (Array.isArray(fieldIds) && fieldIds.length > 0) {
      fieldIds.forEach(fieldId => {
        const formatted = `${sectionId}.${fieldId}`;
        console.log(`Adding: ${formatted}`);
        result.push(formatted);
      });
    }
  });
  
  console.log('formatMarkedQuestionsForDatabase - Final result:', result);
  return result;
}

/**
 * Format marked questions from database format back to Vuex format
 * Converts the flat array of strings back to object structure
 * @param markedQuestions - Array of strings in format "sectionId.fieldId"
 * @returns Object with section keys containing arrays of field IDs
 */
function formatMarkedQuestionsFromDatabase(markedQuestions: string[]): any {
  const result: any = {};
  
  if (!markedQuestions || !Array.isArray(markedQuestions)) {
    return result;
  }
  
  markedQuestions.forEach(item => {
    if (typeof item === 'string' && item.includes('.')) {
      const [sectionId, fieldId] = item.split('.');
      if (!result[sectionId]) {
        result[sectionId] = [];
      }
      result[sectionId].push(fieldId);
    }
  });
  
  return result;
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