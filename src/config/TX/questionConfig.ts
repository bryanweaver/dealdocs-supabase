import { BrokersDisclosureConfig } from "./brokersDisclosureConfig";
import { BuyerAttorneyConfig } from "./buyerAttorneyConfig";
import { BuyersConfig } from "./buyersConfig";
import { ClosingConfig } from "./closingConfig";
import { FinanceConfig } from "./financeConfig";
import { SurveyConfig } from "./surveyConfig";
import { LeasesConfig } from "./leasesConfig";
import { BuyerNoticesConfig } from "./buyerNoticesConfig";
import { ObjectionsConfig } from "./objectionsConfig";
import { PossessionConfig } from "./possessionConfig";
import { PropertyConfig } from "./propertyConfig";
import { PropertyConditionConfig } from "./propertyConditionConfig";
import { BuyerProvisionsConfig } from "./buyerProvisionsConfig";
import { SellerAgentConfig } from "./sellerAgentConfig";
import { SellersConfig } from "./sellersConfig";
import { TitleConfig } from "./titleConfig";
import { TitleNoticesConfig } from "./titleNoticesConfig";
import { HomeownersAssociationAddendumConfig } from "./addendumHOAConfig";

export const QuestionConfig = [
  ...PropertyConfig,
  ...BuyersConfig,
  ...SellersConfig,
  ...FinanceConfig,
  ...LeasesConfig,
  ...TitleConfig,
  ...SurveyConfig,
  ...ObjectionsConfig,
  ...TitleNoticesConfig,
  ...PropertyConditionConfig,
  ...BrokersDisclosureConfig,
  ...ClosingConfig,
  ...PossessionConfig,
  ...BuyerProvisionsConfig,
  ...BuyerNoticesConfig,
  ...BuyerAttorneyConfig,
  ...SellerAgentConfig,
  ...HomeownersAssociationAddendumConfig,
];

export const getQuestionsForSection = (sectionId: string) => {
  return QuestionConfig.filter((question) => question.sectionId === sectionId);
};
