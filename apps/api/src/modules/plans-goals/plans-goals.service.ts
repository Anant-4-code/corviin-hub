import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  GoalItem,
  PlanItem,
  MilestoneItem,
  CreateGoalDto,
  UpdateGoalDto,
  CreatePlanDto,
  UpdatePlanDto,
  CreateMilestoneDto,
  UpdateMilestoneDto,
  PlansGoalsOverviewResponse,
  GoalStatus,
  PlanStatus,
  MilestoneStatus,
  ProgressMode,
  TaskPriority,
} from '@corviin-hub/shared';
import { WorkspacesService } from '../workspaces/workspaces.service';
import { ProfilesService } from '../profiles/profiles.service';

@Injectable()
export class PlansGoalsService {
  constructor(
    private readonly workspacesService: WorkspacesService,
    private readonly profilesService: ProfilesService,
  ) { }

  private goals: GoalItem[] = [
    // Corviin Tech Goals
    {
      id: 'gl-tch-001',
      workspaceId: 'ws-tech-0001-0000-000000000001',
      title: 'Onboard 50 Enterprise Tech Clients in Q4',
      expectedOutcome: 'Expand enterprise revenue baseline and establish long-term software service agreements.',
      ownerId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      ownerName: 'Anant',
      targetDate: '2026-12-31T18:00:00.000Z',
      startDate: '2026-10-01T09:00:00.000Z',
      priority: TaskPriority.URGENT,
      status: GoalStatus.IN_PROGRESS,
      progressMode: ProgressMode.TASK_DERIVED,
      progressPercent: 64,
      metric: {
        name: 'Enterprise Contracts Signed',
        targetValue: 50,
        currentValue: 32,
        unit: 'clients',
      },
      linkedPlanIds: ['pln-tch-001'],
      activity: [
        {
          id: 'act-gl-1',
          action: 'updated metric to 32 clients',
          actorName: 'Anant',
          timestamp: '2026-11-04T16:00:00.000Z',
        },
      ],
      createdAt: '2026-10-01T09:00:00.000Z',
      updatedAt: '2026-11-04T16:00:00.000Z',
    },
    {
      id: 'gl-tch-002',
      workspaceId: 'ws-tech-0001-0000-000000000001',
      title: 'Zero-Downtime Multi-Region Database Architecture',
      expectedOutcome: 'Deliver 99.99% system availability with automated failover and partitioned replica reads.',
      ownerId: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
      ownerName: 'Utkarsh',
      targetDate: '2026-11-30T18:00:00.000Z',
      startDate: '2026-10-15T09:00:00.000Z',
      priority: TaskPriority.HIGH,
      status: GoalStatus.IN_PROGRESS,
      progressMode: ProgressMode.MILESTONE_DERIVED,
      progressPercent: 67,
      linkedPlanIds: ['pln-tch-002'],
      activity: [
        {
          id: 'act-gl-2',
          action: 'completed milestone Database Failover Testing',
          actorName: 'Utkarsh',
          timestamp: '2026-11-03T14:30:00.000Z',
        },
      ],
      createdAt: '2026-10-15T09:00:00.000Z',
      updatedAt: '2026-11-03T14:30:00.000Z',
    },
    {
      id: 'gl-tch-003',
      workspaceId: 'ws-tech-0001-0000-000000000001',
      title: 'SOC2 Type II Security Compliance Certification',
      expectedOutcome: 'Complete external penetration tests, access audits, and deliver clean auditor sign-off.',
      ownerId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
      ownerName: 'Rohit',
      targetDate: '2026-11-20T18:00:00.000Z',
      startDate: '2026-09-01T09:00:00.000Z',
      priority: TaskPriority.HIGH,
      status: GoalStatus.AT_RISK,
      isAtRisk: true,
      riskReason: 'Penetration testing vendor delayed final vulnerability remediation re-test by 2 weeks.',
      progressMode: ProgressMode.MANUAL,
      progressPercent: 35,
      activity: [
        {
          id: 'act-gl-3',
          action: 'flagged goal as at risk due to vendor schedule slip',
          actorName: 'Rohit',
          timestamp: '2026-11-02T10:00:00.000Z',
        },
      ],
      createdAt: '2026-09-01T09:00:00.000Z',
      updatedAt: '2026-11-02T10:00:00.000Z',
    },

    // Corviin Real Estate Goals
    {
      id: 'gl-re-001',
      workspaceId: 'ws-real-0002-0000-000000000002',
      title: 'Close $15M in Premium Residential Brokerage Transactions',
      expectedOutcome: 'Achieve record quarterly sales volume across luxury skyline towers and penthouse inventory.',
      ownerId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
      ownerName: 'Rohit',
      targetDate: '2026-12-31T18:00:00.000Z',
      startDate: '2026-10-01T09:00:00.000Z',
      priority: TaskPriority.URGENT,
      status: GoalStatus.IN_PROGRESS,
      progressMode: ProgressMode.TASK_DERIVED,
      progressPercent: 65,
      metric: {
        name: 'Gross Transaction Volume',
        targetValue: 15,
        currentValue: 9.8,
        unit: '$M',
      },
      linkedPlanIds: ['pln-re-001'],
      activity: [],
      createdAt: '2026-10-01T09:00:00.000Z',
      updatedAt: '2026-11-03T11:00:00.000Z',
    },
    {
      id: 'gl-re-002',
      workspaceId: 'ws-real-0002-0000-000000000002',
      title: 'Expand Verified Channel Partner Network to 120 Brokers',
      expectedOutcome: 'Sign standardized broker tier agreements with leading luxury property advisors in key metros.',
      ownerId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      ownerName: 'Anant',
      targetDate: '2026-12-15T18:00:00.000Z',
      startDate: '2026-10-01T09:00:00.000Z',
      priority: TaskPriority.MEDIUM,
      status: GoalStatus.IN_PROGRESS,
      progressMode: ProgressMode.TASK_DERIVED,
      progressPercent: 70,
      metric: {
        name: 'Registered Brokers',
        targetValue: 120,
        currentValue: 84,
        unit: 'brokers',
      },
      linkedPlanIds: ['pln-re-002'],
      activity: [],
      createdAt: '2026-10-01T09:00:00.000Z',
      updatedAt: '2026-11-04T12:00:00.000Z',
    },
  ];

  private plans: PlanItem[] = [
    // Corviin Tech Plans
    {
      id: 'pln-tch-001',
      workspaceId: 'ws-tech-0001-0000-000000000001',
      goalId: 'gl-tch-001',
      goalTitle: 'Onboard 50 Enterprise Tech Clients in Q4',
      title: 'Enterprise Outbound Tech Acquisition Sprint',
      strategySummary: 'Account-based outreach targeting FinTech and PropTech CTOs with tailored architectural benchmarks.',
      ownerId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      ownerName: 'Anant',
      startDate: '2026-10-01T09:00:00.000Z',
      targetDate: '2026-12-15T18:00:00.000Z',
      priority: TaskPriority.URGENT,
      status: PlanStatus.ACTIVE,
      progressMode: ProgressMode.MILESTONE_DERIVED,
      progressPercent: 67,
      resources: ['HubSpot Enterprise Export', 'Custom Benchmark Deck PDF', 'Demo Sandbox Environment'],
      risks: ['Long legal redline turnaround with Tier-1 accounts'],
      milestones: [
        {
          id: 'mls-1',
          planId: 'pln-tch-001',
          title: 'Curate Top 200 Qualified Account List',
          description: 'Identify verified CTO contacts and current infrastructure stacks.',
          dueDate: '2026-10-15T18:00:00.000Z',
          status: MilestoneStatus.COMPLETED,
          completedAt: '2026-10-14T15:00:00.000Z',
          orderIndex: 0,
        },
        {
          id: 'mls-2',
          planId: 'pln-tch-001',
          title: 'Complete 30 Technical Discovery Demos',
          description: 'Deliver custom architectural POCs to interested engineering leads.',
          dueDate: '2026-11-15T18:00:00.000Z',
          status: MilestoneStatus.IN_PROGRESS,
          orderIndex: 1,
        },
        {
          id: 'mls-3',
          planId: 'pln-tch-001',
          title: 'Finalize 20 Annual Enterprise MSA Agreements',
          description: 'Close contracts and initiate onboarding integration sprints.',
          dueDate: '2026-12-15T18:00:00.000Z',
          status: MilestoneStatus.PENDING,
          orderIndex: 2,
        },
      ],
      activity: [
        {
          id: 'act-pl-1',
          action: 'completed milestone Curate Top 200 Qualified Account List',
          actorName: 'Anant',
          timestamp: '2026-10-14T15:00:00.000Z',
        },
      ],
      createdAt: '2026-10-01T09:00:00.000Z',
      updatedAt: '2026-11-04T12:00:00.000Z',
    },
    {
      id: 'pln-tch-002',
      workspaceId: 'ws-tech-0001-0000-000000000001',
      goalId: 'gl-tch-002',
      goalTitle: 'Zero-Downtime Multi-Region Database Architecture',
      title: 'Database Indexing and Postgres Partitioning Strategy',
      strategySummary: 'Partition high-cardinality audit logs and migrate read operations to auto-scaling read replicas.',
      ownerId: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
      ownerName: 'Utkarsh',
      startDate: '2026-10-15T09:00:00.000Z',
      targetDate: '2026-11-25T18:00:00.000Z',
      priority: TaskPriority.HIGH,
      status: PlanStatus.ACTIVE,
      progressMode: ProgressMode.MILESTONE_DERIVED,
      progressPercent: 50,
      milestones: [
        {
          id: 'mls-4',
          planId: 'pln-tch-002',
          title: 'Composite Index Audit on Tenant Queries',
          dueDate: '2026-10-31T18:00:00.000Z',
          status: MilestoneStatus.COMPLETED,
          completedAt: '2026-10-30T17:00:00.000Z',
          orderIndex: 0,
        },
        {
          id: 'mls-5',
          planId: 'pln-tch-002',
          title: 'Deploy Read Replica Pool in Secondary Region',
          dueDate: '2026-11-20T18:00:00.000Z',
          status: MilestoneStatus.IN_PROGRESS,
          orderIndex: 1,
        },
      ],
      activity: [],
      createdAt: '2026-10-15T09:00:00.000Z',
      updatedAt: '2026-10-30T17:00:00.000Z',
    },

    // Corviin Real Estate Plans
    {
      id: 'pln-re-001',
      workspaceId: 'ws-real-0002-0000-000000000002',
      goalId: 'gl-re-001',
      goalTitle: 'Close $15M in Premium Residential Brokerage Transactions',
      title: 'HNI Client Investor Roadshow & Private Previews',
      strategySummary: 'Organize private evening walkthroughs and financial briefings for qualified high-net-worth buyers.',
      ownerId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
      ownerName: 'Rohit',
      startDate: '2026-10-01T09:00:00.000Z',
      targetDate: '2026-12-20T18:00:00.000Z',
      priority: TaskPriority.URGENT,
      status: PlanStatus.ACTIVE,
      progressMode: ProgressMode.MANUAL,
      progressPercent: 60,
      milestones: [
        {
          id: 'mls-re-1',
          planId: 'pln-re-001',
          title: 'Skyline Penthouse Staging and Photography',
          dueDate: '2026-10-25T18:00:00.000Z',
          status: MilestoneStatus.COMPLETED,
          completedAt: '2026-10-24T16:00:00.000Z',
          orderIndex: 0,
        },
        {
          id: 'mls-re-2',
          planId: 'pln-re-001',
          title: 'Execute 15 Private HNI Site Walkthroughs',
          dueDate: '2026-11-30T18:00:00.000Z',
          status: MilestoneStatus.IN_PROGRESS,
          orderIndex: 1,
        },
      ],
      activity: [],
      createdAt: '2026-10-01T09:00:00.000Z',
      updatedAt: '2026-10-24T16:00:00.000Z',
    },
  ];

  getOverview(workspaceId: string): PlansGoalsOverviewResponse {
    const goals = this.findGoals(workspaceId);
    const plans = this.findPlans(workspaceId);

    const activeGoalsCount = goals.filter(
      (g) => g.status === GoalStatus.IN_PROGRESS || g.status === GoalStatus.AT_RISK,
    ).length;

    const activePlansCount = plans.filter((p) => p.status === PlanStatus.ACTIVE).length;

    const atRiskCount =
      goals.filter((g) => g.status === GoalStatus.AT_RISK || g.isAtRisk).length +
      plans.filter((p) => p.isAtRisk).length;

    const now = new Date().toISOString();
    let milestonesDueSoonCount = 0;
    for (const plan of plans) {
      for (const m of plan.milestones) {
        if (m.status !== MilestoneStatus.COMPLETED && m.dueDate >= now) {
          milestonesDueSoonCount++;
        }
      }
    }

    return {
      summary: {
        activeGoalsCount,
        activePlansCount,
        atRiskCount,
        milestonesDueSoonCount,
      },
      goals,
      plans,
    };
  }

  findGoals(workspaceId: string, query?: { ownerId?: string; status?: GoalStatus; search?: string }): GoalItem[] {
    let items = this.goals.filter((g) => g.workspaceId === workspaceId);

    if (query?.ownerId && query.ownerId !== 'ALL') {
      items = items.filter((g) => g.ownerId === query.ownerId);
    }
    if (query?.status) {
      items = items.filter((g) => g.status === query.status);
    }
    if (query?.search) {
      const s = query.search.toLowerCase();
      items = items.filter(
        (g) =>
          g.title.toLowerCase().includes(s) ||
          g.expectedOutcome.toLowerCase().includes(s) ||
          g.ownerName.toLowerCase().includes(s),
      );
    }

    return items;
  }

  findGoalById(id: string, workspaceId: string): GoalItem {
    const goal = this.goals.find((g) => g.id === id && g.workspaceId === workspaceId);
    if (!goal) {
      throw new NotFoundException(`Goal with ID "${id}" not found in this workspace`);
    }
    return goal;
  }

  createGoal(dto: CreateGoalDto, actorName: string): GoalItem {
    const workspace = this.workspacesService.findById(dto.workspaceId);
    if (!workspace) {
      throw new NotFoundException(`Workspace "${dto.workspaceId}" not found`);
    }

    const owner = this.profilesService.findById(dto.ownerId);
    const ownerName = owner ? owner.displayName : 'Team Member';

    const now = new Date().toISOString();
    const newGoal: GoalItem = {
      id: `gl-${Math.random().toString(36).substring(2, 8)}`,
      workspaceId: dto.workspaceId,
      title: dto.title.trim(),
      expectedOutcome: dto.expectedOutcome.trim(),
      ownerId: dto.ownerId,
      ownerName,
      targetDate: dto.targetDate,
      startDate: dto.startDate || now,
      priority: dto.priority || TaskPriority.MEDIUM,
      status: GoalStatus.NOT_STARTED,
      progressMode: dto.progressMode || ProgressMode.MANUAL,
      progressPercent: 0,
      metric: dto.metric,
      linkedPlanIds: [],
      activity: [
        {
          id: `act-${Math.random().toString(36).substring(2, 8)}`,
          action: 'created goal',
          actorName,
          timestamp: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    this.goals.unshift(newGoal);
    return newGoal;
  }

  updateGoal(id: string, workspaceId: string, dto: UpdateGoalDto, actorName: string): GoalItem {
    const goal = this.findGoalById(id, workspaceId);
    const now = new Date().toISOString();

    if (dto.title) goal.title = dto.title.trim();
    if (dto.expectedOutcome) goal.expectedOutcome = dto.expectedOutcome.trim();
    if (dto.targetDate) goal.targetDate = dto.targetDate;
    if (dto.startDate) goal.startDate = dto.startDate;
    if (dto.priority) goal.priority = dto.priority;
    if (dto.status) goal.status = dto.status;
    if (dto.progressMode) goal.progressMode = dto.progressMode;
    if (dto.progressPercent !== undefined) goal.progressPercent = Math.min(100, Math.max(0, dto.progressPercent));
    if (dto.metric) {
      goal.metric = {
        ...goal.metric,
        ...dto.metric,
      };
      // If metric has targetValue > 0, auto-sync progress percent
      if (goal.metric.targetValue > 0) {
        goal.progressPercent = Math.min(
          100,
          Math.round((goal.metric.currentValue / goal.metric.targetValue) * 100),
        );
      }
    }
    if (dto.riskReason) {
      goal.riskReason = dto.riskReason;
      goal.isAtRisk = true;
      goal.status = GoalStatus.AT_RISK;
    }
    if (dto.ownerId && dto.ownerId !== goal.ownerId) {
      const owner = this.profilesService.findById(dto.ownerId);
      if (owner) {
        goal.ownerId = owner.id;
        goal.ownerName = owner.displayName;
      }
    }

    goal.updatedAt = now;
    goal.activity.unshift({
      id: `act-${Math.random().toString(36).substring(2, 8)}`,
      action: 'updated goal',
      actorName,
      timestamp: now,
    });

    return goal;
  }

  findPlans(workspaceId: string, query?: { ownerId?: string; status?: PlanStatus; goalId?: string; search?: string }): PlanItem[] {
    let items = this.plans.filter((p) => p.workspaceId === workspaceId);

    if (query?.ownerId && query.ownerId !== 'ALL') {
      items = items.filter((p) => p.ownerId === query.ownerId);
    }
    if (query?.status) {
      items = items.filter((p) => p.status === query.status);
    }
    if (query?.goalId) {
      items = items.filter((p) => p.goalId === query.goalId);
    }
    if (query?.search) {
      const s = query.search.toLowerCase();
      items = items.filter(
        (p) =>
          p.title.toLowerCase().includes(s) ||
          p.strategySummary.toLowerCase().includes(s) ||
          p.ownerName.toLowerCase().includes(s),
      );
    }

    return items;
  }

  findPlanById(id: string, workspaceId: string): PlanItem {
    const plan = this.plans.find((p) => p.id === id && p.workspaceId === workspaceId);
    if (!plan) {
      throw new NotFoundException(`Plan with ID "${id}" not found in this workspace`);
    }
    return plan;
  }

  createPlan(dto: CreatePlanDto, actorName: string): PlanItem {
    const workspace = this.workspacesService.findById(dto.workspaceId);
    if (!workspace) {
      throw new NotFoundException(`Workspace "${dto.workspaceId}" not found`);
    }

    const owner = this.profilesService.findById(dto.ownerId);
    const ownerName = owner ? owner.displayName : 'Team Member';

    let goalTitle: string | undefined;
    if (dto.goalId) {
      const goal = this.goals.find((g) => g.id === dto.goalId);
      if (goal) {
        goalTitle = goal.title;
        if (!goal.linkedPlanIds) goal.linkedPlanIds = [];
      }
    }

    const now = new Date().toISOString();
    const newPlanId = `pln-${Math.random().toString(36).substring(2, 8)}`;

    const initialMilestones: MilestoneItem[] = (dto.milestones || []).map((m, idx) => ({
      id: `mls-${Math.random().toString(36).substring(2, 8)}`,
      planId: newPlanId,
      title: m.title.trim(),
      description: m.description?.trim(),
      dueDate: m.dueDate,
      status: MilestoneStatus.PENDING,
      orderIndex: idx,
    }));

    const newPlan: PlanItem = {
      id: newPlanId,
      workspaceId: dto.workspaceId,
      goalId: dto.goalId,
      goalTitle,
      title: dto.title.trim(),
      strategySummary: dto.strategySummary.trim(),
      ownerId: dto.ownerId,
      ownerName,
      startDate: dto.startDate,
      targetDate: dto.targetDate,
      priority: dto.priority || TaskPriority.MEDIUM,
      status: PlanStatus.ACTIVE,
      progressMode: ProgressMode.MILESTONE_DERIVED,
      progressPercent: 0,
      milestones: initialMilestones,
      resources: dto.resources || [],
      risks: dto.risks || [],
      activity: [
        {
          id: `act-${Math.random().toString(36).substring(2, 8)}`,
          action: 'created plan',
          actorName,
          timestamp: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    if (dto.goalId) {
      const goal = this.goals.find((g) => g.id === dto.goalId);
      if (goal && !goal.linkedPlanIds?.includes(newPlanId)) {
        goal.linkedPlanIds = [...(goal.linkedPlanIds || []), newPlanId];
      }
    }

    this.plans.unshift(newPlan);
    return newPlan;
  }

  updatePlan(id: string, workspaceId: string, dto: UpdatePlanDto, actorName: string): PlanItem {
    const plan = this.findPlanById(id, workspaceId);
    const now = new Date().toISOString();

    if (dto.title) plan.title = dto.title.trim();
    if (dto.strategySummary) plan.strategySummary = dto.strategySummary.trim();
    if (dto.startDate) plan.startDate = dto.startDate;
    if (dto.targetDate) plan.targetDate = dto.targetDate;
    if (dto.priority) plan.priority = dto.priority;
    if (dto.status) plan.status = dto.status;
    if (dto.progressMode) plan.progressMode = dto.progressMode;
    if (dto.progressPercent !== undefined) plan.progressPercent = Math.min(100, Math.max(0, dto.progressPercent));
    if (dto.resources) plan.resources = dto.resources;
    if (dto.risks) plan.risks = dto.risks;
    if (dto.riskReason) {
      plan.riskReason = dto.riskReason;
      plan.isAtRisk = true;
    }
    if (dto.ownerId && dto.ownerId !== plan.ownerId) {
      const owner = this.profilesService.findById(dto.ownerId);
      if (owner) {
        plan.ownerId = owner.id;
        plan.ownerName = owner.displayName;
      }
    }

    plan.updatedAt = now;
    plan.activity.unshift({
      id: `act-${Math.random().toString(36).substring(2, 8)}`,
      action: 'updated plan',
      actorName,
      timestamp: now,
    });

    return plan;
  }

  addMilestone(planId: string, workspaceId: string, dto: CreateMilestoneDto, actorName: string): MilestoneItem {
    const plan = this.findPlanById(planId, workspaceId);
    const now = new Date().toISOString();

    const newMilestone: MilestoneItem = {
      id: `mls-${Math.random().toString(36).substring(2, 8)}`,
      planId,
      title: dto.title.trim(),
      description: dto.description?.trim(),
      dueDate: dto.dueDate,
      status: MilestoneStatus.PENDING,
      orderIndex: plan.milestones.length,
    };

    plan.milestones.push(newMilestone);
    this.recalculatePlanProgress(plan);
    plan.updatedAt = now;
    plan.activity.unshift({
      id: `act-${Math.random().toString(36).substring(2, 8)}`,
      action: `added milestone "${dto.title}"`,
      actorName,
      timestamp: now,
    });

    return newMilestone;
  }

  updateMilestone(
    planId: string,
    milestoneId: string,
    workspaceId: string,
    dto: UpdateMilestoneDto,
    actorName: string,
  ): MilestoneItem {
    const plan = this.findPlanById(planId, workspaceId);
    const milestone = plan.milestones.find((m) => m.id === milestoneId);
    if (!milestone) {
      throw new NotFoundException(`Milestone "${milestoneId}" not found in this plan`);
    }

    const now = new Date().toISOString();
    if (dto.title) milestone.title = dto.title.trim();
    if (dto.description !== undefined) milestone.description = dto.description.trim();
    if (dto.dueDate) milestone.dueDate = dto.dueDate;
    if (dto.status) {
      milestone.status = dto.status;
      if (dto.status === MilestoneStatus.COMPLETED) {
        milestone.completedAt = dto.completedAt || now;
      } else {
        milestone.completedAt = undefined;
      }
    }

    this.recalculatePlanProgress(plan);
    plan.updatedAt = now;
    plan.activity.unshift({
      id: `act-${Math.random().toString(36).substring(2, 8)}`,
      action: `updated milestone "${milestone.title}" (Status: ${milestone.status})`,
      actorName,
      timestamp: now,
    });

    return milestone;
  }

  private recalculatePlanProgress(plan: PlanItem) {
    if (plan.progressMode === ProgressMode.MILESTONE_DERIVED) {
      if (plan.milestones.length === 0) {
        plan.progressPercent = 0;
      } else {
        const completed = plan.milestones.filter((m) => m.status === MilestoneStatus.COMPLETED).length;
        plan.progressPercent = Math.round((completed / plan.milestones.length) * 100);
      }
    }
  }
}

