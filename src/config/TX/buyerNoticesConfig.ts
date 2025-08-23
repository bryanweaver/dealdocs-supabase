export const BuyerNoticesConfig = [
  {
    section: "Notices",
    sectionId: "buyerNotices",
    question: "Would you like notices to be mailed to your address?",
    description:
      "This question determines if the buyer would like to receive notices related to the contract and transaction by mail at their address.",
    type: "boolean",
    fieldId: "deliverToAddress",
  },
  {
    section: "Notices",
    sectionId: "buyerNotices",
    question: "What is your street address?",
    description:
      "This question is necessary to obtain the buyer's mailing address for sending notices if they have chosen to receive them by mail.",
    type: "text",
    fieldId: "streetAddress",
    dependsOnAll: [
      {
        fieldId: "deliverToAddress",
        value: true,
      },
    ],
  },
  {
    section: "Notices",
    sectionId: "buyerNotices",
    question: "What is your city?",
    description:
      "This question is part of collecting the buyer's mailing address for sending notices if they have chosen to receive them by mail.",
    type: "text",
    fieldId: "city",
    dependsOnAll: [
      {
        fieldId: "deliverToAddress",
        value: true,
      },
    ],
  },
  {
    section: "Notices",
    sectionId: "buyerNotices",
    question: "What is your state?",
    description:
      "This question is part of collecting the buyer's mailing address for sending notices if they have chosen to receive them by mail.",
    type: "text",
    fieldId: "state",
    dependsOnAll: [
      {
        fieldId: "deliverToAddress",
        value: true,
      },
    ],
  },
  {
    section: "Notices",
    sectionId: "buyerNotices",
    question: "What is your postal code?",
    description:
      "This question is part of collecting the buyer's mailing address for sending notices if they have chosen to receive them by mail.",
    type: "text",
    fieldId: "postalCode",
    dependsOnAll: [
      {
        fieldId: "deliverToAddress",
        value: true,
      },
    ],
  },
  {
    section: "Notices",
    sectionId: "buyerNotices",
    question: "Would you like notices delivered by phone?",
    description:
      "This question determines if the buyer would like to receive notices related to the contract and transaction by phone.",
    type: "boolean",
    fieldId: "deliverByPhone",
  },
  {
    section: "Notices",
    sectionId: "buyerNotices",
    question: "What is your phone number?",
    description:
      "This question is necessary to obtain the buyer's phone number for delivering notices if they have chosen to receive them by phone.",
    type: "phone",
    fieldId: "phone",
    dependsOnAll: [
      {
        fieldId: "deliverByPhone",
        value: true,
      },
    ],
  },
  {
    section: "Notices",
    sectionId: "buyerNotices",
    question: "Would you like notices delivered by email or fax?",
    description:
      "This question determines if the buyer would like to receive notices related to the contract and transaction by email or fax.",
    type: "boolean",
    fieldId: "deliverByEmailFax1",
  },
  {
    section: "Notices",
    sectionId: "buyerNotices",
    question: "What is your email or fax number?",
    description:
      "This question is necessary to obtain the buyer's email or fax number for delivering notices if they have chosen to receive them by email or fax.",
    type: "text",
    fieldId: "emailFax1",
    dependsOnAll: [
      {
        fieldId: "deliverByEmailFax1",
        value: true,
      },
    ],
  },
  {
    section: "Notices",
    sectionId: "buyerNotices",
    question:
      "Would you like notices delivered to an additional email or fax number?",
    description:
      "This question determines if the buyer would like to provide an additional email or fax number for receiving notices related to the contract and transaction.",
    type: "boolean",
    fieldId: "deliveryByEmailFax2",
  },
  {
    section: "Notices",
    sectionId: "buyerNotices",
    question: "What is the additional email or fax number?",
    description:
      "This question is necessary to obtain the buyer's additional email or fax number for delivering notices if they have chosen to provide one.",
    type: "text",
    fieldId: "emailFax2",
    dependsOnAll: [
      {
        fieldId: "deliveryByEmailFax2",
        value: true,
      },
    ],
  },
  {
    section: "Notices",
    sectionId: "buyerNotices",
    question: "Would you like notices delivered to your agent?",
    description:
      "This question determines if the buyer would like notices related to the contract and transaction to be delivered to their real estate agent.",
    type: "boolean",
    fieldId: "deliverToAgent",
  },
  {
    section: "Notices",
    sectionId: "buyerNotices",
    question: "What is your agent's contact information?",
    description:
      "This question is necessary to obtain the buyer's agent's contact information for delivering notices if the buyer has chosen to have notices sent to their agent.",
    type: "text",
    fieldId: "agentContact",
    dependsOnAll: [
      {
        fieldId: "deliverToAgent",
        value: true,
      },
    ],
  },
];
