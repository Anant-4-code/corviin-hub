import {
  RealEstateBuyerStage,
  BuyerPropertyConfiguration,
  BuyerPropertyType,
  BuyerBuyingTimeline,
  BuyerPurchasePurpose,
} from '@corviin-hub/shared';

export const BUYER_STAGE_ORDER: RealEstateBuyerStage[] = [
  RealEstateBuyerStage.NEW_ENQUIRY,
  RealEstateBuyerStage.CONTACT_PENDING,
  RealEstateBuyerStage.CONTACTED,
  RealEstateBuyerStage.REQUIREMENT_CAPTURED,
  RealEstateBuyerStage.QUALIFIED_BUYER,
  RealEstateBuyerStage.PROPERTY_SHARED,
  RealEstateBuyerStage.SITE_VISIT_PLANNED,
  RealEstateBuyerStage.SITE_VISIT_COMPLETED,
  RealEstateBuyerStage.FOLLOWUP_DISCUSSION,
  RealEstateBuyerStage.BOOKING_CONVERTED,
];

export const BUYER_ALTERNATIVE_STAGES: RealEstateBuyerStage[] = [
  RealEstateBuyerStage.NOT_INTERESTED,
  RealEstateBuyerStage.LOST,
  RealEstateBuyerStage.FOLLOW_UP_LATER,
];

export const BUYER_STAGE_LABELS: Record<RealEstateBuyerStage, string> = {
  [RealEstateBuyerStage.NEW_ENQUIRY]: 'New Enquiry',
  [RealEstateBuyerStage.CONTACT_PENDING]: 'Contact Pending',
  [RealEstateBuyerStage.CONTACTED]: 'Contacted',
  [RealEstateBuyerStage.REQUIREMENT_CAPTURED]: 'Requirement Captured',
  [RealEstateBuyerStage.QUALIFIED_BUYER]: 'Qualified Buyer',
  [RealEstateBuyerStage.PROPERTY_SHARED]: 'Property Shared',
  [RealEstateBuyerStage.SITE_VISIT_PLANNED]: 'Site Visit Planned',
  [RealEstateBuyerStage.SITE_VISIT_COMPLETED]: 'Site Visit Completed',
  [RealEstateBuyerStage.FOLLOWUP_DISCUSSION]: 'Follow-up / Discussion',
  [RealEstateBuyerStage.BOOKING_CONVERTED]: 'Booking / Converted',
  [RealEstateBuyerStage.NOT_INTERESTED]: 'Not Interested',
  [RealEstateBuyerStage.LOST]: 'Lost',
  [RealEstateBuyerStage.FOLLOW_UP_LATER]: 'Follow Up Later',
};

export const BUYER_STAGE_BADGE_CLASSES: Record<RealEstateBuyerStage, string> = {
  [RealEstateBuyerStage.NEW_ENQUIRY]: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-700',
  [RealEstateBuyerStage.CONTACT_PENDING]: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 border-orange-200 dark:border-orange-800',
  [RealEstateBuyerStage.CONTACTED]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  [RealEstateBuyerStage.REQUIREMENT_CAPTURED]: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
  [RealEstateBuyerStage.QUALIFIED_BUYER]: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
  [RealEstateBuyerStage.PROPERTY_SHARED]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  [RealEstateBuyerStage.SITE_VISIT_PLANNED]: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800 font-semibold',
  [RealEstateBuyerStage.SITE_VISIT_COMPLETED]: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300 border-teal-200 dark:border-teal-800 font-semibold',
  [RealEstateBuyerStage.FOLLOWUP_DISCUSSION]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
  [RealEstateBuyerStage.BOOKING_CONVERTED]: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 font-bold',
  [RealEstateBuyerStage.NOT_INTERESTED]: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border-stone-200 dark:border-stone-700',
  [RealEstateBuyerStage.LOST]: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  [RealEstateBuyerStage.FOLLOW_UP_LATER]: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300 border-violet-200 dark:border-violet-800',
};

export const BUYER_CONFIGURATION_LABELS: Record<BuyerPropertyConfiguration, string> = {
  [BuyerPropertyConfiguration.ONE_BHK]: '1 BHK',
  [BuyerPropertyConfiguration.TWO_BHK]: '2 BHK',
  [BuyerPropertyConfiguration.THREE_BHK]: '3 BHK',
  [BuyerPropertyConfiguration.FOUR_PLUS_BHK]: '4+ BHK',
  [BuyerPropertyConfiguration.VILLA]: 'Luxury Villa',
  [BuyerPropertyConfiguration.PLOT_LAND]: 'Plot / Land',
  [BuyerPropertyConfiguration.COMMERCIAL]: 'Commercial Space',
  [BuyerPropertyConfiguration.OTHER]: 'Other',
};

export const BUYER_PROPERTY_TYPE_LABELS: Record<BuyerPropertyType, string> = {
  [BuyerPropertyType.APARTMENT]: 'Apartment / Flat',
  [BuyerPropertyType.VILLA]: 'Villa / Bungalow',
  [BuyerPropertyType.PLOT]: 'Plot / Land Parcel',
  [BuyerPropertyType.PENTHOUSE]: 'Penthouse / Duplex',
  [BuyerPropertyType.COMMERCIAL]: 'Commercial / Retail',
};

export const BUYER_TIMELINE_LABELS: Record<BuyerBuyingTimeline, string> = {
  [BuyerBuyingTimeline.IMMEDIATE]: 'Immediate (< 15 days)',
  [BuyerBuyingTimeline.ONE_TO_THREE_MONTHS]: '1 - 3 Months',
  [BuyerBuyingTimeline.THREE_TO_SIX_MONTHS]: '3 - 6 Months',
  [BuyerBuyingTimeline.MORE_THAN_SIX_MONTHS]: '> 6 Months',
  [BuyerBuyingTimeline.EXPLORING]: 'Just Exploring / Undecided',
};

export const BUYER_PURPOSE_LABELS: Record<BuyerPurchasePurpose, string> = {
  [BuyerPurchasePurpose.END_USE]: 'Self Use / Primary Residence',
  [BuyerPurchasePurpose.INVESTMENT]: 'Investment / Rental Income',
  [BuyerPurchasePurpose.SECOND_HOME]: 'Second Home / Vacation Getaway',
};

export const BUYER_LEAD_SOURCES = [
  'Meta Ad Campaign (Facebook/Instagram)',
  'Google Search Ads',
  'Housing.com / 99acres Portal',
  'Direct Website Form',
  'Referral (Internal / Promoter)',
  'Channel Partner / Broker Sub-agent',
  'CREDAI / Property Expo',
  'Walk-in / Site Visit Inquiry',
  'NRI Showcase Webinar',
  'Other',
];

export function formatBudgetInr(amount?: number): string {
  if (!amount) return '—';
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    const lk = amount / 100000;
    return `₹${lk % 1 === 0 ? lk.toFixed(0) : lk.toFixed(1)} Lakhs`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatBudgetRange(min?: number, max?: number): string {
  if (!min && !max) return 'Budget on request';
  if (min && !max) return `From ${formatBudgetInr(min)}`;
  if (!min && max) return `Up to ${formatBudgetInr(max)}`;
  return `${formatBudgetInr(min)} - ${formatBudgetInr(max)}`;
}

export const formatInrBudgetRange = formatBudgetRange;
