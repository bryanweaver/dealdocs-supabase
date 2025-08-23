// API Service Layer - Compatibility layer to minimize changes from Amplify
import { supabase, getUser, dbQuery } from '@/lib/supabase'

// Contract Operations (replacing GraphQL)
export const ContractAPI = {
  async create(contractData) {
    const user = await getUser()
    if (!user) throw new Error('User not authenticated')
    
    const { data, error } = await supabase
      .from('contracts')
      .insert({
        ...contractData,
        user_id: user.id,
        legacy_id: contractData.id, // Keep old ID for reference
        // Extract searchable fields from nested data
        mls_number: contractData.property_info?.mlsNumber || contractData.propertyInfo?.mlsNumber,
        property_address: contractData.property_info?.address || contractData.propertyInfo?.address,
        buyer_name: contractData.parties?.buyer?.name || contractData.parties?.primaryBuyer?.name,
        seller_name: contractData.parties?.seller?.name || contractData.parties?.primarySeller?.name,
        contract_date: contractData.contract_date || new Date().toISOString().split('T')[0]
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('contracts')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
        // Update extracted searchable fields if main data changed
        ...(updates.property_info && {
          mls_number: updates.property_info.mlsNumber,
          property_address: updates.property_info.address
        }),
        ...(updates.parties && {
          buyer_name: updates.parties.buyer?.name || updates.parties.primaryBuyer?.name,
          seller_name: updates.parties.seller?.name || updates.parties.primarySeller?.name
        })
      })
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
    return data
  },

  async list(filters = {}) {
    let query = supabase
      .from('contract_summaries') // Use the optimized view
      .select('*')
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
    
    return dbQuery(query)
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
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    
    return data.publicUrl
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
      .single()
    
    if (error) throw error
    return data
  },

  async list(contractId) {
    const { data, error } = await supabase
      .from('etch_packets')
      .select('*')
      .eq('contract_id', contractId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
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
  AgentAPI,
  StorageAPI,
  DocumentAPI,
  EtchAPI,
  EmailAPI,
  StatsAPI,
  BatchAPI
}