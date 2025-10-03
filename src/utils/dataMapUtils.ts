// Import enums from types instead of deprecated API.ts
import { FinancingType, PartyType, LoanType, SurveyType, TerminationOnAppraisalType } from "../types/enums.js";
import {
  all2017Fields,
  allHOAAddendumFields,
  allThirdPartyFinanceAddendumFields,
  allLenderApprovalTerminationAddendumFields,
} from "../config/allFields30-17";

// Re-export all enums for convenience
export { FinancingType, PartyType, LoanType, SurveyType, TerminationOnAppraisalType } from "../types/enums.js";
import { getMonthName, formatDate } from "./dateUtils";

function joinAddress(address: any) {
  const { streetAddress, city, state, postalCode } = address;
  return `${streetAddress} ${city}, ${state} ${postalCode}`;
}

export function mapAll2017Fields(formData: any) {
  const resultForPDF = {};
  for (let field of all2017Fields) {
    const { id, type } = field;

    switch (id) {
      case "buyerName": {
        const buyers = formData["buyers"];
        const firstName = `${buyers.primaryName}`;
        if (buyers.hasSecondaryParty) {
          const secondName = `${buyers.secondaryName}`;
          resultForPDF[id] = `${firstName} and ${secondName}`;
        } else {
          resultForPDF[id] = firstName;
        }
        break;
      }
      case "sellerName": {
        const sellers = formData["sellers"];
        const firstName = `${sellers.primaryName}`;
        if (sellers.hasSecondaryParty) {
          const secondName = `${sellers.secondaryName}`;
          resultForPDF[id] = `${firstName} and ${secondName}`;
        } else {
          resultForPDF[id] = firstName;
        }
        break;
      }
      case "propertyLot":
        resultForPDF[id] = formData["property"]["lot"];
        break;
      case "propertyBlock":
        resultForPDF[id] = formData["property"]["block"];
        break;
      case "propertyAddition":
        resultForPDF[id] = formData["property"]["legalDescription"];
        break;
      case "propertyCity":
        resultForPDF[id] = formData["property"]["city"];
        break;
      case "propertyCounty":
        resultForPDF[id] = formData["property"]["county"];
        break;
      case "propertyFullAddress":
        resultForPDF[id] = joinAddress(formData["property"]);
        break;
      case "retainedImprovementsLine1":
        resultForPDF[id] =
          formData["propertyCondition"]["retainedImprovements"];
        break;
      case "amount3A":
        resultForPDF[id] = formData["finance"]["cashAmount"];
        break;
      case "amount3B":
        resultForPDF[id] = formData["finance"]["financingAmount"];
        break;
      case "amount3C":
        resultForPDF[id] = formData["finance"]["totalSalesPrice"];
        break;
      case "cbLoanAssumptionAddendumAttached":
      case "cbSellerFinancingAddendumAttached":
      case "cbThirdPartyAddendumAttached":
        switch (formData["finance"]["financingType"]) {
          case FinancingType.BYTHIRDPARTY:
            resultForPDF["cbThirdPartyAddendumAttached"] = true;
            resultForPDF["cbLoanAssumptionAddendumAttached"] = false;
            resultForPDF["cbSellerFinancingAddendumAttached"] = false;
            break;
          case FinancingType.BYLOANASSUMPTION:
            resultForPDF["cbLoanAssumptionAddendumAttached"] = true;
            resultForPDF["cbSellerFinancingAddendumAttached"] = false;
            resultForPDF["cbThirdPartyAddendumAttached"] = false;
            break;
          case FinancingType.BYSELLER:
            resultForPDF["cbSellerFinancingAddendumAttached"] = true;
            resultForPDF["cbThirdPartyAddendumAttached"] = false;
            resultForPDF["cbLoanAssumptionAddendumAttached"] = false;
            break;
          case FinancingType.NONE:
          default:
            resultForPDF["cbThirdPartyAddendumAttached"] = false;
            resultForPDF["cbLoanAssumptionAddendumAttached"] = false;
            resultForPDF["cbSellerFinancingAddendumAttached"] = false;
            break;
        }
        break;
      case "cbResidentialLeaseAddendumAttached":
        resultForPDF[id] = formData["leases"]["hasResidentialLease"];
        break;
      case "propertyAddressPage2":
        resultForPDF[id] = joinAddress(formData["property"]);
        break;
      case "escrowAgentName":
        resultForPDF[id] = formData["title"]["escrowAgentName"];
        break;
      case "titleCompanyNameAddress":
        const address = {
          streetAddress: formData["title"]["titleCompanyStreetAddress"],
          city: formData["title"]["titleCompanyCity"],
          state: formData["title"]["titleCompanyState"],
          postalCode: formData["title"]["titleCompanyPostalCode"],
        };
        resultForPDF[id] = `${formData["title"]["titleCompanyName"]}, 
          ${joinAddress(address)}`;
        break;
      case "escrowEarnestMoney":
        resultForPDF[id] = formData["title"]["earnestMoney"];
        break;
      case "escrowOptionFee":
        resultForPDF[id] = formData["title"]["optionFee"];
        break;
      case "escrowAdditionalEarnestMoney":
        resultForPDF[id] = formData["title"]["additionalEarnestMoney"];
        break;
      case "escrowAdditionalEarnestMoneyDaysToDeliver":
        resultForPDF[id] =
          formData["title"]["additionalEarnestMoneyDaysToDeliver"];
        break;
      case "optionPeriodDays":
        resultForPDF[id] = formData["title"]["optionPeriodDaysToTerminate"];
        break;
      case "cbTitlePolicyIsSellerExpense":
      case "cbTitlePolicyIsBuyerExpense":
        switch (formData["title"]["titleFurnishingParty"]) {
          case "SELLER":
            resultForPDF["cbTitlePolicyIsSellerExpense"] = true;
            resultForPDF["cbTitlePolicyIsBuyerExpense"] = false;
            break;
          case "BUYER":
            resultForPDF["cbTitlePolicyIsBuyerExpense"] = true;
            resultForPDF["cbTitlePolicyIsSellerExpense"] = false;
            break;
          default:
            resultForPDF["cbTitlePolicyIsSellerExpense"] = false;
            resultForPDF["cbTitlePolicyIsBuyerExpense"] = false;
            break;
        }
        break;
      case "titleCompanyName":
        resultForPDF[id] = formData["title"]["titleCompanyName"];
        break;
      case "cbTitlePolicyWillNotBeAmended":
      case "cbTitlePolicyWillBeAmended":
        switch (formData["title"]["standardExceptionsToBeAmended"]) {
          case false:
            resultForPDF["cbTitlePolicyWillNotBeAmended"] = true;
            resultForPDF["cbTitlePolicyWillBeAmended"] = false;
            break;
          case true:
            resultForPDF["cbTitlePolicyWillBeAmended"] = true;
            resultForPDF["cbTitlePolicyWillNotBeAmended"] = false;
            break;
          default:
            resultForPDF["cbTitlePolicyWillBeAmended"] = false;
            resultForPDF["cbTitlePolicyWillNotBeAmended"] = false;
            break;
        }
        break;
      case "cbTitleAmendedAtBuyerExpense":
      case "cbTitleAmendedAtSellerExpense":
        switch (formData["title"]["standardExceptionsToBeAmendedBy"]) {
          case PartyType.BUYER:
            resultForPDF["cbTitleAmendedAtBuyerExpense"] = true;
            resultForPDF["cbTitleAmendedAtSellerExpense"] = false;
            break;
          case PartyType.SELLER:
            resultForPDF["cbTitleAmendedAtSellerExpense"] = true;
            resultForPDF["cbTitleAmendedAtBuyerExpense"] = false;
            break;
          default:
            resultForPDF["cbTitleAmendedAtSellerExpense"] = false;
            resultForPDF["cbTitleAmendedAtBuyerExpense"] = false;
            break;
        }
        break;
      case "propertyAddressPage3":
        resultForPDF[id] = joinAddress(formData["property"]);
        break;
      case "cbSurveySellerExisting":
      case "cbSurveyBuyerNew":
      case "cbSurveySellerNew":
        switch (formData["survey"]["type"]) {
          case SurveyType.EXISTINGBYSELLER:
            resultForPDF["cbSurveySellerExisting"] = true;
            resultForPDF["cbSurveyBuyerNew"] = false;
            resultForPDF["cbSurveySellerNew"] = false;
            break;
          case SurveyType.NEWBYBUYER:
            resultForPDF["cbSurveyBuyerNew"] = true;
            resultForPDF["cbSurveySellerExisting"] = false;
            resultForPDF["cbSurveySellerNew"] = false;
            break;
          case SurveyType.NEWBYSELLER:
            resultForPDF["cbSurveySellerNew"] = true;
            resultForPDF["cbSurveySellerExisting"] = false;
            resultForPDF["cbSurveyBuyerNew"] = false;
            break;
          default:
            resultForPDF["cbSurveySellerNew"] = false;
            resultForPDF["cbSurveySellerExisting"] = false;
            resultForPDF["cbSurveyBuyerNew"] = false;
            break;
        }
        break;
      case "surveySellerExistingDaysToDeliver":
        if (formData["survey"]["type"] === SurveyType.EXISTINGBYSELLER) {
          resultForPDF[id] = formData["survey"]["daysToDeliver"];
        }
        break;
      case "cbSurveySellerExistingReplacementSellerExpense":
      case "cbSurveySellerExistingReplacementBuyerExpense":
        if (formData["survey"]["type"] === SurveyType.EXISTINGBYSELLER) {
          switch (
            formData["survey"]["furnishingPartyIfExistingIsUnacceptable"]
          ) {
            case PartyType.BUYER:
              resultForPDF["cbSurveySellerExistingReplacementBuyerExpense"] =
                true;
              resultForPDF["cbSurveySellerExistingReplacementSellerExpense"] =
                false;
              break;
            case PartyType.SELLER:
              resultForPDF["cbSurveySellerExistingReplacementSellerExpense"] =
                true;
              resultForPDF["cbSurveySellerExistingReplacementBuyerExpense"] =
                false;
              break;
            default:
              resultForPDF["cbSurveySellerExistingReplacementSellerExpense"] =
                false;
              resultForPDF["cbSurveySellerExistingReplacementBuyerExpense"] =
                false;
              break;
          }
        }
        break;
      case "surveyBuyerNewDaysToDeliver":
        if (formData["survey"]["type"] === SurveyType.NEWBYBUYER) {
          resultForPDF[id] = formData["survey"]["daysToDeliver"];
        }
        break;
      case "surveySellerNewDaysToDeliver":
        if (formData["survey"]["type"] === SurveyType.NEWBYSELLER) {
          resultForPDF[id] = formData["survey"]["daysToDeliver"];
        }
        break;
      case "prohibitions6D":
        resultForPDF[id] = formData["titleObjections"]["objections"];
        break;
      case "prohibitions6DDaysToDeliver":
        resultForPDF[id] = formData["titleObjections"]["daysToObject"];
        break;
      case "cbIsInHOA":
        resultForPDF[id] =
          formData["homeownersAssociationAddendum"]["hasHomeownersAssociation"];
        break;
      case "cbIsNotInHOA":
        resultForPDF[id] =
          !formData["homeownersAssociationAddendum"][
            "hasHomeownersAssociation"
          ];
        break;
      case "propertyAddressPage4":
        resultForPDF[id] = joinAddress(formData["property"]);
        break;
      case "titleRequiredNoticesLine1":
        let requiredNoticeText = "";
        if (
          formData["homeownersAssociationAddendum"]["hasHomeownersAssociation"]
        ) {
          requiredNoticeText = "HOA";
        }
        if (formData["titleNotices"]["isInMUD"]) {
          requiredNoticeText += ", MUD";
        }
        if (formData["titleNotices"]["isInCoastalArea"]) {
          requiredNoticeText += ", Coastal Area";
        }
        if (formData["titleNotices"]["isInPublicImprovementDistrict"]) {
          requiredNoticeText += ", PID";
        }
        if (formData["titleNotices"]["isInPropaneServiceArea"]) {
          requiredNoticeText += ", Propane Service Area";
        }
        resultForPDF[id] = requiredNoticeText;
        break;
      case "cbBuyerHasReceivedSellerDisclosure":
        resultForPDF[id] =
          formData["propertyCondition"]["sellerDisclosureReceived"];
        break;
      case "cbBuyerHasNotReceivedSellerDisclosure":
        resultForPDF[id] =
          !formData["propertyCondition"]["sellerDisclosureReceived"];
        break;
      case "buyerHasNotReceivedSellerDisclosureDaysToDeliver":
        resultForPDF[id] =
          formData["propertyCondition"]["sellerDisclosureDaysToProduce"];
        break;
      case "cbSellerNotRequiredToDisclose":
        //TODO: check this, for now we will make false all of the time
        resultForPDF[id] = false;
        break;
      case "propertyAddressPage5":
        resultForPDF[id] = joinAddress(formData["property"]);
        break;
      case "cbBuyerAcceptsAsIs":
        resultForPDF[id] = formData["propertyCondition"]["buyerAcceptsAsIs"];
      case "cbBuyerAcceptsAsIsWithConditions":
        resultForPDF[id] =
          !formData["propertyCondition"]["buyerAcceptsAsIs"] &&
          formData["propertyCondition"]["buyerAcceptanceRepairSpecifics"] !==
            "";
        break;
      case "buyerAcceptsAsIsWithConditionsDetailsLine1":
        resultForPDF[id] =
          formData["propertyCondition"]["buyerAcceptanceRepairSpecifics"];
        break;
      case "serviceContractReimbursementAmount":
        resultForPDF[id] =
          formData["propertyCondition"]["serviceContractReimbursementAmount"];
        break;
      case "brokerDisclosureLine1":
        let brokerDisclosures = [];
        if (formData["brokerDisclosure"]["buyerIsThirdPartyAgent"]) {
          brokerDisclosures.push("Buyer is a third party agent");
        }
        if (formData["brokerDisclosure"]["buyerIsRelatedToSeller"]) {
          brokerDisclosures.push("Buyer is related to seller");
        }
        if (formData["brokerDisclosure"]["buyerHasStakeInProperty"]) {
          brokerDisclosures.push("Buyer has a stake in the property");
        }
        resultForPDF[id] = brokerDisclosures.join(", ");
        break;
      case "closingDayAndMonth":
        let date = formData["closing"]["closingDate"] || "";
        const month = getMonthName(date.split("-")[1] - 1);
        const day = date.split("-")[2];
        resultForPDF[id] = `${month} ${day}`;
        break;
      case "closingYearLastTwoDigits":
        let date2 = formData["closing"]["closingDate"] || "";
        const yearLastTwoDigits = date2.split("-")[0].substring(2);
        resultForPDF[id] = yearLastTwoDigits;
        break;
      case "propertyAddressPage6":
        resultForPDF[id] = joinAddress(formData["property"]);
        break;
      case "cbBuyerPossessionAtCloseAndFund":
        resultForPDF[id] = formData["possession"]["possessionUponClosing"];
        break;
      case "cbBuyerPossessionAfterTemporaryLease":
        resultForPDF[id] =
          formData["possession"]["possessionAccordingToTempLease"];
        break;
      case "specialProvisionsLine1":
        resultForPDF[id] = formData["buyerProvisions"]["buyerProvisions"];
        break;
      case "sellerAdditionalExpense":
        resultForPDF[id] =
          formData["buyerProvisions"]["additionalExpensesPaidBySeller"];
        break;
      case "propertyAddressPage7":
        resultForPDF[id] = joinAddress(formData["property"]);
        break;
      case "propertyAddressPage8":
        resultForPDF[id] = joinAddress(formData["property"]);
        break;
      case "buyerStreetAddress":
        resultForPDF[id] = formData["buyerNotices"]["streetAddress"];
        break;
      case "buyerCityStateZip":
        resultForPDF[id] = `${formData["buyerNotices"]["city"]},  
          ${formData["buyerNotices"]["state"]} ${formData["buyerNotices"]["postalCode"]}`;
        break;
      case "buyerAreaCode":
        // get first three digits of phone
        if (formData["buyerNotices"]["deliverByPhone"]) {
          resultForPDF[id] = formData["buyerNotices"]["phone"].substring(0, 3);
        }
        break;
      case "buyerPhoneNumber":
        // get last seven digits of phone
        if (formData["buyerNotices"]["deliverByPhone"]) {
          resultForPDF[id] = formData["buyerNotices"]["phone"].substring(3);
        }
        break;
      case "buyerEmailFax1":
        if (formData["buyerNotices"]["deliverByEmailFax1"]) {
          resultForPDF[id] = formData["buyerNotices"]["emailFax1"];
        }
        break;
      case "buyerEmailFax2":
        if (formData["buyerNotices"]["deliverByEmailFax2"]) {
          resultForPDF[id] = formData["buyerNotices"]["emailFax2"];
        }
        break;
      case "buyerAttorneyName":
        if (formData["buyerAttorney"]["hasAttorney"]) {
          resultForPDF[id] = formData["buyerAttorney"]["name"];
        }
        break;
      case "buyerAttorneyAddress":
        if (formData["buyerAttorney"]["hasAttorney"]) {
          resultForPDF[id] = joinAddress(formData["buyerAttorney"]);
        }
        break;
      case "buyerAttorneyAreaCode":
        if (formData["buyerAttorney"]["hasAttorney"]) {
          // get first three digits of phone
          resultForPDF[id] = formData["buyerAttorney"]["phone"].substring(0, 3);
        }
        break;
      case "buyerAttorneyPhoneNumber":
        if (formData["buyerAttorney"]["hasAttorney"]) {
          // get last seven digits of phone
          resultForPDF[id] = formData["buyerAttorney"]["phone"].substring(3);
        }
        break;
      case "buyerAtrorneyFaxAreaCode":
        if (formData["buyerAttorney"]["hasAttorney"]) {
          // get first three digits of phone
          resultForPDF[id] = formData["buyerAttorney"]["fax"].substring(0, 3);
        }
        break;
      case "buyerAttorneyFaxNumber":
        if (formData["buyerAttorney"]["hasAttorney"]) {
          // get last seven digits of phone
          resultForPDF[id] = formData["buyerAttorney"]["fax"].substring(3);
        }
        break;
      case "buyerAttorneyEmail":
        if (formData["buyerAttorney"]["hasAttorney"]) {
          resultForPDF[id] = formData["buyerAttorney"]["email"];
        }
        break;
      case "propertyAddressPage9":
        resultForPDF[id] = joinAddress(formData["property"]);
        break;
    }
  }
  return resultForPDF;
}

export function mapAllHOAAddendumFields(formData: any) {
  const resultForPDF = {};
  for (let field of allHOAAddendumFields) {
    const { id, type } = field;
    switch (id) {
      case "propertyAddressStreetAndCity": {
        resultForPDF[id] = joinAddress(formData["property"]);
        break;
      }
      case "hoaNameAndPhoneNumber": {
        resultForPDF[id] =
          `${formData["homeownersAssociationAddendum"]["associationName"]} - ${formData["homeownersAssociationAddendum"]["associationPhoneNumber"]}`;
        break;
      }
      case "policyByBuyer":
      case "policyBySeller": {
        if (
          formData["homeownersAssociationAddendum"]["requiresSubdivisionInfo"]
        ) {
          const policyBy =
            formData["homeownersAssociationAddendum"][
              "subdivisionInfoProvidedBy"
            ];
          if (policyBy === PartyType.BUYER) {
            resultForPDF["policyByBuyer"] = true;
            resultForPDF["policyBySeller"] = false;
          } else {
            resultForPDF["policyByBuyer"] = false;
            resultForPDF["policyBySeller"] = true;
          }
        }
        break;
      }
      case "policyByBuyerDaysToDeliver": {
        if (
          formData["homeownersAssociationAddendum"]["requiresSubdivisionInfo"]
        ) {
          const policyBy =
            formData["homeownersAssociationAddendum"][
              "subdivisionInfoProvidedBy"
            ];
          if (policyBy === PartyType.BUYER) {
            resultForPDF[id] =
              formData["homeownersAssociationAddendum"][
                "subdivisionInfoDaysToDeliver"
              ];
          }
        }
        break;
      }
      case "policyBySellerDaysToDeliver": {
        if (
          formData["homeownersAssociationAddendum"]["requiresSubdivisionInfo"]
        ) {
          const policyBy =
            formData["homeownersAssociationAddendum"][
              "subdivisionInfoProvidedBy"
            ];
          if (policyBy === PartyType.SELLER) {
            resultForPDF[id] =
              formData["homeownersAssociationAddendum"][
                "subdivisionInfoDaysToDeliver"
              ];
          }
        }
        break;
      }
      case "policyAlreadyReceived": {
        resultForPDF[id] =
          formData["homeownersAssociationAddendum"]["receivedSubdivisionInfo"];
        break;
      }
      case "policyRequiresUpdatedResaleCert": {
        const receivedSubdivisionInfo =
          formData["homeownersAssociationAddendum"]["receivedSubdivisionInfo"];
        if (receivedSubdivisionInfo) {
          resultForPDF[id] =
            formData["homeownersAssociationAddendum"][
              "requiresUpdatedResaleCertificate"
            ];
        }
        break;
      }
      case "policyDoesNotRequireUpdatedResaleCert": {
        const receivedSubdivisionInfo =
          formData["homeownersAssociationAddendum"]["receivedSubdivisionInfo"];
        if (receivedSubdivisionInfo) {
          resultForPDF[id] =
            !formData["homeownersAssociationAddendum"][
              "requiresUpdatedResaleCertificate"
            ];
        }
        break;
      }
      case "policyNotNeeded": {
        resultForPDF[id] =
          !formData["homeownersAssociationAddendum"]["requiresSubdivisionInfo"];
        break;
      }
      case "transferFeesPaidByBuyer": {
        resultForPDF[id] =
          formData["homeownersAssociationAddendum"]["buyerFeesNotToExceed"];
        break;
      }
      case "addedInfoCostPaidByBuyer": {
        resultForPDF[id] =
          formData["homeownersAssociationAddendum"][
            "feeForTitleCompanyPaidBy"
          ] === PartyType.BUYER;
        break;
      }
      case "addedInfoCostPaidBySeller": {
        resultForPDF[id] =
          formData["homeownersAssociationAddendum"][
            "feeForTitleCompanyPaidBy"
          ] === PartyType.SELLER;
        break;
      }
    }
  }
  return resultForPDF;
}

export function mapAllThirdPartyFinanceAddendumFields(formData: any) {
  const resultForPDF = {};
  for (let field of allThirdPartyFinanceAddendumFields) {
    const { id, type } = field;
    switch (id) {
      case "propertyAddressStreetAndCity": {
        resultForPDF[id] = joinAddress(formData["property"]);
        break;
      }
      case "isConventionalLoan": {
        resultForPDF[id] =
          formData["finance"]["loanType"] === LoanType.CONVENTIONAL;
        break;
      }
      case "propertyAddressPage2": {
        resultForPDF[id] = joinAddress(formData["property"]);
        break;
      }
      case "isConventionalFirstMortgage": {
        const isConventionalLoan =
          formData["finance"]["loanType"] == LoanType.CONVENTIONAL;
        if (isConventionalLoan) {
          resultForPDF[id] = formData["finance"]["isSecondMortgage"] === false;
        }
        break;
      }
      case "conventionalFirstPrincipal": {
        const isConventionalLoan =
          formData["finance"]["loanType"] == LoanType.CONVENTIONAL;
        const isFirstMortgage =
          formData["finance"]["isSecondMortgage"] === false;
        if (isConventionalLoan && isFirstMortgage) {
          resultForPDF[id] = formData["finance"]["principalAmount"];
        }
        break;
      }
      case "conventionalFirstNumberOfYears": {
        const isConventionalLoan =
          formData["finance"]["loanType"] == LoanType.CONVENTIONAL;
        const isFirstMortgage =
          formData["finance"]["isSecondMortgage"] === false;
        if (isConventionalLoan && isFirstMortgage) {
          resultForPDF[id] = formData["finance"]["termYears"];
        }
        break;
      }
      case "otherFinancingRateLength": {
        const isOtherLoan =
          formData["finance"]["loanType"] == LoanType.OTHERFINANCING;
        if (isOtherLoan) {
          resultForPDF[id] = formData["finance"]["termYears"];
        }
        break;
      }
      case "buyerApprovalDaysToNotifyOfFailure": {
        const isSubjectToBuyerApproval =
          formData["finance"]["isBuyerApprovalRequired"];
        if (isSubjectToBuyerApproval) {
          resultForPDF[id] = formData["finance"]["buyerApprovalNoticeDays"];
        }
        break;
      }
      case "conventionalFirstRateLength": {
        const isConventionalLoan =
          formData["finance"]["loanType"] == LoanType.CONVENTIONAL;
        const isFirstMortgage =
          formData["finance"]["isSecondMortgage"] === false;
        if (isConventionalLoan && isFirstMortgage) {
          resultForPDF[id] = formData["finance"]["interestRateYears"];
        }
        break;
      }
      case "conventionalSecondNumberOfYears": {
        const isConventionalLoan =
          formData["finance"]["loanType"] == LoanType.CONVENTIONAL;
        const isSecondMortgage = formData["finance"]["isSecondMortgage"];
        if (isConventionalLoan && isSecondMortgage) {
          resultForPDF[id] = formData["finance"]["termYears"];
        }
        break;
      }
      case "conventionalSecondRateLength": {
        const isConventionalLoan =
          formData["finance"]["loanType"] == LoanType.CONVENTIONAL;
        const isSecondMortgage = formData["finance"]["isSecondMortgage"];
        if (isConventionalLoan && isSecondMortgage) {
          resultForPDF[id] = formData["finance"]["interestRateYears"];
        }
        break;
      }
      case "vaNumberOfYears": {
        const isVALoan = formData["finance"]["loanType"] == LoanType.VA;
        if (isVALoan) {
          resultForPDF[id] = formData["finance"]["termYears"];
        }
        break;
      }
      case "fhaNumberOfYears": {
        const isFHALoan = formData["finance"]["loanType"] == LoanType.FHA;
        if (isFHALoan) {
          resultForPDF[id] = formData["finance"]["termYears"];
        }
        break;
      }
      case "fhaRateLength": {
        const isFHALoan = formData["finance"]["loanType"] == LoanType.FHA;
        if (isFHALoan) {
          resultForPDF[id] = formData["finance"]["interestRateYears"];
        }
        break;
      }
      case "vaGuaranteedNumberOfYears": {
        const isVALoan = formData["finance"]["loanType"] == LoanType.VA;
        if (isVALoan) {
          resultForPDF[id] = formData["finance"]["termYears"];
        }
        break;
      }
      case "vaGuaranteedRateLength": {
        const isVALoan = formData["finance"]["loanType"] == LoanType.VA;
        if (isVALoan) {
          resultForPDF[id] = formData["finance"]["interestRateYears"];
        }
        break;
      }
      case "usdaNumberOfYears": {
        const isUSDALoan =
          formData["finance"]["loanType"] == LoanType.USDAGUARANTEED;
        if (isUSDALoan) {
          resultForPDF[id] = formData["finance"]["termYears"];
        }
        break;
      }
      case "reverseMortgageNumberOfYears": {
        const isReverseMortgage =
          formData["finance"]["loanType"] == LoanType.REVERSEMORTGAGE;
        if (isReverseMortgage) {
          resultForPDF[id] = formData["finance"]["termYears"];
        }
        break;
      }
      case "otherFinancingNumberOfYears": {
        const isOtherLoan =
          formData["finance"]["loanType"] == LoanType.OTHERFINANCING;
        if (isOtherLoan) {
          resultForPDF[id] = formData["finance"]["termYears"];
        }
        break;
      }
      case "otherFinancingRateNotToExceed": {
        const isOtherLoan =
          formData["finance"]["loanType"] == LoanType.OTHERFINANCING;
        if (isOtherLoan) {
          resultForPDF[id] = formData["finance"]["originationChargePercent"];
        }
        break;
      }
      case "isConventionalSecondMortgage": {
        const isConventionalLoan =
          formData["finance"]["loanType"] == LoanType.CONVENTIONAL;
        if (isConventionalLoan) {
          resultForPDF[id] = formData["finance"]["isSecondMortgage"];
        }
        break;
      }
      case "isVALoan": {
        resultForPDF[id] = formData["finance"]["loanType"] == LoanType.VA;
        break;
      }
      case "fhaVaLenderAppraisedValue": {
        const isFHALoan = formData["finance"]["loanType"] == LoanType.FHA;
        const isVALoan = formData["finance"]["loanType"] == LoanType.VA;
        if (isFHALoan || isVALoan) {
          resultForPDF[id] = formData["finance"]["fhaAppraisedValue"];
        }
        break;
      }
      case "isFHALoan": {
        resultForPDF[id] = formData["finance"]["loanType"] == LoanType.FHA;
        break;
      }
      case "isVAGuaranteedLoan": {
        resultForPDF[id] =
          formData["finance"]["loanType"] == LoanType.VAGUARANTEED;
        break;
      }
      case "isUSDAGuaranteedLoan": {
        resultForPDF[id] =
          formData["finance"]["loanType"] == LoanType.USDAGUARANTEED;
        break;
      }
      case "isReverseMortgageLoan": {
        resultForPDF[id] =
          formData["finance"]["loanType"] == LoanType.REVERSEMORTGAGE;
        break;
      }
      case "reverseMortgageWillBeFHAInsured": {
        const isReverseMortgage =
          formData["finance"]["loanType"] == LoanType.REVERSEMORTGAGE;
        if (isReverseMortgage) {
          resultForPDF[id] = formData["finance"]["reverseMortgageIsFHAInsured"];
        }
        break;
      }
      case "reverseMortgageWillNotBeFHAInsured": {
        const isReverseMortgage =
          formData["finance"]["loanType"] == LoanType.REVERSEMORTGAGE;
        if (isReverseMortgage) {
          resultForPDF[id] =
            !formData["finance"]["reverseMortgageIsFHAInsured"];
        }
        break;
      }
      case "isOtherFinancing": {
        resultForPDF[id] =
          formData["finance"]["loanType"] == LoanType.OTHERFINANCING;
        break;
      }
      case "otherFinancingLender": {
        const isOtherLoan =
          formData["finance"]["loanType"] == LoanType.OTHERFINANCING;
        if (isOtherLoan) {
          resultForPDF[id] = formData["finance"]["otherFinancingLenderName"];
        }
        break;
      }
      case "otherFinancingWaivesRightToTerminate": {
        const isOtherLoan =
          formData["finance"]["loanType"] == LoanType.OTHERFINANCING;
        if (isOtherLoan) {
          resultForPDF[id] = formData["finance"]["otherFinancingWaiveRights"];
        }
        break;
      }
      case "otherFinancingDoesNotWaiveRightToTerminate": {
        const isOtherLoan =
          formData["finance"]["loanType"] == LoanType.OTHERFINANCING;
        if (isOtherLoan) {
          resultForPDF[id] = !formData["finance"]["otherFinancingWaiveRights"];
        }
        break;
      }
      case "isNotSubjectToBuyerApproval": {
        resultForPDF[id] = !formData["finance"]["isBuyerApprovalRequired"];
        break;
      }
      case "isSubjectToBuyerApproval": {
        resultForPDF[id] = formData["finance"]["isBuyerApprovalRequired"];
        break;
      }
      case "fhaSection": {
        const isFHALoan = formData["finance"]["loanType"] == LoanType.FHA;
        if (isFHALoan) {
          resultForPDF[id] = formData["finance"]["fhaSectionNumber"];
        }
        break;
      }
      case "conventionalFirstRate": {
        const isConventionalLoan =
          formData["finance"]["loanType"] == LoanType.CONVENTIONAL;
        const isFirstMortgage =
          formData["finance"]["isSecondMortgage"] === false;
        if (isConventionalLoan && isFirstMortgage) {
          resultForPDF[id] = formData["finance"]["interestRate"];
        }
        break;
      }
      case "conventionalFirstRateNotToExceed": {
        const isConventionalLoan =
          formData["finance"]["loanType"] == LoanType.CONVENTIONAL;
        const isFirstMortgage =
          formData["finance"]["isSecondMortgage"] === false;
        if (isConventionalLoan && isFirstMortgage) {
          resultForPDF[id] = formData["finance"]["originationChargePercent"];
        }
        break;
      }
      case "conventionalSecondPrincipal": {
        const isConventionalLoan =
          formData["finance"]["loanType"] == LoanType.CONVENTIONAL;
        const isSecondMortgage = formData["finance"]["isSecondMortgage"];
        if (isConventionalLoan && isSecondMortgage) {
          resultForPDF[id] = formData["finance"]["principalAmount"];
        }
        break;
      }
      case "conventionalSecondRate": {
        const isConventionalLoan =
          formData["finance"]["loanType"] == LoanType.CONVENTIONAL;
        const isSecondMortgage = formData["finance"]["isSecondMortgage"];
        if (isConventionalLoan && isSecondMortgage) {
          resultForPDF[id] = formData["finance"]["interestRate"];
        }
        break;
      }
      case "vaPrincipal": {
        const isVALoan = formData["finance"]["loanType"] == LoanType.VA;
        if (isVALoan) {
          resultForPDF[id] = formData["finance"]["principalAmount"];
        }
        break;
      }
      case "conventionalSecondRateNotToExceed": {
        const isConventionalLoan =
          formData["finance"]["loanType"] == LoanType.CONVENTIONAL;
        const isSecondMortgage = formData["finance"]["isSecondMortgage"];
        if (isConventionalLoan && isSecondMortgage) {
          resultForPDF[id] = formData["finance"]["originationChargePercent"];
        }
        break;
      }
      case "fhaRateNotToExceed": {
        const isFHALoan = formData["finance"]["loanType"] == LoanType.FHA;
        if (isFHALoan) {
          resultForPDF[id] = formData["finance"]["originationChargePercent"];
        }
        break;
      }
      case "fhaPrincipal": {
        const isFHALoan = formData["finance"]["loanType"] == LoanType.FHA;
        if (isFHALoan) {
          resultForPDF[id] = formData["finance"]["principalAmount"];
        }
        break;
      }
      case "vaGuaranteedPrincipal": {
        const isVALoan = formData["finance"]["loanType"] == LoanType.VA;
        if (isVALoan) {
          resultForPDF[id] = formData["finance"]["principalAmount"];
        }
        break;
      }
      case "vaGuaranteedRate": {
        const isVALoan = formData["finance"]["loanType"] == LoanType.VA;
        if (isVALoan) {
          resultForPDF[id] = formData["finance"]["interestRate"];
        }
        break;
      }
      case "usdaPrincipal": {
        const isUSDALoan =
          formData["finance"]["loanType"] == LoanType.USDAGUARANTEED;
        if (isUSDALoan) {
          resultForPDF[id] = formData["finance"]["principalAmount"];
        }
        break;
      }
      case "vaGuaranteedRateNotToExceed": {
        const isVALoan = formData["finance"]["loanType"] == LoanType.VA;
        if (isVALoan) {
          resultForPDF[id] = formData["finance"]["originationChargePercent"];
        }
        break;
      }
      case "reverseMortgagePrincipal": {
        const isReverseMortgage =
          formData["finance"]["loanType"] == LoanType.REVERSEMORTGAGE;
        if (isReverseMortgage) {
          resultForPDF[id] = formData["finance"]["principalAmount"];
        }
        break;
      }
      case "usdaRate": {
        const isUSDALoan =
          formData["finance"]["loanType"] == LoanType.USDAGUARANTEED;
        if (isUSDALoan) {
          resultForPDF[id] = formData["finance"]["interestRate"];
        }
        break;
      }
      case "usdaRateNotToExceed": {
        const isUSDALoan =
          formData["finance"]["loanType"] == LoanType.USDAGUARANTEED;
        if (isUSDALoan) {
          resultForPDF[id] = formData["finance"]["originationChargePercent"];
        }
        break;
      }
      case "reverseMortgageRate": {
        const isReverseMortgage =
          formData["finance"]["loanType"] == LoanType.REVERSEMORTGAGE;
        if (isReverseMortgage) {
          resultForPDF[id] = formData["finance"]["interestRate"];
        }
        break;
      }
      case "reverseMortgageRateNotToExceed": {
        const isReverseMortgage =
          formData["finance"]["loanType"] == LoanType.REVERSEMORTGAGE;
        if (isReverseMortgage) {
          resultForPDF[id] = formData["finance"]["originationChargePercent"];
        }
        break;
      }
      case "otherFinancingPrincipal": {
        const isOtherLoan =
          formData["finance"]["loanType"] == LoanType.OTHERFINANCING;
        if (isOtherLoan) {
          resultForPDF[id] = formData["finance"]["principalAmount"];
        }
        break;
      }
      case "otherFinancingRate": {
        const isOtherLoan =
          formData["finance"]["loanType"] == LoanType.OTHERFINANCING;
        if (isOtherLoan) {
          resultForPDF[id] = formData["finance"]["interestRate"];
        }
        break;
      }
      case "fhaRate": {
        const isFHALoan = formData["finance"]["loanType"] == LoanType.FHA;
        if (isFHALoan) {
          resultForPDF[id] = formData["finance"]["interestRate"];
        }
        break;
      }
    }
  }
  return resultForPDF;
}

export function mapAllLenderAppraisalTerminationAddendumFields(formData: any) {
  const resultForPDF = {};
  for (let field of allLenderApprovalTerminationAddendumFields) {
    const { id, type } = field;
    switch (id) {
      case "propertyAddressAndCity": {
        resultForPDF[id] = joinAddress(formData["property"]);
        break;
      }
      case "terminationOptions": {
        const terminationOption =
          formData["finance"]["terminationOnAppraisalType"];
        switch (terminationOption) {
          case TerminationOnAppraisalType.PARTIALWAIVER:
            resultForPDF[id] = "Partial Waiver";
            break;
          case TerminationOnAppraisalType.ADDITIONALRIGHTTOTERMINATE:
            resultForPDF[id] = "Additional Right to Terminate";
            break;
          case TerminationOnAppraisalType.WAIVER:
            resultForPDF[id] = "Waiver";
            break;
        }
        break;
      }
      case "terminationOpinionOfValueAmount": {
        if (
          formData["finance"]["terminationOnAppraisalType"] ===
          TerminationOnAppraisalType.PARTIALWAIVER
        ) {
          resultForPDF[id] =
            formData["finance"]["terminationOpinionOfValueAmount"];
        }
        break;
      }
      case "terminationDaysAfterEffectiveDate": {
        if (
          formData["finance"]["terminationOnAppraisalType"] ===
          TerminationOnAppraisalType.ADDITIONALRIGHTTOTERMINATE
        ) {
          resultForPDF[id] =
            formData["finance"]["terminationDaysAfterEffectiveDate"];
        }
        break;
      }
      case "terminationAppraisedValueAmount": {
        if (
          formData["finance"]["terminationOnAppraisalType"] ===
          TerminationOnAppraisalType.ADDITIONALRIGHTTOTERMINATE
        ) {
          resultForPDF[id] =
            formData["finance"]["terminationAppraisedValueAmount"];
        }
        break;
      }
    }
  }
  return resultForPDF;
}

export function mapDatafinityResponseToPropertyData(propertyData: any) {
  // Try to extract lot, block, and legal description from various sources
  let lot = "";
  let block = "";
  let legalDescription = "";
  
  // First try: Check features array (if it exists)
  if (propertyData?.features && Array.isArray(propertyData.features)) {
    // Look for lot number in features
    const lotFeature = propertyData.features.find?.(
      (feature) => feature.key === "legalLotNumber1" || 
                   feature.key === "lotNumber" || 
                   feature.key === "lot"
    );
    if (lotFeature?.value?.[0]) {
      lot = String(lotFeature.value[0]);
    }
    
    // Look for block in features  
    const blockFeature = propertyData.features.find?.(
      (feature) => feature.key === "legalBlock1" || 
                   feature.key === "block" ||
                   feature.key === "legalBlock"
    );
    if (blockFeature?.value?.[0]) {
      block = String(blockFeature.value[0]);
    }
    
    // Look for legal description in features
    const legalFeature = propertyData.features.find?.(
      (feature) => feature.key === "legalDescription" || 
                   feature.key === "legal" ||
                   feature.key === "legalSubdivision"
    );
    if (legalFeature?.value?.[0]) {
      legalDescription = String(legalFeature.value[0]);
    }
    
    // Also check for additional legal fields
    const sectionFeature = propertyData.features.find?.(f => f.key === "legalSection");
    const townshipFeature = propertyData.features.find?.(f => f.key === "legalTownship");
    const rangeFeature = propertyData.features.find?.(f => f.key === "legalRange");
    
    // If we have section/township/range but no full legal description, build one
    if (!legalDescription && (sectionFeature || townshipFeature || rangeFeature)) {
      const parts = [];
      if (sectionFeature?.value?.[0]) parts.push(`Section ${sectionFeature.value[0]}`);
      if (townshipFeature?.value?.[0]) parts.push(`Township ${townshipFeature.value[0]}`);
      if (rangeFeature?.value?.[0]) parts.push(`Range ${rangeFeature.value[0]}`);
      if (parts.length > 0) {
        legalDescription = parts.join(", ");
      }
    }
  }
  
  // Second try: Check if legalDescription exists at root level
  if (!legalDescription && propertyData?.legalDescription) {
    legalDescription = propertyData.legalDescription;
  }
  
  // Third try: Look for legal description in descriptions array
  // Look for descriptions that contain "BLOCK" and "Lot" patterns or subdivision info
  if (propertyData?.descriptions && !legalDescription) {
    const legalDesc = propertyData.descriptions.find((desc) => {
      const value = desc.value || "";
      // Look for patterns like "BLOCK 1, Lot 16" or "LT 5 BLK 4" in descriptions
      return value.match(/(BLOCK|BLK)\s+\d+.*?(Lot|LT)\s+\d+/i) || 
             value.match(/(Lot|LT)\s+\d+.*?(BLOCK|BLK)\s+\d+/i) ||
             value.match(/^[A-Z0-9]+-.*BLOCK.*LOT/i); // Pattern like "S835100 - Riverwood At Oakhurst 01, BLOCK 1, Lot 16"
    });
    
    if (legalDesc) {
      // Use the legal description if found
      legalDescription = legalDesc.value;
      
      // Try to extract lot and block from the legal description if not already set
      if (!lot || !block) {
        // Handle both "BLOCK 1, Lot 16" and "LT 5 BLK 4" patterns
        const lotMatch = legalDescription.match(/(Lot|LT)\s+(\d+)/i);
        const blockMatch = legalDescription.match(/(BLOCK|BLK)\s+(\d+)/i);
        
        if (lotMatch && !lot) {
          lot = lotMatch[2];
        }
        if (blockMatch && !block) {
          block = blockMatch[2];
        }
      }
    }
  }
  
  // Fourth try: If still no legal description but we have subdivision, use that
  if (!legalDescription && propertyData?.subdivision) {
    legalDescription = propertyData.subdivision;
  }
  
  return {
    lot: lot,
    block: block,
    county: propertyData?.county || "",
    legalDescription: legalDescription,
    mlsNumber: propertyData?.mlsNumber || "",
    streetAddress: propertyData?.address || "",
    city: propertyData?.city || "",
    state: propertyData?.province || "",
    postalCode: propertyData?.postalCode || "",
    subdivision: propertyData.subdivision,
    yearBuilt: propertyData.yearBuilt,
    numBedroom: propertyData.numBedroom,
    numBathroom: propertyData.numBathroom,
    numFloor: propertyData.numFloor,
    floorSizeValue: propertyData.floorSizeValue,
    floorSizeUnit: propertyData.floorSizeUnit,
    lotSizeValue: propertyData.lotSizeValue,
    lotSizeUnit: propertyData.lotSizeUnit,
    mostRecentPriceAmount: propertyData.mostRecentPriceAmount,
    mostRecentPriceDate: propertyData.mostRecentPriceDate
      ? formatDate(propertyData.mostRecentPriceDate, "YYYY-MM-DD")
      : null,
    dateAdded: propertyData.dateAdded
      ? formatDate(propertyData.dateAdded, "YYYY-MM-DD")
      : null,
    dateUpdated: propertyData.dateUpdated
      ? formatDate(propertyData.dateUpdated, "YYYY-MM-DD")
      : null,
    description:
      propertyData?.descriptions?.sort(
        (a, b) =>
          new Date(b.dateSeen).getTime() - new Date(a.dateSeen).getTime(),
      )?.[0]?.value || "",
    imageUrl: propertyData.imageURLs?.[0] ?? "",
    imageUrls: propertyData.imageURLs ?? [],
  };
}

export function mapDatafinityResponseToSellerData(sellerData: any) {
  let ownerType = sellerData.currentOwnerType;
  if (!ownerType) {
    //check for title: "Owner" in peaple array
    const owner = sellerData?.people?.find(
      (person) => person.title === "Owner",
    );
    if (owner) {
      ownerType = "individual";
    }
  }

  if (ownerType?.toLowerCase() === "company") {
    const sellerCompany = sellerData?.features?.find?.(
      (feature) => feature.key === "seller_company",
    );
    if (sellerCompany) {
      return {
        primaryName: sellerCompany?.value[0],
        hasSecondaryParty: false,
      };
    }
  } else if (ownerType?.toLowerCase() === "individual") {
    const owners =
      sellerData?.people?.filter((person) => person.title === "Owner") || [];
    if (owners.length > 0) {
      // First check if owners have names
      if (owners[0]?.name || owners[1]?.name) {
        if (owners.length > 1) {
          return {
            primaryName: owners[0]?.name,
            hasSecondaryParty: true,
            secondaryName: owners[1]?.name,
          };
        } else {
          return {
            primaryName: owners[0]?.name,
            hasSecondaryParty: false,
          };
        }
      } else {
        // If owners don't have names, try to use seller_company feature
        const sellerCompany = sellerData?.features?.find?.(
          (feature) => feature.key === "seller_company",
        );
        if (sellerCompany?.value?.[0]) {
          return {
            primaryName: sellerCompany.value[0],
            hasSecondaryParty: false,
          };
        }
      }
      if (owners.length > 1) {
        return {
          primaryName: owners[0]?.name,
          hasSecondaryParty: true,
          secondaryName: owners[1]?.name,
        };
      } else {
        return {
          primaryName: owners[0]?.name,
          hasSecondaryParty: false,
        };
      }
    }
  }

  // Return default seller data if no owner information is found
  return {
    primaryName: "",
    hasSecondaryParty: false,
    secondaryName: "",
  };
}

/**
 * Determines if a property is currently for sale based on its status information
 * @param propertyData The property data from Datafinity response
 * @returns boolean indicating if the property is currently for sale
 */
export function isPropertyForSale(propertyData: any): boolean {
  // First priority: Check mostRecentStatus field
  if (propertyData.mostRecentStatus) {
    const status = propertyData.mostRecentStatus.toLowerCase();
    if (status === "for sale") {
      return true;
    }
    if (status === "sold") {
      return false;
    }
  }

  // Second priority: Check the statuses array
  if (propertyData?.statuses && propertyData.statuses.length > 0) {
    // Sort statuses by date (most recent first)
    const sortedStatuses = [...propertyData.statuses].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    const latestStatus = sortedStatuses[0];

    // Check if the latest status indicates the property is for sale
    if (latestStatus.type) {
      const status = latestStatus.type.toLowerCase();
      return (
        status === "for sale" ||
        status === "active" ||
        status === "new" ||
        status === "back on market" ||
        status === "price reduced"
      );
    }
  }

  // If we have an MLS number and recent dates, it might be an active listing
  const hasRecentMlsActivity =
    propertyData.mlsNumber &&
    propertyData.mostRecentStatusDate &&
    new Date(propertyData.mostRecentStatusDate) >
      new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); // Within last 90 days

  return hasRecentMlsActivity && !isPropertySold(propertyData);
}

/**
 * Helper function to determine if a property has been sold
 * @param propertyData The property data from Datafinity response
 * @returns boolean indicating if the property has been sold
 */
function isPropertySold(propertyData: any): boolean {
  // First priority: Check mostRecentStatus field
  if (propertyData.mostRecentStatus) {
    return propertyData.mostRecentStatus.toLowerCase() === "sold";
  }

  // Second priority: Check the statuses array
  if (propertyData?.statuses && propertyData.statuses.length > 0) {
    const mostRecentStatus = propertyData.statuses.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )[0];

    return (
      mostRecentStatus.type && mostRecentStatus.type.toLowerCase() === "sold"
    );
  }

  return false;
}

export function mapDatafinityResponseToBrokerData(brokerData: any) {
  // Add null checks to prevent errors when properties are undefined
  if (!brokerData) {
    return {
      listingAssociateName: "",
      firmName: "",
      listingAssociateEmail: "",
      listingAssociatePhone: "",
    };
  }

  // Find listing agent in people array as backup
  const people = brokerData.people || [];
  const listingAgent = people?.find(
    (p) => p?.title === "Listing Agent" && p?.name && p?.phone && p?.email,
  );

  return {
    // First priority: Use mostRecentBrokerAgent field
    listingAssociateName:
      brokerData?.mostRecentBrokerAgent || listingAgent?.name || "",

    // First priority: Use mostRecentBrokerCompany field
    firmName: brokerData?.mostRecentBrokerCompany || "",

    // First priority: Use mostRecentBrokerEmails array
    listingAssociateEmail:
      (brokerData?.mostRecentBrokerEmails &&
        brokerData.mostRecentBrokerEmails[0]) ||
      listingAgent?.email ||
      "",

    // First priority: Use mostRecentBrokerPhones array
    listingAssociatePhone:
      (brokerData?.mostRecentBrokerPhones &&
        brokerData.mostRecentBrokerPhones?.find(
          (p: string) => p && p.replace(/\D/g, "").length === 10,
        )) ||
      listingAgent?.phone ||
      "",
  };
}
