#!/usr/bin/env node

/**
 * Script to check what fields are included in the existing Datafiniti custom view
 * 
 * Usage: node scripts/check-datafiniti-view.js
 */

const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

const API_KEY = process.env.VITE_DATAFINITY_API_KEY;
const VIEW_API_URL = 'https://api.datafiniti.co/v4/views';
const PROPERTY_API_URL = process.env.VITE_DATAFINITY_API_URL || 'https://api.datafiniti.co/v4/properties/search';

async function checkView() {
  if (!API_KEY) {
    console.error('❌ Error: VITE_DATAFINITY_API_KEY not found in .env.local');
    process.exit(1);
  }

  // Check for the view name passed as argument or default
  const viewName = process.argv[2] || 'dealdocs_property_view';
  console.log(`🔍 Checking Datafiniti custom view: ${viewName}\n`);

  try {
    // Get specific view details
    console.log('📋 Fetching view details...');
    try {
      const viewResponse = await axios.get(`${VIEW_API_URL}/${viewName}`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (viewResponse.data) {
        console.log('✅ Found view "dealdocs_property_view"');
        handleViewDetails(viewResponse.data);
      }
    } catch (viewError) {
      if (viewError.response?.status === 404) {
        console.log('❌ View "dealdocs_property_view" not found!');
        console.log('   You need to create it first using create-datafiniti-view.js');
        return;
      }
      throw viewError;
    }

    // Test the view with a sample query
    await testViewWithSample(viewName);

  } catch (error) {
    console.error('❌ Error checking view:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Message:', error.response.data?.message || error.response.statusText);
      if (error.response.data?.errors) {
        console.error('   Errors:', error.response.data.errors);
      }
    } else {
      console.error('   Error:', error.message);
    }
  }
}

function handleViewDetails(view) {
  console.log('\n📊 View Details:');
  console.log('   Name:', view.name || 'dealdocs_property_view');
  console.log('   Data Type:', view.data_type || 'Not specified');
  
  if (view.fields && Array.isArray(view.fields)) {
    console.log('   Number of fields:', view.fields.length);
    
    // Check for legal description related fields
    const legalFields = view.fields.filter(field => {
      const fieldName = typeof field === 'string' ? field : field.name || field.field || '';
      return fieldName.toLowerCase().includes('legal') ||
        fieldName.toLowerCase().includes('lot') ||
        fieldName.toLowerCase().includes('block') ||
        fieldName === 'features' ||
        fieldName === 'subdivision' ||
        fieldName === 'taxAssessments';
    });

    console.log('\n🎯 Legal Description Related Fields:');
    if (legalFields.length > 0) {
      legalFields.forEach(field => {
        const fieldName = typeof field === 'string' ? field : field.name || field.field || JSON.stringify(field);
        console.log(`   ✅ ${fieldName}`);
      });
    } else {
      console.log('   ⚠️ No direct legal description fields found');
    }

    // Check if features array is included
    const fieldNames = view.fields.map(f => typeof f === 'string' ? f : f.name || f.field || '');
    if (fieldNames.includes('features')) {
      console.log('\n   ✅ IMPORTANT: "features" field is included!');
      console.log('      This array typically contains:');
      console.log('      - legalDescription');
      console.log('      - legalLotNumber1');
      console.log('      - legalBlock1');
      console.log('      - legalSubdivision');
    } else {
      console.log('\n   ❌ WARNING: "features" field is NOT included!');
      console.log('      Legal description data may be missing!');
    }

    console.log('\n📋 All fields in view:');
    view.fields.forEach((field, index) => {
      const fieldName = typeof field === 'string' ? field : field.name || field.field || JSON.stringify(field);
      console.log(`   ${index + 1}. ${fieldName}`);
    });
  } else {
    console.log('   ⚠️ No fields information available');
  }
}

async function testViewWithSample(viewName) {
  console.log('\n🧪 Testing view with sample property query...');
  
  const testQuery = 'address:"4438 Jefferson St" AND city:"Deer Park" AND province:"TX"';
  
  try {
    const testResponse = await axios.post(
      PROPERTY_API_URL,
      {
        query: testQuery,
        format: "JSON",
        num_records: 1,
        download: false,
        view: viewName  // Use the view name passed or default
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (testResponse.data.num_found > 0 && testResponse.data.records?.length > 0) {
      const record = testResponse.data.records[0];
      
      console.log('\n✅ Sample property returned successfully!');
      console.log('   Address:', record.address);
      console.log('   City:', record.city);
      console.log('   Subdivision:', record.subdivision || 'Not provided');
      
      console.log('\n🔍 Checking for legal description data:');
      
      // Check for features
      if (record.features && Array.isArray(record.features)) {
        console.log('   ✅ Features array present with', record.features.length, 'items');
        
        const legalFeatures = record.features.filter(f => 
          f.key && (
            f.key.toLowerCase().includes('legal') ||
            f.key === 'lotNumber' ||
            f.key === 'lot' ||
            f.key === 'block'
          )
        );
        
        if (legalFeatures.length > 0) {
          console.log('\n   📋 Legal features found:');
          legalFeatures.forEach(feature => {
            console.log(`      - ${feature.key}: ${JSON.stringify(feature.value)}`);
          });
        } else {
          console.log('   ⚠️ No legal features in this property\'s features array');
          
          // Show first few features as example
          if (record.features.length > 0) {
            console.log('\n   Example features in this property:');
            record.features.slice(0, 5).forEach(feature => {
              console.log(`      - ${feature.key}: ${JSON.stringify(feature.value).substring(0, 50)}...`);
            });
          }
        }
      } else {
        console.log('   ❌ No features array in response - VIEW MAY NOT INCLUDE FEATURES FIELD!');
      }
      
      // Check for descriptions that might contain legal info
      if (record.descriptions && Array.isArray(record.descriptions)) {
        const legalDesc = record.descriptions.find(d => 
          d.value && (
            d.value.includes('BLOCK') || 
            d.value.includes('LOT') ||
            d.value.includes('Section') ||
            d.value.includes('Block') ||
            d.value.includes('Lot')
          )
        );
        if (legalDesc) {
          console.log('\n   ✅ Possible legal description in descriptions:');
          console.log('      "' + legalDesc.value.substring(0, 150) + '..."');
        }
      }
      
      // Summary
      console.log('\n📦 Fields present in response:');
      const fieldSummary = Object.keys(record).map(key => {
        const value = record[key];
        if (value === null || value === undefined) return `${key}: null`;
        if (Array.isArray(value)) return `${key}: [Array with ${value.length} items]`;
        if (typeof value === 'object') return `${key}: [Object]`;
        return `${key}: ${String(value).substring(0, 30)}${String(value).length > 30 ? '...' : ''}`;
      });
      
      fieldSummary.forEach(field => console.log(`   - ${field}`));
      
    } else {
      console.log('⚠️ No test property found with the sample query');
    }
  } catch (error) {
    console.error('❌ Error testing view with sample:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Message:', error.response.data?.message || error.response.statusText);
    } else {
      console.error('   Error:', error.message);
    }
  }
}

// Run the script
checkView();