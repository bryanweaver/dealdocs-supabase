/**
 * Contract Form Answer Mappings
 * Based on actual questions from TX config files
 * This provides appropriate test values for all form fields
 */

import { FinancingType, LoanType, TerminationOnAppraisalType } from '../../types/enums';

// Generate unique identifiers for this test run
const timestamp = Date.now();
const testId = Math.random().toString(36).substring(7);

export const contractAnswers: Record<string, any> = {
  // ==========================================
  // PROPERTY SECTION
  // ==========================================
  "What is the property street address?": "3114 Brookhollow Drive",
  "What is the property city?": "Deer Park",
  "What is the property state?": "TX",
  "What is the property postal code?": "77536",
  "What is the property county?": "Harris",
  "What is the property legal description?": "Lot 15, Block 3, Brookhollow Estates, Section 2",
  "What is the property lot number?": "15",
  "What is the property block number?": "3",
  
  // ==========================================
  // BUYERS SECTION
  // ==========================================
  "What is your full name?": "John Michael Smith",
  "What is your phone number?": "(713) 555-4567",
  "What is your email address?": `john.smith.${testId}@example.com`,
  "What is your fax number?": "(713) 555-4568",
  "Is there a secondary buyer?": false, // Always No for simplicity
  "What is the second buyer's full name?": "Jane Elizabeth Smith",
  "What is the second buyer's phone number?": "(713) 555-4569",
  "What is the second buyer's email address?": `jane.smith.${testId}@example.com`,
  "What is the second buyer's fax number?": "(713) 555-4570",
  
  // ==========================================
  // SELLERS SECTION
  // ==========================================
  "What is the seller's full name?": "Robert James Anderson",
  "What is the seller's phone number?": "(832) 555-7890",
  "What is the seller's email address?": `seller.${testId}@realestate.com`,
  "What is the seller's fax number?": "(832) 555-7891",
  "Is there a secondary seller?": false,
  "What is the second seller's full name?": "Mary Anne Anderson",
  "What is the second seller's phone number?": "(832) 555-7892",
  "What is the second seller's email address?": `mary.seller.${testId}@realestate.com`,
  "What is the second seller's fax number?": "(832) 555-7893",
  
  // ==========================================
  // FINANCE SECTION
  // ==========================================
  "What type of financing will you be using?": FinancingType.BYTHIRDPARTY,
  "Do you already have a preferred lender?": true,
  "Would you like a referral to trusted lenders in your area?": false,
  "How much do you intend to offer for the property?": "425000",
  "How much of that will be a down payment?": "85000",
  "How much will you be financing?": "340000",
  "What type of loan will you be obtaining?": LoanType.CONVENTIONAL,
  "Will this be a second mortgage?": false,
  "What is the term of the loan (in years)?": "30",
  "What is the initial interest rate for the loan?": "6.5",
  "For how many years is the initial interest rate of the mortgage loan applicable?": "30",
  "What percent of the loan are origination charges not to exceed?": "1.5",
  "Will the reverse mortgage loan be an FHA insured loan?": false,
  "What is the name of the lender?": "First National Bank of Texas",
  "Does the buyer waive all rights to terminate the contract under Paragraph 2B of this addendum for the loan described in this paragraph?": false,
  "Is this contract subject to Buyer obtaining Buyer Approval?": true,
  "How many days after the effective date of this contract can the Buyer give written notice to the Seller if Buyer cannot obtain Buyer Approval?": "21",
  "What is the appraised value of the Property?": "425000",
  "Which option regarding the right to terminate based on the lender's appraisal of the home do you wish to invoke in this contract?": TerminationOnAppraisalType.ADDITIONALRIGHTTOTERMINATE,
  "What opinion of value ($) will you not accept?": "400000",
  "What is the appraisal value ($) below which you reserve the right to terminate the contract?": "415000",
  "How many days after the Effective Date do you want the right to terminate if the appraisal value is below the specified amount?": "10",
  
  // ==========================================
  // TITLE & CLOSING SECTION
  // ==========================================
  "What is the name of the title company?": "Texas Title Services LLC",
  "What is the title company's address?": "1000 Main Street, Suite 200",
  "What is the title company's city?": "Houston",
  "What is the title company's state?": "TX",
  "What is the title company's zip code?": "77002",
  "What is the title company's phone number?": "(713) 555-3000",
  "How much will the earnest money be?": "10000",
  "How many days after the effective date will the earnest money be delivered?": "3",
  "How much will the option fee be?": "500",
  "How many days will the option period last?": "10",
  "When do you want to close?": new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 45 days from now
  
  // ==========================================
  // PROPERTY CONDITION
  // ==========================================
  "Will the property be sold as-is?": false,
  "Will the seller complete repairs before closing?": true,
  "What is the maximum amount seller will pay for repairs?": "5000",
  
  // ==========================================
  // POSSESSION
  // ==========================================
  "When will possession be delivered to buyer?": "Upon closing and funding",
  "Will there be a temporary lease back to seller?": false,
  "How many days will the temporary lease last?": "0",
  
  // ==========================================
  // LEASES
  // ==========================================
  "Are there any existing leases on the property?": false,
  "Will the buyer assume existing leases?": false,
  
  // ==========================================
  // SURVEY
  // ==========================================
  "Who will pay for the survey?": "Seller",
  "Will a new survey be required?": true,
  "Is an existing survey acceptable?": false,
  
  // ==========================================
  // HOMEOWNERS ASSOCIATION (HOA)
  // ==========================================
  "Is the property subject to HOA?": true,
  "What is the HOA fee?": "150",
  "How often is the HOA fee paid?": "Monthly",
  "What is the name of the HOA?": "Brookhollow Estates HOA",
  
  // ==========================================
  // BROKER/AGENT INFORMATION
  // ==========================================
  "What is the listing agent's name?": "Sarah Johnson",
  "What is the listing agent's phone number?": "(713) 555-2000",
  "What is the listing agent's email?": `listing.agent.${testId}@realty.com`,
  "What is the listing agent's license number?": "LIC789456",
  "What is the listing broker's name?": "Premier Texas Realty",
  "What is the buyer's agent name?": "Michael Chen",
  "What is the buyer's agent phone number?": "(832) 555-3000",
  "What is the buyer's agent email?": `buyer.agent.${testId}@realty.com`,
  "What is the buyer's agent license number?": "LIC456789",
  "What is the buyer's broker name?": "Houston Home Finders",
  
  // ==========================================
  // ATTORNEY INFORMATION
  // ==========================================
  "Will buyer be represented by an attorney?": false,
  "What is the buyer's attorney's name?": "N/A",
  "What is the buyer's attorney's phone?": "N/A",
  "What is the buyer's attorney's email?": "N/A",
  "Will seller be represented by an attorney?": false,
  "What is the seller's attorney's name?": "N/A",
  "What is the seller's attorney's phone?": "N/A",
  "What is the seller's attorney's email?": "N/A",
  
  // ==========================================
  // PROPERTY DETAILS (from API or manual)
  // ==========================================
  "How many bedrooms does the property have?": "3",
  "How many bathrooms does the property have?": "2",
  "What is the square footage of the property?": "2150",
  "What is the lot size (in acres)?": "0.25",
  "What year was the property built?": "2015",
  "What is the property type?": "Single Family",
  "What is the MLS number?": `MLS${Math.floor(10000000 + Math.random() * 90000000)}`,
  
  // ==========================================
  // YES/NO QUESTIONS (General patterns)
  // ==========================================
  // For most yes/no questions, we'll default to "No" for simplicity
  // unless they're critical for the workflow
};

/**
 * Get answer for a specific question
 * Falls back to intelligent defaults based on question patterns
 */
export function getAnswerForQuestion(question: string): string {
  // Clean the question text
  const cleanQuestion = question.trim();
  
  // First check if we have an exact match
  if (contractAnswers[cleanQuestion] !== undefined) {
    const answer = contractAnswers[cleanQuestion];
    return typeof answer === 'boolean' ? (answer ? 'Yes' : 'No') : String(answer);
  }
  
  // Check partial matches (case-insensitive)
  const lowerQuestion = cleanQuestion.toLowerCase();
  for (const [key, value] of Object.entries(contractAnswers)) {
    if (lowerQuestion.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerQuestion)) {
      return typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value);
    }
  }
  
  // Intelligent fallbacks based on patterns
  if (lowerQuestion.includes('email')) {
    return `test.${timestamp}@example.com`;
  }
  if (lowerQuestion.includes('phone') || lowerQuestion.includes('telephone')) {
    return '(713) 555-' + Math.floor(1000 + Math.random() * 9000);
  }
  if (lowerQuestion.includes('fax')) {
    return '(713) 555-' + Math.floor(1000 + Math.random() * 9000);
  }
  if (lowerQuestion.includes('name') && !lowerQuestion.includes('company') && !lowerQuestion.includes('lender')) {
    if (lowerQuestion.includes('first')) return 'John';
    if (lowerQuestion.includes('last')) return 'Smith';
    if (lowerQuestion.includes('middle')) return 'Michael';
    return 'John Smith';
  }
  if (lowerQuestion.includes('address') && !lowerQuestion.includes('email')) {
    return '123 Test Street';
  }
  if (lowerQuestion.includes('city')) {
    return 'Houston';
  }
  if (lowerQuestion.includes('state')) {
    return 'TX';
  }
  if (lowerQuestion.includes('zip') || lowerQuestion.includes('postal')) {
    return '77001';
  }
  if (lowerQuestion.includes('county')) {
    return 'Harris';
  }
  if (lowerQuestion.includes('price') || lowerQuestion.includes('amount') || lowerQuestion.includes('$')) {
    if (lowerQuestion.includes('earnest')) return '10000';
    if (lowerQuestion.includes('option')) return '500';
    if (lowerQuestion.includes('down')) return '85000';
    if (lowerQuestion.includes('repair')) return '5000';
    return '100000';
  }
  if (lowerQuestion.includes('percent') || lowerQuestion.includes('%') || lowerQuestion.includes('rate')) {
    if (lowerQuestion.includes('interest')) return '6.5';
    if (lowerQuestion.includes('origination')) return '1.5';
    return '5';
  }
  if (lowerQuestion.includes('days')) {
    if (lowerQuestion.includes('option')) return '10';
    if (lowerQuestion.includes('earnest')) return '3';
    if (lowerQuestion.includes('approval')) return '21';
    return '30';
  }
  if (lowerQuestion.includes('year')) {
    if (lowerQuestion.includes('built')) return '2015';
    if (lowerQuestion.includes('term') || lowerQuestion.includes('loan')) return '30';
    return new Date().getFullYear().toString();
  }
  if (lowerQuestion.includes('date')) {
    if (lowerQuestion.includes('closing')) {
      return new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    }
    return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  }
  if (lowerQuestion.includes('bedroom')) {
    return '3';
  }
  if (lowerQuestion.includes('bathroom')) {
    return '2';
  }
  if (lowerQuestion.includes('square') || lowerQuestion.includes('sqft')) {
    return '2150';
  }
  if (lowerQuestion.includes('lot size')) {
    return '0.25';
  }
  if (lowerQuestion.includes('license')) {
    return 'LIC' + Math.floor(100000 + Math.random() * 900000);
  }
  if (lowerQuestion.includes('mls')) {
    return 'MLS' + Math.floor(10000000 + Math.random() * 90000000);
  }
  if (lowerQuestion.includes('company') || lowerQuestion.includes('broker')) {
    if (lowerQuestion.includes('title')) return 'Texas Title Services LLC';
    if (lowerQuestion.includes('lender')) return 'First National Bank of Texas';
    return 'ABC Realty LLC';
  }
  
  // For yes/no questions (contains "?"), default to "No" for safety
  if (lowerQuestion.includes('?')) {
    // Some should be "Yes" for proper workflow
    if (lowerQuestion.includes('is this contract subject to buyer obtaining buyer approval')) return 'Yes';
    if (lowerQuestion.includes('will a new survey be required')) return 'Yes';
    if (lowerQuestion.includes('is the property subject to hoa')) return 'Yes';
    if (lowerQuestion.includes('do you already have a preferred lender')) return 'Yes';
    
    // Default to "No" for most optional features
    return 'No';
  }
  
  // Generic fallback
  return 'Test Entry';
}

/**
 * Get answer for a field by its fieldId
 */
export function getAnswerForFieldId(fieldId: string): string {
  // Map common field IDs to answers
  const fieldIdMap: Record<string, any> = {
    // Buyer fields
    primaryName: contractAnswers["What is your full name?"],
    phone: contractAnswers["What is your phone number?"],
    email: contractAnswers["What is your email address?"],
    fax: contractAnswers["What is your fax number?"],
    hasSecondaryParty: false,
    secondaryName: contractAnswers["What is the second buyer's full name?"],
    secondaryPhone: contractAnswers["What is the second buyer's phone number?"],
    secondaryEmail: contractAnswers["What is the second buyer's email address?"],
    
    // Property fields
    streetAddress: contractAnswers["What is the property street address?"],
    city: contractAnswers["What is the property city?"],
    state: contractAnswers["What is the property state?"],
    postalCode: contractAnswers["What is the property postal code?"],
    county: contractAnswers["What is the property county?"],
    
    // Finance fields
    financingType: FinancingType.BYTHIRDPARTY,
    totalSalesPrice: "425000",
    cashAmount: "85000",
    principalAmount: "340000",
    loanType: LoanType.CONVENTIONAL,
    termYears: "30",
    interestRate: "6.5",
    
    // Add more mappings as needed
  };
  
  if (fieldIdMap[fieldId] !== undefined) {
    const value = fieldIdMap[fieldId];
    return typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value);
  }
  
  // Fallback to pattern matching on fieldId
  if (fieldId.includes('email')) return `test.${timestamp}@example.com`;
  if (fieldId.includes('phone')) return '(713) 555-' + Math.floor(1000 + Math.random() * 9000);
  if (fieldId.includes('name')) return 'Test User';
  if (fieldId.includes('date')) return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  return 'Test Entry';
}