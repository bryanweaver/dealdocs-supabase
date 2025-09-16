// API Service Layer - Compatibility layer to minimize changes from Amplify
import { supabase, getUser, dbQuery } from '@/lib/supabase'
import { 
  transformVuexDataForSupabase, 
  transformSupabaseDataForVuex,
  normalizeContractData,
  createContractPayload,
  extractSearchableFields 
} from '@/utils/fieldMapUtils'

// Contract Operations (replacing GraphQL)
export const ContractAPI = {
  async create(contractData) {
    const user = await getUser()
    if (!user) throw new Error('User not authenticated')
    
    // Check if data is already transformed (has property_info instead of property)
    const isAlreadyTransformed = 'property_info' in contractData || 'parties' in contractData
    
    // Only transform if not already transformed
    const dataToInsert = isAlreadyTransformed 
      ? contractData 
      : transformVuexDataForSupabase(contractData)
    
    const searchableFields = extractSearchableFields(contractData)
    
    const { data, error } = await supabase
      .from('contracts')
      .insert({
        ...dataToInsert,
        user_id: contractData.user_id || user.id, // Use provided user_id or fallback to current user
        legacy_id: contractData.id, // Keep old ID for reference
        // Extract searchable fields using the mapping utility
        ...searchableFields,
        contract_date: contractData.contract_date || new Date().toISOString().split('T')[0]
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id, updates) {
    console.log('ContractAPI.update - input updates:', updates);
    console.log('ContractAPI.update - marked_questions in updates:', updates.marked_questions);
    console.log('ContractAPI.update - marked_questions type:', typeof updates.marked_questions, Array.isArray(updates.marked_questions));
    
    // CRITICAL FIX: Fetch existing contract data first to merge with updates
    // This prevents data loss when updating individual sections
    const { data: existingContract, error: fetchError } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', id)
      .single()
    
    if (fetchError) throw fetchError
    
    console.log('ContractAPI.update - existing JSONB columns:', {
      property_info: existingContract.property_info,
      parties: existingContract.parties,
      financial_details: existingContract.financial_details,
      title_closing: existingContract.title_closing,
      legal_sections: existingContract.legal_sections,
      additional_info: existingContract.additional_info
    });
    
    // Transform the updates using the comprehensive mapping utilities
    const transformedUpdates = transformVuexDataForSupabase(updates)
    const searchableFields = extractSearchableFields(updates)
    
    // Deep merge function for nested JSONB data
    const deepMerge = (existing, updates) => {
      if (!updates) return existing;
      if (!existing) return updates;
      
      const merged = { ...existing };
      Object.keys(updates).forEach(key => {
        if (typeof updates[key] === 'object' && updates[key] !== null && !Array.isArray(updates[key])) {
          // For nested objects, merge recursively
          merged[key] = deepMerge(existing[key], updates[key]);
        } else {
          // For primitives and arrays, replace
          merged[key] = updates[key];
        }
      });
      return merged;
    };
    
    // Merge JSONB columns instead of replacing them
    const mergedUpdate = {
      ...transformedUpdates,
      // Deep merge each JSONB column with existing data
      property_info: transformedUpdates.property_info ? 
        deepMerge(existingContract.property_info, transformedUpdates.property_info) : 
        existingContract.property_info,
      parties: transformedUpdates.parties ? 
        deepMerge(existingContract.parties, transformedUpdates.parties) : 
        existingContract.parties,
      financial_details: transformedUpdates.financial_details ? 
        deepMerge(existingContract.financial_details, transformedUpdates.financial_details) : 
        existingContract.financial_details,
      title_closing: transformedUpdates.title_closing ? 
        deepMerge(existingContract.title_closing, transformedUpdates.title_closing) : 
        existingContract.title_closing,
      legal_sections: transformedUpdates.legal_sections ? 
        deepMerge(existingContract.legal_sections, transformedUpdates.legal_sections) : 
        existingContract.legal_sections,
      additional_info: transformedUpdates.additional_info ? 
        deepMerge(existingContract.additional_info, transformedUpdates.additional_info) : 
        existingContract.additional_info,
    }
    
    // If marked_questions is already present in updates (from createContractPayload),
    // preserve it as-is instead of letting transformVuexDataForSupabase handle it
    if (updates.marked_questions !== undefined) {
      mergedUpdate.marked_questions = updates.marked_questions;
    }
    
    const finalUpdate = {
      ...mergedUpdate,
      updated_at: new Date().toISOString(),
      // Update extracted searchable fields using the mapping utility
      ...searchableFields
    };
    
    console.log('ContractAPI.update - final merged update:', finalUpdate);
    console.log('ContractAPI.update - marked_questions in final:', finalUpdate.marked_questions);
    
    const { data, error } = await supabase
      .from('contracts')
      .update(finalUpdate)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async get(id) {
    const { data, error } = await supabase
      .from('contracts')
      .select(`
        *,
        etch_packets(*),
        email_packets(*),
        contract_documents(*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    
    // Log the raw data structure for debugging
    console.log('Raw contract data from Supabase:', data)
    
    // Normalize the contract data for consistent field mapping
    const normalizedData = normalizeContractData(data)
    console.log('Normalized contract data:', normalizedData)
    
    return normalizedData
  },

  async list(filters = {}) {
    let query = supabase
      .from('contracts') // Use main table instead of view to get full property_info
      .select(`
        *,
        contract_documents(*)
      `)
      .order('created_at', { ascending: false })
    
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    
    if (filters.limit) {
      query = query.limit(filters.limit)
    }
    
    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 25) - 1)
    }
    
    if (filters.search) {
      query = query.or(`property_address.ilike.%${filters.search}%,buyer_name.ilike.%${filters.search}%,seller_name.ilike.%${filters.search}%,mls_number.ilike.%${filters.search}%`)
    }
    
    const result = await dbQuery(query);
    console.log('ContractAPI.list - raw contracts from database:', result);
    if (result && result.length > 0) {
      console.log('First contract marked_questions:', result[0].marked_questions);
    }
    return result
  },

  async delete(id) {
    const { error } = await supabase
      .from('contracts')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  },

  async getByLegacyId(legacyId) {
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('legacy_id', legacyId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async updateProgress(id, progress) {
    const { data, error } = await supabase
      .from('contracts')
      .update({ 
        progress,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// Listing Agent Operations  
export const ListingAgentAPI = {
  async create(listingAgentData) {
    const { data, error } = await supabase
      .from('listing_agents')
      .insert({
        has_listing_agent_info: true,
        
        // Map camelCase to snake_case for database
        listing_associate_name: listingAgentData.listingAssociateName,
        listing_associate_email: listingAgentData.listingAssociateEmail,
        listing_associate_phone: listingAgentData.listingAssociatePhone,
        listing_associate_license_number: listingAgentData.listingAssociateLicenseNumber,
        listing_associate_team_name: listingAgentData.listingAssociateTeamName,
        listing_associate_supervisor_name: listingAgentData.listingAssociateSupervisorName,
        listing_associate_supervisor_license_number: listingAgentData.listingAssociateSupervisorLicenseNumber,
        
        firm_name: listingAgentData.firmName,
        firm_license_number: listingAgentData.firmLicenseNumber,
        firm_street_address: listingAgentData.firmStreetAddress,
        firm_city: listingAgentData.firmCity,
        firm_state: listingAgentData.firmState,
        firm_postal_code: listingAgentData.firmPostalCode,
        firm_phone: listingAgentData.firmPhone,
        
        selling_associate_name: listingAgentData.sellingAssociateName,
        selling_associate_license_number: listingAgentData.sellingAssociateLicenseNumber,
        selling_associate_team_name: listingAgentData.sellingAssociateTeamName,
        selling_associate_email: listingAgentData.sellingAssociateEmail,
        selling_associate_phone: listingAgentData.sellingAssociatePhone,
        selling_associate_supervisor_name: listingAgentData.sellingAssociateSupervisorName,
        selling_associate_supervisor_license_number: listingAgentData.sellingAssociateSupervisorLicenseNumber,
        selling_associate_street_address: listingAgentData.sellingAssociateStreetAddress,
        selling_associate_city: listingAgentData.sellingAssociateCity,
        selling_associate_state: listingAgentData.sellingAssociateState,
        selling_associate_postal_code: listingAgentData.sellingAssociatePostalCode
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('listing_agents')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async get(id) {
    const { data, error } = await supabase
      .from('listing_agents')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }
}

// Agent Search (replacing Lambda)
export const AgentAPI = {
  async search(searchTerm, limit = 10) {
    try {
      const { data, error } = await supabase
        .rpc('search_agents', { 
          search_term: searchTerm,
          limit_count: limit
        })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Agent search error:', error)
      // Fallback to basic search if RPC fails
      const { data, error: fallbackError } = await supabase
        .from('agents')
        .select('id, name, email, phone, mls_id, brokerage, city, state')
        .or(`name.ilike.%${searchTerm}%,mls_id.ilike.%${searchTerm}%,brokerage.ilike.%${searchTerm}%`)
        .eq('is_active', true)
        .limit(limit)
      
      if (fallbackError) throw fallbackError
      return data
    }
  },

  async getByMlsId(mlsId) {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('mls_id', mlsId)
      .eq('is_active', true)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async create(agentData) {
    const { data, error } = await supabase
      .from('agents')
      .insert(agentData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('agents')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async list(filters = {}) {
    let query = supabase
      .from('agents')
      .select('*')
      .eq('is_active', true)
      .order('name')
    
    if (filters.city) {
      query = query.eq('city', filters.city)
    }
    
    if (filters.state) {
      query = query.eq('state', filters.state)
    }
    
    if (filters.limit) {
      query = query.limit(filters.limit)
    }
    
    return dbQuery(query)
  }
}

// Storage Operations (replacing S3)
export const StorageAPI = {
  async upload(file, path, bucket = 'contracts') {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (error) throw error
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    
    return {
      path: data.path,
      fullPath: data.fullPath,
      publicUrl
    }
  },

  async download(path, bucket = 'contracts') {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path)
    
    if (error) throw error
    return data
  },

  async delete(paths, bucket = 'contracts') {
    const pathArray = Array.isArray(paths) ? paths : [paths]
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove(pathArray)
    
    if (error) throw error
    return true
  },

  async list(folder = '', bucket = 'contracts') {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder)
    
    if (error) throw error
    return data
  },

  getPublicUrl(path, bucket = 'contracts') {
    // For private buckets like 'contracts', we should use signed URLs
    // This method is kept for compatibility but should be replaced with getSignedUrl
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    
    return data.publicUrl
  },

  async getSignedUrl(path, bucket = 'contracts', expiresIn = 3600) {
    // Use signed URLs for private bucket access
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn)
    
    if (error) throw error
    
    // Fix internal Docker hostname if present
    if (data.signedUrl && data.signedUrl.includes('://kong:8000')) {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      // Handle both http and https
      const publicUrl = data.signedUrl.replace(/https?:\/\/kong:8000/g, supabaseUrl)
      console.log('Fixed kong:8000 URL in StorageAPI.getSignedUrl:', {
        original: data.signedUrl.substring(0, 60) + '...',
        fixed: publicUrl.substring(0, 60) + '...'
      })
      return publicUrl
    }
    
    return data.signedUrl
  }
}

// Document tracking
export const DocumentAPI = {
  async create(documentData) {
    const user = await getUser()
    if (!user) throw new Error('User not authenticated')
    
    const { data, error } = await supabase
      .from('contract_documents')
      .insert({
        ...documentData,
        uploaded_by: user.id
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async list(contractId) {
    const { data, error } = await supabase
      .from('contract_documents')
      .select('*')
      .eq('contract_id', contractId)
      .eq('is_current_version', true)
      .order('uploaded_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase
      .from('contract_documents')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  }
}

// E-signature operations
export const EtchAPI = {
  async create(etchData) {
    const { data, error } = await supabase
      .from('etch_packets')
      .insert(etchData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('etch_packets')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getByEtchPacketId(etchPacketId) {
    const { data, error } = await supabase
      .from('etch_packets')
      .select('*')
      .eq('etch_packet_id', etchPacketId)
      .maybeSingle() // Use maybeSingle() instead of single() to handle 0 rows
    
    if (error) throw error
    return data // Will be null if no record found
  },

  async list(contractId) {
    const { data, error } = await supabase
      .from('etch_packets')
      .select('*')
      .eq('contract_id', contractId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async delete(id) {
    console.log('EtchAPI.delete - Attempting to delete etch packet with ID:', id);
    
    const { data, error } = await supabase
      .from('etch_packets')
      .delete()
      .eq('id', id)
      .select() // Add select to see what was deleted
    
    console.log('EtchAPI.delete - Delete result:', { data, error });
    
    if (error) {
      console.error('EtchAPI.delete - Error:', error);
      throw error;
    }
    
    // Check if anything was actually deleted
    if (!data || data.length === 0) {
      console.warn('EtchAPI.delete - No rows were deleted. Possible RLS policy issue.');
      throw new Error('No rows were deleted. You may not have permission to delete this etch packet.');
    }
    
    console.log('EtchAPI.delete - Successfully deleted:', data);
    return true
  }
}

// Email tracking
export const EmailAPI = {
  async create(emailData) {
    const { data, error } = await supabase
      .from('email_packets')
      .insert(emailData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('email_packets')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async list(contractId) {
    const { data, error } = await supabase
      .from('email_packets')
      .select('*')
      .eq('contract_id', contractId)
      .order('sent_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async trackOpen(emailId, metadata = {}) {
    const { data, error } = await supabase
      .from('email_packets')
      .update({
        opened_at: new Date().toISOString(),
        status: 'opened',
        tracking_pixel_viewed: true,
        ...metadata
      })
      .eq('id', emailId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async trackClick(emailId, metadata = {}) {
    const { data, error } = await supabase
      .from('email_packets')
      .update({
        clicked_at: new Date().toISOString(),
        status: 'clicked',
        ...metadata
      })
      .eq('id', emailId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// Statistics and analytics
export const StatsAPI = {
  async getContractStats(userId = null) {
    let query = supabase
      .from('contracts')
      .select('status')
    
    if (userId) {
      query = query.eq('user_id', userId)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    
    // Calculate stats
    const stats = data.reduce((acc, contract) => {
      acc[contract.status] = (acc[contract.status] || 0) + 1
      return acc
    }, {})
    
    return {
      total: data.length,
      draft: stats.draft || 0,
      pending: stats.pending || 0,
      completed: stats.completed || 0,
      cancelled: stats.cancelled || 0
    }
  },

  async getRecentActivity(limit = 10) {
    const { data, error } = await supabase
      .from('audit_log')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data
  }
}

// Batch operations
export const BatchAPI = {
  async importAgents(agents) {
    const batchSize = 100
    const results = []
    
    for (let i = 0; i < agents.length; i += batchSize) {
      const batch = agents.slice(i, i + batchSize)
      
      const { data, error } = await supabase
        .from('agents')
        .insert(batch)
        .select()
      
      if (error) throw error
      results.push(...data)
    }
    
    return results
  },

  async bulkUpdateContracts(updates) {
    const results = []
    
    for (const update of updates) {
      try {
        const result = await ContractAPI.update(update.id, update.data)
        results.push(result)
      } catch (error) {
        console.error(`Failed to update contract ${update.id}:`, error)
        results.push({ id: update.id, error: error.message })
      }
    }
    
    return results
  }
}

// Export all APIs
export default {
  ContractAPI,
  ListingAgentAPI,
  AgentAPI,
  StorageAPI,
  DocumentAPI,
  EtchAPI,
  EmailAPI,
  StatsAPI,
  BatchAPI
}