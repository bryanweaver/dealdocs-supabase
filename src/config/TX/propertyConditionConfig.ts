export const PropertyConditionConfig = [
  {
    intro: "Let's move on to some info about the condition of the property.",
    section: "Property Condition",
    sectionId: "propertyCondition",
  },
  {
    section: "Property Condition",
    sectionId: "propertyCondition",
    question: "Have you recieved a copy of the Seller's Disclosure Notice?",
    type: "boolean",
    fieldId: "sellerDisclosureReceived",
    description:
      "The Seller's Disclosure Notice is required by law in Texas and must be provided to the buyer before the sale. It discloses known defects and other important information about the property condition.",
  },
  {
    section: "Property Condition",
    sectionId: "propertyCondition",
    question:
      "How many days should the seller have to produce the Seller's Disclosure Notice?",
    type: "number",
    fieldId: "sellerDisclosureDaysToProduce",
    dependsOnAll: [
      {
        fieldId: "sellerDisclosureReceived",
        value: false,
      },
    ],
    description:
      "If the Seller's Disclosure Notice has not been provided yet, this specifies how many days the seller has to provide it to the buyer before the sale can proceed.",
  },
  {
    section: "Property Condition",
    sectionId: "propertyCondition",
    question:
      "Do you expect the seller to share with you all things requiring disclosure by law?",
    type: "boolean",
    fieldId: "sellerRequiredToDisclose",
    description:
      "Texas law requires sellers to disclose certain known defects and material facts about the property condition. This confirms the buyer expects the seller to fully comply with those disclosure requirements.",
  },
  {
    section: "Property Condition",
    sectionId: "propertyCondition",
    question: "Do you accept the property in its current (as is) condition?",
    type: "boolean",
    fieldId: "buyerAcceptsAsIs",
    description:
      "Accepting the property 'as is' means the buyer will not require the seller to make any repairs before the sale. The buyer takes the property in its current condition.",
  },
  {
    section: "Property Condition",
    sectionId: "propertyCondition",
    question:
      "What, if any, repairs or improvements to the property will you be requiring of the seller?",
    type: "text",
    fieldId: "buyerAcceptanceRepairSpecifics",
    dependsOnAll: [
      {
        fieldId: "buyerAcceptsAsIs",
        value: false,
      },
    ],
    description:
      "If the buyer is not accepting the property 'as is', this specifies any repairs or improvements they will require the seller to complete before the sale closes.",
  },
  {
    section: "Property Condition",
    sectionId: "propertyCondition",
    question:
      "If you decide to purchase a residential service contract, how much should the seller reimburse you for at closing?",
    type: "currency",
    fieldId: "serviceContractReimbursementAmount",
    description:
      "A residential service contract provides coverage for repairs and replacements to appliances and systems. If the buyer purchases one, this is how much they want the seller to reimburse towards the cost at closing.",
  },
  {
    section: "Property Condition",
    sectionId: "propertyCondition",
    question:
      "Do you know about any improvements or accessories that will be retained by the seller? If so, please list here.",
    type: "text",
    fieldId: "retainedImprovements",
    description:
      "This question relates to Paragraph 2.C of the TREC 20-17 form, which allows the seller to specify any improvements or accessories that are not included in the sale and will be retained by the seller.",
  },
];
