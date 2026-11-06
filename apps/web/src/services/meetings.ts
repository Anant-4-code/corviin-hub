import { api } from '@/lib/api';
import type {
  ApiResponse,
  MeetingItem,
  CreateMeetingDto,
  UpdateMeetingDto,
  RescheduleMeetingDto,
  ConvertActionItemToTaskDto,
  SiteVisitItem,
  CreateSiteVisitDto,
  UpdateSiteVisitDto,
  RescheduleSiteVisitDto,
  TaskItem,
} from '@corviin-hub/shared';

// ============================================================
// MEETINGS SERVICE
// ============================================================

export async function fetchMeetings(
  workspaceId: string,
  filter?: { category?: string; status?: string; memberId?: string; date?: string },
): Promise<MeetingItem[]> {
  const params = new URLSearchParams();
  params.set('workspaceId', workspaceId);
  if (filter?.category) params.set('category', filter.category);
  if (filter?.status) params.set('status', filter.status);
  if (filter?.memberId) params.set('memberId', filter.memberId);
  if (filter?.date) params.set('date', filter.date);

  const res = await api.get<ApiResponse<MeetingItem[]>>(`/meetings?${params.toString()}`);
  return res.data;
}

export async function fetchMeetingById(
  workspaceId: string,
  id: string,
): Promise<MeetingItem> {
  const res = await api.get<ApiResponse<MeetingItem>>(`/meetings/${id}?workspaceId=${workspaceId}`);
  return res.data;
}

export async function createMeeting(dto: CreateMeetingDto): Promise<MeetingItem> {
  const res = await api.post<ApiResponse<MeetingItem>>('/meetings', dto);
  return res.data;
}

export async function updateMeeting(
  workspaceId: string,
  id: string,
  dto: UpdateMeetingDto,
): Promise<MeetingItem> {
  const res = await api.patch<ApiResponse<MeetingItem>>(
    `/meetings/${id}?workspaceId=${workspaceId}`,
    dto,
  );
  return res.data;
}

export async function rescheduleMeeting(
  workspaceId: string,
  id: string,
  dto: RescheduleMeetingDto,
): Promise<MeetingItem> {
  const res = await api.post<ApiResponse<MeetingItem>>(
    `/meetings/${id}/reschedule?workspaceId=${workspaceId}`,
    dto,
  );
  return res.data;
}

export async function convertMeetingActionItem(
  workspaceId: string,
  id: string,
  dto: ConvertActionItemToTaskDto,
): Promise<{ actionItem: unknown; task: TaskItem }> {
  const res = await api.post<ApiResponse<{ actionItem: unknown; task: TaskItem }>>(
    `/meetings/${id}/convert-action-item?workspaceId=${workspaceId}`,
    dto,
  );
  return res.data;
}

// ============================================================
// REAL ESTATE SITE VISITS SERVICE
// ============================================================

export async function fetchSiteVisits(
  workspaceId: string,
  filter?: { status?: string; memberId?: string; date?: string },
): Promise<SiteVisitItem[]> {
  const params = new URLSearchParams();
  params.set('workspaceId', workspaceId);
  if (filter?.status) params.set('status', filter.status);
  if (filter?.memberId) params.set('memberId', filter.memberId);
  if (filter?.date) params.set('date', filter.date);

  const res = await api.get<ApiResponse<SiteVisitItem[]>>(
    `/meetings/site-visits?${params.toString()}`,
  );
  return res.data;
}

export async function fetchSiteVisitById(
  workspaceId: string,
  id: string,
): Promise<SiteVisitItem> {
  const res = await api.get<ApiResponse<SiteVisitItem>>(
    `/meetings/site-visits/${id}?workspaceId=${workspaceId}`,
  );
  return res.data;
}

export async function createSiteVisit(dto: CreateSiteVisitDto): Promise<SiteVisitItem> {
  const res = await api.post<ApiResponse<SiteVisitItem>>('/meetings/site-visits', dto);
  return res.data;
}

export async function updateSiteVisit(
  workspaceId: string,
  id: string,
  dto: UpdateSiteVisitDto,
): Promise<SiteVisitItem> {
  const res = await api.patch<ApiResponse<SiteVisitItem>>(
    `/meetings/site-visits/${id}?workspaceId=${workspaceId}`,
    dto,
  );
  return res.data;
}

export async function rescheduleSiteVisit(
  workspaceId: string,
  id: string,
  dto: RescheduleSiteVisitDto,
): Promise<SiteVisitItem> {
  const res = await api.post<ApiResponse<SiteVisitItem>>(
    `/meetings/site-visits/${id}/reschedule?workspaceId=${workspaceId}`,
    dto,
  );
  return res.data;
}

