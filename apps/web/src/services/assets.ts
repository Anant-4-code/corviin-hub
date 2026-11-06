import { api } from '@/lib/api';
import {
  AssetItem,
  AssetVersion,
  AssetRelationship,
  AssetFilterDto,
  PaginatedAssetsResponseDto,
  UploadIntentDto,
  UploadIntentResponseDto,
  ConfirmUploadDto,
  DirectUploadDto,
  CreateAssetVersionDto,
  AddAssetRelationshipDto,
  UpdateAssetMetadataDto,
} from '@corviin-hub/shared';

export async function fetchAssets(
  workspaceId: string,
  filter?: AssetFilterDto,
): Promise<PaginatedAssetsResponseDto> {
  const params = new URLSearchParams();
  params.set('workspaceId', workspaceId);

  if (filter?.search) params.set('search', filter.search);
  if (filter?.category) params.set('category', filter.category);
  if (filter?.typeGroup) params.set('typeGroup', filter.typeGroup);
  if (filter?.folderId) params.set('folderId', filter.folderId);
  if (filter?.includeSubfolders) params.set('includeSubfolders', 'true');
  if (filter?.viewModeFilter) params.set('viewModeFilter', filter.viewModeFilter);
  if (filter?.campaignId) params.set('campaignId', filter.campaignId);
  if (filter?.meetingId) params.set('meetingId', filter.meetingId);
  if (filter?.planId) params.set('planId', filter.planId);
  if (filter?.taskId) params.set('taskId', filter.taskId);
  if (filter?.crmRecordId) params.set('crmRecordId', filter.crmRecordId);
  if (filter?.uploaderId) params.set('uploaderId', filter.uploaderId);
  if (filter?.tag) params.set('tag', filter.tag);
  if (filter?.sortBy) params.set('sortBy', filter.sortBy);
  if (filter?.sortOrder) params.set('sortOrder', filter.sortOrder);
  if (filter?.page) params.set('page', String(filter.page));
  if (filter?.pageSize) params.set('pageSize', String(filter.pageSize));

  return api.get<PaginatedAssetsResponseDto>(`/assets?${params.toString()}`);
}

export async function fetchAssetById(
  workspaceId: string,
  id: string,
): Promise<AssetItem> {
  return api.get<AssetItem>(`/assets/${id}?workspaceId=${workspaceId}`);
}

export async function requestUploadIntent(
  workspaceId: string,
  dto: UploadIntentDto,
): Promise<UploadIntentResponseDto> {
  return api.post<UploadIntentResponseDto>(`/assets/upload-intent?workspaceId=${workspaceId}`, dto);
}

export async function confirmUpload(
  workspaceId: string,
  dto: ConfirmUploadDto,
): Promise<AssetItem> {
  return api.post<AssetItem>(`/assets/confirm-upload?workspaceId=${workspaceId}`, dto);
}

export async function directUpload(
  workspaceId: string,
  dto: DirectUploadDto,
): Promise<AssetItem> {
  return api.post<AssetItem>(`/assets/direct-upload?workspaceId=${workspaceId}`, dto);
}

export async function updateAssetMetadata(
  workspaceId: string,
  id: string,
  dto: UpdateAssetMetadataDto,
): Promise<AssetItem> {
  return api.patch<AssetItem>(`/assets/${id}?workspaceId=${workspaceId}`, dto);
}

export async function addAssetVersion(
  workspaceId: string,
  id: string,
  dto: CreateAssetVersionDto,
): Promise<AssetVersion> {
  return api.post<AssetVersion>(`/assets/${id}/versions?workspaceId=${workspaceId}`, dto);
}

export async function addAssetRelationship(
  workspaceId: string,
  id: string,
  dto: AddAssetRelationshipDto,
): Promise<AssetRelationship> {
  return api.post<AssetRelationship>(`/assets/${id}/relationships?workspaceId=${workspaceId}`, dto);
}

export async function unlinkAssetRelationship(
  workspaceId: string,
  id: string,
  relationshipId: string,
): Promise<void> {
  await api.delete(`/assets/${id}/relationships/${relationshipId}?workspaceId=${workspaceId}`);
}

export async function fetchAuthorizedDownload(
  workspaceId: string,
  id: string,
  versionId?: string,
): Promise<{ downloadUrl: string; previewUrl: string; fileName: string; sizeBytes: number; mimeType: string }> {
  const params = new URLSearchParams({ workspaceId });
  if (versionId) params.set('versionId', versionId);
  return api.get(`/assets/${id}/download?${params.toString()}`);
}

export async function moveAsset(
  workspaceId: string,
  id: string,
  targetFolderId: string | null,
): Promise<AssetItem> {
  return api.post<AssetItem>(`/assets/${id}/move?workspaceId=${workspaceId}`, { targetFolderId });
}

export async function bulkMoveAssets(
  workspaceId: string,
  assetIds: string[],
  targetFolderId: string | null,
): Promise<{ success: boolean; movedCount: number; targetFolderId: string | null }> {
  return api.post(`/assets/bulk-move?workspaceId=${workspaceId}`, { assetIds, targetFolderId });
}

export async function deleteAsset(
  workspaceId: string,
  id: string,
): Promise<{ success: boolean; deletedId: string }> {
  return api.delete<{ success: boolean; deletedId: string }>(`/assets/${id}?workspaceId=${workspaceId}`);
}

