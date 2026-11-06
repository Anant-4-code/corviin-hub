import { TaskPriority, TaskStatus, CampaignStage, GoalStatus } from '../enums/index';

export interface DashboardSummary {
  tasksDueToday: number;
  overdueTasks: number;
  tasksInProgress: number;
  completedTasks: number;
  followUpsDue: number;
  upcomingMeetings: number;
  activeCampaigns: number;
  activeGoals: number;
}

export interface DashboardTaskItem {
  id: string;
  title: string;
  workspaceId: string;
  assigneeId: string;
  assigneeName: string;
  dueTime: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  linkedRecordTitle?: string;
  linkedRecordType?: 'campaign' | 'meeting' | 'crm' | 'goal' | 'task';
}

export interface DashboardScheduleItem {
  id: string;
  title: string;
  type: 'MEETING' | 'SITE_VISIT' | 'DEADLINE' | 'CAMPAIGN_LAUNCH';
  time: string;
  date: string;
  locationOrPlatform?: string;
  attendeesCount?: number;
  participantNames?: string[];
  linkedRecordId?: string;
}

export interface DashboardCampaignItem {
  id: string;
  name: string;
  workspaceId: string;
  stage: CampaignStage;
  stageLabel: string;
  ownerId: string;
  ownerName: string;
  nextDeadline: string;
  progressPercentage: number;
  isAtRisk: boolean;
  atRiskReason?: string;
}

export interface DashboardGoalItem {
  id: string;
  title: string;
  workspaceId: string;
  ownerId: string;
  ownerName: string;
  targetDate: string;
  progressPercentage: number;
  status: GoalStatus;
  milestonesTotal: number;
  milestonesCompleted: number;
}

export interface DashboardFollowUpItem {
  id: string;
  contactName: string;
  organization?: string;
  category: string;
  dueTime: string;
  assignedMemberId: string;
  assignedMemberName: string;
  stage: string;
  crmType: 'TECH' | 'RE_BUYER' | 'RE_PARTNER';
  notes?: string;
}

export interface DashboardActivityItem {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  target: string;
  targetType: 'task' | 'campaign' | 'meeting' | 'crm' | 'asset' | 'goal';
  timestamp: string;
  details?: string;
}

export interface DashboardOverviewResponse {
  workspaceId: string;
  workspaceName: string;
  actingProfileId: string;
  actingProfileName: string;
  timezone: string;
  summary: DashboardSummary;
  myWorkToday: DashboardTaskItem[];
  upcomingSchedule: DashboardScheduleItem[];
  campaignsProgress: DashboardCampaignItem[];
  goalsProgress: DashboardGoalItem[];
  followUpsDue: DashboardFollowUpItem[];
  recentActivity: DashboardActivityItem[];
}

