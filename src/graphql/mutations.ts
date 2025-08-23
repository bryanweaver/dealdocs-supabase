/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createAccount = /* GraphQL */ `mutation CreateAccount(
  $input: CreateAccountInput!
  $condition: ModelAccountConditionInput
) {
  createAccount(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateAccountMutationVariables,
  APITypes.CreateAccountMutation
>;
export const createEmailPacket = /* GraphQL */ `mutation CreateEmailPacket(
  $input: CreateEmailPacketInput!
  $condition: ModelEmailPacketConditionInput
) {
  createEmailPacket(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateEmailPacketMutationVariables,
  APITypes.CreateEmailPacketMutation
>;
export const updateEmailPacket = /* GraphQL */ `mutation UpdateEmailPacket(
  $input: UpdateEmailPacketInput!
  $condition: ModelEmailPacketConditionInput
) {
  updateEmailPacket(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateEmailPacketMutationVariables,
  APITypes.UpdateEmailPacketMutation
>;
export const deleteEmailPacket = /* GraphQL */ `mutation DeleteEmailPacket(
  $input: DeleteEmailPacketInput!
  $condition: ModelEmailPacketConditionInput
) {
  deleteEmailPacket(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteEmailPacketMutationVariables,
  APITypes.DeleteEmailPacketMutation
>;
export const createListingAgentContactInfo =
  /* GraphQL */ `mutation CreateListingAgentContactInfo(
  $input: CreateListingAgentContactInfoInput!
  $condition: ModelListingAgentContactInfoConditionInput
) {
  createListingAgentContactInfo(input: $input, condition: $condition) {
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
` as GeneratedMutation<
    APITypes.CreateListingAgentContactInfoMutationVariables,
    APITypes.CreateListingAgentContactInfoMutation
  >;
export const updateListingAgentContactInfo =
  /* GraphQL */ `mutation UpdateListingAgentContactInfo(
  $input: UpdateListingAgentContactInfoInput!
  $condition: ModelListingAgentContactInfoConditionInput
) {
  updateListingAgentContactInfo(input: $input, condition: $condition) {
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
` as GeneratedMutation<
    APITypes.UpdateListingAgentContactInfoMutationVariables,
    APITypes.UpdateListingAgentContactInfoMutation
  >;
export const deleteListingAgentContactInfo =
  /* GraphQL */ `mutation DeleteListingAgentContactInfo(
  $input: DeleteListingAgentContactInfoInput!
  $condition: ModelListingAgentContactInfoConditionInput
) {
  deleteListingAgentContactInfo(input: $input, condition: $condition) {
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
` as GeneratedMutation<
    APITypes.DeleteListingAgentContactInfoMutationVariables,
    APITypes.DeleteListingAgentContactInfoMutation
  >;
export const createEtchPacket = /* GraphQL */ `mutation CreateEtchPacket(
  $input: CreateEtchPacketInput!
  $condition: ModelEtchPacketConditionInput
) {
  createEtchPacket(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateEtchPacketMutationVariables,
  APITypes.CreateEtchPacketMutation
>;
export const updateEtchPacket = /* GraphQL */ `mutation UpdateEtchPacket(
  $input: UpdateEtchPacketInput!
  $condition: ModelEtchPacketConditionInput
) {
  updateEtchPacket(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateEtchPacketMutationVariables,
  APITypes.UpdateEtchPacketMutation
>;
export const deleteEtchPacket = /* GraphQL */ `mutation DeleteEtchPacket(
  $input: DeleteEtchPacketInput!
  $condition: ModelEtchPacketConditionInput
) {
  deleteEtchPacket(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteEtchPacketMutationVariables,
  APITypes.DeleteEtchPacketMutation
>;
export const createContract = /* GraphQL */ `mutation CreateContract(
  $input: CreateContractInput!
  $condition: ModelContractConditionInput
) {
  createContract(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateContractMutationVariables,
  APITypes.CreateContractMutation
>;
export const updateContract = /* GraphQL */ `mutation UpdateContract(
  $input: UpdateContractInput!
  $condition: ModelContractConditionInput
) {
  updateContract(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateContractMutationVariables,
  APITypes.UpdateContractMutation
>;
export const deleteContract = /* GraphQL */ `mutation DeleteContract(
  $input: DeleteContractInput!
  $condition: ModelContractConditionInput
) {
  deleteContract(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteContractMutationVariables,
  APITypes.DeleteContractMutation
>;
export const updateAccount = /* GraphQL */ `mutation UpdateAccount(
  $input: UpdateAccountInput!
  $condition: ModelAccountConditionInput
) {
  updateAccount(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateAccountMutationVariables,
  APITypes.UpdateAccountMutation
>;
export const deleteAccount = /* GraphQL */ `mutation DeleteAccount(
  $input: DeleteAccountInput!
  $condition: ModelAccountConditionInput
) {
  deleteAccount(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteAccountMutationVariables,
  APITypes.DeleteAccountMutation
>;
