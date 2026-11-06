import { GoalStatus, PlanStatus, MilestoneStatus, ProgressMode, TaskPriority } from '../enums/index';

export interface GoalMetric {
  name: string;
  targetValue: number;
  currentValue: number;
  unit?: string;
}

export interface GoalItem {
  id: string;
  workspaceId: string;
  title: string;
  expectedOutcome: string;
  ownerId: string;
  ownerName: string;
  targetDate: string;
  startDate?: string;
  priority: TaskPriority;
  status: GoalStatus;
  progressMode: ProgressMode;
  progressPercent: number;
  isAtRisk?: boolean;
  riskReason?: string;
  metric?: GoalMetric;
  participantIds?: string[];
  linkedPlanIds?: string[];
  linkedCampaignIds?: string[];
  activity: Array<{
    id: string;
    action: string;
    actorName: string;
    timestamp: string;
    details?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface MilestoneItem {
  id: string;
  planId: string;
  title: string;
  description?: string;
  ownerId?: string;
  ownerName?: string;
  dueDate: string;
  status: MilestoneStatus;
  completedAt?: string;
  orderIndex: number;
}

export interface PlanItem {
  id: string;
  workspaceId: string;
  goalId?: string;
  goalTitle?: string;
  title: string;
  strategySummary: string;
  ownerId: string;
  ownerName: string;
  startDate: string;
  targetDate: string;
  priority: TaskPriority;
  status: PlanStatus;
  progressMode: ProgressMode;
  progressPercent: number;
  isAtRisk?: boolean;
  riskReason?: string;
  milestones: MilestoneItem[];
  participantIds?: string[];
  resources?: string[];
  risks?: string[];
  linkedCampaignIds?: string[];
  activity: Array<{
    id: string;
    action: string;
    actorName: string;
    timestamp: string;
    details?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGoalDto {
  workspaceId: string;
  title: string;
  expectedOutcome: string;
  ownerId: string;
  targetDate: string;
  startDate?: string;
  priority?: TaskPriority;
  metric?: GoalMetric;
  progressMode?: ProgressMode;
}

export interface UpdateGoalDto {
  title?: string;
  expectedOutcome?: string;
  ownerId?: string;
  targetDate?: string;
  startDate?: string;
  priority?: TaskPriority;
  status?: GoalStatus;
  metric?: GoalMetric;
  progressPercent?: number;
  progressMode?: ProgressMode;
  riskReason?: string;
}

export interface CreatePlanDto {
  workspaceId: string;
  title: string;
  strategySummary: string;
  ownerId: string;
  startDate: string;
  targetDate: string;
  priority?: TaskPriority;
  goalId?: string;
  milestones?: Array<{
    title: string;
    dueDate: string;
    description?: string;
  }>;
  resources?: string[];
  risks?: string[];
}

export interface UpdatePlanDto {
  title?: string;
  strategySummary?: string;
  ownerId?: string;
  startDate?: string;
  targetDate?: string;
  priority?: TaskPriority;
  status?: PlanStatus;
  goalId?: string;
  progressPercent?: number;
  progressMode?: ProgressMode;
  riskReason?: string;
  resources?: string[];
  risks?: string[];
}

export interface CreateMilestoneDto {
  title: string;
  dueDate: string;
  description?: string;
  ownerId?: string;
}

export interface UpdateMilestoneDto {
  title?: string;
  dueDate?: string;
  description?: string;
  status?: MilestoneStatus;
  completedAt?: string;
}

export interface PlansGoalsOverviewResponse {
  summary: {
    activeGoalsCount: number;
    activePlansCount: number;
    atRiskCount: number;
    milestonesDueSoonCount: number;
  };
  goals: GoalItem[];
  plans: PlanItem[];
}

