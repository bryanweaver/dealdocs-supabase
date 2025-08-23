import { PartyType } from "../../API";

export const HomeownersAssociationAddendumConfig = [
  {
    intro: "Let's hop into the homeowners association realm for a minute.",
    section: "Homeowners Association Addendum",
    sectionId: "homeownersAssociationAddendum",
  },
  {
    section: "Homeowners Association Addendum",
    sectionId: "homeownersAssociationAddendum",
    question: "Is the property part of a homeowners association",
    type: "boolean",
    fieldId: "hasHomeownersAssociation",
    description:
      "This question determines if the property is part of a homeowners association, which could impose additional restrictions or fees on the buyer.",
  },
  {
    section: "Homeowners Association Addendum",
    sectionId: "homeownersAssociationAddendum",
    question: "What is the name of the homeowners association?",
    description:
      "This question asks for the name of the homeowners association that governs the property. You can usually find this information in the seller's disclosure notice or the HOA documents provided by the seller.",
    type: "text",
    fieldId: "associationName",
    // if yes, #3 checkbox is checked
    dependsOnAll: [{ fieldId: "hasHomeownersAssociation", value: true }],
  },
  {
    section: "Homeowners Association Addendum",
    sectionId: "homeownersAssociationAddendum",
    question: "What is the phone number of the homeowners association?",
    description:
      "This question asks for the phone number of the homeowners association that governs the property. You can usually find this information in the seller's disclosure notice or the HOA documents provided by the seller.",
    type: "phone",
    fieldId: "associationPhoneNumber",
    // if yes, #3 checkbox is checked
    dependsOnAll: [{ fieldId: "hasHomeownersAssociation", value: true }],
  },
  {
    section: "Homeowners Association Addendum",
    sectionId: "homeownersAssociationAddendum",
    question:
      "Have you already received the Homeowners Association Subdivision Information?",
    description:
      "Indicate if you have already received and approve of the Subdivision Information before signing this contract.",
    type: "boolean",
    fieldId: "receivedSubdivisionInfo",
    // if yes, #3 checkbox is checked
    dependsOnAll: [{ fieldId: "hasHomeownersAssociation", value: true }],
  },
  // if yes
  {
    section: "Homeowners Association Addendum",
    sectionId: "homeownersAssociationAddendum",
    question: "Do you require an updated resale certificate?",
    description:
      "Select if you need an updated resale certificate from the Association.",
    type: "boolean",
    fieldId: "requiresUpdatedResaleCertificate",
    // if yes, #3A checkbox is checked
    // if no, #3B checkbox is checked
    dependsOnAll: [
      { fieldId: "receivedSubdivisionInfo", value: true },
      { fieldId: "hasHomeownersAssociation", value: true },
    ],
  },
  // if no
  {
    section: "Homeowners Association Addendum",
    sectionId: "homeownersAssociationAddendum",
    question:
      "Will you be requiring delivery of the Homeowners Association Subdivision Information?",
    description:
      "Indicate if you will require delivery of the Subdivision Information from the Homeowners Association. If not required, you are waiving your right to terminate the contract based on review of the Subdivision Information.",
    type: "boolean",
    fieldId: "requiresSubdivisionInfo", // if no, #4 checkbox is checked
    dependsOnAll: [{ fieldId: "hasHomeownersAssociation", value: true }],
  },
  // if yes
  {
    section: "Homeowners Association Addendum",
    sectionId: "homeownersAssociationAddendum",
    question:
      "Who will be responsible for obtaining and delivering the Subdivision Information?",
    description:
      "Select who will be responsible for the cost of obtaining and delivering the Subdivision Information.",
    type: "select",
    fieldId: "subdivisionInfoProvidedBy",
    options: [
      { value: PartyType.BUYER, label: "I will obtain it myself" },
      { value: PartyType.SELLER, label: "The seller will deliver to me" },
    ],
    dependsOnAll: [
      { fieldId: "requiresSubdivisionInfo", value: true },
      { fieldId: "hasHomeownersAssociation", value: true },
    ],
  },
  {
    section: "Homeowners Association Addendum",
    sectionId: "homeownersAssociationAddendum",
    question:
      "How many days will you allow for delivery of the Subdivision Information?",
    description:
      "Select the number of days you will allow for delivery of the Subdivision Information.",
    type: "number",
    fieldId: "subdivisionInfoDaysToDeliver",
    dependsOnAll: [
      { fieldId: "requiresSubdivisionInfo", value: true },
      { fieldId: "hasHomeownersAssociation", value: true },
    ],
  },
  {
    section: "Homeowners Association Addendum",
    sectionId: "homeownersAssociationAddendum",
    question:
      "What is the maximum amount you intend to pay for Homeowner Association fees related to the transfer of property?",
    description:
      "Enter the maximum amount you are willing to pay for any fees, deposits, reserves, or other charges associated with the transfer of the Property. These may include deposits for reserves required by the Association, Association's transfer fees, and any unpaid regular or special assessments.",
    type: "number",
    fieldId: "buyerFeesNotToExceed",
    dependsOnAll: [{ fieldId: "hasHomeownersAssociation", value: true }],
  },
  {
    section: "Homeowners Association Addendum",
    sectionId: "homeownersAssociationAddendum",
    question:
      "If the title company requires additional subdivision information, which party will pay for it?",
    description:
      "Select which party will be responsible for paying for any additional subdivision information required by the title company.",
    type: "select",
    fieldId: "feeForTitleCompanyPaidBy",
    options: [
      { value: PartyType.BUYER, label: "I will pay for it" },
      { value: PartyType.SELLER, label: "The seller will pay for it" },
    ],
    dependsOnAll: [{ fieldId: "hasHomeownersAssociation", value: true }],
  },
];
