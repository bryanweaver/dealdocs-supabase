export const PossessionConfig = [
  {
    section: "Possession",
    sectionId: "possession",
    question:
      "Do you intend to lease the property temporarily before aquiring it?",
    description:
      "This question is relevant to determine if the buyer will be leasing the property before taking ownership, which may affect the terms of the contract and the timing of the closing.",
    type: "boolean",
    fieldId: "possessionAccordingToTempLease",
  },
  {
    section: "Possession",
    sectionId: "possession",
    question:
      "Will you take possession of the property upon closing and funding?",
    description:
      "This question is important to clarify when the buyer will take possession of the property, which is typically upon closing and funding of the sale.",
    type: "boolean",
    fieldId: "possessionUponClosing",
  },
];
