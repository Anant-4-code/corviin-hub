import { MemberStatus } from '../enums';
import { TaskItem } from './task';
import { GoalItem } from './plan-goal';
import { CampaignItem } from './campaign';
import { MeetingItem } from './meeting';

export interface TeamMember {
  id: string;
  displayName: string;
  initials: string;
  email?: string;
  phone?: string;
  role: string;
  workspaceIds: string[];
  status: MemberStatus;
  avatarUrl?: string;
  bio?: string;
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemberWorkloadSummary {
  openTasksCount: number;
  overdueTasksCount: number;
  tasksDueThisWeekCount: number;
  completedTasksCount: number;
  activeCampaignsCount: number;
  upcomingMeetingsCount: number;
}

export interface TeamMemberSummaryDto extends TeamMember {
  workload: MemberWorkloadSummary;
}

export interface TeamMemberDetailDto {
  member: TeamMember;
  workspaces: Array<{
    id: string;
    name: string;
    slug: string;
    type: string;
  }>;
  workload: MemberWorkloadSummary;
  assignedTasks: TaskItem[];
  completedTasks: TaskItem[];
  plansAndGoals: GoalItem[];
  campaigns: CampaignItem[];
  meetings: MeetingItem[];
  recentActivity: Array<{
    id: string;
    action: string;
    actorName: string;
    timestamp: string;
    details?: string;
  }>;
}

export interface CreateTeamMemberDto {
  displayName: string;
  email?: string;
  phone?: string;
  role: string;
  workspaceIds: string[];
  status?: MemberStatus;
  bio?: string;
}

export interface UpdateTeamMemberDto {
  displayName?: string;
  email?: string;
  phone?: string;
  role?: string;
  workspaceIds?: string[];
  status?: MemberStatus;
  bio?: string;
}

