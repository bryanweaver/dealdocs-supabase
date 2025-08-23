// This file is deprecated - GraphQL functionality has been migrated to Supabase
// Legacy GraphQL client functionality is now handled by the API service layer

import { supabase } from '@/lib/supabase';

function removeTypename(obj) {
  if (Array.isArray(obj)) {
    return obj.map(removeTypename);
  } else if (typeof obj === "object" && obj !== null) {
    const newObj = {};
    for (const key in obj) {
      if (key !== "__typename") {
        newObj[key] = removeTypename(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
}

// Legacy compatibility function - redirects to Supabase
export async function graphqlRequest(query, variables) {
  console.warn('graphqlRequest is deprecated. Please use the API service layer instead.');
  
  // This is a basic compatibility layer - actual implementation should use appropriate API service
  const cleanedVariables = removeTypename(variables);
  
  // You would need to map GraphQL queries to Supabase operations here
  // For now, we'll throw an error to encourage migration
  throw new Error('GraphQL operations have been migrated to Supabase. Please use the API service layer.');
}
