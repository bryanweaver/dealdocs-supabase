/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const countAgentsBySource =
  /* GraphQL */ `query CountAgentsBySource($source: String!) {
  countAgentsBySource(source: $source) {
    count
    __typename
  }
}
` as GeneratedQuery<
    APITypes.CountAgentsBySourceQueryVariables,
    APITypes.CountAgentsBySourceQuery
  >;
export const scanListingAgentContactInfos =
  /* GraphQL */ `query ScanListingAgentContactInfos(
  $query: String!
  $limit: Int
  $nextToken: String
) {
  scanListingAgentContactInfos(
    query: $query
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
    APITypes.ScanListingAgentContactInfosQueryVariables,
    APITypes.ScanListingAgentContactInfosQuery
  >;
export const getEmailPacket = /* GraphQL */ `query GetEmailPacket($id: ID!) {
  getEmailPacket(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetEmailPacketQueryVariables,
  APITypes.GetEmailPacketQuery
>;
export const listEmailPackets = /* GraphQL */ `query ListEmailPackets(
  $filter: ModelEmailPacketFilterInput
  $limit: Int
  $nextToken: String
) {
  listEmailPackets(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListEmailPacketsQueryVariables,
  APITypes.ListEmailPacketsQuery
>;
export const getListingAgentContactInfo =
  /* GraphQL */ `query GetListingAgentContactInfo($id: ID!) {
  getListingAgentContactInfo(id: $id) {
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
` as GeneratedQuery<
    APITypes.GetListingAgentContactInfoQueryVariables,
    APITypes.GetListingAgentContactInfoQuery
  >;
export const listListingAgentContactInfos =
  /* GraphQL */ `query ListListingAgentContactInfos(
  $filter: ModelListingAgentContactInfoFilterInput
  $limit: Int
  $nextToken: String
) {
  listListingAgentContactInfos(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
    APITypes.ListListingAgentContactInfosQueryVariables,
    APITypes.ListListingAgentContactInfosQuery
  >;
export const emailPacketsByAccountId =
  /* GraphQL */ `query EmailPacketsByAccountId(
  $accountId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelEmailPacketFilterInput
  $limit: Int
  $nextToken: String
) {
  emailPacketsByAccountId(
    accountId: $accountId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
    APITypes.EmailPacketsByAccountIdQueryVariables,
    APITypes.EmailPacketsByAccountIdQuery
  >;
export const emailPacketsByContractId =
  /* GraphQL */ `query EmailPacketsByContractId(
  $contractId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelEmailPacketFilterInput
  $limit: Int
  $nextToken: String
) {
  emailPacketsByContractId(
    contractId: $contractId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
    APITypes.EmailPacketsByContractIdQueryVariables,
    APITypes.EmailPacketsByContractIdQuery
  >;
export const listListingAgentContactInfosByName =
  /* GraphQL */ `query ListListingAgentContactInfosByName(
  $name: String!
  $sortDirection: ModelSortDirection
  $filter: ModelListingAgentContactInfoFilterInput
  $limit: Int
  $nextToken: String
) {
  listListingAgentContactInfosByName(
    name: $name
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
    APITypes.ListListingAgentContactInfosByNameQueryVariables,
    APITypes.ListListingAgentContactInfosByNameQuery
  >;
export const getEtchPacket = /* GraphQL */ `query GetEtchPacket($eid: String!) {
  getEtchPacket(eid: $eid) {
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
` as GeneratedQuery<
  APITypes.GetEtchPacketQueryVariables,
  APITypes.GetEtchPacketQuery
>;
export const listEtchPackets = /* GraphQL */ `query ListEtchPackets(
  $eid: String
  $filter: ModelEtchPacketFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listEtchPackets(
    eid: $eid
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListEtchPacketsQueryVariables,
  APITypes.ListEtchPacketsQuery
>;
export const etchPacketsByContractId =
  /* GraphQL */ `query EtchPacketsByContractId(
  $contractId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelEtchPacketFilterInput
  $limit: Int
  $nextToken: String
) {
  etchPacketsByContractId(
    contractId: $contractId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
    APITypes.EtchPacketsByContractIdQueryVariables,
    APITypes.EtchPacketsByContractIdQuery
  >;
export const getContract = /* GraphQL */ `query GetContract($id: ID!) {
  getContract(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetContractQueryVariables,
  APITypes.GetContractQuery
>;
export const listContracts = /* GraphQL */ `query ListContracts(
  $filter: ModelContractFilterInput
  $limit: Int
  $nextToken: String
) {
  listContracts(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
}
` as GeneratedQuery<
  APITypes.ListContractsQueryVariables,
  APITypes.ListContractsQuery
>;
export const getAccount = /* GraphQL */ `query GetAccount($id: ID!) {
  getAccount(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetAccountQueryVariables,
  APITypes.GetAccountQuery
>;
export const listAccounts = /* GraphQL */ `query ListAccounts(
  $filter: ModelAccountFilterInput
  $limit: Int
  $nextToken: String
) {
  listAccounts(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      email
      billingId
      contract {
        items {
          id
          markedQuestions
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAccountsQueryVariables,
  APITypes.ListAccountsQuery
>;
export const accountsByOwner = /* GraphQL */ `query AccountsByOwner(
  $owner: String!
  $sortDirection: ModelSortDirection
  $filter: ModelAccountFilterInput
  $limit: Int
  $nextToken: String
) {
  accountsByOwner(
    owner: $owner
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      email
      billingId
      contract {
        items {
          id
          markedQuestions
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.AccountsByOwnerQueryVariables,
  APITypes.AccountsByOwnerQuery
>;
