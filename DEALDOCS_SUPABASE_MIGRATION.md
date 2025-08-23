# DealDocs Amplify → Supabase Migration Plan
## In-Place Backend Replacement Strategy

Since the Supabase starter is Next.js, we'll copy your existing Vue app and replace only the backend. This approach minimizes frontend changes while swapping out AWS services.

---

## Project Setup Strategy

```bash
# Directory structure
C:\projects\
  ├── dealdocs\              # Original Amplify project (keep as reference)
  └── dealdocs-supabase\     # Copy of Vue app with Supabase backend
```

### Initial Setup Commands

```bash
# 1. Copy entire project
cd C:\projects
xcopy dealdocs dealdocs-supabase /E /I /H

# 2. Go to new project
cd dealdocs-supabase

# 3. Remove Amplify artifacts
rmdir /S /Q amplify
del aws-exports.js
del .graphqlconfig.yml

# 4. Remove AWS dependencies
npm uninstall aws-amplify @aws-amplify/ui-vue aws-sdk

# 5. Install Supabase
npm install @supabase/supabase-js @supabase/auth-helpers-vue

# 6. Initialize Supabase
npx supabase init
```

---

## Phase 1: Backend Setup (Day 1-2)

### 1.1 Create Supabase Project

```bash
# Create new project at https://app.supabase.com
# Note your project URL and anon key

# Create .env.local
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxxx
VITE_SUPABASE_SERVICE_KEY=eyJxxxxx  # For admin operations
```

### 1.2 Database Schema Setup

Create these files in your new project:

```sql
-- supabase/migrations/001_initial_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Contracts table (main table)
CREATE TABLE contracts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  legacy_id TEXT UNIQUE, -- Store original Amplify ID for reference
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Status fields
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Form sections (matching Vuex store structure exactly)
  property_info JSONB DEFAULT '{}'::JSONB,
  parties JSONB DEFAULT '{}'::JSONB,
  financial_details JSONB DEFAULT '{}'::JSONB,
  title_closing JSONB DEFAULT '{}'::JSONB,
  legal_sections JSONB DEFAULT '{}'::JSONB,
  additional_info JSONB DEFAULT '{}'::JSONB,
  
  -- Progress tracking
  progress JSONB DEFAULT '{}'::JSONB,
  marked_questions TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Searchable fields (extracted for indexing)
  mls_number TEXT,
  property_address TEXT,
  buyer_name TEXT,
  seller_name TEXT,
  contract_date DATE
);

-- Indexes for performance
CREATE INDEX idx_contracts_user ON contracts(user_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_mls ON contracts(mls_number);
CREATE INDEX idx_contracts_created ON contracts(created_at DESC);
CREATE INDEX idx_contracts_property_gin ON contracts USING GIN (property_info);
CREATE INDEX idx_contracts_parties_gin ON contracts USING GIN (parties);

-- Etch Packets (e-signature tracking)
CREATE TABLE etch_packets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  etch_packet_id TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending',
  signer_info JSONB DEFAULT '{}'::JSONB,
  pdf_url TEXT,
  signed_pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Email Packets (email tracking)
CREATE TABLE email_packets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  email_type TEXT, -- 'listing_agent', 'buyer', 'seller'
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  opened_at TIMESTAMPTZ,
  status TEXT DEFAULT 'sent',
  ses_message_id TEXT
);

-- Agents table (listing agents database)
CREATE TABLE agents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  mls_id TEXT UNIQUE,
  brokerage TEXT,
  license_number TEXT,
  address TEXT,
  city TEXT,
  state TEXT DEFAULT 'TX',
  zip TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Full text search for agents
ALTER TABLE agents ADD COLUMN search_vector tsvector 
  GENERATED ALWAYS AS (
    to_tsvector('english', 
      coalesce(name, '') || ' ' || 
      coalesce(email, '') || ' ' || 
      coalesce(brokerage, '') || ' ' ||
      coalesce(mls_id, '')
    )
  ) STORED;

CREATE INDEX idx_agents_search ON agents USING GIN(search_vector);

-- Contract documents/files
CREATE TABLE contract_documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  storage_path TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  uploaded_by UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE etch_packets ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_packets ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can CRUD own contracts" ON contracts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own etch packets" ON etch_packets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM contracts 
      WHERE contracts.id = etch_packets.contract_id 
      AND contracts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own email packets" ON email_packets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM contracts 
      WHERE contracts.id = email_packets.contract_id 
      AND contracts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own documents" ON contract_documents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM contracts 
      WHERE contracts.id = contract_documents.contract_id 
      AND contracts.user_id = auth.uid()
    )
  );

-- Public read for agents table
CREATE POLICY "Anyone can read agents" ON agents
  FOR SELECT USING (true);

-- Create update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_contracts_updated_at
  BEFORE UPDATE ON contracts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON agents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

### 1.3 Run Migration

```bash
# Apply migration
npx supabase db push

# Or if using Supabase CLI
supabase db push
```

---

## Phase 2: Core Service Layer (Day 3-4)

### 2.1 Create Supabase Client

```javascript
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})

// Helper for authenticated requests
export const getUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
```

### 2.2 Create API Service Layer

Replace Amplify API calls with Supabase. Create a compatibility layer to minimize changes:

```javascript
// src/services/api.js
// This file maps old Amplify patterns to Supabase

import { supabase } from '@/lib/supabase'

// Contract Operations (replacing GraphQL)
export const ContractAPI = {
  async create(contractData) {
    const user = await getUser()
    
    const { data, error } = await supabase
      .from('contracts')
      .insert({
        ...contractData,
        user_id: user.id,
        legacy_id: contractData.id // Keep old ID for reference
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
      .from('contracts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    
    if (filters.limit) {
      query = query.limit(filters.limit)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase
      .from('contracts')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  }
}

// Agent Search (replacing Lambda)
export const AgentAPI = {
  async search(searchTerm) {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .textSearch('search_vector', searchTerm)
      .limit(10)
    
    if (error) throw error
    return data
  },

  async getByMlsId(mlsId) {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('mls_id', mlsId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  }
}

// Storage Operations (replacing S3)
export const StorageAPI = {
  async upload(file, path) {
    const { data, error } = await supabase.storage
      .from('contracts')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (error) throw error
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('contracts')
      .getPublicUrl(path)
    
    return publicUrl
  },

  async download(path) {
    const { data, error } = await supabase.storage
      .from('contracts')
      .download(path)
    
    if (error) throw error
    return data
  },

  async delete(paths) {
    const { error } = await supabase.storage
      .from('contracts')
      .remove(paths)
    
    if (error) throw error
    return true
  },

  async list(folder) {
    const { data, error } = await supabase.storage
      .from('contracts')
      .list(folder)
    
    if (error) throw error
    return data
  }
}
```

---

## Phase 3: Authentication Layer (Day 5)

### 3.1 Update Auth Service

```javascript
// src/services/auth.js
import { supabase } from '@/lib/supabase'

export const AuthService = {
  async signUp(email, password, metadata = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    
    if (error) throw error
    return data
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    
    if (error) throw error
  },

  async updatePassword(newPassword) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })
    
    if (error) throw error
  },

  async getSession() {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  },

  async getUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }
}
```

### 3.2 Update Vuex Auth Module

```javascript
// src/store/modules/auth.js
import { AuthService } from '@/services/auth'
import { supabase } from '@/lib/supabase'

const state = {
  user: null,
  session: null,
  loading: false,
  error: null
}

const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
  SET_SESSION(state, session) {
    state.session = session
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

const actions = {
  async initAuth({ commit }) {
    // Set up auth listener
    supabase.auth.onAuthStateChange((event, session) => {
      commit('SET_SESSION', session)
      commit('SET_USER', session?.user || null)
      
      if (event === 'SIGNED_OUT') {
        // Clear any cached data
        localStorage.removeItem('contractFormData')
      }
    })
    
    // Check initial session
    const session = await AuthService.getSession()
    commit('SET_SESSION', session)
    commit('SET_USER', session?.user || null)
  },

  async signIn({ commit }, { email, password }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    try {
      const { user, session } = await AuthService.signIn(email, password)
      commit('SET_USER', user)
      commit('SET_SESSION', session)
      return { success: true }
    } catch (error) {
      commit('SET_ERROR', error.message)
      return { success: false, error: error.message }
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async signOut({ commit }) {
    await AuthService.signOut()
    commit('SET_USER', null)
    commit('SET_SESSION', null)
  }
}

const getters = {
  isAuthenticated: state => !!state.session,
  currentUser: state => state.user,
  authError: state => state.error
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
```

---

## Phase 4: Update Vue Components (Day 6-7)

### 4.1 Main App Setup

```javascript
// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import { supabase } from '@/lib/supabase'

const app = createApp(App)

// Initialize auth before mounting
store.dispatch('auth/initAuth').then(() => {
  app.use(store)
  app.use(router)
  app.mount('#app')
})

// Make supabase available globally (optional)
app.config.globalProperties.$supabase = supabase
```

### 4.2 Update Router Guards

```javascript
// src/router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'
import { supabase } from '@/lib/supabase'

// ... routes definition ...

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  if (requiresAuth) {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  } else {
    next()
  }
})
```

### 4.3 Update Component Example

```javascript
// src/components/ContractForm.vue
<script setup>
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { ContractAPI } from '@/services/api'

const store = useStore()
const loading = ref(false)
const error = ref(null)

// Get form data from Vuex (no changes needed here!)
const formData = computed(() => store.state.contract)

const saveContract = async () => {
  loading.value = true
  error.value = null
  
  try {
    // OLD Amplify code:
    // const result = await API.graphql(
    //   graphqlOperation(createContract, { input: formData.value })
    // )
    
    // NEW Supabase code:
    const result = await ContractAPI.create(formData.value)
    
    // Update store with new ID
    store.commit('contract/SET_CONTRACT_ID', result.id)
    
    // Show success message
    store.dispatch('notifications/show', {
      message: 'Contract saved successfully',
      type: 'success'
    })
  } catch (err) {
    error.value = err.message
    console.error('Save error:', err)
  } finally {
    loading.value = false
  }
}

// Load existing contract
const loadContract = async (id) => {
  loading.value = true
  
  try {
    // OLD: const result = await API.graphql(...)
    // NEW:
    const contract = await ContractAPI.get(id)
    
    // Populate store with contract data
    store.commit('contract/SET_CONTRACT_DATA', contract)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>
```

---

## Phase 5: Lambda to Edge Functions (Day 8-9)

### 5.1 Create Edge Functions

```bash
# Create functions directory
mkdir -p supabase/functions

# Create individual function folders
mkdir supabase/functions/pdf-fill
mkdir supabase/functions/pdf-esign
mkdir supabase/functions/send-email
mkdir supabase/functions/search-agents
```

### 5.2 PDF Generation Function

```typescript
// supabase/functions/pdf-fill/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Anvil from 'https://esm.sh/@anvilco/anvil@3.3.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { contractId } = await req.json()
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Get contract data
    const { data: contract, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', contractId)
      .single()
    
    if (error) throw error
    
    // Initialize Anvil
    const anvilApiKey = Deno.env.get('ANVIL_API_KEY')!
    const anvil = new Anvil({ apiKey: anvilApiKey })
    
    // Map contract data to PDF template
    const pdfData = {
      title: `Contract_${contract.id}`,
      fontSize: 10,
      textColor: '#333333',
      data: {
        // Property Information
        property_address: contract.property_info?.address,
        city: contract.property_info?.city,
        county: contract.property_info?.county,
        mls_number: contract.property_info?.mlsNumber,
        
        // Parties
        buyer_name: contract.parties?.buyer?.name,
        buyer_email: contract.parties?.buyer?.email,
        seller_name: contract.parties?.seller?.name,
        seller_email: contract.parties?.seller?.email,
        
        // Financial
        purchase_price: contract.financial_details?.purchasePrice,
        earnest_money: contract.financial_details?.earnestMoney,
        down_payment: contract.financial_details?.downPayment,
        
        // Add all other fields from your form
      }
    }
    
    // Generate PDF using Anvil
    const { statusCode, data } = await anvil.fillPDF(
      Deno.env.get('ANVIL_TEMPLATE_ID')!,
      pdfData
    )
    
    if (statusCode === 200) {
      // Store PDF URL in database
      await supabase
        .from('contracts')
        .update({ 
          pdf_url: data.downloadURL,
          pdf_generated_at: new Date().toISOString()
        })
        .eq('id', contractId)
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          pdfUrl: data.downloadURL 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }
    
    throw new Error('PDF generation failed')
    
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
```

### 5.3 Email Sending Function

```typescript
// supabase/functions/send-email/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { contractId, recipientEmail, emailType } = await req.json()
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )
    
    // Get contract with PDF
    const { data: contract } = await supabase
      .from('contracts')
      .select('*, etch_packets(*)')
      .eq('id', contractId)
      .single()
    
    // Use Resend API (or your preferred email service)
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
    
    const emailHtml = `
      <h2>Contract Package Ready</h2>
      <p>Property: ${contract.property_info?.address}</p>
      <p>MLS: ${contract.property_info?.mlsNumber}</p>
      <a href="${contract.pdf_url}">Download Contract PDF</a>
    `
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'contracts@dealdocs.com',
        to: recipientEmail,
        subject: 'Real Estate Contract Package',
        html: emailHtml
      })
    })
    
    const emailResult = await response.json()
    
    // Log email in database
    await supabase
      .from('email_packets')
      .insert({
        contract_id: contractId,
        recipient_email: recipientEmail,
        email_type: emailType,
        ses_message_id: emailResult.id
      })
    
    return new Response(
      JSON.stringify({ success: true, messageId: emailResult.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
    
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
```

---

## Phase 6: Frontend Service Updates (Day 10)

### 6.1 Update All API Calls

Create a migration helper to make updates easier:

```javascript
// src/services/migration-helper.js

// This file helps map old Amplify patterns to new Supabase patterns
// Use this as a reference when updating components

export const MigrationMap = {
  // Auth
  'Auth.signIn': 'AuthService.signIn',
  'Auth.signUp': 'AuthService.signUp',
  'Auth.signOut': 'AuthService.signOut',
  'Auth.currentAuthenticatedUser': 'AuthService.getUser',
  'Auth.currentSession': 'AuthService.getSession',
  
  // API - GraphQL to REST
  'API.graphql(graphqlOperation(createContract))': 'ContractAPI.create',
  'API.graphql(graphqlOperation(updateContract))': 'ContractAPI.update',
  'API.graphql(graphqlOperation(deleteContract))': 'ContractAPI.delete',
  'API.graphql(graphqlOperation(getContract))': 'ContractAPI.get',
  'API.graphql(graphqlOperation(listContracts))': 'ContractAPI.list',
  
  // Storage
  'Storage.put': 'StorageAPI.upload',
  'Storage.get': 'StorageAPI.download',
  'Storage.remove': 'StorageAPI.delete',
  'Storage.list': 'StorageAPI.list',
}

// Quick regex patterns for find/replace
export const FindReplacePatterns = [
  {
    find: /import.*from ['"]aws-amplify['"]/g,
    replace: "import { supabase } from '@/lib/supabase'"
  },
  {
    find: /import.*from ['"]@aws-amplify\/ui-vue['"]/g,
    replace: "// Removed Amplify UI import"
  },
  {
    find: /API\.graphql\(/g,
    replace: "// TODO: Replace with Supabase call - "
  }
]
```

### 6.2 Batch Update Script

```javascript
// scripts/update-imports.js
// Run this to help identify all files that need updating

const fs = require('fs')
const path = require('path')
const glob = require('glob')

function findAmplifyImports() {
  const files = glob.sync('src/**/*.{js,vue,ts}', {
    ignore: 'node_modules/**'
  })
  
  const results = []
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8')
    
    // Check for Amplify imports
    if (content.includes('aws-amplify') || 
        content.includes('API.graphql') ||
        content.includes('Auth.') ||
        content.includes('Storage.')) {
      
      const lines = content.split('\n')
      const amplifyLines = []
      
      lines.forEach((line, index) => {
        if (line.includes('aws-amplify') || 
            line.includes('API.graphql') ||
            line.includes('Auth.') ||
            line.includes('Storage.')) {
          amplifyLines.push({
            lineNumber: index + 1,
            content: line.trim()
          })
        }
      })
      
      results.push({
        file: file,
        amplifyUsage: amplifyLines
      })
    }
  })
  
  // Write results to file
  fs.writeFileSync(
    'amplify-usage-report.json',
    JSON.stringify(results, null, 2)
  )
  
  console.log(`Found ${results.length} files with Amplify dependencies`)
  console.log('Report saved to amplify-usage-report.json')
}

findAmplifyImports()
```

---

## Phase 7: Data Migration (Day 11)

### 7.1 Export Amplify Data

```javascript
// scripts/export-amplify-data.js
const AWS = require('aws-sdk')
const fs = require('fs')

AWS.config.update({ region: 'us-east-1' })

const dynamodb = new AWS.DynamoDB.DocumentClient()
const cognito = new AWS.CognitoIdentityServiceProvider()

async function exportData() {
  // Export contracts
  const contracts = []
  let lastEvaluatedKey = null
  
  do {
    const params = {
      TableName: 'Contract-xxxxx-dev', // Your table name
      ExclusiveStartKey: lastEvaluatedKey
    }
    
    const result = await dynamodb.scan(params).promise()
    contracts.push(...result.Items)
    lastEvaluatedKey = result.LastEvaluatedKey
  } while (lastEvaluatedKey)
  
  fs.writeFileSync('export/contracts.json', JSON.stringify(contracts, null, 2))
  console.log(`Exported ${contracts.length} contracts`)
  
  // Export users
  const users = []
  const userPoolId = 'us-east-1_xxxxx' // Your user pool ID
  
  const userResult = await cognito.listUsers({
    UserPoolId: userPoolId,
    Limit: 60
  }).promise()
  
  users.push(...userResult.Users)
  
  fs.writeFileSync('export/users.json', JSON.stringify(users, null, 2))
  console.log(`Exported ${users.length} users`)
}

exportData().catch(console.error)
```

### 7.2 Import to Supabase

```javascript
// scripts/import-to-supabase.js
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

async function importData() {
  // Import users first
  const users = JSON.parse(fs.readFileSync('export/users.json', 'utf8'))
  const userMapping = {}
  
  for (const cognitoUser of users) {
    const email = cognitoUser.Attributes.find(a => a.Name === 'email')?.Value
    
    if (email) {
      // Create user in Supabase
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        email_confirm: true,
        password: Math.random().toString(36).slice(-12), // Temp password
        user_metadata: {
          cognito_id: cognitoUser.Username,
          cognito_sub: cognitoUser.Attributes.find(a => a.Name === 'sub')?.Value
        }
      })
      
      if (!error) {
        userMapping[cognitoUser.Username] = data.user.id
        console.log(`Created user: ${email}`)
      }
    }
  }
  
  // Import contracts
  const contracts = JSON.parse(fs.readFileSync('export/contracts.json', 'utf8'))
  
  for (const contract of contracts) {
    const supabaseUserId = userMapping[contract.userId] || null
    
    const { error } = await supabase
      .from('contracts')
      .insert({
        legacy_id: contract.id,
        user_id: supabaseUserId,
        property_info: contract.propertyInfo || {},
        parties: contract.parties || {},
        financial_details: contract.financialDetails || {},
        title_closing: contract.titleClosing || {},
        legal_sections: contract.legalSections || {},
        additional_info: contract.additionalInfo || {},
        progress: contract.progress || {},
        marked_questions: contract.markedQuestions || [],
        status: contract.status || 'draft',
        mls_number: contract.propertyInfo?.mlsNumber,
        property_address: contract.propertyInfo?.address,
        created_at: contract.createdAt,
        updated_at: contract.updatedAt
      })
    
    if (!error) {
      console.log(`Imported contract: ${contract.id}`)
    } else {
      console.error(`Error importing contract ${contract.id}:`, error)
    }
  }
  
  console.log('Import complete!')
}

importData().catch(console.error)
```

---

## Phase 8: Testing & Validation (Day 12-13)

### 8.1 Update Test Suite

```javascript
// src/__tests__/services/api.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ContractAPI } from '@/services/api'
import { supabase } from '@/lib/supabase'

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn()
    }))
  }
}))

describe('ContractAPI', () => {
  it('should create a contract', async () => {
    const mockContract = { id: '123', property_info: { address: '123 Main St' }}
    
    supabase.from().insert().select().single.mockResolvedValue({
      data: mockContract,
      error: null
    })
    
    const result = await ContractAPI.create(mockContract)
    expect(result).toEqual(mockContract)
  })
})
```

### 8.2 E2E Test Updates

```javascript
// src/tests/e2e/contract-flow.spec.js
import { test, expect } from '@playwright/test'

test.describe('Contract Creation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login with Supabase
    await page.goto('/login')
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'testpass123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
  })
  
  test('should create a new contract', async ({ page }) => {
    await page.goto('/contracts/new')
    
    // Fill property info
    await page.fill('[name="propertyAddress"]', '123 Test St')
    await page.fill('[name="mlsNumber"]', 'MLS123456')
    
    // Save
    await page.click('button:has-text("Save Contract")')
    
    // Verify saved
    await expect(page.locator('.success-message')).toContainText('saved')
  })
})
```

---

## Phase 9: Deployment (Day 14)

### 9.1 Environment Setup

```bash
# Production environment variables
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 9.2 Deploy Edge Functions

```bash
# Deploy all functions
supabase functions deploy pdf-fill
supabase functions deploy pdf-esign  
supabase functions deploy send-email
supabase functions deploy search-agents

# Set secrets
supabase secrets set ANVIL_API_KEY=your-key
supabase secrets set RESEND_API_KEY=your-key
```

### 9.3 Build and Deploy Frontend

```bash
# Build for production
npm run build

# Deploy to your hosting platform
# Option 1: Vercel
vercel --prod

# Option 2: Netlify
netlify deploy --prod

# Option 3: AWS S3 + CloudFront (if staying on AWS)
aws s3 sync dist/ s3://your-bucket --delete
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

---

## LLM Reference Guide for Migration

### How to Use This Document with an LLM:

1. **Initial Setup Session:**
```
"I'm migrating a Vue 3 + AWS Amplify app to Supabase. 
The original is at C:\projects\dealdocs
The new copy is at C:\projects\dealdocs-supabase

Please read:
- C:\projects\dealdocs\CLAUDE.md (understand the app)
- C:\projects\DEALDOCS_SUPABASE_MIGRATION.md (this file)

Then help me with Phase 1: Backend Setup"
```

2. **Component Migration Session:**
```
"I need to migrate the ContractForm component.
Original: C:\projects\dealdocs\src\components\ContractForm.vue
Target: C:\projects\dealdocs-supabase\src\components\ContractForm.vue

Replace all Amplify API calls with Supabase using the patterns in Phase 4.3
Keep all business logic identical."
```

3. **Lambda to Edge Function:**
```
"Convert the Lambda function at:
C:\projects\dealdocs\amplify\backend\function\anvilPdfFill\src\index.js

To a Supabase Edge Function at:
C:\projects\dealdocs-supabase\supabase\functions\pdf-fill\index.ts

Use the template in Phase 5.2"
```

4. **Testing Migration:**
```
"Update the test file:
C:\projects\dealdocs\src\__tests__\ContractForm.test.js

For the new Supabase version at:
C:\projects\dealdocs-supabase\src\__tests__\ContractForm.test.js

Use the mocking patterns from Phase 8.1"
```

### Key Files to Reference:

**Original Amplify Project:**
- `/src/API.ts` - Generated GraphQL types
- `/src/graphql/*` - GraphQL queries/mutations
- `/amplify/backend/api/dealdocs/schema.graphql` - Data model
- `/amplify/backend/function/*/src/index.js` - Lambda functions
- `/src/store/store.ts` - Vuex store structure

**New Supabase Project:**
- `/src/lib/supabase.js` - Supabase client
- `/src/services/api.js` - API compatibility layer
- `/supabase/migrations/*.sql` - Database schema
- `/supabase/functions/*/index.ts` - Edge functions

### Migration Checklist:

- [ ] Copy project and remove Amplify artifacts
- [ ] Set up Supabase project and database
- [ ] Create service layer for API compatibility
- [ ] Update authentication
- [ ] Migrate Lambda functions to Edge Functions
- [ ] Update all Vue components
- [ ] Migrate existing data
- [ ] Update tests
- [ ] Deploy and verify

### Common Patterns to Replace:

```javascript
// FIND: import { API, graphqlOperation } from 'aws-amplify'
// REPLACE: import { ContractAPI } from '@/services/api'

// FIND: await API.graphql(graphqlOperation(createContract, { input: data }))
// REPLACE: await ContractAPI.create(data)

// FIND: await Auth.signIn(email, password)
// REPLACE: await AuthService.signIn(email, password)

// FIND: await Storage.put(key, file)
// REPLACE: await StorageAPI.upload(file, key)
```

This migration plan maintains your Vue frontend while completely replacing the AWS backend with Supabase, giving you a modern, cost-effective backend with minimal frontend changes.