import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import {
  getQuestionsForSection,
  QuestionConfig,
} from "@/config/TX/questionConfig";
// EtchPacket type is now handled by Supabase types
// import { EtchPacket } from "@/API"; // Deprecated
import { isQuestionRequired } from "@/utils/questionUtils";
import { transformSupabaseDataForVuex, normalizeContractData } from "@/utils/fieldMapUtils";

function removeTypename(obj) {
  if (Array.isArray(obj)) {
    return obj.map(removeTypename);
  } else if (typeof obj === "object" && obj !== null) {
    return Object.entries(obj)
      .filter(([key]) => key !== "__typename")
      .reduce((acc, [key, value]) => {
        acc[key] = removeTypename(value);
        return acc;
      }, {});
  }
  return obj;
}

const initialState = {
  formData: {
    property: {
      lot: "",
      block: "",
      county: "",
      legalDescription: "",
      streetAddress: "",
      city: "",
      state: "",
      postalCode: "",
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
    buyers: {
      primaryName: "",
      phone: "",
      fax: "",
      email: "",
      hasSecondaryParty: null,
      secondaryName: "",
      secondaryEmail: "",
    },
    sellers: {
      primaryName: "",
      phone: "",
      fax: "",
      email: "",
      hasSecondaryParty: null,
      secondaryName: "",
    },
    homeownersAssociationAddendum: {
      hasHomeownersAssociation: null,
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
    leases: {
      hasResidentialLease: null,
      hasFixtureLease: null,
      hasMineralLease: null,
      mineralLeaseCopyDelivered: null,
      mineralLeaseDaysToDeliveryCopy: null,
    },
    title: {
      hasTitleCompany: null,
      wantsTitleReferral: null,
      titleCompanyName: "",
      titleCompanyStreetAddress: "",
      titleCompanyCity: "",
      titleCompanyState: "",
      titleCompanyPostalCode: "",
      standardExceptionsToBeAmended: null,
      standardExceptionsToBeAmendedBy: null,
      titleFurnishingParty: null,
      escrowAgentName: "",
      earnestMoney: null,
      optionFee: null,
      additionalEarnestMoney: null,
      additionalEarnestMoneyDaysToDeliver: null,
      optionPeriodDaysToTerminate: null,
    },
    titleObjections: {
      objections: "",
      daysToObject: null,
    },
    titleNotices: {
      isInMUD: null,
      isInCoastalArea: null,
      isInPublicImprovementDistrict: null,
      isInPropaneServiceArea: null,
    },
    survey: {
      daysToFurnish: null,
      type: null,
      furnishingPartyIfExistingIsUnacceptable: null,
    },
    propertyCondition: {
      sellerDisclosureReceived: null,
      sellerDisclosureDaysToProduce: null,
      sellerRequiredToDisclose: null,
      buyerAcceptsAsIs: null,
      buyerAcceptanceRepairSpecifics: null,
      serviceContractReimbursementAmount: null,
      retainedImprovements: null,
    },
    finance: {
      hasPreferredLender: null,
      wantsLenderReferral: null,
      buyerApprovalNoticeDays: null,
      cashAmount: null,
      fhaVaAppraisedValue: null,
      fhaSectionNumber: null,
      financingType: null,
      interestRate: null,
      interestRateYears: null,
      isBuyerApprovalRequired: null,
      isSecondMortgage: null,
      loanType: null,
      originationChargePercent: null,
      otherFinancingLenderName: null,
      otherFinancingWaiveRights: null,
      principalAmount: null,
      reverseMortgageIsFHAInsured: null,
      storageKey: null,
      termYears: null,
      totalSalesPrice: null,
      terminationOnAppraisalType: null,
      terminationOpinionOfValueAmount: null,
      terminationDaysAfterEffectiveDate: null,
      terminationAppraisedValueLessThan: null,
    },
    buyerProvisions: {
      buyerProvisions: "",
      additionalExpensesPaidBySeller: null,
    },
    closing: {
      closingDate: null,
    },
    possession: {
      possessionUponClosing: null,
      possessionAccordingToTempLease: null,
    },
    brokerDisclosure: {
      buyerIsThirdPartyAgent: null,
      buyerIsRelatedToSeller: null,
      buyerHasStakeInProperty: null,
      buyerIsBeingCompensated: null,
      buyerDisclosure: null,
    },
    buyerNotices: {
      deliverToAddress: null,
      streetAddress: "",
      city: "",
      state: "",
      postalCode: "",
      deliverByPhone: null,
      phone: "",
      deliverByEmailFax1: null,
      emailFax1: "",
      deliveryByEmailFax2: null,
      emailFax2: "",
      deliverToAgent: null,
      agentContact: "",
    },
    buyerAttorney: {
      hasAttorney: null,
      name: "",
      streetAddress: "",
      city: "",
      state: "",
      postalCode: "",
      phone: "",
      email: "",
      fax: "",
    },
    // sellerAttorney: {
    //   hasAttorney: null,
    //   name: "",
    //   streetAddress: "",
    //   city: "",
    //   state: "",
    //   postalCode: "",
    //   phone: "",
    //   email: "",
    //   fax: "",
    // },
    // buyerAgent: {
    //   hasBuyerAgent: null,
    //   firmName: "",
    //   firmLicenseNumber: "",
    //   firmStreetAddress: "",
    //   firmCity: "",
    //   firmState: "",
    //   firmPostalCode: "",
    //   firmPhone: "",
    //   associateName: "",
    //   associateLicenseNumber: "",
    //   associateTeamName: "",
    //   associateEmail: "",
    //   associatePhone: "",
    //   associateSupervisorName: "",
    //   associateSupervisorLicenseNumber: "",
    // },
    listingAgent: {
      hasListingAgentInfo: null,
      firmName: "",
      firmLicenseNumber: "",
      firmStreetAddress: "",
      firmCity: "",
      firmState: "",
      firmPostalCode: "",
      firmPhone: "",
      listingAssociateName: "",
      listingAssociateLicenseNumber: "",
      listingAssociateTeamName: "",
      listingAssociateEmail: "",
      listingAssociatePhone: "",
      listingAssociateSupervisorName: "",
      listingAssociateSupervisorLicenseNumber: "",
      // sellingAssociateName: "",
      // sellingAssociateLicenseNumber: "",
      // sellingAssociateTeamName: "",
      // sellingAssociateEmail: "",
      // sellingAssociatePhone: "",
      // sellingAssociateSupervisorName: "",
      // sellingAssociateSupervisorLicenseNumber: "",
      // sellingAssociateStreetAddress: "",
      // sellingAssociateCity: "",
      // sellingAssociateState: "",
      // sellingAssociatePostalCode: "",
    },
    // thirdPartyFinanceAddendum: {
    // },
  },
  requiredFields: {
    buyers: ["primaryName", "phone", "email", "hasSecondaryParty"],
    property: [
      "lot",
      "block",
      "county",
      "legalDescription",
      "streetAddress",
      "city",
      "state",
      "postalCode",
    ],
    finance: [
      "loanType",
      "cashAmount",
      "termYears",
      "financingType",
      "principalAmount",
      "interestRate",
      "totalSalesPrice",
    ],
    leases: ["hasResidentialLease"],
    sellers: ["primaryName"],
    title: [
      "hasTitleCompany",
      "titleCompanyName",
      "titleCompanyStreetAddress",
      "titleCompanyCity",
      "titleCompanyState",
      "titleCompanyPostalCode",
      "standardExceptionsToBeAmended",
      "titleFurnishingParty",
      "escrowAgentName",
      "earnestMoney",
      "optionFee",
      "optionPeriodDaysToTerminate",
    ],
    survey: ["daysToFurnish", "type"],
    titleObjections: ["daysToObject"],
    titleNotices: [
      "isInMUD",
      "isCoastalArea",
      "isInPublicImprovementDistrict",
      "isInPropaneServiceArea",
    ],
    propertyCondition: [
      "sellerDisclosureReceived",
      "sellerRequiredToDisclose",
      "buyerAcceptsAsIs",
    ],
    brokerDisclosure: [
      "buyerIsThirdPartyAgent",
      "buyerIsRelatedToSeller",
      "buyerHasStakeInProperty",
      "buyerIsBeingCompensated",
    ],
    closing: ["closingDate"],
    possession: ["possessionUponClosing", "possessionAccordingToTempLease"],
    buyerProvisions: [],
    buyerNotices: [
      "deliverToAddress",
      "deliverByPhone",
      "deliverToAgent",
      "deliverByEmailFax1",
      "deliveryByEmailFax2",
    ],
    buyerAttorney: ["hasAttorney"],
    homeownersAssociationAddendum: ["hasHomeownersAssociation"],
    // addendums: [
    //   "thirdPartyFinance",
    //   "sellerFinance",
    //   "loanAssumption",
    //   "sellerTempLease",
    //   "buyerTempLease",
    //   "shortSale",
    //   "hoa",
    //   "gulfIntercoastal",
    //   "leadBasedPaint",
    //   "saleOfOtherProperty",
    //   "mineralRights",
    //   "propaneServiceArea",
    //   "backupContract",
    //   "residentialLease",
    //   "fixtureLease",
    //   "coastalProperty",
    //   "hydrostaticTesting",
    //   "improvementDistrict",
    //   "rightToTerminateByLenderApproval",
    //   "environmentalAssessment",
    // ],
  },
  markedQuestions: {},
  currentSectionId: "",
  skipCompletedQuestions: true,
  etchPackets: Array<EtchPacket>(),
  uploadedDocuments: {},
  contracts: [],
};

const store = createStore({
  state() {
    return {
      userId: null, // Supabase user ID
      accountId: null,
      contractId: null,
      verifiedAddress: {
        streetLine: "",
        secondary: "",
        city: "",
        state: "",
        zipcode: "",
      },
      etchPackets: initialState.etchPackets,
      uploadedDocuments: initialState.uploadedDocuments,
      formData: initialState.formData,
      requiredFields: initialState.requiredFields,
      markedQuestions: initialState.markedQuestions,
      currentSectionId: initialState.currentSectionId,
      skipCompletedQuestions: initialState.skipCompletedQuestions,
      contracts: [],
      agentContactCounts: {}, // Holds agent counts by source
    };
  },
  mutations: {
    setUserId(state, userId) {
      state.userId = userId;
      console.log("User ID updated:", state.userId);
    },
    resetStore(state) {
      state.userId = null;
      state.contractId = null;
      state.formData = initialState.formData;
      state.requiredFields = initialState.requiredFields;
      state.markedQuestions = initialState.markedQuestions;
      state.currentSectionId = initialState.currentSectionId;
      state.skipCompletedQuestions = initialState.skipCompletedQuestions;
      state.uploadedDocuments = initialState.uploadedDocuments;
      state.etchPackets = initialState.etchPackets;
      state.contracts = initialState.contracts;
    },
    toggleMarkedQuestion(state, { sectionId, fieldId }) {
      // Ensure we're working with a reactive object
      if (!state.markedQuestions) {
        state.markedQuestions = {};
      }
      
      if (!state.markedQuestions[sectionId]) {
        // Use object spread to ensure reactivity when adding new section
        state.markedQuestions = {
          ...state.markedQuestions,
          [sectionId]: []
        };
      }

      const currentArray = [...(state.markedQuestions[sectionId] || [])];
      const index = currentArray.indexOf(fieldId);
      
      if (index !== -1) {
        // If the fieldId is already in the array, remove it
        currentArray.splice(index, 1);
      } else {
        // Otherwise, add it to the array
        currentArray.push(fieldId);

        // and set the field in state to null
        state.formData[sectionId] = {
          ...state.formData[sectionId],
          [fieldId]: null,
        };
      }
      
      // Replace the entire markedQuestions object to ensure reactivity
      state.markedQuestions = {
        ...state.markedQuestions,
        [sectionId]: currentArray
      };
      
      console.log("Marked question updated:", JSON.stringify(state.markedQuestions));
      console.log(`Section ${sectionId} marked fields:`, state.markedQuestions[sectionId]);
    },
    setVerifiedAddress(state, address) {
      state.verifiedAddress = address;
      console.log("Verified address updated:", state.verifiedAddress);
    },
    setCurrentSectionId(state, sectionId) {
      console.log("Setting current section id to", sectionId);
      state.currentSectionId = sectionId;
    },
    toggleSkipCompletedQuestions(state) {
      state.skipCompletedQuestions = !state.skipCompletedQuestions;
      console.log(
        "Toggling skip completed questions",
        state.skipCompletedQuestions,
      );
    },
    setAccountId(state, accountId) {
      state.accountId = accountId;
      console.log("Account ID updated:", state.accountId);
    },
    setContractId(state, contractId) {
      state.contractId = contractId;
      console.log("Contract ID updated:", state.contractId);
      localStorage.setItem("contractId", contractId);
    },
    setFormDataFromContract(state, contractInput) {
      const contract = removeTypename(contractInput);
      
      console.log("setFormDataFromContract - input contract:", contract);
      
      // Normalize and transform the contract data using comprehensive mapping utilities
      const normalizedContract = normalizeContractData(contract);
      const transformedData = transformSupabaseDataForVuex(normalizedContract);
      
      console.log("setFormDataFromContract - normalized contract:", normalizedContract);
      console.log("setFormDataFromContract - transformed data:", transformedData);

      // Merge with existing form data, ensuring all sections are properly mapped
      const mergedFormData = {
        ...state.formData,
        ...transformedData,
        // Preserve the contract ID
        ...(contract.id && { id: contract.id })
      };
      
      state.formData = Object.assign({}, mergedFormData);

      // Update markedQuestions - handle both string and object formats
      console.log("setFormDataFromContract - checking for marked questions:", {
        markedQuestions: contract.markedQuestions,
        marked_questions: contract.marked_questions
      });
      
      if (contract.markedQuestions || contract.marked_questions) {
        const markedQuestionsData = contract.markedQuestions || contract.marked_questions;
        console.log("Found marked questions data:", markedQuestionsData);
        if (typeof markedQuestionsData === 'string') {
          state.markedQuestions = JSON.parse(markedQuestionsData);
        } else {
          state.markedQuestions = markedQuestionsData || {};
        }
        console.log("Set state.markedQuestions to:", state.markedQuestions);
      } else {
        console.log("No marked questions found, setting to empty object");
        state.markedQuestions = {};
      }
      
      console.log("Form data updated:", state.formData);
      console.log("Property data in final formData:", state.formData.property);
    },
    setPropertyData(state, propertyData) {
      state.formData.property = propertyData;
      console.log("Property data updated:", state.formData.property);
    },
    setSellerAgentData(state, sellerAgentData) {
      state.formData.listingAgent = sellerAgentData;
      console.log("Seller agent data updated:", state.formData.listingAgent);
    },
    updateFormData(state, payload) {
      if (payload.sectionId) {
        // Update fields with a section
        state.formData[payload.sectionId] = {
          ...state.formData[payload.sectionId],
          [payload.fieldId]: payload.value,
        };

        // Remove the field from markedQuestions if it exists
        if (state.markedQuestions[payload.sectionId]) {
          const index = state.markedQuestions[payload.sectionId].indexOf(
            payload.fieldId,
          );
          if (index !== -1) {
            state.markedQuestions[payload.sectionId].splice(index, 1);
          }
        }
      } else {
        // Update fields without a section
        console.log("updating", payload.fieldId, "with", payload.value);
        state.formData[payload.fieldId] = payload.value;
      }
      console.log("Form data updated:", state.formData);
    },
    updateSectionFormData(state, { sectionId, data }) {
      state.formData[sectionId] = { ...state.formData[sectionId], ...data };

      // Only remove fields from markedQuestions if they have actual values
      // (not empty, null, or undefined) - this preserves "I don't know" marks
      Object.keys(data).forEach((fieldId) => {
        const value = data[fieldId];
        const hasActualValue = value !== null && value !== undefined && value !== '';
        
        if (hasActualValue && state.markedQuestions[sectionId]) {
          const index = state.markedQuestions[sectionId].indexOf(fieldId);
          if (index !== -1) {
            console.log(`Removing ${fieldId} from marked questions - has value: ${value}`);
            state.markedQuestions[sectionId].splice(index, 1);
          }
        }
      });
      
      console.log(
        `Section ${sectionId} form data updated:`,
        state.formData[sectionId],
      );
      console.log(
        `Section ${sectionId} marked questions after update:`,
        state.markedQuestions[sectionId] || []
      );
    },
    setUploadedDocument(
      state,
      { contractId, documentType, document, isUploaded },
    ) {
      if (!state.uploadedDocuments[contractId]) {
        state.uploadedDocuments[contractId] = {};
      }
      state.uploadedDocuments[contractId][documentType] = {
        ...document,
        isUploaded,
      };
    },
    deleteUpload(state, { contractId, documentType }) {
      if (!contractId) {
        contractId = state.contractId; // Use current contractId if not provided
      }
      
      if (state.uploadedDocuments[contractId]) {
        state.uploadedDocuments[contractId][documentType] = {
          isUploaded: false,
          eTag: null,
          key: null,
          lastModified: null,
          size: null,
          name: null,
        };
        console.log(
          `Upload for document type '${documentType}' has been deleted from state for contract ${contractId}.`,
        );
      }
    },
    updateSignerStatus(
      state,
      { etchPacketIndex, signerIndex, status, uploadKeys },
    ) {
      // update the etchPackets state
      const etchPacket = state.etchPackets[etchPacketIndex];
      const signer = etchPacket.documentGroup.signers[signerIndex];
      signer.status = status;
      signer.uploadKeys = uploadKeys;
    },
    updateEtchPacketDocumentGroup(state, { etchPacketIndex, documentGroup }) {
      // Update the document group for an etch packet
      if (state.etchPackets[etchPacketIndex]) {
        state.etchPackets[etchPacketIndex].documentGroup = documentGroup;
      }
    },
    deleteEtchPacket(state, { etchPacketEid }) {
      const index = state.etchPackets.findIndex(
        (packet) => packet.eid === etchPacketEid,
      );
      if (index !== -1) {
        state.etchPackets.splice(index, 1);
        console.log("Etch packet deleted:", etchPacketEid);
      }
    },
    updateEtchPacket(state, { etchPacket }) {
      const existingEtchPacketIndex = state.etchPackets.findIndex(
        (packet) => packet.eid === etchPacket.eid,
      );
      if (existingEtchPacketIndex !== -1) {
        // If the etchPacket already exists, update it
        state.etchPackets = [
          ...state.etchPackets.slice(0, existingEtchPacketIndex),
          etchPacket,
          ...state.etchPackets.slice(existingEtchPacketIndex + 1),
        ];
      } else {
        // If the etchPacket doesn't exist, add it to the collection
        state.etchPackets = [...state.etchPackets, etchPacket];
      }
      console.log("Etch packets updated:", state.etchPackets);
    },
    setEtchPackets(state, etchPackets) {
      state.etchPackets = etchPackets?.items;
    },
    resetUploadedDocs(state) {
      const contractId = state.contractId;
      if (!state.uploadedDocuments[contractId]) {
        state.uploadedDocuments[contractId] = {};
      }
      state.uploadedDocuments[contractId] = {
        preapproval: {
          isUploaded: false,
          eTag: null,
          key: null,
          lastModified: null,
          size: null,
          name: null,
        },
        earnest_check: {
          isUploaded: false,
          eTag: null,
          key: null,
          lastModified: null,
          size: null,
          name: null,
        },
        option_check: {
          isUploaded: false,
          eTag: null,
          key: null,
          lastModified: null,
          size: null,
          name: null,
        },
      };
    },
    setContracts(state, contracts) {
      state.contracts = contracts;
    },
    removeContract(state, contractId) {
      state.contracts = state.contracts.filter(
        (contract) => contract.id !== contractId,
      );
    },
    setAgentContactCounts(state, counts) {
      state.agentContactCounts = counts;
    },
  },
  getters: {
    // Returns the complete uploadedDocuments object
    getUploadedDocuments: (state) => state.uploadedDocuments,
    // Returns the document for a specific documentType, e.g., "preapproval", "earnest_check"
    getUploadedDocument: (state) => (documentType) => {
      const contractId = state.contractId;
      return (
        state.uploadedDocuments[contractId]?.[documentType] || {
          isUploaded: false,
          eTag: null,
          key: null,
          lastModified: null,
          size: null,
          name: null,
        }
      );
    },
    getSectionProgress: (state) => (sectionId) => {
      const section = state.formData[sectionId];
      let totalQuestions = 0;
      let completedQuestions = 0;

      if (section) {
        const sectionQuestions = QuestionConfig.filter(
          (question) => question.sectionId === sectionId,
        );

        sectionQuestions.forEach((question) => {
          const fieldId = question.fieldId;

          // Check if question should be counted based on dependencies
          let shouldCount = true;

          if (question.dependsOnAll?.length) {
            shouldCount = question.dependsOnAll.every((dependency) => {
              const { fieldId, value } = dependency;
              return state.formData[sectionId]?.[fieldId] === value;
            });
          }

          if (shouldCount && question.dependsOnAny?.length) {
            shouldCount = question.dependsOnAny.some((dependency) => {
              const { fieldId, value } = dependency;
              return state.formData[sectionId]?.[fieldId] === value;
            });
          }

          // Only check if required if dependencies are satisfied
          if (shouldCount) {
            const isRequired = isQuestionRequired(
              question,
              state.requiredFields as any,
            );

            if (isRequired) {
              totalQuestions++;

              if (
                section[fieldId] !== null &&
                section[fieldId] !== undefined &&
                section[fieldId] !== ""
              ) {
                completedQuestions++;
              }
            }
          }
        });
      }

      return {
        totalQuestions,
        completedQuestions,
      };
    },
    isSectionComplete: (state, getters) => (sectionId) => {
      const section = state.formData[sectionId];
      if (section) {
        const { totalQuestions, completedQuestions } =
          getters.getSectionProgress(sectionId);
        return totalQuestions === completedQuestions;
      }
      return false;
    },
    getFirstIncompleteSection: (state, getters) => {
      const sectionIds = Object.keys(state.formData);
      const incompleteSection = sectionIds.find(
        (sectionId) => !getters.isSectionComplete(sectionId),
      );
      return incompleteSection || "completion";
    },
    getFirstIncompleteQuestion: (state, getters) => {
      const sectionId = getters.getFirstIncompleteSection;
      if (sectionId === "completion") {
        return null;
      }
      const section = state.formData[sectionId];
      const questions = getQuestionsForSection(sectionId).flat();

      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        const isRequired = isQuestionRequired(
          question,
          state.requiredFields as any,
        );
        if (
          isRequired &&
          (!section[question.fieldId] || section[question.fieldId] === "")
        ) {
          return {
            sectionId,
            questionIndex: i,
          };
        }
      }
      return null;
    },
    getFirstIncompleteQuestionForSection: (state, getters) => (sectionId) => {
      const section = state.formData[sectionId];
      const questions = getQuestionsForSection(sectionId).flat();

      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        const { fieldId } = question;
        const isRequired = isQuestionRequired(
          question,
          state.requiredFields as any,
        );
        if (isRequired && (!section[fieldId] || section[fieldId] === "")) {
          return i;
        }
      }
      return null;
    },
    isContractComplete: (state, getters) => {
      const isComplete = Object.keys(state.formData).every((sectionId) => {
        const isSectionComplete = getters.isSectionComplete(sectionId);
        // console.log("Section", sectionId, "is complete?", isSectionComplete);
        return isSectionComplete;
      });
      // console.log("Contract is complete?", isComplete);
      return isComplete;
    },
    allDocsAreUploaded: (state) => {
      const contractId = state.contractId;
      if (!state.uploadedDocuments[contractId]) return false;

      const requiredDocs = ["preapproval", "earnest_check", "option_check"];
      return requiredDocs.every(
        (docType) =>
          state.uploadedDocuments[contractId][docType]?.isUploaded === true,
      );
    },
    allSignersCompleted: (state) => {
      const sortedEtchPackets = [...state.etchPackets].sort((a, b) => {
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });

      if (sortedEtchPackets.length === 0) {
        return false;
      }

      const latestPacket = sortedEtchPackets[0];
      
      // Check if documentGroup exists and has signers
      if (!latestPacket.documentGroup || !latestPacket.documentGroup.signers) {
        return false;
      }

      return latestPacket.documentGroup.signers.every(
        (signer) => signer.status === "completed",
      );
    },
    getAgentContactCounts: (state) => state.agentContactCounts,
  },
  actions: {
    selectContract({ commit }, contract) {
      commit("setContractId", contract.id);
      console.log("selectContract action - raw contract:", contract);
      
      // Use the comprehensive mapping utilities to transform the contract
      const normalizedContract = normalizeContractData(contract);
      
      console.log("selectContract action - normalized contract:", normalizedContract);
      
      commit("setFormDataFromContract", normalizedContract);
      commit("resetUploadedDocs");
      
      // Populate uploaded documents from contract_documents
      if (contract.contract_documents && Array.isArray(contract.contract_documents)) {
        console.log("Loading contract documents:", contract.contract_documents);
        contract.contract_documents.forEach(doc => {
          // Only load current version documents
          if (!doc.is_current_version) return;
          
          // Use document_type directly without mapping since we fixed DocumentChecklist
          const documentType = doc.document_type;
          
          commit("setUploadedDocument", {
            contractId: contract.id,
            documentType: documentType,
            document: {
              id: doc.id,
              name: doc.file_name,
              key: doc.storage_path,
              filetype: doc.file_type ? doc.file_type.split('/').pop() : 'unknown',
              size: doc.file_size,
              date: new Date(doc.uploaded_at).toLocaleString([], {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              }),
              documentType: documentType
            },
            isUploaded: true
          });
        });
      }
    },
    async deleteUpload({ commit, state }, { documentType, uploadKey }) {
      try {
        // You might include any additional backend deletion logic here.
        commit("deleteUpload", { 
          contractId: state.contractId, 
          documentType 
        });
      } catch (error) {
        console.error("Error deleting upload:", error);
      }
    },
    async uploadDocument(
      { commit, state },
      { documentType, document, isUploaded },
    ) {
      const contractId = state.contractId;
      if (!contractId) {
        console.error("No contract ID found when uploading document");
        return;
      }

      // Check if the document is already populated in the store
      if (state.uploadedDocuments[contractId]?.[documentType] === document) {
        console.log(
          `Document status for ${documentType} is already up to date.`,
        );
        return;
      }

      // If the document status is not populated or different, update it in the store
      commit("setUploadedDocument", {
        contractId,
        documentType,
        document,
        isUploaded,
      });
    },
    async fetchAgentContactCounts({ commit }, { sources }) {
      const { AgentAPI } = await import("@/services/api.js");
      const counts = {};
      
      for (const src of sources) {
        try {
          // Use the agent list API with source filter
          const agents = await AgentAPI.list({ source: src });
          counts[src] = agents.length;
        } catch (e) {
          console.error(`Error counting agents for source ${src}:`, e);
          counts[src] = 0;
        }
      }
      commit("setAgentContactCounts", counts);
    },
  },
  plugins: [
    createPersistedState({
      paths: ["formData", "verifiedAddress", "accountId", "agentContactCounts"],
      storage: window.sessionStorage,
      reducer: (state) => {
        return {
          formData: state.formData,
          verifiedAddress: state.verifiedAddress,
          accountId: state.accountId,
          contractId: state.contractId,
          requiredFields: state.requiredFields,
          markedQuestions: state.markedQuestions,
          currentSectionId: state.currentSectionId,
          skipCompletedQuestions: state.skipCompletedQuestions,
          uploadedDocuments: state.uploadedDocuments,
          etchPackets: state.etchPackets,
          contracts: state.contracts,
          agentContactCounts: state.agentContactCounts,
        };
      },
    }),
  ],
});

export default store;
