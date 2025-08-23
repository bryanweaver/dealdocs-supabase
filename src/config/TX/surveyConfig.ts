import { PartyType, SurveyType } from "../../API";

export const SurveyConfig = [
  {
    section: "Survey",
    sectionId: "survey",
    intro: "Let's talk about property surveys.",
    description:
      "Property surveys are a crucial component of the home buying process. They define legal boundaries, identify encroachments, and verify the property's size and features. A thorough survey can prevent future legal disputes, help with property improvements, and is typically required by mortgage lenders and title companies.",
  },
  {
    section: "Survey",
    sectionId: "survey",
    question: "How would you like to handle the property survey?",
    type: "select",
    fieldId: "type",
    options: [
      {
        label: "I will allow the seller to furnish an existing survey",
        value: SurveyType.EXISTINGBYSELLER,
      },
      {
        label: "I would like to have my own property survey done",
        value: SurveyType.NEWBYBUYER,
      },
      {
        label: "I would like the seller to furnish a new property survey",
        value: SurveyType.NEWBYSELLER,
      },
    ],
    description:
      "This question determines how the property survey will be handled - whether the seller will provide an existing survey report, the buyer will order a new survey, or the seller will order a new survey.",
  },
  {
    section: "Survey",
    sectionId: "survey",
    question:
      "How many days after the effective date of this contract will you allow for furnishing of the survey?",
    type: "number",
    fieldId: "daysToFurnish",
    description:
      "This question determines the deadline for providing the survey report, based on the number of days after the effective date of the contract.",
  },
  {
    section: "Survey",
    sectionId: "survey",
    question:
      "If the existing survey is not acceptable to title company or lender, who should pay for a new survey?",
    type: "select",
    fieldId: "furnishingPartyIfExistingIsUnacceptable",
    options: [
      {
        label: "Buyer",
        value: PartyType.BUYER,
      },
      {
        label: "Seller",
        value: PartyType.SELLER,
      },
    ],
    dependsOnAll: [
      {
        fieldId: "type",
        value: SurveyType.EXISTINGBYSELLER,
      },
    ],
    description:
      "If the seller is providing an existing survey report, but it is not acceptable to the title company or lender, this question determines who will pay for a new survey - the buyer or the seller.",
  },
];
