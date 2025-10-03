# Datafiniti Property API Integration

## Overview
This document describes how DealDocs integrates with Datafiniti's Property API to fetch property data including legal descriptions, lot numbers, and block numbers for Texas real estate contracts.

## Custom View: `dealdocs_property_complete`

We use a custom Datafiniti view that includes all necessary fields for property data, especially the `features` array which contains legal description information. This view was created specifically to include the features field that was missing from the original view.

### Key Fields for Legal Description

The legal description data can be found in multiple places:

1. **Features Array** (Most Common)
   - `legalDescription` - Full legal description
   - `legalLotNumber1` - Lot number
   - `legalBlock1` - Block number
   - `legalSubdivision` - Subdivision legal name
   - `legalSection` - Section number
   - `legalTownship` - Township
   - `legalRange` - Range

2. **Root Level Fields**
   - `subdivision` - May contain subdivision name
   - `descriptions` - Array that may contain legal description in text

3. **Tax Assessments**
   - May contain legal parcel information

## Implementation Details

### API Call (PropertyData.vue)
```javascript
const response = await axios.post(
  propertyEndpoint,
  {
    query,
    format: "JSON",
    num_records: 1,
    download: false,
    view: "dealdocs_property_complete"  // Custom view with all fields including features
  },
  {
    headers: {
      Authorization: `Bearer ${apikey}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  },
);
```

### Data Mapping (dataMapUtils.ts)
The `mapDatafinityResponseToPropertyData` function:
1. First checks the `features` array for legal fields
2. Falls back to root-level `legalDescription` if available
3. Searches `descriptions` array for legal description patterns
4. Uses `subdivision` as a last resort for legal description

### Example Response Structure
```json
{
  "address": "4438 Jefferson St",
  "city": "Deer Park",
  "subdivision": "HERITAGE ADD",
  "features": [
    {
      "key": "legalLotNumber1",
      "value": ["16"]
    },
    {
      "key": "legalBlock1", 
      "value": ["1"]
    },
    {
      "key": "legalDescription",
      "value": ["S835100 - RIVERWOOD AT OAKHURST 01, BLOCK 1, LOT 16"]
    }
  ]
}
```

## Managing the Custom View

### Creating/Updating the View
Run the script: `node scripts/create-datafiniti-view.js`

This script will:
- Check if the view exists
- Create or update the view with all necessary fields
- Include the `features` array which contains legal description data

### View Configuration
The view includes 36 fields covering:
- Basic property information
- Property characteristics
- Pricing and status
- Broker/Agent information
- Legal description fields (via features)
- Images and location data

## Troubleshooting

### No Legal Description Found
If legal description is missing:
1. Check if property has `features` array in response
2. Look for `subdivision` field as fallback
3. Parse `descriptions` array for legal patterns
4. Use subdivision name if nothing else available

### API Response Issues
- Ensure API key is set in `.env.local`
- Verify custom view exists: `dealdocs_property_complete`
- Check that query includes proper address format
- Run `node scripts/check-datafiniti-view.js dealdocs_property_complete` to verify view configuration

## Future Improvements

1. **Enhanced Parsing**: Add more patterns for parsing legal descriptions from text
2. **Additional Sources**: Integrate tax assessor data for missing legal descriptions
3. **Caching**: Cache legal descriptions to avoid repeated API calls
4. **Validation**: Add validation for lot/block numbers format