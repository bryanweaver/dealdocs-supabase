/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateAccountInput = {
  id?: string | null;
  email: string;
  billingId?: string | null;
  isPaid?: boolean | null;
  street1?: string | null;
  street2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  firstName?: string | null;
  middleInitial?: string | null;
  lastName?: string | null;
  owner: string;
};

export type ModelAccountConditionInput = {
  email?: ModelStringInput | null;
  billingId?: ModelStringInput | null;
  isPaid?: ModelBooleanInput | null;
  street1?: ModelStringInput | null;
  street2?: ModelStringInput | null;
  city?: ModelStringInput | null;
  state?: ModelStringInput | null;
  postalCode?: ModelStringInput | null;
  firstName?: ModelStringInput | null;
  middleInitial?: ModelStringInput | null;
  lastName?: ModelStringInput | null;
  owner?: ModelStringInput | null;
  and?: Array<ModelAccountConditionInput | null> | null;
  or?: Array<ModelAccountConditionInput | null> | null;
  not?: ModelAccountConditionInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
};

export type ModelStringInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}

export type ModelSizeInput = {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
};

export type ModelBooleanInput = {
  ne?: boolean | null;
  eq?: boolean | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
};

export type Account = {
  __typename: "Account";
  id: string;
  email: string;
  billingId?: string | null;
  contract?: ModelContractConnection | null;
  isPaid?: boolean | null;
  street1?: string | null;
  street2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  firstName?: string | null;
  middleInitial?: string | null;
  lastName?: string | null;
  owner: string;
  createdAt: string;
  updatedAt: string;
};

export type ModelContractConnection = {
  __typename: "ModelContractConnection";
  items: Array<Contract | null>;
  nextToken?: string | null;
};

export type Contract = {
  __typename: "Contract";
  id: string;
  buyers?: ContractParty | null;
  property?: Property | null;
  finance?: Finance | null;
  leases?: Leases | null;
  sellers?: ContractParty | null;
  title?: TitleDetail | null;
  titleObjections?: TitleObjections | null;
  survey?: SurveyDetail | null;
  titleNotices?: TitleNotices | null;
  propertyCondition?: PropertyCondition | null;
  brokerDisclosure?: BrokerDisclosure | null;
  closing?: ClosingDetail | null;
  possession?: PossessionDetail | null;
  buyerProvisions?: BuyerProvisionsDetail | null;
  buyerNotices?: NoticesDetail | null;
  sellerNotices?: NoticesDetail | null;
  buyerAttorney?: Attorney | null;
  buyerAgent?: BuyerAgent | null;
  sellerAttorney?: Attorney | null;
  listingAgent?: ListingAgent | null;
  markedQuestions?: string | null;
  homeownersAssociationAddendum?: HomeownersAssociationAddendum | null;
  leadBasedPaintAddendum?: LeadBasedPaintAddendum | null;
  rightToTerminateByLenderAppraisalAddendum?: RightToTerminateByLenderAppraisalAddendum | null;
  sellerTemporaryLeaseAddendum?: SellerTemporaryLeaseAddendum | null;
  createdAt: string;
  updatedAt: string;
  accountContractId?: string | null;
  owner?: string | null;
};

export type ContractParty = {
  __typename: "ContractParty";
  primaryName?: string | null;
  phone?: string | null;
  fax?: string | null;
  email?: string | null;
  hasSecondaryParty?: boolean | null;
  secondaryName?: string | null;
  secondaryPhone?: string | null;
  secondaryFax?: string | null;
  secondaryEmail?: string | null;
};

export type Property = {
  __typename: "Property";
  lot?: string | null;
  block?: string | null;
  county?: string | null;
  legalDescription?: string | null;
  mlsNumber?: string | null;
  streetAddress?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  subdivision?: string | null;
  yearBuilt?: number | null;
  numBedroom?: number | null;
  numBathroom?: number | null;
  numFloor?: number | null;
  floorSizeValue?: number | null;
  floorSizeUnit?: string | null;
  lotSizeValue?: number | null;
  lotSizeUnit?: string | null;
  mostRecentPriceAmount?: number | null;
  mostRecentPriceDate?: string | null;
  dateAdded?: string | null;
  dateUpdated?: string | null;
  description?: string | null;
  imageUrl?: string | null;
};

export type Finance = {
  __typename: "Finance";
  hasPreferredLender?: boolean | null;
  wantsLenderReferral?: boolean | null;
  buyerApprovalNoticeDays?: number | null;
  cashAmount?: number | null;
  fhaVaAppraisedValue?: number | null;
  fhaSectionNumber?: number | null;
  financingType?: FinancingType | null;
  interestRate?: number | null;
  interestRateYears?: number | null;
  isBuyerApprovalRequired?: boolean | null;
  isSecondMortgage?: boolean | null;
  loanType?: LoanType | null;
  originationChargePercent?: number | null;
  otherFinancingLenderName?: string | null;
  otherFinancingWaiveRights?: boolean | null;
  principalAmount?: number | null;
  reverseMortgageIsFHAInsured?: boolean | null;
  storageKey?: string | null;
  termYears?: number | null;
  totalSalesPrice?: number | null;
  terminationOnAppraisalType?: TerminationOnAppraisalType | null;
  terminationOpinionOfValueAmount?: number | null;
  terminationDaysAfterEffectiveDate?: number | null;
  terminationAppraisedValueLessThan?: number | null;
};

export enum FinancingType {
  NONE = "NONE",
  BYTHIRDPARTY = "BYTHIRDPARTY",
  BYLOANASSUMPTION = "BYLOANASSUMPTION",
  BYSELLER = "BYSELLER",
}

export enum LoanType {
  CONVENTIONAL = "CONVENTIONAL",
  VA = "VA",
  FHA = "FHA",
  VAGUARANTEED = "VAGUARANTEED",
  USDAGUARANTEED = "USDAGUARANTEED",
  REVERSEMORTGAGE = "REVERSEMORTGAGE",
  OTHERFINANCING = "OTHERFINANCING",
}

export enum TerminationOnAppraisalType {
  WAIVER = "WAIVER",
  PARTIALWAIVER = "PARTIALWAIVER",
  ADDITIONALRIGHTTOTERMINATE = "ADDITIONALRIGHTTOTERMINATE",
}

export type Leases = {
  __typename: "Leases";
  hasResidentialLease?: boolean | null;
  hasFixtureLease?: boolean | null;
  hasMineralLease?: boolean | null;
  mineralLeaseCopyDelivered?: boolean | null;
  mineralLeaseDaysToDeliveryCopy?: number | null;
};

export type TitleDetail = {
  __typename: "TitleDetail";
  hasTitleCompany?: boolean | null;
  wantsTitleReferral?: boolean | null;
  titleCompanyName?: string | null;
  titleCompanyStreetAddress?: string | null;
  titleCompanyCity?: string | null;
  titleCompanyState?: string | null;
  titleCompanyPostalCode?: string | null;
  standardExceptionsToBeAmended?: boolean | null;
  standardExceptionsToBeAmendedBy?: PartyType | null;
  titleFurnishingParty?: PartyType | null;
  escrowAgentName?: string | null;
  earnestMoney?: number | null;
  hasOptionFee?: boolean | null;
  optionFee?: number | null;
  hasAdditionalEarnestMoney?: boolean | null;
  additionalEarnestMoney?: number | null;
  additionalEarnestMoneyDaysToDeliver?: number | null;
  optionPeriodDaysToTerminate?: number | null;
};

export enum PartyType {
  BUYER = "BUYER",
  SELLER = "SELLER",
}

export type TitleObjections = {
  __typename: "TitleObjections";
  objections?: string | null;
  daysToObject?: number | null;
};

export type SurveyDetail = {
  __typename: "SurveyDetail";
  daysToFurnish?: number | null;
  type?: SurveyType | null;
  furnishingPartyIfExistingIsUnacceptable?: PartyType | null;
};

export enum SurveyType {
  EXISTINGBYSELLER = "EXISTINGBYSELLER",
  NEWBYBUYER = "NEWBYBUYER",
  NEWBYSELLER = "NEWBYSELLER",
}

export type TitleNotices = {
  __typename: "TitleNotices";
  isInMUD?: boolean | null;
  isInCoastalArea?: boolean | null;
  isInPublicImprovementDistrict?: boolean | null;
  isInPropaneServiceArea?: boolean | null;
};

export type PropertyCondition = {
  __typename: "PropertyCondition";
  sellerDisclosureReceived?: boolean | null;
  sellerDisclosureDaysToProduce?: number | null;
  sellerRequiredToDisclose?: boolean | null;
  buyerAcceptsAsIs?: boolean | null;
  retainedImprovements?: string | null;
  buyerAcceptanceRepairSpecifics?: string | null;
  serviceContractReimbursementAmount?: number | null;
};

export type BrokerDisclosure = {
  __typename: "BrokerDisclosure";
  buyerIsThirdPartyAgent?: boolean | null;
  buyerIsRelatedToSeller?: boolean | null;
  buyerHasStakeInProperty?: boolean | null;
  buyerIsBeingCompensated?: boolean | null;
  buyerDisclosure?: string | null;
};

export type ClosingDetail = {
  __typename: "ClosingDetail";
  closingDate?: string | null;
};

export type PossessionDetail = {
  __typename: "PossessionDetail";
  possessionUponClosing?: boolean | null;
  possessionAccordingToTempLease?: boolean | null;
};

export type BuyerProvisionsDetail = {
  __typename: "BuyerProvisionsDetail";
  buyerProvisions?: string | null;
  additionalExpensesPaidBySeller?: number | null;
};

export type NoticesDetail = {
  __typename: "NoticesDetail";
  deliverToAddress?: boolean | null;
  streetAddress?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  deliverByPhone?: boolean | null;
  phone?: string | null;
  deliverByEmailFax1?: boolean | null;
  emailFax1?: string | null;
  deliveryByEmailFax2?: boolean | null;
  emailFax2?: string | null;
  deliverToAgent?: boolean | null;
  agentContact?: string | null;
};

export type Attorney = {
  __typename: "Attorney";
  hasAttorney?: boolean | null;
  name?: string | null;
  streetAddress?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  phone?: string | null;
  email?: string | null;
  fax?: string | null;
};

export type BuyerAgent = {
  __typename: "BuyerAgent";
  hasBuyerAgent?: boolean | null;
  firmName?: string | null;
  firmLicenseNumber?: string | null;
  firmStreetAddress?: string | null;
  firmCity?: string | null;
  firmState?: string | null;
  firmPostalCode?: string | null;
  firmPhone?: string | null;
  associateName?: string | null;
  associateLicenseNumber?: string | null;
  associateTeamName?: string | null;
  associateEmail?: string | null;
  associatePhone?: string | null;
  associateSupervisorName?: string | null;
  associateSupervisorLicenseNumber?: string | null;
};

export type ListingAgent = {
  __typename: "ListingAgent";
  hasListingAgentInfo?: boolean | null;
  firmName?: string | null;
  firmLicenseNumber?: string | null;
  firmStreetAddress?: string | null;
  firmCity?: string | null;
  firmState?: string | null;
  firmPostalCode?: string | null;
  firmPhone?: string | null;
  listingAssociateName?: string | null;
  listingAssociateLicenseNumber?: string | null;
  listingAssociateTeamName?: string | null;
  listingAssociateEmail?: string | null;
  listingAssociatePhone?: string | null;
  listingAssociateSupervisorName?: string | null;
  listingAssociateSupervisorLicenseNumber?: string | null;
  sellingAssociateName?: string | null;
  sellingAssociateLicenseNumber?: string | null;
  sellingAssociateTeamName?: string | null;
  sellingAssociateEmail?: string | null;
  sellingAssociatePhone?: string | null;
  sellingAssociateSupervisorName?: string | null;
  sellingAssociateSupervisorLicenseNumber?: string | null;
  sellingAssociateStreetAddress?: string | null;
  sellingAssociateCity?: string | null;
  sellingAssociateState?: string | null;
  sellingAssociatePostalCode?: string | null;
};

export type HomeownersAssociationAddendum = {
  __typename: "HomeownersAssociationAddendum";
  hasHomeownersAssociation?: boolean | null;
  storageKey?: string | null;
  associationName?: string | null;
  associationPhoneNumber?: string | null;
  requiresSubdivisionInfo?: boolean | null;
  receivedSubdivisionInfo?: boolean | null;
  requiresUpdatedResaleCertificate?: boolean | null;
  subdivisionInfoProvidedBy?: PartyType | null;
  subdivisionInfoDaysToDeliver?: number | null;
  buyerFeesNotToExceed?: number | null;
  feeForTitleCompanyPaidBy?: PartyType | null;
};

export type LeadBasedPaintAddendum = {
  __typename: "LeadBasedPaintAddendum";
  hasLeadBasedPaintDisclosure?: boolean | null;
  storageKey?: string | null;
  leadBasedPaintDisclosure?: string | null;
};

export type RightToTerminateByLenderAppraisalAddendum = {
  __typename: "RightToTerminateByLenderAppraisalAddendum";
  hasRightToTerminateByLenderAppraisal?: boolean | null;
  storageKey?: string | null;
  appraisalAmount?: number | null;
};

export type SellerTemporaryLeaseAddendum = {
  __typename: "SellerTemporaryLeaseAddendum";
  hasSellersTemporaryLease?: boolean | null;
  storageKey?: string | null;
  leaseLength?: number | null;
};

export type CreateEmailPacketInput = {
  id?: string | null;
  accountId: string;
  contractId: string;
  streetAddress: string;
  agentEmail: string;
  agentName: string;
  status: string;
  comments?: string | null;
  subject: string;
  body: string;
  contractFiles: Array<string>;
  preApprovalFile: string;
  earnestFile: string;
  optionFile: string;
};

export type ModelEmailPacketConditionInput = {
  accountId?: ModelIDInput | null;
  contractId?: ModelIDInput | null;
  streetAddress?: ModelStringInput | null;
  agentEmail?: ModelStringInput | null;
  agentName?: ModelStringInput | null;
  status?: ModelStringInput | null;
  comments?: ModelStringInput | null;
  subject?: ModelStringInput | null;
  body?: ModelStringInput | null;
  contractFiles?: ModelStringInput | null;
  preApprovalFile?: ModelStringInput | null;
  earnestFile?: ModelStringInput | null;
  optionFile?: ModelStringInput | null;
  and?: Array<ModelEmailPacketConditionInput | null> | null;
  or?: Array<ModelEmailPacketConditionInput | null> | null;
  not?: ModelEmailPacketConditionInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
};

export type ModelIDInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
};

export type EmailPacket = {
  __typename: "EmailPacket";
  id: string;
  accountId: string;
  contractId: string;
  streetAddress: string;
  agentEmail: string;
  agentName: string;
  status: string;
  comments?: string | null;
  subject: string;
  body: string;
  contractFiles: Array<string>;
  preApprovalFile: string;
  earnestFile: string;
  optionFile: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateEmailPacketInput = {
  id: string;
  accountId?: string | null;
  contractId?: string | null;
  streetAddress?: string | null;
  agentEmail?: string | null;
  agentName?: string | null;
  status?: string | null;
  comments?: string | null;
  subject?: string | null;
  body?: string | null;
  contractFiles?: Array<string> | null;
  preApprovalFile?: string | null;
  earnestFile?: string | null;
  optionFile?: string | null;
};

export type DeleteEmailPacketInput = {
  id: string;
};

export type CreateListingAgentContactInfoInput = {
  id?: string | null;
  name?: string | null;
  agencyName?: string | null;
  profileUrl?: string | null;
  phoneNumbers?: Array<string | null> | null;
  emailAddresses?: Array<string | null> | null;
  source?: string | null;
  importDate?: string | null;
  notes?: string | null;
  metaData?: string | null;
};

export type ModelListingAgentContactInfoConditionInput = {
  name?: ModelStringInput | null;
  agencyName?: ModelStringInput | null;
  profileUrl?: ModelStringInput | null;
  phoneNumbers?: ModelStringInput | null;
  emailAddresses?: ModelStringInput | null;
  source?: ModelStringInput | null;
  importDate?: ModelStringInput | null;
  notes?: ModelStringInput | null;
  metaData?: ModelStringInput | null;
  and?: Array<ModelListingAgentContactInfoConditionInput | null> | null;
  or?: Array<ModelListingAgentContactInfoConditionInput | null> | null;
  not?: ModelListingAgentContactInfoConditionInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
};

export type ListingAgentContactInfo = {
  __typename: "ListingAgentContactInfo";
  id: string;
  name?: string | null;
  agencyName?: string | null;
  profileUrl?: string | null;
  phoneNumbers?: Array<string | null> | null;
  emailAddresses?: Array<string | null> | null;
  source?: string | null;
  importDate?: string | null;
  notes?: string | null;
  metaData?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UpdateListingAgentContactInfoInput = {
  id: string;
  name?: string | null;
  agencyName?: string | null;
  profileUrl?: string | null;
  phoneNumbers?: Array<string | null> | null;
  emailAddresses?: Array<string | null> | null;
  source?: string | null;
  importDate?: string | null;
  notes?: string | null;
  metaData?: string | null;
};

export type DeleteListingAgentContactInfoInput = {
  id: string;
};

export type CreateEtchPacketInput = {
  eid: string;
  documentGroup: DocumentGroupInput;
  contractId: string;
};

export type DocumentGroupInput = {
  eid: string;
  status: string;
  files: Array<DocumentGroupFileInput | null>;
  signers: Array<SignerInput | null>;
};

export type DocumentGroupFileInput = {
  downloadURL: string;
  filename: string;
  name: string;
  type: string;
};

export type SignerInput = {
  eid: string;
  aliasId: string;
  name: string;
  email: string;
  routingOrder: number;
  signActionType: string;
  status: string;
  uploadKeys?: Array<string | null> | null;
};

export type ModelEtchPacketConditionInput = {
  contractId?: ModelIDInput | null;
  and?: Array<ModelEtchPacketConditionInput | null> | null;
  or?: Array<ModelEtchPacketConditionInput | null> | null;
  not?: ModelEtchPacketConditionInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  owner?: ModelStringInput | null;
};

export type EtchPacket = {
  __typename: "EtchPacket";
  eid: string;
  documentGroup: DocumentGroup;
  contractId: string;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type DocumentGroup = {
  __typename: "DocumentGroup";
  eid: string;
  status: string;
  files: Array<DocumentGroupFile | null>;
  signers: Array<Signer | null>;
};

export type DocumentGroupFile = {
  __typename: "DocumentGroupFile";
  downloadURL: string;
  filename: string;
  name: string;
  type: string;
};

export type Signer = {
  __typename: "Signer";
  eid: string;
  aliasId: string;
  name: string;
  email: string;
  routingOrder: number;
  signActionType: string;
  status: string;
  uploadKeys?: Array<string | null> | null;
};

export type UpdateEtchPacketInput = {
  eid: string;
  documentGroup?: DocumentGroupInput | null;
  contractId?: string | null;
};

export type DeleteEtchPacketInput = {
  eid: string;
};

export type CreateContractInput = {
  id?: string | null;
  buyers?: ContractPartyInput | null;
  property?: PropertyInput | null;
  finance?: FinanceInput | null;
  leases?: LeasesInput | null;
  sellers?: ContractPartyInput | null;
  title?: TitleDetailInput | null;
  titleObjections?: TitleObjectionsInput | null;
  survey?: SurveyDetailInput | null;
  titleNotices?: TitleNoticesInput | null;
  propertyCondition?: PropertyConditionInput | null;
  brokerDisclosure?: BrokerDisclosureInput | null;
  closing?: ClosingDetailInput | null;
  possession?: PossessionDetailInput | null;
  buyerProvisions?: BuyerProvisionsDetailInput | null;
  buyerNotices?: NoticesDetailInput | null;
  sellerNotices?: NoticesDetailInput | null;
  buyerAttorney?: AttorneyInput | null;
  buyerAgent?: BuyerAgentInput | null;
  sellerAttorney?: AttorneyInput | null;
  listingAgent?: ListingAgentInput | null;
  markedQuestions?: string | null;
  homeownersAssociationAddendum?: HomeownersAssociationAddendumInput | null;
  leadBasedPaintAddendum?: LeadBasedPaintAddendumInput | null;
  rightToTerminateByLenderAppraisalAddendum?: RightToTerminateByLenderAppraisalAddendumInput | null;
  sellerTemporaryLeaseAddendum?: SellerTemporaryLeaseAddendumInput | null;
  accountContractId?: string | null;
};

export type ContractPartyInput = {
  primaryName?: string | null;
  phone?: string | null;
  fax?: string | null;
  email?: string | null;
  hasSecondaryParty?: boolean | null;
  secondaryName?: string | null;
  secondaryPhone?: string | null;
  secondaryFax?: string | null;
  secondaryEmail?: string | null;
};

export type PropertyInput = {
  lot?: string | null;
  block?: string | null;
  county?: string | null;
  legalDescription?: string | null;
  mlsNumber?: string | null;
  streetAddress?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  subdivision?: string | null;
  yearBuilt?: number | null;
  numBedroom?: number | null;
  numBathroom?: number | null;
  numFloor?: number | null;
  floorSizeValue?: number | null;
  floorSizeUnit?: string | null;
  lotSizeValue?: number | null;
  lotSizeUnit?: string | null;
  mostRecentPriceAmount?: number | null;
  mostRecentPriceDate?: string | null;
  dateAdded?: string | null;
  dateUpdated?: string | null;
  description?: string | null;
  imageUrl?: string | null;
};

export type FinanceInput = {
  hasPreferredLender?: boolean | null;
  wantsLenderReferral?: boolean | null;
  buyerApprovalNoticeDays?: number | null;
  cashAmount?: number | null;
  fhaVaAppraisedValue?: number | null;
  fhaSectionNumber?: number | null;
  financingType?: FinancingType | null;
  interestRate?: number | null;
  interestRateYears?: number | null;
  isBuyerApprovalRequired?: boolean | null;
  isSecondMortgage?: boolean | null;
  loanType?: LoanType | null;
  originationChargePercent?: number | null;
  otherFinancingLenderName?: string | null;
  otherFinancingWaiveRights?: boolean | null;
  principalAmount?: number | null;
  reverseMortgageIsFHAInsured?: boolean | null;
  storageKey?: string | null;
  termYears?: number | null;
  totalSalesPrice?: number | null;
  terminationOnAppraisalType?: TerminationOnAppraisalType | null;
  terminationOpinionOfValueAmount?: number | null;
  terminationDaysAfterEffectiveDate?: number | null;
  terminationAppraisedValueLessThan?: number | null;
};

export type LeasesInput = {
  hasResidentialLease?: boolean | null;
  hasFixtureLease?: boolean | null;
  hasMineralLease?: boolean | null;
  mineralLeaseCopyDelivered?: boolean | null;
  mineralLeaseDaysToDeliveryCopy?: number | null;
};

export type TitleDetailInput = {
  hasTitleCompany?: boolean | null;
  wantsTitleReferral?: boolean | null;
  titleCompanyName?: string | null;
  titleCompanyStreetAddress?: string | null;
  titleCompanyCity?: string | null;
  titleCompanyState?: string | null;
  titleCompanyPostalCode?: string | null;
  standardExceptionsToBeAmended?: boolean | null;
  standardExceptionsToBeAmendedBy?: PartyType | null;
  titleFurnishingParty?: PartyType | null;
  escrowAgentName?: string | null;
  earnestMoney?: number | null;
  hasOptionFee?: boolean | null;
  optionFee?: number | null;
  hasAdditionalEarnestMoney?: boolean | null;
  additionalEarnestMoney?: number | null;
  additionalEarnestMoneyDaysToDeliver?: number | null;
  optionPeriodDaysToTerminate?: number | null;
};

export type TitleObjectionsInput = {
  objections?: string | null;
  daysToObject?: number | null;
};

export type SurveyDetailInput = {
  daysToFurnish?: number | null;
  type?: SurveyType | null;
  furnishingPartyIfExistingIsUnacceptable?: PartyType | null;
};

export type TitleNoticesInput = {
  isInMUD?: boolean | null;
  isInCoastalArea?: boolean | null;
  isInPublicImprovementDistrict?: boolean | null;
  isInPropaneServiceArea?: boolean | null;
};

export type PropertyConditionInput = {
  sellerDisclosureReceived?: boolean | null;
  sellerDisclosureDaysToProduce?: number | null;
  sellerRequiredToDisclose?: boolean | null;
  buyerAcceptsAsIs?: boolean | null;
  retainedImprovements?: string | null;
  buyerAcceptanceRepairSpecifics?: string | null;
  serviceContractReimbursementAmount?: number | null;
};

export type BrokerDisclosureInput = {
  buyerIsThirdPartyAgent?: boolean | null;
  buyerIsRelatedToSeller?: boolean | null;
  buyerHasStakeInProperty?: boolean | null;
  buyerIsBeingCompensated?: boolean | null;
  buyerDisclosure?: string | null;
};

export type ClosingDetailInput = {
  closingDate?: string | null;
};

export type PossessionDetailInput = {
  possessionUponClosing?: boolean | null;
  possessionAccordingToTempLease?: boolean | null;
};

export type BuyerProvisionsDetailInput = {
  buyerProvisions?: string | null;
  additionalExpensesPaidBySeller?: number | null;
};

export type NoticesDetailInput = {
  deliverToAddress?: boolean | null;
  streetAddress?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  deliverByPhone?: boolean | null;
  phone?: string | null;
  deliverByEmailFax1?: boolean | null;
  emailFax1?: string | null;
  deliveryByEmailFax2?: boolean | null;
  emailFax2?: string | null;
  deliverToAgent?: boolean | null;
  agentContact?: string | null;
};

export type AttorneyInput = {
  hasAttorney?: boolean | null;
  name?: string | null;
  streetAddress?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  phone?: string | null;
  email?: string | null;
  fax?: string | null;
};

export type BuyerAgentInput = {
  hasBuyerAgent?: boolean | null;
  firmName?: string | null;
  firmLicenseNumber?: string | null;
  firmStreetAddress?: string | null;
  firmCity?: string | null;
  firmState?: string | null;
  firmPostalCode?: string | null;
  firmPhone?: string | null;
  associateName?: string | null;
  associateLicenseNumber?: string | null;
  associateTeamName?: string | null;
  associateEmail?: string | null;
  associatePhone?: string | null;
  associateSupervisorName?: string | null;
  associateSupervisorLicenseNumber?: string | null;
};

export type ListingAgentInput = {
  hasListingAgentInfo?: boolean | null;
  firmName?: string | null;
  firmLicenseNumber?: string | null;
  firmStreetAddress?: string | null;
  firmCity?: string | null;
  firmState?: string | null;
  firmPostalCode?: string | null;
  firmPhone?: string | null;
  listingAssociateName?: string | null;
  listingAssociateLicenseNumber?: string | null;
  listingAssociateTeamName?: string | null;
  listingAssociateEmail?: string | null;
  listingAssociatePhone?: string | null;
  listingAssociateSupervisorName?: string | null;
  listingAssociateSupervisorLicenseNumber?: string | null;
  sellingAssociateName?: string | null;
  sellingAssociateLicenseNumber?: string | null;
  sellingAssociateTeamName?: string | null;
  sellingAssociateEmail?: string | null;
  sellingAssociatePhone?: string | null;
  sellingAssociateSupervisorName?: string | null;
  sellingAssociateSupervisorLicenseNumber?: string | null;
  sellingAssociateStreetAddress?: string | null;
  sellingAssociateCity?: string | null;
  sellingAssociateState?: string | null;
  sellingAssociatePostalCode?: string | null;
};

export type HomeownersAssociationAddendumInput = {
  hasHomeownersAssociation?: boolean | null;
  storageKey?: string | null;
  associationName?: string | null;
  associationPhoneNumber?: string | null;
  requiresSubdivisionInfo?: boolean | null;
  receivedSubdivisionInfo?: boolean | null;
  requiresUpdatedResaleCertificate?: boolean | null;
  subdivisionInfoProvidedBy?: PartyType | null;
  subdivisionInfoDaysToDeliver?: number | null;
  buyerFeesNotToExceed?: number | null;
  feeForTitleCompanyPaidBy?: PartyType | null;
};

export type LeadBasedPaintAddendumInput = {
  hasLeadBasedPaintDisclosure?: boolean | null;
  storageKey?: string | null;
  leadBasedPaintDisclosure?: string | null;
};

export type RightToTerminateByLenderAppraisalAddendumInput = {
  hasRightToTerminateByLenderAppraisal?: boolean | null;
  storageKey?: string | null;
  appraisalAmount?: number | null;
};

export type SellerTemporaryLeaseAddendumInput = {
  hasSellersTemporaryLease?: boolean | null;
  storageKey?: string | null;
  leaseLength?: number | null;
};

export type ModelContractConditionInput = {
  markedQuestions?: ModelStringInput | null;
  and?: Array<ModelContractConditionInput | null> | null;
  or?: Array<ModelContractConditionInput | null> | null;
  not?: ModelContractConditionInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  accountContractId?: ModelIDInput | null;
  owner?: ModelStringInput | null;
};

export type UpdateContractInput = {
  id: string;
  buyers?: ContractPartyInput | null;
  property?: PropertyInput | null;
  finance?: FinanceInput | null;
  leases?: LeasesInput | null;
  sellers?: ContractPartyInput | null;
  title?: TitleDetailInput | null;
  titleObjections?: TitleObjectionsInput | null;
  survey?: SurveyDetailInput | null;
  titleNotices?: TitleNoticesInput | null;
  propertyCondition?: PropertyConditionInput | null;
  brokerDisclosure?: BrokerDisclosureInput | null;
  closing?: ClosingDetailInput | null;
  possession?: PossessionDetailInput | null;
  buyerProvisions?: BuyerProvisionsDetailInput | null;
  buyerNotices?: NoticesDetailInput | null;
  sellerNotices?: NoticesDetailInput | null;
  buyerAttorney?: AttorneyInput | null;
  buyerAgent?: BuyerAgentInput | null;
  sellerAttorney?: AttorneyInput | null;
  listingAgent?: ListingAgentInput | null;
  markedQuestions?: string | null;
  homeownersAssociationAddendum?: HomeownersAssociationAddendumInput | null;
  leadBasedPaintAddendum?: LeadBasedPaintAddendumInput | null;
  rightToTerminateByLenderAppraisalAddendum?: RightToTerminateByLenderAppraisalAddendumInput | null;
  sellerTemporaryLeaseAddendum?: SellerTemporaryLeaseAddendumInput | null;
  accountContractId?: string | null;
};

export type DeleteContractInput = {
  id: string;
};

export type UpdateAccountInput = {
  id: string;
  email?: string | null;
  billingId?: string | null;
  isPaid?: boolean | null;
  street1?: string | null;
  street2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  firstName?: string | null;
  middleInitial?: string | null;
  lastName?: string | null;
  owner?: string | null;
};

export type DeleteAccountInput = {
  id: string;
};

export type AgentCountResult = {
  __typename: "AgentCountResult";
  count: number;
};

export type ScanListingAgentContactInfoResult = {
  __typename: "ScanListingAgentContactInfoResult";
  items?: Array<ListingAgentContactInfo | null> | null;
  nextToken?: string | null;
};

export type ModelEmailPacketFilterInput = {
  id?: ModelIDInput | null;
  accountId?: ModelIDInput | null;
  contractId?: ModelIDInput | null;
  streetAddress?: ModelStringInput | null;
  agentEmail?: ModelStringInput | null;
  agentName?: ModelStringInput | null;
  status?: ModelStringInput | null;
  comments?: ModelStringInput | null;
  subject?: ModelStringInput | null;
  body?: ModelStringInput | null;
  contractFiles?: ModelStringInput | null;
  preApprovalFile?: ModelStringInput | null;
  earnestFile?: ModelStringInput | null;
  optionFile?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelEmailPacketFilterInput | null> | null;
  or?: Array<ModelEmailPacketFilterInput | null> | null;
  not?: ModelEmailPacketFilterInput | null;
};

export type ModelEmailPacketConnection = {
  __typename: "ModelEmailPacketConnection";
  items: Array<EmailPacket | null>;
  nextToken?: string | null;
};

export type ModelListingAgentContactInfoFilterInput = {
  id?: ModelIDInput | null;
  name?: ModelStringInput | null;
  agencyName?: ModelStringInput | null;
  profileUrl?: ModelStringInput | null;
  phoneNumbers?: ModelStringInput | null;
  emailAddresses?: ModelStringInput | null;
  source?: ModelStringInput | null;
  importDate?: ModelStringInput | null;
  notes?: ModelStringInput | null;
  metaData?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelListingAgentContactInfoFilterInput | null> | null;
  or?: Array<ModelListingAgentContactInfoFilterInput | null> | null;
  not?: ModelListingAgentContactInfoFilterInput | null;
};

export type ModelListingAgentContactInfoConnection = {
  __typename: "ModelListingAgentContactInfoConnection";
  items: Array<ListingAgentContactInfo | null>;
  nextToken?: string | null;
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}

export type ModelEtchPacketFilterInput = {
  eid?: ModelStringInput | null;
  contractId?: ModelIDInput | null;
  id?: ModelIDInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelEtchPacketFilterInput | null> | null;
  or?: Array<ModelEtchPacketFilterInput | null> | null;
  not?: ModelEtchPacketFilterInput | null;
  owner?: ModelStringInput | null;
};

export type ModelEtchPacketConnection = {
  __typename: "ModelEtchPacketConnection";
  items: Array<EtchPacket | null>;
  nextToken?: string | null;
};

export type ModelContractFilterInput = {
  id?: ModelIDInput | null;
  markedQuestions?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelContractFilterInput | null> | null;
  or?: Array<ModelContractFilterInput | null> | null;
  not?: ModelContractFilterInput | null;
  accountContractId?: ModelIDInput | null;
  owner?: ModelStringInput | null;
};

export type ModelAccountFilterInput = {
  id?: ModelIDInput | null;
  email?: ModelStringInput | null;
  billingId?: ModelStringInput | null;
  isPaid?: ModelBooleanInput | null;
  street1?: ModelStringInput | null;
  street2?: ModelStringInput | null;
  city?: ModelStringInput | null;
  state?: ModelStringInput | null;
  postalCode?: ModelStringInput | null;
  firstName?: ModelStringInput | null;
  middleInitial?: ModelStringInput | null;
  lastName?: ModelStringInput | null;
  owner?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelAccountFilterInput | null> | null;
  or?: Array<ModelAccountFilterInput | null> | null;
  not?: ModelAccountFilterInput | null;
};

export type ModelAccountConnection = {
  __typename: "ModelAccountConnection";
  items: Array<Account | null>;
  nextToken?: string | null;
};

export type ModelSubscriptionEmailPacketFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  accountId?: ModelSubscriptionIDInput | null;
  contractId?: ModelSubscriptionIDInput | null;
  streetAddress?: ModelSubscriptionStringInput | null;
  agentEmail?: ModelSubscriptionStringInput | null;
  agentName?: ModelSubscriptionStringInput | null;
  status?: ModelSubscriptionStringInput | null;
  comments?: ModelSubscriptionStringInput | null;
  subject?: ModelSubscriptionStringInput | null;
  body?: ModelSubscriptionStringInput | null;
  contractFiles?: ModelSubscriptionStringInput | null;
  preApprovalFile?: ModelSubscriptionStringInput | null;
  earnestFile?: ModelSubscriptionStringInput | null;
  optionFile?: ModelSubscriptionStringInput | null;
  createdAt?: ModelSubscriptionStringInput | null;
  updatedAt?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionEmailPacketFilterInput | null> | null;
  or?: Array<ModelSubscriptionEmailPacketFilterInput | null> | null;
};

export type ModelSubscriptionIDInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  in?: Array<string | null> | null;
  notIn?: Array<string | null> | null;
};

export type ModelSubscriptionStringInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  in?: Array<string | null> | null;
  notIn?: Array<string | null> | null;
};

export type ModelSubscriptionListingAgentContactInfoFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  name?: ModelSubscriptionStringInput | null;
  agencyName?: ModelSubscriptionStringInput | null;
  profileUrl?: ModelSubscriptionStringInput | null;
  phoneNumbers?: ModelSubscriptionStringInput | null;
  emailAddresses?: ModelSubscriptionStringInput | null;
  source?: ModelSubscriptionStringInput | null;
  importDate?: ModelSubscriptionStringInput | null;
  notes?: ModelSubscriptionStringInput | null;
  metaData?: ModelSubscriptionStringInput | null;
  createdAt?: ModelSubscriptionStringInput | null;
  updatedAt?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionListingAgentContactInfoFilterInput | null> | null;
  or?: Array<ModelSubscriptionListingAgentContactInfoFilterInput | null> | null;
};

export type ModelSubscriptionEtchPacketFilterInput = {
  eid?: ModelSubscriptionStringInput | null;
  contractId?: ModelSubscriptionIDInput | null;
  id?: ModelSubscriptionIDInput | null;
  createdAt?: ModelSubscriptionStringInput | null;
  updatedAt?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionEtchPacketFilterInput | null> | null;
  or?: Array<ModelSubscriptionEtchPacketFilterInput | null> | null;
  owner?: ModelStringInput | null;
};

export type ModelSubscriptionContractFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  markedQuestions?: ModelSubscriptionStringInput | null;
  createdAt?: ModelSubscriptionStringInput | null;
  updatedAt?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionContractFilterInput | null> | null;
  or?: Array<ModelSubscriptionContractFilterInput | null> | null;
  owner?: ModelStringInput | null;
};

export type ModelSubscriptionAccountFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  email?: ModelSubscriptionStringInput | null;
  billingId?: ModelSubscriptionStringInput | null;
  isPaid?: ModelSubscriptionBooleanInput | null;
  street1?: ModelSubscriptionStringInput | null;
  street2?: ModelSubscriptionStringInput | null;
  city?: ModelSubscriptionStringInput | null;
  state?: ModelSubscriptionStringInput | null;
  postalCode?: ModelSubscriptionStringInput | null;
  firstName?: ModelSubscriptionStringInput | null;
  middleInitial?: ModelSubscriptionStringInput | null;
  lastName?: ModelSubscriptionStringInput | null;
  createdAt?: ModelSubscriptionStringInput | null;
  updatedAt?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionAccountFilterInput | null> | null;
  or?: Array<ModelSubscriptionAccountFilterInput | null> | null;
  accountContractId?: ModelSubscriptionIDInput | null;
  owner?: ModelStringInput | null;
};

export type ModelSubscriptionBooleanInput = {
  ne?: boolean | null;
  eq?: boolean | null;
};

export type CreateAccountMutationVariables = {
  input: CreateAccountInput;
  condition?: ModelAccountConditionInput | null;
};

export type CreateAccountMutation = {
  createAccount?: {
    __typename: "Account";
    id: string;
    email: string;
    billingId?: string | null;
    contract?: {
      __typename: "ModelContractConnection";
      items: Array<{
        __typename: "Contract";
        id: string;
        buyers?: {
          __typename: "ContractParty";
          primaryName?: string | null;
          phone?: string | null;
          fax?: string | null;
          email?: string | null;
          hasSecondaryParty?: boolean | null;
          secondaryName?: string | null;
          secondaryPhone?: string | null;
          secondaryFax?: string | null;
          secondaryEmail?: string | null;
        } | null;
        property?: {
          __typename: "Property";
          lot?: string | null;
          block?: string | null;
          county?: string | null;
          legalDescription?: string | null;
          mlsNumber?: string | null;
          streetAddress?: string | null;
          city?: string | null;
          state?: string | null;
          postalCode?: string | null;
          subdivision?: string | null;
          yearBuilt?: number | null;
          numBedroom?: number | null;
          numBathroom?: number | null;
          numFloor?: number | null;
          floorSizeValue?: number | null;
          floorSizeUnit?: string | null;
          lotSizeValue?: number | null;
          lotSizeUnit?: string | null;
          mostRecentPriceAmount?: number | null;
          mostRecentPriceDate?: string | null;
          dateAdded?: string | null;
          dateUpdated?: string | null;
          description?: string | null;
          imageUrl?: string | null;
        } | null;
        finance?: {
          __typename: "Finance";
          hasPreferredLender?: boolean | null;
          wantsLenderReferral?: boolean | null;
          buyerApprovalNoticeDays?: number | null;
          cashAmount?: number | null;
          fhaVaAppraisedValue?: number | null;
          fhaSectionNumber?: number | null;
          financingType?: FinancingType | null;
          interestRate?: number | null;
          interestRateYears?: number | null;
          isBuyerApprovalRequired?: boolean | null;
          isSecondMortgage?: boolean | null;
          loanType?: LoanType | null;
          originationChargePercent?: number | null;
          otherFinancingLenderName?: string | null;
          otherFinancingWaiveRights?: boolean | null;
          principalAmount?: number | null;
          reverseMortgageIsFHAInsured?: boolean | null;
          storageKey?: string | null;
          termYears?: number | null;
          totalSalesPrice?: number | null;
          terminationOnAppraisalType?: TerminationOnAppraisalType | null;
          terminationOpinionOfValueAmount?: number | null;
          terminationDaysAfterEffectiveDate?: number | null;
          terminationAppraisedValueLessThan?: number | null;
        } | null;
        leases?: {
          __typename: "Leases";
          hasResidentialLease?: boolean | null;
          hasFixtureLease?: boolean | null;
          hasMineralLease?: boolean | null;
          mineralLeaseCopyDelivered?: boolean | null;
          mineralLeaseDaysToDeliveryCopy?: number | null;
        } | null;
        sellers?: {
          __typename: "ContractParty";
          primaryName?: string | null;
          phone?: string | null;
          fax?: string | null;
          email?: string | null;
          hasSecondaryParty?: boolean | null;
          secondaryName?: string | null;
          secondaryPhone?: string | null;
          secondaryFax?: string | null;
          secondaryEmail?: string | null;
        } | null;
        title?: {
          __typename: "TitleDetail";
          hasTitleCompany?: boolean | null;
          wantsTitleReferral?: boolean | null;
          titleCompanyName?: string | null;
          titleCompanyStreetAddress?: string | null;
          titleCompanyCity?: string | null;
          titleCompanyState?: string | null;
          titleCompanyPostalCode?: string | null;
          standardExceptionsToBeAmended?: boolean | null;
          standardExceptionsToBeAmendedBy?: PartyType | null;
          titleFurnishingParty?: PartyType | null;
          escrowAgentName?: string | null;
          earnestMoney?: number | null;
          hasOptionFee?: boolean | null;
          optionFee?: number | null;
          hasAdditionalEarnestMoney?: boolean | null;
          additionalEarnestMoney?: number | null;
          additionalEarnestMoneyDaysToDeliver?: number | null;
          optionPeriodDaysToTerminate?: number | null;
        } | null;
        titleObjections?: {
          __typename: "TitleObjections";
          objections?: string | null;
          daysToObject?: number | null;
        } | null;
        survey?: {
          __typename: "SurveyDetail";
          daysToFurnish?: number | null;
          type?: SurveyType | null;
          furnishingPartyIfExistingIsUnacceptable?: PartyType | null;
        } | null;
        titleNotices?: {
          __typename: "TitleNotices";
          isInMUD?: boolean | null;
          isInCoastalArea?: boolean | null;
          isInPublicImprovementDistrict?: boolean | null;
          isInPropaneServiceArea?: boolean | null;
        } | null;
        propertyCondition?: {
          __typename: "PropertyCondition";
          sellerDisclosureReceived?: boolean | null;
          sellerDisclosureDaysToProduce?: number | null;
          sellerRequiredToDisclose?: boolean | null;
          buyerAcceptsAsIs?: boolean | null;
          retainedImprovements?: string | null;
          buyerAcceptanceRepairSpecifics?: string | null;
          serviceContractReimbursementAmount?: number | null;
        } | null;
        brokerDisclosure?: {
          __typename: "BrokerDisclosure";
          buyerIsThirdPartyAgent?: boolean | null;
          buyerIsRelatedToSeller?: boolean | null;
          buyerHasStakeInProperty?: boolean | null;
          buyerIsBeingCompensated?: boolean | null;
          buyerDisclosure?: string | null;
        } | null;
        closing?: {
          __typename: "ClosingDetail";
          closingDate?: string | null;
        } | null;
        possession?: {
          __typename: "PossessionDetail";
          possessionUponClosing?: boolean | null;
          possessionAccordingToTempLease?: boolean | null;
        } | null;
        buyerProvisions?: {
          __typename: "BuyerProvisionsDetail";
          buyerProvisions?: string | null;
          additionalExpensesPaidBySeller?: number | null;
        } | null;
        buyerNotices?: {
          __typename: "NoticesDetail";
          deliverToAddress?: boolean | null;
          streetAddress?: string | null;
          city?: string | null;
          state?: string | null;
          postalCode?: string | null;
          deliverByPhone?: boolean | null;
          phone?: string | null;
          deliverByEmailFax1?: boolean | null;
          emailFax1?: string | null;
          deliveryByEmailFax2?: boolean | null;
          emailFax2?: string | null;
          deliverToAgent?: boolean | null;
          agentContact?: string | null;
        } | null;
        sellerNotices?: {
          __typename: "NoticesDetail";
          deliverToAddress?: boolean | null;
          streetAddress?: string | null;
          city?: string | null;
          state?: string | null;
          postalCode?: string | null;
          deliverByPhone?: boolean | null;
          phone?: string | null;
          deliverByEmailFax1?: boolean | null;
          emailFax1?: string | null;
          deliveryByEmailFax2?: boolean | null;
          emailFax2?: string | null;
          deliverToAgent?: boolean | null;
          agentContact?: string | null;
        } | null;
        buyerAttorney?: {
          __typename: "Attorney";
          hasAttorney?: boolean | null;
          name?: string | null;
          streetAddress?: string | null;
          city?: string | null;
          state?: string | null;
          postalCode?: string | null;
          phone?: string | null;
          email?: string | null;
          fax?: string | null;
        } | null;
        buyerAgent?: {
          __typename: "BuyerAgent";
          hasBuyerAgent?: boolean | null;
          firmName?: string | null;
          firmLicenseNumber?: string | null;
          firmStreetAddress?: string | null;
          firmCity?: string | null;
          firmState?: string | null;
          firmPostalCode?: string | null;
          firmPhone?: string | null;
          associateName?: string | null;
          associateLicenseNumber?: string | null;
          associateTeamName?: string | null;
          associateEmail?: string | null;
          associatePhone?: string | null;
          associateSupervisorName?: string | null;
          associateSupervisorLicenseNumber?: string | null;
        } | null;
        sellerAttorney?: {
          __typename: "Attorney";
          hasAttorney?: boolean | null;
          name?: string | null;
          streetAddress?: string | null;
          city?: string | null;
          state?: string | null;
          postalCode?: string | null;
          phone?: string | null;
          email?: string | null;
          fax?: string | null;
        } | null;
        listingAgent?: {
          __typename: "ListingAgent";
          hasListingAgentInfo?: boolean | null;
          firmName?: string | null;
          firmLicenseNumber?: string | null;
          firmStreetAddress?: string | null;
          firmCity?: string | null;
          firmState?: string | null;
          firmPostalCode?: string | null;
          firmPhone?: string | null;
          listingAssociateName?: string | null;
          listingAssociateLicenseNumber?: string | null;
          listingAssociateTeamName?: string | null;
          listingAssociateEmail?: string | null;
          listingAssociatePhone?: string | null;
          listingAssociateSupervisorName?: string | null;
          listingAssociateSupervisorLicenseNumber?: string | null;
          sellingAssociateName?: string | null;
          sellingAssociateLicenseNumber?: string | null;
          sellingAssociateTeamName?: string | null;
          sellingAssociateEmail?: string | null;
          sellingAssociatePhone?: string | null;
          sellingAssociateSupervisorName?: string | null;
          sellingAssociateSupervisorLicenseNumber?: string | null;
          sellingAssociateStreetAddress?: string | null;
          sellingAssociateCity?: string | null;
          sellingAssociateState?: string | null;
          sellingAssociatePostalCode?: string | null;
        } | null;
        markedQuestions?: string | null;
        homeownersAssociationAddendum?: {
          __typename: "HomeownersAssociationAddendum";
          hasHomeownersAssociation?: boolean | null;
          storageKey?: string | null;
          associationName?: string | null;
          associationPhoneNumber?: string | null;
          requiresSubdivisionInfo?: boolean | null;
          receivedSubdivisionInfo?: boolean | null;
          requiresUpdatedResaleCertificate?: boolean | null;
          subdivisionInfoProvidedBy?: PartyType | null;
          subdivisionInfoDaysToDeliver?: number | null;
          buyerFeesNotToExceed?: number | null;
          feeForTitleCompanyPaidBy?: PartyType | null;
        } | null;
        leadBasedPaintAddendum?: {
          __typename: "LeadBasedPaintAddendum";
          hasLeadBasedPaintDisclosure?: boolean | null;
          storageKey?: string | null;
          leadBasedPaintDisclosure?: string | null;
        } | null;
        rightToTerminateByLenderAppraisalAddendum?: {
          __typename: "RightToTerminateByLenderAppraisalAddendum";
          hasRightToTerminateByLenderAppraisal?: boolean | null;
          storageKey?: string | null;
          appraisalAmount?: number | null;
        } | null;
        sellerTemporaryLeaseAddendum?: {
          __typename: "SellerTemporaryLeaseAddendum";
          hasSellersTemporaryLease?: boolean | null;
          storageKey?: string | null;
          leaseLength?: number | null;
        } | null;
        createdAt: string;
        updatedAt: string;
        accountContractId?: string | null;
        owner?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    isPaid?: boolean | null;
    street1?: string | null;
    street2?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    firstName?: string | null;
    middleInitial?: string | null;
    lastName?: string | null;
    owner: string;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type CreateEmailPacketMutationVariables = {
  input: CreateEmailPacketInput;
  condition?: ModelEmailPacketConditionInput | null;
};

export type CreateEmailPacketMutation = {
  createEmailPacket?: {
    __typename: "EmailPacket";
    id: string;
    accountId: string;
    contractId: string;
    streetAddress: string;
    agentEmail: string;
    agentName: string;
    status: string;
    comments?: string | null;
    subject: string;
    body: string;
    contractFiles: Array<string>;
    preApprovalFile: string;
    earnestFile: string;
    optionFile: string;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type UpdateEmailPacketMutationVariables = {
  input: UpdateEmailPacketInput;
  condition?: ModelEmailPacketConditionInput | null;
};

export type UpdateEmailPacketMutation = {
  updateEmailPacket?: {
    __typename: "EmailPacket";
    id: string;
    accountId: string;
    contractId: string;
    streetAddress: string;
    agentEmail: string;
    agentName: string;
    status: string;
    comments?: string | null;
    subject: string;
    body: string;
    contractFiles: Array<string>;
    preApprovalFile: string;
    earnestFile: string;
    optionFile: string;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type DeleteEmailPacketMutationVariables = {
  input: DeleteEmailPacketInput;
  condition?: ModelEmailPacketConditionInput | null;
};

export type DeleteEmailPacketMutation = {
  deleteEmailPacket?: {
    __typename: "EmailPacket";
    id: string;
    accountId: string;
    contractId: string;
    streetAddress: string;
    agentEmail: string;
    agentName: string;
    status: string;
    comments?: string | null;
    subject: string;
    body: string;
    contractFiles: Array<string>;
    preApprovalFile: string;
    earnestFile: string;
    optionFile: string;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type CreateListingAgentContactInfoMutationVariables = {
  input: CreateListingAgentContactInfoInput;
  condition?: ModelListingAgentContactInfoConditionInput | null;
};

export type CreateListingAgentContactInfoMutation = {
  createListingAgentContactInfo?: {
    __typename: "ListingAgentContactInfo";
    id: string;
    name?: string | null;
    agencyName?: string | null;
    profileUrl?: string | null;
    phoneNumbers?: Array<string | null> | null;
    emailAddresses?: Array<string | null> | null;
    source?: string | null;
    importDate?: string | null;
    notes?: string | null;
    metaData?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type UpdateListingAgentContactInfoMutationVariables = {
  input: UpdateListingAgentContactInfoInput;
  condition?: ModelListingAgentContactInfoConditionInput | null;
};

export type UpdateListingAgentContactInfoMutation = {
  updateListingAgentContactInfo?: {
    __typename: "ListingAgentContactInfo";
    id: string;
    name?: string | null;
    agencyName?: string | null;
    profileUrl?: string | null;
    phoneNumbers?: Array<string | null> | null;
    emailAddresses?: Array<string | null> | null;
    source?: string | null;
    importDate?: string | null;
    notes?: string | null;
    metaData?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type DeleteListingAgentContactInfoMutationVariables = {
  input: DeleteListingAgentContactInfoInput;
  condition?: ModelListingAgentContactInfoConditionInput | null;
};

export type DeleteListingAgentContactInfoMutation = {
  deleteListingAgentContactInfo?: {
    __typename: "ListingAgentContactInfo";
    id: string;
    name?: string | null;
    agencyName?: string | null;
    profileUrl?: string | null;
    phoneNumbers?: Array<string | null> | null;
    emailAddresses?: Array<string | null> | null;
    source?: string | null;
    importDate?: string | null;
    notes?: string | null;
    metaData?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type CreateEtchPacketMutationVariables = {
  input: CreateEtchPacketInput;
  condition?: ModelEtchPacketConditionInput | null;
};

export type CreateEtchPacketMutation = {
  createEtchPacket?: {
    __typename: "EtchPacket";
    eid: string;
    documentGroup: {
      __typename: "DocumentGroup";
      eid: string;
      status: string;
      files: Array<{
        __typename: "DocumentGroupFile";
        downloadURL: string;
        filename: string;
        name: string;
        type: string;
      } | null>;
      signers: Array<{
        __typename: "Signer";
        eid: string;
        aliasId: string;
        name: string;
        email: string;
        routingOrder: number;
        signActionType: string;
        status: string;
        uploadKeys?: Array<string | null> | null;
      } | null>;
    };
    contractId: string;
    createdAt: string;
    updatedAt: string;
    owner?: string | null;
  } | null;
};

export type UpdateEtchPacketMutationVariables = {
  input: UpdateEtchPacketInput;
  condition?: ModelEtchPacketConditionInput | null;
};

export type UpdateEtchPacketMutation = {
  updateEtchPacket?: {
    __typename: "EtchPacket";
    eid: string;
    documentGroup: {
      __typename: "DocumentGroup";
      eid: string;
      status: string;
      files: Array<{
        __typename: "DocumentGroupFile";
        downloadURL: string;
        filename: string;
        name: string;
        type: string;
      } | null>;
      signers: Array<{
        __typename: "Signer";
        eid: string;
        aliasId: string;
        name: string;
        email: string;
        routingOrder: number;
        signActionType: string;
        status: string;
        uploadKeys?: Array<string | null> | null;
      } | null>;
    };
    contractId: string;
    createdAt: string;
    updatedAt: string;
    owner?: string | null;
  } | null;
};

export type DeleteEtchPacketMutationVariables = {
  input: DeleteEtchPacketInput;
  condition?: ModelEtchPacketConditionInput | null;
};

export type DeleteEtchPacketMutation = {
  deleteEtchPacket?: {
    __typename: "EtchPacket";
    eid: string;
    documentGroup: {
      __typename: "DocumentGroup";
      eid: string;
      status: string;
      files: Array<{
        __typename: "DocumentGroupFile";
        downloadURL: string;
        filename: string;
        name: string;
        type: string;
      } | null>;
      signers: Array<{
        __typename: "Signer";
        eid: string;
        aliasId: string;
        name: string;
        email: string;
        routingOrder: number;
        signActionType: string;
        status: string;
        uploadKeys?: Array<string | null> | null;
      } | null>;
    };
    contractId: string;
    createdAt: string;
    updatedAt: string;
    owner?: string | null;
  } | null;
};

export type CreateContractMutationVariables = {
  input: CreateContractInput;
  condition?: ModelContractConditionInput | null;
};

export type CreateContractMutation = {
  createContract?: {
    __typename: "Contract";
    id: string;
    buyers?: {
      __typename: "ContractParty";
      primaryName?: string | null;
      phone?: string | null;
      fax?: string | null;
      email?: string | null;
      hasSecondaryParty?: boolean | null;
      secondaryName?: string | null;
      secondaryPhone?: string | null;
      secondaryFax?: string | null;
      secondaryEmail?: string | null;
    } | null;
    property?: {
      __typename: "Property";
      lot?: string | null;
      block?: string | null;
      county?: string | null;
      legalDescription?: string | null;
      mlsNumber?: string | null;
      streetAddress?: string | null;
      city?: string | null;
      state?: string | null;
      postalCode?: string | null;
      subdivision?: string | null;
      yearBuilt?: number | null;
      numBedroom?: number | null;
      numBathroom?: number | null;
      numFloor?: number | null;
      floorSizeValue?: number | null;
      floorSizeUnit?: string | null;
      lotSizeValue?: number | null;
      lotSizeUnit?: string | null;
      mostRecentPriceAmount?: number | null;
      mostRecentPriceDate?: string | null;
      dateAdded?: string | null;
      dateUpdated?: string | null;
      description?: string | null;
      imageUrl?: string | null;
    } | null;
    finance?: {
      __typename: "Finance";
      hasPreferredLender?: boolean | null;
      wantsLenderReferral?: boolean | null;
      buyerApprovalNoticeDays?: number | null;
      cashAmount?: number | null;
      fhaVaAppraisedValue?: number | null;
      fhaSectionNumber?: number | null;
      financingType?: FinancingType | null;
      interestRate?: number | null;
      interestRateYears?: number | null;
      isBuyerApprovalRequired?: boolean | null;
      isSecondMortgage?: boolean | null;
      loanType?: LoanType | null;
      originationChargePercent?: number | null;
      otherFinancingLenderName?: string | null;
      otherFinancingWaiveRights?: boolean | null;
      principalAmount?: number | null;
      reverseMortgageIsFHAInsured?: boolean | null;
      storageKey?: string | null;
      termYears?: number | null;
      totalSalesPrice?: number | null;
      terminationOnAppraisalType?: TerminationOnAppraisalType | null;
      terminationOpinionOfValueAmount?: number | null;
      terminationDaysAfterEffectiveDate?: number | null;
      terminationAppraisedValueLessThan?: number | null;
    } | null;
    leases?: {
      __typename: "Leases";
      hasResidentialLease?: boolean | null;
      hasFixtureLease?: boolean | null;
      hasMineralLease?: boolean | null;
      mineralLeaseCopyDelivered?: boolean | null;
      mineralLeaseDaysToDeliveryCopy?: number | null;
    } | null;
    sellers?: {
      __typename: "ContractParty";
      primaryName?: string | null;
      phone?: string | null;
      fax?: string | null;
      email?: string | null;
      hasSecondaryParty?: boolean | null;
      secondaryName?: string | null;
      secondaryPhone?: string | null;
      secondaryFax?: string | null;
      secondaryEmail?: string | null;
    } | null;
    title?: {
      __typename: "TitleDetail";
      hasTitleCompany?: boolean | null;
      wantsTitleReferral?: boolean | null;
      titleCompanyName?: string | null;
      titleCompanyStreetAddress?: string | null;
      titleCompanyCity?: string | null;
      titleCompanyState?: string | null;
      titleCompanyPostalCode?: string | null;
      standardExceptionsToBeAmended?: boolean | null;
      standardExceptionsToBeAmendedBy?: PartyType | null;
      titleFurnishingParty?: PartyType | null;
      escrowAgentName?: string | null;
      earnestMoney?: number | null;
      hasOptionFee?: boolean | null;
      optionFee?: number | null;
      hasAdditionalEarnestMoney?: boolean | null;
      additionalEarnestMoney?: number | null;
      additionalEarnestMoneyDaysToDeliver?: number | null;
      optionPeriodDaysToTerminate?: number | null;
    } | null;
    titleObjections?: {
      __typename: "TitleObjections";
      objections?: string | null;
      daysToObject?: number | null;
    } | null;
    survey?: {
      __typename: "SurveyDetail";
      daysToFurnish?: number | null;
      type?: SurveyType | null;
      furnishingPartyIfExistingIsUnacceptable?: PartyType | null;
    } | null;
    titleNotices?: {
      __typename: "TitleNotices";
      isInMUD?: boolean | null;
      isInCoastalArea?: boolean | null;
      isInPublicImprovementDistrict?: boolean | null;
      isInPropaneServiceArea?: boolean | null;
    } | null;
    propertyCondition?: {
      __typename: "PropertyCondition";
      sellerDisclosureReceived?: boolean | null;
      sellerDisclosureDaysToProduce?: number | null;
      sellerRequiredToDisclose?: boolean | null;
      buyerAcceptsAsIs?: boolean | null;
      retainedImprovements?: string | null;
      buyerAcceptanceRepairSpecifics?: string | null;
      serviceContractReimbursementAmount?: number | null;
    } | null;
    brokerDisclosure?: {
      __typename: "BrokerDisclosure";
      buyerIsThirdPartyAgent?: boolean | null;
      buyerIsRelatedToSeller?: boolean | null;
      buyerHasStakeInProperty?: boolean | null;
      buyerIsBeingCompensated?: boolean | null;
      buyerDisclosure?: string | null;
    } | null;
    closing?: {
      __typename: "ClosingDetail";
      closingDate?: string | null;
    } | null;
    possession?: {
      __typename: "PossessionDetail";
      possessionUponClosing?: boolean | null;
      possessionAccordingToTempLease?: boolean | null;
    } | null;
    buyerProvisions?: {
      __typename: "BuyerProvisionsDetail";
      buyerProvisions?: string | null;
      additionalExpensesPaidBySeller?: number | null;
    } | null;
    buyerNotices?: {
      __typename: "NoticesDetail";
      deliverToAddress?: boolean | null;
      streetAddress?: string | null;
      city?: string | null;
      state?: string | null;
      postalCode?: string | null;
      deliverByPhone?: boolean | null;
      phone?: string | null;
      deliverByEmailFax1?: boolean | null;
      emailFax1?: string | null;
      deliveryByEmailFax2?: boolean | null;
      emailFax2?: string | null;
      deliverToAgent?: boolean | null;
      agentContact?: string | null;
    } | null;
    sellerNotices?: {
      __typename: "NoticesDetail";
      deliverToAddress?: boolean | null;
      streetAddress?: string | null;
      city?: string | null;
      state?: string | null;
      postalCode?: string | null;
      deliverByPhone?: boolean | null;
      phone?: string | null;
      deliverByEmailFax1?: boolean | null;
      emailFax1?: string | null;
      deliveryByEmailFax2?: boolean | null;
      emailFax2?: string | null;
      deliverToAgent?: boolean | null;
      agentContact?: string | null;
    } | null;
    buyerAttorney?: {
      __typename: "Attorney";
      hasAttorney?: boolean | null;
      name?: string | null;
      streetAddress?: string | null;
      city?: string | null;
      state?: string | null;
      postalCode?: string | null;
      phone?: string | null;
      email?: string | null;
      fax?: string | null;
    } | null;
    buyerAgent?: {
      __typename: "BuyerAgent";
      hasBuyerAgent?: boolean | null;
      firmName?: string | null;
      firmLicenseNumber?: string | null;
      firmStreetAddress?: string | null;
      firmCity?: string | null;
      firmState?: string | null;
      firmPostalCode?: string | null;
      firmPhone?: string | null;
      associateName?: string | null;
      associateLicenseNumber?: string | null;
      associateTeamName?: string | null;
      associateEmail?: string | null;
      associatePhone?: string | null;
      associateSupervisorName?: string | null;
      associateSupervisorLicenseNumber?: string | null;
    } | null;
    sellerAttorney?: {
      __typename: "Attorney";
      hasAttorney?: boolean | null;
      name?: string | null;
      streetAddress?: string | null;
      city?: string | null;
      state?: string | null;
      postalCode?: string | null;
      phone?: string | null;
      email?: string | null;
      fax?: string | null;
    } | null;
    listingAgent?: {
      __typename: "ListingAgent";
      hasListingAgentInfo?: boolean | null;
      firmName?: string | null;
      firmLicenseNumber?: string | null;
      firmStreetAddress?: string | null;
      firmCity?: string | null;
      firmState?: string | null;
      firmPostalCode?: string | null;
      firmPhone?: string | null;
      listingAssociateName?: string | null;
      listingAssociateLicenseNumber?: string | null;
      listingAssociateTeamName?: string | null;
      listingAssociateEmail?: string | null;
      listingAssociatePhone?: string | null;
      listingAssociateSupervisorName?: string | null;
      listingAssociateSupervisorLicenseNumber?: string | null;
      sellingAssociateName?: string | null;
      sellingAssociateLicenseNumber?: string | null;
      sellingAssociateTeamName?: string | null;
      sellingAssociateEmail?: string | null;
      sellingAssociatePhone?: string | null;
      sellingAssociateSupervisorName?: string | null;
      sellingAssociateSupervisorLicenseNumber?: string | null;
      sellingAssociateStreetAddress?: string | null;
      sellingAssociateCity?: string | null;
      sellingAssociateState?: string | null;
      sellingAssociatePostalCode?: string | null;
    } | null;
    markedQuestions?: string | null;
    homeownersAssociationAddendum?: {
      __typename: "HomeownersAssociationAddendum";
      hasHomeownersAssociation?: boolean | null;
      storageKey?: string | null;
      associationName?: string | null;
      associationPhoneNumber?: string | null;
      requiresSubdivisionInfo?: boolean | null;
      receivedSubdivisionInfo?: boolean | null;
      requiresUpdatedResaleCertificate?: boolean | null;
      subdivisionInfoProvidedBy?: PartyType | null;
      subdivisionInfoDaysToDeliver?: number | null;
      buyerFeesNotToExceed?: number | null;
      feeForTitleCompanyPaidBy?: PartyType | null;
    } | null;
    leadBasedPaintAddendum?: {
      __typename: "LeadBasedPaintAddendum";
      hasLeadBasedPaintDisclosure?: boolean | null;
      storageKey?: string | null;
      leadBasedPaintDisclosure?: string | null;
    } | null;
    rightToTerminateByLenderAppraisalAddendum?: {
      __typename: "RightToTerminateByLenderAppraisalAddendum";
      hasRightToTerminateByLenderAppraisal?: boolean | null;
      storageKey?: string | null;
      appraisalAmount?: number | null;
    } | null;
    sellerTemporaryLeaseAddendum?: {
      __typename: "SellerTemporaryLeaseAddendum";
      hasSellersTemporaryLease?: boolean | null;
      storageKey?: string | null;
      leaseLength?: number | null;
    } | null;
    createdAt: string;
    updatedAt: string;
    accountContractId?: string | null;
    owner?: string | null;
  } | null;
};

export type UpdateContractMutationVariables = {
  input: UpdateContractInput;
  condition?: ModelContractConditionInput | null;
};

export type UpdateContractMutation = {
  updateContract?: {
    __typename: "Contract";
    id: string;
    buyers?: {
      __typename: "ContractParty";
      primaryName?: string | null;
      phone?: string | null;
      fax?: string | null;
      email?: string | null;
      hasSecondaryParty?: boolean | null;
      secondaryName?: string | null;
      secondaryPhone?: string | null;
      secondaryFax?: string | null;
      secondaryEmail?: string | null;
    } | null;
    property?: {
      __typename: "Property";
      lot?: string | null;
      block?: string | null;
      county?: string | null;
      legalDescription?: string | null;
      mlsNumber?: string | null;
      streetAddress?: string | null;
      city?: string | null;
      state?: string | null;
      postalCode?: string | null;
      subdivision?: string | null;
      yearBuilt?: number | null;
      numBedroom?: number | null;
      numBathroom?: number | null;
      numFloor?: number | null;
      floorSizeValue?: number | null;
      floorSizeUnit?: string | null;
      lotSizeValue?: number | null;
      lotSizeUnit?: string | null;
      mostRecentPriceAmount?: number | null;
      mostRecentPriceDate?: string | null;
      dateAdded?: string | null;
      dateUpdated?: string | null;
      description?: string | null;
      imageUrl?: string | null;
    } | null;
    finance?: {
      __typename: "Finance";
      hasPreferredLender?: boolean | null;
      wantsLenderReferral?: boolean | null;
      buyerApprovalNoticeDays?: number | null;
      cashAmount?: number | null;
      fhaVaAppraisedValue?: number | null;
      fhaSectionNumber?: number | null;
      financingType?: FinancingType | null;
      interestRate?: number | null;
      interestRateYears?: number | null;
      isBuyerApprovalRequired?: boolean | null;
      isSecondMortgage?: boolean | null;
      loanType?: LoanType | null;
      originationChargePercent?: number | null;
      otherFinancingLenderName?: string | null;
      otherFinancingWaiveRights?: boolean | null;
      principalAmount?: number | null;
      reverseMortgageIsFHAInsured?: boolean | null;
      storageKey?: string | null;
      termYears?: number | null;
      totalSalesPrice?: number | null;
      terminationOnAppraisalType?: TerminationOnAppraisalType | null;
      terminationOpinionOfValueAmount?: number | null;
      terminationDaysAfterEffectiveDate?: number | null;
      terminationAppraisedValueLessThan?: number | null;
    } | null;
    leases?: {
      __typename: "Leases";
      hasResidentialLease?: boolean | null;
      hasFixtureLease?: boolean | null;
      hasMineralLease?: boolean | null;
      mineralLeaseCopyDelivered?: boolean | null;
      mineralLeaseDaysToDeliveryCopy?: number | null;
    } | null;
    sellers?: {
      __typename: "ContractParty";
      primaryName?: string | null;
      phone?: string | null;
      fax?: string | null;
      email?: string | null;
      hasSecondaryParty?: boolean | null;
      secondaryName?: string | null;
      secondaryPhone?: string | null;
      secondaryFax?: string | null;
      secondaryEmail?: string | null;
    } | null;
    title?: {
      __typename: "TitleDetail";
      hasTitleCompany?: boolean | null;
      wantsTitleReferral?: boolean | null;
      titleCompanyName?: string | null;
      titleCompanyStreetAddress?: string | null;
      titleCompanyCity?: string | null;
      titleCompanyState?: string | null;
      titleCompanyPostalCode?: string | null;
      standardExceptionsToBeAmended?: boolean | null;
      standardExceptionsToBeAmendedBy?: PartyType | null;
      titleFurnishingParty?: PartyType | null;
      escrowAgentName?: string | null;
      earnestMoney?: number | null;
      hasOptionFee?: boolean | null;
      optionFee?: number | null;
      hasAdditionalEarnestMoney?: boolean | null;
      additionalEarnestMoney?: number | null;
      additionalEarnestMoneyDaysToDeliver?: number | null;
      optionPeriodDaysToTerminate?: number | null;
    } | null;
    titleObjections?: {
      __typename: "TitleObjections";
      objections?: string | null;
      daysToObject?: number | null;
    } | null;
    survey?: {
      __typename: "SurveyDetail";
      daysToFurnish?: number | null;
      type?: SurveyType | null;
      furnishingPartyIfExistingIsUnacceptable?: PartyType | null;
    } | null;
    titleNotices?: {
      __typename: "TitleNotices";
      isInMUD?: boolean | null;
      isInCoastalArea?: boolean | null;
      isInPublicImprovementDistrict?: boolean | null;
      isInPropaneServiceArea?: boolean | null;
    } | null;
    propertyCondition?: {
      __typename: "PropertyCondition";
      sellerDisclosureReceived?: boolean | null;
      sellerDisclosureDaysToProduce?: number | null;
      sellerRequiredToDisclose?: boolean | null;
      buyerAcceptsAsIs?: boolean | null;
      retainedImprovements?: string | null;
      buyerAcceptanceRepairSpecifics?: string | null;
      serviceContractReimbursementAmount?: number | null;
    } | null;
    brokerDisclosure?: {
      __typename: "BrokerDisclosure";
      buyerIsThirdPartyAgent?: boolean | null;
      buyerIsRelatedToSeller?: boolean | null;
      buyerHasStakeInProperty?: boolean | null;
      buyerIsBeingCompensated?: boolean | null;
      buyerDisclosure?: string | null;
    } | null;
    closing?: {
      __typename: "ClosingDetail";
      closingDate?: string | null;
    } | null;
    possession?: {
      __typename: "PossessionDetail";
      possessionUponClosing?: boolean | null;
      possessionAccordingToTempLease?: boolean | null;
    } | null;
    buyerProvisions?: {
      __typename: "BuyerProvisionsDetail";
      buyerProvisions?: string | null;
      additionalExpensesPaidBySeller?: number | null;
    } | null;
    buyerNotices?: {
      __typename: "NoticesDetail";
      deliverToAddress?: boolean | null;
      streetAddress?: string | null;
      city?: string | null;
      state?: string | null;
      postalCode?: string | null;
      deliverByPhone?: boolean | null;
      phone?: string | null;
      deliverByEmailFax1?: boolean | null;
      emailFax1?: string | null;
      deliveryByEmailFax2?: boolean | null;
      emailFax2?: string | null;
      deliverToAgent?: boolean | null;
      agentContact?: string | null;
    } | null;
    sellerNotices?: {
      __typename: "NoticesDetail";
      deliverToAddress?: boolean | null;
      streetAddress?: string | null;
      city?: string | null;
      state?: string | null;
      postalCode?: string | null;
      deliverByPhone?: boolean | null;
      phone?: string | null;
      deliverByEmailFax1?: boolean | null;
      emailFax1?: string | null;
      deliveryByEmailFax2?: boolean | null;
      emailFax2?: string | null;
      deliverToAgent?: boolean | null;
      agentContact?: string | null;
    } | null;
    buyerAttorney?: {
      __typename: "Attorney";
      hasAttorney?: boolean | null;
      name?: string | null;
      streetAddress?: string | null;
      city?: string | null;
      state?: string | null;
      postalCode?: string | null;
      phone?: string | null;
      email?: string | null;
      fax?: string | null;
    } | null;
    buyerAgent?: {
      __typename: "BuyerAgent";
      hasBuyerAgent?: boolean | null;
      firmName?: string | null;
      firmLicenseNumber?: string | null;
      firmStreetAddress?: string | null;
      firmCity?: string | null;
      firmState?: string | null;
      firmPostalCode?: string | null;
      firmPhone?: string | null;
      associateName?: string | null;
      associateLicenseNumber?: string | null;
      associateTeamName?: string | null;
      associateEmail?: string | null;
      associatePhone?: string | null;
      associateSupervisorName?: string | null;
      associateSupervisorLicenseNumber?: string | null;
    } | null;
    sellerAttorney?: {
      __typename: "Attorney";
      hasAttorney?: boolean | null;
      name?: string | null;
      streetAddress?: string | null;
      city?: string | null;
      state?: string | null;
      postalCode?: string | null;
      phone?: string | null;
      email?: string | null;
      fax?: string | null;
    } | null;
    listingAgent?: {
      __typename: "ListingAgent";
      hasListingAgentInfo?: boolean | null;
      firmName?: string | null;
      firmLicenseNumber?: string | null;
      firmStreetAddress?: string | null;
      firmCity?: string | null;
      firmState?: string | null;
      firmPostalCode?: string | null;
      firmPhone?: string | null;
      listingAssociateName?: string | null;
      listingAssociateLicenseNumber?: string | null;
      listingAssociateTeamName?: string | null;
      listingAssociateEmail?: string | null;
      listingAssociatePhone?: string | null;
      listingAssociateSupervisorName?: string | null;
      listingAssociateSupervisorLicenseNumber?: string | null;
      sellingAssociateName?: string | null;
      sellingAssociateLicenseNumber?: string | null;
      sellingAssociateTeamName?: string | null;
      sellingAssociateEmail?: string | null;
      sellingAssociatePhone?: string | null;
      sellingAssociateSupervisorName?: string | null;
      sellingAssociateSupervisorLicenseNumber?: string | null;
      sellingAssociateStreetAddress?: string | null;
      sellingAssociateCity?: string | null;
      sellingAssociateState?: string | null;
      sellingAssociatePostalCode?: string | null;
    } | null;
    markedQuestions?: string | null;
    homeownersAssociationAddendum?: {
      __typename: "HomeownersAssociationAddendum";
      hasHomeownersAssociation?: boolean | null;
      storageKey?: string | null;
      associationName?: string | null;
      associationPhoneNumber?: string | null;
      requiresSubdivisionInfo?: boolean | null;
      receivedSubdivisionInfo?: boolean | null;
      requiresUpdatedResaleCertificate?: boolean | null;
      subdivisionInfoProvidedBy?: PartyType | null;
      subdivisionInfoDaysToDeliver?: number | null;
      buyerFeesNotToExceed?: number | null;
      feeForTitleCompanyPaidBy?: PartyType | null;
    } | null;
    leadBasedPaintAddendum?: {
      __typename: "LeadBasedPaintAddendum";
      hasLeadBasedPaintDisclosure?: boolean | null;
      storageKey?: string | null;
      leadBasedPaintDisclosure?: string | null;
    } | null;
    rightToTerminateByLenderAppraisalAddendum?: {
      __typename: "RightToTerminateByLenderAppraisalAddendum";
      hasRightToTerminateByLenderAppraisal?: boolean | null;
      storageKey?: string | null;
      appraisalAmount?: number | null;
    } | null;
    sellerTemporaryLeaseAddendum?: {
      __typename: "SellerTemporaryLeaseAddendum";
      hasSellersTemporaryLease?: boolean | null;
      storageKey?: string | null;
      leaseLength?: number | null;
    } | null;
    createdAt: string;
    updatedAt: string;
    accountContractId?: string | null;
    owner?: string | null;
  } | null;
};

export type DeleteContractMutationVariables = {
  input: DeleteContractInput;
  condition?: ModelContractConditionInput | null;
};

export type DeleteContractMutation = {
  deleteContract?: {
    __typename: "Contract";
    id: string;
    buyers?: {
      __typename: "ContractParty";
      primaryName?: string | null;
      phone?: string | null;
      fax?: string | null;
      email?: string | null;
      hasSecondaryParty?: boolean | null;
      secondaryName?: string | null;
      secondaryPhone?: string | null;
      secondaryFax?: string | null;
      secondaryEmail?: string | null;
    } | null;
    property?: {
      __typename: "Property";
      lot?: string | null;
      block?: string | null;
      county?: string | null;
      legalDescription?: string | null;
      mlsNumber?: string | null;
      streetAddress?: string | null;
      city?: string | null;
      state?: string | null;
      postalCode?: string | null;
      subdivision?: string | null;
      yearBuilt?: number | null;
      numBedroom?: number | null;
      numBathroom?: number | null;
      numFloor?: number | null;
      floorSizeValue?: number | null;
      floorSizeUnit?: string | null;
      lotSizeValue?: number | null;
      lotSizeUnit?: string | null;
      mostRecentPriceAmount?: number | null;
      mostRecentPriceDate?: string | null;
      dateAdded?: string | null;
      dateUpdated?: string | null;
      description?: string | null;
      imageUrl?: string | null;
    } | null;
    finance?: {
      __typename: "Finance";
      hasPreferredLender?: boolean | null;
      wantsLenderReferral?: boolean | null;
      buyerApprovalNoticeDays?: number | null;
      cashAmount?: number | null;
      fhaVaAppraisedValue?: number | null;
      fhaSectionNumber?: number | null;
      financingType?: FinancingType | null;
      interestRate?: number | null;
      interestRateYears?: number | null;
      isBuyerApprovalRequired?: boolean | null;
      isSecondMortgage?: boolean | null;
      loanType?: LoanType | null;
      originationChargePercent?: number | null;
      otherFinancingLenderName?: string | null;
      otherFinancingWaiveRights?: boolean | null;
      principalAmount?: number | null;
      reverseMortgageIsFHAInsured?: boolean | null;
      storageKey?: string | null;
      termYears?: number | null;
      totalSalesPrice?: number | null;
      terminationOnAppraisalType?: TerminationOnAppraisalType | null;
      terminationOpinionOfValueAmount?: number | null;
      terminationDaysAfterEffectiveDate?: number | null;
      terminationAppraisedValueLessThan?: number | null;
    } | null;
    leases?: {
      __typename: "Leases";
      hasResidentialLease?: boolean | null;
      hasFixtureLease?: boolean | null;
      hasMineralLease?: boolean | null;
      mineralLeaseCopyDelivered?: boolean | null;
      mineralLeaseDaysToDeliveryCopy?: number | null;
    } | null;
    sellers?: {
      __typename: "ContractParty";
      primaryName?: string | null;
      phone?: string | null;
      fax?: string | null;
      email?: string | null;
      hasSecondaryParty?: boolean | null;
      secondaryName?: string | null;
      secondaryPhone?: string | null;
      secondaryFax?: string | null;
      secondaryEmail?: string | null;
    } | null;
    title?: {
      __typename: "TitleDetail";
      hasTitleCompany?: boolean | null;
      wantsTitleReferral?: boolean | null;
      titleCompanyName?: string | null;
      titleCompanyStreetAddress?: string | null;
      titleCompanyCity?: string | null;
      titleCompanyState?: string | null;
      titleCompanyPostalCode?: string | null;
      standardExceptionsToBeAmended?: boolean | null;
      standardExceptionsToBeAmendedBy?: PartyType | null;
      titleFurnishingParty?: PartyType | null;
      escrowAgentName?: string | null;
      earnestMoney?: number | null;
      hasOptionFee?: boolean | null;
      optionFee?: number | null;
      hasAdditionalEarnestMoney?: boolean | null;
      additionalEarnestMoney?: number | null;
      additionalEarnestMoneyDaysToDeliver?: number | null;
      optionPeriodDaysToTerminate?: number | null;
    } | null;
    titleObjections?: {
      __typename: "TitleObjections";
      objections?: string | null;
      daysToObject?: number | null;
    } | null;
    survey?: {
      __typename: "SurveyDetail";
      daysToFurnish?: number | null;
      type?: SurveyType | null;
      furnishingPartyIfExistingIsUnacceptable?: PartyType | null;
    } | null;
    titleNotices?: {
      __typename: "TitleNotices";
      isInMUD?: boolean | null;
      isInCoastalArea?: boolean | null;
      isInPublicImprovementDistrict?: boolean | null;
      isInPropaneServiceArea?: boolean | null;
    } | null;
    propertyCondition?: {
      __typename: "PropertyCondition";
      sellerDisclosureReceived?: boolean | null;
      sellerDisclosureDaysToProduce?: number | null;
      sellerRequiredToDisclose?: boolean | null;
      buyerAcceptsAsIs?: boolean | null;
      retainedImprovements?: string | null;
      buyerAcceptanceRepairSpecifics?: string | null;
      serviceContractReimbursementAmount?: number | null;
    } | null;
    brokerDisclosure?: {
      __typename: "BrokerDisclosure";
      buyerIsThirdPartyAgent?: boolean | null;
      buyerIsRelatedToSeller?: boolean | null;
      buyerHasStakeInProperty?: boolean | null;
      buyerIsBeingCompensated?: boolean | null;
      buyerDisclosure?: string | null;
    } | null;
    closing?: {
      __typename: "ClosingDetail";
      closingDate?: string | null;
    } | null;
    possession?: {
      __typename: "PossessionDetail";
      possessionUponClosing?: boolean | null;
      possessionAccordingToTempLease?: boolean | null;
    } | null;
    buyerProvisions?: {
      __typename: "BuyerProvisionsDetail";
      buyerProvisions?: string | null;
      additionalExpensesPaidBySeller?: number | null;
    } | null;
    buyerNotices?: {
      __typename: "NoticesDetail";
      deliverToAddress?: boolean | null;
      streetAddress?: string | null;
      city?: string | null;
      state?: string | null;
      postalCode?: string | null;
      deliverByPhone?: boolean | null;
      phone?: string | null;
      deliverByEmailFax1?: boolean | null;
      emailFax1?: string | null;
      deliveryByEmailFax2?: boolean | null;
      emailFax2?: string | null;
      deliverToAgent?: boolean | null;
      agentContact?: string | null;
    } | null;
    sellerNotices?: {
      __typename: "NoticesDetail";
      deliverToAddress?: boolean | null;
      streetAddress?: string | null;
      city?: string | null;
      state?: string | null;
      postalCode?: string | null;
      deliverByPhone?: boolean | null;
      phone?: string | null;
      deliverByEmailFax1?: boolean | null;
      emailFax1?: string | null;
      deliveryByEmailFax2?: boolean | null;
      emailFax2?: string | null;
      deliverToAgent?: boolean | null;
      agentContact?: string | null;
    } | null;
    buyerAttorney?: {
      __typename: "Attorney";
      hasAttorney?: boolean | null;
      name?: string | null;
      streetAddress?: string | null;
      city?: string | null;
      state?: string | null;
      postalCode?: string | null;
      phone?: string | null;
      email?: string | null;
      fax?: string | null;
    } | null;
    buyerAgent?: {
      __typename: "BuyerAgent";
      hasBuyerAgent?: boolean | null;
      firmName?: string | null;
      firmLicenseNumber?: string | null;
      firmStreetAddress?: string | null;
      firmCity?: string | null;
      firmState?: string | null;
      firmPostalCode?: string | null;
      firmPhone?: string | null;
      associateName?: string | null;
      associateLicenseNumber?: string | null;
      associateTeamName?: string | null;
      associateEmail?: string | null;
      associatePhone?: string | null;
      associateSupervisorName?: string | null;
      associateSupervisorLicenseNumber?: string | null;
    } | null;
    sellerAttorney?: {
      __typename: "Attorney";
      hasAttorney?: boolean | null;
      name?: string | null;
      streetAddress?: string | null;
      city?: string | null;
      state?: string | null;
      postalCode?: string | null;
      phone?: string | null;
      email?: string | null;
      fax?: string | null;
    } | null;
    listingAgent?: {
      __typename: "ListingAgent";
      hasListingAgentInfo?: boolean | null;
      firmName?: string | null;
      firmLicenseNumber?: string | null;
      firmStreetAddress?: string | null;
      firmCity?: string | null;
      firmState?: string | null;
      firmPostalCode?: string | null;
      firmPhone?: string | null;
      listingAssociateName?: string | null;
      listingAssociateLicenseNumber?: string | null;
      listingAssociateTeamName?: string | null;
      listingAssociateEmail?: string | null;
      listingAssociatePhone?: string | null;
      listingAssociateSupervisorName?: string | null;
      listingAssociateSupervisorLicenseNumber?: string | null;
      sellingAssociateName?: string | null;
      sellingAssociateLicenseNumber?: string | null;
      sellingAssociateTeamName?: string | null;
      sellingAssociateEmail?: string | null;
      sellingAssociatePhone?: string | null;
      sellingAssociateSupervisorName?: string | null;
      sellingAssociateSupervisorLicenseNumber?: string | null;
      sellingAssociateStreetAddress?: string | null;
      sellingAssociateCity?: string | null;
      sellingAssociateState?: string | null;
      sellingAssociatePostalCode?: string | null;
    } | null;
    markedQuestions?: string | null;
    homeownersAssociationAddendum?: {
      __typename: "HomeownersAssociationAddendum";
      hasHomeownersAssociation?: boolean | null;
      storageKey?: string | null;
      associationName?: string | null;
      associationPhoneNumber?: string | null;
      requiresSubdivisionInfo?: boolean | null;
      receivedSubdivisionInfo?: boolean | null;
      requiresUpdatedResaleCertificate?: boolean | null;
      subdivisionInfoProvidedBy?: PartyType | null;
      subdivisionInfoDaysToDeliver?: number | null;
      buyerFeesNotToExceed?: number | null;
      feeForTitleCompanyPaidBy?: PartyType | null;
    } | null;
    leadBasedPaintAddendum?: {
      __typename: "LeadBasedPaintAddendum";
      hasLeadBasedPaintDisclosure?: boolean | null;
      storageKey?: string | null;
      leadBasedPaintDisclosure?: string | null;
    } | null;
    rightToTerminateByLenderAppraisalAddendum?: {
      __typename: "RightToTerminateByLenderAppraisalAddendum";
      hasRightToTerminateByLenderAppraisal?: boolean | null;
      storageKey?: string | null;
      appraisalAmount?: number | null;
    } | null;
    sellerTemporaryLeaseAddendum?: {
      __typename: "SellerTemporaryLeaseAddendum";
      hasSellersTemporaryLease?: boolean | null;
      storageKey?: string | null;
      leaseLength?: number | null;
    } | null;
    createdAt: string;
    updatedAt: string;
    accountContractId?: string | null;
    owner?: string | null;
  } | null;
};

export type UpdateAccountMutationVariables = {
  input: UpdateAccountInput;
  condition?: ModelAccountConditionInput | null;
};

export type UpdateAccountMutation = {
  updateAccount?: {
    __typename: "Account";
    id: string;
    email: string;
    billingId?: string | null;
    contract?: {
      __typename: "ModelContractConnection";
      items: Array<{
        __typename: "Contract";
        id: string;
        buyers?: {
          __typename: "ContractParty";
          primaryName?: string | null;
          phone?: string | null;
          fax?: string | null;
          email?: string | null;
          hasSecondaryParty?: boolean | null;
          secondaryName?: string | null;
          secondaryPhone?: string | null;
          secondaryFax?: string | null;
          secondaryEmail?: string | null;
        } | null;
        property?: {
          __typename: "Property";
          lot?: string | null;
          block?: string | null;
          county?: string | null;
          legalDescription?: string | null;
          mlsNumber?: string | null;
          streetAddress?: string | null;
          city?: string | null;
          state?: string | null;
          postalCode?: string | null;
          subdivision?: string | null;
          yearBuilt?: number | null;
          numBedroom?: number | null;
          numBathroom?: number | null;
          numFloor?: number | null;
          floorSizeValue?: number | null;
          floorSizeUnit?: string | null;
          lotSizeValue?: number | null;
          lotSizeUnit?: string | null;
          mostRecentPriceAmount?: number | null;
          mostRecentPriceDate?: string | null;
          dateAdded?: string | null;
          dateUpdated?: string | null;
          description?: string | null;
          imageUrl?: string | null;
        } | null;
        finance?: {
          __typename: "Finance";
          hasPreferredLender?: boolean | null;
          wantsLenderReferral?: boolean | null;
          buyerApprovalNoticeDays?: number | null;
          cashAmount?: number | null;
          fhaVaAppraisedValue?: number | null;
          fhaSectionNumber?: number | null;
          financingType?: FinancingType | null;
          interestRate?: number | null;
          interestRateYears?: number | null;
          isBuyerApprovalRequired?: boolean | null;
          isSecondMortgage?: boolean | null;
          loanType?: LoanType | null;
          originationChargePercent?: number | null;
          otherFinancingLenderName?: string | null;
          otherFinancingWaiveRights?: boolean | null;
          principalAmount?: number | null;
          reverseMortgageIsFHAInsured?: boolean | null;
          storageKey?: string | null;
          termYears?: number | null;
          totalSalesPrice?: number | null;
          terminationOnAppraisalType?: TerminationOnAppraisalType | null;
          terminationOpinionOfValueAmount?: number | null;
          terminationDaysAfterEffectiveDate?: number | null;
          terminationAppraisedValueLessThan?: number | null;
        } | null;
        leases?: {
          __typename: "Leases";
          hasResidentialLease?: boolean | null;
          hasFixtureLease?: boolean | null;
          hasMineralLease?: boolean | null;
          mineralLeaseCopyDelivered?: boolean | null;
          mineralLeaseDaysToDeliveryCopy?: number | null;
        } | null;
        sellers?: {
          __typename: "ContractParty";
          primaryName?: string | null;
          phone?: string | null;
          fax?: string | null;
          email?: string | null;
          hasSecondaryParty?: boolean | null;
          secondaryName?: string | null;
          secondaryPhone?: string | null;
          secondaryFax?: string | null;
          secondaryEmail?: string | null;
        } | null;
        title?: {
          __typename: "TitleDetail";
          hasTitleCompany?: boolean | null;
          wantsTitleReferral?: boolean | null;
          titleCompanyName?: string | null;
          titleCompanyStreetAddress?: string | null;
          titleCompanyCity?: string | null;
          titleCompanyState?: string | null;
          titleCompanyPostalCode?: string | null;
          standardExceptionsToBeAmended?: boolean | null;
          standardExceptionsToBeAmendedBy?: PartyType | null;
          titleFurnishingParty?: PartyType | null;
          escrowAgentName?: string | null;
          earnestMoney?: number | null;
          hasOptionFee?: boolean | null;
          optionFee?: number | null;
          hasAdditionalEarnestMoney?: boolean | null;
          additionalEarnestMoney?: number | null;
          additionalEarnestMoneyDaysToDeliver?: number | null;
          optionPeriodDaysToTerminate?: number | null;
        } | null;
        titleObjections?: {
          __typename: "TitleObjections";
          objections?: string | null;
          daysToObject?: number | null;
        } | null;
        survey?: {
          __typename: "SurveyDetail";
          daysToFurnish?: number | null;
          type?: SurveyType | null;
          furnishingPartyIfExistingIsUnacceptable?: PartyType | null;
        } | null;
        titleNotices?: {
          __typename: "TitleNotices";
          isInMUD?: boolean | null;
          isInCoastalArea?: boolean | null;
          isInPublicImprovementDistrict?: boolean | null;
          isInPropaneServiceArea?: boolean | null;
        } | null;
        propertyCondition?: {
          __typename: "PropertyCondition";
          sellerDisclosureReceived?: boolean | null;
          sellerDisclosureDaysToProduce?: number | null;
          sellerRequiredToDisclose?: boolean | null;
          buyerAcceptsAsIs?: boolean | null;
          retainedImprovements?: string | null;
          buyerAcceptanceRepairSpecifics?: string | null;
          serviceContractReimbursementAmount?: number | null;
        } | null;
        brokerDisclosure?: {
          __typename: "BrokerDisclosure";
          buyerIsThirdPartyAgent?: boolean | null;
          buyerIsRelatedToSeller?: boolean | null;
          buyerHasStakeInProperty?: boolean | null;
          buyerIsBeingCompensated?: boolean | null;
          buyerDisclosure?: string | null;
        } | null;
        closing?: {
          __typename: "ClosingDetail";
          closingDate?: string | null;
        } | null;
        possession?: {
          __typename: "PossessionDetail";
          possessionUponClosing?: boolean | null;
          possessionAccordingToTempLease?: boolean | null;
        } | null;
        buyerProvisions?: {
          __typename: "BuyerProvisionsDetail";
          buyerProvisions?: string | null;
          additionalExpensesPaidBySeller?: number | null;
        } | null;
        buyerNotices?: {
          __typename: "NoticesDetail";
          deliverToAddress?: boolean | null;
          streetAddress?: string | null;
          city?: string | null;
          state?: string | null;
          postalCode?: string | null;
          deliverByPhone?: boolean | null;
          phone?: string | null;
          deliverByEmailFax1?: boolean | null;
          emailFax1?: string | null;
          deliveryByEmailFax2?: boolean | null;
          emailFax2?: string | null;
          deliverToAgent?: boolean | null;
          agentContact?: string | null;
        } | null;
        sellerNotices?: {
          __typename: "NoticesDetail";
          deliverToAddress?: boolean | null;
          streetAddress?: string | null;
          city?: string | null;
          state?: string | null;
          postalCode?: string | null;
          deliverByPhone?: boolean | null;
          phone?: string | null;
          deliverByEmailFax1?: boolean | null;
          emailFax1?: string | null;
          deliveryByEmailFax2?: boolean | null;
          emailFax2?: string | null;
          deliverToAgent?: boolean | null;
          agentContact?: string | null;
        } | null;
        buyerAttorney?: {
          __typename: "Attorney";
          hasAttorney?: boolean | null;
          name?: string | null;
          streetAddress?: string | null;
          city?: string | null;
          state?: string | null;
          postalCode?: string | null;
          phone?: string | null;
          email?: string | null;
          fax?: string | null;
        } | null;
        buyerAgent?: {
          __typename: "BuyerAgent";
          hasBuyerAgent?: boolean | null;
          firmName?: string | null;
          firmLicenseNumber?: string | null;
          firmStreetAddress?: string | null;
          firmCity?: string | null;
          firmState?: string | null;
          firmPostalCode?: string | null;
          firmPhone?: string | null;
          associateName?: string | null;
          associateLicenseNumber?: string | null;
          associateTeamName?: string | null;
          associateEmail?: string | null;
          associatePhone?: string | null;
          associateSupervisorName?: string | null;
          associateSupervisorLicenseNumber?: string | null;
        } | null;
        sellerAttorney?: {
          __typename: "Attorney";
          hasAttorney?: boolean | null;
          name?: string | null;
          streetAddress?: string | null;
          city?: string | null;
          state?: string | null;
          postalCode?: string | null;
          phone?: string | null;
          email?: string | null;
          fax?: string | null;
        } | null;
        listingAgent?: {
          __typename: "ListingAgent";
          hasListingAgentInfo?: boolean | null;
          firmName?: string | null;
          firmLicenseNumber?: string | null;
          firmStreetAddress?: string | null;
          firmCity?: string | null;
          firmState?: string | null;
          firmPostalCode?: string | null;
          firmPhone?: string | null;
          listingAssociateName?: string | null;
          listingAssociateLicenseNumber?: string | null;
          listingAssociateTeamName?: string | null;
          listingAssociateEmail?: string | null;
          listingAssociatePhone?: string | null;
          listingAssociateSupervisorName?: string | null;
          listingAssociateSupervisorLicenseNumber?: string | null;
          sellingAssociateName?: string | null;
          sellingAssociateLicenseNumber?: string | null;
          sellingAssociateTeamName?: string | null;
          sellingAssociateEmail?: string | null;
          sellingAssociatePhone?: string | null;
          sellingAssociateSupervisorName?: string | null;
          sellingAssociateSupervisorLicenseNumber?: string | null;
          sellingAssociateStreetAddress?: string | null;
          sellingAssociateCity?: string | null;
          sellingAssociateState?: string | null;
          sellingAssociatePostalCode?: string | null;
        } | null;
        markedQuestions?: string | null;
        homeownersAssociationAddendum?: {
          __typename: "HomeownersAssociationAddendum";
          hasHomeownersAssociation?: boolean | null;
          storageKey?: string | null;
          associationName?: string | null;
          associationPhoneNumber?: string | null;
          requiresSubdivisionInfo?: boolean | null;
          receivedSubdivisionInfo?: boolean | null;
          requiresUpdatedResaleCertificate?: boolean | null;
          subdivisionInfoProvidedBy?: PartyType | null;
          subdivisionInfoDaysToDeliver?: number | null;
          buyerFeesNotToExceed?: number | null;
          feeForTitleCompanyPaidBy?: PartyType | null;
        } | null;
        leadBasedPaintAddendum?: {
          __typename: "LeadBasedPaintAddendum";
          hasLeadBasedPaintDisclosure?: boolean | null;
          storageKey?: string | null;
          leadBasedPaintDisclosure?: string | null;
        } | null;
        rightToTerminateByLenderAppraisalAddendum?: {
          __typename: "RightToTerminateByLenderAppraisalAddendum";
          hasRightToTerminateByLenderAppraisal?: boolean | null;
          storageKey?: string | null;
          appraisalAmount?: number | null;
        } | null;
        sellerTemporaryLeaseAddendum?: {
          __typename: "SellerTemporaryLeaseAddendum";
          hasSellersTemporaryLease?: boolean | null;
          storageKey?: string | null;
          leaseLength?: number | null;
        } | null;
        createdAt: string;
        updatedAt: string;
        accountContractId?: string | null;
        owner?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    isPaid?: boolean | null;
    street1?: string | null;
    street2?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    firstName?: string | null;
    middleInitial?: string | null;
    lastName?: string | null;
    owner: string;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type DeleteAccountMutationVariables = {
  input: DeleteAccountInput;
  condition?: ModelAccountConditionInput | null;
};

export type DeleteAccountMutation = {
  deleteAccount?: {
    __typename: "Account";
    id: string;
    email: string;
    billingId?: string | null;
    contract?: {
      __typename: "ModelContractConnection";
      items: Array<{
        __typename: "Contract";
        id: string;
        buyers?: {
          __typename: "ContractParty";
          primaryName?: string | null;
          phone?: string | null;
          fax?: string | null;
          email?: string | null;
          hasSecondaryParty?: boolean | null;
          secondaryName?: string | null;
          secondaryPhone?: string | null;
          secondaryFax?: string | null;
          secondaryEmail?: string | null;
        } | null;
        property?: {
          __typename: "Property";
          lot?: string | null;
          block?: string | null;
          county?: string | null;
          legalDescription?: string | null;
          mlsNumber?: string | null;
          streetAddress?: string | null;
          city?: string | null;
          state?: string | null;
          postalCode?: string | null;
          subdivision?: string | null;
          yearBuilt?: number | null;
          numBedroom?: number | null;
          numBathroom?: number | null;
          numFloor?: number | null;
          floorSizeValue?: number | null;
          floorSizeUnit?: string | null;
          lotSizeValue?: number | null;
          lotSizeUnit?: string | null;
          mostRecentPriceAmount?: number | null;
          mostRecentPriceDate?: string | null;
          dateAdded?: string | null;
          dateUpdated?: string | null;
          description?: string | null;
          imageUrl?: string | null;
        } | null;
        finance?: {
          __typename: "Finance";
          hasPreferredLender?: boolean | null;
          wantsLenderReferral?: boolean | null;
          buyerApprovalNoticeDays?: number | null;
          cashAmount?: number | null;
          fhaVaAppraisedValue?: number | null;
          fhaSectionNumber?: number | null;
          financingType?: FinancingType | null;
          interestRate?: number | null;
          interestRateYears?: number | null;
          isBuyerApprovalRequired?: boolean | null;
          isSecondMortgage?: boolean | null;
          loanType?: LoanType | null;
          originationChargePercent?: number | null;
          otherFinancingLenderName?: string | null;
          otherFinancingWaiveRights?: boolean | null;
          principalAmount?: number | null;
          reverseMortgageIsFHAInsured?: boolean | null;
          storageKey?: string | null;
          termYears?: number | null;
          totalSalesPrice?: number | null;
          terminationOnAppraisalType?: TerminationOnAppraisalType | null;
          terminationOpinionOfValueAmount?: number | null;
          terminationDaysAfterEffectiveDate?: number | null;
          terminationAppraisedValueLessThan?: number | null;
        } | null;
        leases?: {
          __typename: "Leases";
          hasResidentialLease?: boolean | null;
          hasFixtureLease?: boolean | null;
          hasMineralLease?: boolean | null;
          mineralLeaseCopyDelivered?: boolean | null;
          mineralLeaseDaysToDeliveryCopy?: number | null;
        } | null;
        sellers?: {
          __typename: "ContractParty";
          primaryName?: string | null;
          phone?: string | null;
          fax?: string | null;
          email?: string | null;
          hasSecondaryParty?: boolean | null;
          secondaryName?: string | null;
          secondaryPhone?: string | null;
          secondaryFax?: string | null;
          secondaryEmail?: string | null;
        } | null;
        title?: {
          __typename: "TitleDetail";
          hasTitleCompany?: boolean | null;
          wantsTitleReferral?: boolean | null;
          titleCompanyName?: string | null;
          titleCompanyStreetAddress?: string | null;
          titleCompanyCity?: string | null;
          titleCompanyState?: string | null;
          titleCompanyPostalCode?: string | null;
          standardExceptionsToBeAmended?: boolean | null;
          standardExceptionsToBeAmendedBy?: PartyType | null;
          titleFurnishingParty?: PartyType | null;
          escrowAgentName?: string | null;
          earnestMoney?: number | null;
          hasOptionFee?: boolean | null;
          optionFee?: number | null;
          hasAdditionalEarnestMoney?: boolean | null;
          additionalEarnestMoney?: number | null;
          additionalEarnestMoneyDaysToDeliver?: number | null;
          optionPeriodDaysToTerminate?: number | null;
        } | null;
        titleObjections?: {
          __typename: "TitleObjections";
          objections?: string | null;
          daysToObject?: number | null;
        } | null;
        survey?: {
          __typename: "SurveyDetail";
          daysToFurnish?: number | null;
          type?: SurveyType | null;
          furnishingPartyIfExistingIsUnacceptable?: PartyType | null;
        } | null;
        titleNotices?: {
          __typename: "TitleNotices";
          isInMUD?: boolean | null;
          isInCoastalArea?: boolean | null;
          isInPublicImprovementDistrict?: boolean | null;
          isInPropaneServiceArea?: boolean | null;
        } | null;
        propertyCondition?: {
          __typename: "PropertyCondition";
          sellerDisclosureReceived?: boolean | null;
          sellerDisclosureDaysToProduce?: number | null;
          sellerRequiredToDisclose?: boolean | null;
          buyerAcceptsAsIs?: boolean | null;
          retainedImprovements?: string | null;
          buyerAcceptanceRepairSpecifics?: string | null;
          serviceContractReimbursementAmount?: number | null;
        } | null;
        brokerDisclosure?: {
          __typename: "BrokerDisclosure";
          buyerIsThirdPartyAgent?: boolean | null;
          buyerIsRelatedToSeller?: boolean | null;
          buyerHasStakeInProperty?: boolean | null;
          buyerIsBeingCompensated?: boolean | null;
          buyerDisclosure?: string | null;
        } | null;
        closing?: {
          __typename: "ClosingDetail";
          closingDate?: string | null;
        } | null;
        possession?: {
          __typename: "PossessionDetail";
          possessionUponClosing?: boolean | null;
          possessionAccordingToTempLease?: boolean | null;
        } | null;
        buyerProvisions?: {
          __typename: "BuyerProvisionsDetail";
          buyerProvisions?: string | null;
          additionalExpensesPaidBySeller?: number | null;
        } | null;
        buyerNotices?: {
          __typename: "NoticesDetail";
          deliverToAddress?: boolean | null;
          streetAddress?: string | null;
          city?: string | null;
          state?: string | null;
          postalCode?: string | null;
          deliverByPhone?: boolean | null;
          phone?: string | null;
          deliverByEmailFax1?: boolean | null;
          emailFax1?: string | null;
          deliveryByEmailFax2?: boolean | null;
          emailFax2?: string | null;
          deliverToAgent?: boolean | null;
          agentContact?: string | null;
        } | null;
        sellerNotices?: {
          __typename: "NoticesDetail";
          deliverToAddress?: boolean | null;
          streetAddress?: string | null;
          city?: string | null;
          state?: string | null;
          postalCode?: string | null;
          deliverByPhone?: boolean | null;
          phone?: string | null;
          deliverByEmailFax1?: boolean | null;
          emailFax1?: string | null;
          deliveryByEmailFax2?: boolean | null;
          emailFax2?: string | null;
          deliverToAgent?: boolean | null;
          agentContact?: string | null;
        } | null;
        buyerAttorney?: {
          __typename: "Attorney";
          hasAttorney?: boolean | null;
          name?: string | null;
          streetAddress?: string | null;
          city?: string | null;
          state?: string | null;
          postalCode?: string | null;
          phone?: string | null;
          email?: string | null;
          fax?: string | null;
        } | null;
        buyerAgent?: {
          __typename: "BuyerAgent";
          hasBuyerAgent?: boolean | null;
          firmName?: string | null;
          firmLicenseNumber?: string | null;
          firmStreetAddress?: string | null;
          firmCity?: string | null;
          firmState?: string | null;
          firmPostalCode?: string | null;
          firmPhone?: string | null;
          associateName?: string | null;
          associateLicenseNumber?: string | null;
          associateTeamName?: string | null;
          associateEmail?: string | null;
          associatePhone?: string | null;
          associateSupervisorName?: string | null;
          associateSupervisorLicenseNumber?: string | null;
        } | null;
        sellerAttorney?: {
          __typename: "Attorney";
          hasAttorney?: boolean | null;
          name?: string | null;
          streetAddress?: string | null;
          city?: string | null;
          state?: string | null;
          postalCode?: string | null;
          phone?: string | null;
          email?: string | null;
          fax?: string | null;
        } | null;
        listingAgent?: {
          __typename: "ListingAgent";
          hasListingAgentInfo?: boolean | null;
          firmName?: string | null;
          firmLicenseNumber?: string | null;
          firmStreetAddress?: string | null;
          firmCity?: string | null;
          firmState?: string | null;
          firmPostalCode?: string | null;
          firmPhone?: string | null;
          listingAssociateName?: string | null;
          listingAssociateLicenseNumber?: string | null;
          listingAssociateTeamName?: string | null;
          listingAssociateEmail?: string | null;
          listingAssociatePhone?: string | null;
          listingAssociateSupervisorName?: string | null;
          listingAssociateSupervisorLicenseNumber?: string | null;
          sellingAssociateName?: string | null;
          sellingAssociateLicenseNumber?: string | null;
          sellingAssociateTeamName?: string | null;
          sellingAssociateEmail?: string | null;
          sellingAssociatePhone?: string | null;
          sellingAssociateSupervisorName?: string | null;
          sellingAssociateSupervisorLicenseNumber?: string | null;
          sellingAssociateStreetAddress?: string | null;
          sellingAssociateCity?: string | null;
          sellingAssociateState?: string | null;
          sellingAssociatePostalCode?: string | null;
        } | null;
        markedQuestions?: string | null;
        homeownersAssociationAddendum?: {
          __typename: "HomeownersAssociationAddendum";
          hasHomeownersAssociation?: boolean | null;
          storageKey?: string | null;
          associationName?: string | null;
          associationPhoneNumber?: string | null;
          requiresSubdivisionInfo?: boolean | null;
          receivedSubdivisionInfo?: boolean | null;
          requiresUpdatedResaleCertificate?: boolean | null;
          subdivisionInfoProvidedBy?: PartyType | null;
          subdivisionInfoDaysToDeliver?: number | null;
          buyerFeesNotToExceed?: number | null;
          feeForTitleCompanyPaidBy?: PartyType | null;
        } | null;
        leadBasedPaintAddendum?: {
          __typename: "LeadBasedPaintAddendum";
          hasLeadBasedPaintDisclosure?: boolean | null;
          storageKey?: string | null;
          leadBasedPaintDisclosure?: string | null;
        } | null;
        rightToTerminateByLenderAppraisalAddendum?: {
          __typename: "RightToTerminateByLenderAppraisalAddendum";
          hasRightToTerminateByLenderAppraisal?: boolean | null;
          storageKey?: string | null;
          appraisalAmount?: number | null;
        } | null;
        sellerTemporaryLeaseAddendum?: {
          __typename: "SellerTemporaryLeaseAddendum";
          hasSellersTemporaryLease?: boolean | null;
          storageKey?: string | null;
          leaseLength?: number | null;
        } | null;
        createdAt: string;
        updatedAt: string;
        accountContractId?: string | null;
        owner?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    isPaid?: boolean | null;
    street1?: string | null;
    street2?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    firstName?: string | null;
    middleInitial?: string | null;
    lastName?: string | null;
    owner: string;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type CountAgentsBySourceQueryVariables = {
  source: string;
};

export type CountAgentsBySourceQuery = {
  countAgentsBySource?: {
    __typename: "AgentCountResult";
    count: number;
  } | null;
};

export type ScanListingAgentContactInfosQueryVariables = {
  query: string;
  limit?: number | null;
  nextToken?: string | null;
};

export type ScanListingAgentContactInfosQuery = {
  scanListingAgentContactInfos?: {
    __typename: "ScanListingAgentContactInfoResult";
    items?: Array<{
      __typename: "ListingAgentContactInfo";
      id: string;
      name?: string | null;
      agencyName?: string | null;
      profileUrl?: string | null;
      phoneNumbers?: Array<string | null> | null;
      emailAddresses?: Array<string | null> | null;
      source?: string | null;
      importDate?: string | null;
      notes?: string | null;
      metaData?: string | null;
      createdAt: string;
      updatedAt: string;
    } | null> | null;
    nextToken?: string | null;
  } | null;
};

export type GetEmailPacketQueryVariables = {
  id: string;
};

export type GetEmailPacketQuery = {
  getEmailPacket?: {
    __typename: "EmailPacket";
    id: string;
    accountId: string;
    contractId: string;
    streetAddress: string;
    agentEmail: string;
    agentName: string;
    status: string;
    comments?: string | null;
    subject: string;
    body: string;
    contractFiles: Array<string>;
    preApprovalFile: string;
    earnestFile: string;
    optionFile: string;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type ListEmailPacketsQueryVariables = {
  filter?: ModelEmailPacketFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListEmailPacketsQuery = {
  listEmailPackets?: {
    __typename: "ModelEmailPacketConnection";
    items: Array<{
      __typename: "EmailPacket";
      id: string;
      accountId: string;
      contractId: string;
      streetAddress: string;
      agentEmail: string;
      agentName: string;
      status: string;
      comments?: string | null;
      subject: string;
      body: string;
      contractFiles: Array<string>;
      preApprovalFile: string;
      earnestFile: string;
      optionFile: string;
      createdAt: string;
      updatedAt: string;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type GetListingAgentContactInfoQueryVariables = {
  id: string;
};

export type GetListingAgentContactInfoQuery = {
  getListingAgentContactInfo?: {
    __typename: "ListingAgentContactInfo";
    id: string;
    name?: string | null;
    agencyName?: string | null;
    profileUrl?: string | null;
    phoneNumbers?: Array<string | null> | null;
    emailAddresses?: Array<string | null> | null;
    source?: string | null;
    importDate?: string | null;
    notes?: string | null;
    metaData?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type ListListingAgentContactInfosQueryVariables = {
  filter?: ModelListingAgentContactInfoFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListListingAgentContactInfosQuery = {
  listListingAgentContactInfos?: {
    __typename: "ModelListingAgentContactInfoConnection";
    items: Array<{
      __typename: "ListingAgentContactInfo";
      id: string;
      name?: string | null;
      agencyName?: string | null;
      profileUrl?: string | null;
      phoneNumbers?: Array<string | null> | null;
      emailAddresses?: Array<string | null> | null;
      source?: string | null;
      importDate?: string | null;
      notes?: string | null;
      metaData?: string | null;
      createdAt: string;
      updatedAt: string;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type EmailPacketsByAccountIdQueryVariables = {
  accountId: string;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelEmailPacketFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type EmailPacketsByAccountIdQuery = {
  emailPacketsByAccountId?: {
    __typename: "ModelEmailPacketConnection";
    items: Array<{
      __typename: "EmailPacket";
      id: string;
      accountId: string;
      contractId: string;
      streetAddress: string;
      agentEmail: string;
      agentName: string;
      status: string;
      comments?: string | null;
      subject: string;
      body: string;
      contractFiles: Array<string>;
      preApprovalFile: string;
      earnestFile: string;
      optionFile: string;
      createdAt: string;
      updatedAt: string;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type EmailPacketsByContractIdQueryVariables = {
  contractId: string;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelEmailPacketFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type EmailPacketsByContractIdQuery = {
  emailPacketsByContractId?: {
    __typename: "ModelEmailPacketConnection";
    items: Array<{
      __typename: "EmailPacket";
      id: string;
      accountId: string;
      contractId: string;
      streetAddress: string;
      agentEmail: string;
      agentName: string;
      status: string;
      comments?: string | null;
      subject: string;
      body: string;
      contractFiles: Array<string>;
      preApprovalFile: string;
      earnestFile: string;
      optionFile: string;
      createdAt: string;
      updatedAt: string;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type ListListingAgentContactInfosByNameQueryVariables = {
  name: string;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelListingAgentContactInfoFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListListingAgentContactInfosByNameQuery = {
  listListingAgentContactInfosByName?: {
    __typename: "ModelListingAgentContactInfoConnection";
    items: Array<{
      __typename: "ListingAgentContactInfo";
      id: string;
      name?: string | null;
      agencyName?: string | null;
      profileUrl?: string | null;
      phoneNumbers?: Array<string | null> | null;
      emailAddresses?: Array<string | null> | null;
      source?: string | null;
      importDate?: string | null;
      notes?: string | null;
      metaData?: string | null;
      createdAt: string;
      updatedAt: string;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type GetEtchPacketQueryVariables = {
  eid: string;
};

export type GetEtchPacketQuery = {
  getEtchPacket?: {
    __typename: "EtchPacket";
    eid: string;
    documentGroup: {
      __typename: "DocumentGroup";
      eid: string;
      status: string;
      files: Array<{
        __typename: "DocumentGroupFile";
        downloadURL: string;
        filename: string;
        name: string;
        type: string;
      } | null>;
      signers: Array<{
        __typename: "Signer";
        eid: string;
        aliasId: string;
        name: string;
        email: string;
        routingOrder: number;
        signActionType: string;
        status: string;
        uploadKeys?: Array<string | null> | null;
      } | null>;
    };
    contractId: string;
    createdAt: string;
    updatedAt: string;
    owner?: string | null;
  } | null;
};

export type ListEtchPacketsQueryVariables = {
  eid?: string | null;
  filter?: ModelEtchPacketFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
  sortDirection?: ModelSortDirection | null;
};

export type ListEtchPacketsQuery = {
  listEtchPackets?: {
    __typename: "ModelEtchPacketConnection";
    items: Array<{
      __typename: "EtchPacket";
      eid: string;
      documentGroup: {
        __typename: "DocumentGroup";
        eid: string;
        status: string;
        files: Array<{
          __typename: "DocumentGroupFile";
          downloadURL: string;
          filename: string;
          name: string;
          type: string;
        } | null>;
        signers: Array<{
          __typename: "Signer";
          eid: string;
          aliasId: string;
          name: string;
          email: string;
          routingOrder: number;
          signActionType: string;
          status: string;
          uploadKeys?: Array<string | null> | null;
        } | null>;
      };
      contractId: string;
      createdAt: string;
      updatedAt: string;
      owner?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type EtchPacketsByContractIdQueryVariables = {
  contractId: string;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelEtchPacketFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type EtchPacketsByContractIdQuery = {
  etchPacketsByContractId?: {
    __typename: "ModelEtchPacketConnection";
    items: Array<{
      __typename: "EtchPacket";
      eid: string;
      documentGroup: {
        __typename: "DocumentGroup";
        eid: string;
        status: string;
        files: Array<{
          __typename: "DocumentGroupFile";
          downloadURL: string;
          filename: string;
          name: string;
          type: string;
        } | null>;
        signers: Array<{
          __typename: "Signer";
          eid: string;
          aliasId: string;
          name: string;
          email: string;
          routingOrder: number;
          signActionType: string;
          status: string;
          uploadKeys?: Array<string | null> | null;
        } | null>;
      };
      contractId: string;
      createdAt: string;
      updatedAt: string;
      owner?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type GetContractQueryVariables = {
  id: string;
};

export type GetContractQuery = {
  getContract?: {
    __typename: "Contract";
    id: string;
    buyers?: {
      __typename: "ContractParty";
      primaryName?: string | null;
      phone?: string | null;
      fax?: string | null;
      email?: string | null;
      hasSecondaryParty?: boolean | null;
      secondaryName?: string | null;
      secondaryPhone?: string | null;
      secondaryFax?: string | null;
      secondaryEmail?: string | null;
    } | null;
    property?: {
      __typename: "Property";
      lot?: string | null;
      block?: string | null;
      county?: string | null;
      legalDescription?: string | null;
      mlsNumber?: string | null;
      streetAddress?: string | null;
      city?: string | null;
      state?: string | null;
      postalCode?: string | null;
      subdivision?: string | null;
      yearBuilt?: number | null;
      numBedroom?: number | null;
      numBathroom?: number | null;
      numFloor?: number | null;
      floorSizeValue?: number | null;
      floorSizeUnit?: string | null;
      lotSizeValue?: number | null;
      lotSizeUnit?: string | null;
      mostRecentPriceAmount?: number | null;
      mostRecentPriceDate?: string | null;
      dateAdded?: string | null;
      dateUpdated?: string | null;
      description?: string | null;
      imageUrl?: string | null;
    } | null;
    finance?: {
      __typename: "Finance";
      hasPreferredLender?: boolean | null;
      wantsLenderReferral?: boolean | null;
      buyerApprovalNoticeDays?: number | null;
      cashAmount?: number | null;
      fhaVaAppraisedValue?: number | null;
      fhaSectionNumber?: number | null;
      financingType?: FinancingType | null;
      interestRate?: number | null;
      interestRateYears?: number | null;
      isBuyerApprovalRequired?: boolean | null;
      isSecondMortgage?: boolean | null;
      loanType?: LoanType | null;
      originationChargePercent?: number | null;
      otherFinancingLenderName?: string | null;
      otherFinancingWaiveRights?: boolean | null;
      principalAmount?: number | null;
      reverseMortgageIsFHAInsured?: boolean | null;
      storageKey?: string | null;
      termYears?: number | null;
      totalSalesPrice?: number | null;
      terminationOnAppraisalType?: TerminationOnAppraisalType | null;
      terminationOpinionOfValueAmount?: number | null;
      terminationDaysAfterEffectiveDate?: number | null;
      terminationAppraisedValueLessThan?: number | null;
    } | null;
    leases?: {
      __typename: "Leases";
      hasResidentialLease?: boolean | null;
      hasFixtureLease?: boolean | null;
      hasMineralLease?: boolean | null;
      mineralLeaseCopyDelivered?: boolean | null;
      mineralLeaseDaysToDeliveryCopy?: number | null;
    } | null;
    sellers?: {
      __typename: "ContractParty";
      primaryName?: string | null;
      phone?: string | null;
      fax?: string | null;
      email?: string | null;
      hasSecondaryParty?: boolean | null;
      secondaryName?: string | null;
      secondaryPhone?: string | null;
      secondaryFax?: string | null;
      secondaryEmail?: string | null;
    } | null;
    title?: {
      __typename: "TitleDetail";
      hasTitleCompany?: boolean | null;
      wantsTitleReferral?: boolean | null;
      titleCompanyName?: string | null;
      titleCompanyStreetAddress?: string | null;
      titleCompanyCity?: string | null;
      titleCompanyState?: string | null;
      titleCompanyPostalCode?: string | null;
      standardExceptionsToBeAmended?: boolean | null;
      standardExceptionsToBeAmendedBy?: PartyType | null;
      titleFurnishingParty?: PartyType | null;
      escrowAgentName?: string | null;
      earnestMoney?: number | null;
      hasOptionFee?: boolean | null;
      optionFee?: number | null;
      hasAdditionalEarnestMoney?: boolean | null;
      additionalEarnestMoney?: number | null;
      additionalEarnestMoneyDaysToDeliver?: number | null;
      optionPeriodDaysToTerminate?: number | null;
    } | null;
    titleObjections?: {
      __typename: "TitleObjections";
      objections?: string | null;
      daysToObject?: number | null;
    } | null;
    survey?: {
      __typename: "SurveyDetail";
      daysToFurnish?: number | null;
      type?: SurveyType | null;
      furnishingPartyIfExistingIsUnacceptable?: PartyType | null;
    } | null;
    titleNotices?: {
      __typename: "TitleNotices";
      isInMUD?: boolean | null;
      isInCoastalArea?: boolean | null;
      isInPublicImprovementDistrict?: boolean | null;
      isInPropaneServiceArea?: boolean | null;
    } | null;
    propertyCondition?: {
      __typename: "PropertyCondition";
      sellerDisclosureReceived?: boolean | null;
      sellerDisclosureDaysToProduce?: number | null;
      sellerRequiredToDisclose?: boolean | null;
      buyerAcceptsAsIs?: boolean | null;
      retainedImprovements?: string | null;
      buyerAcceptanceRepairSpecifics?: string | null;
      serviceContractReimbursementAmount?: number | null;
    } | null;
    brokerDisclosure?: {
      __typename: "BrokerDisclosure";
      buyerIsThirdPartyAgent?: boolean | null;
      buyerIsRelatedToSeller?: boolean | null;
      buyerHasStakeInProperty?: boolean | null;
      buyerIsBeingCompensated?: boolean | null;
      buyerDisclosure?: string | null;
    } | null;
    closing?: {
      __typename: "ClosingDetail";
      closingDate?: string | null;
    } | null;
    possession?: {
      __typename: "PossessionDetail";
      possessionUponClosing?: boolean | null;
      possessionAccordingToTempLease?: boolean | null;
    } | null;
    buyerProvisions?: {
      __typename: "BuyerProvisionsDetail";
      buyerProvisions?: string | null;
      additionalExpensesPaidBySeller?: number | null;
    } | null;
    buyerNotices?: {
      __typename: "NoticesDetail";
      deliverToAddress?: boolean | null;
      streetAddress?: string | null;
      city?: string | null;
      state?: string | null;
      postalCode?: string | null;
      deliverByPhone?: boolean | null;
      phone?: string | null;
      deliverByEmailFax1?: boolean | null;
      emailFax1?: string | null;
      deliveryByEmailFax2?: boolean | null;
      emailFax2?: string | null;
      deliverToAgent?: boolean | null;
      agentContact?: string | null;
    } | null;
    sellerNotices?: {
      __typename: "NoticesDetail";
      deliverToAddress?: boolean | null;
      streetAddress?: string | null;
      city?: string | null;
      state?: string | null;
      postalCode?: string | null;
      deliverByPhone?: boolean | null;
      phone?: string | null;
      deliverByEmailFax1?: boolean | null;
      emailFax1?: string | null;
      deliveryByEmailFax2?: boolean | null;
      emailFax2?: string | null;
      deliverToAgent?: boolean | null;
      agentContact?: string | null;
    } | null;
    buyerAttorney?: {
      __typename: "Attorney";
      hasAttorney?: boolean | null;
      name?: string | null;
      streetAddress?: string | null;
      city?: string | null;
      state?: string | null;
      postalCode?: string | null;
      phone?: string | null;
      email?: string | null;
      fax?: string | null;
    } | null;
    buyerAgent?: {
      __typename: "BuyerAgent";
      hasBuyerAgent?: boolean | null;
      firmName?: string | null;
      firmLicenseNumber?: string | null;
      firmStreetAddress?: string | null;
      firmCity?: string | null;
      firmState?: string | null;
      firmPostalCode?: string | null;
      firmPhone?: string | null;
      associateName?: string | null;
      associateLicenseNumber?: string | null;
      associateTeamName?: string | null;
      associateEmail?: string | null;
      associatePhone?: string | null;
      associateSupervisorName?: string | null;
      associateSupervisorLicenseNumber?: string | null;
    } | null;
    sellerAttorney?: {
      __typename: "Attorney";
      hasAttorney?: boolean | null;
      name?: string | null;
      streetAddress?: string | null;
      city?: string | null;
      state?: string | null;
      postalCode?: string | null;
      phone?: string | null;
      email?: string | null;
      fax?: string | null;
    } | null;
    listingAgent?: {
      __typename: "ListingAgent";
      hasListingAgentInfo?: boolean | null;
      firmName?: string | null;
      firmLicenseNumber?: string | null;
      firmStreetAddress?: string | null;
      firmCity?: string | null;
      firmState?: string | null;
      firmPostalCode?: string | null;
      firmPhone?: string | null;
      listingAssociateName?: string | null;
      listingAssociateLicenseNumber?: string | null;
      listingAssociateTeamName?: string | null;
      listingAssociateEmail?: string | null;
      listingAssociatePhone?: string | null;
      listingAssociateSupervisorName?: string | null;
      listingAssociateSupervisorLicenseNumber?: string | null;
      sellingAssociateName?: string | null;
      sellingAssociateLicenseNumber?: string | null;
      sellingAssociateTeamName?: string | null;
      sellingAssociateEmail?: string | null;
      sellingAssociatePhone?: string | null;
      sellingAssociateSupervisorName?: string | null;
      sellingAssociateSupervisorLicenseNumber?: string | null;
      sellingAssociateStreetAddress?: string | null;
      sellingAssociateCity?: string | null;
      sellingAssociateState?: string | null;
      sellingAssociatePostalCode?: string | null;
    } | null;
    markedQuestions?: string | null;
    homeownersAssociationAddendum?: {
      __typename: "HomeownersAssociationAddendum";
      hasHomeownersAssociation?: boolean | null;
      storageKey?: string | null;
      associationName?: string | null;
      associationPhoneNumber?: string | null;
      requiresSubdivisionInfo?: boolean | null;
      receivedSubdivisionInfo?: boolean | null;
      requiresUpdatedResaleCertificate?: boolean | null;
      subdivisionInfoProvidedBy?: PartyType | null;
      subdivisionInfoDaysToDeliver?: number | null;
      buyerFeesNotToExceed?: number | null;
      feeForTitleCompanyPaidBy?: PartyType | null;
    } | null;
    leadBasedPaintAddendum?: {
      __typename: "LeadBasedPaintAddendum";
      hasLeadBasedPaintDisclosure?: boolean | null;
      storageKey?: string | null;
      leadBasedPaintDisclosure?: string | null;
    } | null;
    rightToTerminateByLenderAppraisalAddendum?: {
      __typename: "RightToTerminateByLenderAppraisalAddendum";
      hasRightToTerminateByLenderAppraisal?: boolean | null;
      storageKey?: string | null;
      appraisalAmount?: number | null;
    } | null;
    sellerTemporaryLeaseAddendum?: {
      __typename: "SellerTemporaryLeaseAddendum";
      hasSellersTemporaryLease?: boolean | null;
      storageKey?: string | null;
      leaseLength?: number | null;
    } | null;
    createdAt: string;
    updatedAt: string;
    accountContractId?: string | null;
    owner?: string | null;
  } | null;
};

export type ListContractsQueryVariables = {
  filter?: ModelContractFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListContractsQuery = {
  listContracts?: {
    __typename: "ModelContractConnection";
    items: Array<{
      __typename: "Contract";
      id: string;
      buyers?: {
        __typename: "ContractParty";
        primaryName?: string | null;
        phone?: string | null;
        fax?: string | null;
        email?: string | null;
        hasSecondaryParty?: boolean | null;
        secondaryName?: string | null;
        secondaryPhone?: string | null;
        secondaryFax?: string | null;
        secondaryEmail?: string | null;
      } | null;
      property?: {
        __typename: "Property";
        lot?: string | null;
        block?: string | null;
        county?: string | null;
        legalDescription?: string | null;
        mlsNumber?: string | null;
        streetAddress?: string | null;
        city?: string | null;
        state?: string | null;
        postalCode?: string | null;
        subdivision?: string | null;
        yearBuilt?: number | null;
        numBedroom?: number | null;
        numBathroom?: number | null;
        numFloor?: number | null;
        floorSizeValue?: number | null;
        floorSizeUnit?: string | null;
        lotSizeValue?: number | null;
        lotSizeUnit?: string | null;
        mostRecentPriceAmount?: number | null;
        mostRecentPriceDate?: string | null;
        dateAdded?: string | null;
        dateUpdated?: string | null;
        description?: string | null;
        imageUrl?: string | null;
      } | null;
      finance?: {
        __typename: "Finance";
        hasPreferredLender?: boolean | null;
        wantsLenderReferral?: boolean | null;
        buyerApprovalNoticeDays?: number | null;
        cashAmount?: number | null;
        fhaVaAppraisedValue?: number | null;
        fhaSectionNumber?: number | null;
        financingType?: FinancingType | null;
        interestRate?: number | null;
        interestRateYears?: number | null;
        isBuyerApprovalRequired?: boolean | null;
        isSecondMortgage?: boolean | null;
        loanType?: LoanType | null;
        originationChargePercent?: number | null;
        otherFinancingLenderName?: string | null;
        otherFinancingWaiveRights?: boolean | null;
        principalAmount?: number | null;
        reverseMortgageIsFHAInsured?: boolean | null;
        storageKey?: string | null;
        termYears?: number | null;
        totalSalesPrice?: number | null;
        terminationOnAppraisalType?: TerminationOnAppraisalType | null;
        terminationOpinionOfValueAmount?: number | null;
        terminationDaysAfterEffectiveDate?: number | null;
        terminationAppraisedValueLessThan?: number | null;
      } | null;
      leases?: {
        __typename: "Leases";
        hasResidentialLease?: boolean | null;
        hasFixtureLease?: boolean | null;
        hasMineralLease?: boolean | null;
        mineralLeaseCopyDelivered?: boolean | null;
        mineralLeaseDaysToDeliveryCopy?: number | null;
      } | null;
      sellers?: {
        __typename: "ContractParty";
        primaryName?: string | null;
        phone?: string | null;
        fax?: string | null;
        email?: string | null;
        hasSecondaryParty?: boolean | null;
        secondaryName?: string | null;
        secondaryPhone?: string | null;
        secondaryFax?: string | null;
        secondaryEmail?: string | null;
      } | null;
      title?: {
        __typename: "TitleDetail";
        hasTitleCompany?: boolean | null;
        wantsTitleReferral?: boolean | null;
        titleCompanyName?: string | null;
        titleCompanyStreetAddress?: string | null;
        titleCompanyCity?: string | null;
        titleCompanyState?: string | null;
        titleCompanyPostalCode?: string | null;
        standardExceptionsToBeAmended?: boolean | null;
        standardExceptionsToBeAmendedBy?: PartyType | null;
        titleFurnishingParty?: PartyType | null;
        escrowAgentName?: string | null;
        earnestMoney?: number | null;
        hasOptionFee?: boolean | null;
        optionFee?: number | null;
        hasAdditionalEarnestMoney?: boolean | null;
        additionalEarnestMoney?: number | null;
        additionalEarnestMoneyDaysToDeliver?: number | null;
        optionPeriodDaysToTerminate?: number | null;
      } | null;
      titleObjections?: {
        __typename: "TitleObjections";
        objections?: string | null;
        daysToObject?: number | null;
      } | null;
      survey?: {
        __typename: "SurveyDetail";
        daysToFurnish?: number | null;
        type?: SurveyType | null;
        furnishingPartyIfExistingIsUnacceptable?: PartyType | null;
      } | null;
      titleNotices?: {
        __typename: "TitleNotices";
        isInMUD?: boolean | null;
        isInCoastalArea?: boolean | null;
        isInPublicImprovementDistrict?: boolean | null;
        isInPropaneServiceArea?: boolean | null;
      } | null;
      propertyCondition?: {
        __typename: "PropertyCondition";
        sellerDisclosureReceived?: boolean | null;
        sellerDisclosureDaysToProduce?: number | null;
        sellerRequiredToDisclose?: boolean | null;
        buyerAcceptsAsIs?: boolean | null;
        retainedImprovements?: string | null;
        buyerAcceptanceRepairSpecifics?: string | null;
        serviceContractReimbursementAmount?: number | null;
      } | null;
      brokerDisclosure?: {
        __typename: "BrokerDisclosure";
        buyerIsThirdPartyAgent?: boolean | null;
        buyerIsRelatedToSeller?: boolean | null;
        buyerHasStakeInProperty?: boolean | null;
        buyerIsBeingCompensated?: boolean | null;
        buyerDisclosure?: string | null;
      } | null;
      closing?: {
        __typename: "ClosingDetail";
        closingDate?: string | null;
      } | null;
      possession?: {
        __typename: "PossessionDetail";
        possessionUponClosing?: boolean | null;
        possessionAccordingToTempLease?: boolean | null;
      } | null;
      buyerProvisions?: {
        __typename: "BuyerProvisionsDetail";
        buyerProvisions?: string | null;
        additionalExpensesPaidBySeller?: number | null;
      } | null;
      buyerNotices?: {
        __typename: "NoticesDetail";
        deliverToAddress?: boolean | null;
        streetAddress?: string | null;
        city?: string | null;
        state?: string | null;
        postalCode?: string | null;
        deliverByPhone?: boolean | null;
        phone?: string | null;
        deliverByEmailFax1?: boolean | null;
        emailFax1?: string | null;
        deliveryByEmailFax2?: boolean | null;
        emailFax2?: string | null;
        deliverToAgent?: boolean | null;
        agentContact?: string | null;
      } | null;
      sellerNotices?: {
        __typename: "NoticesDetail";
        deliverToAddress?: boolean | null;
        streetAddress?: string | null;
        city?: string | null;
        state?: string | null;
        postalCode?: string | null;
        deliverByPhone?: boolean | null;
        phone?: string | null;
        deliverByEmailFax1?: boolean | null;
        emailFax1?: string | null;
        deliveryByEmailFax2?: boolean | null;
        emailFax2?: string | null;
        deliverToAgent?: boolean | null;
        agentContact?: string | null;
      } | null;
      buyerAttorney?: {
        __typename: "Attorney";
        hasAttorney?: boolean | null;
        name?: string | null;
        streetAddress?: string | null;
        city?: string | null;
        state?: string | null;
        postalCode?: string | null;
        phone?: string | null;
        email?: string | null;
        fax?: string | null;
      } | null;
      buyerAgent?: {
        __typename: "BuyerAgent";
        hasBuyerAgent?: boolean | null;
        firmName?: string | null;
        firmLicenseNumber?: string | null;
        firmStreetAddress?: string | null;
        firmCity?: string | null;
        firmState?: string | null;
        firmPostalCode?: string | null;
        firmPhone?: string | null;
        associateName?: string | null;
        associateLicenseNumber?: string | null;
        associateTeamName?: string | null;
        associateEmail?: string | null;
        associatePhone?: string | null;
        associateSupervisorName?: string | null;
        associateSupervisorLicenseNumber?: string | null;
      } | null;
      sellerAttorney?: {
        __typename: "Attorney";
        hasAttorney?: boolean | null;
        name?: string | null;
        streetAddress?: string | null;
        city?: string | null;
        state?: string | null;
        postalCode?: string | null;
        phone?: string | null;
        email?: string | null;
        fax?: string | null;
      } | null;
      listingAgent?: {
        __typename: "ListingAgent";
        hasListingAgentInfo?: boolean | null;
        firmName?: string | null;
        firmLicenseNumber?: string | null;
        firmStreetAddress?: string | null;
        firmCity?: string | null;
        firmState?: string | null;
        firmPostalCode?: string | null;
        firmPhone?: string | null;
        listingAssociateName?: string | null;
        listingAssociateLicenseNumber?: string | null;
        listingAssociateTeamName?: string | null;
        listingAssociateEmail?: string | null;
        listingAssociatePhone?: string | null;
        listingAssociateSupervisorName?: string | null;
        listingAssociateSupervisorLicenseNumber?: string | null;
        sellingAssociateName?: string | null;
        sellingAssociateLicenseNumber?: string | null;
        sellingAssociateTeamName?: string | null;
        sellingAssociateEmail?: string | null;
        sellingAssociatePhone?: string | null;
        sellingAssociateSupervisorName?: string | null;
        sellingAssociateSupervisorLicenseNumber?: string | null;
        sellingAssociateStreetAddress?: string | null;
        sellingAssociateCity?: string | null;
        sellingAssociateState?: string | null;
        sellingAssociatePostalCode?: string | null;
      } | null;
      markedQuestions?: string | null;
      homeownersAssociationAddendum?: {
        __typename: "HomeownersAssociationAddendum";
        hasHomeownersAssociation?: boolean | null;
        storageKey?: string | null;
        associationName?: string | null;
        associationPhoneNumber?: string | null;
        requiresSubdivisionInfo?: boolean | null;
        receivedSubdivisionInfo?: boolean | null;
        requiresUpdatedResaleCertificate?: boolean | null;
        subdivisionInfoProvidedBy?: PartyType | null;
        subdivisionInfoDaysToDeliver?: number | null;
        buyerFeesNotToExceed?: number | null;
        feeForTitleCompanyPaidBy?: PartyType | null;
      } | null;
      leadBasedPaintAddendum?: {
        __typename: "LeadBasedPaintAddendum";
        hasLeadBasedPaintDisclosure?: boolean | null;
        storageKey?: string | null;
        leadBasedPaintDisclosure?: string | null;
      } | null;
      rightToTerminateByLenderAppraisalAddendum?: {
        __typename: "RightToTerminateByLenderAppraisalAddendum";
        hasRightToTerminateByLenderAppraisal?: boolean | null;
        storageKey?: string | null;
        appraisalAmount?: number | null;
      } | null;
      sellerTemporaryLeaseAddendum?: {
        __typename: "SellerTemporaryLeaseAddendum";
        hasSellersTemporaryLease?: boolean | null;
        storageKey?: string | null;
        leaseLength?: number | null;
      } | null;
      createdAt: string;
      updatedAt: string;
      accountContractId?: string | null;
      owner?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type GetAccountQueryVariables = {
  id: string;
};

export type GetAccountQuery = {
  getAccount?: {
    __typename: "Account";
    id: string;
    email: string;
    billingId?: string | null;
    contract?: {
      __typename: "ModelContractConnection";
      items: Array<{
        __typename: "Contract";
        id: string;
        buyers?: {
          __typename: "ContractParty";
          primaryName?: string | null;
          phone?: string | null;
          fax?: string | null;
          email?: string | null;
          hasSecondaryParty?: boolean | null;
          secondaryName?: string | null;
          secondaryPhone?: string | null;
          secondaryFax?: string | null;
          secondaryEmail?: string | null;
        } | null;
        property?: {
          __typename: "Property";
          lot?: string | null;
          block?: string | null;
          county?: string | null;
          legalDescription?: string | null;
          mlsNumber?: string | null;
          streetAddress?: string | null;
          city?: string | null;
          state?: string | null;
          postalCode?: string | null;
          subdivision?: string | null;
          yearBuilt?: number | null;
          numBedroom?: number | null;
          numBathroom?: number | null;
          numFloor?: number | null;
          floorSizeValue?: number | null;
          floorSizeUnit?: string | null;
          lotSizeValue?: number | null;
          lotSizeUnit?: string | null;
          mostRecentPriceAmount?: number | null;
          mostRecentPriceDate?: string | null;
          dateAdded?: string | null;
          dateUpdated?: string | null;
          description?: string | null;
          imageUrl?: string | null;
        } | null;
        finance?: {
          __typename: "Finance";
          hasPreferredLender?: boolean | null;
          wantsLenderReferral?: boolean | null;
          buyerApprovalNoticeDays?: number | null;
          cashAmount?: number | null;
          fhaVaAppraisedValue?: number | null;
          fhaSectionNumber?: number | null;
          financingType?: FinancingType | null;
          interestRate?: number | null;
          interestRateYears?: number | null;
          isBuyerApprovalRequired?: boolean | null;
          isSecondMortgage?: boolean | null;
          loanType?: LoanType | null;
          originationChargePercent?: number | null;
          otherFinancingLenderName?: string | null;
          otherFinancingWaiveRights?: boolean | null;
          principalAmount?: number | null;
          reverseMortgageIsFHAInsured?: boolean | null;
          storageKey?: string | null;
          termYears?: number | null;
          totalSalesPrice?: number | null;
          terminationOnAppraisalType?: TerminationOnAppraisalType | null;
          terminationOpinionOfValueAmount?: number | null;
          terminationDaysAfterEffectiveDate?: number | null;
          terminationAppraisedValueLessThan?: number | null;
        } | null;
        leases?: {
          __typename: "Leases";
          hasResidentialLease?: boolean | null;
          hasFixtureLease?: boolean | null;
          hasMineralLease?: boolean | null;
          mineralLeaseCopyDelivered?: boolean | null;
          mineralLeaseDaysToDeliveryCopy?: number | null;
        } | null;
        sellers?: {
          __typename: "ContractParty";
          primaryName?: string | null;
          phone?: string | null;
          fax?: string | null;
          email?: string | null;
          hasSecondaryParty?: boolean | null;
          secondaryName?: string | null;
          secondaryPhone?: string | null;
          secondaryFax?: string | null;
          secondaryEmail?: string | null;
        } | null;
        title?: {
          __typename: "TitleDetail";
          hasTitleCompany?: boolean | null;
          wantsTitleReferral?: boolean | null;
          titleCompanyName?: string | null;
          titleCompanyStreetAddress?: string | null;
          titleCompanyCity?: string | null;
          titleCompanyState?: string | null;
          titleCompanyPostalCode?: string | null;
          standardExceptionsToBeAmended?: boolean | null;
          standardExceptionsToBeAmendedBy?: PartyType | null;
          titleFurnishingParty?: PartyType | null;
          escrowAgentName?: string | null;
          earnestMoney?: number | null;
          hasOptionFee?: boolean | null;
          optionFee?: number | null;
          hasAdditionalEarnestMoney?: boolean | null;
          additionalEarnestMoney?: number | null;
          additionalEarnestMoneyDaysToDeliver?: number | null;
          optionPeriodDaysToTerminate?: number | null;
        } | null;
        titleObjections?: {
          __typename: "TitleObjections";
          objections?: string | null;
          daysToObject?: number | null;
        } | null;
        survey?: {
          __typename: "SurveyDetail";
          daysToFurnish?: number | null;
          type?: SurveyType | null;
          furnishingPartyIfExistingIsUnacceptable?: PartyType | null;
        } | null;
        titleNotices?: {
          __typename: "TitleNotices";
          isInMUD?: boolean | null;
          isInCoastalArea?: boolean | null;
          isInPublicImprovementDistrict?: boolean | null;
          isInPropaneServiceArea?: boolean | null;
        } | null;
        propertyCondition?: {
          __typename: "PropertyCondition";
          sellerDisclosureReceived?: boolean | null;
          sellerDisclosureDaysToProduce?: number | null;
          sellerRequiredToDisclose?: boolean | null;
          buyerAcceptsAsIs?: boolean | null;
          retainedImprovements?: string | null;
          buyerAcceptanceRepairSpecifics?: string | null;
          serviceContractReimbursementAmount?: number | null;
        } | null;
        brokerDisclosure?: {
          __typename: "BrokerDisclosure";
          buyerIsThirdPartyAgent?: boolean | null;
          buyerIsRelatedToSeller?: boolean | null;
          buyerHasStakeInProperty?: boolean | null;
          buyerIsBeingCompensated?: boolean | null;
          buyerDisclosure?: string | null;
        } | null;
        closing?: {
          __typename: "ClosingDetail";
          closingDate?: string | null;
        } | null;
        possession?: {
          __typename: "PossessionDetail";
          possessionUponClosing?: boolean | null;
          possessionAccordingToTempLease?: boolean | null;
        } | null;
        buyerProvisions?: {
          __typename: "BuyerProvisionsDetail";
          buyerProvisions?: string | null;
          additionalExpensesPaidBySeller?: number | null;
        } | null;
        buyerNotices?: {
          __typename: "NoticesDetail";
          deliverToAddress?: boolean | null;
          streetAddress?: string | null;
          city?: string | null;
          state?: string | null;
          postalCode?: string | null;
          deliverByPhone?: boolean | null;
          phone?: string | null;
          deliverByEmailFax1?: boolean | null;
          emailFax1?: string | null;
          deliveryByEmailFax2?: boolean | null;
          emailFax2?: string | null;
          deliverToAgent?: boolean | null;
          agentContact?: string | null;
        } | null;
        sellerNotices?: {
          __typename: "NoticesDetail";
          deliverToAddress?: boolean | null;
          streetAddress?: string | null;
          city?: string | null;
          state?: string | null;
          postalCode?: string | null;
          deliverByPhone?: boolean | null;
          phone?: string | null;
          deliverByEmailFax1?: boolean | null;
          emailFax1?: string | null;
          deliveryByEmailFax2?: boolean | null;
          emailFax2?: string | null;
          deliverToAgent?: boolean | null;
          agentContact?: string | null;
        } | null;
        buyerAttorney?: {
          __typename: "Attorney";
          hasAttorney?: boolean | null;
          name?: string | null;
          streetAddress?: string | null;
          city?: string | null;
          state?: string | null;
          postalCode?: string | null;
          phone?: string | null;
          email?: string | null;
          fax?: string | null;
        } | null;
        buyerAgent?: {
          __typename: "BuyerAgent";
          hasBuyerAgent?: boolean | null;
          firmName?: string | null;
          firmLicenseNumber?: string | null;
          firmStreetAddress?: string | null;
          firmCity?: string | null;
          firmState?: string | null;
          firmPostalCode?: string | null;
          firmPhone?: string | null;
          associateName?: string | null;
          associateLicenseNumber?: string | null;
          associateTeamName?: string | null;
          associateEmail?: string | null;
          associatePhone?: string | null;
          associateSupervisorName?: string | null;
          associateSupervisorLicenseNumber?: string | null;
        } | null;
        sellerAttorney?: {
          __typename: "Attorney";
          hasAttorney?: boolean | null;
          name?: string | null;
          streetAddress?: string | null;
          city?: string | null;
          state?: string | null;
          postalCode?: string | null;
          phone?: string | null;
          email?: string | null;
          fax?: string | null;
        } | null;
        listingAgent?: {
          __typename: "ListingAgent";
          hasListingAgentInfo?: boolean | null;
          firmName?: string | null;
          firmLicenseNumber?: string | null;
          firmStreetAddress?: string | null;
          firmCity?: string | null;
          firmState?: string | null;
          firmPostalCode?: string | null;
          firmPhone?: string | null;
          listingAssociateName?: string | null;
          listingAssociateLicenseNumber?: string | null;
          listingAssociateTeamName?: string | null;
          listingAssociateEmail?: string | null;
          listingAssociatePhone?: string | null;
          listingAssociateSupervisorName?: string | null;
          listingAssociateSupervisorLicenseNumber?: string | null;
          sellingAssociateName?: string | null;
          sellingAssociateLicenseNumber?: string | null;
          sellingAssociateTeamName?: string | null;
          sellingAssociateEmail?: string | null;
          sellingAssociatePhone?: string | null;
          sellingAssociateSupervisorName?: string | null;
          sellingAssociateSupervisorLicenseNumber?: string | null;
          sellingAssociateStreetAddress?: string | null;
          sellingAssociateCity?: string | null;
          sellingAssociateState?: string | null;
          sellingAssociatePostalCode?: string | null;
        } | null;
        markedQuestions?: string | null;
        homeownersAssociationAddendum?: {
          __typename: "HomeownersAssociationAddendum";
          hasHomeownersAssociation?: boolean | null;
          storageKey?: string | null;
          associationName?: string | null;
          associationPhoneNumber?: string | null;
          requiresSubdivisionInfo?: boolean | null;
          receivedSubdivisionInfo?: boolean | null;
          requiresUpdatedResaleCertificate?: boolean | null;
          subdivisionInfoProvidedBy?: PartyType | null;
          subdivisionInfoDaysToDeliver?: number | null;
          buyerFeesNotToExceed?: number | null;
          feeForTitleCompanyPaidBy?: PartyType | null;
        } | null;
        leadBasedPaintAddendum?: {
          __typename: "LeadBasedPaintAddendum";
          hasLeadBasedPaintDisclosure?: boolean | null;
          storageKey?: string | null;
          leadBasedPaintDisclosure?: string | null;
        } | null;
        rightToTerminateByLenderAppraisalAddendum?: {
          __typename: "RightToTerminateByLenderAppraisalAddendum";
          hasRightToTerminateByLenderAppraisal?: boolean | null;
          storageKey?: string | null;
          appraisalAmount?: number | null;
        } | null;
        sellerTemporaryLeaseAddendum?: {
          __typename: "SellerTemporaryLeaseAddendum";
          hasSellersTemporaryLease?: boolean | null;
          storageKey?: string | null;
          leaseLength?: number | null;
        } | null;
        createdAt: string;
        updatedAt: string;
        accountContractId?: string | null;
        owner?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    isPaid?: boolean | null;
    street1?: string | null;
    street2?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    firstName?: string | null;
    middleInitial?: string | null;
    lastName?: string | null;
    owner: string;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type ListAccountsQueryVariables = {
  filter?: ModelAccountFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListAccountsQuery = {
  listAccounts?: {
    __typename: "ModelAccountConnection";
    items: Array<{
      __typename: "Account";
      id: string;
      email: string;
      billingId?: string | null;
      contract?: {
        __typename: "ModelContractConnection";
        items: Array<{
          __typename: "Contract";
          id: string;
          markedQuestions?: string | null;
          createdAt: string;
          updatedAt: string;
          accountContractId?: string | null;
          owner?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      isPaid?: boolean | null;
      street1?: string | null;
      street2?: string | null;
      city?: string | null;
      state?: string | null;
      postalCode?: string | null;
      firstName?: string | null;
      middleInitial?: string | null;
      lastName?: string | null;
      owner: string;
      createdAt: string;
      updatedAt: string;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type AccountsByOwnerQueryVariables = {
  owner: string;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelAccountFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type AccountsByOwnerQuery = {
  accountsByOwner?: {
    __typename: "ModelAccountConnection";
    items: Array<{
      __typename: "Account";
      id: string;
      email: string;
      billingId?: string | null;
      contract?: {
        __typename: "ModelContractConnection";
        items: Array<{
          __typename: "Contract";
          id: string;
          markedQuestions?: string | null;
          createdAt: string;
          updatedAt: string;
          accountContractId?: string | null;
          owner?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      isPaid?: boolean | null;
      street1?: string | null;
      street2?: string | null;
      city?: string | null;
      state?: string | null;
      postalCode?: string | null;
      firstName?: string | null;
      middleInitial?: string | null;
      lastName?: string | null;
      owner: string;
      createdAt: string;
      updatedAt: string;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type OnCreateEmailPacketSubscriptionVariables = {
  filter?: ModelSubscriptionEmailPacketFilterInput | null;
};

export type OnCreateEmailPacketSubscription = {
  onCreateEmailPacket?: {
    __typename: "EmailPacket";
    id: string;
    accountId: string;
    contractId: string;
    streetAddress: string;
    agentEmail: string;
    agentName: string;
    status: string;
    comments?: string | null;
    subject: string;
    body: string;
    contractFiles: Array<string>;
    preApprovalFile: string;
    earnestFile: string;
    optionFile: string;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type OnUpdateEmailPacketSubscriptionVariables = {
  filter?: ModelSubscriptionEmailPacketFilterInput | null;
};

export type OnUpdateEmailPacketSubscription = {
  onUpdateEmailPacket?: {
    __typename: "EmailPacket";
    id: string;
    accountId: string;
    contractId: string;
    streetAddress: string;
    agentEmail: string;
    agentName: string;
    status: string;
    comments?: string | null;
    subject: string;
    body: string;
    contractFiles: Array<string>;
    preApprovalFile: string;
    earnestFile: string;
    optionFile: string;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type OnDeleteEmailPacketSubscriptionVariables = {
  filter?: ModelSubscriptionEmailPacketFilterInput | null;
};

export type OnDeleteEmailPacketSubscription = {
  onDeleteEmailPacket?: {
    __typename: "EmailPacket";
    id: string;
    accountId: string;
    contractId: string;
    streetAddress: string;
    agentEmail: string;
    agentName: string;
    status: string;
    comments?: string | null;
    subject: string;
    body: string;
    contractFiles: Array<string>;
    preApprovalFile: string;
    earnestFile: string;
    optionFile: string;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type OnCreateListingAgentContactInfoSubscriptionVariables = {
  filter?: ModelSubscriptionListingAgentContactInfoFilterInput | null;
};

export type OnCreateListingAgentContactInfoSubscription = {
  onCreateListingAgentContactInfo?: {
    __typename: "ListingAgentContactInfo";
    id: string;
    name?: string | null;
    agencyName?: string | null;
    profileUrl?: string | null;
    phoneNumbers?: Array<string | null> | null;
    emailAddresses?: Array<string | null> | null;
    source?: string | null;
    importDate?: string | null;
    notes?: string | null;
    metaData?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type OnUpdateListingAgentContactInfoSubscriptionVariables = {
  filter?: ModelSubscriptionListingAgentContactInfoFilterInput | null;
};

export type OnUpdateListingAgentContactInfoSubscription = {
  onUpdateListingAgentContactInfo?: {
    __typename: "ListingAgentContactInfo";
    id: string;
    name?: string | null;
    agencyName?: string | null;
    profileUrl?: string | null;
    phoneNumbers?: Array<string | null> | null;
    emailAddresses?: Array<string | null> | null;
    source?: string | null;
    importDate?: string | null;
    notes?: string | null;
    metaData?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type OnDeleteListingAgentContactInfoSubscriptionVariables = {
  filter?: ModelSubscriptionListingAgentContactInfoFilterInput | null;
};

export type OnDeleteListingAgentContactInfoSubscription = {
  onDeleteListingAgentContactInfo?: {
    __typename: "ListingAgentContactInfo";
    id: string;
    name?: string | null;
    agencyName?: string | null;
    profileUrl?: string | null;
    phoneNumbers?: Array<string | null> | null;
    emailAddresses?: Array<string | null> | null;
    source?: string | null;
    importDate?: string | null;
    notes?: string | null;
    metaData?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type OnCreateEtchPacketSubscriptionVariables = {
  filter?: ModelSubscriptionEtchPacketFilterInput | null;
  owner?: string | null;
};

export type OnCreateEtchPacketSubscription = {
  onCreateEtchPacket?: {
    __typename: "EtchPacket";
    eid: string;
    documentGroup: {
      __typename: "DocumentGroup";
      eid: string;
      status: string;
      files: Array<{
        __typename: "DocumentGroupFile";
        downloadURL: string;
        filename: string;
        name: string;
        type: string;
      } | null>;
      signers: Array<{
        __typename: "Signer";
        eid: string;
        aliasId: string;
        name: string;
        email: string;
        routingOrder: number;
        signActionType: string;
        status: string;
        uploadKeys?: Array<string | null> | null;
      } | null>;
    };
    contractId: string;
    createdAt: string;
    updatedAt: string;
    owner?: string | null;
  } | null;
};

export type OnUpdateEtchPacketSubscriptionVariables = {
  filter?: ModelSubscriptionEtchPacketFilterInput | null;
  owner?: string | null;
};

export type OnUpdateEtchPacketSubscription = {
  onUpdateEtchPacket?: {
    __typename: "EtchPacket";
    eid: string;
    documentGroup: {
      __typename: "DocumentGroup";
      eid: string;
      status: string;
      files: Array<{
        __typename: "DocumentGroupFile";
        downloadURL: string;
        filename: string;
        name: string;
        type: string;
      } | null>;
      signers: Array<{
        __typename: "Signer";
        eid: string;
        aliasId: string;
        name: string;
        email: string;
        routingOrder: number;
        signActionType: string;
        status: string;
        uploadKeys?: Array<string | null> | null;
      } | null>;
    };
    contractId: string;
    createdAt: string;
    updatedAt: string;
    owner?: string | null;
  } | null;
};

export type OnDeleteEtchPacketSubscriptionVariables = {
  filter?: ModelSubscriptionEtchPacketFilterInput | null;
  owner?: string | null;
};

export type OnDeleteEtchPacketSubscription = {
  onDeleteEtchPacket?: {
    __typename: "EtchPacket";
    eid: string;
    documentGroup: {
      __typename: "DocumentGroup";
      eid: string;
      status: string;
      files: Array<{
        __typename: "DocumentGroupFile";
        downloadURL: string;
        filename: string;
        name: string;
        type: string;
      } | null>;
      signers: Array<{
        __typename: "Signer";
        eid: string;
        aliasId: string;
        name: string;
        email: string;
        routingOrder: number;
        signActionType: string;
        status: string;
        uploadKeys?: Array<string | null> | null;
      } | null>;
    };
    contractId: string;
    createdAt: string;
    updatedAt: string;
    owner?: string | null;
  } | null;
};

export type OnCreateContractSubscriptionVariables = {
  filter?: ModelSubscriptionContractFilterInput | null;
  owner?: string | null;
};

export type OnCreateContractSubscription = {
  onCreateContract?: {
    __typename: "Contract";
    id: string;
    buyers?: {
      __typename: "ContractParty";
      primaryName?: string | null;
      phone?: string | null;
      fax?: string | null;
      email?: string | null;
      hasSecondaryParty?: boolean | null;
      secondaryName?: string | null;
      secondaryPhone?: string | null;
      secondaryFax?: string | null;
      secondaryEmail?: string | null;
    } | null;
    property?: {
      __typename: "Property";
      lot?: string | null;
      block?: string | null;
      county?: string | null;
      legalDescription?: string | null;
      mlsNumber?: string | null;
      streetAddress?: string | null;
      city?: string | null;
      state?: string | null;
      postalCode?: string | null;
      subdivision?: string | null;
      yearBuilt?: number | null;
      numBedroom?: number | null;
      numBathroom?: number | null;
      numFloor?: number | null;
      floorSizeValue?: number | null;
      floorSizeUnit?: string | null;
      lotSizeValue?: number | null;
      lotSizeUnit?: string | null;
      mostRecentPriceAmount?: number | null;
      mostRecentPriceDate?: string | null;
      dateAdded?: string | null;
      dateUpdated?: string | null;
      description?: string | null;
      imageUrl?: string | null;
    } | null;
    finance?: {
      __typename: "Finance";
      hasPreferredLender?: boolean | null;
      wantsLenderReferral?: boolean | null;
      buyerApprovalNoticeDays?: number | null;
      cashAmount?: number | null;
      fhaVaAppraisedValue?: number | null;
      fhaSectionNumber?: number | null;
      financingType?: FinancingType | null;
      interestRate?: number | null;
      interestRateYears?: number | null;
      isBuyerApprovalRequired?: boolean | null;
      isSecondMortgage?: boolean | null;
      loanType?: LoanType | null;
      originationChargePercent?: number | null;
      otherFinancingLenderName?: string | null;
      otherFinancingWaiveRights?: boolean | null;
      principalAmount?: number | null;
      reverseMortgageIsFHAInsured?: boolean | null;
      storageKey?: string | null;
      termYears?: number | null;
      totalSalesPrice?: number | null;
      terminationOnAppraisalType?: TerminationOnAppraisalType | null;
      terminationOpinionOfValueAmount?: number | null;
      terminationDaysAfterEffectiveDate?: number | null;
      terminationAppraisedValueLessThan?: number | null;
    } | null;
    leases?: {
      __typename: "Leases";
      hasResidentialLease?: boolean | null;
      hasFixtureLease?: boolean | null;
      hasMineralLease?: boolean | null;
      mineralLeaseCopyDelivered?: boolean | null;
      mineralLeaseDaysToDeliveryCopy?: number | null;
    } | null;
    sellers?: {
      __typename: "ContractParty";
      primaryName?: string | null;
      phone?: string | null;
      fax?: string | null;
      email?: string | null;
      hasSecondaryParty?: boolean | null;
      secondaryName?: string | null;
      secondaryPhone?: string | null;
      secondaryFax?: string | null;
      secondaryEmail?: string | null;
    } | null;
    title?: {
      __typename: "TitleDetail";
      hasTitleCompany?: boolean | null;
      wantsTitleReferral?: boolean | null;
      titleCompanyName?: string | null;
      titleCompanyStreetAddress?: string | null;
      titleCompanyCity?: string | null;
      titleCompanyState?: string | null;
      titleCompanyPostalCode?: string | null;
      standardExceptionsToBeAmended?: boolean | null;
      standardExceptionsToBeAmendedBy?: PartyType | null;
      titleFurnishingParty?: PartyType | null;
      escrowAgentName?: string | null;
      earnestMoney?: number | null;
      hasOptionFee?: boolean | null;
      optionFee?: number | null;
      hasAdditionalEarnestMoney?: boolean | null;
      additionalEarnestMoney?: number | null;
      additionalEarnestMoneyDaysToDeliver?: number | null;
      optionPeriodDaysToTerminate?: number | null;
    } | null;
    titleObjections?: {
      __typename: "TitleObjections";
      objections?: string | null;
      daysToObject?: number | null;
    } | null;
    survey?: {
      __typename: "SurveyDetail";
      daysToFurnish?: number | null;
      type?: SurveyType | null;
      furnishingPartyIfExistingIsUnacceptable?: PartyType | null;
    } | null;
    titleNotices?: {
      __typename: "TitleNotices";
      isInMUD?: boolean | null;
      isInCoastalArea?: boolean | null;
      isInPublicImprovementDistrict?: boolean | null;
      isInPropaneServiceArea?: boolean | null;
    } | null;
    propertyCondition?: {
      __typename: "PropertyCondition";
      sellerDisclosureReceived?: boolean | null;
      sellerDisclosureDaysToProduce?: number | null;
      sellerRequiredToDisclose?: boolean | null;
      buyerAcceptsAsIs?: boolean | null;
      retainedImprovements?: string | null;
      buyerAcceptanceRepairSpecifics?: string | null;
      serviceContractReimbursementAmount?: number | null;
    } | null;
    brokerDisclosure?: {
      __typename: "BrokerDisclosure";
      buyerIsThirdPartyAgent?: boolean | null;
      buyerIsRelatedToSeller?: boolean | null;
      buyerHasStakeInProperty?: boolean | null;
      buyerIsBeingCompensated?: boolean | null;
      buyerDisclosure?: string | null;
    } | null;
    closing?: {
      __typename: "ClosingDetail";
      closingDate?: string | null;
    } | null;
    possession?: {
      __typename: "PossessionDetail";
      possessionUponClosing?: boolean | null;
      possessionAccordingToTempLease?: boolean | null;
    } | null;
    buyerProvisions?: {
      __typename: "BuyerProvisionsDetail";
      buyerProvisions?: string | null;
      additionalExpensesPaidBySeller?: number | null;
    } | null;
    buyerNotices?: {
      __typename: "NoticesDetail";
      deliverToAddress?: boolean | null;
      streetAddress?: string | null;
      city?: string | null;
      state?: string | null;
      postalCode?: string | null;
      deliverByPhone?: boolean | null;
      phone?: string | null;
      deliverByEmailFax1?: boolean | null;
      emailFax1?: string | null;
      deliveryByEmailFax2?: boolean | null;
      emailFax2?: string | null;
      deliverToAgent?: boolean | null;
      agentContact?: string | null;
    } | null;
    sellerNotices?: {
      __typename: "NoticesDetail";
      deliverToAddress?: boolean | null;
      streetAddress?: string | null;
      city?: string | null;
      state?: string | null;
      postalCode?: string | null;
      deliverByPhone?: boolean | null;
      phone?: string | null;
      deliverByEmailFax1?: boolean | null;
      emailFax1?: string | null;
      deliveryByEmailFax2?: boolean | null;
      emailFax2?: string | null;
      deliverToAgent?: boolean | null;
      agentContact?: string | null;
    } | null;
    buyerAttorney?: {
      __typename: "Attorney";
      hasAttorney?: boolean | null;
      name?: string | null;
      streetAddress?: string | null;
      city?: string | null;
      state?: string | null;
      postalCode?: string | null;
      phone?: string | null;
      email?: string | null;
      fax?: string | null;
    } | null;
    buyerAgent?: {
      __typename: "BuyerAgent";
      hasBuyerAgent?: boolean | null;
      firmName?: string | null;
      firmLicenseNumber?: string | null;
      firmStreetAddress?: string | null;
      firmCity?: string | null;
      firmState?: string | null;
      firmPostalCode?: string | null;
      firmPhone?: string | null;
      associateName?: string | null;
      associateLicenseNumber?: string | null;
      associateTeamName?: string | null;
      associateEmail?: string | null;
      associatePhone?: string | null;
      associateSupervisorName?: string | null;
      associateSupervisorLicenseNumber?: string | null;
    } | null;
    sellerAttorney?: {
      __typename: "Attorney";
      hasAttorney?: boolean | null;
      name?: string | null;
      streetAddress?: string | null;
      city?: string | null;
      state?: string | null;
      postalCode?: string | null;
      phone?: string | null;
      email?: string | null;
      fax?: string | null;
    } | null;
    listingAgent?: {
      __typename: "ListingAgent";
      hasListingAgentInfo?: boolean | null;
      firmName?: string | null;
      firmLicenseNumber?: string | null;
      firmStreetAddress?: string | null;
      firmCity?: string | null;
      firmState?: string | null;
      firmPostalCode?: string | null;
      firmPhone?: string | null;
      listingAssociateName?: string | null;
      listingAssociateLicenseNumber?: string | null;
      listingAssociateTeamName?: string | null;
      listingAssociateEmail?: string | null;
      listingAssociatePhone?: string | null;
      listingAssociateSupervisorName?: string | null;
      listingAssociateSupervisorLicenseNumber?: string | null;
      sellingAssociateName?: string | null;
      sellingAssociateLicenseNumber?: string | null;
      sellingAssociateTeamName?: string | null;
      sellingAssociateEmail?: string | null;
      sellingAssociatePhone?: string | null;
      sellingAssociateSupervisorName?: string | null;
      sellingAssociateSupervisorLicenseNumber?: string | null;
      sellingAssociateStreetAddress?: string | null;
      sellingAssociateCity?: string | null;
      sellingAssociateState?: string | null;
      sellingAssociatePostalCode?: string | null;
    } | null;
    markedQuestions?: string | null;
    homeownersAssociationAddendum?: {
      __typename: "HomeownersAssociationAddendum";
      hasHomeownersAssociation?: boolean | null;
      storageKey?: string | null;
      associationName?: string | null;
      associationPhoneNumber?: string | null;
      requiresSubdivisionInfo?: boolean | null;
      receivedSubdivisionInfo?: boolean | null;
      requiresUpdatedResaleCertificate?: boolean | null;
      subdivisionInfoProvidedBy?: PartyType | null;
      subdivisionInfoDaysToDeliver?: number | null;
      buyerFeesNotToExceed?: number | null;
      feeForTitleCompanyPaidBy?: PartyType | null;
    } | null;
    leadBasedPaintAddendum?: {
      __typename: "LeadBasedPaintAddendum";
      hasLeadBasedPaintDisclosure?: boolean | null;
      storageKey?: string | null;
      leadBasedPaintDisclosure?: string | null;
    } | null;
    rightToTerminateByLenderAppraisalAddendum?: {
      __typename: "RightToTerminateByLenderAppraisalAddendum";
      hasRightToTerminateByLenderAppraisal?: boolean | null;
      storageKey?: string | null;
      appraisalAmount?: number | null;
    } | null;
    sellerTemporaryLeaseAddendum?: {
      __typename: "SellerTemporaryLeaseAddendum";
      hasSellersTemporaryLease?: boolean | null;
      storageKey?: string | null;
      leaseLength?: number | null;
    } | null;
    createdAt: string;
    updatedAt: string;
    accountContractId?: string | null;
    owner?: string | null;
  } | null;
};

export type OnUpdateContractSubscriptionVariables = {
  filter?: ModelSubscriptionContractFilterInput | null;
  owner?: string | null;
};

export type OnUpdateContractSubscription = {
  onUpdateContract?: {
    __typename: "Contract";
    id: string;
    buyers?: {
      __typename: "ContractParty";
      primaryName?: string | null;
      phone?: string | null;
      fax?: string | null;
      email?: string | null;
      hasSecondaryParty?: boolean | null;
      secondaryName?: string | null;
      secondaryPhone?: string | null;
      secondaryFax?: string | null;
      secondaryEmail?: string | null;
    } | null;
    property?: {
      __typename: "Property";
      lot?: string | null;
      block?: string | null;
      county?: string | null;
      legalDescription?: string | null;
      mlsNumber?: string | null;
      streetAddress?: string | null;
      city?: string | null;
      state?: string | null;
      postalCode?: string | null;
      subdivision?: string | null;
      yearBuilt?: number | null;
      numBedroom?: number | null;
      numBathroom?: number | null;
      numFloor?: number | null;
      floorSizeValue?: number | null;
      floorSizeUnit?: string | null;
      lotSizeValue?: number | null;
      lotSizeUnit?: string | null;
      mostRecentPriceAmount?: number | null;
      mostRecentPriceDate?: string | null;
      dateAdded?: string | null;
      dateUpdated?: string | null;
      description?: string | null;
      imageUrl?: string | null;
    } | null;
    finance?: {
      __typename: "Finance";
      hasPreferredLender?: boolean | null;
      wantsLenderReferral?: boolean | null;
      buyerApprovalNoticeDays?: number | null;
      cashAmount?: number | null;
      fhaVaAppraisedValue?: number | null;
      fhaSectionNumber?: number | null;
      financingType?: FinancingType | null;
      interestRate?: number | null;
      interestRateYears?: number | null;
      isBuyerApprovalRequired?: boolean | null;
      isSecondMortgage?: boolean | null;
      loanType?: LoanType | null;
      originationChargePercent?: number | null;
      otherFinancingLenderName?: string | null;
      otherFinancingWaiveRights?: boolean | null;
      principalAmount?: number | null;
      reverseMortgageIsFHAInsured?: boolean | null;
      storageKey?: string | null;
      termYears?: number | null;
      totalSalesPrice?: number | null;
      terminationOnAppraisalType?: TerminationOnAppraisalType | null;
      terminationOpinionOfValueAmount?: number | null;
      terminationDaysAfterEffectiveDate?: number | null;
      terminationAppraisedValueLessThan?: number | null;
    } | null;
    leases?: {
      __typename: "Leases";
      hasResidentialLease?: boolean | null;
      hasFixtureLease?: boolean | null;
      hasMineralLease?: boolean | null;
      mineralLeaseCopyDelivered?: boolean | null;
      mineralLeaseDaysToDeliveryCopy?: number | null;
    } | null;
    sellers?: {
      __typename: "ContractParty";
      primaryName?: string | null;
      phone?: string | null;
      fax?: string | null;
      email?: string | null;
      hasSecondaryParty?: boolean | null;
      secondaryName?: string | null;
      secondaryPhone?: string | null;
      secondaryFax?: string | null;
      secondaryEmail?: string | null;
    } | null;
    title?: {
      __typename: "TitleDetail";
      hasTitleCompany?: boolean | null;
      wantsTitleReferral?: boolean | null;
      titleCompanyName?: string | null;
      titleCompanyStreetAddress?: string | null;
      titleCompanyCity?: string | null;
      titleCompanyState?: string | null;
      titleCompanyPostalCode?: string | null;
      standardExceptionsToBeAmended?: boolean | null;
      standardExceptionsToBeAmendedBy?: PartyType | null;
      titleFurnishingParty?: PartyType | null;
      escrowAgentName?: string | null;
      earnestMoney?: number | null;
      hasOptionFee?: boolean | null;
      optionFee?: number | null;
      hasAdditionalEarnestMoney?: boolean | null;
      additionalEarnestMoney?: number | null;
      additionalEarnestMoneyDaysToDeliver?: number | null;
      optionPeriodDaysToTerminate?: number | null;
    } | null;
    titleObjections?: {
      __typename: "TitleObjections";
      objections?: string | null;
      daysToObject?: number | null;
    } | null;
    survey?: {
      __typename: "SurveyDetail";
      daysToFurnish?: number | null;
      type?: SurveyType | null;
      furnishingPartyIfExistingIsUnacceptable?: PartyType | null;
    } | null;
    titleNotices?: {
      __typename: "TitleNotices";
      isInMUD?: boolean | null;
      isInCoastalArea?: boolean | null;
      isInPublicImprovementDistrict?: boolean | null;
      isInPropaneServiceArea?: boolean | null;
    } | null;
    propertyCondition?: {
      __typename: "PropertyCondition";
      sellerDisclosureReceived?: boolean | null;
      sellerDisclosureDaysToProduce?: number | null;
      sellerRequiredToDisclose?: boolean | null;
      buyerAcceptsAsIs?: boolean | null;
      retainedImprovements?: string | null;
      buyerAcceptanceRepairSpecifics?: string | null;
      serviceContractReimbursementAmount?: number | null;
    } | null;
    brokerDisclosure?: {
      __typename: "BrokerDisclosure";
      buyerIsThirdPartyAgent?: boolean | null;
      buyerIsRelatedToSeller?: boolean | null;
      buyerHasStakeInProperty?: boolean | null;
      buyerIsBeingCompensated?: boolean | null;
      buyerDisclosure?: string | null;
    } | null;
    closing?: {
      __typename: "ClosingDetail";
      closingDate?: string | null;
    } | null;
    possession?: {
      __typename: "PossessionDetail";
      possessionUponClosing?: boolean | null;
      possessionAccordingToTempLease?: boolean | null;
    } | null;
    buyerProvisions?: {
      __typename: "BuyerProvisionsDetail";
      buyerProvisions?: string | null;
      additionalExpensesPaidBySeller?: number | null;
    } | null;
    buyerNotices?: {
      __typename: "NoticesDetail";
      deliverToAddress?: boolean | null;
      streetAddress?: string | null;
      city?: string | null;
      state?: string | null;
      postalCode?: string | null;
      deliverByPhone?: boolean | null;
      phone?: string | null;
      deliverByEmailFax1?: boolean | null;
      emailFax1?: string | null;
      deliveryByEmailFax2?: boolean | null;
      emailFax2?: string | null;
      deliverToAgent?: boolean | null;
      agentContact?: string | null;
    } | null;
    sellerNotices?: {
      __typename: "NoticesDetail";
      deliverToAddress?: boolean | null;
      streetAddress?: string | null;
      city?: string | null;
      state?: string | null;
      postalCode?: string | null;
      deliverByPhone?: boolean | null;
      phone?: string | null;
      deliverByEmailFax1?: boolean | null;
      emailFax1?: string | null;
      deliveryByEmailFax2?: boolean | null;
      emailFax2?: string | null;
      deliverToAgent?: boolean | null;
      agentContact?: string | null;
    } | null;
    buyerAttorney?: {
      __typename: "Attorney";
      hasAttorney?: boolean | null;
      name?: string | null;
      streetAddress?: string | null;
      city?: string | null;
      state?: string | null;
      postalCode?: string | null;
      phone?: string | null;
      email?: string | null;
      fax?: string | null;
    } | null;
    buyerAgent?: {
      __typename: "BuyerAgent";
      hasBuyerAgent?: boolean | null;
      firmName?: string | null;
      firmLicenseNumber?: string | null;
      firmStreetAddress?: string | null;
      firmCity?: string | null;
      firmState?: string | null;
      firmPostalCode?: string | null;
      firmPhone?: string | null;
      associateName?: string | null;
      associateLicenseNumber?: string | null;
      associateTeamName?: string | null;
      associateEmail?: string | null;
      associatePhone?: string | null;
      associateSupervisorName?: string | null;
      associateSupervisorLicenseNumber?: string | null;
    } | null;
    sellerAttorney?: {
      __typename: "Attorney";
      hasAttorney?: boolean | null;
      name?: string | null;
      streetAddress?: string | null;
      city?: string | null;
      state?: string | null;
      postalCode?: string | null;
      phone?: string | null;
      email?: string | null;
      fax?: string | null;
    } | null;
    listingAgent?: {
      __typename: "ListingAgent";
      hasListingAgentInfo?: boolean | null;
      firmName?: string | null;
      firmLicenseNumber?: string | null;
      firmStreetAddress?: string | null;
      firmCity?: string | null;
      firmState?: string | null;
      firmPostalCode?: string | null;
      firmPhone?: string | null;
      listingAssociateName?: string | null;
      listingAssociateLicenseNumber?: string | null;
      listingAssociateTeamName?: string | null;
      listingAssociateEmail?: string | null;
      listingAssociatePhone?: string | null;
      listingAssociateSupervisorName?: string | null;
      listingAssociateSupervisorLicenseNumber?: string | null;
      sellingAssociateName?: string | null;
      sellingAssociateLicenseNumber?: string | null;
      sellingAssociateTeamName?: string | null;
      sellingAssociateEmail?: string | null;
      sellingAssociatePhone?: string | null;
      sellingAssociateSupervisorName?: string | null;
      sellingAssociateSupervisorLicenseNumber?: string | null;
      sellingAssociateStreetAddress?: string | null;
      sellingAssociateCity?: string | null;
      sellingAssociateState?: string | null;
      sellingAssociatePostalCode?: string | null;
    } | null;
    markedQuestions?: string | null;
    homeownersAssociationAddendum?: {
      __typename: "HomeownersAssociationAddendum";
      hasHomeownersAssociation?: boolean | null;
      storageKey?: string | null;
      associationName?: string | null;
      associationPhoneNumber?: string | null;
      requiresSubdivisionInfo?: boolean | null;
      receivedSubdivisionInfo?: boolean | null;
      requiresUpdatedResaleCertificate?: boolean | null;
      subdivisionInfoProvidedBy?: PartyType | null;
      subdivisionInfoDaysToDeliver?: number | null;
      buyerFeesNotToExceed?: number | null;
      feeForTitleCompanyPaidBy?: PartyType | null;
    } | null;
    leadBasedPaintAddendum?: {
      __typename: "LeadBasedPaintAddendum";
      hasLeadBasedPaintDisclosure?: boolean | null;
      storageKey?: string | null;
      leadBasedPaintDisclosure?: string | null;
    } | null;
    rightToTerminateByLenderAppraisalAddendum?: {
      __typename: "RightToTerminateByLenderAppraisalAddendum";
      hasRightToTerminateByLenderAppraisal?: boolean | null;
      storageKey?: string | null;
      appraisalAmount?: number | null;
    } | null;
    sellerTemporaryLeaseAddendum?: {
      __typename: "SellerTemporaryLeaseAddendum";
      hasSellersTemporaryLease?: boolean | null;
      storageKey?: string | null;
      leaseLength?: number | null;
    } | null;
    createdAt: string;
    updatedAt: string;
    accountContractId?: string | null;
    owner?: string | null;
  } | null;
};

export type OnDeleteContractSubscriptionVariables = {
  filter?: ModelSubscriptionContractFilterInput | null;
  owner?: string | null;
};

export type OnDeleteContractSubscription = {
  onDeleteContract?: {
    __typename: "Contract";
    id: string;
    buyers?: {
      __typename: "ContractParty";
      primaryName?: string | null;
      phone?: string | null;
      fax?: string | null;
      email?: string | null;
      hasSecondaryParty?: boolean | null;
      secondaryName?: string | null;
      secondaryPhone?: string | null;
      secondaryFax?: string | null;
      secondaryEmail?: string | null;
    } | null;
    property?: {
      __typename: "Property";
      lot?: string | null;
      block?: string | null;
      county?: string | null;
      legalDescription?: string | null;
      mlsNumber?: string | null;
      streetAddress?: string | null;
      city?: string | null;
      state?: string | null;
      postalCode?: string | null;
      subdivision?: string | null;
      yearBuilt?: number | null;
      numBedroom?: number | null;
      numBathroom?: number | null;
      numFloor?: number | null;
      floorSizeValue?: number | null;
      floorSizeUnit?: string | null;
      lotSizeValue?: number | null;
      lotSizeUnit?: string | null;
      mostRecentPriceAmount?: number | null;
      mostRecentPriceDate?: string | null;
      dateAdded?: string | null;
      dateUpdated?: string | null;
      description?: string | null;
      imageUrl?: string | null;
    } | null;
    finance?: {
      __typename: "Finance";
      hasPreferredLender?: boolean | null;
      wantsLenderReferral?: boolean | null;
      buyerApprovalNoticeDays?: number | null;
      cashAmount?: number | null;
      fhaVaAppraisedValue?: number | null;
      fhaSectionNumber?: number | null;
      financingType?: FinancingType | null;
      interestRate?: number | null;
      interestRateYears?: number | null;
      isBuyerApprovalRequired?: boolean | null;
      isSecondMortgage?: boolean | null;
      loanType?: LoanType | null;
      originationChargePercent?: number | null;
      otherFinancingLenderName?: string | null;
      otherFinancingWaiveRights?: boolean | null;
      principalAmount?: number | null;
      reverseMortgageIsFHAInsured?: boolean | null;
      storageKey?: string | null;
      termYears?: number | null;
      totalSalesPrice?: number | null;
      terminationOnAppraisalType?: TerminationOnAppraisalType | null;
      terminationOpinionOfValueAmount?: number | null;
      terminationDaysAfterEffectiveDate?: number | null;
      terminationAppraisedValueLessThan?: number | null;
    } | null;
    leases?: {
      __typename: "Leases";
      hasResidentialLease?: boolean | null;
      hasFixtureLease?: boolean | null;
      hasMineralLease?: boolean | null;
      mineralLeaseCopyDelivered?: boolean | null;
      mineralLeaseDaysToDeliveryCopy?: number | null;
    } | null;
    sellers?: {
      __typename: "ContractParty";
      primaryName?: string | null;
      phone?: string | null;
      fax?: string | null;
      email?: string | null;
      hasSecondaryParty?: boolean | null;
      secondaryName?: string | null;
      secondaryPhone?: string | null;
      secondaryFax?: string | null;
      secondaryEmail?: string | null;
    } | null;
    title?: {
      __typename: "TitleDetail";
      hasTitleCompany?: boolean | null;
      wantsTitleReferral?: boolean | null;
      titleCompanyName?: string | null;
      titleCompanyStreetAddress?: string | null;
      titleCompanyCity?: string | null;
      titleCompanyState?: string | null;
      titleCompanyPostalCode?: string | null;
      standardExceptionsToBeAmended?: boolean | null;
      standardExceptionsToBeAmendedBy?: PartyType | null;
      titleFurnishingParty?: PartyType | null;
      escrowAgentName?: string | null;
      earnestMoney?: number | null;
      hasOptionFee?: boolean | null;
      optionFee?: number | null;
      hasAdditionalEarnestMoney?: boolean | null;
      additionalEarnestMoney?: number | null;
      additionalEarnestMoneyDaysToDeliver?: number | null;
      optionPeriodDaysToTerminate?: number | null;
    } | null;
    titleObjections?: {
      __typename: "TitleObjections";
      objections?: string | null;
      daysToObject?: number | null;
    } | null;
    survey?: {
      __typename: "SurveyDetail";
      daysToFurnish?: number | null;
      type?: SurveyType | null;
      furnishingPartyIfExistingIsUnacceptable?: PartyType | null;
    } | null;
    titleNotices?: {
      __typename: "TitleNotices";
      isInMUD?: boolean | null;
      isInCoastalArea?: boolean | null;
      isInPublicImprovementDistrict?: boolean | null;
      isInPropaneServiceArea?: boolean | null;
    } | null;
    propertyCondition?: {
      __typename: "PropertyCondition";
      sellerDisclosureReceived?: boolean | null;
      sellerDisclosureDaysToProduce?: number | null;
      sellerRequiredToDisclose?: boolean | null;
      buyerAcceptsAsIs?: boolean | null;
      retainedImprovements?: string | null;
      buyerAcceptanceRepairSpecifics?: string | null;
      serviceContractReimbursementAmount?: number | null;
    } | null;
    brokerDisclosure?: {
      __typename: "BrokerDisclosure";
      buyerIsThirdPartyAgent?: boolean | null;
      buyerIsRelatedToSeller?: boolean | null;
      buyerHasStakeInProperty?: boolean | null;
      buyerIsBeingCompensated?: boolean | null;
      buyerDisclosure?: string | null;
    } | null;
    closing?: {
      __typename: "ClosingDetail";
      closingDate?: string | null;
    } | null;
    possession?: {
      __typename: "PossessionDetail";
      possessionUponClosing?: boolean | null;
      possessionAccordingToTempLease?: boolean | null;
    } | null;
    buyerProvisions?: {
      __typename: "BuyerProvisionsDetail";
      buyerProvisions?: string | null;
      additionalExpensesPaidBySeller?: number | null;
    } | null;
    buyerNotices?: {
      __typename: "NoticesDetail";
      deliverToAddress?: boolean | null;
      streetAddress?: string | null;
      city?: string | null;
      state?: string | null;
      postalCode?: string | null;
      deliverByPhone?: boolean | null;
      phone?: string | null;
      deliverByEmailFax1?: boolean | null;
      emailFax1?: string | null;
      deliveryByEmailFax2?: boolean | null;
      emailFax2?: string | null;
      deliverToAgent?: boolean | null;
      agentContact?: string | null;
    } | null;
    sellerNotices?: {
      __typename: "NoticesDetail";
      deliverToAddress?: boolean | null;
      streetAddress?: string | null;
      city?: string | null;
      state?: string | null;
      postalCode?: string | null;
      deliverByPhone?: boolean | null;
      phone?: string | null;
      deliverByEmailFax1?: boolean | null;
      emailFax1?: string | null;
      deliveryByEmailFax2?: boolean | null;
      emailFax2?: string | null;
      deliverToAgent?: boolean | null;
      agentContact?: string | null;
    } | null;
    buyerAttorney?: {
      __typename: "Attorney";
      hasAttorney?: boolean | null;
      name?: string | null;
      streetAddress?: string | null;
      city?: string | null;
      state?: string | null;
      postalCode?: string | null;
      phone?: string | null;
      email?: string | null;
      fax?: string | null;
    } | null;
    buyerAgent?: {
      __typename: "BuyerAgent";
      hasBuyerAgent?: boolean | null;
      firmName?: string | null;
      firmLicenseNumber?: string | null;
      firmStreetAddress?: string | null;
      firmCity?: string | null;
      firmState?: string | null;
      firmPostalCode?: string | null;
      firmPhone?: string | null;
      associateName?: string | null;
      associateLicenseNumber?: string | null;
      associateTeamName?: string | null;
      associateEmail?: string | null;
      associatePhone?: string | null;
      associateSupervisorName?: string | null;
      associateSupervisorLicenseNumber?: string | null;
    } | null;
    sellerAttorney?: {
      __typename: "Attorney";
      hasAttorney?: boolean | null;
      name?: string | null;
      streetAddress?: string | null;
      city?: string | null;
      state?: string | null;
      postalCode?: string | null;
      phone?: string | null;
      email?: string | null;
      fax?: string | null;
    } | null;
    listingAgent?: {
      __typename: "ListingAgent";
      hasListingAgentInfo?: boolean | null;
      firmName?: string | null;
      firmLicenseNumber?: string | null;
      firmStreetAddress?: string | null;
      firmCity?: string | null;
      firmState?: string | null;
      firmPostalCode?: string | null;
      firmPhone?: string | null;
      listingAssociateName?: string | null;
      listingAssociateLicenseNumber?: string | null;
      listingAssociateTeamName?: string | null;
      listingAssociateEmail?: string | null;
      listingAssociatePhone?: string | null;
      listingAssociateSupervisorName?: string | null;
      listingAssociateSupervisorLicenseNumber?: string | null;
      sellingAssociateName?: string | null;
      sellingAssociateLicenseNumber?: string | null;
      sellingAssociateTeamName?: string | null;
      sellingAssociateEmail?: string | null;
      sellingAssociatePhone?: string | null;
      sellingAssociateSupervisorName?: string | null;
      sellingAssociateSupervisorLicenseNumber?: string | null;
      sellingAssociateStreetAddress?: string | null;
      sellingAssociateCity?: string | null;
      sellingAssociateState?: string | null;
      sellingAssociatePostalCode?: string | null;
    } | null;
    markedQuestions?: string | null;
    homeownersAssociationAddendum?: {
      __typename: "HomeownersAssociationAddendum";
      hasHomeownersAssociation?: boolean | null;
      storageKey?: string | null;
      associationName?: string | null;
      associationPhoneNumber?: string | null;
      requiresSubdivisionInfo?: boolean | null;
      receivedSubdivisionInfo?: boolean | null;
      requiresUpdatedResaleCertificate?: boolean | null;
      subdivisionInfoProvidedBy?: PartyType | null;
      subdivisionInfoDaysToDeliver?: number | null;
      buyerFeesNotToExceed?: number | null;
      feeForTitleCompanyPaidBy?: PartyType | null;
    } | null;
    leadBasedPaintAddendum?: {
      __typename: "LeadBasedPaintAddendum";
      hasLeadBasedPaintDisclosure?: boolean | null;
      storageKey?: string | null;
      leadBasedPaintDisclosure?: string | null;
    } | null;
    rightToTerminateByLenderAppraisalAddendum?: {
      __typename: "RightToTerminateByLenderAppraisalAddendum";
      hasRightToTerminateByLenderAppraisal?: boolean | null;
      storageKey?: string | null;
      appraisalAmount?: number | null;
    } | null;
    sellerTemporaryLeaseAddendum?: {
      __typename: "SellerTemporaryLeaseAddendum";
      hasSellersTemporaryLease?: boolean | null;
      storageKey?: string | null;
      leaseLength?: number | null;
    } | null;
    createdAt: string;
    updatedAt: string;
    accountContractId?: string | null;
    owner?: string | null;
  } | null;
};

export type OnCreateAccountSubscriptionVariables = {
  filter?: ModelSubscriptionAccountFilterInput | null;
  owner?: string | null;
};

export type OnCreateAccountSubscription = {
  onCreateAccount?: {
    __typename: "Account";
    id: string;
    email: string;
    billingId?: string | null;
    contract?: {
      __typename: "ModelContractConnection";
      items: Array<{
        __typename: "Contract";
        id: string;
        buyers?: {
          __typename: "ContractParty";
          primaryName?: string | null;
          phone?: string | null;
          fax?: string | null;
          email?: string | null;
          hasSecondaryParty?: boolean | null;
          secondaryName?: string | null;
          secondaryPhone?: string | null;
          secondaryFax?: string | null;
          secondaryEmail?: string | null;
        } | null;
        property?: {
          __typename: "Property";
          lot?: string | null;
          block?: string | null;
          county?: string | null;
          legalDescription?: string | null;
          mlsNumber?: string | null;
          streetAddress?: string | null;
          city?: string | null;
          state?: string | null;
          postalCode?: string | null;
          subdivision?: string | null;
          yearBuilt?: number | null;
          numBedroom?: number | null;
          numBathroom?: number | null;
          numFloor?: number | null;
          floorSizeValue?: number | null;
          floorSizeUnit?: string | null;
          lotSizeValue?: number | null;
          lotSizeUnit?: string | null;
          mostRecentPriceAmount?: number | null;
          mostRecentPriceDate?: string | null;
          dateAdded?: string | null;
          dateUpdated?: string | null;
          description?: string | null;
          imageUrl?: string | null;
        } | null;
        finance?: {
          __typename: "Finance";
          hasPreferredLender?: boolean | null;
          wantsLenderReferral?: boolean | null;
          buyerApprovalNoticeDays?: number | null;
          cashAmount?: number | null;
          fhaVaAppraisedValue?: number | null;
          fhaSectionNumber?: number | null;
          financingType?: FinancingType | null;
          interestRate?: number | null;
          interestRateYears?: number | null;
          isBuyerApprovalRequired?: boolean | null;
          isSecondMortgage?: boolean | null;
          loanType?: LoanType | null;
          originationChargePercent?: number | null;
          otherFinancingLenderName?: string | null;
          otherFinancingWaiveRights?: boolean | null;
          principalAmount?: number | null;
          reverseMortgageIsFHAInsured?: boolean | null;
          storageKey?: string | null;
          termYears?: number | null;
          totalSalesPrice?: number | null;
          terminationOnAppraisalType?: TerminationOnAppraisalType | null;
          terminationOpinionOfValueAmount?: number | null;
          terminationDaysAfterEffectiveDate?: number | null;
          terminationAppraisedValueLessThan?: number | null;
        } | null;
        leases?: {
          __typename: "Leases";
          hasResidentialLease?: boolean | null;
          hasFixtureLease?: boolean | null;
          hasMineralLease?: boolean | null;
          mineralLeaseCopyDelivered?: boolean | null;
          mineralLeaseDaysToDeliveryCopy?: number | null;
        } | null;
        sellers?: {
          __typename: "ContractParty";
          primaryName?: string | null;
          phone?: string | null;
          fax?: string | null;
          email?: string | null;
          hasSecondaryParty?: boolean | null;
          secondaryName?: string | null;
          secondaryPhone?: string | null;
          secondaryFax?: string | null;
          secondaryEmail?: string | null;
        } | null;
        title?: {
          __typename: "TitleDetail";
          hasTitleCompany?: boolean | null;
          wantsTitleReferral?: boolean | null;
          titleCompanyName?: string | null;
          titleCompanyStreetAddress?: string | null;
          titleCompanyCity?: string | null;
          titleCompanyState?: string | null;
          titleCompanyPostalCode?: string | null;
          standardExceptionsToBeAmended?: boolean | null;
          standardExceptionsToBeAmendedBy?: PartyType | null;
          titleFurnishingParty?: PartyType | null;
          escrowAgentName?: string | null;
          earnestMoney?: number | null;
          hasOptionFee?: boolean | null;
          optionFee?: number | null;
          hasAdditionalEarnestMoney?: boolean | null;
          additionalEarnestMoney?: number | null;
          additionalEarnestMoneyDaysToDeliver?: number | null;
          optionPeriodDaysToTerminate?: number | null;
        } | null;
        titleObjections?: {
          __typename: "TitleObjections";
          objections?: string | null;
          daysToObject?: number | null;
        } | null;
        survey?: {
          __typename: "SurveyDetail";
          daysToFurnish?: number | null;
          type?: SurveyType | null;
          furnishingPartyIfExistingIsUnacceptable?: PartyType | null;
        } | null;
        titleNotices?: {
          __typename: "TitleNotices";
          isInMUD?: boolean | null;
          isInCoastalArea?: boolean | null;
          isInPublicImprovementDistrict?: boolean | null;
          isInPropaneServiceArea?: boolean | null;
        } | null;
        propertyCondition?: {
          __typename: "PropertyCondition";
          sellerDisclosureReceived?: boolean | null;
          sellerDisclosureDaysToProduce?: number | null;
          sellerRequiredToDisclose?: boolean | null;
          buyerAcceptsAsIs?: boolean | null;
          retainedImprovements?: string | null;
          buyerAcceptanceRepairSpecifics?: string | null;
          serviceContractReimbursementAmount?: number | null;
        } | null;
        brokerDisclosure?: {
          __typename: "BrokerDisclosure";
          buyerIsThirdPartyAgent?: boolean | null;
          buyerIsRelatedToSeller?: boolean | null;
          buyerHasStakeInProperty?: boolean | null;
          buyerIsBeingCompensated?: boolean | null;
          buyerDisclosure?: string | null;
        } | null;
        closing?: {
          __typename: "ClosingDetail";
          closingDate?: string | null;
        } | null;
        possession?: {
          __typename: "PossessionDetail";
          possessionUponClosing?: boolean | null;
          possessionAccordingToTempLease?: boolean | null;
        } | null;
        buyerProvisions?: {
          __typename: "BuyerProvisionsDetail";
          buyerProvisions?: string | null;
          additionalExpensesPaidBySeller?: number | null;
        } | null;
        buyerNotices?: {
          __typename: "NoticesDetail";
          deliverToAddress?: boolean | null;
          streetAddress?: string | null;
          city?: string | null;
          state?: string | null;
          postalCode?: string | null;
          deliverByPhone?: boolean | null;
          phone?: string | null;
          deliverByEmailFax1?: boolean | null;
          emailFax1?: string | null;
          deliveryByEmailFax2?: boolean | null;
          emailFax2?: string | null;
          deliverToAgent?: boolean | null;
          agentContact?: string | null;
        } | null;
        sellerNotices?: {
          __typename: "NoticesDetail";
          deliverToAddress?: boolean | null;
          streetAddress?: string | null;
          city?: string | null;
          state?: string | null;
          postalCode?: string | null;
          deliverByPhone?: boolean | null;
          phone?: string | null;
          deliverByEmailFax1?: boolean | null;
          emailFax1?: string | null;
          deliveryByEmailFax2?: boolean | null;
          emailFax2?: string | null;
          deliverToAgent?: boolean | null;
          agentContact?: string | null;
        } | null;
        buyerAttorney?: {
          __typename: "Attorney";
          hasAttorney?: boolean | null;
          name?: string | null;
          streetAddress?: string | null;
          city?: string | null;
          state?: string | null;
          postalCode?: string | null;
          phone?: string | null;
          email?: string | null;
          fax?: string | null;
        } | null;
        buyerAgent?: {
          __typename: "BuyerAgent";
          hasBuyerAgent?: boolean | null;
          firmName?: string | null;
          firmLicenseNumber?: string | null;
          firmStreetAddress?: string | null;
          firmCity?: string | null;
          firmState?: string | null;
          firmPostalCode?: string | null;
          firmPhone?: string | null;
          associateName?: string | null;
          associateLicenseNumber?: string | null;
          associateTeamName?: string | null;
          associateEmail?: string | null;
          associatePhone?: string | null;
          associateSupervisorName?: string | null;
          associateSupervisorLicenseNumber?: string | null;
        } | null;
        sellerAttorney?: {
          __typename: "Attorney";
          hasAttorney?: boolean | null;
          name?: string | null;
          streetAddress?: string | null;
          city?: string | null;
          state?: string | null;
          postalCode?: string | null;
          phone?: string | null;
          email?: string | null;
          fax?: string | null;
        } | null;
        listingAgent?: {
          __typename: "ListingAgent";
          hasListingAgentInfo?: boolean | null;
          firmName?: string | null;
          firmLicenseNumber?: string | null;
          firmStreetAddress?: string | null;
          firmCity?: string | null;
          firmState?: string | null;
          firmPostalCode?: string | null;
          firmPhone?: string | null;
          listingAssociateName?: string | null;
          listingAssociateLicenseNumber?: string | null;
          listingAssociateTeamName?: string | null;
          listingAssociateEmail?: string | null;
          listingAssociatePhone?: string | null;
          listingAssociateSupervisorName?: string | null;
          listingAssociateSupervisorLicenseNumber?: string | null;
          sellingAssociateName?: string | null;
          sellingAssociateLicenseNumber?: string | null;
          sellingAssociateTeamName?: string | null;
          sellingAssociateEmail?: string | null;
          sellingAssociatePhone?: string | null;
          sellingAssociateSupervisorName?: string | null;
          sellingAssociateSupervisorLicenseNumber?: string | null;
          sellingAssociateStreetAddress?: string | null;
          sellingAssociateCity?: string | null;
          sellingAssociateState?: string | null;
          sellingAssociatePostalCode?: string | null;
        } | null;
        markedQuestions?: string | null;
        homeownersAssociationAddendum?: {
          __typename: "HomeownersAssociationAddendum";
          hasHomeownersAssociation?: boolean | null;
          storageKey?: string | null;
          associationName?: string | null;
          associationPhoneNumber?: string | null;
          requiresSubdivisionInfo?: boolean | null;
          receivedSubdivisionInfo?: boolean | null;
          requiresUpdatedResaleCertificate?: boolean | null;
          subdivisionInfoProvidedBy?: PartyType | null;
          subdivisionInfoDaysToDeliver?: number | null;
          buyerFeesNotToExceed?: number | null;
          feeForTitleCompanyPaidBy?: PartyType | null;
        } | null;
        leadBasedPaintAddendum?: {
          __typename: "LeadBasedPaintAddendum";
          hasLeadBasedPaintDisclosure?: boolean | null;
          storageKey?: string | null;
          leadBasedPaintDisclosure?: string | null;
        } | null;
        rightToTerminateByLenderAppraisalAddendum?: {
          __typename: "RightToTerminateByLenderAppraisalAddendum";
          hasRightToTerminateByLenderAppraisal?: boolean | null;
          storageKey?: string | null;
          appraisalAmount?: number | null;
        } | null;
        sellerTemporaryLeaseAddendum?: {
          __typename: "SellerTemporaryLeaseAddendum";
          hasSellersTemporaryLease?: boolean | null;
          storageKey?: string | null;
          leaseLength?: number | null;
        } | null;
        createdAt: string;
        updatedAt: string;
        accountContractId?: string | null;
        owner?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    isPaid?: boolean | null;
    street1?: string | null;
    street2?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    firstName?: string | null;
    middleInitial?: string | null;
    lastName?: string | null;
    owner: string;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type OnUpdateAccountSubscriptionVariables = {
  filter?: ModelSubscriptionAccountFilterInput | null;
  owner?: string | null;
};

export type OnUpdateAccountSubscription = {
  onUpdateAccount?: {
    __typename: "Account";
    id: string;
    email: string;
    billingId?: string | null;
    contract?: {
      __typename: "ModelContractConnection";
      items: Array<{
        __typename: "Contract";
        id: string;
        buyers?: {
          __typename: "ContractParty";
          primaryName?: string | null;
          phone?: string | null;
          fax?: string | null;
          email?: string | null;
          hasSecondaryParty?: boolean | null;
          secondaryName?: string | null;
          secondaryPhone?: string | null;
          secondaryFax?: string | null;
          secondaryEmail?: string | null;
        } | null;
        property?: {
          __typename: "Property";
          lot?: string | null;
          block?: string | null;
          county?: string | null;
          legalDescription?: string | null;
          mlsNumber?: string | null;
          streetAddress?: string | null;
          city?: string | null;
          state?: string | null;
          postalCode?: string | null;
          subdivision?: string | null;
          yearBuilt?: number | null;
          numBedroom?: number | null;
          numBathroom?: number | null;
          numFloor?: number | null;
          floorSizeValue?: number | null;
          floorSizeUnit?: string | null;
          lotSizeValue?: number | null;
          lotSizeUnit?: string | null;
          mostRecentPriceAmount?: number | null;
          mostRecentPriceDate?: string | null;
          dateAdded?: string | null;
          dateUpdated?: string | null;
          description?: string | null;
          imageUrl?: string | null;
        } | null;
        finance?: {
          __typename: "Finance";
          hasPreferredLender?: boolean | null;
          wantsLenderReferral?: boolean | null;
          buyerApprovalNoticeDays?: number | null;
          cashAmount?: number | null;
          fhaVaAppraisedValue?: number | null;
          fhaSectionNumber?: number | null;
          financingType?: FinancingType | null;
          interestRate?: number | null;
          interestRateYears?: number | null;
          isBuyerApprovalRequired?: boolean | null;
          isSecondMortgage?: boolean | null;
          loanType?: LoanType | null;
          originationChargePercent?: number | null;
          otherFinancingLenderName?: string | null;
          otherFinancingWaiveRights?: boolean | null;
          principalAmount?: number | null;
          reverseMortgageIsFHAInsured?: boolean | null;
          storageKey?: string | null;
          termYears?: number | null;
          totalSalesPrice?: number | null;
          terminationOnAppraisalType?: TerminationOnAppraisalType | null;
          terminationOpinionOfValueAmount?: number | null;
          terminationDaysAfterEffectiveDate?: number | null;
          terminationAppraisedValueLessThan?: number | null;
        } | null;
        leases?: {
          __typename: "Leases";
          hasResidentialLease?: boolean | null;
          hasFixtureLease?: boolean | null;
          hasMineralLease?: boolean | null;
          mineralLeaseCopyDelivered?: boolean | null;
          mineralLeaseDaysToDeliveryCopy?: number | null;
        } | null;
        sellers?: {
          __typename: "ContractParty";
          primaryName?: string | null;
          phone?: string | null;
          fax?: string | null;
          email?: string | null;
          hasSecondaryParty?: boolean | null;
          secondaryName?: string | null;
          secondaryPhone?: string | null;
          secondaryFax?: string | null;
          secondaryEmail?: string | null;
        } | null;
        title?: {
          __typename: "TitleDetail";
          hasTitleCompany?: boolean | null;
          wantsTitleReferral?: boolean | null;
          titleCompanyName?: string | null;
          titleCompanyStreetAddress?: string | null;
          titleCompanyCity?: string | null;
          titleCompanyState?: string | null;
          titleCompanyPostalCode?: string | null;
          standardExceptionsToBeAmended?: boolean | null;
          standardExceptionsToBeAmendedBy?: PartyType | null;
          titleFurnishingParty?: PartyType | null;
          escrowAgentName?: string | null;
          earnestMoney?: number | null;
          hasOptionFee?: boolean | null;
          optionFee?: number | null;
          hasAdditionalEarnestMoney?: boolean | null;
          additionalEarnestMoney?: number | null;
          additionalEarnestMoneyDaysToDeliver?: number | null;
          optionPeriodDaysToTerminate?: number | null;
        } | null;
        titleObjections?: {
          __typename: "TitleObjections";
          objections?: string | null;
          daysToObject?: number | null;
        } | null;
        survey?: {
          __typename: "SurveyDetail";
          daysToFurnish?: number | null;
          type?: SurveyType | null;
          furnishingPartyIfExistingIsUnacceptable?: PartyType | null;
        } | null;
        titleNotices?: {
          __typename: "TitleNotices";
          isInMUD?: boolean | null;
          isInCoastalArea?: boolean | null;
          isInPublicImprovementDistrict?: boolean | null;
          isInPropaneServiceArea?: boolean | null;
        } | null;
        propertyCondition?: {
          __typename: "PropertyCondition";
          sellerDisclosureReceived?: boolean | null;
          sellerDisclosureDaysToProduce?: number | null;
          sellerRequiredToDisclose?: boolean | null;
          buyerAcceptsAsIs?: boolean | null;
          retainedImprovements?: string | null;
          buyerAcceptanceRepairSpecifics?: string | null;
          serviceContractReimbursementAmount?: number | null;
        } | null;
        brokerDisclosure?: {
          __typename: "BrokerDisclosure";
          buyerIsThirdPartyAgent?: boolean | null;
          buyerIsRelatedToSeller?: boolean | null;
          buyerHasStakeInProperty?: boolean | null;
          buyerIsBeingCompensated?: boolean | null;
          buyerDisclosure?: string | null;
        } | null;
        closing?: {
          __typename: "ClosingDetail";
          closingDate?: string | null;
        } | null;
        possession?: {
          __typename: "PossessionDetail";
          possessionUponClosing?: boolean | null;
          possessionAccordingToTempLease?: boolean | null;
        } | null;
        buyerProvisions?: {
          __typename: "BuyerProvisionsDetail";
          buyerProvisions?: string | null;
          additionalExpensesPaidBySeller?: number | null;
        } | null;
        buyerNotices?: {
          __typename: "NoticesDetail";
          deliverToAddress?: boolean | null;
          streetAddress?: string | null;
          city?: string | null;
          state?: string | null;
          postalCode?: string | null;
          deliverByPhone?: boolean | null;
          phone?: string | null;
          deliverByEmailFax1?: boolean | null;
          emailFax1?: string | null;
          deliveryByEmailFax2?: boolean | null;
          emailFax2?: string | null;
          deliverToAgent?: boolean | null;
          agentContact?: string | null;
        } | null;
        sellerNotices?: {
          __typename: "NoticesDetail";
          deliverToAddress?: boolean | null;
          streetAddress?: string | null;
          city?: string | null;
          state?: string | null;
          postalCode?: string | null;
          deliverByPhone?: boolean | null;
          phone?: string | null;
          deliverByEmailFax1?: boolean | null;
          emailFax1?: string | null;
          deliveryByEmailFax2?: boolean | null;
          emailFax2?: string | null;
          deliverToAgent?: boolean | null;
          agentContact?: string | null;
        } | null;
        buyerAttorney?: {
          __typename: "Attorney";
          hasAttorney?: boolean | null;
          name?: string | null;
          streetAddress?: string | null;
          city?: string | null;
          state?: string | null;
          postalCode?: string | null;
          phone?: string | null;
          email?: string | null;
          fax?: string | null;
        } | null;
        buyerAgent?: {
          __typename: "BuyerAgent";
          hasBuyerAgent?: boolean | null;
          firmName?: string | null;
          firmLicenseNumber?: string | null;
          firmStreetAddress?: string | null;
          firmCity?: string | null;
          firmState?: string | null;
          firmPostalCode?: string | null;
          firmPhone?: string | null;
          associateName?: string | null;
          associateLicenseNumber?: string | null;
          associateTeamName?: string | null;
          associateEmail?: string | null;
          associatePhone?: string | null;
          associateSupervisorName?: string | null;
          associateSupervisorLicenseNumber?: string | null;
        } | null;
        sellerAttorney?: {
          __typename: "Attorney";
          hasAttorney?: boolean | null;
          name?: string | null;
          streetAddress?: string | null;
          city?: string | null;
          state?: string | null;
          postalCode?: string | null;
          phone?: string | null;
          email?: string | null;
          fax?: string | null;
        } | null;
        listingAgent?: {
          __typename: "ListingAgent";
          hasListingAgentInfo?: boolean | null;
          firmName?: string | null;
          firmLicenseNumber?: string | null;
          firmStreetAddress?: string | null;
          firmCity?: string | null;
          firmState?: string | null;
          firmPostalCode?: string | null;
          firmPhone?: string | null;
          listingAssociateName?: string | null;
          listingAssociateLicenseNumber?: string | null;
          listingAssociateTeamName?: string | null;
          listingAssociateEmail?: string | null;
          listingAssociatePhone?: string | null;
          listingAssociateSupervisorName?: string | null;
          listingAssociateSupervisorLicenseNumber?: string | null;
          sellingAssociateName?: string | null;
          sellingAssociateLicenseNumber?: string | null;
          sellingAssociateTeamName?: string | null;
          sellingAssociateEmail?: string | null;
          sellingAssociatePhone?: string | null;
          sellingAssociateSupervisorName?: string | null;
          sellingAssociateSupervisorLicenseNumber?: string | null;
          sellingAssociateStreetAddress?: string | null;
          sellingAssociateCity?: string | null;
          sellingAssociateState?: string | null;
          sellingAssociatePostalCode?: string | null;
        } | null;
        markedQuestions?: string | null;
        homeownersAssociationAddendum?: {
          __typename: "HomeownersAssociationAddendum";
          hasHomeownersAssociation?: boolean | null;
          storageKey?: string | null;
          associationName?: string | null;
          associationPhoneNumber?: string | null;
          requiresSubdivisionInfo?: boolean | null;
          receivedSubdivisionInfo?: boolean | null;
          requiresUpdatedResaleCertificate?: boolean | null;
          subdivisionInfoProvidedBy?: PartyType | null;
          subdivisionInfoDaysToDeliver?: number | null;
          buyerFeesNotToExceed?: number | null;
          feeForTitleCompanyPaidBy?: PartyType | null;
        } | null;
        leadBasedPaintAddendum?: {
          __typename: "LeadBasedPaintAddendum";
          hasLeadBasedPaintDisclosure?: boolean | null;
          storageKey?: string | null;
          leadBasedPaintDisclosure?: string | null;
        } | null;
        rightToTerminateByLenderAppraisalAddendum?: {
          __typename: "RightToTerminateByLenderAppraisalAddendum";
          hasRightToTerminateByLenderAppraisal?: boolean | null;
          storageKey?: string | null;
          appraisalAmount?: number | null;
        } | null;
        sellerTemporaryLeaseAddendum?: {
          __typename: "SellerTemporaryLeaseAddendum";
          hasSellersTemporaryLease?: boolean | null;
          storageKey?: string | null;
          leaseLength?: number | null;
        } | null;
        createdAt: string;
        updatedAt: string;
        accountContractId?: string | null;
        owner?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    isPaid?: boolean | null;
    street1?: string | null;
    street2?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    firstName?: string | null;
    middleInitial?: string | null;
    lastName?: string | null;
    owner: string;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type OnDeleteAccountSubscriptionVariables = {
  filter?: ModelSubscriptionAccountFilterInput | null;
  owner?: string | null;
};

export type OnDeleteAccountSubscription = {
  onDeleteAccount?: {
    __typename: "Account";
    id: string;
    email: string;
    billingId?: string | null;
    contract?: {
      __typename: "ModelContractConnection";
      items: Array<{
        __typename: "Contract";
        id: string;
        buyers?: {
          __typename: "ContractParty";
          primaryName?: string | null;
          phone?: string | null;
          fax?: string | null;
          email?: string | null;
          hasSecondaryParty?: boolean | null;
          secondaryName?: string | null;
          secondaryPhone?: string | null;
          secondaryFax?: string | null;
          secondaryEmail?: string | null;
        } | null;
        property?: {
          __typename: "Property";
          lot?: string | null;
          block?: string | null;
          county?: string | null;
          legalDescription?: string | null;
          mlsNumber?: string | null;
          streetAddress?: string | null;
          city?: string | null;
          state?: string | null;
          postalCode?: string | null;
          subdivision?: string | null;
          yearBuilt?: number | null;
          numBedroom?: number | null;
          numBathroom?: number | null;
          numFloor?: number | null;
          floorSizeValue?: number | null;
          floorSizeUnit?: string | null;
          lotSizeValue?: number | null;
          lotSizeUnit?: string | null;
          mostRecentPriceAmount?: number | null;
          mostRecentPriceDate?: string | null;
          dateAdded?: string | null;
          dateUpdated?: string | null;
          description?: string | null;
          imageUrl?: string | null;
        } | null;
        finance?: {
          __typename: "Finance";
          hasPreferredLender?: boolean | null;
          wantsLenderReferral?: boolean | null;
          buyerApprovalNoticeDays?: number | null;
          cashAmount?: number | null;
          fhaVaAppraisedValue?: number | null;
          fhaSectionNumber?: number | null;
          financingType?: FinancingType | null;
          interestRate?: number | null;
          interestRateYears?: number | null;
          isBuyerApprovalRequired?: boolean | null;
          isSecondMortgage?: boolean | null;
          loanType?: LoanType | null;
          originationChargePercent?: number | null;
          otherFinancingLenderName?: string | null;
          otherFinancingWaiveRights?: boolean | null;
          principalAmount?: number | null;
          reverseMortgageIsFHAInsured?: boolean | null;
          storageKey?: string | null;
          termYears?: number | null;
          totalSalesPrice?: number | null;
          terminationOnAppraisalType?: TerminationOnAppraisalType | null;
          terminationOpinionOfValueAmount?: number | null;
          terminationDaysAfterEffectiveDate?: number | null;
          terminationAppraisedValueLessThan?: number | null;
        } | null;
        leases?: {
          __typename: "Leases";
          hasResidentialLease?: boolean | null;
          hasFixtureLease?: boolean | null;
          hasMineralLease?: boolean | null;
          mineralLeaseCopyDelivered?: boolean | null;
          mineralLeaseDaysToDeliveryCopy?: number | null;
        } | null;
        sellers?: {
          __typename: "ContractParty";
          primaryName?: string | null;
          phone?: string | null;
          fax?: string | null;
          email?: string | null;
          hasSecondaryParty?: boolean | null;
          secondaryName?: string | null;
          secondaryPhone?: string | null;
          secondaryFax?: string | null;
          secondaryEmail?: string | null;
        } | null;
        title?: {
          __typename: "TitleDetail";
          hasTitleCompany?: boolean | null;
          wantsTitleReferral?: boolean | null;
          titleCompanyName?: string | null;
          titleCompanyStreetAddress?: string | null;
          titleCompanyCity?: string | null;
          titleCompanyState?: string | null;
          titleCompanyPostalCode?: string | null;
          standardExceptionsToBeAmended?: boolean | null;
          standardExceptionsToBeAmendedBy?: PartyType | null;
          titleFurnishingParty?: PartyType | null;
          escrowAgentName?: string | null;
          earnestMoney?: number | null;
          hasOptionFee?: boolean | null;
          optionFee?: number | null;
          hasAdditionalEarnestMoney?: boolean | null;
          additionalEarnestMoney?: number | null;
          additionalEarnestMoneyDaysToDeliver?: number | null;
          optionPeriodDaysToTerminate?: number | null;
        } | null;
        titleObjections?: {
          __typename: "TitleObjections";
          objections?: string | null;
          daysToObject?: number | null;
        } | null;
        survey?: {
          __typename: "SurveyDetail";
          daysToFurnish?: number | null;
          type?: SurveyType | null;
          furnishingPartyIfExistingIsUnacceptable?: PartyType | null;
        } | null;
        titleNotices?: {
          __typename: "TitleNotices";
          isInMUD?: boolean | null;
          isInCoastalArea?: boolean | null;
          isInPublicImprovementDistrict?: boolean | null;
          isInPropaneServiceArea?: boolean | null;
        } | null;
        propertyCondition?: {
          __typename: "PropertyCondition";
          sellerDisclosureReceived?: boolean | null;
          sellerDisclosureDaysToProduce?: number | null;
          sellerRequiredToDisclose?: boolean | null;
          buyerAcceptsAsIs?: boolean | null;
          retainedImprovements?: string | null;
          buyerAcceptanceRepairSpecifics?: string | null;
          serviceContractReimbursementAmount?: number | null;
        } | null;
        brokerDisclosure?: {
          __typename: "BrokerDisclosure";
          buyerIsThirdPartyAgent?: boolean | null;
          buyerIsRelatedToSeller?: boolean | null;
          buyerHasStakeInProperty?: boolean | null;
          buyerIsBeingCompensated?: boolean | null;
          buyerDisclosure?: string | null;
        } | null;
        closing?: {
          __typename: "ClosingDetail";
          closingDate?: string | null;
        } | null;
        possession?: {
          __typename: "PossessionDetail";
          possessionUponClosing?: boolean | null;
          possessionAccordingToTempLease?: boolean | null;
        } | null;
        buyerProvisions?: {
          __typename: "BuyerProvisionsDetail";
          buyerProvisions?: string | null;
          additionalExpensesPaidBySeller?: number | null;
        } | null;
        buyerNotices?: {
          __typename: "NoticesDetail";
          deliverToAddress?: boolean | null;
          streetAddress?: string | null;
          city?: string | null;
          state?: string | null;
          postalCode?: string | null;
          deliverByPhone?: boolean | null;
          phone?: string | null;
          deliverByEmailFax1?: boolean | null;
          emailFax1?: string | null;
          deliveryByEmailFax2?: boolean | null;
          emailFax2?: string | null;
          deliverToAgent?: boolean | null;
          agentContact?: string | null;
        } | null;
        sellerNotices?: {
          __typename: "NoticesDetail";
          deliverToAddress?: boolean | null;
          streetAddress?: string | null;
          city?: string | null;
          state?: string | null;
          postalCode?: string | null;
          deliverByPhone?: boolean | null;
          phone?: string | null;
          deliverByEmailFax1?: boolean | null;
          emailFax1?: string | null;
          deliveryByEmailFax2?: boolean | null;
          emailFax2?: string | null;
          deliverToAgent?: boolean | null;
          agentContact?: string | null;
        } | null;
        buyerAttorney?: {
          __typename: "Attorney";
          hasAttorney?: boolean | null;
          name?: string | null;
          streetAddress?: string | null;
          city?: string | null;
          state?: string | null;
          postalCode?: string | null;
          phone?: string | null;
          email?: string | null;
          fax?: string | null;
        } | null;
        buyerAgent?: {
          __typename: "BuyerAgent";
          hasBuyerAgent?: boolean | null;
          firmName?: string | null;
          firmLicenseNumber?: string | null;
          firmStreetAddress?: string | null;
          firmCity?: string | null;
          firmState?: string | null;
          firmPostalCode?: string | null;
          firmPhone?: string | null;
          associateName?: string | null;
          associateLicenseNumber?: string | null;
          associateTeamName?: string | null;
          associateEmail?: string | null;
          associatePhone?: string | null;
          associateSupervisorName?: string | null;
          associateSupervisorLicenseNumber?: string | null;
        } | null;
        sellerAttorney?: {
          __typename: "Attorney";
          hasAttorney?: boolean | null;
          name?: string | null;
          streetAddress?: string | null;
          city?: string | null;
          state?: string | null;
          postalCode?: string | null;
          phone?: string | null;
          email?: string | null;
          fax?: string | null;
        } | null;
        listingAgent?: {
          __typename: "ListingAgent";
          hasListingAgentInfo?: boolean | null;
          firmName?: string | null;
          firmLicenseNumber?: string | null;
          firmStreetAddress?: string | null;
          firmCity?: string | null;
          firmState?: string | null;
          firmPostalCode?: string | null;
          firmPhone?: string | null;
          listingAssociateName?: string | null;
          listingAssociateLicenseNumber?: string | null;
          listingAssociateTeamName?: string | null;
          listingAssociateEmail?: string | null;
          listingAssociatePhone?: string | null;
          listingAssociateSupervisorName?: string | null;
          listingAssociateSupervisorLicenseNumber?: string | null;
          sellingAssociateName?: string | null;
          sellingAssociateLicenseNumber?: string | null;
          sellingAssociateTeamName?: string | null;
          sellingAssociateEmail?: string | null;
          sellingAssociatePhone?: string | null;
          sellingAssociateSupervisorName?: string | null;
          sellingAssociateSupervisorLicenseNumber?: string | null;
          sellingAssociateStreetAddress?: string | null;
          sellingAssociateCity?: string | null;
          sellingAssociateState?: string | null;
          sellingAssociatePostalCode?: string | null;
        } | null;
        markedQuestions?: string | null;
        homeownersAssociationAddendum?: {
          __typename: "HomeownersAssociationAddendum";
          hasHomeownersAssociation?: boolean | null;
          storageKey?: string | null;
          associationName?: string | null;
          associationPhoneNumber?: string | null;
          requiresSubdivisionInfo?: boolean | null;
          receivedSubdivisionInfo?: boolean | null;
          requiresUpdatedResaleCertificate?: boolean | null;
          subdivisionInfoProvidedBy?: PartyType | null;
          subdivisionInfoDaysToDeliver?: number | null;
          buyerFeesNotToExceed?: number | null;
          feeForTitleCompanyPaidBy?: PartyType | null;
        } | null;
        leadBasedPaintAddendum?: {
          __typename: "LeadBasedPaintAddendum";
          hasLeadBasedPaintDisclosure?: boolean | null;
          storageKey?: string | null;
          leadBasedPaintDisclosure?: string | null;
        } | null;
        rightToTerminateByLenderAppraisalAddendum?: {
          __typename: "RightToTerminateByLenderAppraisalAddendum";
          hasRightToTerminateByLenderAppraisal?: boolean | null;
          storageKey?: string | null;
          appraisalAmount?: number | null;
        } | null;
        sellerTemporaryLeaseAddendum?: {
          __typename: "SellerTemporaryLeaseAddendum";
          hasSellersTemporaryLease?: boolean | null;
          storageKey?: string | null;
          leaseLength?: number | null;
        } | null;
        createdAt: string;
        updatedAt: string;
        accountContractId?: string | null;
        owner?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    isPaid?: boolean | null;
    street1?: string | null;
    street2?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    firstName?: string | null;
    middleInitial?: string | null;
    lastName?: string | null;
    owner: string;
    createdAt: string;
    updatedAt: string;
  } | null;
};
