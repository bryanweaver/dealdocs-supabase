/* Amplify Params - DO NOT EDIT
	API_DEALDOCS_GRAPHQLAPIIDOUTPUT
	API_DEALDOCS_LISTINGAGENTCONTACTINFOTABLE_ARN
	API_DEALDOCS_LISTINGAGENTCONTACTINFOTABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const source = event.arguments.source; // e.g. "homes.com"
    
    // Try exact match
    const count = await countBySource(source);
    
    // If no results found, try case variations
    if (count === 0) {
      // Try uppercase version
      const uppercaseCount = await countBySource(source.toUpperCase());
      
      // Try capitalized version (first letter uppercase)
      const capitalizedSource = source.charAt(0).toUpperCase() + source.slice(1);
      const capitalizedCount = await countBySource(capitalizedSource);
      
      // Return the sum of all variations
      return { count: count + uppercaseCount + capitalizedCount };
    }
    
    return { count };
  } catch (error) {
    console.error('Error counting agents by source:', error);
    return { count: 0, error: error.message };
  }
};

async function countBySource(source) {
  // Use the Select: COUNT feature of DynamoDB for more efficient counting
  // This avoids retrieving all items, which is much faster for large datasets
  const params = {
    TableName: process.env.API_DEALDOCS_LISTINGAGENTCONTACTINFOTABLE_NAME,
    IndexName: 'source-index', // GSI on 'source' attribute
    KeyConditionExpression: '#src = :src',
    ExpressionAttributeNames: { '#src': 'source' },
    ExpressionAttributeValues: { ':src': source },
    Select: 'COUNT' // Only return the count, not the items themselves
  };

  try {
    let totalCount = 0;
    let lastKey = null;
    
    // We still need to paginate for large result sets, but we're only getting counts
    // which is much faster than retrieving all items
    do {
      if (lastKey) params.ExclusiveStartKey = lastKey;
      const result = await docClient.query(params).promise();
      totalCount += result.Count; // Use Count instead of Items.length
      lastKey = result.LastEvaluatedKey;
      
      // Safety check: if we've looked through 10 pages, just return what we have
      // to avoid timeouts on extremely large datasets
      if (totalCount > 0 && !lastKey) {
        break;
      }
    } while (lastKey);

    return totalCount;
  } catch (error) {
    console.error(`Error counting for source '${source}':`, error);
    return 0;
  }
}