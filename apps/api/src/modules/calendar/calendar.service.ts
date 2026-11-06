import { Injectable, BadRequestException } from '@nestjs/common';
import {
  CalendarItemDto,
  CalendarOverviewMetrics,
  CalendarContentFilterQuery,
  TeamTasksCalendarQuery,
  TeamTasksCalendarResponse,
  TeamMemberCalendarGroup,
  MeetingVisitCalendarItemDto,
  MeetingsCalendarFilterQuery,
  MeetingsOverviewMetrics,
  ContentEventType,
  ContentStatus,
  ContentPlatform,
  TaskPriority,
  TaskStatus,
  MeetingCategory,
  MeetingStatus,
} from '@corviin-hub/shared';
import { CampaignsService } from '../campaigns/campaigns.service';
import { TasksService } from '../tasks/tasks.service';
import { ProfilesService } from '../profiles/profiles.service';
import { MeetingsService } from '../meetings/meetings.service';

@Injectable()
export class CalendarService {
  constructor(
    private readonly campaignsService: CampaignsService,
    private readonly tasksService: TasksService,
    private readonly profilesService: ProfilesService,
    private readonly meetingsService: MeetingsService,
  ) {}

  getContentCalendar(query: CalendarContentFilterQuery): {
    items: CalendarItemDto[];
    metrics: CalendarOverviewMetrics;
  } {
    if (!query.workspaceId) {
      throw new BadRequestException('workspaceId is required');
    }

    const now = new Date();
    const campaigns = this.campaignsService.findAll(query.workspaceId);
    const tasks = this.tasksService.findAll(query.workspaceId, '', { mine: false });

    const items: CalendarItemDto[] = [];

    // 1. Project Campaign-level target milestones
    for (const campaign of campaigns) {
      const isOverdue =
        new Date(campaign.targetPublishDate) < now &&
        campaign.status !== ContentStatus.PUBLISHED;

      items.push({
        id: `cal-cmp-${campaign.id}`,
        sourceType: 'CAMPAIGN',
        sourceId: campaign.id,
        campaignId: campaign.id,
        campaignTitle: campaign.title,
        title: `Campaign Target: ${campaign.title}`,
        description: campaign.description,
        eventType: ContentEventType.CAMPAIGN_MILESTONE,
        plannedDate: campaign.targetPublishDate,
        actualDate: campaign.actualPublishDate,
        ownerId: campaign.ownerId,
        status: campaign.status,
        priority: campaign.priority,
        platform: campaign.platform,
        isOverdue,
        hasRescheduleHistory: campaign.rescheduleHistory.length > 0,
        rescheduleCount: campaign.rescheduleHistory.length,
      });

      // 2. Project Content Event milestones
      for (const event of campaign.contentItems) {
        const eventOverdue =
          new Date(event.plannedDate) < now &&
          event.status !== ContentStatus.PUBLISHED;

        items.push({
          id: `cal-evt-${event.id}`,
          sourceType: 'CONTENT_MILESTONE',
          sourceId: event.id,
          campaignId: campaign.id,
          campaignTitle: campaign.title,
          title: event.title,
          eventType: event.eventType,
          plannedDate: event.plannedDate,
          actualDate: event.actualDate,
          ownerId: event.ownerId,
          status: event.status,
          platform: event.platform,
          publicUrl: event.publicUrl,
          isOverdue: eventOverdue,
          hasRescheduleHistory: event.rescheduleHistory.length > 0,
          rescheduleCount: event.rescheduleHistory.length,
        });
      }
    }

    // 3. Project Campaign-linked tasks
    for (const task of tasks) {
      if (task.linkedRecord && task.linkedRecord.type === 'campaign') {
        const isOverdue =
          Boolean(task.deadline && new Date(task.deadline) < now) &&
          task.status !== TaskStatus.COMPLETED &&
          task.status !== TaskStatus.CANCELLED;

        items.push({
          id: `cal-tsk-${task.id}`,
          sourceType: 'TASK',
          sourceId: task.id,
          campaignId: task.linkedRecord.id,
          campaignTitle: task.linkedRecord.title,
          title: task.title,
          eventType: ContentEventType.CAMPAIGN_MILESTONE,
          plannedDate: task.plannedStart || task.deadline,
          actualDate: task.deadline,
          ownerId: task.assigneeId || 'unassigned',
          status: task.status,
          priority: task.priority,
          isOverdue,
          hasRescheduleHistory: task.rescheduleHistory.length > 0,
          rescheduleCount: task.rescheduleHistory.length,
        });
      }
    }

    // Filter by date range if provided
    let filteredItems = items;
    if (query.startDate && query.endDate) {
      const start = new Date(query.startDate).getTime();
      const end = new Date(query.endDate).getTime();
      filteredItems = filteredItems.filter((i) => {
        const itemDate = new Date(i.plannedDate).getTime();
        return itemDate >= start && itemDate <= end;
      });
    }

    // Filter by platform
    if (query.platform) {
      filteredItems = filteredItems.filter((i) => i.platform === query.platform);
    }

    // Filter by status
    if (query.status) {
      filteredItems = filteredItems.filter((i) => i.status === query.status);
    }

    // Filter by owner
    if (query.ownerId) {
      filteredItems = filteredItems.filter((i) => i.ownerId === query.ownerId);
    }

    // Sort chronologically by plannedDate
    filteredItems.sort(
      (a, b) => new Date(a.plannedDate).getTime() - new Date(b.plannedDate).getTime(),
    );

    // Compute Metrics across all workspace items
    const metrics: CalendarOverviewMetrics = {
      totalItems: items.length,
      scheduledPosts: items.filter(
        (i) => i.status === ContentStatus.PLANNED || i.status === ContentStatus.IN_PROGRESS,
      ).length,
      publishedPosts: items.filter((i) => i.status === ContentStatus.PUBLISHED || i.status === TaskStatus.COMPLETED).length,
      overdueItems: items.filter((i) => i.isOverdue).length,
      activeCampaigns: campaigns.filter(
        (c) => c.status !== ContentStatus.PUBLISHED && c.status !== ContentStatus.CANCELLED,
      ).length,
    };

    return {
      items: filteredItems,
      metrics,
    };
  }

  getTeamTasksCalendar(query: TeamTasksCalendarQuery): TeamTasksCalendarResponse {
    if (!query.workspaceId) {
      throw new BadRequestException('workspaceId is required');
    }

    const now = new Date();
    const targetDateStr = query.date || now.toISOString().slice(0, 10);

    // Fetch all workspace profiles and tasks
    const profiles = this.profilesService.findAll();
    const allTasks = this.tasksService.findAll(query.workspaceId, '', { mine: false });

    // Filter tasks active on targetDate or overdue
    let matchingTasks = allTasks.filter((task) => {
      const taskStart = task.plannedStart ? task.plannedStart.slice(0, 10) : null;
      const taskDue = task.deadline ? task.deadline.slice(0, 10) : null;

      const isScheduledToday =
        taskStart === targetDateStr ||
        taskDue === targetDateStr ||
        (taskStart && taskDue && targetDateStr >= taskStart && targetDateStr <= taskDue);

      const isOverdue =
        Boolean(task.deadline && new Date(task.deadline) < now) &&
        task.status !== TaskStatus.COMPLETED &&
        task.status !== TaskStatus.CANCELLED;

      if (query.overdueOnly) {
        return isOverdue;
      }

      return isScheduledToday || (isOverdue && targetDateStr === now.toISOString().slice(0, 10));
    });

    // Apply filters
    if (query.memberId) {
      matchingTasks = matchingTasks.filter((t) => t.assigneeId === query.memberId);
    }
    if (query.status) {
      matchingTasks = matchingTasks.filter((t) => t.status === query.status);
    }
    if (query.priority) {
      matchingTasks = matchingTasks.filter((t) => t.priority === query.priority);
    }
    if (query.linkedRecordType) {
      matchingTasks = matchingTasks.filter((t) => t.linkedRecord?.type === query.linkedRecordType);
    }

    // Group tasks dynamically by active workspace members
    const memberGroups: TeamMemberCalendarGroup[] = profiles.map((p) => {
      const memberTasks = matchingTasks.filter((t) => t.assigneeId === p.id);
      return {
        profileId: p.id,
        profileName: p.displayName,
        profileInitials: p.initials,
        taskCount: memberTasks.length,
        urgentCount: memberTasks.filter((t) => t.priority === TaskPriority.URGENT).length,
        overdueCount: memberTasks.filter(
          (t) =>
            Boolean(t.deadline && new Date(t.deadline) < now) &&
            t.status !== TaskStatus.COMPLETED &&
            t.status !== TaskStatus.CANCELLED,
        ).length,
        inProgressCount: memberTasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length,
        tasks: memberTasks,
      };
    });

    const unassignedTasks = matchingTasks.filter(
      (t) => !t.assigneeId || !profiles.some((p) => p.id === t.assigneeId),
    );

    const metrics = {
      totalScheduled: matchingTasks.length,
      totalOverdue: matchingTasks.filter(
        (t) =>
          Boolean(t.deadline && new Date(t.deadline) < now) &&
          t.status !== TaskStatus.COMPLETED &&
          t.status !== TaskStatus.CANCELLED,
      ).length,
      totalInProgress: matchingTasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length,
      totalCompleted: matchingTasks.filter((t) => t.status === TaskStatus.COMPLETED).length,
    };

    return {
      selectedDate: query.date,
      members: memberGroups,
      unassigned: {
        taskCount: unassignedTasks.length,
        tasks: unassignedTasks,
      },
      metrics,
    };
  }

  // ==========================================
  // MEETINGS & SITE VISITS CALENDAR
  // ==========================================

  getMeetingsCalendar(query: MeetingsCalendarFilterQuery): {
    items: MeetingVisitCalendarItemDto[];
    metrics: MeetingsOverviewMetrics;
  } {
    if (!query.workspaceId) {
      throw new BadRequestException('workspaceId is required');
    }

    const now = new Date();
    const items: MeetingVisitCalendarItemDto[] = [];

    // 1. Collect Meetings (unless category is specifically SITE_VISIT)
    if (!query.category || query.category !== MeetingCategory.SITE_VISIT) {
      const meetings = this.meetingsService.findAllMeetings(query.workspaceId, {
        category: query.category,
        status: query.status,
        memberId: query.memberId,
        date: query.date,
      });

      for (const m of meetings) {
        const isOverdue =
          new Date(m.endTime) < now &&
          m.status !== MeetingStatus.COMPLETED &&
          m.status !== MeetingStatus.CANCELLED;

        items.push({
          id: `cal-mtg-${m.id}`,
          sourceType: 'MEETING',
          sourceId: m.id,
          title: m.title,
          category: m.category,
          status: m.status,
          date: m.date,
          startTime: m.startTime,
          endTime: m.endTime,
          organiserId: m.organiserId,
          responsibleMemberId: m.organiserId,
          participantIds: m.participantIds,
          externalParticipants: m.externalParticipants,
          location: m.location,
          meetingUrl: m.meetingUrl,
          phoneNumber: m.phoneNumber,
          agenda: m.agenda,
          notes: m.notes,
          linkedRecord: m.linkedRecord,
          isOverdue,
          hasRescheduleHistory: m.rescheduleHistory.length > 0,
          rescheduleCount: m.rescheduleHistory.length,
        });
      }
    }

    // 2. Collect Site Visits (if category is unspecified or explicitly SITE_VISIT)
    if (!query.category || query.category === MeetingCategory.SITE_VISIT) {
      const siteVisits = this.meetingsService.findAllSiteVisits(query.workspaceId, {
        status: query.status,
        memberId: query.memberId,
        date: query.date,
      });

      for (const v of siteVisits) {
        const isOverdue =
          new Date(v.endTime) < now &&
          v.status !== MeetingStatus.COMPLETED &&
          v.status !== MeetingStatus.CANCELLED;

        items.push({
          id: `cal-vis-${v.id}`,
          sourceType: 'SITE_VISIT',
          sourceId: v.id,
          title: `${v.projectName} — ${v.buyerName}`,
          category: MeetingCategory.SITE_VISIT,
          status: v.status,
          date: v.visitDate,
          startTime: v.startTime,
          endTime: v.endTime,
          responsibleMemberId: v.responsibleMemberId,
          location: `${v.projectName}, ${v.projectLocation}`,
          phoneNumber: v.buyerPhone,
          buyerName: v.buyerName,
          projectName: v.projectName,
          projectLocation: v.projectLocation,
          propertyUnit: v.propertyUnit,
          notes: v.notes,
          isOverdue,
          hasRescheduleHistory: v.rescheduleHistory.length > 0,
          rescheduleCount: v.rescheduleHistory.length,
        });
      }
    }

    // Filter by date range if provided
    let filtered = items;
    if (query.startDate && query.endDate) {
      const start = new Date(query.startDate).getTime();
      const end = new Date(query.endDate).getTime();
      filtered = filtered.filter((i) => {
        const itemDate = new Date(i.startTime).getTime();
        return itemDate >= start && itemDate <= end;
      });
    }

    // Sort chronologically
    filtered.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    // Calculate overview metrics for workspace
    const metrics: MeetingsOverviewMetrics = {
      totalScheduled: items.filter(
        (i) =>
          i.status === MeetingStatus.SCHEDULED ||
          i.status === MeetingStatus.CONFIRMED ||
          i.status === MeetingStatus.RESCHEDULED,
      ).length,
      onlineMeetingsCount: items.filter(
        (i) => i.category === MeetingCategory.ONLINE || Boolean(i.meetingUrl),
      ).length,
      siteVisitsCount: items.filter((i) => i.sourceType === 'SITE_VISIT').length,
      completedCount: items.filter((i) => i.status === MeetingStatus.COMPLETED).length,
      cancelledOrNoShowCount: items.filter(
        (i) => i.status === MeetingStatus.CANCELLED || i.status === MeetingStatus.NO_SHOW,
      ).length,
    };

    return {
      items: filtered,
      metrics,
    };
  }
}
