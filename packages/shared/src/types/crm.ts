import {
  CrmType,
  CrmInteractionType,
  CrmFollowUpStatus,
  TaskPriority,
  TechRecordCategory,
  TechPipelineStage,
  RealEstatePartnerType,
  RealEstatePartnerStage,
  RealEstateBuyerStage,
  BuyerPropertyConfiguration,
  BuyerPropertyType,
  BuyerBuyingTimeline,
  BuyerPurchasePurpose,
} from '../enums';
import { AttachmentItem } from './index';
import { SiteVisitItem } from './site-visit';

export interface CrmFollowUpItem {
  id: string;
  workspaceId: string;
  recordId: string;
  recordType: CrmType;
  recordTitle: string;
  title: string;
  assignedMemberId: string;
  assignedMemberName: string;
  dueDate: string; // ISO string
  status: CrmFollowUpStatus;
  priority?: TaskPriority;
  completedAt?: string;
  completedBy?: string;
  completionNotes?: string;
  linkedTaskId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CrmInteractionItem {
  id: string;
  workspaceId: string;
  recordId: string;
  recordType: CrmType;
  type: CrmInteractionType;
  title: string;
  description?: string;
  actorId: string;
  actorName: string;
  timestamp: string; // ISO string
  metadata?: Record<string, any>;
}

export interface CrmRecordSummaryItem {
  id: string;
  workspaceId: string;
  type: CrmType;
  name: string;
  company?: string;
  phone: string;
  email?: string;
  stage: string;
  assignedMemberId: string;
  assignedMemberName: string;
  nextFollowUpDate?: string;
  nextFollowUpTitle?: string;
  lastActivityDate: string;
  requirementSummary: string;
  estimatedValue?: number;
  projectOrLocation?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TechCrmMetrics {
  openEnquiriesCount: number;
  qualifiedLeadsCount: number;
  proposalsOutCount: number;
  activeClientsCount: number;
  techPartnersCount: number;
  pendingFollowUpsCount: number;
  overdueFollowUpsCount: number;
}

export interface RealEstateCrmMetrics {
  activeDevelopersCount: number;
  channelPartnersCount: number;
  activeBuyersCount: number;
  siteVisitsPendingCount: number;
  pendingFollowUpsCount: number;
  overdueFollowUpsCount: number;
}

export interface CrmOverviewResponseDto {
  workspaceId: string;
  workspaceType: 'TECH' | 'REAL_ESTATE';
  techMetrics?: TechCrmMetrics;
  realEstateMetrics?: RealEstateCrmMetrics;
  recentRecords: CrmRecordSummaryItem[];
  upcomingFollowUps: CrmFollowUpItem[];
  recentInteractions: CrmInteractionItem[];
}

export interface CrmSearchFilterDto {
  query?: string;
  recordType?: CrmType;
  stage?: string;
  assignedMemberId?: string;
  hasFollowUpDue?: boolean;
  overdueOnly?: boolean;
  page?: number;
  pageSize?: number;
}

export interface PaginatedCrmSearchResponseDto {
  items: CrmRecordSummaryItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateFollowUpDto {
  recordId: string;
  recordType: CrmType;
  title: string;
  dueDate: string;
  priority?: TaskPriority;
  assignedMemberId?: string;
  assignedMemberName?: string;
}

export interface CompleteFollowUpDto {
  completionNotes?: string;
  completedBy?: string;
}

export interface LogInteractionDto {
  recordId: string;
  recordType: CrmType;
  type: CrmInteractionType;
  title: string;
  description?: string;
  actorId?: string;
  actorName?: string;
  metadata?: Record<string, any>;
}

export interface QuickCreateCrmRecordDto {
  type: CrmType;
  name: string;
  company?: string;
  phone: string;
  email?: string;
  assignedMemberId?: string;
  assignedMemberName?: string;
  requirementSummary?: string;
  estimatedValue?: number;
  projectOrLocation?: string;
  notes?: string;
}

// ==========================================
// CORVIIN TECH CRM CONTRACTS (Feature 11)
// ==========================================

export interface TechStageHistoryEntry {
  stage: TechPipelineStage;
  timestamp: string;
  actorId: string;
  actorName: string;
  notes?: string;
}

export interface TechProposalRef {
  id: string;
  title: string;
  amount?: number;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED';
  sentAt?: string;
  referenceUrl?: string;
}

export interface TechProjectRef {
  id: string;
  name: string;
  status: string;
  startDate?: string;
}

export interface TechCrmRecord {
  id: string;
  workspaceId: string;
  name: string;
  company: string;
  phone: string;
  email?: string;
  category: TechRecordCategory;
  stage: TechPipelineStage;
  stageHistory: TechStageHistoryEntry[];
  source: string;
  assignedMemberId: string;
  assignedMemberName: string;
  serviceType?: string;
  requirementSummary: string;
  detailedRequirements?: string;
  estimatedBudget?: number;
  businessType?: string;
  website?: string;
  location?: string;
  notes?: string;
  lostReason?: string;
  followUpLaterDate?: string;
  convertedToClientId?: string;
  originalEnquiryId?: string;
  nextFollowUpDate?: string;
  nextFollowUpTitle?: string;
  lastActivityDate: string;
  proposals?: TechProposalRef[];
  projects?: TechProjectRef[];
  attachments: AttachmentItem[];
  createdAt: string;
  updatedAt: string;
}

export interface TechCrmSummaryDto {
  totalEnquiries: number;
  enquiriesByStage: Record<TechPipelineStage, number>;
  followUpsDueToday: number;
  overdueFollowUps: number;
  qualifiedOpportunities: number;
  wonClientsCount: number;
  lostCount: number;
  workloadByMember: Array<{
    memberId: string;
    memberName: string;
    activeCount: number;
    wonCount: number;
  }>;
}

export interface TechCrmFilterDto {
  category?: TechRecordCategory;
  stage?: TechPipelineStage;
  assignedMemberId?: string;
  source?: string;
  serviceType?: string;
  followUpFilter?: 'ALL' | 'TODAY' | 'OVERDUE' | 'THIS_WEEK';
  minBudget?: number;
  maxBudget?: number;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedTechRecordsResponseDto {
  items: TechCrmRecord[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateTechRecordDto {
  name?: string;
  company?: string;
  phone?: string;
  email?: string;
  category: TechRecordCategory;
  source: string;
  assignedMemberId: string;
  assignedMemberName?: string;
  serviceType?: string;
  requirementSummary: string;
  detailedRequirements?: string;
  estimatedBudget?: number;
  businessType?: string;
  website?: string;
  location?: string;
  notes?: string;
  initialStage?: TechPipelineStage;
}

export interface UpdateTechRecordDto {
  name?: string;
  company?: string;
  phone?: string;
  email?: string;
  category?: TechRecordCategory;
  source?: string;
  assignedMemberId?: string;
  assignedMemberName?: string;
  serviceType?: string;
  requirementSummary?: string;
  detailedRequirements?: string;
  estimatedBudget?: number;
  businessType?: string;
  website?: string;
  location?: string;
  notes?: string;
}

export interface ChangeTechStageDto {
  stage: TechPipelineStage;
  actorId?: string;
  actorName?: string;
  notes?: string;
  lostReason?: string;
  followUpLaterDate?: string;
}

export interface ConvertWonToClientDto {
  actorId?: string;
  actorName?: string;
  retainerAmount?: number;
  serviceAgreementDetails?: string;
  createProject?: boolean;
  projectName?: string;
}

export interface CheckDuplicatesDto {
  phone?: string;
  email?: string;
  company?: string;
  excludeId?: string;
}

export interface DuplicateMatchResult {
  matchedBy: 'phone' | 'email' | 'company';
  record: TechCrmRecord;
}

export interface CreateTechLinkedTaskDto {
  title: string;
  description?: string;
  deadline?: string;
  priority?: TaskPriority;
  assigneeId?: string;
}

export interface AddTechProposalDto {
  title: string;
  amount?: number;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED';
  referenceUrl?: string;
}

// ============================================================
// Real Estate Developers & Partners CRM Types
// ============================================================

export interface PartnerProjectRef {
  id: string;
  name: string;
  projectType?: 'RESIDENTIAL' | 'COMMERCIAL' | 'PLOTTED_DEVELOPMENT' | 'LUXURY_VILLAS' | 'MIXED_USE';
  location: string;
  reraNumber?: string;
  totalUnitsOrAcres?: string;
  status: 'UPCOMING' | 'UNDER_CONSTRUCTION' | 'READY_TO_MOVE' | 'COMPLETED';
  linkedCampaignIds?: string[];
}

export interface PartnerStageHistoryEntry {
  id: string;
  fromStage?: RealEstatePartnerStage;
  toStage: RealEstatePartnerStage;
  changedAt: string;
  actorId: string;
  actorName: string;
  notes?: string;
  lostReason?: string;
  followUpLaterDate?: string;
  mandateType?: string;
}

export interface RealEstatePartnerRecord {
  id: string;
  workspaceId: string;
  companyName: string;
  contactPerson?: string;
  phone: string;
  email?: string;
  partnerType: RealEstatePartnerType;
  stage: RealEstatePartnerStage;
  assignedMemberId: string;
  assignedMemberName: string;
  location?: string;
  website?: string;
  projects: PartnerProjectRef[];
  marketingRequirements?: string[];
  serviceRequirementsText?: string;
  partnershipInterest?: string;
  mandateSignedAt?: string;
  activeSince?: string;
  source?: string;
  notes?: string;
  tags?: string[];
  estimatedPortfolioValue?: number;
  nextFollowUpDate?: string;
  nextFollowUpTitle?: string;
  lastActivityDate: string;
  stageHistory: PartnerStageHistoryEntry[];
  linkedTaskIds?: string[];
  linkedMeetingIds?: string[];
  linkedCampaignIds?: string[];
  documents?: AttachmentItem[];
  createdAt: string;
  updatedAt: string;
}

export interface PartnerCrmSummaryDto {
  totalPartners: number;
  activePartners: number;
  confirmedPartners: number;
  leadsInPipeline: number;
  totalProjectsCount: number;
  overdueFollowUpsCount: number;
  byType: Record<RealEstatePartnerType, number>;
  byStage: Record<RealEstatePartnerStage, number>;
  byMember: Array<{
    memberId: string;
    memberName: string;
    totalAssigned: number;
    activeCount: number;
  }>;
}

export interface PartnerCrmFilterDto {
  search?: string;
  partnerType?: RealEstatePartnerType;
  stage?: RealEstatePartnerStage;
  assignedMemberId?: string;
  location?: string;
  projectName?: string;
  source?: string;
  followUpDue?: 'ALL' | 'TODAY' | 'OVERDUE' | 'THIS_WEEK';
  page?: number;
  pageSize?: number;
  sortBy?: 'companyName' | 'createdAt' | 'nextFollowUpDate' | 'stage';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedPartnerRecordsResponseDto {
  items: RealEstatePartnerRecord[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreatePartnerRecordDto {
  companyName: string;
  contactPerson?: string;
  phone: string;
  email?: string;
  partnerType: RealEstatePartnerType;
  assignedMemberId: string;
  assignedMemberName?: string;
  location?: string;
  website?: string;
  projectNames?: string[];
  initialProject?: {
    name: string;
    projectType?: 'RESIDENTIAL' | 'COMMERCIAL' | 'PLOTTED_DEVELOPMENT' | 'LUXURY_VILLAS' | 'MIXED_USE';
    location: string;
    reraNumber?: string;
    totalUnitsOrAcres?: string;
    status: 'UPCOMING' | 'UNDER_CONSTRUCTION' | 'READY_TO_MOVE' | 'COMPLETED';
  };
  marketingRequirements?: string[];
  serviceRequirementsText?: string;
  partnershipInterest?: string;
  source?: string;
  notes?: string;
  initialStage?: RealEstatePartnerStage;
}

export interface UpdatePartnerRecordDto {
  companyName?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  partnerType?: RealEstatePartnerType;
  assignedMemberId?: string;
  assignedMemberName?: string;
  location?: string;
  website?: string;
  marketingRequirements?: string[];
  serviceRequirementsText?: string;
  partnershipInterest?: string;
  source?: string;
  notes?: string;
}

export interface ChangePartnerStageDto {
  stage: RealEstatePartnerStage;
  actorId?: string;
  actorName?: string;
  notes?: string;
  lostReason?: string;
  followUpLaterDate?: string;
}

export interface ConfirmOrActivatePartnerDto {
  mode: 'CONFIRM' | 'ACTIVATE';
  actorId?: string;
  actorName?: string;
  mandateType?: string;
  notes?: string;
}

export interface AddPartnerProjectDto {
  name: string;
  projectType?: 'RESIDENTIAL' | 'COMMERCIAL' | 'PLOTTED_DEVELOPMENT' | 'LUXURY_VILLAS' | 'MIXED_USE';
  location: string;
  reraNumber?: string;
  totalUnitsOrAcres?: string;
  status: 'UPCOMING' | 'UNDER_CONSTRUCTION' | 'READY_TO_MOVE' | 'COMPLETED';
}

export interface CreatePartnerLinkedTaskDto {
  title: string;
  description?: string;
  deadline?: string;
  priority?: TaskPriority;
  assigneeId?: string;
}

export interface SchedulePartnerMeetingDto {
  title: string;
  scheduledAt: string;
  agenda?: string;
  projectId?: string;
  hostId?: string;
  attendees?: string[];
}

export interface CheckPartnerDuplicatesDto {
  phone?: string;
  email?: string;
  companyName?: string;
  excludeId?: string;
}

export interface PartnerDuplicateMatchResult {
  matchedBy: 'phone' | 'email' | 'companyName';
  record: RealEstatePartnerRecord;
}

// ============================================================
// Real Estate Buyers & Property Customers CRM Types
// ============================================================

export interface BuyerSharedPropertyRef {
  id: string;
  name: string;
  location: string;
  propertyType?: string;
  configuration?: string;
  priceEstimate?: number;
  sharedAt: string;
  feedback?: string;
}

export interface BuyerStageHistoryEntry {
  id: string;
  fromStage?: RealEstateBuyerStage;
  toStage: RealEstateBuyerStage;
  changedAt: string;
  actorId: string;
  actorName: string;
  notes?: string;
  lostReason?: string;
  followUpLaterDate?: string;
}

export interface RealEstateBuyerRecord {
  id: string;
  workspaceId: string;
  customerName: string;
  phone: string;
  email?: string;
  preferredContactMethod?: 'PHONE' | 'WHATSAPP' | 'EMAIL';
  stage: RealEstateBuyerStage;
  assignedMemberId: string;
  assignedMemberName: string;
  locality?: string;
  propertyType?: BuyerPropertyType;
  configuration?: BuyerPropertyConfiguration;
  minBudget?: number;
  maxBudget?: number;
  buyingTimeline?: BuyerBuyingTimeline;
  purpose?: BuyerPurchasePurpose;
  preferredProject?: string;
  sourceCampaign?: string;
  enquirySource: string;
  notes?: string;
  tags?: string[];
  nextFollowUpDate?: string;
  nextFollowUpTitle?: string;
  lastActivityDate: string;
  stageHistory: BuyerStageHistoryEntry[];
  sharedProperties: BuyerSharedPropertyRef[];
  siteVisitIds: string[];
  linkedTaskIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BuyerCrmSummaryDto {
  totalBuyers: number;
  activePipelineCount: number;
  siteVisitsPlannedCount: number;
  siteVisitsCompletedCount: number;
  bookingsConvertedCount: number;
  overdueFollowUpsCount: number;
  byStage: Record<RealEstateBuyerStage, number>;
  byConfiguration: Record<string, number>;
  byMember: Array<{
    memberId: string;
    memberName: string;
    totalAssigned: number;
    activeCount: number;
  }>;
}

export interface BuyerCrmFilterDto {
  search?: string;
  stage?: RealEstateBuyerStage;
  assignedMemberId?: string;
  locality?: string;
  configuration?: BuyerPropertyConfiguration;
  propertyType?: BuyerPropertyType;
  minBudget?: number;
  maxBudget?: number;
  buyingTimeline?: BuyerBuyingTimeline;
  preferredProject?: string;
  sourceCampaign?: string;
  siteVisitStatus?: string;
  followUpDue?: 'ALL' | 'TODAY' | 'OVERDUE' | 'THIS_WEEK';
  page?: number;
  pageSize?: number;
  sortBy?: 'customerName' | 'createdAt' | 'nextFollowUpDate' | 'stage';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedBuyerRecordsResponseDto {
  items: RealEstateBuyerRecord[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateBuyerRecordDto {
  customerName: string;
  phone: string;
  assignedMemberId: string;
  assignedMemberName?: string;
  enquirySource: string;
  email?: string;
  preferredContactMethod?: 'PHONE' | 'WHATSAPP' | 'EMAIL';
  locality?: string;
  propertyType?: BuyerPropertyType;
  configuration?: BuyerPropertyConfiguration;
  minBudget?: number;
  maxBudget?: number;
  buyingTimeline?: BuyerBuyingTimeline;
  purpose?: BuyerPurchasePurpose;
  preferredProject?: string;
  sourceCampaign?: string;
  notes?: string;
  initialStage?: RealEstateBuyerStage;
}

export interface UpdateBuyerRecordDto {
  customerName?: string;
  phone?: string;
  email?: string;
  preferredContactMethod?: 'PHONE' | 'WHATSAPP' | 'EMAIL';
  assignedMemberId?: string;
  assignedMemberName?: string;
  locality?: string;
  propertyType?: BuyerPropertyType;
  configuration?: BuyerPropertyConfiguration;
  minBudget?: number;
  maxBudget?: number;
  buyingTimeline?: BuyerBuyingTimeline;
  purpose?: BuyerPurchasePurpose;
  preferredProject?: string;
  sourceCampaign?: string;
  enquirySource?: string;
  notes?: string;
}

export interface ChangeBuyerStageDto {
  stage: RealEstateBuyerStage;
  actorId?: string;
  actorName?: string;
  notes?: string;
  lostReason?: string;
  followUpLaterDate?: string;
}

export interface ScheduleBuyerSiteVisitDto {
  projectName: string;
  projectLocation: string;
  propertyUnit?: string;
  visitDate: string; // YYYY-MM-DD
  startTime: string; // ISO string
  endTime: string; // ISO string
  responsibleMemberId?: string;
  notes?: string;
}

export interface UpdateBuyerSiteVisitStatusDto {
  status: string;
  feedback?: string;
  objections?: string;
  nextFollowUpDate?: string;
  notes?: string;
}

export interface ShareBuyerPropertyDto {
  name: string;
  location: string;
  propertyType?: string;
  configuration?: string;
  priceEstimate?: number;
  feedback?: string;
}

export interface CreateBuyerLinkedTaskDto {
  title: string;
  description?: string;
  deadline?: string;
  priority?: TaskPriority;
  assigneeId?: string;
}

export interface CheckBuyerDuplicatesDto {
  phone?: string;
  email?: string;
  customerName?: string;
  excludeId?: string;
}

export interface BuyerDuplicateMatchResult {
  matchedBy: 'phone' | 'email' | 'customerName';
  record: RealEstateBuyerRecord;
}




