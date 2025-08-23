/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	API_DEALDOCS_LISTINGAGENTCONTACTINFOTABLE_NAME
	API_DEALDOCS_LISTINGAGENTCONTACTINFOTABLE_ARN
	API_DEALDOCS_GRAPHQLAPIIDOUTPUT
	AGENT_TABLE_NAME
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.AGENT_TABLE_NAME;

exports.handler = async (event) => {
  const { query, limit = 50, nextToken } = event.arguments || {};
  if (!query || query.length < 2) {
    return { items: [], nextToken: null };
  }

  // Split query into words, ignore extra spaces
  const words = query.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return { items: [], nextToken: null };
  }

  // Build FilterExpression: all words must be present in name (case-insensitive, partial match)
  let filterExprParts = [];
  let exprAttrNames = { '#name': 'name' };
  let exprAttrValues = {};
  words.forEach((word, i) => {
    filterExprParts.push(`contains(#name, :q${i})`);
    exprAttrValues[`:q${i}`] = word;
  });
  const FilterExpression = filterExprParts.join(' AND ');

  let scanParams = {
    TableName: TABLE_NAME,
    FilterExpression,
    ExpressionAttributeNames: exprAttrNames,
    ExpressionAttributeValues: exprAttrValues,
    Limit: limit
  };

  if (nextToken) {
    scanParams.ExclusiveStartKey = typeof nextToken === 'string' ? JSON.parse(nextToken) : nextToken;
  }

  const result = await docClient.scan(scanParams).promise();
  return {
    items: result.Items,
    nextToken: result.LastEvaluatedKey ? JSON.stringify(result.LastEvaluatedKey) : null
  };
};