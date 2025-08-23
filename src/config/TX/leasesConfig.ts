export const LeasesConfig = [
  {
    section: "Leases",
    sectionId: "leases",
    question: "Are there any residential leases currently on the property?",
    type: "boolean",
    fieldId: "hasResidentialLease",
    description:
      "This question determines if there is a residential lease on the property, which would be specified in Paragraph 10.A of the TREC 20-17 form. A residential lease means there is an existing lease agreement between the current owner and another party, and could affect the buyer's ability to occupy the property immediately after closing.",
  },
  // {
  //   section: "Leases",
  //   sectionId: "leases",
  //   question: "Is there a fixture lease?",
  //   type: "boolean",
  //   fieldId: "hasFixtureLease",
  //   description:
  //     "This question determines if there are any leased fixtures on the property, which would be specified in Paragraph 10.B of the TREC 20-17 form. Leased fixtures, such as solar panels or propane tanks, could require the buyer to assume the lease or have the seller buyout the lease before closing.",
  // },
  // {
  //   section: "Leases",
  //   sectionId: "leases",
  //   question: "Is there a mineral lease?",
  //   type: "boolean",
  //   fieldId: "hasMineralLease",
  //   description:
  //     "This question determines if there are any mineral leases associated with the property, which would be specified in Paragraph 6.F of the TREC 20-17 form. Mineral leases could entitle a third party to access and extract minerals from the property.",
  // },
  // {
  //   section: "Leases",
  //   sectionId: "leases",
  //   question: "Has the mineral lease copy been delivered?",
  //   type: "boolean",
  //   fieldId: "mineralLeaseCopyDelivered",
  //   dependsOnAll: [
  //     {
  //       fieldId: "hasMineralLease",
  //       value: true,
  //     },
  //   ],
  //   description:
  //     "If there is a mineral lease, this question determines if a copy of the lease has been provided to the buyer, as required by Paragraph 6.F of the TREC 20-17 form.",
  // },
  // {
  //   section: "Leases",
  //   sectionId: "leases",
  //   question:
  //     "How many days will you allow for the deliver a copy of all mineral leases?",
  //   type: "number",
  //   fieldId: "mineralLeaseDaysToDeliveryCopy",
  //   dependsOnAll: [
  //     {
  //       fieldId: "hasMineralLease",
  //       value: true,
  //     },
  //     {
  //       fieldId: "mineralLeaseCopyDelivered",
  //       value: false,
  //     },
  //   ],
  //   description:
  //     "If there is a mineral lease and a copy has not been provided, this question determines the deadline for the seller to deliver a copy of the lease to the buyer, as per Paragraph 6.F of the TREC 20-17 form.",
  // },
];
