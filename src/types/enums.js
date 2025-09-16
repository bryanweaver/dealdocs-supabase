// Enums migrated from AWS Amplify GraphQL types
// These were previously imported from @/API

export const FinancingType = {
  CASH: 'CASH',
  BYTHIRDPARTY: 'BYTHIRDPARTY',
  ASSUMELOAN: 'ASSUMELOAN',
  OWNERFINANCING: 'OWNERFINANCING'
}

export const LoanType = {
  CONVENTIONAL: 'CONVENTIONAL',
  FHA: 'FHA',
  VA: 'VA',
  VAGUARANTEED: 'VAGUARANTEED',
  USDA: 'USDA',
  OTHER: 'OTHER'
}

export const PartyType = {
  BUYER: 'BUYER',
  SELLER: 'SELLER'
}

export const SurveyType = {
  EXISTINGBYSELLER: 'EXISTINGBYSELLER',
  NEWBYBUYER: 'NEWBYBUYER',
  NEWBYSELLER: 'NEWBYSELLER',
  NOSURVEYREQUIRED: 'NOSURVEYREQUIRED'
}

export const TerminationOnAppraisalType = {
  YES: 'YES',
  NO: 'NO'
}

// Etch packet status
export const EtchStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress', 
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  ERROR: 'error'
}

// Signer status
export const SignerStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  DECLINED: 'declined'
}