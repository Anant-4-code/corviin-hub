import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Optional,
} from '@nestjs/common';
import {
  AssetItem,
  AssetVersion,
  AssetRelationship,
  AssetCategory,
  AssetTypeGroup,
  AssetFilterDto,
  PaginatedAssetsResponseDto,
  UploadIntentDto,
  UploadIntentResponseDto,
  ConfirmUploadDto,
  DirectUploadDto,
  CreateAssetVersionDto,
  AddAssetRelationshipDto,
  UpdateAssetMetadataDto,
  MoveAssetDto,
  BulkMoveAssetsDto,
  AssetStorageSummary,
  AuditEntityType,
  AuditAction,
} from '@corviin-hub/shared';
import { FoldersService } from '../folders/folders.service';
import { NotificationsService } from '../notifications/notifications.service';
import { StorageService } from '../storage/storage.service';

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500 MB
const DISALLOWED_EXTENSIONS = [
  '.exe',
  '.bat',
  '.cmd',
  '.sh',
  '.php',
  '.dll',
  '.com',
  '.vbs',
  '.msi',
  '.scr',
  '.jar',
];

interface PendingUploadIntent {
  intentId: string;
  workspaceId: string;
  storageKey: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  category: AssetCategory;
  title: string;
  description?: string;
  tags: string[];
  relatedType?: any;
  relatedId?: string;
  relatedTitle?: string;
  stage?: string;
  expiresAt: number;
}

@Injectable()
export class AssetsService {
  private assets: AssetItem[] = [];
  private pendingIntents: Map<string, PendingUploadIntent> = new Map();

  constructor(
    @Optional() private readonly foldersService?: FoldersService,
    @Optional() private readonly notificationsService?: NotificationsService,
    @Optional() private readonly storageService?: StorageService,
  ) {
    // Clean initial state (no dummy assets)
  }

  // ==========================================
  // INITIAL SEED DATA
  // ==========================================
  private seedInitialAssets() {
    // No-op for production clean slate
  }
    const techWs = 'ws-tech-0001-0000-000000000001';
    const realWs = 'ws-real-0002-0000-000000000002';

    // 1. Tech Workspace Assets
    this.assets.push(
      {
        id: 'ast-raw-01',
        workspaceId: techWs,
        folderId: 'fld-tch-campaigns-videos---raw-footage',
        title: 'Q4 Product Showcase Raw 4K Footage',
        originalFileName: 'raw_footage_4k.mp4',
        storageKey: `workspaces/${techWs}/assets/2026/11/ast-raw-01-raw_footage_4k.mp4`,
        storageProvider: 's3',
        mimeType: 'video/mp4',
        sizeBytes: 142500000, // ~135 MB
        category: AssetCategory.RAW_FOOTAGE,
        typeGroup: AssetTypeGroup.VIDEO,
        uploaderId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        uploaderName: 'Anant',
        currentVersionNumber: 1,
        versions: [
          {
            id: 'ver-raw-1',
            assetId: 'ast-raw-01',
            versionNumber: 1,
            fileName: 'raw_footage_4k.mp4',
            storageKey: `workspaces/${techWs}/assets/2026/11/ast-raw-01-raw_footage_4k.mp4`,
            sizeBytes: 142500000,
            mimeType: 'video/mp4',
            uploaderId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            uploaderName: 'Anant',
            changeNote: 'Initial 4K A-roll camera take 1',
            createdAt: '2026-11-04T10:00:00.000Z',
            downloadUrl: `https://storage.corviin.internal/download/${techWs}/raw_footage_4k.mp4?exp=3600`,
          },
        ],
        relationships: [
          {
            id: 'rel-101',
            assetId: 'ast-raw-01',
            relatedType: 'campaign',
            relatedId: 'cmp-tech-001',
            relatedTitle: 'Q4 Product Launch & Demo Blitz',
            stage: 'RECORDING_UPLOAD',
            createdAt: '2026-11-04T10:05:00.000Z',
          },
        ],
        tags: ['video', '4k', 'a-roll', 'q4-launch'],
        description: '4K raw footage captured on Sony FX3 for Q4 marketing blitz.',
        previewUrl: 'https://storage.corviin.internal/preview/raw_footage_4k.mp4',
        downloadUrl: `https://storage.corviin.internal/download/${techWs}/raw_footage_4k.mp4?exp=3600`,
        createdAt: '2026-11-04T10:00:00.000Z',
        updatedAt: '2026-11-04T10:00:00.000Z',
      },
      {
        id: 'ast-scr-01',
        workspaceId: techWs,
        folderId: 'fld-tch-campaigns-campaign-documents',
        title: 'Launch Script Master Copy',
        originalFileName: 'launch_script.md',
        storageKey: `workspaces/${techWs}/assets/2026/11/ast-scr-01-launch_script.md`,
        storageProvider: 's3',
        mimeType: 'text/markdown',
        sizeBytes: 46200,
        category: AssetCategory.SCRIPTS,
        typeGroup: AssetTypeGroup.DOCUMENT,
        uploaderId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
        uploaderName: 'Rohit',
        currentVersionNumber: 2,
        versions: [
          {
            id: 'ver-scr-1',
            assetId: 'ast-scr-01',
            versionNumber: 1,
            fileName: 'launch_script_draft.md',
            storageKey: `workspaces/${techWs}/assets/2026/11/ast-scr-01-launch_script_draft.md`,
            sizeBytes: 42000,
            mimeType: 'text/markdown',
            uploaderId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
            uploaderName: 'Rohit',
            changeNote: 'First rough script concept',
            createdAt: '2026-11-02T09:00:00.000Z',
            downloadUrl: `https://storage.corviin.internal/download/${techWs}/launch_script_draft.md?exp=3600`,
          },
          {
            id: 'ver-scr-2',
            assetId: 'ast-scr-01',
            versionNumber: 2,
            fileName: 'launch_script.md',
            storageKey: `workspaces/${techWs}/assets/2026/11/ast-scr-01-launch_script.md`,
            sizeBytes: 46200,
            mimeType: 'text/markdown',
            uploaderId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
            uploaderName: 'Rohit',
            changeNote: 'Final approved script copy with timing notes',
            createdAt: '2026-11-03T14:30:00.000Z',
            downloadUrl: `https://storage.corviin.internal/download/${techWs}/launch_script.md?exp=3600`,
          },
        ],
        relationships: [
          {
            id: 'rel-102',
            assetId: 'ast-scr-01',
            relatedType: 'campaign',
            relatedId: 'cmp-tech-001',
            relatedTitle: 'Q4 Product Launch & Demo Blitz',
            stage: 'SCRIPTING_PLANNING',
            createdAt: '2026-11-03T15:00:00.000Z',
          },
        ],
        tags: ['script', 'copywriting', 'approved'],
        description: 'Complete video narration script and voiceover breakdown.',
        previewUrl: 'https://storage.corviin.internal/preview/launch_script.md',
        downloadUrl: `https://storage.corviin.internal/download/${techWs}/launch_script.md?exp=3600`,
        createdAt: '2026-11-02T09:00:00.000Z',
        updatedAt: '2026-11-03T14:30:00.000Z',
      },
      {
        id: 'ast-tech-brand',
        workspaceId: techWs,
        folderId: 'fld-tch-plans---goals-research',
        title: 'Corviin Design & Brand Guidelines v2',
        originalFileName: 'Corviin_Brand_Guidelines_v2.pdf',
        storageKey: `workspaces/${techWs}/assets/2026/10/ast-tech-brand.pdf`,
        storageProvider: 's3',
        mimeType: 'application/pdf',
        sizeBytes: 8400000, // 8.4 MB
        category: AssetCategory.REFERENCES,
        typeGroup: AssetTypeGroup.DOCUMENT,
        uploaderId: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
        uploaderName: 'Utkarsh',
        currentVersionNumber: 1,
        versions: [
          {
            id: 'ver-brand-1',
            assetId: 'ast-tech-brand',
            versionNumber: 1,
            fileName: 'Corviin_Brand_Guidelines_v2.pdf',
            storageKey: `workspaces/${techWs}/assets/2026/10/ast-tech-brand.pdf`,
            sizeBytes: 8400000,
            mimeType: 'application/pdf',
            uploaderId: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
            uploaderName: 'Utkarsh',
            changeNote: 'Official brand guidelines v2',
            createdAt: '2026-10-15T11:00:00.000Z',
            downloadUrl: `https://storage.corviin.internal/download/${techWs}/Corviin_Brand_Guidelines_v2.pdf?exp=3600`,
          },
        ],
        relationships: [],
        tags: ['branding', 'design', 'guidelines', 'colors'],
        description: 'Official corporate typography, color palette, logo assets and rules.',
        downloadUrl: `https://storage.corviin.internal/download/${techWs}/Corviin_Brand_Guidelines_v2.pdf?exp=3600`,
        createdAt: '2026-10-15T11:00:00.000Z',
        updatedAt: '2026-10-15T11:00:00.000Z',
      },
      {
        id: 'ast-tech-hero',
        workspaceId: techWs,
        folderId: 'fld-tch-media---creative-images',
        title: 'Platform Architecture High-Res Diagram',
        originalFileName: 'Platform_Architecture_Diagram.png',
        storageKey: `workspaces/${techWs}/assets/2026/11/ast-tech-hero.png`,
        storageProvider: 's3',
        mimeType: 'image/png',
        sizeBytes: 2350000,
        category: AssetCategory.IMAGES,
        typeGroup: AssetTypeGroup.IMAGE,
        uploaderId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        uploaderName: 'Anant',
        currentVersionNumber: 1,
        versions: [
          {
            id: 'ver-hero-1',
            assetId: 'ast-tech-hero',
            versionNumber: 1,
            fileName: 'Platform_Architecture_Diagram.png',
            storageKey: `workspaces/${techWs}/assets/2026/11/ast-tech-hero.png`,
            sizeBytes: 2350000,
            mimeType: 'image/png',
            uploaderId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            uploaderName: 'Anant',
            changeNote: 'Vector export from Figma',
            createdAt: '2026-11-01T16:20:00.000Z',
            downloadUrl: `https://storage.corviin.internal/download/${techWs}/Platform_Architecture_Diagram.png?exp=3600`,
          },
        ],
        relationships: [],
        tags: ['diagram', 'tech', 'architecture'],
        description: 'Full stack architecture diagram for client presentations.',
        previewUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
        downloadUrl: `https://storage.corviin.internal/download/${techWs}/Platform_Architecture_Diagram.png?exp=3600`,
        createdAt: '2026-11-01T16:20:00.000Z',
        updatedAt: '2026-11-01T16:20:00.000Z',
      },
      {
        id: 'ast-tech-contract',
        workspaceId: techWs,
        folderId: 'fld-tch-documents---pdfs-contracts',
        title: 'Enterprise Customer SLA Agreement Template',
        originalFileName: 'Enterprise_Client_SLA_Template.pdf',
        storageKey: `workspaces/${techWs}/assets/2026/10/ast-tech-contract.pdf`,
        storageProvider: 's3',
        mimeType: 'application/pdf',
        sizeBytes: 1250000,
        category: AssetCategory.CONTRACTS_DOCS,
        typeGroup: AssetTypeGroup.DOCUMENT,
        uploaderId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
        uploaderName: 'Rohit',
        currentVersionNumber: 1,
        versions: [
          {
            id: 'ver-contract-1',
            assetId: 'ast-tech-contract',
            versionNumber: 1,
            fileName: 'Enterprise_Client_SLA_Template.pdf',
            storageKey: `workspaces/${techWs}/assets/2026/10/ast-tech-contract.pdf`,
            sizeBytes: 1250000,
            mimeType: 'application/pdf',
            uploaderId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
            uploaderName: 'Rohit',
            changeNote: 'Legal approved enterprise SLA standard template',
            createdAt: '2026-10-20T10:00:00.000Z',
            downloadUrl: `https://storage.corviin.internal/download/${techWs}/Enterprise_Client_SLA_Template.pdf?exp=3600`,
          },
        ],
        relationships: [],
        tags: ['legal', 'sla', 'contract'],
        description: 'Standard enterprise SLA agreement vetted by legal counsel.',
        downloadUrl: `https://storage.corviin.internal/download/${techWs}/Enterprise_Client_SLA_Template.pdf?exp=3600`,
        createdAt: '2026-10-20T10:00:00.000Z',
        updatedAt: '2026-10-20T10:00:00.000Z',
      },
    );

    // 2. Real Estate Workspace Assets
    this.assets.push(
      {
        id: 'ast-re-drone',
        workspaceId: realWs,
        folderId: 'fld-rel-campaigns-videos---raw-footage',
        title: 'Emerald Heights Villa Drone Aerial Reel',
        originalFileName: 'villa_drone_aerial_4k.mp4',
        storageKey: `workspaces/${realWs}/assets/2026/11/ast-re-drone.mp4`,
        storageProvider: 's3',
        mimeType: 'video/mp4',
        sizeBytes: 215000000,
        category: AssetCategory.RAW_FOOTAGE,
        typeGroup: AssetTypeGroup.VIDEO,
        uploaderId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        uploaderName: 'Anant',
        currentVersionNumber: 1,
        versions: [
          {
            id: 'ver-re-drone-1',
            assetId: 'ast-re-drone',
            versionNumber: 1,
            fileName: 'villa_drone_aerial_4k.mp4',
            storageKey: `workspaces/${realWs}/assets/2026/11/ast-re-drone.mp4`,
            sizeBytes: 215000000,
            mimeType: 'video/mp4',
            uploaderId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            uploaderName: 'Anant',
            changeNote: 'DJI Mavic 3 4K aerial flyover',
            createdAt: '2026-11-04T12:00:00.000Z',
            downloadUrl: `https://storage.corviin.internal/download/${realWs}/villa_drone_aerial_4k.mp4?exp=3600`,
          },
        ],
        relationships: [
          {
            id: 'rel-re-01',
            assetId: 'ast-re-drone',
            relatedType: 'campaign',
            relatedId: 'cmp-re-001',
            relatedTitle: 'Emerald Heights Luxury Launch Video',
            stage: 'RECORDING_UPLOAD',
            createdAt: '2026-11-04T12:30:00.000Z',
          },
        ],
        tags: ['drone', 'aerial', 'luxury-villa', 'emerald-heights'],
        description: 'Breathtaking 4K drone cinematography covering villa elevation and clubhouse.',
        previewUrl: 'https://storage.corviin.internal/preview/villa_drone_aerial_4k.mp4',
        downloadUrl: `https://storage.corviin.internal/download/${realWs}/villa_drone_aerial_4k.mp4?exp=3600`,
        createdAt: '2026-11-04T12:00:00.000Z',
        updatedAt: '2026-11-04T12:00:00.000Z',
      },
      {
        id: 'ast-re-brochure',
        workspaceId: realWs,
        folderId: 'fld-rel-documents---pdfs',
        title: 'Emerald Heights Luxury Portfolio Brochure',
        originalFileName: 'Emerald_Heights_Luxury_Brochure.pdf',
        storageKey: `workspaces/${realWs}/assets/2026/10/ast-re-brochure.pdf`,
        storageProvider: 's3',
        mimeType: 'application/pdf',
        sizeBytes: 15400000,
        category: AssetCategory.IMAGES,
        typeGroup: AssetTypeGroup.DOCUMENT,
        uploaderId: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
        uploaderName: 'Utkarsh',
        currentVersionNumber: 1,
        versions: [
          {
            id: 'ver-re-brochure-1',
            assetId: 'ast-re-brochure',
            versionNumber: 1,
            fileName: 'Emerald_Heights_Luxury_Brochure.pdf',
            storageKey: `workspaces/${realWs}/assets/2026/10/ast-re-brochure.pdf`,
            sizeBytes: 15400000,
            mimeType: 'application/pdf',
            uploaderId: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
            uploaderName: 'Utkarsh',
            changeNote: 'Print-ready high-resolution brochure',
            createdAt: '2026-10-25T14:00:00.000Z',
            downloadUrl: `https://storage.corviin.internal/download/${realWs}/Emerald_Heights_Luxury_Brochure.pdf?exp=3600`,
          },
        ],
        relationships: [],
        tags: ['brochure', 'emerald-heights', 'print'],
        description: 'High-gloss sales brochure containing floorplans, amenities, and developer credentials.',
        downloadUrl: `https://storage.corviin.internal/download/${realWs}/Emerald_Heights_Luxury_Brochure.pdf?exp=3600`,
        createdAt: '2026-10-25T14:00:00.000Z',
        updatedAt: '2026-10-25T14:00:00.000Z',
      },
    );
  }

  // ==========================================
  // FILE POLICY & VALIDATION (Section 12)
  // ==========================================
  public validateFilePolicy(fileName: string, mimeType: string, sizeBytes: number): AssetTypeGroup {
    if (!fileName || fileName.trim().length === 0) {
      throw new BadRequestException('Filename is required');
    }

    const dotIndex = fileName.lastIndexOf('.');
    const ext = dotIndex !== -1 ? fileName.substring(dotIndex).toLowerCase() : '';

    if (DISALLOWED_EXTENSIONS.includes(ext)) {
      throw new BadRequestException(
        `File extension ${ext} is blocked for security reasons. Executable files are not allowed.`,
      );
    }

    if (sizeBytes <= 0) {
      throw new BadRequestException('File size must be greater than zero bytes.');
    }

    if (sizeBytes > MAX_FILE_SIZE) {
      throw new BadRequestException(
        `File size (${Math.round(sizeBytes / 1024 / 1024)}MB) exceeds maximum permitted limit of 500MB.`,
      );
    }

    return this.detectTypeGroup(mimeType, ext);
  }

  public detectTypeGroup(mimeType: string, ext?: string): AssetTypeGroup {
    const mime = (mimeType || '').toLowerCase();
    const extension = (ext || '').toLowerCase();

    if (mime.startsWith('image/') || ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'].includes(extension)) {
      return AssetTypeGroup.IMAGE;
    }
    if (mime.startsWith('video/') || ['.mp4', '.mov', '.avi', '.mkv', '.webm'].includes(extension)) {
      return AssetTypeGroup.VIDEO;
    }
    if (mime.startsWith('audio/') || ['.mp3', '.wav', '.m4a', '.aac', '.ogg'].includes(extension)) {
      return AssetTypeGroup.AUDIO;
    }
    if (
      mime.includes('pdf') ||
      mime.includes('text') ||
      mime.includes('document') ||
      mime.includes('sheet') ||
      mime.includes('presentation') ||
      ['.pdf', '.doc', '.docx', '.txt', '.md', '.csv', '.xlsx', '.pptx'].includes(extension)
    ) {
      return AssetTypeGroup.DOCUMENT;
    }
    return AssetTypeGroup.OTHER;
  }

  private sanitizeFilename(fileName: string): string {
    return fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  }

  // ==========================================
  // UPLOAD INTENT & CONFIRMATION (Section 5)
  // ==========================================
  getUploadIntent(workspaceId: string, dto: UploadIntentDto): UploadIntentResponseDto {
    if (!workspaceId) {
      throw new BadRequestException('Workspace ID is required.');
    }

    this.validateFilePolicy(dto.fileName, dto.mimeType, dto.sizeBytes);

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const intentId = `upl-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
    const sanitizedName = this.sanitizeFilename(dto.fileName);
    const storageKey = `workspaces/${workspaceId}/assets/${year}/${month}/${intentId}-${sanitizedName}`;

    // 15-minute token expiry
    const expiresAtMs = Date.now() + 15 * 60 * 1000;
    const expiresAt = new Date(expiresAtMs).toISOString();
    const token = Buffer.from(`${intentId}:${storageKey}:${expiresAtMs}`).toString('base64');
    const uploadUrl = `https://storage.corviin.internal/upload/${storageKey}?token=${token}`;

    this.pendingIntents.set(intentId, {
      intentId,
      workspaceId,
      storageKey,
      fileName: dto.fileName,
      mimeType: dto.mimeType,
      sizeBytes: dto.sizeBytes,
      category: dto.category || AssetCategory.OTHER,
      title: dto.title || dto.fileName,
      description: dto.description,
      tags: dto.tags || [],
      relatedType: dto.relatedType,
      relatedId: dto.relatedId,
      relatedTitle: dto.relatedTitle,
      stage: dto.stage,
      expiresAt: expiresAtMs,
    });

    return {
      uploadIntentId: intentId,
      storageKey,
      uploadUrl,
      expiresAt,
      token,
    };
  }

  confirmUpload(workspaceId: string, dto: ConfirmUploadDto): AssetItem {
    if (!workspaceId) {
      throw new BadRequestException('Workspace ID is required.');
    }

    const typeGroup = this.validateFilePolicy(dto.fileName, dto.mimeType, dto.sizeBytes);
    const now = new Date().toISOString();
    const assetId = `ast-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

    const storageKey =
      dto.storageKey ||
      `workspaces/${workspaceId}/assets/${now.substring(0, 4)}/${now.substring(5, 7)}/${assetId}-${this.sanitizeFilename(dto.fileName)}`;

    const initialVersion: AssetVersion = {
      id: `ver-${assetId}-1`,
      assetId,
      versionNumber: 1,
      fileName: dto.fileName,
      storageKey,
      sizeBytes: dto.sizeBytes,
      mimeType: dto.mimeType,
      uploaderId: dto.uploaderId || 'acting-profile-id',
      uploaderName: dto.uploaderName || 'Acting Profile',
      changeNote: 'Initial upload',
      createdAt: now,
      downloadUrl: `https://storage.corviin.internal/download/${storageKey}?exp=3600`,
    };

    const relationships: AssetRelationship[] = [];
    if (dto.relatedId && dto.relatedType) {
      relationships.push({
        id: `rel-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
        assetId,
        relatedType: dto.relatedType,
        relatedId: dto.relatedId,
        relatedTitle: dto.relatedTitle || `${dto.relatedType} #${dto.relatedId}`,
        stage: dto.stage,
        createdAt: now,
      });
    }

    let folderId = dto.folderId || null;
    if (!folderId && this.foldersService) {
      folderId = this.foldersService.getFolderSuggestion(workspaceId, dto.relatedType, dto.mimeType).folderId;
    }

    const previewUrl = typeGroup === AssetTypeGroup.IMAGE
      ? (dto.fileName.includes('Diagram')
        ? 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80')
      : undefined;

    const newAsset: AssetItem = {
      id: assetId,
      workspaceId,
      folderId,
      title: (dto.title && dto.title.trim()) || dto.fileName,
      originalFileName: dto.fileName,
      storageKey,
      storageProvider: 's3',
      mimeType: dto.mimeType,
      sizeBytes: dto.sizeBytes,
      category: dto.category || AssetCategory.OTHER,
      typeGroup,
      uploaderId: dto.uploaderId || 'acting-profile-id',
      uploaderName: dto.uploaderName || 'Acting Profile',
      currentVersionNumber: 1,
      versions: [initialVersion],
      relationships,
      tags: dto.tags || [],
      description: dto.description || '',
      previewUrl,
      downloadUrl: `https://storage.corviin.internal/download/${storageKey}?exp=3600`,
      createdAt: now,
      updatedAt: now,
    };

    this.assets.unshift(newAsset);

    // Clean up intent if present
    if (dto.uploadIntentId) {
      this.pendingIntents.delete(dto.uploadIntentId);
    }

    return newAsset;
  }

  directUpload(workspaceId: string, dto: DirectUploadDto): AssetItem {
    return this.confirmUpload(workspaceId, {
      uploadIntentId: '',
      storageKey: '',
      fileName: dto.fileName,
      mimeType: dto.mimeType,
      sizeBytes: dto.sizeBytes,
      category: dto.category,
      folderId: dto.folderId,
      title: dto.title,
      description: dto.description,
      tags: dto.tags,
      relatedType: dto.relatedType,
      relatedId: dto.relatedId,
      relatedTitle: dto.relatedTitle,
      stage: dto.stage,
      uploaderId: dto.uploaderId,
      uploaderName: dto.uploaderName,
    });
  }

  // ==========================================
  // LISTING, SEARCH & FILTERS (Section 7 & 9)
  // ==========================================
  findAll(workspaceId: string, filterDto?: AssetFilterDto): PaginatedAssetsResponseDto {
    if (!workspaceId) {
      throw new BadRequestException('Workspace ID is required.');
    }

    let items = this.assets.filter((a) => a.workspaceId === workspaceId && !a.archivedAt);

    // Compute summary before filtering (or overall workspace summary)
    const summary = this.computeSummary(items);

    if (filterDto) {
      // 1. Search (Filename, Title, Description, Tags, Linked records, Folder Name)
      if (filterDto.search && filterDto.search.trim()) {
        const q = filterDto.search.trim().toLowerCase();
        items = items.filter(
          (a) =>
            a.title.toLowerCase().includes(q) ||
            a.originalFileName.toLowerCase().includes(q) ||
            (a.description && a.description.toLowerCase().includes(q)) ||
            a.tags.some((t) => t.toLowerCase().includes(q)) ||
            a.relationships.some((r) => r.relatedTitle.toLowerCase().includes(q)),
        );
      }

      // 2. Folder Scoping
      if (filterDto.folderId) {
        if (filterDto.folderId === 'root') {
          items = items.filter((a) => !a.folderId);
        } else if (filterDto.folderId !== 'all') {
          if (filterDto.includeSubfolders && this.foldersService) {
            const allowed = [
              filterDto.folderId,
              ...this.foldersService.getDescendantFolderIds(workspaceId, filterDto.folderId),
            ];
            items = items.filter((a) => a.folderId && allowed.includes(a.folderId));
          } else {
            items = items.filter((a) => a.folderId === filterDto.folderId);
          }
        }
      }

      // 3. Category Filter
      if (filterDto.category) {
        items = items.filter((a) => a.category === filterDto.category);
      }

      // 4. Type Group Filter
      if (filterDto.typeGroup) {
        items = items.filter((a) => a.typeGroup === filterDto.typeGroup);
      }

      // 5. Cross-Module Relationships Filter
      if (filterDto.campaignId) {
        items = items.filter((a) =>
          a.relationships.some(
            (r) => r.relatedType === 'campaign' && r.relatedId === filterDto.campaignId,
          ),
        );
      }
      if (filterDto.meetingId) {
        items = items.filter((a) =>
          a.relationships.some(
            (r) => r.relatedType === 'meeting' && r.relatedId === filterDto.meetingId,
          ),
        );
      }
      if (filterDto.planId) {
        items = items.filter((a) =>
          a.relationships.some(
            (r) => r.relatedType === 'plan' && r.relatedId === filterDto.planId,
          ),
        );
      }
      if (filterDto.taskId) {
        items = items.filter((a) =>
          a.relationships.some(
            (r) => r.relatedType === 'task' && r.relatedId === filterDto.taskId,
          ),
        );
      }
      if (filterDto.crmRecordId) {
        items = items.filter((a) =>
          a.relationships.some(
            (r) =>
              (r.relatedType === 'crm_lead' ||
                r.relatedType === 'crm_partner' ||
                r.relatedType === 'crm_buyer') &&
              r.relatedId === filterDto.crmRecordId,
          ),
        );
      }

      // 6. View Mode Filter
      if (filterDto.viewModeFilter === 'linked') {
        items = items.filter((a) => a.relationships && a.relationships.length > 0);
      }

      // 7. Uploader Filter
      if (filterDto.uploaderId) {
        items = items.filter((a) => a.uploaderId === filterDto.uploaderId);
      }

      // 8. Tag Filter
      if (filterDto.tag) {
        const t = filterDto.tag.toLowerCase();
        items = items.filter((a) => a.tags.some((tag) => tag.toLowerCase() === t));
      }

      // 9. Sort
      const sortBy = filterDto.sortBy || 'date';
      const sortOrder = filterDto.sortOrder || 'desc';

      items.sort((a, b) => {
        let cmp = 0;
        if (sortBy === 'name') {
          cmp = a.title.localeCompare(b.title);
        } else if (sortBy === 'size') {
          cmp = a.sizeBytes - b.sizeBytes;
        } else {
          // date
          cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        return sortOrder === 'asc' ? cmp : -cmp;
      });
    }

    const allFolders = this.foldersService?.findAll(workspaceId, true) || [];
    const folderMap = new Map(allFolders.map((f) => [f.id, f.name]));

    const total = items.length;
    const page = Math.max(1, Number(filterDto?.page) || 1);
    const pageSize = Math.max(1, Math.min(100, Number(filterDto?.pageSize) || 20));
    const totalPages = Math.ceil(total / pageSize) || 1;
    const startIndex = (page - 1) * pageSize;
    const paginatedItems = items.slice(startIndex, startIndex + pageSize).map((a) => ({
      ...a,
      folderName: a.folderId ? folderMap.get(a.folderId) : undefined,
    }));

    return {
      items: paginatedItems,
      total,
      page,
      pageSize,
      totalPages,
      summary,
    };
  }

  private computeSummary(items: AssetItem[]): AssetStorageSummary {
    let totalSizeBytes = 0;
    const byType = {
      images: 0,
      videos: 0,
      audio: 0,
      documents: 0,
      other: 0,
    };
    const byCategory: Record<string, number> = {};

    for (const a of items) {
      totalSizeBytes += a.sizeBytes;

      if (a.typeGroup === AssetTypeGroup.IMAGE) byType.images++;
      else if (a.typeGroup === AssetTypeGroup.VIDEO) byType.videos++;
      else if (a.typeGroup === AssetTypeGroup.AUDIO) byType.audio++;
      else if (a.typeGroup === AssetTypeGroup.DOCUMENT) byType.documents++;
      else byType.other++;

      byCategory[a.category] = (byCategory[a.category] || 0) + 1;
    }

    return {
      totalCount: items.length,
      totalSizeBytes,
      byType,
      byCategory,
    };
  }

  findOne(workspaceId: string, id: string): AssetItem {
    if (!workspaceId) {
      throw new BadRequestException('Workspace ID is required.');
    }

    const asset = this.assets.find((a) => a.id === id);
    if (!asset) {
      throw new NotFoundException(`Asset #${id} not found.`);
    }

    if (asset.workspaceId !== workspaceId) {
      throw new ForbiddenException(`Asset #${id} belongs to a different workspace.`);
    }

    return asset;
  }

  // ==========================================
  // METADATA UPDATE (Section 4)
  // ==========================================
  updateMetadata(workspaceId: string, id: string, dto: UpdateAssetMetadataDto): AssetItem {
    const asset = this.findOne(workspaceId, id);

    if (dto.title !== undefined) {
      if (!dto.title.trim()) {
        throw new BadRequestException('Asset title cannot be empty.');
      }
      asset.title = dto.title.trim();
    }

    if (dto.category !== undefined) {
      asset.category = dto.category;
    }

    if (dto.description !== undefined) {
      asset.description = dto.description;
    }

    if (dto.tags !== undefined) {
      asset.tags = dto.tags;
    }

    asset.updatedAt = new Date().toISOString();
    return asset;
  }

  // ==========================================
  // VERSIONING (Section 9)
  // ==========================================
  addVersion(workspaceId: string, id: string, dto: CreateAssetVersionDto): AssetVersion {
    const asset = this.findOne(workspaceId, id);
    this.validateFilePolicy(dto.fileName, dto.mimeType, dto.sizeBytes);

    const now = new Date().toISOString();
    const nextVersionNumber = asset.currentVersionNumber + 1;
    const sanitized = this.sanitizeFilename(dto.fileName);
    const storageKey =
      dto.storageKey ||
      `workspaces/${workspaceId}/assets/${now.substring(0, 4)}/${now.substring(5, 7)}/${asset.id}-v${nextVersionNumber}-${sanitized}`;

    const newVersion: AssetVersion = {
      id: `ver-${asset.id}-${nextVersionNumber}`,
      assetId: asset.id,
      versionNumber: nextVersionNumber,
      fileName: dto.fileName,
      storageKey,
      sizeBytes: dto.sizeBytes,
      mimeType: dto.mimeType,
      uploaderId: dto.uploaderId || 'acting-profile-id',
      uploaderName: dto.uploaderName || 'Acting Profile',
      changeNote: dto.changeNote || `Version ${nextVersionNumber}`,
      createdAt: now,
      downloadUrl: `https://storage.corviin.internal/download/${storageKey}?exp=3600`,
    };

    asset.versions.unshift(newVersion);
    asset.currentVersionNumber = nextVersionNumber;
    asset.originalFileName = dto.fileName;
    asset.sizeBytes = dto.sizeBytes;
    asset.mimeType = dto.mimeType;
    asset.typeGroup = this.detectTypeGroup(dto.mimeType);
    asset.storageKey = storageKey;
    asset.downloadUrl = newVersion.downloadUrl;
    asset.updatedAt = now;

    return newVersion;
  }

  // ==========================================
  // RELATIONSHIPS & NON-DESTRUCTIVE UNLINK (Section 10)
  // ==========================================
  addRelationship(workspaceId: string, id: string, dto: AddAssetRelationshipDto): AssetRelationship {
    const asset = this.findOne(workspaceId, id);

    if (!dto.relatedId || !dto.relatedType) {
      throw new BadRequestException('Related ID and related type are required.');
    }

    // Check duplicate relationship
    const existing = asset.relationships.find(
      (r) => r.relatedType === dto.relatedType && r.relatedId === dto.relatedId,
    );
    if (existing) {
      return existing;
    }

    const rel: AssetRelationship = {
      id: `rel-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      assetId: asset.id,
      relatedType: dto.relatedType,
      relatedId: dto.relatedId,
      relatedTitle: dto.relatedTitle || `${dto.relatedType} #${dto.relatedId}`,
      stage: dto.stage,
      createdAt: new Date().toISOString(),
    };

    asset.relationships.push(rel);
    asset.updatedAt = new Date().toISOString();
    return rel;
  }

  removeRelationship(workspaceId: string, id: string, relationshipId: string): void {
    const asset = this.findOne(workspaceId, id);
    const index = asset.relationships.findIndex((r) => r.id === relationshipId);

    if (index === -1) {
      throw new NotFoundException(`Relationship #${relationshipId} not found on asset #${id}.`);
    }

    // Non-destructive: removes ONLY the link relationship; asset and binary are preserved!
    asset.relationships.splice(index, 1);
    asset.updatedAt = new Date().toISOString();
  }

  // ==========================================
  // AUTHORIZED DOWNLOAD & PREVIEW (Section 8)
  // ==========================================
  getAuthorizedDownload(workspaceId: string, id: string, versionId?: string) {
    const asset = this.findOne(workspaceId, id);

    let targetVersion = asset.versions[0];
    if (versionId) {
      const match = asset.versions.find((v) => v.id === versionId);
      if (!match) {
        throw new NotFoundException(`Version #${versionId} not found on asset #${id}.`);
      }
      targetVersion = match;
    }

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour token
    const token = Buffer.from(`${targetVersion.storageKey}:${Date.now() + 3600000}`).toString('base64');
    const downloadUrl = `https://storage.corviin.internal/download/${targetVersion.storageKey}?token=${token}&disposition=attachment`;
    const previewUrl = `https://storage.corviin.internal/download/${targetVersion.storageKey}?token=${token}&disposition=inline`;

    return {
      assetId: asset.id,
      versionId: targetVersion.id,
      fileName: targetVersion.fileName,
      mimeType: targetVersion.mimeType,
      sizeBytes: targetVersion.sizeBytes,
      downloadUrl,
      previewUrl,
      expiresAt,
    };
  }

  // ==========================================
  // FOLDER MOVEMENT (Section 3 & 5)
  // ==========================================
  moveAsset(workspaceId: string, id: string, targetFolderId: string | null): AssetItem {
    const asset = this.findOne(workspaceId, id);

    if (targetFolderId && this.foldersService) {
      const folder = this.foldersService.findOne(workspaceId, targetFolderId);
      if (folder.workspaceId !== workspaceId) {
        throw new ForbiddenException('Target folder belongs to a different workspace.');
      }
      asset.folderName = folder.name;
    } else {
      asset.folderName = undefined;
    }

    const previousFolderId = asset.folderId;
    asset.folderId = targetFolderId;
    asset.updatedAt = new Date().toISOString();

    // Audit Event
    this.notificationsService?.emitEvent({
      workspaceId,
      actorId: 'user',
      actorName: 'User',
      entityType: AuditEntityType.ASSET,
      entityId: asset.id,
      entityTitle: asset.title,
      action: AuditAction.MOVED,
      changeSummary: `Moved asset "${asset.title}" to folder #${targetFolderId ?? 'root'}`,
      previousValues: { folderId: previousFolderId },
      newValues: { folderId: targetFolderId },
    });

    return asset;
  }

  bulkMoveAssets(
    workspaceId: string,
    dto: BulkMoveAssetsDto,
  ): { success: boolean; movedCount: number; targetFolderId: string | null } {
    if (!workspaceId) throw new BadRequestException('Workspace ID required');
    if (!dto.assetIds || dto.assetIds.length === 0) {
      throw new BadRequestException('At least one asset ID is required.');
    }

    const targetFolderId = dto.targetFolderId || null;
    let targetFolderName: string | undefined = undefined;
    if (targetFolderId && this.foldersService) {
      const folder = this.foldersService.findOne(workspaceId, targetFolderId);
      if (folder.workspaceId !== workspaceId) {
        throw new ForbiddenException('Target folder belongs to a different workspace.');
      }
      targetFolderName = folder.name;
    }

    let count = 0;
    for (const id of dto.assetIds) {
      const asset = this.assets.find((a) => a.id === id && a.workspaceId === workspaceId);
      if (asset) {
        asset.folderId = targetFolderId;
        asset.folderName = targetFolderName;
        asset.updatedAt = new Date().toISOString();
        count++;
      }
    }

    return { success: true, movedCount: count, targetFolderId };
  }

  moveContainedAssets(workspaceId: string, sourceFolderId: string, targetFolderId: string | null): number {
    let count = 0;
    for (const a of this.assets) {
      if (a.workspaceId === workspaceId && a.folderId === sourceFolderId) {
        a.folderId = targetFolderId;
        a.updatedAt = new Date().toISOString();
        count++;
      }
    }
    return count;
  }

  // ==========================================
  // PERMANENT DELETION (Section 10)
  // ==========================================
  delete(workspaceId: string, id: string): { success: boolean; deletedId: string } {
    const asset = this.findOne(workspaceId, id);

    const index = this.assets.findIndex((a) => a.id === id);
    if (index !== -1) {
      this.assets.splice(index, 1);
    }

    return {
      success: true,
      deletedId: id,
    };
  }
}

