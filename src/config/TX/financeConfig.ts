import { FinancingType, LoanType, TerminationOnAppraisalType } from "../../API";

export const FinanceConfig = [
  {
    section: "Finance",
    sectionId: "finance",
    intro: "Ok, let's talk financing.",
    description:
      "This section gathers information about the financial aspects of the transaction, including the sales price, down payment, and financing. These details are required in Paragraphs 3 and 4 of the TREC 20-17 form.",
  },
  {
    section: "Finance",
    sectionId: "finance",
    question: "What type of financing will you be using?",
    type: "select",
    fieldId: "financingType",
    options: [
      {
        label: "None",
        value: FinancingType.NONE,
      },
      {
        label: "Third Party",
        value: FinancingType.BYTHIRDPARTY,
      },
      // {
      //   label: "Assuming Existing Loan",
      //   value: FinancingType.BYLOANASSUMPTION,
      // },
      // {
      //   label: "Seller Financing",
      //   value: FinancingType.BYSELLER,
      // },
    ],
    description:
      "The type of financing specifies whether and how the buyer will be borrowing the money to purchase the property. The options are defined in Paragraph 4 of the TREC 20-17 form.",
  },
  {
    section: "Finance",
    sectionId: "finance",
    question: "Do you already have a preferred lender?",
    description:
      "Indicate whether you already have a specific lender you plan to work with for this transaction.",
    type: "boolean",
    fieldId: "hasPreferredLender",
    dependsOnAll: [
      {
        fieldId: "financingType",
        value: FinancingType.BYTHIRDPARTY,
      },
    ],
  },
  {
    section: "Finance",
    sectionId: "finance",
    question: "Would you like a referral to trusted lenders in your area?",
    description:
      "We can connect you with experienced lenders who specialize in your loan type and local market.",
    type: "boolean",
    fieldId: "wantsLenderReferral",
    dependsOnAll: [
      {
        fieldId: "hasPreferredLender",
        value: false,
      },
      {
        fieldId: "financingType",
        value: FinancingType.BYTHIRDPARTY,
      },
    ],
    onTrueAction: "navigateToComponent",
    navigationTarget: "LenderReferralComponent",
    // navigationParams: {
    //   loanType: "fieldValue:loanType",
    //   zipCode: "fieldValue:propertyZip"
    // }
  },
  {
    section: "Finance",
    sectionId: "finance",
    type: "referralLink",
    fieldId: "financingReferralLink",
    label: "Visit Financing Referral",
    description:
      "Get connected with a trusted finance provider for your transaction.",
    referralUrl: import.meta.env.VITE_FINANCING_REFERRAL_URL,
    dependsOnAll: [{ fieldId: "wantsLenderReferral", value: true }],
    // This is a non-required, action-only button
  },
  {
    section: "Finance",
    sectionId: "finance",
    question: "How much do you intend to offer for the property?",
    type: "currency",
    fieldId: "totalSalesPrice",
    description:
      "The total sales price is the amount the buyer is offering to pay for the property. This is a crucial piece of information that is required in Paragraph 3 of the TREC 20-17 form.",
  },
  {
    section: "Finance",
    sectionId: "finance",
    question: "How much of that will be a down payment?",
    type: "currency",
    fieldId: "cashAmount",
    description:
      "The down payment, or cash amount, is the portion of the purchase price that the buyer is paying upfront. This information is required in Paragraph 3 of the TREC 20-17 form.",
    dependsOnAll: [
      {
        fieldId: "financingType",
        value: FinancingType.BYTHIRDPARTY,
      },
    ],
  },
  {
    section: "Finance",
    sectionId: "finance",
    question: "How much will you be financing?",
    type: "currency",
    fieldId: "principalAmount",
    description:
      "The financing amount is the portion of the purchase price that the buyer is borrowing from a lender. This information is required in Paragraph 4 of the TREC 20-17 form.",
    dependsOnAll: [
      {
        fieldId: "financingType",
        value: FinancingType.BYTHIRDPARTY,
      },
    ],
  },
  {
    section: "Finance",
    sectionId: "finance",
    question: "What type of loan will you be obtaining?",
    description:
      "Select the type of loan you will be obtaining from the available options. This choice will determine the specific terms and conditions of your mortgage financing.",
    type: "select",
    fieldId: "loanType",
    options: [
      {
        label: "Conventional",
        value: LoanType.CONVENTIONAL,
      },
      {
        label: "Texas Veterans Loan",
        value: LoanType.VA,
      },
      {
        label: "FHA Insured Financing",
        value: LoanType.FHA,
      },
      {
        label: "VA Guaranteed",
        value: LoanType.VAGUARANTEED,
      },
      {
        label: "USDA Guaranteed",
        value: LoanType.USDAGUARANTEED,
      },
      {
        label: "Reverse Mortgage Financing",
        value: LoanType.REVERSEMORTGAGE,
      },
      {
        label: "Other Financing",
        value: LoanType.OTHERFINANCING,
      },
    ],
    dependsOnAll: [
      {
        fieldId: "financingType",
        value: FinancingType.BYTHIRDPARTY,
      },
    ],
  },
  {
    section: "Finance",
    sectionId: "finance",
    question: "Will this be a second mortgage?",
    description:
      "Indicate whether this will be a second mortgage. A second mortgage is an additional loan taken out on a property that already has a primary mortgage.",
    type: "boolean",
    fieldId: "isSecondMortgage",
    dependsOnAll: [
      {
        fieldId: "loanType",
        value: LoanType.CONVENTIONAL,
      },
      {
        fieldId: "financingType",
        value: FinancingType.BYTHIRDPARTY,
      },
    ],
  },
  {
    section: "Finance",
    sectionId: "finance",
    question: "What is the term of the loan (in years)?",
    description:
      "Specify the number of years over which the mortgage loan will be repaid in full. This term determines the duration of your loan agreement.",
    type: "number",
    fieldId: "termYears",
    dependsOnAll: [
      {
        fieldId: "financingType",
        value: FinancingType.BYTHIRDPARTY,
      },
    ],
  },
  {
    section: "Finance",
    sectionId: "finance",
    question: "What is the initial interest rate for the loan?",
    description:
      "State the interest rate that will be charged for the initial years of the loan. This provides a cap on the interest rate during the early period of the mortgage.",
    type: "number",
    fieldId: "interestRate",
    dependsOnAll: [
      {
        fieldId: "financingType",
        value: FinancingType.BYTHIRDPARTY,
      },
    ],
    dependsOnAny: [
      {
        fieldId: "loanType",
        value: LoanType.CONVENTIONAL,
      },
      {
        fieldId: "loanType",
        value: LoanType.FHA,
      },
      {
        fieldId: "loanType",
        value: LoanType.VAGUARANTEED,
      },
      {
        fieldId: "loanType",
        value: LoanType.USDAGUARANTEED,
      },
      {
        fieldId: "loanType",
        value: LoanType.REVERSEMORTGAGE,
      },
      {
        fieldId: "loanType",
        value: LoanType.OTHERFINANCING,
      },
    ],
  },
  {
    section: "Finance",
    sectionId: "finance",
    question:
      "For how many years is the initial interest rate of the mortgage loan applicable?",
    description:
      "Indicate the number of years for which the initial interest rate will remain fixed. This period ensures that the interest rate does not change for a specified duration.",
    type: "number",
    fieldId: "interestRateYears",
    dependsOnAll: [
      {
        fieldId: "financingType",
        value: FinancingType.BYTHIRDPARTY,
      },
    ],
    dependsOnAny: [
      {
        fieldId: "loanType",
        value: LoanType.CONVENTIONAL,
      },
      {
        fieldId: "loanType",
        value: LoanType.FHA,
      },
      {
        fieldId: "loanType",
        value: LoanType.VAGUARANTEED,
      },
      {
        fieldId: "loanType",
        value: LoanType.USDAGUARANTEED,
      },
      {
        fieldId: "loanType",
        value: LoanType.REVERSEMORTGAGE,
      },
      {
        fieldId: "loanType",
        value: LoanType.OTHERFINANCING,
      },
    ],
  },
  {
    section: "Finance",
    sectionId: "finance",
    question: "What percent of the loan are origination charges not to exceed?",
    description:
      "Specify the maximum percentage of the loan amount that can be charged as origination fees. This includes application fees, underwriting fees, and other loan origination charges. Setting this limit helps protect borrowers from excessive upfront costs and ensures transparency in the loan process.",
    type: "number",
    fieldId: "originationChargePercent",
    dependsOnAll: [
      {
        fieldId: "financingType",
        value: FinancingType.BYTHIRDPARTY,
      },
    ],
    dependsOnAny: [
      {
        fieldId: "loanType",
        value: LoanType.CONVENTIONAL,
      },
      {
        fieldId: "loanType",
        value: LoanType.FHA,
      },
      {
        fieldId: "loanType",
        value: LoanType.VAGUARANTEED,
      },
      {
        fieldId: "loanType",
        value: LoanType.USDAGUARANTEED,
      },
      {
        fieldId: "loanType",
        value: LoanType.REVERSEMORTGAGE,
      },
      {
        fieldId: "loanType",
        value: LoanType.OTHERFINANCING,
      },
    ],
  },
  {
    section: "Finance",
    sectionId: "finance",
    question: "Will the reverse mortgage loan be an FHA insured loan?",
    description:
      "Indicate whether the reverse mortgage loan will be insured by the FHA. FHA insurance can provide additional security for the borrower.",
    type: "boolean",
    fieldId: "reverseMortgageIsFHAInsured",
    dependsOnAll: [
      {
        fieldId: "loanType",
        value: LoanType.REVERSEMORTGAGE,
      },
      {
        fieldId: "financingType",
        value: FinancingType.BYTHIRDPARTY,
      },
    ],
  },
  {
    section: "Finance",
    sectionId: "finance",
    question: "What is the name of the lender?",
    description:
      "Provide the name of the lender issuing the loan under the other financing option. This identifies the financial institution involved.",
    type: "text",
    fieldId: "otherFinancingLenderName",
    dependsOnAll: [
      {
        fieldId: "loanType",
        value: LoanType.OTHERFINANCING,
      },
      {
        fieldId: "financingType",
        value: FinancingType.BYTHIRDPARTY,
      },
    ],
  },
  {
    section: "Finance",
    sectionId: "finance",
    question:
      "Does the buyer waive all rights to terminate the contract under Paragraph 2B of this addendum for the loan described in this paragraph?",
    description:
      "Indicate whether the buyer waives their rights to terminate the contract based on the financing terms specified in Paragraph 2B of the addendum.",
    type: "boolean",
    fieldId: "otherFinancingWaiveRights",
    dependsOnAll: [
      {
        fieldId: "loanType",
        value: LoanType.OTHERFINANCING,
      },
      {
        fieldId: "financingType",
        value: FinancingType.BYTHIRDPARTY,
      },
    ],
  },
  {
    section: "Finance",
    sectionId: "finance",
    question: "Is this contract subject to Buyer obtaining Buyer Approval?",
    description:
      "Confirm whether the contract is contingent on the buyer obtaining approval for the loan. This approval is crucial for finalizing the purchase.",
    type: "boolean",
    fieldId: "isBuyerApprovalRequired",
    dependsOnAll: [
      {
        fieldId: "financingType",
        value: FinancingType.BYTHIRDPARTY,
      },
    ],
  },
  {
    section: "Finance",
    sectionId: "finance",
    question:
      "How many days after the effective date of this contract can the Buyer give written notice to the Seller if Buyer cannot obtain Buyer Approval?",
    description:
      "Specify the number of days the buyer has to notify the seller in writing if they are unable to obtain loan approval.",
    type: "number",
    fieldId: "buyerApprovalNoticeDays",
    dependsOnAll: [
      {
        fieldId: "isBuyerApprovalRequired",
        value: true,
      },
      {
        fieldId: "financingType",
        value: FinancingType.BYTHIRDPARTY,
      },
    ],
  },
  {
    section: "Finance",
    sectionId: "finance",
    question: "What is the appraised value of the Property?",
    description:
      "Provide the appraised value of the property being financed through an FHA or VA loan. This value is determined by a professional appraiser and impacts loan eligibility and amount.",
    type: "currency",
    fieldId: "fhaVaAppraisedValue",
    dependsOnAll: [
      {
        fieldId: "financingType",
        value: FinancingType.BYTHIRDPARTY,
      },
    ],
    dependsOnAny: [
      {
        fieldId: "loanType",
        value: LoanType.VA,
      },
      {
        fieldId: "loanType",
        value: LoanType.VAGUARANTEED,
      },
      {
        fieldId: "loanType",
        value: LoanType.FHA,
      },
    ],
  },
  {
    section: "Finance",
    sectionId: "finance",
    intro:
      "Now we need to discuss your right to terminate the contract based on the lender's appraisal of the home...",
    description:
      "The Third Party Financing Addendum (TREC Form 49-1) provides three options regarding the buyer's right to terminate if the property appraises for less than the sales price: 1) The buyer waives their right to terminate based on the appraisal (meaning the buyer must proceed even if the property appraises for less, as long as they qualify for financing), 2) The buyer can terminate only if the appraised value is less than a specific amount (which protects the seller if they're willing to reduce the price to that amount), or 3) The buyer can terminate if the appraised value is less than the sales price. This choice affects both parties' rights and negotiating positions if the property appraises below the sales price.",
    dependsOnAny: [
      {
        fieldId: "loanType",
        value: LoanType.CONVENTIONAL,
      },
      {
        fieldId: "loanType",
        value: LoanType.USDAGUARANTEED,
      },
    ],
  },
  {
    section: "Finance",
    sectionId: "finance",
    question:
      "Which option regarding the right to terminate based on the lender's appraisal of the home do you wish to invoke in this contract?",
    description:
      "Select the option that best suits your needs regarding the buyer's right to terminate the contract based on the lender's appraisal of the home.",
    type: "select",
    fieldId: "terminationOnAppraisalType",
    options: [
      {
        label: "Waive Right to Terminate",
        value: TerminationOnAppraisalType.WAIVER,
      },
      {
        label: "Terminate Only if Appraisal is Below Specific Amount",
        value: TerminationOnAppraisalType.PARTIALWAIVER,
      },
      {
        label: "Extra Time to Terminate Based on Appraisal",
        value: TerminationOnAppraisalType.ADDITIONALRIGHTTOTERMINATE,
      },
    ],
  },
  {
    section: "Finance",
    sectionId: "finance",
    question: "What opinion of value ($) will you not accept?",
    description:
      "This sets the maximum value that you will NOT accept - meaning you'll have the right to terminate if the appraisal comes in BELOW this amount. For example, if you enter $200,000, you can terminate if the property appraises for $199,999 or less, but must proceed (assuming you qualify for financing) if it appraises for $200,000 or more. This gives the seller assurance that you'll move forward with the purchase as long as the appraisal falls under this threshold.",
    type: "currency",
    fieldId: "terminationOpinionOfValueAmount",
    dependsOnAll: [
      {
        fieldId: "terminationOnAppraisalType",
        value: TerminationOnAppraisalType.PARTIALWAIVER,
      },
    ],
  },
  {
    section: "Finance",
    sectionId: "finance",
    question:
      "What is the appraisal value ($) below which you reserve the right to terminate the contract?",
    description:
      "Specify the appraisal value below which you reserve the right to terminate the contract. This value sets the threshold for your right to terminate based on the lender's appraisal of the home.",
    type: "currency",
    fieldId: "terminationAppraisedValueLessThan",
    dependsOnAll: [
      {
        fieldId: "terminationOnAppraisalType",
        value: TerminationOnAppraisalType.ADDITIONALRIGHTTOTERMINATE,
      },
    ],
  },
  {
    section: "Finance",
    sectionId: "finance",
    question:
      "How many days after the Effective Date do you want the right to terminate if the appraisal value is below the specified amount?",
    description:
      "Specify the number of days after the Effective Date that you want the right to terminate if the appraisal value is below the specified amount. This period allows you to assess the appraisal and make an informed decision within the specified timeframe.",
    type: "number",
    fieldId: "terminationDaysAfterEffectiveDate",
    dependsOnAll: [
      {
        fieldId: "terminationOnAppraisalType",
        value: TerminationOnAppraisalType.ADDITIONALRIGHTTOTERMINATE,
      },
    ],
  },
];
