const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const docClient = new AWS.DynamoDB.DocumentClient();

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  
  try {
    // Check if this is a startAgentImportProcess mutation
    if (event.typeName === 'Mutation' && event.fieldName === 'startAgentImportProcess') {
      return await startImportProcess(event.arguments.input);
    }
    // Check if this is a getImportStatus query
    else if (event.typeName === 'Query' && event.fieldName === 'getImportStatus') {
      return await getImportStatus(event.arguments.id);
    }
    
    // Unrecognized operation
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Unsupported operation' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error', error: error.message }),
    };
  }
};

/**
 * Starts a new agent import process
 * @param {Object} input - Input data for the import process
 */
async function startImportProcess(input) {
  const { fileName, source, records, importedBy, importLogId, isChunk, chunkIndex, totalChunks } = input;
  
  if (!records || !Array.isArray(records) || records.length === 0) {
    throw new Error('No records provided for import');
  }

  // If this is a chunk, process it using a different flow
  if (isChunk && importLogId) {
    return await processChunk(importLogId, records, chunkIndex, totalChunks);
  }

  // Regular full import process (single batch)
  const timestamp = new Date().toISOString();
  const newImportLogId = uuidv4();
  const progressId = uuidv4();
  
  // Create ImportLog record
  const importLog = {
    id: newImportLogId,
    fileName,
    fileType: fileName.split('.').pop(),
    recordCount: records.length,
    importDate: timestamp,
    importedBy: importedBy || 'system',
    source,
    status: 'PROCESSING'
  };
  
  // Create ImportProgress record
  const importProgress = {
    id: progressId,
    importLogId: newImportLogId,
    totalRecords: records.length,
    processedCount: 0,
    successCount: 0,
    failureCount: 0,
    skippedCount: 0,
    status: 'PROCESSING',
    lastUpdated: timestamp
  };
  
  // Save both records
  await saveImportLog(importLog);
  await saveImportProgress(importProgress);
  
  // Start asynchronous processing in the background
  processAgentRecords(records, newImportLogId, progressId)
    .catch(error => {
      console.error('Error in background processing:', error);
      updateImportStatus(newImportLogId, 'FAILED', progressId);
    });
  
  // Return an immediate response to the client
  return {
    id: progressId,
    status: 'PROCESSING',
    importLogId: newImportLogId,
    recordCount: records.length,
    message: 'Import process started'
  };
}

/**
 * Process a chunk of agent records
 * This is used when the frontend sends data in chunks to avoid the AppSync payload size limit
 * @param {string} importLogId - The ID of the parent ImportLog
 * @param {Array} records - The agent records to process in this chunk 
 * @param {number} chunkIndex - The index of this chunk
 * @param {number} totalChunks - The total number of chunks
 */
async function processChunk(importLogId, records, chunkIndex, totalChunks) {
  console.log(`Processing chunk ${chunkIndex + 1}/${totalChunks} with ${records.length} records for import ${importLogId}`);
  
  // Counters for tracking this chunk's progress
  let successCount = 0;
  let failureCount = 0;
  let skippedCount = 0;
  
  try {
    // Get all existing email addresses in this chunk to check for duplication
    const emailsInChunk = records
      .flatMap(r => r.emailAddresses || [])
      .filter(Boolean)
      .map(email => email.toLowerCase());
    
    const uniqueEmailsInChunk = [...new Set(emailsInChunk)];
    
    // Look up existing agents for these emails in a single batch
    const existingAgentMap = await buildExistingAgentMapForEmails(uniqueEmailsInChunk);
    
    // Process each record in the chunk
    for (const record of records) {
      try {
        // Skip records with no email address
        const primaryEmail = record.emailAddresses && 
                           Array.isArray(record.emailAddresses) && 
                           record.emailAddresses.length > 0 ? 
                           record.emailAddresses[0].toLowerCase() : null;
        
        if (!primaryEmail) {
          skippedCount++;
          continue;
        }
        
        // Check if this agent already exists in our map
        const existingAgent = existingAgentMap[primaryEmail];
        
        if (existingAgent) {
          // Update existing agent
          await updateAgent(existingAgent, record);
          successCount++;
        } else {
          // Create new agent
          await createAgent(record);
          successCount++;
        }
      } catch (error) {
        console.error('Error processing record in chunk:', error, record);
        failureCount++;
      }
    }
    
    // Return result for this chunk
    return {
      id: importLogId,
      status: 'PROCESSING', // The overall import is still in progress
      successCount,
      failureCount,
      skippedCount,
      recordCount: records.length,
      message: `Chunk ${chunkIndex + 1}/${totalChunks} processed`
    };
    
  } catch (error) {
    console.error('Error processing chunk:', error);
    return {
      id: importLogId,
      status: 'PROCESSING',
      successCount: 0,
      failureCount: records.length,
      skippedCount: 0,
      recordCount: records.length,
      message: `Error in chunk ${chunkIndex + 1}/${totalChunks}: ${error.message}`
    };
  }
}

/**
 * Gets the current status of an import process
 * @param {string} id - The ID of the ImportProgress record
 */
async function getImportStatus(id) {
  try {
    const params = {
      TableName: process.env.API_DEALDOCS_IMPORTPROGRESSTABLE_NAME,
      Key: { id }
    };
    
    const result = await docClient.get(params).promise();
    
    if (!result.Item) {
      throw new Error(`Import status not found: ${id}`);
    }
    
    return result.Item;
  } catch (error) {
    console.error('Error getting import status:', error);
    throw error;
  }
}

/**
 * Saves an ImportLog record to DynamoDB
 * @param {Object} importLog - The ImportLog record
 */
async function saveImportLog(importLog) {
  const params = {
    TableName: process.env.API_DEALDOCS_IMPORTLOGTABLE_NAME,
    Item: importLog
  };
  
  await docClient.put(params).promise();
}

/**
 * Saves an ImportProgress record to DynamoDB
 * @param {Object} importProgress - The ImportProgress record
 */
async function saveImportProgress(importProgress) {
  const params = {
    TableName: process.env.API_DEALDOCS_IMPORTPROGRESSTABLE_NAME,
    Item: importProgress
  };
  
  await docClient.put(params).promise();
}

/**
 * Updates the status of an import process
 * @param {string} importLogId - The ID of the ImportLog record
 * @param {string} status - The new status
 * @param {string} progressId - The ID of the ImportProgress record
 */
async function updateImportStatus(importLogId, status, progressId) {
  const timestamp = new Date().toISOString();
  
  // Update ImportLog status
  const importLogParams = {
    TableName: process.env.API_DEALDOCS_IMPORTLOGTABLE_NAME,
    Key: { id: importLogId },
    UpdateExpression: 'SET #status = :status',
    ExpressionAttributeNames: { '#status': 'status' },
    ExpressionAttributeValues: { ':status': status }
  };
  
  // Update ImportProgress status
  const progressParams = {
    TableName: process.env.API_DEALDOCS_IMPORTPROGRESSTABLE_NAME,
    Key: { id: progressId },
    UpdateExpression: 'SET #status = :status, lastUpdated = :timestamp',
    ExpressionAttributeNames: { '#status': 'status' },
    ExpressionAttributeValues: { 
      ':status': status,
      ':timestamp': timestamp 
    }
  };
  
  await Promise.all([
    docClient.update(importLogParams).promise(),
    docClient.update(progressParams).promise()
  ]);
}

/**
 * Updates the progress of an import process
 * @param {string} progressId - The ID of the ImportProgress record
 * @param {Object} updates - The fields to update
 */
async function updateImportProgress(progressId, updates) {
  const timestamp = new Date().toISOString();
  
  // Build the update expression
  let updateExpression = 'SET lastUpdated = :timestamp';
  const expressionAttributeValues = { ':timestamp': timestamp };
  
  // Add each update field to the expression
  Object.entries(updates).forEach(([key, value]) => {
    updateExpression += `, #${key} = :${key}`;
    expressionAttributeValues[`:${key}`] = value;
  });
  
  // Build the expression attribute names
  const expressionAttributeNames = {};
  Object.keys(updates).forEach(key => {
    expressionAttributeNames[`#${key}`] = key;
  });
  
  const params = {
    TableName: process.env.API_DEALDOCS_IMPORTPROGRESSTABLE_NAME,
    Key: { id: progressId },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues
  };
  
  await docClient.update(params).promise();
}

/**
 * Optimized function to process agent records in batches
 * @param {Array} records - The agent records to process
 * @param {string} importLogId - The ID of the ImportLog record
 * @param {string} progressId - The ID of the ImportProgress record
 */
async function processAgentRecords(records, importLogId, progressId) {
  // Status counters
  let processed = 0;
  let successful = 0;
  let failures = 0;
  let skipped = 0;
  
  // Batch size for processing - increased for better throughput
  const BATCH_SIZE = 25;
  
  try {
    // Get all existing email addresses in a single scan operation for efficiency
    // This creates a lookup map we can use to quickly check if an agent exists
    const existingAgentMap = await buildExistingAgentMap();
    console.log(`Found ${Object.keys(existingAgentMap).length} existing agents in database`);
    
    // Split records into batches
    const batches = [];
    for (let i = 0; i < records.length; i += BATCH_SIZE) {
      batches.push(records.slice(i, i + BATCH_SIZE));
    }
    
    console.log(`Processing ${records.length} records in ${batches.length} batches`);
    
    // Process each batch
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      const batchOperations = [];
      
      // Process each record in the batch concurrently
      for (const record of batch) {
        try {
          // Skip records with no email address
          const hasEmail = record.emailAddresses && 
                          Array.isArray(record.emailAddresses) && 
                          record.emailAddresses.length > 0 && 
                          record.emailAddresses[0];
          
          if (!hasEmail) {
            skipped++;
            processed++;
            continue;
          }
          
          // Use our map to check if agent exists rather than making individual DB queries
          const primaryEmail = record.emailAddresses[0];
          const existingAgent = existingAgentMap[primaryEmail.toLowerCase()];
          
          // Add the operation to our batch
          if (existingAgent) {
            // Update existing agent
            batchOperations.push(updateAgent(existingAgent, record));
          } else {
            // Create new agent
            batchOperations.push(createAgent(record));
            successful++;
          }
          
          processed++;
        } catch (error) {
          console.error('Error processing record:', error, record);
          failures++;
          processed++;
        }
      }
      
      // Execute all operations for this batch concurrently
      await Promise.all(batchOperations);
      
      // Update progress after each batch
      await updateImportProgress(progressId, {
        processedCount: processed,
        successCount: successful,
        failureCount: failures,
        skippedCount: skipped
      });
      
      console.log(`Batch ${batchIndex + 1}/${batches.length} completed. Processed: ${processed}/${records.length}`);
    }
    
    // Update final status
    const finalStatus = failures === records.length ? 'FAILED' : 'COMPLETED';
    await updateImportStatus(importLogId, finalStatus, progressId);
    console.log(`Import completed with status: ${finalStatus}`);
    
  } catch (error) {
    console.error('Error in batch processing:', error);
    await updateImportStatus(importLogId, 'FAILED', progressId);
    throw error;
  }
}

/**
 * Builds a map of existing agents by email for faster lookups
 * @returns {Object} A map of email addresses to agent records
 */
async function buildExistingAgentMap() {
  try {
    const params = {
      TableName: process.env.API_DEALDOCS_LISTINGAGENTCONTACTINFOTABLE_NAME,
      ProjectionExpression: "id, emailAddresses, name, agencyName, profileUrl, phoneNumbers, source, importDate, metaData"
    };
    
    const map = {};
    let items = [];
    let lastEvaluatedKey = null;
    
    // Use pagination to get all items
    do {
      if (lastEvaluatedKey) {
        params.ExclusiveStartKey = lastEvaluatedKey;
      }
      
      const result = await docClient.scan(params).promise();
      items = items.concat(result.Items);
      lastEvaluatedKey = result.LastEvaluatedKey;
    } while (lastEvaluatedKey);
    
    // Build the map using all email addresses (lowercase for case-insensitive matching)
    items.forEach(agent => {
      if (agent.emailAddresses && Array.isArray(agent.emailAddresses)) {
        agent.emailAddresses.forEach(email => {
          if (email) {
            map[email.toLowerCase()] = agent;
          }
        });
      }
    });
    
    return map;
  } catch (error) {
    console.error('Error building existing agent map:', error);
    return {};
  }
}

/**
 * Builds a map of existing agents for a specific set of emails
 * @param {Array} emails - List of email addresses to look up
 * @returns {Object} A map of email addresses to agent records
 */
async function buildExistingAgentMapForEmails(emails) {
  if (!emails || emails.length === 0) return {};
  
  try {
    const map = {};
    
    // We need to query in batches because we can't do a single large IN query
    const BATCH_SIZE = 25;
    const batches = [];
    
    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      batches.push(emails.slice(i, i + BATCH_SIZE));
    }
    
    for (const batch of batches) {
      // Build filter expression for this batch
      // We're constructing a filter like: contains(emailAddresses, 'email1') OR contains(emailAddresses, 'email2')...
      const filterExpressions = batch.map((_, index) => `contains(emailAddresses, :email${index})`);
      const filterExpression = filterExpressions.join(' OR ');
      
      // Build expression attribute values
      const expressionAttributeValues = {};
      batch.forEach((email, index) => {
        expressionAttributeValues[`:email${index}`] = email;
      });
      
      const params = {
        TableName: process.env.API_DEALDOCS_LISTINGAGENTCONTACTINFOTABLE_NAME,
        FilterExpression: filterExpression,
        ExpressionAttributeValues: expressionAttributeValues
      };
      
      // Scan with filter
      let lastEvaluatedKey = null;
      do {
        if (lastEvaluatedKey) {
          params.ExclusiveStartKey = lastEvaluatedKey;
        }
        
        const result = await docClient.scan(params).promise();
        
        // Add found items to our map
        result.Items.forEach(agent => {
          if (agent.emailAddresses && Array.isArray(agent.emailAddresses)) {
            agent.emailAddresses.forEach(email => {
              if (email) {
                map[email.toLowerCase()] = agent;
              }
            });
          }
        });
        
        lastEvaluatedKey = result.LastEvaluatedKey;
      } while (lastEvaluatedKey);
    }
    
    return map;
  } catch (error) {
    console.error('Error building existing agent map for specific emails:', error);
    return {};
  }
}

/**
 * Creates a new agent record
 * @param {Object} agent - The agent data to create
 */
async function createAgent(agent) {
  const timestamp = new Date().toISOString();
  const id = uuidv4();
  
  const cleanedPhoneNumbers = Array.isArray(agent.phoneNumbers) ? 
    agent.phoneNumbers.filter(phone => phone && typeof phone === 'string' && phone.trim() !== '') : 
    [];
    
  const cleanedEmailAddresses = Array.isArray(agent.emailAddresses) ? 
    agent.emailAddresses.filter(email => email && typeof email === 'string' && email.trim() !== '') : 
    [];
  
  // Ensure we have valid metadata
  let metaData = '{}';
  try {
    if (typeof agent.metaData === 'string') {
      // Parse and re-stringify to ensure valid JSON
      metaData = JSON.stringify(JSON.parse(agent.metaData));
    } else if (typeof agent.metaData === 'object') {
      metaData = JSON.stringify(agent.metaData);
    }
  } catch (err) {
    console.warn('Invalid metadata, using empty object');
  }
  
  const newAgent = {
    id,
    name: agent.name || '',
    agencyName: agent.agencyName || '',
    profileUrl: agent.profileUrl || '',
    phoneNumbers: cleanedPhoneNumbers,
    emailAddresses: cleanedEmailAddresses,
    source: agent.source || '',
    importDate: timestamp,
    metaData,
    createdAt: timestamp,
    updatedAt: timestamp
  };
  
  const params = {
    TableName: process.env.API_DEALDOCS_LISTINGAGENTCONTACTINFOTABLE_NAME,
    Item: newAgent
  };
  
  await docClient.put(params).promise();
  return newAgent;
}

/**
 * Updates an existing agent record
 * @param {Object} existingAgent - The existing agent record
 * @param {Object} newData - The new data to merge
 */
async function updateAgent(existingAgent, newData) {
  const timestamp = new Date().toISOString();
  
  const cleanedPhoneNumbers = Array.isArray(newData.phoneNumbers) ? 
    newData.phoneNumbers.filter(phone => phone && typeof phone === 'string' && phone.trim() !== '') : 
    [];
    
  const cleanedEmailAddresses = Array.isArray(newData.emailAddresses) ? 
    newData.emailAddresses.filter(email => email && typeof email === 'string' && email.trim() !== '') : 
    [];
  
  // Merge and deduplicate arrays
  const phoneNumbers = [...new Set([
    ...(existingAgent.phoneNumbers || []),
    ...cleanedPhoneNumbers
  ])];
  
  const emailAddresses = [...new Set([
    ...(existingAgent.emailAddresses || []),
    ...cleanedEmailAddresses
  ])];
  
  // Create source string combining both sources
  const source = existingAgent.source ?
    `${existingAgent.source}, ${newData.source || ''}` :
    newData.source || '';
  
  const updates = {
    // Only update fields if they have better/more data
    name: newData.name || existingAgent.name,
    agencyName: newData.agencyName || existingAgent.agencyName,
    profileUrl: newData.profileUrl || existingAgent.profileUrl,
    phoneNumbers,
    emailAddresses,
    source,
    importDate: timestamp,
    updatedAt: timestamp
  };
  
  const params = {
    TableName: process.env.API_DEALDOCS_LISTINGAGENTCONTACTINFOTABLE_NAME,
    Key: { id: existingAgent.id },
    UpdateExpression: 'SET #name = :name, #agencyName = :agencyName, #profileUrl = :profileUrl, #phoneNumbers = :phoneNumbers, #emailAddresses = :emailAddresses, #source = :source, #importDate = :importDate, #updatedAt = :updatedAt',
    ExpressionAttributeNames: {
      '#name': 'name',
      '#agencyName': 'agencyName',
      '#profileUrl': 'profileUrl',
      '#phoneNumbers': 'phoneNumbers',
      '#emailAddresses': 'emailAddresses',
      '#source': 'source',
      '#importDate': 'importDate',
      '#updatedAt': 'updatedAt'
    },
    ExpressionAttributeValues: {
      ':name': updates.name,
      ':agencyName': updates.agencyName,
      ':profileUrl': updates.profileUrl,
      ':phoneNumbers': updates.phoneNumbers,
      ':emailAddresses': updates.emailAddresses,
      ':source': updates.source,
      ':importDate': updates.importDate,
      ':updatedAt': updates.updatedAt
    }
  };
  
  await docClient.update(params).promise();
  return { ...existingAgent, ...updates };
}
