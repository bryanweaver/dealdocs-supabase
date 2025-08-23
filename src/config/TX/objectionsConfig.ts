export const ObjectionsConfig = [
  {
    section: "Objections",
    sectionId: "titleObjections",
    question:
      "What, if any, objections to defects, exceptions, or encumberances to the title would you like to list?",
    type: "text",
    fieldId: "objections",
    description:
      "This question allows the buyer to list any specific objections they have to the title commitment, such as defects, exceptions, or encumbrances. These objections must be resolved before closing.",
  },
  {
    section: "Objections",
    sectionId: "titleObjections",
    question:
      "How many days (after recieiving the commitment, exception documents, and inspection survey) do you think you should have to object?",
    type: "number",
    fieldId: "daysToObject",
    description:
      "This question determines the deadline for the buyer to raise objections to the title commitment, based on the number of days after receiving the commitment, exception documents, and inspection survey.",
  },
];
