import { TechRecordCategory, TechPipelineStage } from '@corviin-hub/shared';

export const TECH_CATEGORY_LABELS: Record<TechRecordCategory, string> = {
  [TechRecordCategory.BUSINESS_CLIENT]: 'Business/Client',
  [TechRecordCategory.SOFTWARE_WEBSITE_ENQUIRY]: 'Software/Website Enquiry',
  [TechRecordCategory.AUTOMATION_ENQUIRY]: 'Automation Enquiry',
  [TechRecordCategory.POTENTIAL_PROJECT]: 'Potential Project',
  [TechRecordCategory.TECHNOLOGY_PARTNER]: 'Technology Partner',
  [TechRecordCategory.EXISTING_CLIENT]: 'Existing Client',
};

export const TECH_CATEGORY_COLORS: Record<TechRecordCategory, string> = {
  [TechRecordCategory.BUSINESS_CLIENT]: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800',
  [TechRecordCategory.SOFTWARE_WEBSITE_ENQUIRY]: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
  [TechRecordCategory.AUTOMATION_ENQUIRY]: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
  [TechRecordCategory.POTENTIAL_PROJECT]: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
  [TechRecordCategory.TECHNOLOGY_PARTNER]: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800',
  [TechRecordCategory.EXISTING_CLIENT]: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
};

export const TECH_STAGE_LABELS: Record<TechPipelineStage, string> = {
  [TechPipelineStage.NEW_ENQUIRY]: 'New Enquiry',
  [TechPipelineStage.CONTACT_PENDING]: 'Contact Pending',
  [TechPipelineStage.CONTACTED]: 'Contacted',
  [TechPipelineStage.REQUIREMENT_DISCUSSION]: 'Requirement Discussion',
  [TechPipelineStage.QUALIFIED]: 'Qualified',
  [TechPipelineStage.PROPOSAL_QUOTATION]: 'Proposal / Quotation',
  [TechPipelineStage.NEGOTIATION]: 'Negotiation',
  [TechPipelineStage.WON_CLIENT]: 'Won / Client',
  [TechPipelineStage.LOST]: 'Lost',
  [TechPipelineStage.FOLLOW_UP_LATER]: 'Follow Up Later',
};

export const TECH_STAGE_COLORS: Record<TechPipelineStage, string> = {
  [TechPipelineStage.NEW_ENQUIRY]: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  [TechPipelineStage.CONTACT_PENDING]: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
  [TechPipelineStage.CONTACTED]: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
  [TechPipelineStage.REQUIREMENT_DISCUSSION]: 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800',
  [TechPipelineStage.QUALIFIED]: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800',
  [TechPipelineStage.PROPOSAL_QUOTATION]: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800',
  [TechPipelineStage.NEGOTIATION]: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
  [TechPipelineStage.WON_CLIENT]: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700',
  [TechPipelineStage.LOST]: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
  [TechPipelineStage.FOLLOW_UP_LATER]: 'bg-stone-100 text-stone-700 border-stone-300 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700',
};

export const TECH_PIPELINE_STAGES_ORDER: TechPipelineStage[] = [
  TechPipelineStage.NEW_ENQUIRY,
  TechPipelineStage.CONTACT_PENDING,
  TechPipelineStage.CONTACTED,
  TechPipelineStage.REQUIREMENT_DISCUSSION,
  TechPipelineStage.QUALIFIED,
  TechPipelineStage.PROPOSAL_QUOTATION,
  TechPipelineStage.NEGOTIATION,
  TechPipelineStage.WON_CLIENT,
  TechPipelineStage.LOST,
  TechPipelineStage.FOLLOW_UP_LATER,
];

export const TECH_SERVICE_TYPES = [
  { value: 'WEB_DEVELOPMENT', label: 'Web Development & Storefront' },
  { value: 'MOBILE_APP', label: 'Mobile App (iOS/Android)' },
  { value: 'AUTOMATION_AI', label: 'Automation & AI Workflows' },
  { value: 'CLOUD_DEVOPS', label: 'Cloud Architecture & DevOps' },
  { value: 'CUSTOM_SOFTWARE', label: 'Custom Enterprise Software' },
  { value: 'UI_UX_DESIGN', label: 'UI/UX Design & Prototyping' },
  { value: 'MAINTENANCE_RETAINER', label: 'Managed Retainer & SLA' },
];

export const TECH_LEAD_SOURCES = [
  'Website',
  'Referral',
  'LinkedIn',
  'Inbound Call',
  'Partner',
  'Outbound',
  'Event / Conference',
  'Other',
];

