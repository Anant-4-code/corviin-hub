import { api } from '@/lib/api';
import type {
  ApiResponse,
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
} from '@corviin-hub/shared';

export async function fetchPlansGoalsOverview(): Promise<PlansGoalsOverviewResponse> {
  const res = await api.get<ApiResponse<PlansGoalsOverviewResponse>>('/plans-goals/overview');
  return res.data;
}

export async function fetchGoals(params?: { ownerId?: string; status?: GoalStatus; search?: string }): Promise<GoalItem[]> {
  const searchParams = new URLSearchParams();
  if (params?.ownerId && params.ownerId !== 'ALL') searchParams.append('ownerId', params.ownerId);
  if (params?.status) searchParams.append('status', params.status);
  if (params?.search) searchParams.append('search', params.search);
  const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';
  const res = await api.get<ApiResponse<GoalItem[]>>(`/plans-goals/goals${qs}`);
  return res.data;
}

export async function fetchGoalById(id: string): Promise<GoalItem> {
  const res = await api.get<ApiResponse<GoalItem>>(`/plans-goals/goals/${id}`);
  return res.data;
}

export async function createGoal(dto: CreateGoalDto): Promise<GoalItem> {
  const res = await api.post<ApiResponse<GoalItem>>('/plans-goals/goals', dto);
  return res.data;
}

export async function updateGoal(id: string, dto: UpdateGoalDto): Promise<GoalItem> {
  const res = await api.patch<ApiResponse<GoalItem>>(`/plans-goals/goals/${id}`, dto);
  return res.data;
}

export async function fetchPlans(params?: {
  ownerId?: string;
  status?: PlanStatus;
  goalId?: string;
  search?: string;
}): Promise<PlanItem[]> {
  const searchParams = new URLSearchParams();
  if (params?.ownerId && params.ownerId !== 'ALL') searchParams.append('ownerId', params.ownerId);
  if (params?.status) searchParams.append('status', params.status);
  if (params?.goalId) searchParams.append('goalId', params.goalId);
  if (params?.search) searchParams.append('search', params.search);
  const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';
  const res = await api.get<ApiResponse<PlanItem[]>>(`/plans-goals/plans${qs}`);
  return res.data;
}

export async function fetchPlanById(id: string): Promise<PlanItem> {
  const res = await api.get<ApiResponse<PlanItem>>(`/plans-goals/plans/${id}`);
  return res.data;
}

export async function createPlan(dto: CreatePlanDto): Promise<PlanItem> {
  const res = await api.post<ApiResponse<PlanItem>>('/plans-goals/plans', dto);
  return res.data;
}

export async function updatePlan(id: string, dto: UpdatePlanDto): Promise<PlanItem> {
  const res = await api.patch<ApiResponse<PlanItem>>(`/plans-goals/plans/${id}`, dto);
  return res.data;
}

export async function addPlanMilestone(planId: string, dto: CreateMilestoneDto): Promise<MilestoneItem> {
  const res = await api.post<ApiResponse<MilestoneItem>>(`/plans-goals/plans/${planId}/milestones`, dto);
  return res.data;
}

export async function updatePlanMilestone(
  planId: string,
  milestoneId: string,
  dto: UpdateMilestoneDto,
): Promise<MilestoneItem> {
  const res = await api.patch<ApiResponse<MilestoneItem>>(
    `/plans-goals/plans/${planId}/milestones/${milestoneId}`,
    dto,
  );
  return res.data;
}

