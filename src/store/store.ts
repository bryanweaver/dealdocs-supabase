import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import {
  getQuestionsForSection,
  QuestionConfig,
} from "@/config/TX/questionConfig";
// EtchPacket type is now handled by Supabase types
// import { EtchPacket } from "@/API"; // Deprecated
import { isQuestionRequired } from "@/utils/questionUtils";
import { a } from "vitest/dist/suite-ghspeorC";

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
      if (!state.markedQuestions[sectionId]) {
        // If the sectionId doesn't exist in markedQuestions, create a new array for it
        state.markedQuestions[sectionId] = [];
      }

      const index = state.markedQuestions[sectionId].indexOf(fieldId);
      if (index !== -1) {
        // If the fieldId is already in the array, remove it
        state.markedQuestions[sectionId].splice(index, 1);
      } else {
        // Otherwise, add it to the array
        state.markedQuestions[sectionId].push(fieldId);

        // and set the field in state to null
        state.formData[sectionId] = {
          ...state.formData[sectionId],
          [fieldId]: null,
        };
      }
      console.log("Marked question updated:", state.markedQuestions);
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

      const mergedFormData = {
        ...state.formData,
        ...(contract.id && { id: contract.id }),
        ...(contract.buyers && { buyers: contract.buyers }),
        ...(contract.sellers && { sellers: contract.sellers }),
        ...(contract.property && { property: contract.property }),
        ...(contract.finance && { finance: contract.finance }),
        ...(contract.leases && { leases: contract.leases }),
        ...(contract.title && { title: contract.title }),
        ...(contract.survey && { survey: contract.survey }),
        ...(contract.titleObjections && {
          titleObjections: contract.titleObjections,
        }),
        ...(contract.titleNotices && { titleNotices: contract.titleNotices }),
        ...(contract.propertyCondition && {
          propertyCondition: contract.propertyCondition,
        }),
        ...(contract.brokerDisclosure && {
          brokerDisclosure: contract.brokerDisclosure,
        }),
        ...(contract.closing && { closing: contract.closing }),
        ...(contract.possession && { possession: contract.possession }),
        ...(contract.buyerProvisions && {
          buyerProvisions: contract.buyerProvisions,
        }),
        ...(contract.buyerNotices && { buyerNotices: contract.buyerNotices }),
        ...(contract.buyerAttorney && {
          buyerAttorney: contract.buyerAttorney,
        }),
        ...(contract.listingAgent && { listingAgent: contract.listingAgent }),
        ...(contract.homeownersAssociationAddendum && {
          homeownersAssociationAddendum: contract.homeownersAssociationAddendum,
        }),
      };
      state.formData = Object.assign({}, mergedFormData);

      // Update markedQuestions
      if (contract.markedQuestions) {
        state.markedQuestions = JSON.parse(contract.markedQuestions);
      } else {
        state.markedQuestions = {};
      }
      console.log("Form data updated:", state.formData);
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

      // Remove the field from markedQuestions if it exists
      Object.keys(data).forEach((fieldId) => {
        if (state.markedQuestions[sectionId]) {
          const index = state.markedQuestions[sectionId].indexOf(fieldId);
          if (index !== -1) {
            state.markedQuestions[sectionId].splice(index, 1);
          }
        }
      });
      console.log(
        `Section ${sectionId} form data updated:`,
        state.formData[sectionId],
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
    deleteUpload(state, documentType: string) {
      state.uploadedDocuments[documentType] = {
        isUploaded: false,
        eTag: null,
        key: null,
        lastModified: null,
        size: null,
        name: null,
      };
      console.log(
        `Upload for document type '${documentType}' has been deleted from state.`,
      );
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
        earnest: {
          isUploaded: false,
          eTag: null,
          key: null,
          lastModified: null,
          size: null,
          name: null,
        },
        optionfee: {
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
    // Returns the document for a specific documentType, e.g., "preapproval", "earnest"
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

      const requiredDocs = ["preapproval", "earnest", "optionfee"];
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

      return (
        sortedEtchPackets.length > 0 &&
        sortedEtchPackets[0].documentGroup.signers.every(
          (signer) => signer.status === "completed",
        )
      );
    },
    getAgentContactCounts: (state) => state.agentContactCounts,
  },
  actions: {
    selectContract({ commit }, contract) {
      commit("setContractId", contract.id);
      commit("setFormDataFromContract", contract);
      commit("resetUploadedDocs");
    },
    async deleteUpload({ commit }, { documentType }) {
      try {
        // You might include any additional backend deletion logic here.
        commit("deleteUpload", documentType);
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
