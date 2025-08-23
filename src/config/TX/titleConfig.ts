import { PartyType } from "../../API";

export const TitleConfig = [
  {
    section: "Title",
    sectionId: "title",
    intro: "Alright, let's talk title companies",
    description:
      "This section gathers information about the title company that will be handling the closing of the real estate transaction. The title company ensures that the seller has clear title to the property and can legally transfer ownership to the buyer.",
  },
  {
    section: "Title",
    sectionId: "title",
    question: "Do you have a title company?",
    type: "boolean",
    fieldId: "hasTitleCompany",
    description:
      "This question determines if the buyer has already selected a title company to handle the closing of the transaction. If not, the buyer may need to find a reputable title company to work with.",
  },
  {
    section: "Title",
    sectionId: "title",
    question:
      "Would you like a referral to trusted title companies in your area?",
    description:
      "We can connect you with experienced title companies that have a strong track record of smooth closings.",
    type: "boolean",
    fieldId: "wantsTitleReferral",
    dependsOnAll: [
      {
        fieldId: "hasTitleCompany",
        value: false,
      },
    ],
    onTrueAction: "navigateToComponent",
    navigationTarget: "TitleReferralComponent",
    // navigationParams: {
    //   location: "fieldValue:propertyCity",
    //   zipCode: "fieldValue:propertyZip"
    // }
  },
  {
    section: "Title",
    sectionId: "title",
    question: "What is the name of the title company?",
    type: "text",
    fieldId: "titleCompanyName",
    dependsOnAll: [
      {
        fieldId: "hasTitleCompany",
        value: true,
      },
    ],
    description:
      "The name of the title company is important for identifying which company will be responsible for handling the closing of the transaction and ensuring that the title is clear for transfer.",
  },
  {
    section: "Title",
    sectionId: "title",
    question: "What is the escrow agent's name?",
    type: "text",
    fieldId: "escrowAgentName",
    dependsOnAll: [
      {
        fieldId: "hasTitleCompany",
        value: true,
      },
    ],
    description:
      "The escrow agent is the individual at the title company who is responsible for managing the funds and documents related to the closing of the transaction. Their name is typically listed on the closing documents.",
  },
  {
    section: "Title",
    sectionId: "title",
    question: "What is the title company's street address?",
    type: "text",
    fieldId: "titleCompanyStreetAddress",
    dependsOnAll: [
      {
        fieldId: "hasTitleCompany",
        value: true,
      },
    ],
    description:
      "The street address of the title company is necessary for knowing where to send documents and where the closing will take place.",
  },
  {
    section: "Title",
    sectionId: "title",
    question: "What is the title company's city?",
    type: "text",
    fieldId: "titleCompanyCity",
    dependsOnAll: [
      {
        fieldId: "hasTitleCompany",
        value: true,
      },
    ],
    description:
      "The city where the title company is located is part of their contact information.",
  },
  {
    section: "Title",
    sectionId: "title",
    question: "What is the title company's state?",
    type: "text",
    fieldId: "titleCompanyState",
    dependsOnAll: [
      {
        fieldId: "hasTitleCompany",
        value: true,
      },
    ],
    description:
      "The state where the title company is located is part of their contact information.",
  },
  {
    section: "Title",
    sectionId: "title",
    question: "What is the title company's postal code?",
    type: "text",
    fieldId: "titleCompanyPostalCode",
    dependsOnAll: [
      {
        fieldId: "hasTitleCompany",
        value: true,
      },
    ],
    description:
      "The postal code where the title company is located is part of their contact information.",
  },
  {
    section: "Title",
    sectionId: "title",
    question: "Which party will be supplying the title policy?",
    type: "select",
    fieldId: "titleFurnishingParty",
    options: [
      {
        label: "Buyer",
        value: PartyType.BUYER,
      },
      {
        label: "Seller",
        value: PartyType.SELLER,
      },
    ],
    dependsOnAll: [
      {
        fieldId: "hasTitleCompany",
        value: true,
      },
    ],
    description:
      "The title policy is a form of insurance that protects the buyer and lender against any issues with the title. This question determines whether the buyer or seller will be responsible for providing and paying for the title policy.",
  },
  {
    section: "Title",
    sectionId: "title",
    question: "Will there be an option fee?",
    type: "boolean",
    fieldId: "hasOptionFee",
    dependsOnAll: [
      {
        fieldId: "hasTitleCompany",
        value: true,
      },
    ],
    description:
      "An option fee is a non-refundable fee paid by the buyer to the seller for the unrestricted right to terminate the contract by a certain date. This question determines if an option fee will be part of the transaction.",
  },
  {
    section: "Title",
    sectionId: "title",
    question: "How much will the option fee be?",
    type: "currency",
    fieldId: "optionFee",
    dependsOnAll: [
      {
        fieldId: "hasOptionFee",
        value: true,
      },
      {
        fieldId: "hasTitleCompany",
        value: true,
      },
    ],
    description:
      "If there is an option fee, this question determines the amount of the fee that the buyer will pay to the seller.",
  },
  {
    section: "Title",
    sectionId: "title",
    question: "How many days will be allowed for the option period?",
    type: "number",
    fieldId: "optionPeriodDaysToTerminate",
    dependsOnAll: [
      {
        fieldId: "hasOptionFee",
        value: true,
      },
      {
        fieldId: "hasTitleCompany",
        value: true,
      },
    ],
    description:
      "The option period is the number of days during which the buyer can terminate the contract for any reason and receive a refund of their earnest money. This question determines the length of the option period.",
  },
  {
    section: "Title",
    sectionId: "title",
    question: "How much earnest money will be supplied?",
    type: "currency",
    fieldId: "earnestMoney",
    dependsOnAll: [
      {
        fieldId: "hasTitleCompany",
        value: true,
      },
    ],
    description:
      "Earnest money is a deposit made by the buyer to show their good faith in the transaction. This question determines the amount of the earnest money deposit.",
  },
  {
    section: "Title",
    sectionId: "title",
    question: "Will there by any additional earnest money?",
    type: "boolean",
    fieldId: "hasAdditionalEarnestMoney",
    dependsOnAll: [
      {
        fieldId: "hasTitleCompany",
        value: true,
      },
    ],
    description:
      "In some cases, the buyer may agree to provide additional earnest money after the initial deposit. This question determines if there will be any additional earnest money in the transaction.",
  },
  {
    section: "Title",
    sectionId: "title",
    question: "How much additional earnest money will be supplied?",
    type: "currency",
    fieldId: "additionalEarnestMoney",
    dependsOnAll: [
      {
        fieldId: "hasAdditionalEarnestMoney",
        value: true,
      },
      {
        fieldId: "hasTitleCompany",
        value: true,
      },
    ],
    description:
      "If there is additional earnest money, this question determines the amount of the additional deposit.",
  },
  {
    section: "Title",
    sectionId: "title",
    question:
      "How many days should be allowed to deliver the additional earnest money?",
    type: "number",
    fieldId: "additionalEarnestMoneyDaysToDeliver",
    dependsOnAll: [
      {
        fieldId: "hasAdditionalEarnestMoney",
        value: true,
      },
      {
        fieldId: "hasTitleCompany",
        value: true,
      },
    ],
    description:
      "If there is additional earnest money, this question determines the number of days the buyer has to deliver the additional deposit to the title company.",
  },
  {
    section: "Title",
    sectionId: "title",
    question: "Will the standard policy exceptions be amended?",
    type: "boolean",
    fieldId: "standardExceptionsToBeAmended",
    dependsOnAll: [
      {
        fieldId: "hasTitleCompany",
        value: true,
      },
    ],
    description:
      "Standard exceptions are items that are excluded from coverage under a standard title policy. This question determines if the buyer wants these standard exceptions to be amended, which would provide additional coverage.",
  },
  {
    section: "Title",
    sectionId: "title",
    question: "At whose expense will the policy exceptions be amended?",
    type: "select",
    fieldId: "standardExceptionsToBeAmendedBy",
    options: [
      {
        label: "Buyer",
        value: PartyType.BUYER,
      },
      {
        label: "Seller",
        value: PartyType.SELLER,
      },
    ],
    dependsOnAll: [
      {
        fieldId: "standardExceptionsToBeAmended",
        value: true,
      },
      {
        fieldId: "hasTitleCompany",
        value: true,
      },
    ],
    description:
      "If the standard exceptions are being amended, this question determines whether the buyer or seller will pay for the additional coverage.",
  },
];
