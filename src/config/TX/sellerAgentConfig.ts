export const SellerAgentConfig = [
  {
    section: "Seller Agent",
    sectionId: "listingAgent",
    intro: "Let's see what know about the seller's agent.",
  },
  {
    section: "Seller Agent",
    sectionId: "listingAgent",
    question: "Do you know anything about the listing agent or their firm?",
    type: "boolean",
    fieldId: "hasListingAgentInfo",
    description: "Just seeng whether you know about the sellers agent",
  },
  {
    section: "Seller Agent",
    sectionId: "listingAgent",
    question: "What is the selling agent's firm name?",
    type: "text",
    fieldId: "firmName",
    description:
      "The name of the selling agent's firm is important information that must be included in the TREC Form 2017 for residential resale in Texas.",
    dependsOnAll: [
      {
        fieldId: "hasListingAgentInfo",
        value: true,
      },
    ],
  },
  {
    section: "Seller Agent",
    sectionId: "listingAgent",
    question: "What is the selling agent's firm license number?",
    type: "text",
    fieldId: "firmLicenseNumber",
    description:
      "The license number of the selling agent's firm is required information that must be disclosed in the TREC Form 2017 for residential resale in Texas.",
    dependsOnAll: [
      {
        fieldId: "hasListingAgentInfo",
        value: true,
      },
    ],
  },
  {
    section: "Seller Agent",
    sectionId: "listingAgent",
    question: "What is the selling agent's firm street address?",
    type: "text",
    fieldId: "firmStreetAddress",
    description:
      "The street address of the selling agent's firm must be provided in the TREC Form 2017 for residential resale in Texas.",
    dependsOnAll: [
      {
        fieldId: "hasListingAgentInfo",
        value: true,
      },
    ],
  },
  {
    section: "Seller Agent",
    sectionId: "listingAgent",
    question: "What is the selling agent's firm city?",
    type: "text",
    fieldId: "firmCity",
    description:
      "The city where the selling agent's firm is located is necessary information for the TREC Form 2017 for residential resale in Texas.",
    dependsOnAll: [
      {
        fieldId: "hasListingAgentInfo",
        value: true,
      },
    ],
  },
  {
    section: "Seller Agent",
    sectionId: "listingAgent",
    question: "What is the selling agent's firm state?",
    type: "text",
    fieldId: "firmState",
    description:
      "The state where the selling agent's firm is located must be disclosed in the TREC Form 2017 for residential resale in Texas.",
    dependsOnAll: [
      {
        fieldId: "hasListingAgentInfo",
        value: true,
      },
    ],
  },
  {
    section: "Seller Agent",
    sectionId: "listingAgent",
    question: "What is the selling agent's firm postal code?",
    type: "text",
    fieldId: "firmPostalCode",
    description:
      "The postal code of the selling agent's firm is required information for the TREC Form 2017 for residential resale in Texas.",
    dependsOnAll: [
      {
        fieldId: "hasListingAgentInfo",
        value: true,
      },
    ],
  },
  {
    section: "Seller Agent",
    sectionId: "listingAgent",
    question: "What is the selling agent's firm phone number?",
    type: "phone",
    fieldId: "firmPhone",
    description:
      "The phone number of the selling agent's firm must be provided in the TREC Form 2017 for residential resale in Texas.",
    dependsOnAll: [
      {
        fieldId: "hasListingAgentInfo",
        value: true,
      },
    ],
  },
  {
    section: "Seller Agent",
    sectionId: "listingAgent",
    question: "What is the listing associate's name?",
    type: "text",
    fieldId: "listingAssociateName",
    description:
      "The name of the listing associate is important information that must be disclosed in the TREC Form 2017 for residential resale in Texas.",
    dependsOnAll: [
      {
        fieldId: "hasListingAgentInfo",
        value: true,
      },
    ],
  },
  {
    section: "Seller Agent",
    sectionId: "listingAgent",
    question: "What is the listing associate's license number?",
    type: "text",
    fieldId: "listingAssociateLicenseNumber",
    description:
      "The license number of the listing associate must be provided in the TREC Form 2017 for residential resale in Texas.",
    dependsOnAll: [
      {
        fieldId: "hasListingAgentInfo",
        value: true,
      },
    ],
  },
  {
    section: "Seller Agent",
    sectionId: "listingAgent",
    question: "What is the listing associate's team name?",
    type: "text",
    fieldId: "listingAssociateTeamName",
    description:
      "If applicable, the team name of the listing associate should be disclosed in the TREC Form 2017 for residential resale in Texas.",
    dependsOnAll: [
      {
        fieldId: "hasListingAgentInfo",
        value: true,
      },
    ],
  },
  {
    section: "Seller Agent",
    sectionId: "listingAgent",
    question: "What is the listing associate's email?",
    type: "text",
    fieldId: "listingAssociateEmail",
    description:
      "The email address of the listing associate is necessary contact information that must be included in the TREC Form 2017 for residential resale in Texas.",
    dependsOnAll: [
      {
        fieldId: "hasListingAgentInfo",
        value: true,
      },
    ],
  },
  {
    section: "Seller Agent",
    sectionId: "listingAgent",
    question: "What is the listing associate's phone number?",
    type: "phone",
    fieldId: "listingAssociatePhone",
    description:
      "The phone number of the listing associate must be provided as contact information in the TREC Form 2017 for residential resale in Texas.",
    dependsOnAll: [
      {
        fieldId: "hasListingAgentInfo",
        value: true,
      },
    ],
  },
  {
    section: "Seller Agent",
    sectionId: "listingAgent",
    question: "What is the listing associate's supervisor name?",
    type: "text",
    fieldId: "listingAssociateSupervisorName",
    description:
      "The name of the listing associate's supervisor should be disclosed, if applicable, in the TREC Form 2017 for residential resale in Texas.",
    dependsOnAll: [
      {
        fieldId: "hasListingAgentInfo",
        value: true,
      },
    ],
  },
  {
    section: "Seller Agent",
    sectionId: "listingAgent",
    question: "What is the listing associate supervisor's license number?",
    type: "text",
    fieldId: "listingAssociateSupervisorLicenseNumber",
    description:
      "If the listing associate has a supervisor, their license number must be provided in the TREC Form 2017 for residential resale in Texas.",
    dependsOnAll: [
      {
        fieldId: "hasListingAgentInfo",
        value: true,
      },
    ],
  },
  // {
  //   section: "Seller Agent",
  //   sectionId: "listingAgent",
  //   question: "What is the selling associate's name?",
  //   type: "text",
  //   fieldId: "sellingAssociateName",
  //   description:
  //     "The name of the selling associate must be disclosed in the TREC Form 2017 for residential resale in Texas.",
  //   dependsOnAll: [
  //     {
  //       fieldId: "hasListingAgentInfo",
  //       value: true,
  //     },
  //   ],
  // },
  // {
  //   section: "Seller Agent",
  //   sectionId: "listingAgent",
  //   question: "What is the selling associate's license number?",
  //   type: "text",
  //   fieldId: "sellingAssociateLicenseNumber",
  //   description:
  //     "The license number of the selling associate is required information that must be provided in the TREC Form 2017 for residential resale in Texas.",
  //   dependsOnAll: [
  //     {
  //       fieldId: "hasListingAgentInfo",
  //       value: true,
  //     },
  //   ],
  // },
  // {
  //   section: "Seller Agent",
  //   sectionId: "listingAgent",
  //   question: "What is the selling associate's team name?",
  //   type: "text",
  //   fieldId: "sellingAssociateTeamName",
  //   description:
  //     "If the selling associate is part of a team, the team name should be disclosed in the TREC Form 2017 for residential resale in Texas.",
  //   dependsOnAll: [
  //     {
  //       fieldId: "hasListingAgentInfo",
  //       value: true,
  //     },
  //   ],
  // },
  // {
  //   section: "Seller Agent",
  //   sectionId: "listingAgent",
  //   question: "What is the selling associate's email?",
  //   type: "text",
  //   fieldId: "sellingAssociateEmail",
  //   description:
  //     "The email address of the selling associate must be included as contact information in the TREC Form 2017 for residential resale in Texas.",
  //   dependsOnAll: [
  //     {
  //       fieldId: "hasListingAgentInfo",
  //       value: true,
  //     },
  //   ],
  // },
  // {
  //   section: "Seller Agent",
  //   sectionId: "listingAgent",
  //   question: "What is the selling associate's phone number?",
  //   type: "phone",
  //   fieldId: "sellingAssociatePhone",
  //   description:
  //     "The phone number of the selling associate is necessary contact information that must be provided in the TREC Form 2017 for residential resale in Texas.",
  //   dependsOnAll: [
  //     {
  //       fieldId: "hasListingAgentInfo",
  //       value: true,
  //     },
  //   ],
  // },
  // {
  //   section: "Seller Agent",
  //   sectionId: "listingAgent",
  //   question: "What is the selling associate supervisor's name?",
  //   type: "text",
  //   fieldId: "sellingAssociateSupervisorName",
  //   description:
  //     "If the selling associate has a supervisor, their name should be disclosed in the TREC Form 2017 for residential resale in Texas.",
  //   dependsOnAll: [
  //     {
  //       fieldId: "hasListingAgentInfo",
  //       value: true,
  //     },
  //   ],
  // },
  // {
  //   section: "Seller Agent",
  //   sectionId: "listingAgent",
  //   question: "What is the selling associate supervisor's license number?",
  //   type: "text",
  //   fieldId: "sellingAssociateSupervisorLicenseNumber",
  //   description:
  //     "The license number of the selling associate's supervisor must be provided, if applicable, in the TREC Form 2017 for residential resale in Texas.",
  //   dependsOnAll: [
  //     {
  //       fieldId: "hasListingAgentInfo",
  //       value: true,
  //     },
  //   ],
  // },
  // {
  //   section: "Seller Agent",
  //   sectionId: "listingAgent",
  //   question: "What is the selling associate's street address?",
  //   type: "text",
  //   fieldId: "sellingAssociateStreetAddress",
  //   description:
  //     "The street address of the selling associate is required contact information that must be disclosed in the TREC Form 2017 for residential resale in Texas.",
  //   dependsOnAll: [
  //     {
  //       fieldId: "hasListingAgentInfo",
  //       value: true,
  //     },
  //   ],
  // },
  // {
  //   section: "Seller Agent",
  //   sectionId: "listingAgent",
  //   question: "What is the selling associate's city?",
  //   type: "text",
  //   fieldId: "sellingAssociateCity",
  //   description:
  //     "The city where the selling associate is located must be provided as contact information in the TREC Form 2017 for residential resale in Texas.",
  //   dependsOnAll: [
  //     {
  //       fieldId: "hasListingAgentInfo",
  //       value: true,
  //     },
  //   ],
  // },
  // {
  //   section: "Seller Agent",
  //   sectionId: "listingAgent",
  //   question: "What is the selling associate's state?",
  //   type: "text",
  //   fieldId: "sellingAssociateState",
  //   description:
  //     "The state where the selling associate is located is necessary contact information for the TREC Form 2017 for residential resale in Texas.",
  //   dependsOnAll: [
  //     {
  //       fieldId: "hasListingAgentInfo",
  //       value: true,
  //     },
  //   ],
  // },
  // {
  //   section: "Seller Agent",
  //   sectionId: "listingAgent",
  //   question: "What is the selling associate's postal code?",
  //   type: "text",
  //   fieldId: "sellingAssociatePostalCode",
  //   description:
  //     "The postal code of the selling associate must be disclosed as contact information in the TREC Form 2017 for residential resale in Texas.",
  //   dependsOnAll: [
  //     {
  //       fieldId: "hasListingAgentInfo",
  //       value: true,
  //     },
  //   ],
  // },
];
