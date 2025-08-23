export const BuyersConfig = [
  {
    section: "Buyers",
    sectionId: "buyers",
    intro: "Ok! Now let's get started with some basic information about you.",
    description:
      "This section gathers information about the buyer(s), which is required in Paragraph 1 of the TREC 20-17 form. The buyer information identifies the party purchasing the property.",
  },
  {
    section: "Buyers",
    sectionId: "buyers",
    question: "What is your full name?",
    type: "text",
    fieldId: "primaryName",
    description:
      "The buyer's first name is part of the buyer's identity, which is required in Paragraph 1 of the TREC 20-17 form to specify the party purchasing the property.",
  },
  {
    section: "Buyers",
    sectionId: "buyers",
    question: "What is your phone number?",
    type: "phone",
    fieldId: "phone",
    description:
      "The buyer's phone number is used for communication purposes and is typically included in Paragraph 21 of the TREC 20-17 form.",
  },
  {
    section: "Buyers",
    sectionId: "buyers",
    question: "What is your email address?",
    type: "text",
    fieldId: "email",
    description:
      "The buyer's email address is used for communication purposes and is typically included in Paragraph 21 of the TREC 20-17 form.",
  },
  {
    section: "Buyers",
    sectionId: "buyers",
    question: "What is your fax number?",
    type: "phone",
    fieldId: "fax",
    description:
      "The buyer's fax number is used for communication purposes and is typically included in Paragraph 21 of the TREC 20-17 form.",
  },
  {
    section: "Buyers",
    sectionId: "buyers",
    question: "Is there a secondary buyer?",
    type: "boolean",
    fieldId: "hasSecondaryParty",
    description:
      "This question determines if there is a second buyer, which is common in situations such as married couples. If there is a second buyer, their information is also required in Paragraph 1 of the TREC 20-17 form.",
  },
  {
    section: "Buyers",
    sectionId: "buyers",
    question: "What is the second buyer's full name?",
    type: "text",
    fieldId: "secondaryName",
    dependsOnAll: [
      {
        fieldId: "hasSecondaryParty",
        value: true,
      },
    ],
    description:
      "If there is a second buyer, their first name is part of their identity, which is required in Paragraph 1 of the TREC 20-17 form to specify the party purchasing the property.",
  },
  {
    section: "Buyers",
    sectionId: "buyers",
    question: "What is the second buyer's phone number?",
    type: "phone",
    fieldId: "secondaryPhone",
    dependsOnAll: [
      {
        fieldId: "hasSecondaryParty",
        value: true,
      },
    ],
    description:
      "If there is a second buyer, their phone number is used for communication purposes and is typically included in Paragraph 21 of the TREC 20-17 form.",
  },
  {
    section: "Buyers",
    sectionId: "buyers",
    question: "What is the second buyer's email address?",
    type: "text",
    fieldId: "secondaryEmail",
    dependsOnAll: [
      {
        fieldId: "hasSecondaryParty",
        value: true,
      },
    ],
    description:
      "If there is a second buyer, their email address is used for communication purposes and is typically included in Paragraph 21 of the TREC 20-17 form.",
  },
  {
    section: "Buyers",
    sectionId: "buyers",
    question: "What is the second buyer's fax number?",
    type: "phone",
    fieldId: "secondaryFax",
    dependsOnAll: [
      {
        fieldId: "hasSecondaryParty",
        value: true,
      },
    ],
    description:
      "If there is a second buyer, their fax number is used for communication purposes and is typically included in Paragraph 21 of the TREC 20-17 form.",
  },
];
