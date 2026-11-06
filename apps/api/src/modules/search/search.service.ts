import { Injectable, BadRequestException } from '@nestjs/common';
import {
  SearchEntityType,
  SearchResultItem,
  SearchGroupResult,
  GlobalSearchResponse,
  GlobalSearchQuery,
  CrmType,
} from '@corviin-hub/shared';
import { TasksService } from '../tasks/tasks.service';
import { CampaignsService } from '../campaigns/campaigns.service';
import { CrmService } from '../crm/crm.service';
import { MeetingsService } from '../meetings/meetings.service';
import { PlansGoalsService } from '../plans-goals/plans-goals.service';
import { AssetsService } from '../assets/assets.service';
import { TeamService } from '../team/team.service';
import { WorkspacesService } from '../workspaces/workspaces.service';

@Injectable()
export class SearchService {
  constructor(
    private readonly tasksService: TasksService,
    private readonly campaignsService: CampaignsService,
    private readonly crmService: CrmService,
    private readonly meetingsService: MeetingsService,
    private readonly plansGoalsService: PlansGoalsService,
    private readonly assetsService: AssetsService,
    private readonly teamService: TeamService,
    private readonly workspacesService: WorkspacesService,
  ) {}

  /**
   * Execute workspace-scoped global search across approved entity types.
   */
  async search(workspaceId: string, query: GlobalSearchQuery): Promise<GlobalSearchResponse> {
    if (!workspaceId || !workspaceId.trim()) {
      throw new BadRequestException('Workspace ID is required for search.');
    }

    const rawQ = query.q ? query.q.trim() : '';
    if (!rawQ) {
      return {
        query: '',
        workspaceId,
        totalResults: 0,
        groups: {},
        items: [],
      };
    }

    // Limit maximum query length to prevent abusive payload execution
    if (rawQ.length > 100) {
      throw new BadRequestException('Search query exceeds maximum permitted length of 100 characters.');
    }

    const q = rawQ.toLowerCase();
    const limitPerGroup = Math.max(1, Math.min(20, Number(query.limit) || 5));

    // Determine target entity types if filter supplied
    const requestedTypes = query.types
      ? query.types
          .split(',')
          .map((t) => t.trim().toUpperCase())
          .filter((t): t is SearchEntityType => Object.values(SearchEntityType).includes(t as SearchEntityType))
      : Object.values(SearchEntityType);

    const groupResults: Record<string, SearchGroupResult> = {};
    const allItems: SearchResultItem[] = [];

    // Helper to calculate ranking score
    const scoreItem = (title: string, subtitle?: string, summary?: string): number => {
      const lowerTitle = (title || '').toLowerCase();
      if (lowerTitle === q) return 100;
      if (lowerTitle.startsWith(q)) return 80;
      if (lowerTitle.includes(q)) return 60;
      if (subtitle && subtitle.toLowerCase().includes(q)) return 40;
      if (summary && summary.toLowerCase().includes(q)) return 30;
      return 20;
    };

    // 1. TASKS
    if (requestedTypes.includes(SearchEntityType.TASK)) {
      const tasks = this.tasksService.findAll(workspaceId, '', { search: rawQ });
      const taskItems: SearchResultItem[] = tasks.map((t) => ({
        id: t.id,
        type: SearchEntityType.TASK,
        title: t.title,
        subtitle: `${t.status} • Priority: ${t.priority} • Assigned: ${t.assigneeName || 'Unassigned'}`,
        summary: t.description,
        workspaceId,
        badge: t.priority,
        status: t.status,
        targetUrl: `/tasks?id=${t.id}`,
        score: scoreItem(t.title, t.status, t.description),
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
      }));

      taskItems.sort((a, b) => (b.score || 0) - (a.score || 0));
      const sliced = taskItems.slice(0, limitPerGroup);
      groupResults[SearchEntityType.TASK] = {
        type: SearchEntityType.TASK,
        label: 'Tasks',
        total: taskItems.length,
        items: sliced,
      };
      allItems.push(...sliced);
    }

    // 2. CAMPAIGNS
    if (requestedTypes.includes(SearchEntityType.CAMPAIGN)) {
      const campaigns = this.campaignsService.findAll(workspaceId, { search: rawQ });
      const campaignItems: SearchResultItem[] = campaigns.map((c) => ({
        id: c.id,
        type: SearchEntityType.CAMPAIGN,
        title: c.title,
        subtitle: `Stage: ${c.stage} • Platform: ${c.platform} • Status: ${c.status}`,
        summary: c.description || c.objective,
        workspaceId,
        badge: c.platform,
        status: c.stage,
        targetUrl: `/campaigns/${c.id}`,
        score: scoreItem(c.title, c.stage, c.description || c.objective),
        createdAt: c.startDate,
        updatedAt: c.targetPublishDate,
      }));

      campaignItems.sort((a, b) => (b.score || 0) - (a.score || 0));
      const sliced = campaignItems.slice(0, limitPerGroup);
      groupResults[SearchEntityType.CAMPAIGN] = {
        type: SearchEntityType.CAMPAIGN,
        label: 'Campaigns',
        total: campaignItems.length,
        items: sliced,
      };
      allItems.push(...sliced);
    }

    // 3. CRM RECORDS
    if (requestedTypes.includes(SearchEntityType.CRM)) {
      const crmResponse = this.crmService.search(workspaceId, { query: rawQ, pageSize: 50 });
      const crmItems: SearchResultItem[] = crmResponse.items.map((r) => {
        let targetUrl = `/crm?id=${r.id}`;
        if (r.type === CrmType.TECH_LEAD || r.type === CrmType.TECH_CLIENT || r.type === CrmType.TECH_PARTNER) {
          targetUrl = `/crm/tech?id=${r.id}`;
        } else if (r.type === CrmType.RE_PARTNER) {
          targetUrl = `/crm/partners?id=${r.id}`;
        } else if (r.type === CrmType.RE_BUYER) {
          targetUrl = `/crm/buyers?id=${r.id}`;
        }

        const subtitle = [r.company, r.phone, r.email, r.stage].filter(Boolean).join(' • ');

        return {
          id: r.id,
          type: SearchEntityType.CRM,
          title: r.name,
          subtitle,
          summary: r.requirementSummary,
          workspaceId,
          badge: r.type,
          status: r.stage,
          targetUrl,
          score: scoreItem(r.name, subtitle, r.requirementSummary),
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        };
      });

      crmItems.sort((a, b) => (b.score || 0) - (a.score || 0));
      const sliced = crmItems.slice(0, limitPerGroup);
      groupResults[SearchEntityType.CRM] = {
        type: SearchEntityType.CRM,
        label: 'CRM Records',
        total: crmItems.length,
        items: sliced,
      };
      allItems.push(...sliced);
    }

    // 4. MEETINGS
    if (requestedTypes.includes(SearchEntityType.MEETING)) {
      const meetings = this.meetingsService.findAllMeetings(workspaceId);
      const filteredMeetings = meetings.filter((m) => {
        const titleMatch = m.title.toLowerCase().includes(q);
        const agendaMatch = m.agenda ? m.agenda.toLowerCase().includes(q) : false;
        const notesMatch = m.notes ? m.notes.toLowerCase().includes(q) : false;
        const locMatch = m.location ? m.location.toLowerCase().includes(q) : false;
        const catMatch = m.category.toLowerCase().includes(q);
        return titleMatch || agendaMatch || notesMatch || locMatch || catMatch;
      });

      const meetingItems: SearchResultItem[] = filteredMeetings.map((m) => ({
        id: m.id,
        type: SearchEntityType.MEETING,
        title: m.title,
        subtitle: `${m.date} ${m.startTime}-${m.endTime} • ${m.category} • ${m.status}`,
        summary: m.agenda || m.notes,
        workspaceId,
        badge: m.category,
        status: m.status,
        targetUrl: `/meetings?id=${m.id}`,
        score: scoreItem(m.title, m.category, m.agenda || m.notes),
        createdAt: m.startTime,
        updatedAt: m.endTime,
      }));

      meetingItems.sort((a, b) => (b.score || 0) - (a.score || 0));
      const sliced = meetingItems.slice(0, limitPerGroup);
      groupResults[SearchEntityType.MEETING] = {
        type: SearchEntityType.MEETING,
        label: 'Meetings',
        total: meetingItems.length,
        items: sliced,
      };
      allItems.push(...sliced);
    }

    // 5. PLANS & GOALS
    if (requestedTypes.includes(SearchEntityType.PLAN_GOAL)) {
      const goals = this.plansGoalsService.findGoals(workspaceId, { search: rawQ });
      const plans = this.plansGoalsService.findPlans(workspaceId, { search: rawQ });

      const planGoalItems: SearchResultItem[] = [
        ...goals.map((g) => ({
          id: g.id,
          type: SearchEntityType.PLAN_GOAL,
          title: g.title,
          subtitle: `Goal • Status: ${g.status} • Progress: ${g.progressPercent}% • Owner: ${g.ownerName}`,
          summary: g.expectedOutcome,
          workspaceId,
          badge: 'GOAL',
          status: g.status,
          targetUrl: `/plans-goals?id=${g.id}`,
          score: scoreItem(g.title, g.status, g.expectedOutcome),
          createdAt: g.startDate,
          updatedAt: g.targetDate,
        })),
        ...plans.map((p) => ({
          id: p.id,
          type: SearchEntityType.PLAN_GOAL,
          title: p.title,
          subtitle: `Plan • Status: ${p.status} • Owner: ${p.ownerName}`,
          summary: p.strategySummary,
          workspaceId,
          badge: 'PLAN',
          status: p.status,
          targetUrl: `/plans-goals?id=${p.id}`,
          score: scoreItem(p.title, p.status, p.strategySummary),
          createdAt: p.startDate,
          updatedAt: p.targetDate,
        })),
      ];

      planGoalItems.sort((a, b) => (b.score || 0) - (a.score || 0));
      const sliced = planGoalItems.slice(0, limitPerGroup);
      groupResults[SearchEntityType.PLAN_GOAL] = {
        type: SearchEntityType.PLAN_GOAL,
        label: 'Plans & Goals',
        total: planGoalItems.length,
        items: sliced,
      };
      allItems.push(...sliced);
    }

    // 6. ASSETS (Metadata only)
    if (requestedTypes.includes(SearchEntityType.ASSET)) {
      const assetsResponse = this.assetsService.findAll(workspaceId, { search: rawQ, pageSize: 50 });
      const assetItems: SearchResultItem[] = assetsResponse.items.map((a) => ({
        id: a.id,
        type: SearchEntityType.ASSET,
        title: a.title || a.originalFileName,
        subtitle: `${a.typeGroup} • ${a.category} • ${(a.sizeBytes / 1024).toFixed(1)} KB • Uploader: ${a.uploaderName}`,
        summary: a.originalFileName,
        workspaceId,
        badge: a.typeGroup,
        status: a.category,
        targetUrl: `/assets?id=${a.id}`,
        score: scoreItem(a.title || a.originalFileName, a.category, a.originalFileName),
        createdAt: a.id,
        updatedAt: a.id,
      }));

      assetItems.sort((a, b) => (b.score || 0) - (a.score || 0));
      const sliced = assetItems.slice(0, limitPerGroup);
      groupResults[SearchEntityType.ASSET] = {
        type: SearchEntityType.ASSET,
        label: 'Assets (Metadata)',
        total: assetItems.length,
        items: sliced,
      };
      allItems.push(...sliced);
    }

    // 7. TEAM MEMBERS
    if (requestedTypes.includes(SearchEntityType.TEAM)) {
      const members = this.teamService.findAllMembers(workspaceId, { search: rawQ });
      const memberItems: SearchResultItem[] = members.map((m) => ({
        id: m.id,
        type: SearchEntityType.TEAM,
        title: m.displayName,
        subtitle: `${m.role} • Status: ${m.status}`,
        summary: m.email || m.phone,
        workspaceId,
        badge: m.role,
        status: m.status,
        targetUrl: `/team/${m.id}`,
        score: scoreItem(m.displayName, m.role, m.email || m.phone),
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
      }));

      memberItems.sort((a, b) => (b.score || 0) - (a.score || 0));
      const sliced = memberItems.slice(0, limitPerGroup);
      groupResults[SearchEntityType.TEAM] = {
        type: SearchEntityType.TEAM,
        label: 'Team Directory',
        total: memberItems.length,
        items: sliced,
      };
      allItems.push(...sliced);
    }

    // Global sort for flat items list
    allItems.sort((a, b) => (b.score || 0) - (a.score || 0));

    const totalResults = Object.values(groupResults).reduce((acc, curr) => acc + curr.total, 0);

    return {
      query: rawQ,
      workspaceId,
      totalResults,
      groups: groupResults,
      items: allItems,
    };
  }
}
