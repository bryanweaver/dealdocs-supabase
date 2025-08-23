export const BuyerProvisionsConfig = [
  {
    section: "Buyer Provisions",
    sectionId: "buyerProvisions",
    question: "What provisions would you like to make? (Please list any)",
    description:
      "This question allows the buyer to specify any additional provisions or contingencies they would like included in the contract, such as repairs or inspections.",
    type: "text",
    fieldId: "buyerProvisions",
  },
  {
    section: "Buyer Provisions",
    sectionId: "buyerProvisions",
    question:
      "What amount, if any, do you expect to recieve from the seller to cover any additional expenses?",
    description:
      "This question addresses any seller concessions or credits the buyer may be requesting to cover additional expenses related to the purchase, such as closing costs.",
    type: "currency",
    fieldId: "additionalExpensesPaidBySeller",
  },
];
