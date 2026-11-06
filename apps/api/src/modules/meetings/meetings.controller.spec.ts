import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { MeetingsController } from './meetings.controller';
import { MeetingsService } from './meetings.service';
import { TasksService } from '../tasks/tasks.service';
import { WorkspacesService } from '../workspaces/workspaces.service';
import { ProfilesService } from '../profiles/profiles.service';
import { MeetingCategory, MeetingStatus, TaskPriority } from '@corviin-hub/shared';

describe('MeetingsController & MeetingsService', () => {
  let controller: MeetingsController;
  let service: MeetingsService;
  let tasksService: TasksService;

  const TECH_WS = 'ws-tech-0001-0000-000000000001';
  const REAL_WS = 'ws-real-0002-0000-000000000002';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeetingsController],
      providers: [MeetingsService, TasksService, WorkspacesService, ProfilesService],
    }).compile();

    controller = module.get<MeetingsController>(MeetingsController);
    service = module.get<MeetingsService>(MeetingsService);
    tasksService = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(tasksService).toBeDefined();
  });

  describe('Meetings CRUD & Isolation', () => {
    it('returns seed meetings isolated by workspace', () => {
      const techRes = controller.getMeetings(TECH_WS);
      expect(techRes.data.length).toBeGreaterThanOrEqual(2);
      techRes.data.forEach((m) => expect(m.workspaceId).toBe(TECH_WS));

      const realRes = controller.getMeetings(REAL_WS);
      expect(realRes.data.length).toBeGreaterThanOrEqual(1);
      realRes.data.forEach((m) => expect(m.workspaceId).toBe(REAL_WS));
    });

    it('retrieves a meeting by ID and enforces workspace boundary', () => {
      const techRes = controller.getMeetingById('mtg-tech-001', TECH_WS);
      expect(techRes.data.id).toBe('mtg-tech-001');
      expect(techRes.data.title).toContain('Tech Architecture');

      // Attempt to access tech meeting from Real Estate workspace
      expect(() => controller.getMeetingById('mtg-tech-001', REAL_WS)).toThrow(NotFoundException);
    });

    it('creates a new meeting with valid time span', () => {
      const createRes = controller.createMeeting(
        {
          workspaceId: TECH_WS,
          title: 'Q4 Budget & Cloud Infrastructure Alignment',
          category: MeetingCategory.INTERNAL,
          date: '2026-11-10',
          startTime: '2026-11-10T14:00:00.000Z',
          endTime: '2026-11-10T15:00:00.000Z',
          organiserId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          participantIds: ['a1b2c3d4-e5f6-7890-abcd-ef1234567890'],
          meetingUrl: 'https://meet.google.com/crv-budget',
          agenda: 'Review cloud database costs and hosting tier allocations',
        },
        TECH_WS,
      );

      expect(createRes.data.id).toBeDefined();
      expect(createRes.data.status).toBe(MeetingStatus.SCHEDULED);
      expect(createRes.data.title).toBe('Q4 Budget & Cloud Infrastructure Alignment');
    });

    it('rejects meeting creation if end time is before or equal to start time', () => {
      expect(() =>
        controller.createMeeting(
          {
            workspaceId: TECH_WS,
            title: 'Invalid Meeting Times',
            category: MeetingCategory.INTERNAL,
            date: '2026-11-10',
            startTime: '2026-11-10T15:00:00.000Z',
            endTime: '2026-11-10T14:00:00.000Z',
            organiserId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          },
          TECH_WS,
        ),
      ).toThrow(BadRequestException);
    });

    it('updates meeting notes and decisions', () => {
      const updateRes = controller.updateMeeting(
        'mtg-tech-001',
        {
          notes: 'Zero-animation confirmed across all components.',
          decisions: ['Static dialog backdrop without transition delays.'],
        },
        TECH_WS,
      );

      expect(updateRes.data.notes).toBe('Zero-animation confirmed across all components.');
      expect(updateRes.data.decisions).toContain('Static dialog backdrop without transition delays.');
    });

    it('reschedules a meeting and records immutable audit reason', () => {
      const reschRes = controller.rescheduleMeeting(
        'mtg-tech-001',
        {
          newStartTime: '2026-11-05T14:00:00.000Z',
          newEndTime: '2026-11-05T15:00:00.000Z',
          reason: 'Client requested postponement due to product release conflict',
          actorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        },
        TECH_WS,
      );

      expect(reschRes.data.status).toBe(MeetingStatus.RESCHEDULED);
      expect(reschRes.data.startTime).toBe('2026-11-05T14:00:00.000Z');
      expect(reschRes.data.rescheduleHistory.length).toBe(1);
      expect(reschRes.data.rescheduleHistory[0].reason).toContain('Client requested postponement');
    });

    it('converts a meeting action item into a tracked shared task', () => {
      const convRes = controller.convertActionItem(
        'mtg-tech-001',
        {
          actionItemId: 'act-item-1',
          taskTitle: 'TRD Design Token Documentation',
          priority: TaskPriority.HIGH,
        },
        TECH_WS,
      );

      expect(convRes.data.actionItem.status).toBe('CONVERTED');
      expect(convRes.data.actionItem.convertedTaskId).toBeDefined();
      expect(convRes.data.task).toBeDefined();
      expect(convRes.data.task.title).toBe('TRD Design Token Documentation');
      expect(convRes.data.task.linkedRecord?.type).toBe('meeting');
      expect(convRes.data.task.linkedRecord?.id).toBe('mtg-tech-001');

      // Verify task exists in TasksService
      const fetchedTask = tasksService.findById(convRes.data.task.id, TECH_WS);
      expect(fetchedTask).toBeDefined();
      expect(fetchedTask.id).toBe(convRes.data.task.id);

      // Verify idempotency on repeated conversion click
      const repeatRes = controller.convertActionItem(
        'mtg-tech-001',
        {
          actionItemId: 'act-item-1',
          taskTitle: 'TRD Design Token Documentation',
        },
        TECH_WS,
      );
      expect(repeatRes.data.alreadyConverted).toBe(true);
      expect(repeatRes.data.task.id).toBe(convRes.data.task.id);
    });

    it('manages rich meeting details including agenda topics, preparation, and formal decisions', () => {
      const updateRes = controller.updateMeeting(
        'mtg-tech-001',
        {
          status: MeetingStatus.COMPLETED,
          agendaTopics: [
            { id: 'top-1', topic: 'Token contrast verification', completed: true },
            { id: 'top-2', topic: 'Zero animation sign-off', completed: true },
          ],
          preparation: {
            background: 'Full compliance review completed.',
            links: ['https://corviin.tech/docs/spec-14'],
          },
          formalDecisions: [
            {
              id: 'dec-approved',
              decisionText: 'Feature 14 implementation approved unanimously',
              createdByName: 'Anant',
              createdAt: '2026-11-05T11:00:00.000Z',
            },
          ],
          outcome: {
            outcomeSummary: 'Meeting adjourned with unanimous sign-off.',
            nextSteps: 'Proceed to client deployment.',
          },
        },
        TECH_WS,
      );

      expect(updateRes.data.status).toBe(MeetingStatus.COMPLETED);
      expect(updateRes.data.agendaTopics?.length).toBe(2);
      expect(updateRes.data.preparation?.background).toContain('compliance review');
      expect(updateRes.data.formalDecisions?.length).toBe(1);
      expect(updateRes.data.outcome?.outcomeSummary).toContain('unanimous sign-off');
      expect(updateRes.data.activity.some((a) => a.action === 'Meeting status updated')).toBe(true);
    });
  });

  describe('Real Estate Site Visits CRUD & Isolation', () => {
    it('returns seed site visits for Real Estate workspace', () => {
      const visitsRes = controller.getSiteVisits(REAL_WS);
      expect(visitsRes.data.length).toBeGreaterThanOrEqual(2);
      expect(visitsRes.data[0].buyerName).toBeDefined();
      expect(visitsRes.data[0].projectName).toBeDefined();
    });

    it('creates a new Real Estate site visit', () => {
      const createRes = controller.createSiteVisit(
        {
          workspaceId: REAL_WS,
          buyerName: 'Vikram Malhotra',
          buyerPhone: '+91 98112 34567',
          projectName: 'Azure Sky Villas',
          projectLocation: 'North Goa Waterfront',
          propertyUnit: 'Villa Ocean 04',
          visitDate: '2026-11-12',
          startTime: '2026-11-12T11:00:00.000Z',
          endTime: '2026-11-12T12:30:00.000Z',
          responsibleMemberId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          notes: 'Client interested in sea-facing corner unit with private pool.',
        },
        REAL_WS,
      );

      expect(createRes.data.id).toBeDefined();
      expect(createRes.data.buyerName).toBe('Vikram Malhotra');
      expect(createRes.data.propertyUnit).toBe('Villa Ocean 04');
      expect(createRes.data.status).toBe(MeetingStatus.SCHEDULED);
    });

    it('reschedules a site visit and records audit trail', () => {
      const reschRes = controller.rescheduleSiteVisit(
        'vis-re-001',
        {
          newStartTime: '2026-11-06T15:00:00.000Z',
          newEndTime: '2026-11-06T16:30:00.000Z',
          reason: 'Buyer flight delayed arriving from Dubai',
          actorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        },
        REAL_WS,
      );

      expect(reschRes.data.status).toBe(MeetingStatus.RESCHEDULED);
      expect(reschRes.data.startTime).toBe('2026-11-06T15:00:00.000Z');
      expect(reschRes.data.rescheduleHistory.length).toBe(1);
      expect(reschRes.data.rescheduleHistory[0].reason).toContain('Buyer flight delayed');
    });

    it('enforces workspace isolation on site visits', () => {
      expect(() => controller.getSiteVisitById('vis-re-001', TECH_WS)).toThrow(
        NotFoundException,
      );
    });
  });
});
