import { PropertyConfig } from "./propertyConfig";
import { BuyersConfig } from "./buyersConfig";
import { SellersConfig } from "./sellersConfig";
import { FinanceConfig } from "./financeConfig";
import { LeasesConfig } from "./leasesConfig";
import { TitleConfig } from "./titleConfig";
import { ObjectionsConfig } from "./objectionsConfig";
import { TitleNoticesConfig } from "./titleNoticesConfig";
import { PropertyConditionConfig } from "./propertyConditionConfig";
import { BrokersDisclosureConfig } from "./brokersDisclosureConfig";
import { ClosingConfig } from "./closingConfig";
import { PossessionConfig } from "./possessionConfig";
import { BuyerProvisionsConfig } from "./buyerProvisionsConfig";
import { BuyerAttorneyConfig } from "./buyerAttorneyConfig";
import { SellerAgentConfig } from "./sellerAgentConfig";
import { BuyerNoticesConfig } from "./buyerNoticesConfig";
import { HomeownersAssociationAddendumConfig } from "./addendumHOAConfig";
import { SurveyConfig } from "./surveyConfig";

const sections = [
  "property",
  "buyers",
  "sellers",
  "finance",
  "leases",
  "title",
  "survey",
  "titleObjections",
  "titleNotices",
  "propertyCondition",
  "brokerDisclosure",
  "closing",
  "possession",
  "buyerProvisions",
  "buyerNotices",
  "buyerAttorney",
  "listingAgent",
  "homeownersAssociationAddendum",
];

// Return the pre-imported question config based on the current section
export const getCurrentQuestionConfig = (currentSectionSlug) => {
  switch (currentSectionSlug) {
    case "property":
      return PropertyConfig;
    case "buyers":
      return BuyersConfig;
    case "sellers":
      return SellersConfig;
    case "finance":
      return FinanceConfig;
    case "leases":
      return LeasesConfig;
    case "title":
      return TitleConfig;
    case "survey":
      return SurveyConfig;
    case "titleObjections":
      return ObjectionsConfig;
    case "titleNotices":
      return TitleNoticesConfig;
    case "propertyCondition":
      return PropertyConditionConfig;
    case "brokerDisclosure":
      return BrokersDisclosureConfig;
    case "closing":
      return ClosingConfig;
    case "possession":
      return PossessionConfig;
    case "buyerProvisions":
      return BuyerProvisionsConfig;
    case "buyerNotices":
      return BuyerNoticesConfig;
    case "buyerAttorney":
      return BuyerAttorneyConfig;
    case "listingAgent":
      return SellerAgentConfig;
    case "homeownersAssociationAddendum":
      return HomeownersAssociationAddendumConfig;
    default:
      throw new Error(`Unknown section slug: ${currentSectionSlug}`);
  }
};

export const getQuestionsForSection = (sectionSlug: string) => {
  const config = getCurrentQuestionConfig(sectionSlug);
  return Object.values(config);
};

export const getSectionByIndex = (index: number) => {
  return sections[index];
};

export const getIndexBySection = (section: string) => {
  return sections.indexOf(section);
};

export const getAllQuestions = () => {
  return sections.map((section) => {
    const questions = getQuestionsForSection(section).flat();

    return questions;
  });
};
