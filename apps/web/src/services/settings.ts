import { api } from '@/lib/api';
import type {
  ApiResponse,
  PersonalSettings,
  UpdatePersonalSettingsDto,
  AccountSecuritySummary,
  WorkspaceSettings,
  UpdateWorkspaceSettingsDto,
} from '@corviin-hub/shared';

export async function fetchPersonalSettings(profileId?: string): Promise<PersonalSettings> {
  const url = profileId ? `/settings/personal?profileId=${encodeURIComponent(profileId)}` : '/settings/personal';
  const res = await api.get<ApiResponse<PersonalSettings>>(url);
  return res.data;
}

export async function updatePersonalSettings(
  dto: UpdatePersonalSettingsDto,
  profileId?: string,
): Promise<PersonalSettings> {
  const url = profileId ? `/settings/personal?profileId=${encodeURIComponent(profileId)}` : '/settings/personal';
  const res = await api.patch<ApiResponse<PersonalSettings>>(url, dto);
  return res.data;
}

export async function fetchAccountSecurity(profileId?: string): Promise<AccountSecuritySummary> {
  const url = profileId ? `/settings/security?profileId=${encodeURIComponent(profileId)}` : '/settings/security';
  const res = await api.get<ApiResponse<AccountSecuritySummary>>(url);
  return res.data;
}

export async function fetchWorkspaceSettings(workspaceId: string): Promise<WorkspaceSettings> {
  const res = await api.get<ApiResponse<WorkspaceSettings>>(`/settings/workspace?workspaceId=${encodeURIComponent(workspaceId)}`);
  return res.data;
}

export async function updateWorkspaceSettings(
  workspaceId: string,
  dto: UpdateWorkspaceSettingsDto,
): Promise<WorkspaceSettings> {
  const res = await api.patch<ApiResponse<WorkspaceSettings>>(
    `/settings/workspace?workspaceId=${encodeURIComponent(workspaceId)}`,
    dto,
  );
  return res.data;
}

export async function resetWorkspaceSettings(workspaceId: string): Promise<WorkspaceSettings> {
  const res = await api.post<ApiResponse<WorkspaceSettings>>(
    `/settings/workspace/reset?workspaceId=${encodeURIComponent(workspaceId)}`,
    {},
  );
  return res.data;
}

export async function checkImpact(
  workspaceId: string,
  type: 'CRM_STAGE' | 'CRM_CATEGORY' | 'CRM_SOURCE' | 'PARTNER_TYPE',
  value: string,
): Promise<{ affectedCount: number; message: string; safeToRemove: boolean }> {
  const params = new URLSearchParams({
    workspaceId,
    type,
    value,
  });
  const res = await api.get<
    ApiResponse<{ affectedCount: number; message: string; safeToRemove: boolean }>
  >(`/settings/impact?${params.toString()}`);
  return res.data;
}

