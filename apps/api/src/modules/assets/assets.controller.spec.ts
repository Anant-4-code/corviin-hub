import { Test, TestingModule } from '@nestjs/testing';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';
import { FoldersService } from '../folders/folders.service';
import { NotificationsService } from '../notifications/notifications.service';
import { StorageService } from '../storage/storage.service';
import { MockStorageProvider } from '../storage/mock-storage.provider';
import {
  AssetCategory,
  AssetTypeGroup,
  UploadIntentDto,
  ConfirmUploadDto,
  DirectUploadDto,
  CreateAssetVersionDto,
  AddAssetRelationshipDto,
} from '@corviin-hub/shared';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';

describe('AssetsController', () => {
  let controller: AssetsController;
  let service: AssetsService;

  const techWs = 'ws-tech-0001-0000-000000000001';
  const realWs = 'ws-real-0002-0000-000000000002';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssetsController],
      providers: [
        AssetsService,
        FoldersService,
        NotificationsService,
        {
          provide: StorageService,
          useValue: new StorageService(new MockStorageProvider()),
        },
      ],
    }).compile();

    controller = module.get<AssetsController>(AssetsController);
    service = module.get<AssetsService>(AssetsService);
  });

  describe('Workspace Scoping & Isolation', () => {
    it('returns only assets belonging to the requested workspace', () => {
      const techRes = controller.findAll(techWs);
      expect(techRes.items.length).toBeGreaterThan(0);
      expect(techRes.items.every((a) => a.workspaceId === techWs)).toBe(true);

      const realRes = controller.findAll(realWs);
      expect(realRes.items.length).toBeGreaterThan(0);
      expect(realRes.items.every((a) => a.workspaceId === realWs)).toBe(true);

      // Verify no overlap
      const techIds = techRes.items.map((a) => a.id);
      const realIds = realRes.items.map((a) => a.id);
      expect(techIds.some((id) => realIds.includes(id))).toBe(false);
    });

    it('throws ForbiddenException when attempting to access an asset belonging to another workspace', () => {
      // ast-raw-01 is a Tech asset
      expect(() => controller.findOne('ast-raw-01', realWs)).toThrow(ForbiddenException);
    });

    it('throws BadRequestException when no workspace is provided', () => {
      expect(() => controller.findAll(undefined, undefined)).toThrow(BadRequestException);
    });
  });

  describe('File Policy & Validation', () => {
    it('rejects disallowed executable file extensions', () => {
      const intentDto: UploadIntentDto = {
        fileName: 'malicious_script.exe',
        mimeType: 'application/x-msdownload',
        sizeBytes: 1024,
        category: AssetCategory.OTHER,
      };

      expect(() => controller.getUploadIntent(intentDto, techWs)).toThrow(BadRequestException);
    });

    it('rejects files exceeding 500MB maximum size limit', () => {
      const intentDto: UploadIntentDto = {
        fileName: 'huge_video.mp4',
        mimeType: 'video/mp4',
        sizeBytes: 600 * 1024 * 1024, // 600 MB
        category: AssetCategory.RAW_FOOTAGE,
      };

      expect(() => controller.getUploadIntent(intentDto, techWs)).toThrow(BadRequestException);
    });

    it('correctly maps MIME and extensions to AssetTypeGroup', () => {
      expect(service.detectTypeGroup('image/png', '.png')).toBe(AssetTypeGroup.IMAGE);
      expect(service.detectTypeGroup('video/mp4', '.mp4')).toBe(AssetTypeGroup.VIDEO);
      expect(service.detectTypeGroup('audio/mp3', '.mp3')).toBe(AssetTypeGroup.AUDIO);
      expect(service.detectTypeGroup('application/pdf', '.pdf')).toBe(AssetTypeGroup.DOCUMENT);
    });
  });

  describe('Upload Intent & Confirmation Flow', () => {
    it('generates short-lived upload authorization and storage key', () => {
      const intentDto: UploadIntentDto = {
        fileName: 'sample_audio_voiceover.mp3',
        mimeType: 'audio/mp3',
        sizeBytes: 12000000,
        category: AssetCategory.AUDIO_VO,
        title: 'Voiceover Take 1',
      };

      const res = controller.getUploadIntent(intentDto, techWs);
      expect(res.uploadIntentId).toBeDefined();
      expect(res.storageKey).toContain(`workspaces/${techWs}/assets/`);
      expect(res.uploadUrl).toContain('https://storage.corviin.internal/upload/');
      expect(res.expiresAt).toBeDefined();
    });

    it('confirms upload and creates asset record with initial v1 version', () => {
      const confirmDto: ConfirmUploadDto = {
        uploadIntentId: 'intent-test-1',
        storageKey: `workspaces/${techWs}/assets/2026/11/sample.png`,
        fileName: 'sample.png',
        mimeType: 'image/png',
        sizeBytes: 450000,
        category: AssetCategory.IMAGES,
        title: 'Sample Marketing Banner',
        tags: ['banner', 'promo'],
        uploaderId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        uploaderName: 'Anant',
      };

      const asset = controller.confirmUpload(confirmDto, techWs);
      expect(asset.id).toBeDefined();
      expect(asset.title).toBe('Sample Marketing Banner');
      expect(asset.category).toBe(AssetCategory.IMAGES);
      expect(asset.typeGroup).toBe(AssetTypeGroup.IMAGE);
      expect(asset.currentVersionNumber).toBe(1);
      expect(asset.versions.length).toBe(1);
      expect(asset.versions[0].versionNumber).toBe(1);
      expect(asset.versions[0].fileName).toBe('sample.png');
    });

    it('supports direct upload helper for testing and rapid UI uploads', () => {
      const directDto: DirectUploadDto = {
        fileName: 'client_deck.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 3500000,
        category: AssetCategory.CONTRACTS_DOCS,
        title: 'Q4 Client Strategy Presentation Deck',
        tags: ['deck', 'client'],
        relatedType: 'campaign',
        relatedId: 'cmp-tech-001',
        relatedTitle: 'Q4 Product Launch & Demo Blitz',
      };

      const asset = controller.directUpload(directDto, techWs);
      expect(asset.id).toBeDefined();
      expect(asset.relationships.length).toBe(1);
      expect(asset.relationships[0].relatedId).toBe('cmp-tech-001');
    });
  });

  describe('Versioning (Section 9)', () => {
    it('creates new version, increments version number, and preserves previous versions', () => {
      // ast-raw-01 starts at version 1
      const initial = controller.findOne('ast-raw-01', techWs);
      expect(initial.currentVersionNumber).toBe(1);
      expect(initial.versions.length).toBe(1);

      const newVersionDto: CreateAssetVersionDto = {
        fileName: 'raw_footage_4k_take2.mp4',
        mimeType: 'video/mp4',
        sizeBytes: 155000000,
        changeNote: 'Second take with adjusted white balance',
        uploaderId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        uploaderName: 'Anant',
      };

      const ver = controller.addVersion('ast-raw-01', newVersionDto, techWs);
      expect(ver.versionNumber).toBe(2);
      expect(ver.fileName).toBe('raw_footage_4k_take2.mp4');

      const updated = controller.findOne('ast-raw-01', techWs);
      expect(updated.currentVersionNumber).toBe(2);
      expect(updated.versions.length).toBe(2);
      expect(updated.versions[0].versionNumber).toBe(2);
      expect(updated.versions[1].versionNumber).toBe(1);
      expect(updated.sizeBytes).toBe(155000000);
    });

    it('generates authorized download URL for specific prior versions', () => {
      const v1Download = controller.getAuthorizedDownload('ast-scr-01', 'ver-scr-1', techWs);
      expect(v1Download.versionId).toBe('ver-scr-1');
      expect(v1Download.fileName).toBe('launch_script_draft.md');
      expect(v1Download.downloadUrl).toContain('https://storage.corviin.internal/download/');
    });
  });

  describe('Relationships & Non-Destructive Unlinking (Section 10)', () => {
    it('links an asset to another entity without duplicating the asset binary', () => {
      const relDto: AddAssetRelationshipDto = {
        relatedType: 'task',
        relatedId: 'tsk-001',
        relatedTitle: 'Finalize presentation deck',
      };

      const rel = controller.addRelationship('ast-tech-brand', relDto, techWs);
      expect(rel.id).toBeDefined();
      expect(rel.relatedId).toBe('tsk-001');

      const asset = controller.findOne('ast-tech-brand', techWs);
      expect(asset.relationships.some((r) => r.relatedId === 'tsk-001')).toBe(true);
    });

    it('unlinking removes ONLY the relationship while preserving the asset and its versions', () => {
      const initial = controller.findOne('ast-raw-01', techWs);
      expect(initial.relationships.length).toBeGreaterThan(0);
      const relId = initial.relationships[0].id;

      const unlinkRes = controller.removeRelationship('ast-raw-01', relId, techWs);
      expect(unlinkRes.success).toBe(true);

      const afterUnlink = controller.findOne('ast-raw-01', techWs);
      expect(afterUnlink.relationships.some((r) => r.id === relId)).toBe(false);
      // Asset record and versions are preserved
      expect(afterUnlink.id).toBe('ast-raw-01');
      expect(afterUnlink.versions.length).toBeGreaterThan(0);
    });
  });

  describe('Search, Filters & Pagination (Section 7)', () => {
    it('filters assets by category', () => {
      const res = controller.findAll(techWs, undefined, undefined, AssetCategory.SCRIPTS);
      expect(res.items.length).toBeGreaterThan(0);
      expect(res.items.every((a) => a.category === AssetCategory.SCRIPTS)).toBe(true);
    });

    it('filters assets by typeGroup', () => {
      const res = controller.findAll(
        techWs,
        undefined,
        undefined,
        undefined,
        AssetTypeGroup.IMAGE,
      );
      expect(res.items.length).toBeGreaterThan(0);
      expect(res.items.every((a) => a.typeGroup === AssetTypeGroup.IMAGE)).toBe(true);
    });

    it('searches assets by keyword in title, filename, or tags', () => {
      const res = controller.findAll(techWs, undefined, 'Diagram');
      expect(res.items.length).toBeGreaterThan(0);
      expect(res.items[0].title).toContain('Architecture');
    });

    it('computes storage summary across the workspace', () => {
      const res = controller.findAll(techWs);
      expect(res.summary).toBeDefined();
      expect(res.summary.totalCount).toBeGreaterThan(0);
      expect(res.summary.totalSizeBytes).toBeGreaterThan(0);
      expect(res.summary.byType.images).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Permanent Deletion (Section 10)', () => {
    it('deletes asset record permanently when requested', () => {
      // Create temporary asset to delete
      const temp = controller.directUpload(
        {
          fileName: 'temp_to_delete.txt',
          mimeType: 'text/plain',
          sizeBytes: 100,
          category: AssetCategory.OTHER,
          title: 'Temporary File',
        },
        techWs,
      );

      const delRes = controller.delete(temp.id, techWs);
      expect(delRes.success).toBe(true);
      expect(() => controller.findOne(temp.id, techWs)).toThrow(NotFoundException);
    });
  });
});

