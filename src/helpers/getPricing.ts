import { connect } from "@/dbConfig/dbConfig";
import PricingSettings from "@/models/pricingSettingsModel";

export interface Pricing {
  oaQuestions: number;
  resumeScreeningPremium: number;
  topInterviews: number;
  mockInterviews: number;
}

// Default prices (Instamojo minimum is ₹9)
const defaultPricing: Pricing = {
  oaQuestions: 10,
  resumeScreeningPremium: 10,
  topInterviews: 10,
  mockInterviews: 10,
};

export async function getPricing(): Promise<Pricing> {
  try {
    await connect();
    
    const pricing = await PricingSettings.findOne({ key: "pricing" });
    
    if (!pricing) {
      return defaultPricing;
    }

    return {
      oaQuestions: pricing.oaQuestions || defaultPricing.oaQuestions,
      resumeScreeningPremium: pricing.resumeScreeningPremium || defaultPricing.resumeScreeningPremium,
      topInterviews: pricing.topInterviews || defaultPricing.topInterviews,
      mockInterviews: pricing.mockInterviews || defaultPricing.mockInterviews,
    };
  } catch (error) {
    console.error("Error fetching pricing:", error);
    return defaultPricing;
  }
}
