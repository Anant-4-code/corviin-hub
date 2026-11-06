import { RealEstatePartnerType, RealEstatePartnerStage } from '@corviin-hub/shared';

export const PARTNER_TYPE_LABELS: Record<RealEstatePartnerType, string> = {
  [RealEstatePartnerType.DEVELOPER]: 'Developer',
  [RealEstatePartnerType.BUILDER]: 'Builder',
  [RealEstatePartnerType.CONSTRUCTION_COMPANY]: 'Construction Company',
  [RealEstatePartnerType.LANDOWNER]: 'Landowner',
  [RealEstatePartnerType.CHANNEL_PARTNER]: 'Channel Partner',
  [RealEstatePartnerType.BROKER_AGENT]: 'Broker / Agent',
  [RealEstatePartnerType.OTHER_PARTNER]: 'Other Partner',
};

export const PARTNER_TYPE_BADGE_CLASSES: Record<RealEstatePartnerType, string> = {
  [RealEstatePartnerType.DEVELOPER]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  [RealEstatePartnerType.BUILDER]: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
  [RealEstatePartnerType.CONSTRUCTION_COMPANY]: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 border-orange-200 dark:border-orange-800',
  [RealEstatePartnerType.LANDOWNER]: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  [RealEstatePartnerType.CHANNEL_PARTNER]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  [RealEstatePartnerType.BROKER_AGENT]: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
  [RealEstatePartnerType.OTHER_PARTNER]: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700',
};

export const PARTNER_STAGE_ORDER: RealEstatePartnerStage[] = [
  RealEstatePartnerStage.NEW_PARTNER_LEAD,
  RealEstatePartnerStage.INITIAL_CONTACT,
  RealEstatePartnerStage.MEETING_PLANNED,
  RealEstatePartnerStage.REQUIREMENT_DISCUSSION,
  RealEstatePartnerStage.PROPOSAL_SERVICE_DETAILS,
  RealEstatePartnerStage.FOLLOWUP_NEGOTIATION,
  RealEstatePartnerStage.PARTNERSHIP_CONFIRMED,
  RealEstatePartnerStage.ACTIVE_PARTNER,
];

export const PARTNER_ALTERNATIVE_STAGES: RealEstatePartnerStage[] = [
  RealEstatePartnerStage.NOT_INTERESTED,
  RealEstatePartnerStage.LOST,
  RealEstatePartnerStage.FOLLOW_UP_LATER,
];

export const PARTNER_STAGE_LABELS: Record<RealEstatePartnerStage, string> = {
  [RealEstatePartnerStage.NEW_PARTNER_LEAD]: 'New Partner Lead',
  [RealEstatePartnerStage.INITIAL_CONTACT]: 'Initial Contact',
  [RealEstatePartnerStage.MEETING_PLANNED]: 'Meeting Planned',
  [RealEstatePartnerStage.REQUIREMENT_DISCUSSION]: 'Requirement Discussion',
  [RealEstatePartnerStage.PROPOSAL_SERVICE_DETAILS]: 'Proposal / Service Details',
  [RealEstatePartnerStage.FOLLOWUP_NEGOTIATION]: 'Follow-up / Negotiation',
  [RealEstatePartnerStage.PARTNERSHIP_CONFIRMED]: 'Partnership Confirmed',
  [RealEstatePartnerStage.ACTIVE_PARTNER]: 'Active Partner',
  [RealEstatePartnerStage.NOT_INTERESTED]: 'Not Interested',
  [RealEstatePartnerStage.LOST]: 'Lost',
  [RealEstatePartnerStage.FOLLOW_UP_LATER]: 'Follow Up Later',
};

export const PARTNER_STAGE_BADGE_CLASSES: Record<RealEstatePartnerStage, string> = {
  [RealEstatePartnerStage.NEW_PARTNER_LEAD]: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-700',
  [RealEstatePartnerStage.INITIAL_CONTACT]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  [RealEstatePartnerStage.MEETING_PLANNED]: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
  [RealEstatePartnerStage.REQUIREMENT_DISCUSSION]: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300 border-sky-200 dark:border-sky-800',
  [RealEstatePartnerStage.PROPOSAL_SERVICE_DETAILS]: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  [RealEstatePartnerStage.FOLLOWUP_NEGOTIATION]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
  [RealEstatePartnerStage.PARTNERSHIP_CONFIRMED]: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  [RealEstatePartnerStage.ACTIVE_PARTNER]: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-800 font-semibold',
  [RealEstatePartnerStage.NOT_INTERESTED]: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border-stone-200 dark:border-stone-700',
  [RealEstatePartnerStage.LOST]: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  [RealEstatePartnerStage.FOLLOW_UP_LATER]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800',
};

export const PARTNER_MARKETING_REQUIREMENTS = [
  'Sole Selling Mandate',
  'Digital Launch Campaign',
  '3D Visualization & VR Tours',
  'Drone Videography',
  'Performance Marketing',
  'Channel Partner Network Activation',
  'Sales CRM & Qualification Desk',
  'Model Apartment Walkthrough',
  'Eco-Living & ESG Branding',
  'JV Feasibility Advisory',
];

export const PARTNER_LEAD_SOURCES = [
  'Referral (Internal Network)',
  'Direct Inbound',
  'Corporate Alliance',
  'CREDAI / Industry Expo',
  'Cold Outreach',
  'Property Portal / Ads',
  'Channel Partner Sub-broker',
  'Other',
];
