export type DeleteFolderStrategy =
  | 'move_to_parent'
  | 'move_to_general'
  | 'archive'
  | 'cascade';

export interface FolderBreadcrumbItem {
  id: string;
  name: string;
  parentFolderId?: string | null;
}

export interface AssetFolderItem {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  parentFolderId?: string | null;
  color?: string;
  icon?: string;
  createdBy: string;
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
  subfolderCount?: number;
  directAssetCount?: number;
  totalAssetCount?: number;
  subfolders?: AssetFolderItem[];
  breadcrumbs?: FolderBreadcrumbItem[];
}

export interface CreateFolderDto {
  name: string;
  description?: string;
  parentFolderId?: string | null;
  color?: string;
  icon?: string;
  createdBy?: string;
  createdByName?: string;
}

export interface UpdateFolderDto {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface MoveFolderDto {
  targetParentFolderId: string | null;
}

export interface DeleteFolderDto {
  strategy?: DeleteFolderStrategy;
}

export interface MoveAssetDto {
  targetFolderId: string | null;
}

export interface BulkMoveAssetsDto {
  assetIds: string[];
  targetFolderId: string | null;
}

export interface FolderSuggestion {
  folderId: string;
  folderName: string;
  reason: string;
}

