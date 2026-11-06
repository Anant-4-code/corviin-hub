import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { CampaignsService } from '../campaigns/campaigns.service';
import { TasksService } from '../tasks/tasks.service';
import { WorkspacesService } from '../workspaces/workspaces.service';
import { ProfilesService } from '../profiles/profiles.service';
import { MeetingsService } from '../meetings/meetings.service';
import { ContentEventType, ContentPlatform, ContentStatus, MeetingCategory } from '@corviin-hub/shared';

describe('CalendarController & CampaignsService', () => {
  let controller: CalendarController;
  let calendarService: CalendarService;
  let campaignsService: CampaignsService;

  const TECH_WS = 'ws-tech-0001-0000-000000000001';
  const REAL_WS = 'ws-real-0002-0000-000000000002';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CalendarController],
      providers: [
        CalendarService,
        CampaignsService,
        TasksService,
        WorkspacesService,
        ProfilesService,
        MeetingsService,
      ],
    }).compile();

    controller = module.get<CalendarController>(CalendarController);
    calendarService = module.get<CalendarService>(CalendarService);
    campaignsService = module.get<CampaignsService>(CampaignsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(calendarService).toBeDefined();
    expect(campaignsService).toBeDefined();
  });

  describe('getContentCalendar', () => {
    it('returns aggregated items and overview metrics for Corviin Tech', () => {
      const response = controller.getContentCalendar({ workspaceId: TECH_WS });
      expect(response).toBeDefined();
      expect(response.items.length).toBeGreaterThan(0);
      expect(response.metrics.totalItems).toBe(response.items.length);
      expect(response.metrics.activeCampaigns).toBeGreaterThanOrEqual(1);

      // Verify projection includes both CAMPAIGN milestones and CONTENT_MILESTONE items
      const hasCampaign = response.items.some((i) => i.sourceType === 'CAMPAIGN');
      const hasContentEvent = response.items.some((i) => i.sourceType === 'CONTENT_MILESTONE');
      expect(hasCampaign).toBe(true);
      expect(hasContentEvent).toBe(true);
    });

    it('enforces strict workspace scoping between Tech and Real Estate', () => {
      const techRes = controller.getContentCalendar({ workspaceId: TECH_WS });
      const realRes = controller.getContentCalendar({ workspaceId: REAL_WS });

      expect(techRes.items.some((i) => i.campaignTitle?.includes('Corviin CRM v2.0'))).toBe(true);
      expect(techRes.items.some((i) => i.campaignTitle?.includes('Sobha Dream Acres'))).toBe(false);

      expect(realRes.items.some((i) => i.campaignTitle?.includes('Sobha Dream Acres'))).toBe(true);
      expect(realRes.items.some((i) => i.campaignTitle?.includes('Corviin CRM v2.0'))).toBe(false);
    });

    it('filters items by platform and eventType', () => {
      const filtered = controller.getContentCalendar({
        workspaceId: TECH_WS,
        platform: ContentPlatform.YOUTUBE,
      });

      expect(filtered.items.length).toBeGreaterThan(0);
      expect(filtered.items.every((i) => !i.platform || i.platform === ContentPlatform.YOUTUBE)).toBe(true);
    });

    it('throws BadRequestException when workspaceId is missing', () => {
      expect(() => controller.getContentCalendar({ workspaceId: '' })).toThrow(
        BadRequestException,
      );
    });
  });

  describe('rescheduleContentEvent', () => {
    it('reschedules a milestone, updating plannedDate and appending to rescheduleHistory', () => {
      const newDate = '2026-11-25T14:00:00.000Z';
      const reason = 'Speaker technical rehearsal rescheduled';

      const updated = controller.rescheduleContentEvent(TECH_WS, 'ev-tech-103', {
        newDate,
        reason,
        actorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      });

      expect(updated.plannedDate).toBe(newDate);
      expect(updated.rescheduleHistory.length).toBe(1);
      expect(updated.rescheduleHistory[0].reason).toBe(reason);
      expect(updated.rescheduleHistory[0].newDeadline).toBe(newDate);
    });

    it('throws NotFoundException when event belongs to another workspace', () => {
      expect(() =>
        controller.rescheduleContentEvent(TECH_WS, 'ev-re-101', {
          newDate: '2026-11-20T10:00:00.000Z',
          reason: 'Attempted cross-workspace update',
        }),
      ).toThrow(NotFoundException);
    });
  });

  describe('markContentPublished', () => {
    it('marks milestone as published and records live URL', () => {
      const publicUrl = 'https://youtube.com/watch?v=corviin-v2-launch';

      const published = controller.markContentPublished(TECH_WS, 'ev-tech-104', {
        publicUrl,
        actualPublishDate: '2026-11-19T18:00:00.000Z',
      });

      expect(published.status).toBe(ContentStatus.PUBLISHED);
      expect(published.publicUrl).toBe(publicUrl);
      expect(published.actualDate).toBe('2026-11-19T18:00:00.000Z');
    });
  });

  describe('getTeamTasksCalendar', () => {
    it('returns team tasks organized dynamically by active workspace members', () => {
      const result = controller.getTeamTasksCalendar({
        workspaceId: TECH_WS,
        date: '2026-11-05',
      });

      expect(result).toBeDefined();
      expect(result.members.length).toBeGreaterThanOrEqual(3);
      expect(result.members.some((m) => m.profileName === 'Anant')).toBe(true);
      expect(result.metrics.totalScheduled).toBeGreaterThanOrEqual(1);
    });

    it('strictly isolates team task calendar across workspaces', () => {
      const techRes = controller.getTeamTasksCalendar({
        workspaceId: TECH_WS,
        date: '2026-11-05',
      });
      const realRes = controller.getTeamTasksCalendar({
        workspaceId: REAL_WS,
        date: '2026-11-05',
      });

      const techTaskIds = techRes.members.flatMap((m) => m.tasks).map((t) => t.id);
      const realTaskIds = realRes.members.flatMap((m) => m.tasks).map((t) => t.id);

      expect(techTaskIds).toContain('tsk-tch-001');
      expect(techTaskIds).not.toContain('tsk-re-001');

      expect(realTaskIds).toContain('tsk-re-001');
      expect(realTaskIds).not.toContain('tsk-tch-001');
    });

    it('filters team tasks by specific member', () => {
      const result = controller.getTeamTasksCalendar({
        workspaceId: TECH_WS,
        date: '2026-11-05',
        memberId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      });

      const otherMembers = result.members.filter(
        (m) => m.profileId !== 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      );
      expect(otherMembers.every((m) => m.tasks.length === 0)).toBe(true);
    });

    it('throws BadRequestException when workspaceId or date is missing', () => {
      expect(() =>
        controller.getTeamTasksCalendar({ workspaceId: '', date: '2026-11-05' }),
      ).toThrow(BadRequestException);
      expect(() =>
        controller.getTeamTasksCalendar({ workspaceId: TECH_WS, date: '' }),
      ).toThrow(BadRequestException);
    });
  });

  describe('getMeetingsCalendar', () => {
    it('returns combined meetings and site visits with overview metrics', () => {
      const realRes = controller.getMeetingsCalendar({ workspaceId: REAL_WS });
      expect(realRes).toBeDefined();
      expect(realRes.items.length).toBeGreaterThanOrEqual(3);
      expect(realRes.metrics.totalScheduled).toBeGreaterThanOrEqual(2);
      expect(realRes.metrics.siteVisitsCount).toBeGreaterThanOrEqual(2);

      const hasSiteVisit = realRes.items.some((i) => i.sourceType === 'SITE_VISIT');
      const hasMeeting = realRes.items.some((i) => i.sourceType === 'MEETING');
      expect(hasSiteVisit).toBe(true);
      expect(hasMeeting).toBe(true);
    });

    it('filters meetings calendar by category', () => {
      const siteVisitsOnly = controller.getMeetingsCalendar({
        workspaceId: REAL_WS,
        category: MeetingCategory.SITE_VISIT,
      });

      expect(siteVisitsOnly.items.every((i) => i.sourceType === 'SITE_VISIT')).toBe(true);
    });

    it('throws BadRequestException if workspaceId is missing', () => {
      expect(() => controller.getMeetingsCalendar({ workspaceId: '' })).toThrow(
        BadRequestException,
      );
    });
  });
});

