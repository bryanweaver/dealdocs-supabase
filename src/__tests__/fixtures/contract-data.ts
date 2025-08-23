/**
 * Test data factories for contract-related data structures
 * Provides realistic test data for comprehensive testing
 */

export const mockPropertyData = {
  complete: {
    lot: "15",
    block: "A",
    county: "Harris",
    legalDescription:
      "LOT 15, BLOCK A, SUNSET MEADOWS SUBDIVISION, HARRIS COUNTY, TEXAS",
    streetAddress: "1234 Maple Drive",
    city: "Houston",
    state: "TX",
    postalCode: "77082",
    mlsNumber: "12345678",
    subdivision: "Sunset Meadows",
    yearBuilt: "2018",
    numBedroom: "4",
    numBathroom: "3",
    numFloor: "2",
    floorSizeValue: "2400",
    floorSizeUnit: "sq ft",
    lotSizeValue: "0.25",
    lotSizeUnit: "acres",
    mostRecentPriceAmount: "450000",
    mostRecentPriceDate: "2024-01-15",
    dateAdded: "2024-01-10",
    dateUpdated: "2024-01-15",
    description:
      "Beautiful 4-bedroom home in desirable Sunset Meadows subdivision with modern amenities and spacious layout.",
    imageUrl: "https://example.com/property-image.jpg",
  },
  minimal: {
    lot: "1",
    block: "1",
    county: "Travis",
    legalDescription: "LOT 1, BLOCK 1, TEST SUBDIVISION",
    streetAddress: "123 Test St",
    city: "Austin",
    state: "TX",
    postalCode: "78701",
    mlsNumber: "",
    subdivision: "",
    yearBuilt: "",
    numBedroom: "",
    numBathroom: "",
    numFloor: "",
    floorSizeValue: "",
    floorSizeUnit: "",
    lotSizeValue: "",
    lotSizeUnit: "",
    mostRecentPriceAmount: "",
    mostRecentPriceDate: "",
    dateAdded: "",
    dateUpdated: "",
    description: "",
    imageUrl: "",
  },
  invalidZip: {
    lot: "1",
    block: "1",
    county: "Harris",
    legalDescription: "LOT 1, BLOCK 1, TEST SUBDIVISION",
    streetAddress: "123 Invalid St",
    city: "Houston",
    state: "TX",
    postalCode: "invalid",
    mlsNumber: "",
    subdivision: "",
    yearBuilt: "",
    numBedroom: "",
    numBathroom: "",
    numFloor: "",
    floorSizeValue: "",
    floorSizeUnit: "",
    lotSizeValue: "",
    lotSizeUnit: "",
    mostRecentPriceAmount: "",
    mostRecentPriceDate: "",
    dateAdded: "",
    dateUpdated: "",
    description: "",
    imageUrl: "",
  },
};

export const mockBuyerData = {
  primary: {
    primaryName: "John Smith",
    phone: "713-555-0123",
    fax: "713-555-0124",
    email: "john.smith@email.com",
    hasSecondaryParty: false,
    secondaryName: "",
    secondaryEmail: "",
  },
  withSecondary: {
    primaryName: "John Smith",
    phone: "713-555-0123",
    fax: "713-555-0124",
    email: "john.smith@email.com",
    hasSecondaryParty: true,
    secondaryName: "Jane Smith",
    secondaryEmail: "jane.smith@email.com",
  },
  invalid: {
    primaryName: "",
    phone: "invalid-phone",
    fax: "",
    email: "invalid-email",
    hasSecondaryParty: null,
    secondaryName: "",
    secondaryEmail: "",
  },
};

export const mockSellerData = {
  complete: {
    primaryName: "Robert Johnson",
    phone: "713-555-0456",
    fax: "713-555-0457",
    email: "robert.johnson@email.com",
    hasSecondaryParty: false,
    secondaryName: "",
  },
  withSecondary: {
    primaryName: "Robert Johnson",
    phone: "713-555-0456",
    fax: "713-555-0457",
    email: "robert.johnson@email.com",
    hasSecondaryParty: true,
    secondaryName: "Mary Johnson",
  },
};

export const mockFinanceData = {
  conventional: {
    hasPreferredLender: true,
    wantsLenderReferral: false,
    buyerApprovalNoticeDays: 20,
    cashAmount: 90000,
    fhaVaAppraisedValue: null,
    fhaSectionNumber: null,
    financingType: "Third Party",
    interestRate: 6.5,
    interestRateYears: 30,
    isBuyerApprovalRequired: true,
    isSecondMortgage: false,
    loanType: "Conventional",
    originationChargePercent: 1.0,
    otherFinancingLenderName: null,
    otherFinancingWaiveRights: null,
    principalAmount: 360000,
    reverseMortgageIsFHAInsured: null,
    storageKey: null,
    termYears: 30,
    totalSalesPrice: 450000,
    terminationOnAppraisalType: null,
    terminationOpinionOfValueAmount: null,
    terminationDaysAfterEffectiveDate: null,
    terminationAppraisedValueLessThan: null,
  },
  fha: {
    hasPreferredLender: false,
    wantsLenderReferral: true,
    buyerApprovalNoticeDays: 25,
    cashAmount: 22500,
    fhaVaAppraisedValue: 450000,
    fhaSectionNumber: "203(b)",
    financingType: "FHA",
    interestRate: 6.0,
    interestRateYears: 30,
    isBuyerApprovalRequired: true,
    isSecondMortgage: false,
    loanType: "FHA",
    originationChargePercent: 1.0,
    otherFinancingLenderName: null,
    otherFinancingWaiveRights: null,
    principalAmount: 427500,
    reverseMortgageIsFHAInsured: null,
    storageKey: null,
    termYears: 30,
    totalSalesPrice: 450000,
    terminationOnAppraisalType: "FHA Appraisal",
    terminationOpinionOfValueAmount: null,
    terminationDaysAfterEffectiveDate: 10,
    terminationAppraisedValueLessThan: 450000,
  },
  cash: {
    hasPreferredLender: null,
    wantsLenderReferral: null,
    buyerApprovalNoticeDays: null,
    cashAmount: 450000,
    fhaVaAppraisedValue: null,
    fhaSectionNumber: null,
    financingType: "Cash",
    interestRate: null,
    interestRateYears: null,
    isBuyerApprovalRequired: false,
    isSecondMortgage: false,
    loanType: "Cash",
    originationChargePercent: null,
    otherFinancingLenderName: null,
    otherFinancingWaiveRights: null,
    principalAmount: 0,
    reverseMortgageIsFHAInsured: null,
    storageKey: null,
    termYears: null,
    totalSalesPrice: 450000,
    terminationOnAppraisalType: null,
    terminationOpinionOfValueAmount: null,
    terminationDaysAfterEffectiveDate: null,
    terminationAppraisedValueLessThan: null,
  },
};

export const mockTitleData = {
  complete: {
    hasTitleCompany: true,
    wantsTitleReferral: false,
    titleCompanyName: "First American Title",
    titleCompanyStreetAddress: "5555 Title Plaza",
    titleCompanyCity: "Houston",
    titleCompanyState: "TX",
    titleCompanyPostalCode: "77027",
    standardExceptionsToBeAmended: true,
    standardExceptionsToBeAmendedBy: "Seller",
    titleFurnishingParty: "Seller",
    escrowAgentName: "First American Title",
    earnestMoney: 5000,
    optionFee: 500,
    additionalEarnestMoney: null,
    additionalEarnestMoneyDaysToDeliver: null,
    optionPeriodDaysToTerminate: 10,
  },
  minimal: {
    hasTitleCompany: true,
    wantsTitleReferral: false,
    titleCompanyName: "Test Title Co",
    titleCompanyStreetAddress: "123 Title St",
    titleCompanyCity: "Austin",
    titleCompanyState: "TX",
    titleCompanyPostalCode: "78701",
    standardExceptionsToBeAmended: false,
    standardExceptionsToBeAmendedBy: null,
    titleFurnishingParty: "Seller",
    escrowAgentName: "Test Title Co",
    earnestMoney: 1000,
    optionFee: 100,
    additionalEarnestMoney: null,
    additionalEarnestMoneyDaysToDeliver: null,
    optionPeriodDaysToTerminate: 7,
  },
};

export const mockCompleteContract = {
  id: "test-contract-123",
  property: mockPropertyData.complete,
  buyers: mockBuyerData.primary,
  sellers: mockSellerData.complete,
  finance: mockFinanceData.conventional,
  title: mockTitleData.complete,
  leases: {
    hasResidentialLease: false,
    hasFixtureLease: false,
    hasMineralLease: false,
    mineralLeaseCopyDelivered: null,
    mineralLeaseDaysToDeliveryCopy: null,
  },
  survey: {
    daysToFurnish: 20,
    type: "New",
    furnishingPartyIfExistingIsUnacceptable: "Seller",
  },
  titleObjections: {
    objections: "",
    daysToObject: 20,
  },
  titleNotices: {
    isInMUD: false,
    isInCoastalArea: false,
    isInPublicImprovementDistrict: false,
    isInPropaneServiceArea: false,
  },
  propertyCondition: {
    sellerDisclosureReceived: false,
    sellerDisclosureDaysToProduce: 7,
    sellerRequiredToDisclose: true,
    buyerAcceptsAsIs: false,
    buyerAcceptanceRepairSpecifics: "",
    serviceContractReimbursementAmount: null,
    retainedImprovements: "",
  },
  brokerDisclosure: {
    buyerIsThirdPartyAgent: false,
    buyerIsRelatedToSeller: false,
    buyerHasStakeInProperty: false,
    buyerIsBeingCompensated: false,
    buyerDisclosure: null,
  },
  closing: {
    closingDate: "2024-03-15",
  },
  possession: {
    possessionUponClosing: true,
    possessionAccordingToTempLease: false,
  },
  buyerProvisions: {
    buyerProvisions: "Standard buyer provisions apply",
    additionalExpensesPaidBySeller: null,
  },
  buyerNotices: {
    deliverToAddress: true,
    streetAddress: "1234 Buyer Lane",
    city: "Houston",
    state: "TX",
    postalCode: "77082",
    deliverByPhone: true,
    phone: "713-555-0123",
    deliverByEmailFax1: true,
    emailFax1: "john.smith@email.com",
    deliveryByEmailFax2: false,
    emailFax2: "",
    deliverToAgent: false,
    agentContact: "",
  },
  buyerAttorney: {
    hasAttorney: false,
    name: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
    email: "",
    fax: "",
  },
  listingAgent: {
    hasListingAgentInfo: true,
    firmName: "Premier Real Estate",
    firmLicenseNumber: "TX123456",
    firmStreetAddress: "789 Realtor Blvd",
    firmCity: "Houston",
    firmState: "TX",
    firmPostalCode: "77027",
    firmPhone: "713-555-0789",
    listingAssociateName: "Sarah Wilson",
    listingAssociateLicenseNumber: "TX987654",
    listingAssociateTeamName: "Wilson Team",
    listingAssociateEmail: "sarah.wilson@premiere.com",
    listingAssociatePhone: "713-555-0790",
    listingAssociateSupervisorName: "Mike Davis",
    listingAssociateSupervisorLicenseNumber: "TX555666",
  },
  homeownersAssociationAddendum: {
    hasHomeownersAssociation: false,
    storageKey: null,
    associationName: null,
    associationPhoneNumber: null,
    requiresSubdivisionInfo: null,
    receivedSubdivisionInfo: null,
    requiresUpdatedResaleCertificate: null,
    subdivisionInfoProvidedBy: null,
    subdivisionInfoDaysToDeliver: null,
    buyerFeesNotToExceed: null,
    feeForTitleCompanyPaidBy: null,
  },
  markedQuestions: "{}",
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-15T15:30:00Z",
};

/**
 * Factory function to create contract data with overrides
 */
export function createMockContract(overrides: any = {}) {
  return {
    ...mockCompleteContract,
    ...overrides,
    id: overrides.id || `test-contract-${Date.now()}`,
  };
}

/**
 * Factory function to create property data with overrides
 */
export function createMockProperty(overrides: any = {}) {
  return {
    ...mockPropertyData.complete,
    ...overrides,
  };
}

/**
 * Factory function to create buyer data with overrides
 */
export function createMockBuyer(overrides: any = {}) {
  return {
    ...mockBuyerData.primary,
    ...overrides,
  };
}

/**
 * Factory function to create seller data with overrides
 */
export function createMockSeller(overrides: any = {}) {
  return {
    ...mockSellerData.complete,
    ...overrides,
  };
}

/**
 * Factory function to create finance data with overrides
 */
export function createMockFinance(overrides: any = {}) {
  return {
    ...mockFinanceData.conventional,
    ...overrides,
  };
}
