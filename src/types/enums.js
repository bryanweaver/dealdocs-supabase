// Application enums and constants

export const FinancingType = {
  NONE: 'NONE',
  CASH: 'CASH',
  BYTHIRDPARTY: 'BYTHIRDPARTY',
  BYLOANASSUMPTION: 'BYLOANASSUMPTION',
  BYSELLER: 'BYSELLER',
  // Legacy values for backward compatibility
  ASSUMELOAN: 'ASSUMELOAN',
  OWNERFINANCING: 'OWNERFINANCING'
}

export const LoanType = {
  CONVENTIONAL: 'CONVENTIONAL',
  FHA: 'FHA',
  VA: 'VA',
  VAGUARANTEED: 'VAGUARANTEED',
  USDA: 'USDA',
  USDAGUARANTEED: 'USDAGUARANTEED',
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
  WAIVER: 'WAIVER',
  PARTIALWAIVER: 'PARTIALWAIVER',
  ADDITIONALRIGHTTOTERMINATE: 'ADDITIONALRIGHTTOTERMINATE',
  // Legacy values for backward compatibility
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