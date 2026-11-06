import { api } from '@/lib/api';
import {
  CalendarItemDto,
  CalendarOverviewMetrics,
  CalendarContentFilterQuery,
  TeamTasksCalendarQuery,
  TeamTasksCalendarResponse,
  MeetingVisitCalendarItemDto,
  MeetingsCalendarFilterQuery,
  MeetingsOverviewMetrics,
  RescheduleContentEventDto,
  MarkContentPublishedDto,
} from '@corviin-hub/shared';

export interface CalendarContentResponse {
  items: CalendarItemDto[];
  metrics: CalendarOverviewMetrics;
}

export interface MeetingsCalendarResponse {
  items: MeetingVisitCalendarItemDto[];
  metrics: MeetingsOverviewMetrics;
}

export async function fetchContentCalendar(
  query: CalendarContentFilterQuery,
): Promise<CalendarContentResponse> {
  const params = new URLSearchParams();
  params.set('workspaceId', query.workspaceId);
  if (query.campaignId) params.set('campaignId', query.campaignId);
  if (query.ownerId) params.set('ownerId', query.ownerId);
  if (query.eventType) params.set('eventType', query.eventType);
  if (query.status) params.set('status', query.status);
  if (query.platform) params.set('platform', query.platform);
  if (query.startDate) params.set('startDate', query.startDate);
  if (query.endDate) params.set('endDate', query.endDate);

  return api.get<CalendarContentResponse>(
    `/calendar/content?${params.toString()}`,
  );
}

export async function fetchTeamTasksCalendar(
  query: TeamTasksCalendarQuery,
): Promise<TeamTasksCalendarResponse> {
  const params = new URLSearchParams();
  params.set('workspaceId', query.workspaceId);
  params.set('date', query.date);
  if (query.memberId) params.set('memberId', query.memberId);
  if (query.status) params.set('status', query.status);
  if (query.priority) params.set('priority', query.priority);
  if (query.linkedRecordType) params.set('linkedRecordType', query.linkedRecordType);
  if (query.overdueOnly) params.set('overdueOnly', 'true');

  return api.get<TeamTasksCalendarResponse>(
    `/calendar/team-tasks?${params.toString()}`,
  );
}

export async function fetchMeetingsCalendar(
  query: MeetingsCalendarFilterQuery,
): Promise<MeetingsCalendarResponse> {
  const params = new URLSearchParams();
  params.set('workspaceId', query.workspaceId);
  if (query.date) params.set('date', query.date);
  if (query.category) params.set('category', query.category);
  if (query.status) params.set('status', query.status);
  if (query.memberId) params.set('memberId', query.memberId);
  if (query.startDate) params.set('startDate', query.startDate);
  if (query.endDate) params.set('endDate', query.endDate);

  return api.get<MeetingsCalendarResponse>(
    `/calendar/meetings?${params.toString()}`,
  );
}

export async function rescheduleCalendarEvent(
  workspaceId: string,
  eventId: string,
  dto: RescheduleContentEventDto,
): Promise<void> {
  await api.post(`/calendar/content/reschedule?workspaceId=${workspaceId}&eventId=${eventId}`, dto);
}

export async function markCalendarEventPublished(
  workspaceId: string,
  eventId: string,
  dto: MarkContentPublishedDto,
): Promise<void> {
  await api.post(`/calendar/content/publish?workspaceId=${workspaceId}&eventId=${eventId}`, dto);
}
