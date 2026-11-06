import { CampaignStage, ContentEventType, ContentStatus, ContentPlatform, TaskPriority } from '../enums';
import { RescheduleEvent, TaskActivityEvent, TaskItem } from './task';

export interface ContentEventItem {
  id: string;
  campaignId: string;
  campaignTitle: string;
  workspaceId: string;
  title: string;
  eventType: ContentEventType;
  plannedDate: string; // ISO string
  actualDate?: string; // ISO string
  ownerId: string;
  status: ContentStatus;
  platform: ContentPlatform;
  publicUrl?: string;
  notes?: string;
  rescheduleHistory: RescheduleEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface CampaignStageHistoryItem {
  id: string;
  fromStage: CampaignStage;
  toStage: CampaignStage;
  actorId: string;
  actorName: string;
  timestamp: string; // ISO string
  notes?: string;
}

export interface ScriptVersion {
  id: string;
  versionNumber: number;
  content: string;
  hook?: string;
  shotBreakdown?: string;
  cta?: string;
  caption?: string;
  hashtags?: string[];
  authorId: string;
  authorName: string;
  status: 'DRAFT' | 'APPROVED' | 'CHANGES_REQUESTED';
  feedback?: string;
  timestamp: string;
}

export interface FootageChecklistItem {
  id: string;
  label: string;
  category: 'SCENE' | 'B_ROLL' | 'VOICEOVER' | 'SCREEN_RECORDING';
  status: 'DONE' | 'MISSING' | 'RETAKE';
  notes?: string;
}

export type CampaignAssetCategory =
  | 'REFERENCES'
  | 'SCRIPTS'
  | 'RAW_FOOTAGE'
  | 'IMAGES'
  | 'AUDIO_VO'
  | 'DRAFT_EDITS'
  | 'FINAL_APPROVED'
  | 'PUBLISHED_PROOF'
  | 'OTHER';

export interface CampaignAssetLink {
  id: string;
  assetId: string;
  campaignId: string;
  workspaceId: string;
  title: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  category: CampaignAssetCategory;
  stage: CampaignStage;
  url: string;
  uploadedBy: string;
  uploadedByName: string;
  createdAt: string;
  isFinalApproved?: boolean;
}

export interface CampaignItem {
  id: string;
  workspaceId: string;
  title: string;
  description: string;
  stage: CampaignStage;
  ownerId: string;
  startDate: string; // ISO string
  targetPublishDate: string; // ISO string
  actualPublishDate?: string; // ISO string
  platform: ContentPlatform;
  priority: TaskPriority;
  status: ContentStatus;
  progressPercent: number;

  // Stage 1 Metadata: Initial Idea
  objective?: string;
  targetAudience?: string;
  conceptNotes?: string;
  referenceLinks?: string[];

  // Stage 2 Metadata: Scripting & Planning
  finalTopic?: string;
  scriptApproved?: boolean;
  scriptReviewerId?: string;
  scripts?: ScriptVersion[];

  // Stage 3 Metadata: Recording & Asset Upload
  recordingDate?: string;
  recordingLocation?: string;
  footageChecklist?: FootageChecklistItem[];
  retakeNotes?: string;

  // Stage 4 Metadata: Editing & Final Asset
  editorId?: string;
  editingInstructions?: string;
  aspectRatio?: string;
  finalAssetApproved?: boolean;
  finalAssetUrl?: string;
  revisionRequests?: string[];

  // Stage 5 Metadata: Posting & Completion
  scheduledDate?: string;
  publicUrl?: string;
  publishingOwnerId?: string;
  publishedProofUrl?: string;
  completionDate?: string;
  performanceNotes?: string;

  // Associated entities
  contentItems: ContentEventItem[];
  assetLinks: CampaignAssetLink[];
  stageHistory: CampaignStageHistoryItem[];
  rescheduleHistory: RescheduleEvent[];
  activity: TaskActivityEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignDto {
  workspaceId: string;
  title: string;
  description: string;
  stage?: CampaignStage;
  ownerId: string;
  startDate: string;
  targetPublishDate: string;
  platform: ContentPlatform;
  priority?: TaskPriority;
  objective?: string;
  targetAudience?: string;
  conceptNotes?: string;
  referenceLinks?: string[];
  initialEvents?: Array<{
    title: string;
    eventType: ContentEventType;
    plannedDate: string;
    ownerId?: string;
    platform?: ContentPlatform;
  }>;
}

export interface UpdateCampaignDto {
  title?: string;
  description?: string;
  ownerId?: string;
  targetPublishDate?: string;
  platform?: ContentPlatform;
  priority?: TaskPriority;
  status?: ContentStatus;
  objective?: string;
  targetAudience?: string;
  conceptNotes?: string;
  referenceLinks?: string[];
  finalTopic?: string;
  recordingDate?: string;
  recordingLocation?: string;
  retakeNotes?: string;
  editorId?: string;
  editingInstructions?: string;
  aspectRatio?: string;
  scheduledDate?: string;
  publicUrl?: string;
  publishingOwnerId?: string;
  performanceNotes?: string;
}

export interface AdvanceCampaignStageDto {
  toStage: CampaignStage;
  actorId?: string;
  actorName?: string;
  notes?: string;
}

export interface CreateScriptVersionDto {
  content: string;
  hook?: string;
  shotBreakdown?: string;
  cta?: string;
  caption?: string;
  hashtags?: string[];
  revisionNote?: string;
  authorId?: string;
  authorName?: string;
}

export interface UpdateScriptStatusDto {
  status: 'APPROVED' | 'CHANGES_REQUESTED';
  feedback?: string;
  actorId?: string;
  actorName?: string;
}

export interface UpdateFootageChecklistDto {
  items: FootageChecklistItem[];
}

export interface LinkCampaignAssetDto {
  assetId?: string;
  title: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  category: CampaignAssetCategory;
  stage: CampaignStage;
  url: string;
  uploadedBy?: string;
  uploadedByName?: string;
  isFinalApproved?: boolean;
}

export interface CreateCampaignTaskDto {
  title: string;
  assigneeId?: string;
  priority?: TaskPriority;
  deadline?: string;
  stage: CampaignStage;
}

export interface CreateContentEventDto {
  workspaceId: string;
  campaignId: string;
  title: string;
  eventType: ContentEventType;
  plannedDate: string;
  ownerId: string;
  platform: ContentPlatform;
  notes?: string;
}

export interface RescheduleContentEventDto {
  newDate: string;
  reason: string;
  actorId?: string;
}

export interface MarkContentPublishedDto {
  actualPublishDate?: string;
  publicUrl: string;
  actorId?: string;
}
