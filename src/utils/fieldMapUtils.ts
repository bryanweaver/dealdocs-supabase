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
        // Transform buyers from form format to database format
        if (fieldData.primaryName) {
          supabaseData.parties.buyers = {
            buyer1: {
              name: fieldData.primaryName,
              email: fieldData.email || '',
              phone: fieldData.phone || '',
              fax: fieldData.fax || ''
            }
          };
          if (fieldData.hasSecondaryParty && fieldData.secondaryName) {
            supabaseData.parties.buyers.buyer2 = {
              name: fieldData.secondaryName,
              email: fieldData.secondaryEmail || '',
              phone: fieldData.secondaryPhone || ''
            };
          }
        } else {
          supabaseData.parties.buyers = fieldData;
        }
        break;

      case 'sellers':
        // Transform sellers from form format to database format
        console.log(`[fieldMapUtils] Transforming sellers data:`, fieldData);
        if (fieldData.primaryName) {
          supabaseData.parties.sellers = {
            seller1: {
              name: fieldData.primaryName,
              email: fieldData.email || '',
              phone: fieldData.phone || '',
              fax: fieldData.fax || ''
            }
          };
          if (fieldData.hasSecondaryParty && fieldData.secondaryName) {
            supabaseData.parties.sellers.seller2 = {
              name: fieldData.secondaryName,
              email: fieldData.secondaryEmail || '',
              phone: fieldData.secondaryPhone || ''
            };
          }
        } else {
          console.log(`[fieldMapUtils] No primaryName for sellers, using fieldData as-is:`, fieldData);
          supabaseData.parties.sellers = fieldData;
        }
        console.log(`[fieldMapUtils] Final parties.sellers:`, supabaseData.parties.sellers);
        break;
        
      // Financial details column
      case 'finance':
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
        
      // Listing agent data - should be handled separately, not in additional_info
      case 'listingAgent':
        // This will be handled as a separate listing_agents record
        // Store temporarily for processing in API layer
        supabaseData.listing_agent_data = fieldData;
        break;
      case 'propertyCondition':
      case 'brokerDisclosure':
      case 'possession':
        supabaseData.additional_info[vuexFieldName] = fieldData;
        break;
        
      // Any other fields go to additional_info
      default:
        // CRITICAL: Never put these specific data structures in additional_info
        // They should either be in their designated JSONB columns or be metadata fields
        const skipFields = [
          'progress', 'status', 'created_at', 'updated_at', 'id', 'parties', 'buyer', 'seller',
          // Skip JSONB column names to prevent double-nesting
          'title_closing', 'legal_sections', 'financial_details', 'additional_info'
        ];
        if (!skipFields.includes(vuexFieldName)) {
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
        console.log('[fieldMapUtils] Loading parties from database:', fieldData);
        if (typeof fieldData === 'object') {
          // Transform sellers data from database format to form format
          if (fieldData.sellers) {
            console.log('[fieldMapUtils] Loading sellers data:', fieldData.sellers);
            if (fieldData.sellers.seller1) {
              // Convert from {seller1: {name, email, phone}} to {primaryName, email, phone}
              vuexData.sellers = {
                primaryName: fieldData.sellers.seller1.name || '',
                email: fieldData.sellers.seller1.email || '',
                phone: fieldData.sellers.seller1.phone || '',
                fax: fieldData.sellers.seller1.fax || '',
                hasSecondaryParty: fieldData.sellers.seller2 ? true : false,
                secondaryName: fieldData.sellers.seller2?.name || '',
                secondaryEmail: fieldData.sellers.seller2?.email || '',
                secondaryPhone: fieldData.sellers.seller2?.phone || ''
              };
            } else if (fieldData.sellers.primaryName) {
              // Already in the correct format
              vuexData.sellers = fieldData.sellers;
            } else {
              vuexData.sellers = fieldData.sellers;
            }
          }

          // Transform buyers data similarly
          if (fieldData.buyers) {
            if (fieldData.buyers.buyer1) {
              // Convert from {buyer1: {name, email, phone}} to {primaryName, email, phone}
              vuexData.buyers = {
                primaryName: fieldData.buyers.buyer1.name || '',
                email: fieldData.buyers.buyer1.email || '',
                phone: fieldData.buyers.buyer1.phone || '',
                fax: fieldData.buyers.buyer1.fax || '',
                hasSecondaryParty: fieldData.buyers.buyer2 ? true : false,
                secondaryName: fieldData.buyers.buyer2?.name || '',
                secondaryEmail: fieldData.buyers.buyer2?.email || ''
              };
            } else if (fieldData.buyers.primaryName) {
              // Already in the correct format
              vuexData.buyers = fieldData.buyers;
            } else {
              vuexData.buyers = fieldData.buyers;
            }
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
        
      // Additional info - should NOT contain listing_agent or parties anymore
      case 'additional_info':
        if (typeof fieldData === 'object') {
          // CRITICAL FIX: Never load 'parties' from additional_info
          // This is legacy data that should not be used
          if (fieldData.parties) {
            console.warn('WARNING: Found parties data in additional_info - this is legacy data and will be ignored');
            console.warn('Legacy parties data:', fieldData.parties);
          }

          // CRITICAL FIX: Never load 'listing_agent' from additional_info
          // This should come from the listing_agents table
          if (fieldData.listing_agent) {
            console.warn('WARNING: Found listing_agent data in additional_info - this should be in listing_agents table');
            console.warn('Legacy listing agent data:', fieldData.listing_agent);
          }

          // Extract other sections (excluding parties and listing_agent)
          Object.entries(fieldData).forEach(([key, value]) => {
            if (key !== 'listing_agent' && key !== 'parties') {
              vuexData[key] = value;
            }
          });
        }
        break;

      // Listing agent data from the listing_agent_data field (populated from listing_agents table)
      case 'listing_agent_data':
        if (typeof fieldData === 'object') {
          // Convert snake_case fields from database to camelCase for Vue
          vuexData.listingAgent = {
            hasListingAgentInfo: fieldData.has_listing_agent_info,
            firmName: fieldData.firm_name,
            firmLicenseNumber: fieldData.firm_license_number,
            firmStreetAddress: fieldData.firm_street_address,
            firmCity: fieldData.firm_city,
            firmState: fieldData.firm_state,
            firmPostalCode: fieldData.firm_postal_code,
            firmPhone: fieldData.firm_phone,
            listingAssociateName: fieldData.listing_associate_name,
            listingAssociateLicenseNumber: fieldData.listing_associate_license_number,
            listingAssociateTeamName: fieldData.listing_associate_team_name,
            listingAssociateEmail: fieldData.listing_associate_email,
            listingAssociatePhone: fieldData.listing_associate_phone,
            listingAssociateSupervisorName: fieldData.listing_associate_supervisor_name,
            listingAssociateSupervisorLicenseNumber: fieldData.listing_associate_supervisor_license_number,
            sellingAssociateName: fieldData.selling_associate_name,
            sellingAssociateLicenseNumber: fieldData.selling_associate_license_number,
            sellingAssociateTeamName: fieldData.selling_associate_team_name,
            sellingAssociateEmail: fieldData.selling_associate_email,
            sellingAssociatePhone: fieldData.selling_associate_phone,
            sellingAssociateSupervisorName: fieldData.selling_associate_supervisor_name,
            sellingAssociateSupervisorLicenseNumber: fieldData.selling_associate_supervisor_license_number,
            sellingAssociateStreetAddress: fieldData.selling_associate_street_address,
            sellingAssociateCity: fieldData.selling_associate_city,
            sellingAssociateState: fieldData.selling_associate_state,
            sellingAssociatePostalCode: fieldData.selling_associate_postal_code,
            // Don't include database metadata fields
            // Skip: id, created_at, updated_at
          };
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

  // Extract listing agent data to be handled separately
  const { listing_agent_data, ...contractData } = transformedData;

  // Remove listing_agent_info and markedQuestions from additionalFields as they're not valid columns
  const { listing_agent_info, markedQuestions, ...cleanAdditionalFields } = additionalFields;

  const payload = {
    ...contractData,
    ...cleanAdditionalFields,
    // Only include additional_info if it has content
    ...(transformedData.additional_info && Object.keys(transformedData.additional_info).length > 0 && {
      additional_info: transformedData.additional_info
    }),
    // Ensure marked questions are properly formatted as an array
    // The database expects TEXT[] array type, not JSON string
    marked_questions: markedQuestions ?
      formatMarkedQuestionsForDatabase(markedQuestions) : [],
    updated_at: new Date().toISOString()
  };

  // Add listing_agent_data back for API layer to handle
  if (listing_agent_data) {
    payload.listing_agent_data = listing_agent_data;
  }

  console.log('Final contract payload:', payload);
  console.log('listing_agent_data in payload:', payload.listing_agent_data);
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