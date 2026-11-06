import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  TeamMember,
  TeamMemberSummaryDto,
  TeamMemberDetailDto,
  CreateTeamMemberDto,
  UpdateTeamMemberDto,
  MemberStatus,
  TaskStatus,
  CampaignStage,
  MeetingStatus,
  MemberWorkloadSummary,
} from '@corviin-hub/shared';
import { TasksService } from '../tasks/tasks.service';
import { PlansGoalsService } from '../plans-goals/plans-goals.service';
import { CampaignsService } from '../campaigns/campaigns.service';
import { MeetingsService } from '../meetings/meetings.service';
import { WorkspacesService } from '../workspaces/workspaces.service';

@Injectable()
export class TeamService {
  constructor(
    private readonly tasksService: TasksService,
    private readonly plansGoalsService: PlansGoalsService,
    private readonly campaignsService: CampaignsService,
    private readonly meetingsService: MeetingsService,
    private readonly workspacesService: WorkspacesService,
  ) {}

  // In-memory member store initialized with seed records (dynamic, supporting additions)
  private members: TeamMember[] = [
    {
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      displayName: 'Anant',
      initials: 'A',
      email: 'anant@corviin.tech',
      phone: '+91-98450-11111',
      role: 'Full Stack & Tech Lead',
      workspaceIds: [
        'ws-tech-0001-0000-000000000001',
        'ws-real-0002-0000-000000000002',
      ],
      status: MemberStatus.ACTIVE,
      bio: 'Technical lead driving full-stack monorepo architecture, design systems, and API governance.',
      joinedAt: '2026-01-01T00:00:00.000Z',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-11-01T09:00:00.000Z',
    },
    {
      id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
      displayName: 'Rohit',
      initials: 'R',
      email: 'rohit@corviin.realestate',
      phone: '+91-98765-43210',
      role: 'Partner Relations & Real Estate Lead',
      workspaceIds: [
        'ws-tech-0001-0000-000000000001',
        'ws-real-0002-0000-000000000002',
      ],
      status: MemberStatus.ACTIVE,
      bio: 'Leading developer relationships, RERA alignment, commercial inventory mandates, and brand partnerships.',
      joinedAt: '2026-01-01T00:00:00.000Z',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-11-02T10:00:00.000Z',
    },
    {
      id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
      displayName: 'Utkarsh',
      initials: 'U',
      email: 'utkarsh@corviin.growth',
      phone: '+91-98801-23456',
      role: 'Buyer Relations & Growth Lead',
      workspaceIds: [
        'ws-tech-0001-0000-000000000001',
        'ws-real-0002-0000-000000000002',
      ],
      status: MemberStatus.ACTIVE,
      bio: 'Managing buyer consultations, property walkthrough allocations, and omnichannel campaign growth.',
      joinedAt: '2026-01-01T00:00:00.000Z',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-11-03T11:00:00.000Z',
    },
    {
      id: 'd4e5f6a7-b8c9-0123-def0-123456789013',
      displayName: 'Vikramaditya Rao',
      initials: 'VR',
      email: 'vikram@corviin.partner',
      phone: '+91-99440-55555',
      role: 'Specialist Advisor (Former)',
      workspaceIds: ['ws-tech-0001-0000-000000000001'],
      status: MemberStatus.INACTIVE,
      bio: 'External advisory role; retained for historical activity attribution.',
      joinedAt: '2026-02-01T00:00:00.000Z',
      createdAt: '2026-02-01T00:00:00.000Z',
      updatedAt: '2026-06-01T00:00:00.000Z',
    },
  ];

  /**
   * Calculate live, workspace-scoped workload metrics for a specific member.
   */
  private calculateMemberWorkload(workspaceId: string, memberId: string): MemberWorkloadSummary {
    const todayStr = '2026-11-05';
    const weekEndStr = '2026-11-12';

    // 1. Tasks
    let allTasks: any[] = [];
    try {
      allTasks = this.tasksService.findAll(workspaceId, memberId);
    } catch {
      allTasks = [];
    }
    const memberTasks = allTasks.filter((t) => t.assigneeId === memberId);
    const openTasks = memberTasks.filter(
      (t) => t.status !== TaskStatus.COMPLETED && t.status !== TaskStatus.CANCELLED,
    );
    const overdueTasks = openTasks.filter((t) => t.deadline && t.deadline < todayStr);
    const tasksDueThisWeek = openTasks.filter(
      (t) => t.deadline && t.deadline >= todayStr && t.deadline <= weekEndStr,
    );
    const completedTasks = memberTasks.filter((t) => t.status === TaskStatus.COMPLETED);

    // 2. Campaigns
    let allCampaigns: any[] = [];
    try {
      allCampaigns = this.campaignsService.findAll(workspaceId);
    } catch {
      allCampaigns = [];
    }
    const activeCampaigns = allCampaigns.filter(
      (c) => c.ownerId === memberId && c.stage !== CampaignStage.POSTING_COMPLETION,
    );

    // 3. Meetings
    let allMeetings: any[] = [];
    try {
      allMeetings = this.meetingsService.findAllMeetings(workspaceId);
    } catch {
      allMeetings = [];
    }
    const upcomingMeetings = allMeetings.filter(
      (m) =>
        (m.organiserId === memberId || (m.participantIds && m.participantIds.includes(memberId))) &&
        m.status !== MeetingStatus.CANCELLED,
    );

    return {
      openTasksCount: openTasks.length,
      overdueTasksCount: overdueTasks.length,
      tasksDueThisWeekCount: tasksDueThisWeek.length,
      completedTasksCount: completedTasks.length,
      activeCampaignsCount: activeCampaigns.length,
      upcomingMeetingsCount: upcomingMeetings.length,
    };
  }

  // ==========================================
  // TEAM DIRECTORY CRUD & QUERIES
  // ==========================================

  findAllMembers(
    workspaceId: string,
    filter?: { status?: string; search?: string },
  ): TeamMemberSummaryDto[] {
    // Strictly filter members having access to this active workspace
    let list = this.members.filter((m) => m.workspaceIds.includes(workspaceId));

    if (filter?.status && filter.status !== 'ALL') {
      list = list.filter((m) => m.status === filter.status);
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (m) =>
          m.displayName.toLowerCase().includes(q) ||
          m.role.toLowerCase().includes(q) ||
          (m.email && m.email.toLowerCase().includes(q)),
      );
    }

    return list.map((member) => ({
      ...member,
      workload: this.calculateMemberWorkload(workspaceId, member.id),
    }));
  }

  findMemberById(id: string): TeamMember {
    const member = this.members.find((m) => m.id === id);
    if (!member) {
      throw new NotFoundException(`Member ${id} not found.`);
    }
    return member;
  }

  findMemberDetail(workspaceId: string, memberId: string): TeamMemberDetailDto {
    const member = this.findMemberById(memberId);

    // Validate workspace boundary
    if (!member.workspaceIds.includes(workspaceId)) {
      throw new NotFoundException(
        `Member ${member.displayName} is not assigned to the active workspace.`,
      );
    }

    // Workspaces details
    const memberWorkspaces = member.workspaceIds
      .map((wsId) => this.workspacesService.findById(wsId))
      .filter((ws): ws is NonNullable<typeof ws> => ws !== null);

    // Operational records in active workspace
    let allTasks: any[] = [];
    try {
      allTasks = this.tasksService.findAll(workspaceId, memberId);
    } catch {
      allTasks = [];
    }
    const assignedTasks = allTasks.filter(
      (t) =>
        t.assigneeId === memberId &&
        t.status !== TaskStatus.COMPLETED &&
        t.status !== TaskStatus.CANCELLED,
    );
    const completedTasks = allTasks.filter(
      (t) => t.assigneeId === memberId && t.status === TaskStatus.COMPLETED,
    );

    let plansAndGoals: any[] = [];
    try {
      plansAndGoals = this.plansGoalsService.findGoals(workspaceId, { ownerId: memberId });
    } catch {
      plansAndGoals = [];
    }

    let campaigns: any[] = [];
    try {
      campaigns = this.campaignsService
        .findAll(workspaceId)
        .filter((c) => c.ownerId === memberId);
    } catch {
      campaigns = [];
    }

    let meetings: any[] = [];
    try {
      meetings = this.meetingsService
        .findAllMeetings(workspaceId)
        .filter(
          (m) =>
            m.organiserId === memberId ||
            (m.participantIds && m.participantIds.includes(memberId)),
        );
    } catch {
      meetings = [];
    }

    // Recent meaningful operational activity
    const recentActivity = [
      ...assignedTasks.slice(0, 3).map((t) => ({
        id: `act-task-${t.id}`,
        action: 'Assigned task',
        actorName: t.creatorName || 'Team Lead',
        timestamp: t.updatedAt || t.createdAt,
        details: `Working on: ${t.title}`,
      })),
      ...meetings.slice(0, 2).map((m) => ({
        id: `act-mtg-${m.id}`,
        action: m.organiserId === memberId ? 'Organised meeting' : 'Participated in meeting',
        actorName: member.displayName,
        timestamp: m.updatedAt || m.createdAt,
        details: m.title,
      })),
    ].sort((a, b) => b.timestamp.localeCompare(a.timestamp));

    return {
      member,
      workspaces: memberWorkspaces,
      workload: this.calculateMemberWorkload(workspaceId, memberId),
      assignedTasks,
      completedTasks,
      plansAndGoals,
      campaigns,
      meetings,
      recentActivity,
    };
  }

  createMember(dto: CreateTeamMemberDto): TeamMember {
    if (!dto.displayName?.trim()) {
      throw new BadRequestException('Member display name is required.');
    }
    if (!dto.role?.trim()) {
      throw new BadRequestException('Member role is required.');
    }
    if (!dto.workspaceIds || dto.workspaceIds.length === 0) {
      throw new BadRequestException('At least one workspace must be assigned.');
    }

    const now = new Date().toISOString();
    const initials = dto.displayName
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');

    const newMember: TeamMember = {
      id: `mem-${Date.now().toString(36)}`,
      displayName: dto.displayName.trim(),
      initials: initials || 'TM',
      email: dto.email?.trim() || undefined,
      phone: dto.phone?.trim() || undefined,
      role: dto.role.trim(),
      workspaceIds: dto.workspaceIds,
      status: dto.status || MemberStatus.ACTIVE,
      bio: dto.bio?.trim() || undefined,
      joinedAt: now,
      createdAt: now,
      updatedAt: now,
    };

    this.members.unshift(newMember);
    return newMember;
  }

  updateMember(id: string, dto: UpdateTeamMemberDto): TeamMember {
    const member = this.findMemberById(id);

    if (dto.displayName !== undefined) {
      if (!dto.displayName.trim()) {
        throw new BadRequestException('Display name cannot be blank.');
      }
      member.displayName = dto.displayName.trim();
      member.initials = member.displayName
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');
    }

    if (dto.email !== undefined) member.email = dto.email.trim() || undefined;
    if (dto.phone !== undefined) member.phone = dto.phone.trim() || undefined;
    if (dto.role !== undefined) member.role = dto.role.trim();
    if (dto.bio !== undefined) member.bio = dto.bio.trim() || undefined;
    if (dto.workspaceIds !== undefined) {
      if (dto.workspaceIds.length === 0) {
        throw new BadRequestException('At least one workspace must be assigned.');
      }
      member.workspaceIds = dto.workspaceIds;
    }
    if (dto.status !== undefined) member.status = dto.status;

    member.updatedAt = new Date().toISOString();
    return member;
  }

  toggleMemberStatus(id: string, status: MemberStatus): TeamMember {
    const member = this.findMemberById(id);
    member.status = status;
    member.updatedAt = new Date().toISOString();
    return member;
  }

  getWorkspaceWorkload(workspaceId: string) {
    const members = this.findAllMembers(workspaceId);
    let totalOpen = 0;
    let totalOverdue = 0;
    let totalDueWeek = 0;
    let totalCompleted = 0;
    let totalCampaigns = 0;

    members.forEach((m) => {
      totalOpen += m.workload.openTasksCount;
      totalOverdue += m.workload.overdueTasksCount;
      totalDueWeek += m.workload.tasksDueThisWeekCount;
      totalCompleted += m.workload.completedTasksCount;
      totalCampaigns += m.workload.activeCampaignsCount;
    });

    return {
      workspaceId,
      totalMembers: members.length,
      activeMembersCount: members.filter((m) => m.status === MemberStatus.ACTIVE).length,
      totalOpenTasks: totalOpen,
      totalOverdueTasks: totalOverdue,
      totalTasksDueThisWeek: totalDueWeek,
      totalCompletedTasks: totalCompleted,
      totalActiveCampaigns: totalCampaigns,
    };
  }
}
