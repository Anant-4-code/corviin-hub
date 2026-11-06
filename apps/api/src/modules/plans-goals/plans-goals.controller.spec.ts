import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PlansGoalsController } from './plans-goals.controller';
import { PlansGoalsService } from './plans-goals.service';
import { WorkspacesService } from '../workspaces/workspaces.service';
import { ProfilesService } from '../profiles/profiles.service';
import { GoalStatus, PlanStatus, MilestoneStatus, TaskPriority, ProgressMode } from '@corviin-hub/shared';

describe('PlansGoalsController', () => {
  let controller: PlansGoalsController;
  let service: PlansGoalsService;

  const techWsId = 'ws-tech-0001-0000-000000000001';
  const realWsId = 'ws-real-0002-0000-000000000002';
  const anantId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
  const rohitId = 'b2c3d4e5-f6a7-8901-bcde-f12345678901';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlansGoalsController],
      providers: [PlansGoalsService, WorkspacesService, ProfilesService],
    }).compile();

    controller = module.get<PlansGoalsController>(PlansGoalsController);
    service = module.get<PlansGoalsService>(PlansGoalsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return workspace overview with active goals, plans, and metrics', () => {
    const res = controller.getOverview(techWsId);
    expect(res.data.summary.activeGoalsCount).toBeGreaterThan(0);
    expect(res.data.summary.activePlansCount).toBeGreaterThan(0);
    expect(res.data.goals.every((g) => g.workspaceId === techWsId)).toBe(true);
    expect(res.data.plans.every((p) => p.workspaceId === techWsId)).toBe(true);
  });

  it('should create a goal with measurement metric and initial progress', () => {
    const res = controller.createGoal(
      {
        workspaceId: techWsId,
        title: 'Launch Public API Developer Portal',
        expectedOutcome: 'Provide complete OpenAPI interactive documentation for partner integrations.',
        ownerId: anantId,
        targetDate: '2026-12-15T18:00:00.000Z',
        priority: TaskPriority.HIGH,
        metric: {
          name: 'Partner Integrations',
          targetValue: 20,
          currentValue: 5,
          unit: 'partners',
        },
      },
      techWsId,
      anantId,
    );

    expect(res.data.id).toBeDefined();
    expect(res.data.title).toBe('Launch Public API Developer Portal');
    expect(res.data.status).toBe(GoalStatus.NOT_STARTED);
    expect(res.data.metric?.targetValue).toBe(20);
  });

  it('should update a goal and auto-recalculate progress from updated metric', () => {
    const updateRes = controller.updateGoal(
      'gl-tch-001',
      {
        metric: {
          name: 'Enterprise Contracts Signed',
          targetValue: 50,
          currentValue: 40,
          unit: 'clients',
        },
      },
      techWsId,
      anantId,
    );

    expect(updateRes.data.metric?.currentValue).toBe(40);
    expect(updateRes.data.progressPercent).toBe(80); // 40 / 50 = 80%
  });

  it('should flag a goal as at-risk with explainable risk reason', () => {
    const res = controller.updateGoal(
      'gl-tch-002',
      {
        riskReason: 'Cloud provider outage in primary region delayed DR drill by 2 weeks.',
      },
      techWsId,
      anantId,
    );

    expect(res.data.status).toBe(GoalStatus.AT_RISK);
    expect(res.data.isAtRisk).toBe(true);
    expect(res.data.riskReason).toContain('Cloud provider outage');
  });

  it('should create an execution plan linked to a goal', () => {
    const res = controller.createPlan(
      {
        workspaceId: techWsId,
        goalId: 'gl-tch-001',
        title: 'Developer Advocate Community Outreach Plan',
        strategySummary: 'Host bi-weekly engineering office hours and architectural demos.',
        ownerId: anantId,
        startDate: '2026-11-01T09:00:00.000Z',
        targetDate: '2026-12-20T18:00:00.000Z',
        priority: TaskPriority.MEDIUM,
        milestones: [
          { title: 'Publish Getting Started Guide', dueDate: '2026-11-15T18:00:00.000Z' },
          { title: 'Host First Live Workshop', dueDate: '2026-11-30T18:00:00.000Z' },
        ],
      },
      techWsId,
      anantId,
    );

    expect(res.data.id).toBeDefined();
    expect(res.data.goalId).toBe('gl-tch-001');
    expect(res.data.milestones.length).toBe(2);
  });

  it('should add milestone and dynamically recalculate plan progress on completion', () => {
    // 1. Add new milestone to pln-tch-002
    const addRes = controller.addMilestone(
      'pln-tch-002',
      {
        title: 'Run Load Testing on Read Replica Pool',
        dueDate: '2026-11-22T18:00:00.000Z',
      },
      techWsId,
      anantId,
    );

    expect(addRes.data.title).toBe('Run Load Testing on Read Replica Pool');
    expect(addRes.data.status).toBe(MilestoneStatus.PENDING);

    // 2. Mark milestone completed
    const updateRes = controller.updateMilestone(
      'pln-tch-002',
      addRes.data.id,
      {
        status: MilestoneStatus.COMPLETED,
      },
      techWsId,
      anantId,
    );

    expect(updateRes.data.status).toBe(MilestoneStatus.COMPLETED);
    expect(updateRes.data.completedAt).toBeDefined();

    // 3. Plan progress percent should have recalculated dynamically
    const planRes = controller.findPlanById('pln-tch-002', techWsId);
    expect(planRes.data.progressPercent).toBeGreaterThanOrEqual(60);
  });

  it('should enforce workspace scoping and throw NotFoundException on cross-workspace access', () => {
    expect(() => {
      // gl-re-001 belongs to Real Estate, querying in Tech workspace should fail
      controller.findGoalById('gl-re-001', techWsId);
    }).toThrow(NotFoundException);
  });
});

