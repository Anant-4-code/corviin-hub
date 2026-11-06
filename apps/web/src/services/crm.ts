import { api } from '@/lib/api';
import {
  CrmOverviewResponseDto,
  PaginatedCrmSearchResponseDto,
  CrmSearchFilterDto,
  CrmFollowUpItem,
  CrmFollowUpStatus,
  CreateFollowUpDto,
  CompleteFollowUpDto,
  LogInteractionDto,
  CrmInteractionItem,
  QuickCreateCrmRecordDto,
  CrmRecordSummaryItem,
  TechCrmSummaryDto,
  PaginatedTechRecordsResponseDto,
  TechCrmFilterDto,
  TechCrmRecord,
  CreateTechRecordDto,
  UpdateTechRecordDto,
  CheckDuplicatesDto,
  DuplicateMatchResult,
  ChangeTechStageDto,
  ConvertWonToClientDto,
  CreateTechLinkedTaskDto,
  AddTechProposalDto,
  TechProposalRef,
  RealEstatePartnerType,
  RealEstatePartnerStage,
  PartnerProjectRef,
  PartnerStageHistoryEntry,
  RealEstatePartnerRecord,
  PartnerCrmSummaryDto,
  PartnerCrmFilterDto,
  PaginatedPartnerRecordsResponseDto,
  CreatePartnerRecordDto,
  UpdatePartnerRecordDto,
  ChangePartnerStageDto,
  ConfirmOrActivatePartnerDto,
  AddPartnerProjectDto,
  CreatePartnerLinkedTaskDto,
  SchedulePartnerMeetingDto,
  CheckPartnerDuplicatesDto,
  PartnerDuplicateMatchResult,
  RealEstateBuyerStage,
  BuyerPropertyConfiguration,
  BuyerPropertyType,
  BuyerBuyingTimeline,
  BuyerPurchasePurpose,
  BuyerSharedPropertyRef,
  RealEstateBuyerRecord,
  BuyerCrmSummaryDto,
  BuyerCrmFilterDto,
  PaginatedBuyerRecordsResponseDto,
  CreateBuyerRecordDto,
  UpdateBuyerRecordDto,
  ChangeBuyerStageDto,
  ScheduleBuyerSiteVisitDto,
  ShareBuyerPropertyDto,
  CreateBuyerLinkedTaskDto,
  CheckBuyerDuplicatesDto,
  BuyerDuplicateMatchResult,
  SiteVisitItem,
} from '@corviin-hub/shared';

export async function fetchCrmOverview(workspaceId: string): Promise<CrmOverviewResponseDto> {
  return api.get<CrmOverviewResponseDto>(`/crm/overview?workspaceId=${workspaceId}`);
}

export async function searchCrmRecords(
  workspaceId: string,
  filter?: CrmSearchFilterDto,
): Promise<PaginatedCrmSearchResponseDto> {
  const params = new URLSearchParams();
  params.set('workspaceId', workspaceId);

  if (filter?.query) params.set('query', filter.query);
  if (filter?.recordType) params.set('recordType', filter.recordType);
  if (filter?.stage) params.set('stage', filter.stage);
  if (filter?.assignedMemberId) params.set('assignedMemberId', filter.assignedMemberId);
  if (filter?.page) params.set('page', String(filter.page));
  if (filter?.pageSize) params.set('pageSize', String(filter.pageSize));

  return api.get<PaginatedCrmSearchResponseDto>(`/crm/search?${params.toString()}`);
}

export async function createCrmRecord(
  workspaceId: string,
  dto: QuickCreateCrmRecordDto,
): Promise<CrmRecordSummaryItem> {
  return api.post<CrmRecordSummaryItem>(`/crm/records?workspaceId=${workspaceId}`, dto);
}

export async function fetchCrmFollowUps(
  workspaceId: string,
  status?: CrmFollowUpStatus,
): Promise<CrmFollowUpItem[]> {
  const params = new URLSearchParams({ workspaceId });
  if (status) params.set('status', status);
  return api.get<CrmFollowUpItem[]>(`/crm/follow-ups?${params.toString()}`);
}

export async function createCrmFollowUp(
  workspaceId: string,
  dto: CreateFollowUpDto,
): Promise<CrmFollowUpItem> {
  return api.post<CrmFollowUpItem>(`/crm/follow-ups?workspaceId=${workspaceId}`, dto);
}

export async function completeCrmFollowUp(
  workspaceId: string,
  id: string,
  dto: CompleteFollowUpDto,
): Promise<CrmFollowUpItem> {
  return api.patch<CrmFollowUpItem>(`/crm/follow-ups/${id}/complete?workspaceId=${workspaceId}`, dto);
}

export async function logCrmInteraction(
  workspaceId: string,
  dto: LogInteractionDto,
): Promise<CrmInteractionItem> {
  return api.post<CrmInteractionItem>(`/crm/interactions?workspaceId=${workspaceId}`, dto);
}

// ==========================================
// CORVIIN TECH CRM SERVICES (Feature 11)
// ==========================================

export async function fetchTechSummary(workspaceId: string): Promise<TechCrmSummaryDto> {
  return api.get<TechCrmSummaryDto>(`/crm/tech/summary?workspaceId=${workspaceId}`);
}

export async function fetchTechRecords(
  workspaceId: string,
  filter?: TechCrmFilterDto,
): Promise<PaginatedTechRecordsResponseDto> {
  const params = new URLSearchParams({ workspaceId });
  if (filter?.category) params.set('category', filter.category);
  if (filter?.stage) params.set('stage', filter.stage);
  if (filter?.assignedMemberId) params.set('assignedMemberId', filter.assignedMemberId);
  if (filter?.source) params.set('source', filter.source);
  if (filter?.serviceType) params.set('serviceType', filter.serviceType);
  if (filter?.followUpFilter) params.set('followUpFilter', filter.followUpFilter);
  if (filter?.minBudget !== undefined) params.set('minBudget', String(filter.minBudget));
  if (filter?.maxBudget !== undefined) params.set('maxBudget', String(filter.maxBudget));
  if (filter?.search) params.set('search', filter.search);
  if (filter?.page) params.set('page', String(filter.page));
  if (filter?.pageSize) params.set('pageSize', String(filter.pageSize));

  return api.get<PaginatedTechRecordsResponseDto>(`/crm/tech/records?${params.toString()}`);
}

export async function fetchTechRecordById(
  workspaceId: string,
  id: string,
): Promise<{
  record: TechCrmRecord;
  linkedTasks: any[];
  linkedMeetings: any[];
  followUps: CrmFollowUpItem[];
  interactions: CrmInteractionItem[];
}> {
  return api.get(`/crm/tech/records/${id}?workspaceId=${workspaceId}`);
}

export async function createTechRecord(
  workspaceId: string,
  dto: CreateTechRecordDto,
): Promise<TechCrmRecord> {
  return api.post<TechCrmRecord>(`/crm/tech/records?workspaceId=${workspaceId}`, dto);
}

export async function updateTechRecord(
  workspaceId: string,
  id: string,
  dto: UpdateTechRecordDto,
): Promise<TechCrmRecord> {
  return api.patch<TechCrmRecord>(`/crm/tech/records/${id}?workspaceId=${workspaceId}`, dto);
}

export async function checkTechDuplicates(
  workspaceId: string,
  dto: CheckDuplicatesDto,
): Promise<DuplicateMatchResult | null> {
  return api.post<DuplicateMatchResult | null>(`/crm/tech/check-duplicates?workspaceId=${workspaceId}`, dto);
}

export async function changeTechStage(
  workspaceId: string,
  id: string,
  dto: ChangeTechStageDto,
): Promise<TechCrmRecord> {
  return api.post<TechCrmRecord>(`/crm/tech/records/${id}/stage?workspaceId=${workspaceId}`, dto);
}

export async function convertWonToClient(
  workspaceId: string,
  id: string,
  dto: ConvertWonToClientDto,
): Promise<TechCrmRecord> {
  return api.post<TechCrmRecord>(`/crm/tech/records/${id}/convert-to-client?workspaceId=${workspaceId}`, dto);
}

export async function createTechLinkedTask(
  workspaceId: string,
  id: string,
  dto: CreateTechLinkedTaskDto,
): Promise<any> {
  return api.post(`/crm/tech/records/${id}/tasks?workspaceId=${workspaceId}`, dto);
}

export async function addTechProposal(
  workspaceId: string,
  id: string,
  dto: AddTechProposalDto,
): Promise<TechProposalRef> {
  return api.post<TechProposalRef>(`/crm/tech/records/${id}/proposals?workspaceId=${workspaceId}`, dto);
}

export async function addTechRequirementNote(
  workspaceId: string,
  id: string,
  note: string,
  actorId?: string,
  actorName?: string,
): Promise<CrmInteractionItem> {
  return api.post<CrmInteractionItem>(`/crm/tech/records/${id}/notes?workspaceId=${workspaceId}`, {
    note,
    actorId,
    actorName,
  });
}

// ============================================================
// Real Estate Developers & Partners CRM (Feature 12)
// ============================================================

export async function fetchPartnerSummary(workspaceId: string): Promise<PartnerCrmSummaryDto> {
  return api.get<PartnerCrmSummaryDto>(`/crm/partners/summary?workspaceId=${workspaceId}`);
}

export async function fetchPartnerRecords(
  workspaceId: string,
  filter?: PartnerCrmFilterDto,
): Promise<PaginatedPartnerRecordsResponseDto> {
  const params = new URLSearchParams();
  params.set('workspaceId', workspaceId);

  if (filter?.search) params.set('search', filter.search);
  if (filter?.partnerType) params.set('partnerType', filter.partnerType);
  if (filter?.stage) params.set('stage', filter.stage);
  if (filter?.assignedMemberId) params.set('assignedMemberId', filter.assignedMemberId);
  if (filter?.location) params.set('location', filter.location);
  if (filter?.projectName) params.set('projectName', filter.projectName);
  if (filter?.source) params.set('source', filter.source);
  if (filter?.followUpDue) params.set('followUpDue', filter.followUpDue);
  if (filter?.page) params.set('page', String(filter.page));
  if (filter?.pageSize) params.set('pageSize', String(filter.pageSize));
  if (filter?.sortBy) params.set('sortBy', filter.sortBy);
  if (filter?.sortOrder) params.set('sortOrder', filter.sortOrder);

  return api.get<PaginatedPartnerRecordsResponseDto>(`/crm/partners/records?${params.toString()}`);
}

export async function fetchPartnerRecordById(
  workspaceId: string,
  id: string,
): Promise<RealEstatePartnerRecord> {
  return api.get<RealEstatePartnerRecord>(`/crm/partners/records/${id}?workspaceId=${workspaceId}`);
}

export async function checkPartnerDuplicates(
  workspaceId: string,
  dto: CheckPartnerDuplicatesDto,
): Promise<PartnerDuplicateMatchResult[]> {
  return api.post<PartnerDuplicateMatchResult[]>(`/crm/partners/check-duplicates?workspaceId=${workspaceId}`, dto);
}

export async function createPartnerRecord(
  workspaceId: string,
  dto: CreatePartnerRecordDto,
): Promise<RealEstatePartnerRecord> {
  return api.post<RealEstatePartnerRecord>(`/crm/partners/records?workspaceId=${workspaceId}`, dto);
}

export async function updatePartnerRecord(
  workspaceId: string,
  id: string,
  dto: UpdatePartnerRecordDto,
): Promise<RealEstatePartnerRecord> {
  return api.patch<RealEstatePartnerRecord>(`/crm/partners/records/${id}?workspaceId=${workspaceId}`, dto);
}

export async function changePartnerStage(
  workspaceId: string,
  id: string,
  dto: ChangePartnerStageDto,
): Promise<RealEstatePartnerRecord> {
  return api.post<RealEstatePartnerRecord>(`/crm/partners/records/${id}/stage?workspaceId=${workspaceId}`, dto);
}

export async function confirmOrActivatePartner(
  workspaceId: string,
  id: string,
  dto: ConfirmOrActivatePartnerDto,
): Promise<RealEstatePartnerRecord> {
  return api.post<RealEstatePartnerRecord>(`/crm/partners/records/${id}/confirm-or-activate?workspaceId=${workspaceId}`, dto);
}

export async function addPartnerProject(
  workspaceId: string,
  id: string,
  dto: AddPartnerProjectDto,
): Promise<PartnerProjectRef> {
  return api.post<PartnerProjectRef>(`/crm/partners/records/${id}/projects?workspaceId=${workspaceId}`, dto);
}

export async function createPartnerLinkedTask(
  workspaceId: string,
  id: string,
  dto: CreatePartnerLinkedTaskDto,
): Promise<any> {
  return api.post(`/crm/partners/records/${id}/tasks?workspaceId=${workspaceId}`, dto);
}

export async function schedulePartnerMeeting(
  workspaceId: string,
  id: string,
  dto: SchedulePartnerMeetingDto,
): Promise<any> {
  return api.post(`/crm/partners/records/${id}/meetings?workspaceId=${workspaceId}`, dto);
}

export async function addPartnerInteraction(
  workspaceId: string,
  id: string,
  dto: { type: any; title: string; description?: string; actorId?: string; actorName?: string },
): Promise<CrmInteractionItem> {
  return api.post<CrmInteractionItem>(`/crm/partners/records/${id}/interactions?workspaceId=${workspaceId}`, dto);
}

// ============================================================
// Real Estate Buyers & Property Customers CRM (Feature 13)
// ============================================================

export async function fetchBuyerSummary(workspaceId: string): Promise<BuyerCrmSummaryDto> {
  return api.get<BuyerCrmSummaryDto>(`/crm/buyers/summary?workspaceId=${workspaceId}`);
}

export async function fetchBuyerRecords(
  workspaceId: string,
  filter?: BuyerCrmFilterDto,
): Promise<PaginatedBuyerRecordsResponseDto> {
  const params = new URLSearchParams();
  params.set('workspaceId', workspaceId);

  if (filter?.search) params.set('search', filter.search);
  if (filter?.stage) params.set('stage', filter.stage);
  if (filter?.assignedMemberId) params.set('assignedMemberId', filter.assignedMemberId);
  if (filter?.locality) params.set('locality', filter.locality);
  if (filter?.configuration) params.set('configuration', filter.configuration);
  if (filter?.propertyType) params.set('propertyType', filter.propertyType);
  if (filter?.minBudget) params.set('minBudget', String(filter.minBudget));
  if (filter?.maxBudget) params.set('maxBudget', String(filter.maxBudget));
  if (filter?.buyingTimeline) params.set('buyingTimeline', filter.buyingTimeline);
  if (filter?.preferredProject) params.set('preferredProject', filter.preferredProject);
  if (filter?.sourceCampaign) params.set('sourceCampaign', filter.sourceCampaign);
  if (filter?.followUpDue) params.set('followUpDue', filter.followUpDue);
  if (filter?.page) params.set('page', String(filter.page));
  if (filter?.pageSize) params.set('pageSize', String(filter.pageSize));
  if (filter?.sortBy) params.set('sortBy', filter.sortBy);
  if (filter?.sortOrder) params.set('sortOrder', filter.sortOrder);

  return api.get<PaginatedBuyerRecordsResponseDto>(`/crm/buyers/records?${params.toString()}`);
}

export async function fetchBuyerRecordById(
  workspaceId: string,
  id: string,
): Promise<RealEstateBuyerRecord> {
  return api.get<RealEstateBuyerRecord>(`/crm/buyers/records/${id}?workspaceId=${workspaceId}`);
}

export async function checkBuyerDuplicates(
  workspaceId: string,
  dto: CheckBuyerDuplicatesDto,
): Promise<BuyerDuplicateMatchResult[]> {
  return api.post<BuyerDuplicateMatchResult[]>(`/crm/buyers/check-duplicates?workspaceId=${workspaceId}`, dto);
}

export async function createBuyerRecord(
  workspaceId: string,
  dto: CreateBuyerRecordDto,
): Promise<RealEstateBuyerRecord> {
  return api.post<RealEstateBuyerRecord>(`/crm/buyers/records?workspaceId=${workspaceId}`, dto);
}

export async function updateBuyerRecord(
  workspaceId: string,
  id: string,
  dto: UpdateBuyerRecordDto,
): Promise<RealEstateBuyerRecord> {
  return api.patch<RealEstateBuyerRecord>(`/crm/buyers/records/${id}?workspaceId=${workspaceId}`, dto);
}

export async function changeBuyerStage(
  workspaceId: string,
  id: string,
  dto: ChangeBuyerStageDto,
): Promise<RealEstateBuyerRecord> {
  return api.post<RealEstateBuyerRecord>(`/crm/buyers/records/${id}/stage?workspaceId=${workspaceId}`, dto);
}

export async function scheduleBuyerSiteVisit(
  workspaceId: string,
  id: string,
  dto: ScheduleBuyerSiteVisitDto,
): Promise<SiteVisitItem> {
  return api.post<SiteVisitItem>(`/crm/buyers/records/${id}/site-visits?workspaceId=${workspaceId}`, dto);
}

export async function shareBuyerProperty(
  workspaceId: string,
  id: string,
  dto: ShareBuyerPropertyDto,
): Promise<BuyerSharedPropertyRef> {
  return api.post<BuyerSharedPropertyRef>(`/crm/buyers/records/${id}/shared-properties?workspaceId=${workspaceId}`, dto);
}

export async function createBuyerLinkedTask(
  workspaceId: string,
  id: string,
  dto: CreateBuyerLinkedTaskDto,
): Promise<any> {
  return api.post(`/crm/buyers/records/${id}/tasks?workspaceId=${workspaceId}`, dto);
}

export async function addBuyerInteraction(
  workspaceId: string,
  id: string,
  dto: { type: any; title: string; description?: string; actorId?: string; actorName?: string },
): Promise<CrmInteractionItem> {
  return api.post<CrmInteractionItem>(`/crm/buyers/records/${id}/interactions?workspaceId=${workspaceId}`, dto);
}




