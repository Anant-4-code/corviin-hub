import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { TasksService } from '../tasks/tasks.service';
import { PlansGoalsService } from '../plans-goals/plans-goals.service';
import { CampaignsService } from '../campaigns/campaigns.service';
import { MeetingsService } from '../meetings/meetings.service';
import { WorkspacesService } from '../workspaces/workspaces.service';
import { ProfilesService } from '../profiles/profiles.service';
import { MemberStatus } from '@corviin-hub/shared';

describe('TeamController & TeamService', () => {
  let controller: TeamController;
  let service: TeamService;

  const TECH_WS = 'ws-tech-0001-0000-000000000001';
  const REAL_WS = 'ws-real-0002-0000-000000000002';
  const ANANT_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
  const VIKRAM_ID = 'd4e5f6a7-b8c9-0123-def0-123456789013';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamController],
      providers: [
        TeamService,
        TasksService,
        PlansGoalsService,
        CampaignsService,
        MeetingsService,
        WorkspacesService,
        ProfilesService,
      ],
    }).compile();

    controller = module.get<TeamController>(TeamController);
    service = module.get<TeamService>(TeamService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('Workspace Membership & Scoping', () => {
    it('returns team members belonging to the active workspace with live workload figures', () => {
      const techRes = controller.getMembers(TECH_WS);
      expect(techRes.data.length).toBeGreaterThanOrEqual(3);
      techRes.data.forEach((m) => {
        expect(m.workspaceIds).toContain(TECH_WS);
        expect(m.workload).toBeDefined();
        expect(typeof m.workload.openTasksCount).toBe('number');
      });

      // Corviin Tech includes Vikramaditya
      const vikramInTech = techRes.data.find((m) => m.id === VIKRAM_ID);
      expect(vikramInTech).toBeDefined();

      // Corviin Real Estate does NOT include Vikramaditya
      const realRes = controller.getMembers(REAL_WS);
      const vikramInReal = realRes.data.find((m) => m.id === VIKRAM_ID);
      expect(vikramInReal).toBeUndefined();
    });

    it('requires workspace identification', () => {
      expect(() => controller.getMembers()).toThrow(BadRequestException);
    });

    it('filters team members by active status and search text', () => {
      const activeRes = controller.getMembers(TECH_WS, undefined, 'ACTIVE');
      activeRes.data.forEach((m) => expect(m.status).toBe(MemberStatus.ACTIVE));

      const searchRes = controller.getMembers(TECH_WS, undefined, undefined, 'Anant');
      expect(searchRes.data.length).toBe(1);
      expect(searchRes.data[0].displayName).toBe('Anant');
    });
  });

  describe('Member Detail & Operational Aggregation', () => {
    it('returns comprehensive member profile and linked records in active workspace', () => {
      const detailRes = controller.getMemberDetail(ANANT_ID, TECH_WS);
      expect(detailRes.data.member.displayName).toBe('Anant');
      expect(detailRes.data.member.role).toContain('Tech Lead');
      expect(detailRes.data.workload.openTasksCount).toBeGreaterThanOrEqual(0);
      expect(detailRes.data.workspaces.length).toBeGreaterThanOrEqual(1);
      expect(Array.isArray(detailRes.data.assignedTasks)).toBe(true);
      expect(Array.isArray(detailRes.data.plansAndGoals)).toBe(true);
      expect(Array.isArray(detailRes.data.campaigns)).toBe(true);
      expect(Array.isArray(detailRes.data.meetings)).toBe(true);
      expect(Array.isArray(detailRes.data.recentActivity)).toBe(true);
    });

    it('enforces workspace boundary when accessing member detail', () => {
      // Vikramaditya does not belong to Real Estate workspace
      expect(() => controller.getMemberDetail(VIKRAM_ID, REAL_WS)).toThrow(NotFoundException);
    });
  });

  describe('Dynamic Membership Administration', () => {
    it('creates a new dynamic team member with valid workspace access', () => {
      const createRes = controller.createMember({
        displayName: 'Priya Sundaram',
        role: 'Brand & Content Strategist',
        email: 'priya@corviin.media',
        phone: '+91-99000-88888',
        workspaceIds: [TECH_WS, REAL_WS],
        status: MemberStatus.ACTIVE,
        bio: 'Spearheading multimedia campaigns and video editing pipelines.',
      });

      expect(createRes.data.id).toBeDefined();
      expect(createRes.data.displayName).toBe('Priya Sundaram');
      expect(createRes.data.initials).toBe('PS');

      // Verify member appears in active workspace
      const techMembers = controller.getMembers(TECH_WS);
      expect(techMembers.data.some((m) => m.id === createRes.data.id)).toBe(true);
    });

    it('validates required fields when creating a member', () => {
      expect(() =>
        controller.createMember({
          displayName: '',
          role: 'Engineer',
          workspaceIds: [TECH_WS],
        }),
      ).toThrow(BadRequestException);

      expect(() =>
        controller.createMember({
          displayName: 'Test User',
          role: '',
          workspaceIds: [TECH_WS],
        }),
      ).toThrow(BadRequestException);

      expect(() =>
        controller.createMember({
          displayName: 'Test User',
          role: 'Engineer',
          workspaceIds: [],
        }),
      ).toThrow(BadRequestException);
    });

    it('updates member profile and roles', () => {
      const updateRes = controller.updateMember(ANANT_ID, {
        role: 'Principal Architect & Technical Director',
        bio: 'Overseeing all architectural governance across both workspaces.',
      });

      expect(updateRes.data.role).toBe('Principal Architect & Technical Director');
      expect(updateRes.data.bio).toContain('Overseeing all architectural governance');
    });

    it('toggles member status without deleting historical attribution', () => {
      const toggleRes = controller.toggleStatus(VIKRAM_ID, MemberStatus.ACTIVE);
      expect(toggleRes.data.status).toBe(MemberStatus.ACTIVE);

      // Verify member still exists and can be retrieved
      const member = service.findMemberById(VIKRAM_ID);
      expect(member.status).toBe(MemberStatus.ACTIVE);
    });
  });

  describe('Workspace Workload Summary', () => {
    it('returns aggregate workload statistics across all active members in workspace', () => {
      const workloadRes = controller.getWorkspaceWorkload(TECH_WS);
      expect(workloadRes.data.workspaceId).toBe(TECH_WS);
      expect(workloadRes.data.totalMembers).toBeGreaterThanOrEqual(3);
      expect(typeof workloadRes.data.totalOpenTasks).toBe('number');
      expect(typeof workloadRes.data.totalOverdueTasks).toBe('number');
    });
  });
});

