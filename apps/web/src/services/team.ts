import { api } from '@/lib/api';
import type {
  ApiResponse,
  TeamMember,
  TeamMemberSummaryDto,
  TeamMemberDetailDto,
  CreateTeamMemberDto,
  UpdateTeamMemberDto,
  MemberStatus,
} from '@corviin-hub/shared';

export async function fetchTeamMembers(
  workspaceId: string,
  filter?: { status?: string; search?: string },
): Promise<TeamMemberSummaryDto[]> {
  const params = new URLSearchParams();
  params.set('workspaceId', workspaceId);
  if (filter?.status) params.set('status', filter.status);
  if (filter?.search) params.set('search', filter.search);

  const res = await api.get<ApiResponse<TeamMemberSummaryDto[]>>(`/team/members?${params.toString()}`);
  return res.data;
}

export async function fetchTeamMemberDetail(
  workspaceId: string,
  id: string,
): Promise<TeamMemberDetailDto> {
  const res = await api.get<ApiResponse<TeamMemberDetailDto>>(`/team/members/${id}?workspaceId=${workspaceId}`);
  return res.data;
}

export async function createTeamMember(dto: CreateTeamMemberDto): Promise<TeamMember> {
  const res = await api.post<ApiResponse<TeamMember>>('/team/members', dto);
  return res.data;
}

export async function updateTeamMember(
  id: string,
  dto: UpdateTeamMemberDto,
): Promise<TeamMember> {
  const res = await api.patch<ApiResponse<TeamMember>>(`/team/members/${id}`, dto);
  return res.data;
}

export async function toggleTeamMemberStatus(
  id: string,
  status: MemberStatus,
): Promise<TeamMember> {
  const res = await api.post<ApiResponse<TeamMember>>(`/team/members/${id}/status`, { status });
  return res.data;
}

export async function fetchWorkspaceWorkload(workspaceId: string) {
  const res = await api.get<ApiResponse<any>>(`/team/workload?workspaceId=${workspaceId}`);
  return res.data;
}

