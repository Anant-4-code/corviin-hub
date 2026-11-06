import { AssetCategory, AssetTypeGroup } from '../enums';

export interface AssetVersion {
  id: string;
  assetId: string;
  versionNumber: number;
  fileName: string;
  storageKey: string;
  sizeBytes: number;
  mimeType: string;
  uploaderId: string;
  uploaderName: string;
  changeNote?: string;
  createdAt: string;
  downloadUrl?: string;
}

export type RelatedRecordType =
  | 'campaign'
  | 'task'
  | 'meeting'
  | 'plan'
  | 'crm_lead'
  | 'crm_buyer'
  | 'crm_partner'
  | 'other';

export interface AssetRelationship {
  id: string;
  assetId: string;
  relatedType: RelatedRecordType;
  relatedId: string;
  relatedTitle: string;
  stage?: string;
  createdAt: string;
}

export interface AssetItem {
  id: string;
  workspaceId: string;
  folderId?: string | null;
  folderName?: string;
  title: string;
  originalFileName: string;
  storageKey: string;
  storageProvider: 's3' | 'r2' | 'mock';
  mimeType: string;
  sizeBytes: number;
  category: AssetCategory;
  typeGroup: AssetTypeGroup;
  uploaderId: string;
  uploaderName: string;
  currentVersionNumber: number;
  versions: AssetVersion[];
  relationships: AssetRelationship[];
  tags: string[];
  description?: string;
  previewUrl?: string;
  downloadUrl?: string;
  archivedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AssetStorageSummary {
  totalCount: number;
  totalSizeBytes: number;
  byType: {
    images: number;
    videos: number;
    audio: number;
    documents: number;
    other: number;
  };
  byCategory: Record<string, number>;
}

export interface AssetFilterDto {
  search?: string;
  category?: AssetCategory;
  typeGroup?: AssetTypeGroup;
  folderId?: string;
  includeSubfolders?: boolean;
  viewModeFilter?: 'all' | 'folders' | 'recent' | 'linked';
  campaignId?: string;
  meetingId?: string;
  planId?: string;
  taskId?: string;
  crmRecordId?: string;
  uploaderId?: string;
  tag?: string;
  sortBy?: 'date' | 'name' | 'size';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface PaginatedAssetsResponseDto {
  items: AssetItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  summary: AssetStorageSummary;
}

export interface UploadIntentDto {
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  category: AssetCategory;
  folderId?: string | null;
  title?: string;
  description?: string;
  tags?: string[];
  relatedType?: RelatedRecordType;
  relatedId?: string;
  relatedTitle?: string;
  stage?: string;
}

export interface UploadIntentResponseDto {
  uploadIntentId: string;
  storageKey: string;
  uploadUrl: string;
  expiresAt: string;
  token: string;
}

export interface ConfirmUploadDto {
  uploadIntentId: string;
  storageKey: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  category: AssetCategory;
  folderId?: string | null;
  title?: string;
  description?: string;
  tags?: string[];
  relatedType?: RelatedRecordType;
  relatedId?: string;
  relatedTitle?: string;
  stage?: string;
  uploaderId?: string;
  uploaderName?: string;
}

export interface DirectUploadDto {
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  category: AssetCategory;
  folderId?: string | null;
  title: string;
  description?: string;
  tags?: string[];
  relatedType?: RelatedRecordType;
  relatedId?: string;
  relatedTitle?: string;
  stage?: string;
  uploaderId?: string;
  uploaderName?: string;
  mockContent?: string;
}

export interface CreateAssetVersionDto {
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  storageKey?: string;
  changeNote?: string;
  uploaderId?: string;
  uploaderName?: string;
}

export interface AddAssetRelationshipDto {
  relatedType: RelatedRecordType;
  relatedId: string;
  relatedTitle: string;
  stage?: string;
}

export interface UpdateAssetMetadataDto {
  title?: string;
  category?: AssetCategory;
  description?: string;
  tags?: string[];
}

