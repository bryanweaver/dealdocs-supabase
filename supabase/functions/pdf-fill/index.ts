import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AnvilFillRequest {
  contractId: string
  templateId?: string
  options?: {
    fontSize?: number
    textColor?: string
  }
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { contractId, templateId, options = {} }: AnvilFillRequest = await req.json()
    
    if (!contractId) {
      throw new Error('Contract ID is required')
    }
    
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
    
    if (error) {
      console.error('Database error:', error)
      throw new Error(`Failed to fetch contract: ${error.message}`)
    }
    
    if (!contract) {
      throw new Error('Contract not found')
    }
    
    // Initialize Anvil API
    const anvilApiKey = Deno.env.get('ANVIL_API_KEY')
    if (!anvilApiKey) {
      throw new Error('Anvil API key not configured')
    }
    
    // Use provided template ID or default
    const formId = templateId || Deno.env.get('ANVIL_DEFAULT_TEMPLATE_ID')
    if (!formId) {
      throw new Error('No template ID provided and no default configured')
    }
    
    // Map contract data to PDF template format
    const pdfData = {
      title: `Contract_${contract.id}`,
      fontSize: options.fontSize || 10,
      textColor: options.textColor || '#333333',
      data: mapContractDataToPDF(contract)
    }
    
    console.log('Sending PDF fill request to Anvil...')
    
    // Generate PDF using Anvil API
    const anvilResponse = await fetch(`https://app.useanvil.com/api/v1/fill/${formId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${anvilApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pdfData)
    })
    
    if (!anvilResponse.ok) {
      const errorText = await anvilResponse.text()
      console.error('Anvil API error:', errorText)
      throw new Error(`Anvil API error: ${anvilResponse.status} - ${errorText}`)
    }
    
    const anvilResult = await anvilResponse.json()
    
    if (anvilResult.statusCode === 200 && anvilResult.data?.downloadURL) {
      // Store PDF URL in database
      const { error: updateError } = await supabase
        .from('contracts')
        .update({ 
          pdf_url: anvilResult.data.downloadURL,
          pdf_generated_at: new Date().toISOString()
        })
        .eq('id', contractId)
      
      if (updateError) {
        console.error('Failed to update contract with PDF URL:', updateError)
        // Don't throw here as the PDF was generated successfully
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          pdfUrl: anvilResult.data.downloadURL,
          contractId: contractId
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    } else {
      throw new Error(`PDF generation failed: ${JSON.stringify(anvilResult)}`)
    }
    
  } catch (error) {
    console.error('PDF Fill Error:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})

// Helper function to map contract data to PDF fields
function mapContractDataToPDF(contract: any) {
  const propertyInfo = contract.property_info || {}
  const parties = contract.parties || {}
  const financialDetails = contract.financial_details || {}
  const titleClosing = contract.title_closing || {}
  const legalSections = contract.legal_sections || {}
  
  return {
    // Property Information
    property_address: propertyInfo.address || '',
    city: propertyInfo.city || '',
    county: propertyInfo.county || '',
    state: propertyInfo.state || 'TX',
    zip_code: propertyInfo.zipCode || '',
    mls_number: propertyInfo.mlsNumber || '',
    legal_description: propertyInfo.legalDescription || '',
    
    // Buyer Information
    buyer_name: parties.primaryBuyer?.name || parties.buyer?.name || '',
    buyer_email: parties.primaryBuyer?.email || parties.buyer?.email || '',
    buyer_phone: parties.primaryBuyer?.phone || parties.buyer?.phone || '',
    buyer_address: parties.primaryBuyer?.address || parties.buyer?.address || '',
    
    // Secondary Buyer (if exists)
    buyer2_name: parties.secondaryBuyer?.name || '',
    buyer2_email: parties.secondaryBuyer?.email || '',
    
    // Seller Information
    seller_name: parties.primarySeller?.name || parties.seller?.name || '',
    seller_email: parties.primarySeller?.email || parties.seller?.email || '',
    seller_phone: parties.primarySeller?.phone || parties.seller?.phone || '',
    seller_address: parties.primarySeller?.address || parties.seller?.address || '',
    
    // Secondary Seller (if exists)
    seller2_name: parties.secondarySeller?.name || '',
    seller2_email: parties.secondarySeller?.email || '',
    
    // Financial Information
    purchase_price: formatCurrency(financialDetails.purchasePrice),
    earnest_money: formatCurrency(financialDetails.earnestMoney),
    down_payment: formatCurrency(financialDetails.downPayment),
    loan_amount: formatCurrency(financialDetails.loanAmount),
    option_fee: formatCurrency(financialDetails.optionFee),
    
    // Dates
    contract_date: formatDate(contract.contract_date),
    effective_date: formatDate(financialDetails.effectiveDate),
    closing_date: formatDate(financialDetails.closingDate),
    option_period_end: formatDate(financialDetails.optionPeriodEnd),
    
    // Title and Closing
    title_company: titleClosing.titleCompany?.name || '',
    title_company_address: titleClosing.titleCompany?.address || '',
    escrow_officer: titleClosing.escrowOfficer || '',
    
    // Additional fields can be added based on your specific form requirements
    survey_required: legalSections.surveyRequired ? 'Yes' : 'No',
    inspection_period: financialDetails.inspectionPeriod || '',
    
    // Contract terms
    financing_type: financialDetails.financingType || '',
    loan_type: financialDetails.loanType || '',
    interest_rate: financialDetails.interestRate || '',
    
    // Property details
    year_built: propertyInfo.yearBuilt || '',
    square_feet: propertyInfo.squareFeet || '',
    lot_size: propertyInfo.lotSize || '',
    bedrooms: propertyInfo.bedrooms || '',
    bathrooms: propertyInfo.bathrooms || '',
  }
}

// Helper function to format currency
function formatCurrency(amount: any): string {
  if (!amount) return ''
  const num = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]/g, '')) : amount
  return isNaN(num) ? '' : num.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

// Helper function to format dates
function formatDate(dateString: any): string {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? '' : date.toLocaleDateString('en-US')
  } catch {
    return ''
  }
}