export const BuyerAttorneyConfig = [
  {
    section: "Attorney",
    sectionId: "buyerAttorney",
    intro: "Let's talk attorneys.",
  },
  {
    section: "Attorney",
    sectionId: "buyerAttorney",
    question: "Do you have an attorney on this deal?",
    type: "boolean",
    fieldId: "hasAttorney",
    description:
      "This question establishes whether the buyer has retained an attorney for the real estate transaction, which is important information that must be disclosed in the TREC Form 2017 for residential resale in Texas.",
  },
  {
    section: "Attorney",
    sectionId: "buyerAttorney",
    question: "What is your attorney's firm name?",
    type: "text",
    fieldId: "name",
    dependsOnAll: [
      {
        fieldId: "hasAttorney",
        value: true,
      },
    ],
    description:
      "If the buyer has an attorney, the name of the attorney's firm must be provided in the TREC Form 2017 for residential resale in Texas.",
  },
  {
    section: "Attorney",
    sectionId: "buyerAttorney",
    question: "What is your attorney's street address?",
    type: "text",
    fieldId: "streetAddress",
    dependsOnAll: [
      {
        fieldId: "hasAttorney",
        value: true,
      },
    ],
    description:
      "The street address of the buyer's attorney must be disclosed in the TREC Form 2017 for residential resale in Texas, if an attorney is involved in the transaction.",
  },
  {
    section: "Attorney",
    sectionId: "buyerAttorney",
    question: "What is your attorney's city?",
    type: "text",
    fieldId: "city",
    dependsOnAll: [
      {
        fieldId: "hasAttorney",
        value: true,
      },
    ],
    description:
      "The city where the buyer's attorney is located is required information for the TREC Form 2017 for residential resale in Texas, if an attorney is involved in the transaction.",
  },
  {
    section: "Attorney",
    sectionId: "buyerAttorney",
    question: "What is your attorney's state?",
    type: "text",
    fieldId: "state",
    dependsOnAll: [
      {
        fieldId: "hasAttorney",
        value: true,
      },
    ],
    description:
      "The state where the buyer's attorney is located must be provided in the TREC Form 2017 for residential resale in Texas, if an attorney is involved in the transaction.",
  },
  {
    section: "Attorney",
    sectionId: "buyerAttorney",
    question: "What is your attorney's postal code?",
    type: "text",
    fieldId: "postalCode",
    dependsOnAll: [
      {
        fieldId: "hasAttorney",
        value: true,
      },
    ],
    description:
      "The postal code of the buyer's attorney must be provided in the TREC Form 2017 for residential resale in Texas, if an attorney is involved in the transaction. This information is necessary for complete contact details.",
  },
  {
    section: "Attorney",
    sectionId: "buyerAttorney",
    question: "What is your attorney's phone number?",
    type: "phone",
    fieldId: "phone",
    dependsOnAll: [
      {
        fieldId: "hasAttorney",
        value: true,
      },
    ],
    description:
      "The phone number of the buyer's attorney is required contact information that must be disclosed in the TREC Form 2017 for residential resale in Texas, if an attorney is involved in the transaction.",
  },
  {
    section: "Attorney",
    sectionId: "buyerAttorney",
    question: "What is your attorney's email?",
    type: "text",
    fieldId: "email",
    dependsOnAll: [
      {
        fieldId: "hasAttorney",
        value: true,
      },
    ],
    description:
      "The email address of the buyer's attorney must be provided in the TREC Form 2017 for residential resale in Texas, if an attorney is involved in the transaction. This allows for efficient communication during the process.",
  },
  {
    section: "Attorney",
    sectionId: "buyerAttorney",
    question: "What is your attorney's fax number?",
    type: "text",
    fieldId: "fax",
    dependsOnAll: [
      {
        fieldId: "hasAttorney",
        value: true,
      },
    ],
    description:
      "If applicable, the fax number of the buyer's attorney should be disclosed in the TREC Form 2017 for residential resale in Texas. While less common, some attorneys still use fax for document transmission.",
  },
];
