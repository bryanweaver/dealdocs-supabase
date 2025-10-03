#!/usr/bin/env node

/**
 * Script to create a custom view in Datafiniti API
 * This view includes all necessary fields for DealDocs including legal description
 * 
 * Usage: node scripts/create-datafiniti-view.js
 */

const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

const API_KEY = process.env.VITE_DATAFINITY_API_KEY;
const API_URL = 'https://api.datafiniti.co/v4/views';

// Define the custom view configuration
const customView = {
  name: "dealdocs_property_complete",  // New view name to avoid conflicts
  data_type: "property",
  fields: [
    // Basic property information
    { name: "address" },
    { name: "city" },
    { name: "province" },
    { name: "postalCode" },
    { name: "county" },
    { name: "country" },
    
    // Property characteristics
    { name: "yearBuilt" },
    { name: "numBedroom" },
    { name: "numBathroom" },
    { name: "numFloor" },
    { name: "floorSizeValue" },
    { name: "floorSizeUnit" },
    { name: "lotSizeValue" },
    { name: "lotSizeUnit" },
    { name: "propertyType" },
    
    // Pricing and status
    { name: "mostRecentPriceAmount" },
    { name: "mostRecentPriceDate" },
    { name: "mostRecentStatus" },
    { name: "mostRecentStatusDate" },
    
    // Broker/Agent information
    { name: "mostRecentBrokerAgent" },
    { name: "mostRecentBrokerCompany" },
    { name: "mostRecentBrokerEmails" },
    { name: "mostRecentBrokerPhones" },
    
    // MLS and subdivision
    { name: "mlsNumber" },
    { name: "subdivision" },
    
    // Location data
    { name: "latitude" },
    { name: "longitude" },
    
    // Arrays of detailed information
    { name: "prices" },
    { name: "statuses" },
    { name: "descriptions" },
    { name: "brokers" },
    { name: "transactions" },
    { name: "people" },
    { name: "imageURLs" },
    
    // IMPORTANT: Features array contains legal description
    { name: "features" },
    
    // Owner information
    { name: "currentOwnerType" }
  ]
};

async function createCustomView() {
  if (!API_KEY) {
    console.error('❌ Error: VITE_DATAFINITY_API_KEY not found in .env.local');
    process.exit(1);
  }

  console.log('🚀 Creating new complete Datafiniti view...');
  console.log('📋 View name:', customView.name);
  console.log('📊 Number of fields:', customView.fields.length);
  console.log('✨ This new view includes the features field for legal descriptions!');

  try {
    // First, try to get existing views to check if it already exists
    const checkResponse = await axios.get(API_URL, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const existingViews = checkResponse.data.views || [];
    const viewExists = existingViews.some(view => view.name === customView.name);

    if (viewExists) {
      console.log('⚠️ View already exists. Will attempt to update or skip...');
      console.log('   Note: If this fails, the view already has all needed fields.');
    }
    
    // Always try to create new view
    {
      // Create new view
      const createResponse = await axios.post(
        API_URL,
        customView,
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Custom view created successfully!');
      console.log('📌 View details:', JSON.stringify(createResponse.data, null, 2));
    }

    console.log('\n📝 Important fields for legal description:');
    console.log('   - features array: Contains legalDescription, legalLotNumber1, legalBlock1');
    console.log('   - subdivision: May contain subdivision legal name');
    console.log('   - descriptions: May contain legal description in text');
    
    console.log('\n🎯 To use this view in your API calls:');
    console.log('   Add to your request body: { "view": "dealdocs_property_complete" }');
    console.log('\n📝 This view includes ALL fields needed for DealDocs:');
    console.log('   ✅ Features array (legal description, lot, block)');
    console.log('   ✅ Images (imageURLs)');
    console.log('   ✅ All property details');

  } catch (error) {
    console.error('❌ Error creating/updating custom view:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Message:', error.response.data?.message || error.response.statusText);
      console.error('   Details:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('   Error:', error.message);
    }
    process.exit(1);
  }
}

// Run the script
createCustomView();