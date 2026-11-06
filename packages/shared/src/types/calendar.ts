import { ContentEventType, ContentStatus, ContentPlatform, TaskPriority } from '../enums';

export type CalendarSourceType = 'CAMPAIGN' | 'CONTENT_MILESTONE' | 'TASK';

export type CalendarViewMode = 'MONTH' | 'WEEK' | 'DAY' | 'AGENDA';

export interface CalendarItemDto {
  id: string;
  sourceType: CalendarSourceType;
  sourceId: string;
  campaignId?: string;
  campaignTitle?: string;
  title: string;
  description?: string;
  eventType: ContentEventType | string;
  plannedDate: string; // ISO string
  actualDate?: string; // ISO string
  ownerId: string;
  status: ContentStatus | string;
  priority?: TaskPriority;
  platform?: ContentPlatform;
  isOverdue: boolean;
  publicUrl?: string;
  hasRescheduleHistory: boolean;
  rescheduleCount: number;
}

export interface CalendarContentFilterQuery {
  workspaceId: string;
  campaignId?: string;
  ownerId?: string;
  eventType?: string;
  status?: string;
  platform?: string;
  startDate?: string;
  endDate?: string;
}

export interface CalendarOverviewMetrics {
  totalItems: number;
  scheduledPosts: number;
  publishedPosts: number;
  overdueItems: number;
  activeCampaigns: number;
}

import { TaskItem } from './task';

export interface TeamMemberCalendarGroup {
  profileId: string;
  profileName: string;
  profileInitials: string;
  taskCount: number;
  urgentCount: number;
  overdueCount: number;
  inProgressCount: number;
  tasks: TaskItem[];
}

export interface TeamTasksCalendarResponse {
  selectedDate: string;
  members: TeamMemberCalendarGroup[];
  unassigned: {
    taskCount: number;
    tasks: TaskItem[];
  };
  metrics: {
    totalScheduled: number;
    totalOverdue: number;
    totalInProgress: number;
    totalCompleted: number;
  };
}

export interface TeamTasksCalendarQuery {
  workspaceId: string;
  date: string; // ISO date string (YYYY-MM-DD or full ISO)
  memberId?: string;
  status?: string;
  priority?: string;
  linkedRecordType?: string;
  overdueOnly?: boolean;
}

import { MeetingCategory, MeetingStatus } from '../enums';

export interface MeetingVisitCalendarItemDto {
  id: string;
  sourceType: 'MEETING' | 'SITE_VISIT';
  sourceId: string;
  title: string;
  category: MeetingCategory;
  status: MeetingStatus;
  date: string;
  startTime: string; // ISO datetime
  endTime: string; // ISO datetime
  organiserId?: string;
  responsibleMemberId?: string;
  participantIds?: string[];
  externalParticipants?: string[];
  location?: string;
  meetingUrl?: string;
  phoneNumber?: string;
  buyerName?: string;
  projectName?: string;
  projectLocation?: string;
  propertyUnit?: string;
  agenda?: string;
  notes?: string;
  linkedRecord?: {
    id: string;
    title: string;
    type: string;
  };
  isOverdue: boolean;
  hasRescheduleHistory: boolean;
  rescheduleCount: number;
}

export interface MeetingsCalendarFilterQuery {
  workspaceId: string;
  date?: string;
  category?: string;
  status?: string;
  memberId?: string;
  startDate?: string;
  endDate?: string;
}

export interface MeetingsOverviewMetrics {
  totalScheduled: number;
  onlineMeetingsCount: number;
  siteVisitsCount: number;
  completedCount: number;
  cancelledOrNoShowCount: number;
}

