import { api } from '@/lib/api';
import {
  CampaignItem,
  CreateCampaignDto,
  UpdateCampaignDto,
  AdvanceCampaignStageDto,
  CreateScriptVersionDto,
  UpdateScriptStatusDto,
  UpdateFootageChecklistDto,
  LinkCampaignAssetDto,
  CreateCampaignTaskDto,
  CreateContentEventDto,
  ContentEventItem,
  CampaignAssetLink,
  ScriptVersion,
  FootageChecklistItem,
  TaskItem,
} from '@corviin-hub/shared';

export async function fetchCampaigns(
  workspaceId: string,
  filter?: {
    stage?: string;
    status?: string;
    ownerId?: string;
    priority?: string;
    platform?: string;
    search?: string;
  },
): Promise<CampaignItem[]> {
  const params = new URLSearchParams();
  params.set('workspaceId', workspaceId);
  if (filter?.stage) params.set('stage', filter.stage);
  if (filter?.status) params.set('status', filter.status);
  if (filter?.ownerId) params.set('ownerId', filter.ownerId);
  if (filter?.priority) params.set('priority', filter.priority);
  if (filter?.platform) params.set('platform', filter.platform);
  if (filter?.search) params.set('search', filter.search);

  return api.get<CampaignItem[]>(`/campaigns?${params.toString()}`);
}

export async function fetchCampaignById(
  workspaceId: string,
  id: string,
): Promise<CampaignItem> {
  return api.get<CampaignItem>(`/campaigns/${id}?workspaceId=${workspaceId}`);
}

export async function createCampaign(dto: CreateCampaignDto): Promise<CampaignItem> {
  return api.post<CampaignItem>('/campaigns', dto);
}

export async function updateCampaign(
  workspaceId: string,
  id: string,
  dto: UpdateCampaignDto,
): Promise<CampaignItem> {
  return api.patch<CampaignItem>(`/campaigns/${id}?workspaceId=${workspaceId}`, dto);
}

export async function advanceCampaignStage(
  workspaceId: string,
  id: string,
  dto: AdvanceCampaignStageDto,
): Promise<CampaignItem> {
  return api.post<CampaignItem>(`/campaigns/${id}/advance-stage?workspaceId=${workspaceId}`, dto);
}

export async function addScriptVersion(
  workspaceId: string,
  id: string,
  dto: CreateScriptVersionDto,
): Promise<ScriptVersion> {
  return api.post<ScriptVersion>(`/campaigns/${id}/scripts?workspaceId=${workspaceId}`, dto);
}

export async function updateScriptStatus(
  workspaceId: string,
  id: string,
  scriptId: string,
  dto: UpdateScriptStatusDto,
): Promise<ScriptVersion> {
  return api.patch<ScriptVersion>(
    `/campaigns/${id}/scripts/${scriptId}/status?workspaceId=${workspaceId}`,
    dto,
  );
}

export async function updateFootageChecklist(
  workspaceId: string,
  id: string,
  dto: UpdateFootageChecklistDto,
): Promise<FootageChecklistItem[]> {
  return api.patch<FootageChecklistItem[]>(
    `/campaigns/${id}/footage-checklist?workspaceId=${workspaceId}`,
    dto,
  );
}

export async function fetchCampaignAssets(
  workspaceId: string,
  id: string,
): Promise<CampaignAssetLink[]> {
  return api.get<CampaignAssetLink[]>(`/campaigns/${id}/assets?workspaceId=${workspaceId}`);
}

export async function linkCampaignAsset(
  workspaceId: string,
  id: string,
  dto: LinkCampaignAssetDto,
): Promise<CampaignAssetLink> {
  return api.post<CampaignAssetLink>(`/campaigns/${id}/assets?workspaceId=${workspaceId}`, dto);
}

export async function unlinkCampaignAsset(
  workspaceId: string,
  id: string,
  linkId: string,
): Promise<{ success: boolean; message: string }> {
  return api.delete<{ success: boolean; message: string }>(
    `/campaigns/${id}/assets/${linkId}?workspaceId=${workspaceId}`,
  );
}

export async function createCampaignTask(
  workspaceId: string,
  id: string,
  dto: CreateCampaignTaskDto,
): Promise<TaskItem> {
  return api.post<TaskItem>(`/campaigns/${id}/tasks?workspaceId=${workspaceId}`, dto);
}

export async function fetchCampaignTasks(
  workspaceId: string,
  id: string,
): Promise<TaskItem[]> {
  return api.get<TaskItem[]>(`/campaigns/${id}/tasks?workspaceId=${workspaceId}`);
}

export async function archiveCampaign(
  workspaceId: string,
  id: string,
): Promise<CampaignItem> {
  return api.patch<CampaignItem>(`/campaigns/${id}/archive?workspaceId=${workspaceId}`, {});
}

export async function createCampaignContentEvent(
  campaignId: string,
  dto: Omit<CreateContentEventDto, 'campaignId'>,
): Promise<ContentEventItem> {
  return api.post<ContentEventItem>(`/campaigns/${campaignId}/content`, dto);
}
