import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SearchAgentsRequest {
  searchTerm?: string
  city?: string
  state?: string
  mlsId?: string
  brokerage?: string
  limit?: number
  offset?: number
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    
    // Support both GET and POST requests
    let searchParams: SearchAgentsRequest
    
    if (req.method === 'GET') {
      searchParams = {
        searchTerm: url.searchParams.get('searchTerm') || '',
        city: url.searchParams.get('city') || '',
        state: url.searchParams.get('state') || '',
        mlsId: url.searchParams.get('mlsId') || '',
        brokerage: url.searchParams.get('brokerage') || '',
        limit: parseInt(url.searchParams.get('limit') || '10'),
        offset: parseInt(url.searchParams.get('offset') || '0')
      }
    } else {
      searchParams = await req.json()
    }
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    console.log('Agent search params:', searchParams)
    
    let agents = []
    
    // If we have a search term, use full-text search with ranking
    if (searchParams.searchTerm && searchParams.searchTerm.trim()) {
      try {
        const { data, error } = await supabase
          .rpc('search_agents', { 
            search_term: searchParams.searchTerm,
            limit_count: searchParams.limit || 10
          })
        
        if (error) throw error
        agents = data || []
        
      } catch (rpcError) {
        console.warn('RPC search failed, falling back to basic search:', rpcError)
        
        // Fallback to basic ILIKE search
        let query = supabase
          .from('agents')
          .select('id, name, email, phone, mls_id, brokerage, city, state, license_number, is_verified')
          .eq('is_active', true)
        
        // Apply search filters
        const searchTerm = searchParams.searchTerm.trim()
        query = query.or(`name.ilike.%${searchTerm}%,mls_id.ilike.%${searchTerm}%,brokerage.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
        
        if (searchParams.city) {
          query = query.eq('city', searchParams.city)
        }
        
        if (searchParams.state) {
          query = query.eq('state', searchParams.state)
        }
        
        if (searchParams.brokerage) {
          query = query.ilike('brokerage', `%${searchParams.brokerage}%`)
        }
        
        query = query
          .order('name')
          .range(searchParams.offset || 0, (searchParams.offset || 0) + (searchParams.limit || 10) - 1)
        
        const { data, error } = await query
        if (error) throw error
        
        agents = data || []
      }
    } else {
      // No search term - return agents with filters
      let query = supabase
        .from('agents')
        .select('id, name, email, phone, mls_id, brokerage, city, state, license_number, is_verified')
        .eq('is_active', true)
      
      // Apply specific filters
      if (searchParams.mlsId) {
        query = query.eq('mls_id', searchParams.mlsId)
      }
      
      if (searchParams.city) {
        query = query.eq('city', searchParams.city)
      }
      
      if (searchParams.state) {
        query = query.eq('state', searchParams.state)
      }
      
      if (searchParams.brokerage) {
        query = query.ilike('brokerage', `%${searchParams.brokerage}%`)
      }
      
      query = query
        .order('name')
        .range(searchParams.offset || 0, (searchParams.offset || 0) + (searchParams.limit || 10) - 1)
      
      const { data, error } = await query
      if (error) throw error
      
      agents = data || []
    }
    
    // Get total count for pagination (if needed)
    let totalCount = 0
    if (agents.length === (searchParams.limit || 10)) {
      let countQuery = supabase
        .from('agents')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
      
      if (searchParams.searchTerm) {
        const searchTerm = searchParams.searchTerm.trim()
        countQuery = countQuery.or(`name.ilike.%${searchTerm}%,mls_id.ilike.%${searchTerm}%,brokerage.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
      }
      
      if (searchParams.city) {
        countQuery = countQuery.eq('city', searchParams.city)
      }
      
      if (searchParams.state) {
        countQuery = countQuery.eq('state', searchParams.state)
      }
      
      if (searchParams.brokerage) {
        countQuery = countQuery.ilike('brokerage', `%${searchParams.brokerage}%`)
      }
      
      if (searchParams.mlsId) {
        countQuery = countQuery.eq('mls_id', searchParams.mlsId)
      }
      
      const { count } = await countQuery
      totalCount = count || 0
    }
    
    // Add computed fields and format response
    const formattedAgents = agents.map(agent => ({
      ...agent,
      displayName: agent.name,
      contactInfo: formatContactInfo(agent),
      isVerified: agent.is_verified || false,
      // Add ranking score if available from RPC call
      relevanceScore: agent.rank || 0
    }))
    
    console.log(`Found ${formattedAgents.length} agents`)
    
    return new Response(
      JSON.stringify({ 
        success: true,
        agents: formattedAgents,
        total: totalCount || formattedAgents.length,
        hasMore: formattedAgents.length === (searchParams.limit || 10),
        searchParams: searchParams
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
    
  } catch (error) {
    console.error('Search Agents Error:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        agents: []
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})

function formatContactInfo(agent: any): string {
  const parts = []
  
  if (agent.phone) {
    parts.push(formatPhoneNumber(agent.phone))
  }
  
  if (agent.email) {
    parts.push(agent.email)
  }
  
  if (agent.city && agent.state) {
    parts.push(`${agent.city}, ${agent.state}`)
  }
  
  return parts.join(' • ')
}

function formatPhoneNumber(phone: string): string {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '')
  
  // Format as (XXX) XXX-XXXX if it's a 10-digit number
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  
  // Return original if it doesn't match expected format
  return phone
}