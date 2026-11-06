import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Optional,
} from '@nestjs/common';
import {
  AssetFolderItem,
  CreateFolderDto,
  UpdateFolderDto,
  MoveFolderDto,
  DeleteFolderStrategy,
  FolderBreadcrumbItem,
  FolderSuggestion,
  AuditEntityType,
  AuditAction,
} from '@corviin-hub/shared';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

interface DefaultFolderDefinition {
  name: string;
  description: string;
  icon?: string;
  color?: string;
  subfolders?: { name: string; description: string; icon?: string }[];
}

export const DEFAULT_WORKSPACE_FOLDERS: DefaultFolderDefinition[] = [
  {
    name: 'Meetings',
    description: 'Meeting documents, recordings, presentations, and minutes',
    icon: 'Users2',
    color: '#0d9488',
    subfolders: [
      { name: 'Meeting Documents', description: 'Agenda, briefing packs, and participant briefs' },
      { name: 'Minutes & Notes', description: 'Formal minutes, action items, and discussion transcripts' },
      { name: 'Presentations', description: 'Slide decks, client decks, and keynote presentations' },
    ],
  },
  {
    name: 'Plans & Goals',
    description: 'Quarterly planning, research decks, and strategic progress reports',
    icon: 'Target',
    color: '#2563eb',
    subfolders: [
      { name: 'Project Plans', description: 'Master plans, timelines, and architectural milestones' },
      { name: 'Research', description: 'Market analysis, technical evaluation, and competitive audits' },
      { name: 'Reports', description: 'Quarterly reviews, operational summaries, and retrospective digests' },
    ],
  },
  {
    name: 'Campaigns',
    description: 'Marketing, social, brand creative, raw footage, and final approved assets',
    icon: 'Megaphone',
    color: '#d97706',
    subfolders: [
      { name: 'Campaign Documents', description: 'Briefs, scripts, shot lists, and campaign proposals' },
      { name: 'Images & Creative', description: 'Visual assets, graphics, and social promo artwork' },
      { name: 'Videos & Raw Footage', description: 'High-res recordings, B-roll, and studio footage' },
      { name: 'Final Assets', description: 'Exported videos, final published proof, and approved creative' },
    ],
  },
  {
    name: 'Calls & Recordings',
    description: 'Client consultation calls, audio recordings, and automated transcripts',
    icon: 'PhoneCall',
    color: '#7c3aed',
    subfolders: [
      { name: 'Call Recordings', description: 'Full audio and video recordings of client/partner calls' },
      { name: 'Transcripts', description: 'Cleaned text transcripts with speaker attribution' },
      { name: 'AI Summaries', description: 'Key decision highlights, action items, and call summaries' },
    ],
  },
  {
    name: 'Documents & PDFs',
    description: 'Formal agreements, legal documentation, signed contracts, and invoices',
    icon: 'FileText',
    color: '#0284c7',
    subfolders: [
      { name: 'Contracts', description: 'Executed client and partner master service agreements' },
      { name: 'Agreements', description: 'NDAs, MOU drafts, and service level agreements' },
      { name: 'Invoices', description: 'Billing notices, tax invoices, and payment receipts' },
    ],
  },
  {
    name: 'Media & Creative',
    description: 'General media library containing raw, edited, and stock resources',
    icon: 'Image',
    color: '#e11d48',
    subfolders: [
      { name: 'Images', description: 'Brand photos, architectural renders, and graphics' },
      { name: 'Videos', description: 'Tutorials, walkthroughs, and promo clips' },
      { name: 'Audio', description: 'Voiceovers, background audio tracks, and sound effects' },
    ],
  },
  {
    name: 'General',
    description: 'General unorganized workspace files and incoming uploads',
    icon: 'Folder',
    color: '#64748b',
    subfolders: [
      { name: 'Unsorted', description: 'Default landing folder for incoming or moved assets' },
    ],
  },
];

@Injectable()
export class FoldersService {
  private folders: AssetFolderItem[] = [];

  constructor(
    @Optional() private readonly prisma?: PrismaService,
    @Optional() private readonly notificationsService?: NotificationsService,
  ) {
    this.seedAllDefaults();
  }

  // ==========================================
  // DETERMINISTIC DEFAULT FOLDERS SEEDING
  // ==========================================
  private seedAllDefaults() {
    const techWs = 'ws-tech-0001-0000-000000000001';
    const realWs = 'ws-real-0002-0000-000000000002';

    this.provisionWorkspaceDefaults(techWs, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Anant');
    this.provisionWorkspaceDefaults(realWs, 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Rohit');
  }

  provisionWorkspaceDefaults(workspaceId: string, createdBy: string = 'system', createdByName: string = 'System'): AssetFolderItem[] {
    const createdFolders: AssetFolderItem[] = [];
    const prefix = workspaceId === 'ws-tech-0001-0000-000000000001' ? 'fld-tch' : 'fld-rel';

    for (const def of DEFAULT_WORKSPACE_FOLDERS) {
      const rootId = `${prefix}-${def.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      
      let rootFolder = this.folders.find((f) => f.workspaceId === workspaceId && f.name.toLowerCase() === def.name.toLowerCase() && !f.parentFolderId);
      if (!rootFolder) {
        rootFolder = {
          id: rootId,
          workspaceId,
          name: def.name,
          description: def.description,
          parentFolderId: null,
          color: def.color,
          icon: def.icon,
          createdBy,
          createdByName,
          createdAt: new Date('2026-01-01T00:00:00.000Z').toISOString(),
          updatedAt: new Date('2026-01-01T00:00:00.000Z').toISOString(),
          archivedAt: null,
        };
        this.folders.push(rootFolder);
        createdFolders.push(rootFolder);
      }

      if (def.subfolders) {
        for (const sub of def.subfolders) {
          const subId = `${rootFolder.id}-${sub.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
          const existingSub = this.folders.find(
            (f) => f.workspaceId === workspaceId && f.parentFolderId === rootFolder!.id && f.name.toLowerCase() === sub.name.toLowerCase(),
          );
          if (!existingSub) {
            const subFolder: AssetFolderItem = {
              id: subId,
              workspaceId,
              name: sub.name,
              description: sub.description,
              parentFolderId: rootFolder.id,
              color: def.color,
              icon: sub.icon || 'Folder',
              createdBy,
              createdByName,
              createdAt: new Date('2026-01-01T00:00:00.000Z').toISOString(),
              updatedAt: new Date('2026-01-01T00:00:00.000Z').toISOString(),
              archivedAt: null,
            };
            this.folders.push(subFolder);
            createdFolders.push(subFolder);
          }
        }
      }
    }

    return createdFolders;
  }

  // ==========================================
  // QUERY FOLDERS
  // ==========================================
  findAll(workspaceId: string, includeArchived = false): AssetFolderItem[] {
    const list = this.folders.filter(
      (f) => f.workspaceId === workspaceId && (includeArchived ? true : !f.archivedAt),
    );

    // Build hierarchy with counts
    return list.map((f) => this.enrichFolderWithCounts(workspaceId, f));
  }

  getFolderTree(workspaceId: string, includeArchived = false): AssetFolderItem[] {
    const all = this.findAll(workspaceId, includeArchived);
    const rootFolders = all.filter((f) => !f.parentFolderId);

    const buildTree = (parent: AssetFolderItem): AssetFolderItem => {
      const children = all.filter((f) => f.parentFolderId === parent.id);
      return {
        ...parent,
        subfolders: children.map(buildTree),
      };
    };

    return rootFolders.map(buildTree);
  }

  findOne(workspaceId: string, id: string): AssetFolderItem {
    const folder = this.folders.find((f) => f.id === id);
    if (!folder) {
      throw new NotFoundException(`Folder #${id} not found.`);
    }
    if (folder.workspaceId !== workspaceId) {
      throw new ForbiddenException(`Access denied to folder #${id} from workspace #${workspaceId}.`);
    }

    const enriched = this.enrichFolderWithCounts(workspaceId, folder);
    enriched.breadcrumbs = this.getBreadcrumbs(workspaceId, id);
    return enriched;
  }

  getBreadcrumbs(workspaceId: string, folderId: string | null): FolderBreadcrumbItem[] {
    if (!folderId) return [];

    const breadcrumbs: FolderBreadcrumbItem[] = [];
    let currentId: string | null = folderId;
    const visited = new Set<string>();

    while (currentId && !visited.has(currentId)) {
      visited.add(currentId);
      const folder = this.folders.find((f) => f.id === currentId && f.workspaceId === workspaceId);
      if (!folder) break;
      breadcrumbs.unshift({
        id: folder.id,
        name: folder.name,
        parentFolderId: folder.parentFolderId,
      });
      currentId = folder.parentFolderId || null;
    }

    return breadcrumbs;
  }

  // ==========================================
  // FOLDER CRUD
  // ==========================================
  create(workspaceId: string, dto: CreateFolderDto): AssetFolderItem {
    const name = dto.name?.trim();
    if (!name) {
      throw new BadRequestException('Folder name cannot be empty.');
    }

    if (dto.parentFolderId) {
      const parent = this.folders.find((f) => f.id === dto.parentFolderId);
      if (!parent) {
        throw new NotFoundException(`Parent folder #${dto.parentFolderId} not found.`);
      }
      if (parent.workspaceId !== workspaceId) {
        throw new ForbiddenException('Parent folder belongs to a different workspace.');
      }
    }

    // Uniqueness check within parent
    const existingSameName = this.folders.find(
      (f) =>
        f.workspaceId === workspaceId &&
        (f.parentFolderId || null) === (dto.parentFolderId || null) &&
        f.name.toLowerCase() === name.toLowerCase() &&
        !f.archivedAt,
    );
    if (existingSameName) {
      throw new BadRequestException(`A folder named "${name}" already exists in this destination.`);
    }

    const id = `fld-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const folder: AssetFolderItem = {
      id,
      workspaceId,
      name,
      description: dto.description?.trim() || undefined,
      parentFolderId: dto.parentFolderId || null,
      color: dto.color || '#0d9488',
      icon: dto.icon || 'Folder',
      createdBy: dto.createdBy || 'system',
      createdByName: dto.createdByName || 'System',
      createdAt: now,
      updatedAt: now,
      archivedAt: null,
      subfolderCount: 0,
      directAssetCount: 0,
      totalAssetCount: 0,
    };

    this.folders.push(folder);

    // Audit Event
    this.notificationsService?.emitEvent({
      workspaceId,
      actorId: folder.createdBy,
      actorName: folder.createdByName || 'User',
      entityType: AuditEntityType.FOLDER,
      entityId: folder.id,
      entityTitle: folder.name,
      action: AuditAction.CREATED,
      changeSummary: `Created folder "${folder.name}"`,
      newValues: { name: folder.name, parentFolderId: folder.parentFolderId },
    });

    return folder;
  }

  update(workspaceId: string, id: string, dto: UpdateFolderDto): AssetFolderItem {
    const folder = this.findOne(workspaceId, id);

    if (dto.name !== undefined) {
      const newName = dto.name.trim();
      if (!newName) {
        throw new BadRequestException('Folder name cannot be empty.');
      }

      if (newName.toLowerCase() !== folder.name.toLowerCase()) {
        const existing = this.folders.find(
          (f) =>
            f.id !== id &&
            f.workspaceId === workspaceId &&
            (f.parentFolderId || null) === (folder.parentFolderId || null) &&
            f.name.toLowerCase() === newName.toLowerCase() &&
            !f.archivedAt,
        );
        if (existing) {
          throw new BadRequestException(`A folder named "${newName}" already exists in this destination.`);
        }
        folder.name = newName;
      }
    }

    if (dto.description !== undefined) {
      folder.description = dto.description.trim() || undefined;
    }
    if (dto.color !== undefined) {
      folder.color = dto.color;
    }
    if (dto.icon !== undefined) {
      folder.icon = dto.icon;
    }

    folder.updatedAt = new Date().toISOString();

    // Audit Event
    this.notificationsService?.emitEvent({
      workspaceId,
      actorId: 'user',
      actorName: 'User',
      entityType: AuditEntityType.FOLDER,
      entityId: folder.id,
      entityTitle: folder.name,
      action: AuditAction.UPDATED,
      changeSummary: `Updated folder metadata for "${folder.name}"`,
      newValues: { name: folder.name, description: folder.description, color: folder.color },
    });

    return this.enrichFolderWithCounts(workspaceId, folder);
  }

  // ==========================================
  // SAFE FOLDER MOVEMENT (Section 1 & 3)
  // ==========================================
  move(workspaceId: string, id: string, dto: MoveFolderDto): AssetFolderItem {
    const folder = this.findOne(workspaceId, id);
    const targetParentId = dto.targetParentFolderId || null;

    // 1. Prevent moving inside itself
    if (targetParentId === id) {
      throw new BadRequestException('Cannot move a folder into itself.');
    }

    // 2. Prevent moving into any of its descendants (circular movement check)
    if (targetParentId) {
      const targetParent = this.findOne(workspaceId, targetParentId);
      if (this.isDescendantOf(workspaceId, targetParentId, id)) {
        throw new BadRequestException('Cannot move a folder into one of its subfolders.');
      }

      // 3. Name uniqueness under target parent
      const duplicate = this.folders.find(
        (f) =>
          f.id !== id &&
          f.workspaceId === workspaceId &&
          (f.parentFolderId || null) === targetParentId &&
          f.name.toLowerCase() === folder.name.toLowerCase() &&
          !f.archivedAt,
      );
      if (duplicate) {
        throw new BadRequestException(`A folder named "${folder.name}" already exists in the destination folder.`);
      }
    } else {
      // Moving to root
      const duplicate = this.folders.find(
        (f) =>
          f.id !== id &&
          f.workspaceId === workspaceId &&
          f.parentFolderId === null &&
          f.name.toLowerCase() === folder.name.toLowerCase() &&
          !f.archivedAt,
      );
      if (duplicate) {
        throw new BadRequestException(`A folder named "${folder.name}" already exists at the root level.`);
      }
    }

    const previousParentId = folder.parentFolderId;
    folder.parentFolderId = targetParentId;
    folder.updatedAt = new Date().toISOString();

    // Audit Event
    this.notificationsService?.emitEvent({
      workspaceId,
      actorId: 'user',
      actorName: 'User',
      entityType: AuditEntityType.FOLDER,
      entityId: folder.id,
      entityTitle: folder.name,
      action: AuditAction.MOVED,
      changeSummary: `Moved folder "${folder.name}" from parent #${previousParentId ?? 'root'} to #${targetParentId ?? 'root'}`,
      previousValues: { parentFolderId: previousParentId },
      newValues: { parentFolderId: targetParentId },
    });

    return this.enrichFolderWithCounts(workspaceId, folder);
  }

  // ==========================================
  // SAFE FOLDER DELETION (Section 3)
  // ==========================================
  delete(
    workspaceId: string,
    id: string,
    strategy: DeleteFolderStrategy = 'move_to_parent',
    assetsServiceRef?: { moveContainedAssets: (ws: string, sourceFolderId: string, targetFolderId: string | null) => void },
  ): { success: boolean; deletedFolderId: string; strategyApplied: DeleteFolderStrategy } {
    const folder = this.findOne(workspaceId, id);

    const childFolders = this.folders.filter((f) => f.workspaceId === workspaceId && f.parentFolderId === id);

    if (strategy === 'archive') {
      const now = new Date().toISOString();
      folder.archivedAt = now;
      for (const child of childFolders) {
        child.archivedAt = now;
      }
    } else if (strategy === 'move_to_general') {
      const generalFolder = this.getOrCreateGeneralFolder(workspaceId);
      // Move direct subfolders to general
      for (const child of childFolders) {
        child.parentFolderId = generalFolder.id;
        child.updatedAt = new Date().toISOString();
      }
      // Reassign assets
      assetsServiceRef?.moveContainedAssets(workspaceId, id, generalFolder.id);

      // Remove current folder
      const idx = this.folders.findIndex((f) => f.id === id);
      if (idx !== -1) this.folders.splice(idx, 1);
    } else if (strategy === 'move_to_parent') {
      const newParentId = folder.parentFolderId || null;
      for (const child of childFolders) {
        child.parentFolderId = newParentId;
        child.updatedAt = new Date().toISOString();
      }
      assetsServiceRef?.moveContainedAssets(workspaceId, id, newParentId);

      const idx = this.folders.findIndex((f) => f.id === id);
      if (idx !== -1) this.folders.splice(idx, 1);
    } else if (strategy === 'cascade') {
      // Unlink assets (set folderId null so binaries are preserved!)
      assetsServiceRef?.moveContainedAssets(workspaceId, id, null);

      // Delete folder and all recursive subfolders
      const descendantIds = this.getDescendantFolderIds(workspaceId, id);
      this.folders = this.folders.filter((f) => f.id !== id && !descendantIds.includes(f.id));
    }

    // Audit Event
    this.notificationsService?.emitEvent({
      workspaceId,
      actorId: 'user',
      actorName: 'User',
      entityType: AuditEntityType.FOLDER,
      entityId: id,
      entityTitle: folder.name,
      action: AuditAction.DELETED,
      changeSummary: `Deleted folder "${folder.name}" with strategy "${strategy}"`,
    });

    return {
      success: true,
      deletedFolderId: id,
      strategyApplied: strategy,
    };
  }

  // ==========================================
  // FOLDER SUGGESTIONS (Section 7)
  // ==========================================
  getFolderSuggestion(workspaceId: string, source?: string, mimeType?: string): FolderSuggestion {
    const src = (source || '').toLowerCase();
    const mime = (mimeType || '').toLowerCase();

    // 1. By Source
    if (src.includes('campaign')) {
      const f = this.folders.find(
        (f) => f.workspaceId === workspaceId && f.name === 'Campaign Documents',
      ) || this.folders.find((f) => f.workspaceId === workspaceId && f.name === 'Campaigns');
      if (f) return { folderId: f.id, folderName: f.name, reason: 'Uploaded from Campaign workflow' };
    }

    if (src.includes('meeting')) {
      const f = this.folders.find(
        (f) => f.workspaceId === workspaceId && f.name === 'Meeting Documents',
      ) || this.folders.find((f) => f.workspaceId === workspaceId && f.name === 'Meetings');
      if (f) return { folderId: f.id, folderName: f.name, reason: 'Uploaded from Meeting workflow' };
    }

    if (src.includes('call') || src.includes('recording')) {
      const f = this.folders.find(
        (f) => f.workspaceId === workspaceId && f.name === 'Call Recordings',
      ) || this.folders.find((f) => f.workspaceId === workspaceId && f.name === 'Calls & Recordings');
      if (f) return { folderId: f.id, folderName: f.name, reason: 'Uploaded from Call Recording workflow' };
    }

    if (src.includes('plan') || src.includes('goal')) {
      const f = this.folders.find(
        (f) => f.workspaceId === workspaceId && f.name === 'Project Plans',
      ) || this.folders.find((f) => f.workspaceId === workspaceId && f.name === 'Plans & Goals');
      if (f) return { folderId: f.id, folderName: f.name, reason: 'Uploaded from Planning workflow' };
    }

    // 2. By MIME type
    if (mime.startsWith('image/')) {
      const f = this.folders.find((f) => f.workspaceId === workspaceId && f.name === 'Images');
      if (f) return { folderId: f.id, folderName: f.name, reason: 'Image file detected' };
    }
    if (mime.startsWith('video/')) {
      const f = this.folders.find((f) => f.workspaceId === workspaceId && f.name === 'Videos');
      if (f) return { folderId: f.id, folderName: f.name, reason: 'Video file detected' };
    }
    if (mime.startsWith('audio/')) {
      const f = this.folders.find((f) => f.workspaceId === workspaceId && f.name === 'Audio');
      if (f) return { folderId: f.id, folderName: f.name, reason: 'Audio file detected' };
    }
    if (mime === 'application/pdf') {
      const f = this.folders.find((f) => f.workspaceId === workspaceId && f.name === 'Documents & PDFs');
      if (f) return { folderId: f.id, folderName: f.name, reason: 'PDF document detected' };
    }

    // Default: General / Unsorted
    const general = this.getOrCreateGeneralFolder(workspaceId);
    return { folderId: general.id, folderName: general.name, reason: 'Default unsorted folder' };
  }

  // ==========================================
  // HELPER METHODS
  // ==========================================
  getDescendantFolderIds(workspaceId: string, folderId: string): string[] {
    const descendants: string[] = [];
    const queue = [folderId];

    while (queue.length > 0) {
      const current = queue.shift()!;
      const children = this.folders.filter(
        (f) => f.workspaceId === workspaceId && f.parentFolderId === current,
      );
      for (const child of children) {
        descendants.push(child.id);
        queue.push(child.id);
      }
    }

    return descendants;
  }

  private isDescendantOf(workspaceId: string, targetId: string, candidateAncestorId: string): boolean {
    const descendants = this.getDescendantFolderIds(workspaceId, candidateAncestorId);
    return descendants.includes(targetId);
  }

  private getOrCreateGeneralFolder(workspaceId: string): AssetFolderItem {
    let general = this.folders.find(
      (f) => f.workspaceId === workspaceId && f.name.toLowerCase() === 'unsorted',
    ) || this.folders.find(
      (f) => f.workspaceId === workspaceId && f.name.toLowerCase() === 'general',
    );

    if (!general) {
      general = {
        id: `fld-${workspaceId.substring(3, 7)}-general`,
        workspaceId,
        name: 'General',
        description: 'General unsorted files',
        parentFolderId: null,
        color: '#64748b',
        icon: 'Folder',
        createdBy: 'system',
        createdByName: 'System',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        archivedAt: null,
      };
      this.folders.push(general);
    }

    return general;
  }

  private enrichFolderWithCounts(workspaceId: string, folder: AssetFolderItem): AssetFolderItem {
    const subfolderCount = this.folders.filter(
      (f) => f.workspaceId === workspaceId && f.parentFolderId === folder.id && !f.archivedAt,
    ).length;

    return {
      ...folder,
      subfolderCount,
    };
  }
}

