import { api } from '@/lib/api';
import {
  AssetFolderItem,
  CreateFolderDto,
  UpdateFolderDto,
  MoveFolderDto,
  DeleteFolderDto,
  FolderSuggestion,
} from '@corviin-hub/shared';

export async function fetchFolders(workspaceId: string, tree = false): Promise<AssetFolderItem[]> {
  const params = new URLSearchParams({ workspaceId });
  if (tree) params.set('tree', 'true');
  return api.get<AssetFolderItem[]>(`/folders?${params.toString()}`);
}

export async function fetchFolderTree(workspaceId: string): Promise<AssetFolderItem[]> {
  return api.get<AssetFolderItem[]>(`/folders/tree?workspaceId=${workspaceId}`);
}

export async function fetchFolderById(workspaceId: string, id: string): Promise<AssetFolderItem> {
  return api.get<AssetFolderItem>(`/folders/${id}?workspaceId=${workspaceId}`);
}

export async function createFolder(
  workspaceId: string,
  dto: CreateFolderDto,
): Promise<AssetFolderItem> {
  return api.post<AssetFolderItem>(`/folders?workspaceId=${workspaceId}`, dto);
}

export async function updateFolder(
  workspaceId: string,
  id: string,
  dto: UpdateFolderDto,
): Promise<AssetFolderItem> {
  return api.patch<AssetFolderItem>(`/folders/${id}?workspaceId=${workspaceId}`, dto);
}

export async function moveFolder(
  workspaceId: string,
  id: string,
  dto: MoveFolderDto,
): Promise<AssetFolderItem> {
  return api.post<AssetFolderItem>(`/folders/${id}/move?workspaceId=${workspaceId}`, dto);
}

export async function deleteFolder(
  workspaceId: string,
  id: string,
  dto?: DeleteFolderDto,
): Promise<{ success: boolean; deletedFolderId: string }> {
  return api.delete<{ success: boolean; deletedFolderId: string }>(
    `/folders/${id}?workspaceId=${workspaceId}`,
    dto,
  );
}

export async function fetchFolderSuggestion(
  workspaceId: string,
  source?: string,
  mimeType?: string,
): Promise<FolderSuggestion> {
  const params = new URLSearchParams({ workspaceId });
  if (source) params.set('source', source);
  if (mimeType) params.set('mimeType', mimeType);
  return api.get<FolderSuggestion>(`/folders/suggestion?${params.toString()}`);
}
