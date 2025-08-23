export const SellersConfig = [
  {
    section: "Sellers",
    sectionId: "sellers",
    intro: "Let's see what you know about the sellers, eh?",
    description:
      "This section gathers information about the seller(s), which is required in Paragraph 1 of the TREC 20-17 form. The seller information identifies the party selling the property.",
  },
  {
    section: "Sellers",
    sectionId: "sellers",
    question: "What is the primary seller's full name?",
    type: "text",
    fieldId: "primaryName",
    description:
      "The seller's first name is part of the seller's identity, which is required in Paragraph 1 of the TREC 20-17 form to specify the party selling the property.",
  },
  {
    section: "Sellers",
    sectionId: "sellers",
    question: "What is the primary seller's phone number?",
    type: "phone",
    fieldId: "phone",
    description:
      "The primary seller's phone number is used for communication purposes and is typically included in Paragraph 21 of the TREC 20-17 form.",
  },
  {
    section: "Sellers",
    sectionId: "sellers",
    question: "What is the primary seller's email address?",
    type: "text",
    fieldId: "email",
    description:
      "The primary seller's email address is used for communication purposes and is typically included in Paragraph 21 of the TREC 20-17 form.",
  },
  {
    section: "Sellers",
    sectionId: "sellers",
    question: "What is the primary seller's fax number?",
    type: "phone",
    fieldId: "fax",
    description:
      "The primary seller's fax number is used for communication purposes and is typically included in Paragraph 21 of the TREC 20-17 form.",
  },
  {
    section: "Sellers",
    sectionId: "sellers",
    question: "Is there a secondary seller?",
    type: "boolean",
    fieldId: "hasSecondaryParty",
    description:
      "This question determines if there is a secondary seller, which would require their information to be included in Paragraph 1 of the TREC 20-17 form.",
  },
  {
    section: "Sellers",
    sectionId: "sellers",
    question: "What is the secondary seller's full name?",
    type: "text",
    fieldId: "secondaryName",
    dependsOnAll: [
      {
        fieldId: "hasSecondaryParty",
        value: true,
      },
    ],
    description:
      "If there is a secondary seller, their first name is required in Paragraph 1 of the TREC 20-17 form to identify the additional seller of the property.",
  },
  {
    section: "Sellers",
    sectionId: "sellers",
    question: "What is the secondary seller's phone number?",
    type: "text",
    fieldId: "secondaryPhone",
    dependsOnAll: [
      {
        fieldId: "hasSecondaryParty",
        value: true,
      },
    ],
    description:
      "If there is a secondary seller, their phone number is used for communication purposes and is typically included in Paragraph 21 of the TREC 20-17 form.",
  },
  {
    section: "Sellers",
    sectionId: "sellers",
    question: "What is the secondary seller's email address?",
    type: "text",
    fieldId: "secondaryEmail",
    dependsOnAll: [
      {
        fieldId: "hasSecondaryParty",
        value: true,
      },
    ],
    description:
      "If there is a secondary seller, their email address is used for communication purposes and is typically included in Paragraph 21 of the TREC 20-17 form.",
  },
  {
    section: "Sellers",
    sectionId: "sellers",
    question: "What is the secondary seller's fax number?",
    type: "text",
    fieldId: "secondaryFax",
    dependsOnAll: [
      {
        fieldId: "hasSecondaryParty",
        value: true,
      },
    ],
    description:
      "If there is a secondary seller, their fax number is used for communication purposes and is typically included in Paragraph 21 of the TREC 20-17 form.",
  },
];
