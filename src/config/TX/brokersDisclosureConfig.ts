export const BrokersDisclosureConfig = [
  {
    section: "Brokers Disclosure",
    sectionId: "brokerDisclosure",
    question: "Are you a third party, who is related to the buyer?",
    type: "boolean",
    fieldId: "buyerIsThirdPartyAgent",
    description:
      "This discloses if the person filling out this form is a third party agent related to the buyer, rather than the buyer themselves.",
  },
  {
    section: "Brokers Disclosure",
    sectionId: "brokerDisclosure",
    question: "Are you related to the seller?",
    type: "boolean",
    fieldId: "buyerIsRelatedToSeller",
    description:
      "This discloses if the buyer is related to the seller, which could impact negotiations.",
  },
  {
    section: "Brokers Disclosure",
    sectionId: "brokerDisclosure",
    question: "Do you have any current stake in the property?",
    type: "boolean",
    fieldId: "buyerHasStakeInProperty",
    description:
      "This discloses if the buyer already has an ownership stake in the property being sold.",
  },
  {
    section: "Brokers Disclosure",
    sectionId: "brokerDisclosure",
    question: "Are you being compensated in any way for this transaction?",
    type: "boolean",
    fieldId: "buyerIsBeingCompensated",
    description:
      "This discloses if the buyer is receiving any compensation related to this sale, beyond normal negotiations.",
  },
];
