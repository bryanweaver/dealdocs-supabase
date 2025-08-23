/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateEmailPacket =
  /* GraphQL */ `subscription OnCreateEmailPacket(
  $filter: ModelSubscriptionEmailPacketFilterInput
) {
  onCreateEmailPacket(filter: $filter) {
    id
    accountId
    contractId
    streetAddress
    agentEmail
    agentName
    status
    comments
    subject
    body
    contractFiles
    preApprovalFile
    earnestFile
    optionFile
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
    APITypes.OnCreateEmailPacketSubscriptionVariables,
    APITypes.OnCreateEmailPacketSubscription
  >;
export const onUpdateEmailPacket =
  /* GraphQL */ `subscription OnUpdateEmailPacket(
  $filter: ModelSubscriptionEmailPacketFilterInput
) {
  onUpdateEmailPacket(filter: $filter) {
    id
    accountId
    contractId
    streetAddress
    agentEmail
    agentName
    status
    comments
    subject
    body
    contractFiles
    preApprovalFile
    earnestFile
    optionFile
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
    APITypes.OnUpdateEmailPacketSubscriptionVariables,
    APITypes.OnUpdateEmailPacketSubscription
  >;
export const onDeleteEmailPacket =
  /* GraphQL */ `subscription OnDeleteEmailPacket(
  $filter: ModelSubscriptionEmailPacketFilterInput
) {
  onDeleteEmailPacket(filter: $filter) {
    id
    accountId
    contractId
    streetAddress
    agentEmail
    agentName
    status
    comments
    subject
    body
    contractFiles
    preApprovalFile
    earnestFile
    optionFile
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
    APITypes.OnDeleteEmailPacketSubscriptionVariables,
    APITypes.OnDeleteEmailPacketSubscription
  >;
export const onCreateListingAgentContactInfo =
  /* GraphQL */ `subscription OnCreateListingAgentContactInfo(
  $filter: ModelSubscriptionListingAgentContactInfoFilterInput
) {
  onCreateListingAgentContactInfo(filter: $filter) {
    id
    name
    agencyName
    profileUrl
    phoneNumbers
    emailAddresses
    source
    importDate
    notes
    metaData
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
    APITypes.OnCreateListingAgentContactInfoSubscriptionVariables,
    APITypes.OnCreateListingAgentContactInfoSubscription
  >;
export const onUpdateListingAgentContactInfo =
  /* GraphQL */ `subscription OnUpdateListingAgentContactInfo(
  $filter: ModelSubscriptionListingAgentContactInfoFilterInput
) {
  onUpdateListingAgentContactInfo(filter: $filter) {
    id
    name
    agencyName
    profileUrl
    phoneNumbers
    emailAddresses
    source
    importDate
    notes
    metaData
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
    APITypes.OnUpdateListingAgentContactInfoSubscriptionVariables,
    APITypes.OnUpdateListingAgentContactInfoSubscription
  >;
export const onDeleteListingAgentContactInfo =
  /* GraphQL */ `subscription OnDeleteListingAgentContactInfo(
  $filter: ModelSubscriptionListingAgentContactInfoFilterInput
) {
  onDeleteListingAgentContactInfo(filter: $filter) {
    id
    name
    agencyName
    profileUrl
    phoneNumbers
    emailAddresses
    source
    importDate
    notes
    metaData
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
    APITypes.OnDeleteListingAgentContactInfoSubscriptionVariables,
    APITypes.OnDeleteListingAgentContactInfoSubscription
  >;
export const onCreateEtchPacket =
  /* GraphQL */ `subscription OnCreateEtchPacket(
  $filter: ModelSubscriptionEtchPacketFilterInput
  $owner: String
) {
  onCreateEtchPacket(filter: $filter, owner: $owner) {
    eid
    documentGroup {
      eid
      status
      files {
        downloadURL
        filename
        name
        type
        __typename
      }
      signers {
        eid
        aliasId
        name
        email
        routingOrder
        signActionType
        status
        uploadKeys
        __typename
      }
      __typename
    }
    contractId
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedSubscription<
    APITypes.OnCreateEtchPacketSubscriptionVariables,
    APITypes.OnCreateEtchPacketSubscription
  >;
export const onUpdateEtchPacket =
  /* GraphQL */ `subscription OnUpdateEtchPacket(
  $filter: ModelSubscriptionEtchPacketFilterInput
  $owner: String
) {
  onUpdateEtchPacket(filter: $filter, owner: $owner) {
    eid
    documentGroup {
      eid
      status
      files {
        downloadURL
        filename
        name
        type
        __typename
      }
      signers {
        eid
        aliasId
        name
        email
        routingOrder
        signActionType
        status
        uploadKeys
        __typename
      }
      __typename
    }
    contractId
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedSubscription<
    APITypes.OnUpdateEtchPacketSubscriptionVariables,
    APITypes.OnUpdateEtchPacketSubscription
  >;
export const onDeleteEtchPacket =
  /* GraphQL */ `subscription OnDeleteEtchPacket(
  $filter: ModelSubscriptionEtchPacketFilterInput
  $owner: String
) {
  onDeleteEtchPacket(filter: $filter, owner: $owner) {
    eid
    documentGroup {
      eid
      status
      files {
        downloadURL
        filename
        name
        type
        __typename
      }
      signers {
        eid
        aliasId
        name
        email
        routingOrder
        signActionType
        status
        uploadKeys
        __typename
      }
      __typename
    }
    contractId
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedSubscription<
    APITypes.OnDeleteEtchPacketSubscriptionVariables,
    APITypes.OnDeleteEtchPacketSubscription
  >;
export const onCreateContract = /* GraphQL */ `subscription OnCreateContract(
  $filter: ModelSubscriptionContractFilterInput
  $owner: String
) {
  onCreateContract(filter: $filter, owner: $owner) {
    id
    buyers {
      primaryName
      phone
      fax
      email
      hasSecondaryParty
      secondaryName
      secondaryPhone
      secondaryFax
      secondaryEmail
      __typename
    }
    property {
      lot
      block
      county
      legalDescription
      mlsNumber
      streetAddress
      city
      state
      postalCode
      subdivision
      yearBuilt
      numBedroom
      numBathroom
      numFloor
      floorSizeValue
      floorSizeUnit
      lotSizeValue
      lotSizeUnit
      mostRecentPriceAmount
      mostRecentPriceDate
      dateAdded
      dateUpdated
      description
      imageUrl
      __typename
    }
    finance {
      hasPreferredLender
      wantsLenderReferral
      buyerApprovalNoticeDays
      cashAmount
      fhaVaAppraisedValue
      fhaSectionNumber
      financingType
      interestRate
      interestRateYears
      isBuyerApprovalRequired
      isSecondMortgage
      loanType
      originationChargePercent
      otherFinancingLenderName
      otherFinancingWaiveRights
      principalAmount
      reverseMortgageIsFHAInsured
      storageKey
      termYears
      totalSalesPrice
      terminationOnAppraisalType
      terminationOpinionOfValueAmount
      terminationDaysAfterEffectiveDate
      terminationAppraisedValueLessThan
      __typename
    }
    leases {
      hasResidentialLease
      hasFixtureLease
      hasMineralLease
      mineralLeaseCopyDelivered
      mineralLeaseDaysToDeliveryCopy
      __typename
    }
    sellers {
      primaryName
      phone
      fax
      email
      hasSecondaryParty
      secondaryName
      secondaryPhone
      secondaryFax
      secondaryEmail
      __typename
    }
    title {
      hasTitleCompany
      wantsTitleReferral
      titleCompanyName
      titleCompanyStreetAddress
      titleCompanyCity
      titleCompanyState
      titleCompanyPostalCode
      standardExceptionsToBeAmended
      standardExceptionsToBeAmendedBy
      titleFurnishingParty
      escrowAgentName
      earnestMoney
      hasOptionFee
      optionFee
      hasAdditionalEarnestMoney
      additionalEarnestMoney
      additionalEarnestMoneyDaysToDeliver
      optionPeriodDaysToTerminate
      __typename
    }
    titleObjections {
      objections
      daysToObject
      __typename
    }
    survey {
      daysToFurnish
      type
      furnishingPartyIfExistingIsUnacceptable
      __typename
    }
    titleNotices {
      isInMUD
      isInCoastalArea
      isInPublicImprovementDistrict
      isInPropaneServiceArea
      __typename
    }
    propertyCondition {
      sellerDisclosureReceived
      sellerDisclosureDaysToProduce
      sellerRequiredToDisclose
      buyerAcceptsAsIs
      retainedImprovements
      buyerAcceptanceRepairSpecifics
      serviceContractReimbursementAmount
      __typename
    }
    brokerDisclosure {
      buyerIsThirdPartyAgent
      buyerIsRelatedToSeller
      buyerHasStakeInProperty
      buyerIsBeingCompensated
      buyerDisclosure
      __typename
    }
    closing {
      closingDate
      __typename
    }
    possession {
      possessionUponClosing
      possessionAccordingToTempLease
      __typename
    }
    buyerProvisions {
      buyerProvisions
      additionalExpensesPaidBySeller
      __typename
    }
    buyerNotices {
      deliverToAddress
      streetAddress
      city
      state
      postalCode
      deliverByPhone
      phone
      deliverByEmailFax1
      emailFax1
      deliveryByEmailFax2
      emailFax2
      deliverToAgent
      agentContact
      __typename
    }
    sellerNotices {
      deliverToAddress
      streetAddress
      city
      state
      postalCode
      deliverByPhone
      phone
      deliverByEmailFax1
      emailFax1
      deliveryByEmailFax2
      emailFax2
      deliverToAgent
      agentContact
      __typename
    }
    buyerAttorney {
      hasAttorney
      name
      streetAddress
      city
      state
      postalCode
      phone
      email
      fax
      __typename
    }
    buyerAgent {
      hasBuyerAgent
      firmName
      firmLicenseNumber
      firmStreetAddress
      firmCity
      firmState
      firmPostalCode
      firmPhone
      associateName
      associateLicenseNumber
      associateTeamName
      associateEmail
      associatePhone
      associateSupervisorName
      associateSupervisorLicenseNumber
      __typename
    }
    sellerAttorney {
      hasAttorney
      name
      streetAddress
      city
      state
      postalCode
      phone
      email
      fax
      __typename
    }
    listingAgent {
      hasListingAgentInfo
      firmName
      firmLicenseNumber
      firmStreetAddress
      firmCity
      firmState
      firmPostalCode
      firmPhone
      listingAssociateName
      listingAssociateLicenseNumber
      listingAssociateTeamName
      listingAssociateEmail
      listingAssociatePhone
      listingAssociateSupervisorName
      listingAssociateSupervisorLicenseNumber
      sellingAssociateName
      sellingAssociateLicenseNumber
      sellingAssociateTeamName
      sellingAssociateEmail
      sellingAssociatePhone
      sellingAssociateSupervisorName
      sellingAssociateSupervisorLicenseNumber
      sellingAssociateStreetAddress
      sellingAssociateCity
      sellingAssociateState
      sellingAssociatePostalCode
      __typename
    }
    markedQuestions
    homeownersAssociationAddendum {
      hasHomeownersAssociation
      storageKey
      associationName
      associationPhoneNumber
      requiresSubdivisionInfo
      receivedSubdivisionInfo
      requiresUpdatedResaleCertificate
      subdivisionInfoProvidedBy
      subdivisionInfoDaysToDeliver
      buyerFeesNotToExceed
      feeForTitleCompanyPaidBy
      __typename
    }
    leadBasedPaintAddendum {
      hasLeadBasedPaintDisclosure
      storageKey
      leadBasedPaintDisclosure
      __typename
    }
    rightToTerminateByLenderAppraisalAddendum {
      hasRightToTerminateByLenderAppraisal
      storageKey
      appraisalAmount
      __typename
    }
    sellerTemporaryLeaseAddendum {
      hasSellersTemporaryLease
      storageKey
      leaseLength
      __typename
    }
    createdAt
    updatedAt
    accountContractId
    owner
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateContractSubscriptionVariables,
  APITypes.OnCreateContractSubscription
>;
export const onUpdateContract = /* GraphQL */ `subscription OnUpdateContract(
  $filter: ModelSubscriptionContractFilterInput
  $owner: String
) {
  onUpdateContract(filter: $filter, owner: $owner) {
    id
    buyers {
      primaryName
      phone
      fax
      email
      hasSecondaryParty
      secondaryName
      secondaryPhone
      secondaryFax
      secondaryEmail
      __typename
    }
    property {
      lot
      block
      county
      legalDescription
      mlsNumber
      streetAddress
      city
      state
      postalCode
      subdivision
      yearBuilt
      numBedroom
      numBathroom
      numFloor
      floorSizeValue
      floorSizeUnit
      lotSizeValue
      lotSizeUnit
      mostRecentPriceAmount
      mostRecentPriceDate
      dateAdded
      dateUpdated
      description
      imageUrl
      __typename
    }
    finance {
      hasPreferredLender
      wantsLenderReferral
      buyerApprovalNoticeDays
      cashAmount
      fhaVaAppraisedValue
      fhaSectionNumber
      financingType
      interestRate
      interestRateYears
      isBuyerApprovalRequired
      isSecondMortgage
      loanType
      originationChargePercent
      otherFinancingLenderName
      otherFinancingWaiveRights
      principalAmount
      reverseMortgageIsFHAInsured
      storageKey
      termYears
      totalSalesPrice
      terminationOnAppraisalType
      terminationOpinionOfValueAmount
      terminationDaysAfterEffectiveDate
      terminationAppraisedValueLessThan
      __typename
    }
    leases {
      hasResidentialLease
      hasFixtureLease
      hasMineralLease
      mineralLeaseCopyDelivered
      mineralLeaseDaysToDeliveryCopy
      __typename
    }
    sellers {
      primaryName
      phone
      fax
      email
      hasSecondaryParty
      secondaryName
      secondaryPhone
      secondaryFax
      secondaryEmail
      __typename
    }
    title {
      hasTitleCompany
      wantsTitleReferral
      titleCompanyName
      titleCompanyStreetAddress
      titleCompanyCity
      titleCompanyState
      titleCompanyPostalCode
      standardExceptionsToBeAmended
      standardExceptionsToBeAmendedBy
      titleFurnishingParty
      escrowAgentName
      earnestMoney
      hasOptionFee
      optionFee
      hasAdditionalEarnestMoney
      additionalEarnestMoney
      additionalEarnestMoneyDaysToDeliver
      optionPeriodDaysToTerminate
      __typename
    }
    titleObjections {
      objections
      daysToObject
      __typename
    }
    survey {
      daysToFurnish
      type
      furnishingPartyIfExistingIsUnacceptable
      __typename
    }
    titleNotices {
      isInMUD
      isInCoastalArea
      isInPublicImprovementDistrict
      isInPropaneServiceArea
      __typename
    }
    propertyCondition {
      sellerDisclosureReceived
      sellerDisclosureDaysToProduce
      sellerRequiredToDisclose
      buyerAcceptsAsIs
      retainedImprovements
      buyerAcceptanceRepairSpecifics
      serviceContractReimbursementAmount
      __typename
    }
    brokerDisclosure {
      buyerIsThirdPartyAgent
      buyerIsRelatedToSeller
      buyerHasStakeInProperty
      buyerIsBeingCompensated
      buyerDisclosure
      __typename
    }
    closing {
      closingDate
      __typename
    }
    possession {
      possessionUponClosing
      possessionAccordingToTempLease
      __typename
    }
    buyerProvisions {
      buyerProvisions
      additionalExpensesPaidBySeller
      __typename
    }
    buyerNotices {
      deliverToAddress
      streetAddress
      city
      state
      postalCode
      deliverByPhone
      phone
      deliverByEmailFax1
      emailFax1
      deliveryByEmailFax2
      emailFax2
      deliverToAgent
      agentContact
      __typename
    }
    sellerNotices {
      deliverToAddress
      streetAddress
      city
      state
      postalCode
      deliverByPhone
      phone
      deliverByEmailFax1
      emailFax1
      deliveryByEmailFax2
      emailFax2
      deliverToAgent
      agentContact
      __typename
    }
    buyerAttorney {
      hasAttorney
      name
      streetAddress
      city
      state
      postalCode
      phone
      email
      fax
      __typename
    }
    buyerAgent {
      hasBuyerAgent
      firmName
      firmLicenseNumber
      firmStreetAddress
      firmCity
      firmState
      firmPostalCode
      firmPhone
      associateName
      associateLicenseNumber
      associateTeamName
      associateEmail
      associatePhone
      associateSupervisorName
      associateSupervisorLicenseNumber
      __typename
    }
    sellerAttorney {
      hasAttorney
      name
      streetAddress
      city
      state
      postalCode
      phone
      email
      fax
      __typename
    }
    listingAgent {
      hasListingAgentInfo
      firmName
      firmLicenseNumber
      firmStreetAddress
      firmCity
      firmState
      firmPostalCode
      firmPhone
      listingAssociateName
      listingAssociateLicenseNumber
      listingAssociateTeamName
      listingAssociateEmail
      listingAssociatePhone
      listingAssociateSupervisorName
      listingAssociateSupervisorLicenseNumber
      sellingAssociateName
      sellingAssociateLicenseNumber
      sellingAssociateTeamName
      sellingAssociateEmail
      sellingAssociatePhone
      sellingAssociateSupervisorName
      sellingAssociateSupervisorLicenseNumber
      sellingAssociateStreetAddress
      sellingAssociateCity
      sellingAssociateState
      sellingAssociatePostalCode
      __typename
    }
    markedQuestions
    homeownersAssociationAddendum {
      hasHomeownersAssociation
      storageKey
      associationName
      associationPhoneNumber
      requiresSubdivisionInfo
      receivedSubdivisionInfo
      requiresUpdatedResaleCertificate
      subdivisionInfoProvidedBy
      subdivisionInfoDaysToDeliver
      buyerFeesNotToExceed
      feeForTitleCompanyPaidBy
      __typename
    }
    leadBasedPaintAddendum {
      hasLeadBasedPaintDisclosure
      storageKey
      leadBasedPaintDisclosure
      __typename
    }
    rightToTerminateByLenderAppraisalAddendum {
      hasRightToTerminateByLenderAppraisal
      storageKey
      appraisalAmount
      __typename
    }
    sellerTemporaryLeaseAddendum {
      hasSellersTemporaryLease
      storageKey
      leaseLength
      __typename
    }
    createdAt
    updatedAt
    accountContractId
    owner
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateContractSubscriptionVariables,
  APITypes.OnUpdateContractSubscription
>;
export const onDeleteContract = /* GraphQL */ `subscription OnDeleteContract(
  $filter: ModelSubscriptionContractFilterInput
  $owner: String
) {
  onDeleteContract(filter: $filter, owner: $owner) {
    id
    buyers {
      primaryName
      phone
      fax
      email
      hasSecondaryParty
      secondaryName
      secondaryPhone
      secondaryFax
      secondaryEmail
      __typename
    }
    property {
      lot
      block
      county
      legalDescription
      mlsNumber
      streetAddress
      city
      state
      postalCode
      subdivision
      yearBuilt
      numBedroom
      numBathroom
      numFloor
      floorSizeValue
      floorSizeUnit
      lotSizeValue
      lotSizeUnit
      mostRecentPriceAmount
      mostRecentPriceDate
      dateAdded
      dateUpdated
      description
      imageUrl
      __typename
    }
    finance {
      hasPreferredLender
      wantsLenderReferral
      buyerApprovalNoticeDays
      cashAmount
      fhaVaAppraisedValue
      fhaSectionNumber
      financingType
      interestRate
      interestRateYears
      isBuyerApprovalRequired
      isSecondMortgage
      loanType
      originationChargePercent
      otherFinancingLenderName
      otherFinancingWaiveRights
      principalAmount
      reverseMortgageIsFHAInsured
      storageKey
      termYears
      totalSalesPrice
      terminationOnAppraisalType
      terminationOpinionOfValueAmount
      terminationDaysAfterEffectiveDate
      terminationAppraisedValueLessThan
      __typename
    }
    leases {
      hasResidentialLease
      hasFixtureLease
      hasMineralLease
      mineralLeaseCopyDelivered
      mineralLeaseDaysToDeliveryCopy
      __typename
    }
    sellers {
      primaryName
      phone
      fax
      email
      hasSecondaryParty
      secondaryName
      secondaryPhone
      secondaryFax
      secondaryEmail
      __typename
    }
    title {
      hasTitleCompany
      wantsTitleReferral
      titleCompanyName
      titleCompanyStreetAddress
      titleCompanyCity
      titleCompanyState
      titleCompanyPostalCode
      standardExceptionsToBeAmended
      standardExceptionsToBeAmendedBy
      titleFurnishingParty
      escrowAgentName
      earnestMoney
      hasOptionFee
      optionFee
      hasAdditionalEarnestMoney
      additionalEarnestMoney
      additionalEarnestMoneyDaysToDeliver
      optionPeriodDaysToTerminate
      __typename
    }
    titleObjections {
      objections
      daysToObject
      __typename
    }
    survey {
      daysToFurnish
      type
      furnishingPartyIfExistingIsUnacceptable
      __typename
    }
    titleNotices {
      isInMUD
      isInCoastalArea
      isInPublicImprovementDistrict
      isInPropaneServiceArea
      __typename
    }
    propertyCondition {
      sellerDisclosureReceived
      sellerDisclosureDaysToProduce
      sellerRequiredToDisclose
      buyerAcceptsAsIs
      retainedImprovements
      buyerAcceptanceRepairSpecifics
      serviceContractReimbursementAmount
      __typename
    }
    brokerDisclosure {
      buyerIsThirdPartyAgent
      buyerIsRelatedToSeller
      buyerHasStakeInProperty
      buyerIsBeingCompensated
      buyerDisclosure
      __typename
    }
    closing {
      closingDate
      __typename
    }
    possession {
      possessionUponClosing
      possessionAccordingToTempLease
      __typename
    }
    buyerProvisions {
      buyerProvisions
      additionalExpensesPaidBySeller
      __typename
    }
    buyerNotices {
      deliverToAddress
      streetAddress
      city
      state
      postalCode
      deliverByPhone
      phone
      deliverByEmailFax1
      emailFax1
      deliveryByEmailFax2
      emailFax2
      deliverToAgent
      agentContact
      __typename
    }
    sellerNotices {
      deliverToAddress
      streetAddress
      city
      state
      postalCode
      deliverByPhone
      phone
      deliverByEmailFax1
      emailFax1
      deliveryByEmailFax2
      emailFax2
      deliverToAgent
      agentContact
      __typename
    }
    buyerAttorney {
      hasAttorney
      name
      streetAddress
      city
      state
      postalCode
      phone
      email
      fax
      __typename
    }
    buyerAgent {
      hasBuyerAgent
      firmName
      firmLicenseNumber
      firmStreetAddress
      firmCity
      firmState
      firmPostalCode
      firmPhone
      associateName
      associateLicenseNumber
      associateTeamName
      associateEmail
      associatePhone
      associateSupervisorName
      associateSupervisorLicenseNumber
      __typename
    }
    sellerAttorney {
      hasAttorney
      name
      streetAddress
      city
      state
      postalCode
      phone
      email
      fax
      __typename
    }
    listingAgent {
      hasListingAgentInfo
      firmName
      firmLicenseNumber
      firmStreetAddress
      firmCity
      firmState
      firmPostalCode
      firmPhone
      listingAssociateName
      listingAssociateLicenseNumber
      listingAssociateTeamName
      listingAssociateEmail
      listingAssociatePhone
      listingAssociateSupervisorName
      listingAssociateSupervisorLicenseNumber
      sellingAssociateName
      sellingAssociateLicenseNumber
      sellingAssociateTeamName
      sellingAssociateEmail
      sellingAssociatePhone
      sellingAssociateSupervisorName
      sellingAssociateSupervisorLicenseNumber
      sellingAssociateStreetAddress
      sellingAssociateCity
      sellingAssociateState
      sellingAssociatePostalCode
      __typename
    }
    markedQuestions
    homeownersAssociationAddendum {
      hasHomeownersAssociation
      storageKey
      associationName
      associationPhoneNumber
      requiresSubdivisionInfo
      receivedSubdivisionInfo
      requiresUpdatedResaleCertificate
      subdivisionInfoProvidedBy
      subdivisionInfoDaysToDeliver
      buyerFeesNotToExceed
      feeForTitleCompanyPaidBy
      __typename
    }
    leadBasedPaintAddendum {
      hasLeadBasedPaintDisclosure
      storageKey
      leadBasedPaintDisclosure
      __typename
    }
    rightToTerminateByLenderAppraisalAddendum {
      hasRightToTerminateByLenderAppraisal
      storageKey
      appraisalAmount
      __typename
    }
    sellerTemporaryLeaseAddendum {
      hasSellersTemporaryLease
      storageKey
      leaseLength
      __typename
    }
    createdAt
    updatedAt
    accountContractId
    owner
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteContractSubscriptionVariables,
  APITypes.OnDeleteContractSubscription
>;
export const onCreateAccount = /* GraphQL */ `subscription OnCreateAccount(
  $filter: ModelSubscriptionAccountFilterInput
  $owner: String
) {
  onCreateAccount(filter: $filter, owner: $owner) {
    id
    email
    billingId
    contract {
      items {
        id
        buyers {
          primaryName
          phone
          fax
          email
          hasSecondaryParty
          secondaryName
          secondaryPhone
          secondaryFax
          secondaryEmail
          __typename
        }
        property {
          lot
          block
          county
          legalDescription
          mlsNumber
          streetAddress
          city
          state
          postalCode
          subdivision
          yearBuilt
          numBedroom
          numBathroom
          numFloor
          floorSizeValue
          floorSizeUnit
          lotSizeValue
          lotSizeUnit
          mostRecentPriceAmount
          mostRecentPriceDate
          dateAdded
          dateUpdated
          description
          imageUrl
          __typename
        }
        finance {
          hasPreferredLender
          wantsLenderReferral
          buyerApprovalNoticeDays
          cashAmount
          fhaVaAppraisedValue
          fhaSectionNumber
          financingType
          interestRate
          interestRateYears
          isBuyerApprovalRequired
          isSecondMortgage
          loanType
          originationChargePercent
          otherFinancingLenderName
          otherFinancingWaiveRights
          principalAmount
          reverseMortgageIsFHAInsured
          storageKey
          termYears
          totalSalesPrice
          terminationOnAppraisalType
          terminationOpinionOfValueAmount
          terminationDaysAfterEffectiveDate
          terminationAppraisedValueLessThan
          __typename
        }
        leases {
          hasResidentialLease
          hasFixtureLease
          hasMineralLease
          mineralLeaseCopyDelivered
          mineralLeaseDaysToDeliveryCopy
          __typename
        }
        sellers {
          primaryName
          phone
          fax
          email
          hasSecondaryParty
          secondaryName
          secondaryPhone
          secondaryFax
          secondaryEmail
          __typename
        }
        title {
          hasTitleCompany
          wantsTitleReferral
          titleCompanyName
          titleCompanyStreetAddress
          titleCompanyCity
          titleCompanyState
          titleCompanyPostalCode
          standardExceptionsToBeAmended
          standardExceptionsToBeAmendedBy
          titleFurnishingParty
          escrowAgentName
          earnestMoney
          hasOptionFee
          optionFee
          hasAdditionalEarnestMoney
          additionalEarnestMoney
          additionalEarnestMoneyDaysToDeliver
          optionPeriodDaysToTerminate
          __typename
        }
        titleObjections {
          objections
          daysToObject
          __typename
        }
        survey {
          daysToFurnish
          type
          furnishingPartyIfExistingIsUnacceptable
          __typename
        }
        titleNotices {
          isInMUD
          isInCoastalArea
          isInPublicImprovementDistrict
          isInPropaneServiceArea
          __typename
        }
        propertyCondition {
          sellerDisclosureReceived
          sellerDisclosureDaysToProduce
          sellerRequiredToDisclose
          buyerAcceptsAsIs
          retainedImprovements
          buyerAcceptanceRepairSpecifics
          serviceContractReimbursementAmount
          __typename
        }
        brokerDisclosure {
          buyerIsThirdPartyAgent
          buyerIsRelatedToSeller
          buyerHasStakeInProperty
          buyerIsBeingCompensated
          buyerDisclosure
          __typename
        }
        closing {
          closingDate
          __typename
        }
        possession {
          possessionUponClosing
          possessionAccordingToTempLease
          __typename
        }
        buyerProvisions {
          buyerProvisions
          additionalExpensesPaidBySeller
          __typename
        }
        buyerNotices {
          deliverToAddress
          streetAddress
          city
          state
          postalCode
          deliverByPhone
          phone
          deliverByEmailFax1
          emailFax1
          deliveryByEmailFax2
          emailFax2
          deliverToAgent
          agentContact
          __typename
        }
        sellerNotices {
          deliverToAddress
          streetAddress
          city
          state
          postalCode
          deliverByPhone
          phone
          deliverByEmailFax1
          emailFax1
          deliveryByEmailFax2
          emailFax2
          deliverToAgent
          agentContact
          __typename
        }
        buyerAttorney {
          hasAttorney
          name
          streetAddress
          city
          state
          postalCode
          phone
          email
          fax
          __typename
        }
        buyerAgent {
          hasBuyerAgent
          firmName
          firmLicenseNumber
          firmStreetAddress
          firmCity
          firmState
          firmPostalCode
          firmPhone
          associateName
          associateLicenseNumber
          associateTeamName
          associateEmail
          associatePhone
          associateSupervisorName
          associateSupervisorLicenseNumber
          __typename
        }
        sellerAttorney {
          hasAttorney
          name
          streetAddress
          city
          state
          postalCode
          phone
          email
          fax
          __typename
        }
        listingAgent {
          hasListingAgentInfo
          firmName
          firmLicenseNumber
          firmStreetAddress
          firmCity
          firmState
          firmPostalCode
          firmPhone
          listingAssociateName
          listingAssociateLicenseNumber
          listingAssociateTeamName
          listingAssociateEmail
          listingAssociatePhone
          listingAssociateSupervisorName
          listingAssociateSupervisorLicenseNumber
          sellingAssociateName
          sellingAssociateLicenseNumber
          sellingAssociateTeamName
          sellingAssociateEmail
          sellingAssociatePhone
          sellingAssociateSupervisorName
          sellingAssociateSupervisorLicenseNumber
          sellingAssociateStreetAddress
          sellingAssociateCity
          sellingAssociateState
          sellingAssociatePostalCode
          __typename
        }
        markedQuestions
        homeownersAssociationAddendum {
          hasHomeownersAssociation
          storageKey
          associationName
          associationPhoneNumber
          requiresSubdivisionInfo
          receivedSubdivisionInfo
          requiresUpdatedResaleCertificate
          subdivisionInfoProvidedBy
          subdivisionInfoDaysToDeliver
          buyerFeesNotToExceed
          feeForTitleCompanyPaidBy
          __typename
        }
        leadBasedPaintAddendum {
          hasLeadBasedPaintDisclosure
          storageKey
          leadBasedPaintDisclosure
          __typename
        }
        rightToTerminateByLenderAppraisalAddendum {
          hasRightToTerminateByLenderAppraisal
          storageKey
          appraisalAmount
          __typename
        }
        sellerTemporaryLeaseAddendum {
          hasSellersTemporaryLease
          storageKey
          leaseLength
          __typename
        }
        createdAt
        updatedAt
        accountContractId
        owner
        __typename
      }
      nextToken
      __typename
    }
    isPaid
    street1
    street2
    city
    state
    postalCode
    firstName
    middleInitial
    lastName
    owner
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateAccountSubscriptionVariables,
  APITypes.OnCreateAccountSubscription
>;
export const onUpdateAccount = /* GraphQL */ `subscription OnUpdateAccount(
  $filter: ModelSubscriptionAccountFilterInput
  $owner: String
) {
  onUpdateAccount(filter: $filter, owner: $owner) {
    id
    email
    billingId
    contract {
      items {
        id
        buyers {
          primaryName
          phone
          fax
          email
          hasSecondaryParty
          secondaryName
          secondaryPhone
          secondaryFax
          secondaryEmail
          __typename
        }
        property {
          lot
          block
          county
          legalDescription
          mlsNumber
          streetAddress
          city
          state
          postalCode
          subdivision
          yearBuilt
          numBedroom
          numBathroom
          numFloor
          floorSizeValue
          floorSizeUnit
          lotSizeValue
          lotSizeUnit
          mostRecentPriceAmount
          mostRecentPriceDate
          dateAdded
          dateUpdated
          description
          imageUrl
          __typename
        }
        finance {
          hasPreferredLender
          wantsLenderReferral
          buyerApprovalNoticeDays
          cashAmount
          fhaVaAppraisedValue
          fhaSectionNumber
          financingType
          interestRate
          interestRateYears
          isBuyerApprovalRequired
          isSecondMortgage
          loanType
          originationChargePercent
          otherFinancingLenderName
          otherFinancingWaiveRights
          principalAmount
          reverseMortgageIsFHAInsured
          storageKey
          termYears
          totalSalesPrice
          terminationOnAppraisalType
          terminationOpinionOfValueAmount
          terminationDaysAfterEffectiveDate
          terminationAppraisedValueLessThan
          __typename
        }
        leases {
          hasResidentialLease
          hasFixtureLease
          hasMineralLease
          mineralLeaseCopyDelivered
          mineralLeaseDaysToDeliveryCopy
          __typename
        }
        sellers {
          primaryName
          phone
          fax
          email
          hasSecondaryParty
          secondaryName
          secondaryPhone
          secondaryFax
          secondaryEmail
          __typename
        }
        title {
          hasTitleCompany
          wantsTitleReferral
          titleCompanyName
          titleCompanyStreetAddress
          titleCompanyCity
          titleCompanyState
          titleCompanyPostalCode
          standardExceptionsToBeAmended
          standardExceptionsToBeAmendedBy
          titleFurnishingParty
          escrowAgentName
          earnestMoney
          hasOptionFee
          optionFee
          hasAdditionalEarnestMoney
          additionalEarnestMoney
          additionalEarnestMoneyDaysToDeliver
          optionPeriodDaysToTerminate
          __typename
        }
        titleObjections {
          objections
          daysToObject
          __typename
        }
        survey {
          daysToFurnish
          type
          furnishingPartyIfExistingIsUnacceptable
          __typename
        }
        titleNotices {
          isInMUD
          isInCoastalArea
          isInPublicImprovementDistrict
          isInPropaneServiceArea
          __typename
        }
        propertyCondition {
          sellerDisclosureReceived
          sellerDisclosureDaysToProduce
          sellerRequiredToDisclose
          buyerAcceptsAsIs
          retainedImprovements
          buyerAcceptanceRepairSpecifics
          serviceContractReimbursementAmount
          __typename
        }
        brokerDisclosure {
          buyerIsThirdPartyAgent
          buyerIsRelatedToSeller
          buyerHasStakeInProperty
          buyerIsBeingCompensated
          buyerDisclosure
          __typename
        }
        closing {
          closingDate
          __typename
        }
        possession {
          possessionUponClosing
          possessionAccordingToTempLease
          __typename
        }
        buyerProvisions {
          buyerProvisions
          additionalExpensesPaidBySeller
          __typename
        }
        buyerNotices {
          deliverToAddress
          streetAddress
          city
          state
          postalCode
          deliverByPhone
          phone
          deliverByEmailFax1
          emailFax1
          deliveryByEmailFax2
          emailFax2
          deliverToAgent
          agentContact
          __typename
        }
        sellerNotices {
          deliverToAddress
          streetAddress
          city
          state
          postalCode
          deliverByPhone
          phone
          deliverByEmailFax1
          emailFax1
          deliveryByEmailFax2
          emailFax2
          deliverToAgent
          agentContact
          __typename
        }
        buyerAttorney {
          hasAttorney
          name
          streetAddress
          city
          state
          postalCode
          phone
          email
          fax
          __typename
        }
        buyerAgent {
          hasBuyerAgent
          firmName
          firmLicenseNumber
          firmStreetAddress
          firmCity
          firmState
          firmPostalCode
          firmPhone
          associateName
          associateLicenseNumber
          associateTeamName
          associateEmail
          associatePhone
          associateSupervisorName
          associateSupervisorLicenseNumber
          __typename
        }
        sellerAttorney {
          hasAttorney
          name
          streetAddress
          city
          state
          postalCode
          phone
          email
          fax
          __typename
        }
        listingAgent {
          hasListingAgentInfo
          firmName
          firmLicenseNumber
          firmStreetAddress
          firmCity
          firmState
          firmPostalCode
          firmPhone
          listingAssociateName
          listingAssociateLicenseNumber
          listingAssociateTeamName
          listingAssociateEmail
          listingAssociatePhone
          listingAssociateSupervisorName
          listingAssociateSupervisorLicenseNumber
          sellingAssociateName
          sellingAssociateLicenseNumber
          sellingAssociateTeamName
          sellingAssociateEmail
          sellingAssociatePhone
          sellingAssociateSupervisorName
          sellingAssociateSupervisorLicenseNumber
          sellingAssociateStreetAddress
          sellingAssociateCity
          sellingAssociateState
          sellingAssociatePostalCode
          __typename
        }
        markedQuestions
        homeownersAssociationAddendum {
          hasHomeownersAssociation
          storageKey
          associationName
          associationPhoneNumber
          requiresSubdivisionInfo
          receivedSubdivisionInfo
          requiresUpdatedResaleCertificate
          subdivisionInfoProvidedBy
          subdivisionInfoDaysToDeliver
          buyerFeesNotToExceed
          feeForTitleCompanyPaidBy
          __typename
        }
        leadBasedPaintAddendum {
          hasLeadBasedPaintDisclosure
          storageKey
          leadBasedPaintDisclosure
          __typename
        }
        rightToTerminateByLenderAppraisalAddendum {
          hasRightToTerminateByLenderAppraisal
          storageKey
          appraisalAmount
          __typename
        }
        sellerTemporaryLeaseAddendum {
          hasSellersTemporaryLease
          storageKey
          leaseLength
          __typename
        }
        createdAt
        updatedAt
        accountContractId
        owner
        __typename
      }
      nextToken
      __typename
    }
    isPaid
    street1
    street2
    city
    state
    postalCode
    firstName
    middleInitial
    lastName
    owner
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateAccountSubscriptionVariables,
  APITypes.OnUpdateAccountSubscription
>;
export const onDeleteAccount = /* GraphQL */ `subscription OnDeleteAccount(
  $filter: ModelSubscriptionAccountFilterInput
  $owner: String
) {
  onDeleteAccount(filter: $filter, owner: $owner) {
    id
    email
    billingId
    contract {
      items {
        id
        buyers {
          primaryName
          phone
          fax
          email
          hasSecondaryParty
          secondaryName
          secondaryPhone
          secondaryFax
          secondaryEmail
          __typename
        }
        property {
          lot
          block
          county
          legalDescription
          mlsNumber
          streetAddress
          city
          state
          postalCode
          subdivision
          yearBuilt
          numBedroom
          numBathroom
          numFloor
          floorSizeValue
          floorSizeUnit
          lotSizeValue
          lotSizeUnit
          mostRecentPriceAmount
          mostRecentPriceDate
          dateAdded
          dateUpdated
          description
          imageUrl
          __typename
        }
        finance {
          hasPreferredLender
          wantsLenderReferral
          buyerApprovalNoticeDays
          cashAmount
          fhaVaAppraisedValue
          fhaSectionNumber
          financingType
          interestRate
          interestRateYears
          isBuyerApprovalRequired
          isSecondMortgage
          loanType
          originationChargePercent
          otherFinancingLenderName
          otherFinancingWaiveRights
          principalAmount
          reverseMortgageIsFHAInsured
          storageKey
          termYears
          totalSalesPrice
          terminationOnAppraisalType
          terminationOpinionOfValueAmount
          terminationDaysAfterEffectiveDate
          terminationAppraisedValueLessThan
          __typename
        }
        leases {
          hasResidentialLease
          hasFixtureLease
          hasMineralLease
          mineralLeaseCopyDelivered
          mineralLeaseDaysToDeliveryCopy
          __typename
        }
        sellers {
          primaryName
          phone
          fax
          email
          hasSecondaryParty
          secondaryName
          secondaryPhone
          secondaryFax
          secondaryEmail
          __typename
        }
        title {
          hasTitleCompany
          wantsTitleReferral
          titleCompanyName
          titleCompanyStreetAddress
          titleCompanyCity
          titleCompanyState
          titleCompanyPostalCode
          standardExceptionsToBeAmended
          standardExceptionsToBeAmendedBy
          titleFurnishingParty
          escrowAgentName
          earnestMoney
          hasOptionFee
          optionFee
          hasAdditionalEarnestMoney
          additionalEarnestMoney
          additionalEarnestMoneyDaysToDeliver
          optionPeriodDaysToTerminate
          __typename
        }
        titleObjections {
          objections
          daysToObject
          __typename
        }
        survey {
          daysToFurnish
          type
          furnishingPartyIfExistingIsUnacceptable
          __typename
        }
        titleNotices {
          isInMUD
          isInCoastalArea
          isInPublicImprovementDistrict
          isInPropaneServiceArea
          __typename
        }
        propertyCondition {
          sellerDisclosureReceived
          sellerDisclosureDaysToProduce
          sellerRequiredToDisclose
          buyerAcceptsAsIs
          retainedImprovements
          buyerAcceptanceRepairSpecifics
          serviceContractReimbursementAmount
          __typename
        }
        brokerDisclosure {
          buyerIsThirdPartyAgent
          buyerIsRelatedToSeller
          buyerHasStakeInProperty
          buyerIsBeingCompensated
          buyerDisclosure
          __typename
        }
        closing {
          closingDate
          __typename
        }
        possession {
          possessionUponClosing
          possessionAccordingToTempLease
          __typename
        }
        buyerProvisions {
          buyerProvisions
          additionalExpensesPaidBySeller
          __typename
        }
        buyerNotices {
          deliverToAddress
          streetAddress
          city
          state
          postalCode
          deliverByPhone
          phone
          deliverByEmailFax1
          emailFax1
          deliveryByEmailFax2
          emailFax2
          deliverToAgent
          agentContact
          __typename
        }
        sellerNotices {
          deliverToAddress
          streetAddress
          city
          state
          postalCode
          deliverByPhone
          phone
          deliverByEmailFax1
          emailFax1
          deliveryByEmailFax2
          emailFax2
          deliverToAgent
          agentContact
          __typename
        }
        buyerAttorney {
          hasAttorney
          name
          streetAddress
          city
          state
          postalCode
          phone
          email
          fax
          __typename
        }
        buyerAgent {
          hasBuyerAgent
          firmName
          firmLicenseNumber
          firmStreetAddress
          firmCity
          firmState
          firmPostalCode
          firmPhone
          associateName
          associateLicenseNumber
          associateTeamName
          associateEmail
          associatePhone
          associateSupervisorName
          associateSupervisorLicenseNumber
          __typename
        }
        sellerAttorney {
          hasAttorney
          name
          streetAddress
          city
          state
          postalCode
          phone
          email
          fax
          __typename
        }
        listingAgent {
          hasListingAgentInfo
          firmName
          firmLicenseNumber
          firmStreetAddress
          firmCity
          firmState
          firmPostalCode
          firmPhone
          listingAssociateName
          listingAssociateLicenseNumber
          listingAssociateTeamName
          listingAssociateEmail
          listingAssociatePhone
          listingAssociateSupervisorName
          listingAssociateSupervisorLicenseNumber
          sellingAssociateName
          sellingAssociateLicenseNumber
          sellingAssociateTeamName
          sellingAssociateEmail
          sellingAssociatePhone
          sellingAssociateSupervisorName
          sellingAssociateSupervisorLicenseNumber
          sellingAssociateStreetAddress
          sellingAssociateCity
          sellingAssociateState
          sellingAssociatePostalCode
          __typename
        }
        markedQuestions
        homeownersAssociationAddendum {
          hasHomeownersAssociation
          storageKey
          associationName
          associationPhoneNumber
          requiresSubdivisionInfo
          receivedSubdivisionInfo
          requiresUpdatedResaleCertificate
          subdivisionInfoProvidedBy
          subdivisionInfoDaysToDeliver
          buyerFeesNotToExceed
          feeForTitleCompanyPaidBy
          __typename
        }
        leadBasedPaintAddendum {
          hasLeadBasedPaintDisclosure
          storageKey
          leadBasedPaintDisclosure
          __typename
        }
        rightToTerminateByLenderAppraisalAddendum {
          hasRightToTerminateByLenderAppraisal
          storageKey
          appraisalAmount
          __typename
        }
        sellerTemporaryLeaseAddendum {
          hasSellersTemporaryLease
          storageKey
          leaseLength
          __typename
        }
        createdAt
        updatedAt
        accountContractId
        owner
        __typename
      }
      nextToken
      __typename
    }
    isPaid
    street1
    street2
    city
    state
    postalCode
    firstName
    middleInitial
    lastName
    owner
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteAccountSubscriptionVariables,
  APITypes.OnDeleteAccountSubscription
>;
