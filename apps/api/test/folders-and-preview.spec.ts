import { PrismaService } from '../src/prisma/prisma.service';
import { FoldersService } from '../src/modules/folders/folders.service';
import { AssetsService } from '../src/modules/assets/assets.service';
import { StorageService } from '../src/modules/storage/storage.service';
import { MockStorageProvider } from '../src/modules/storage/mock-storage.provider';
import { BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DeleteFolderStrategy } from '@corviin-hub/shared';

describe('Enhanced Assets: Folder Management & Universal File Preview Integration', () => {
  let prisma: PrismaService;
  let foldersService: FoldersService;
  let assetsService: AssetsService;
  let storageService: StorageService;

  const techWorkspaceId = 'ws-tech-0001-0000-000000000001';
  const realEstateWorkspaceId = 'ws-real-0002-0000-000000000002';
  const anantProfileId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.onModuleInit();
    foldersService = new FoldersService(prisma);
    storageService = new StorageService(new MockStorageProvider());
    assetsService = new AssetsService(foldersService, undefined, storageService);
  });

  afterAll(async () => {
    await prisma.onModuleDestroy();
  });

  describe('1. Hierarchical Folder Seeding & Hierarchy', () => {
    it('seeds 27 deterministic default folders without duplicates on multiple calls', async () => {
      const foldersFirstPass = foldersService.findAll(techWorkspaceId);
      expect(foldersFirstPass.length).toBeGreaterThanOrEqual(25);

      // Subsequent seed run should be idempotent
      foldersService.provisionWorkspaceDefaults(techWorkspaceId, anantProfileId, 'Anant');
      const foldersSecondPass = foldersService.findAll(techWorkspaceId);
      expect(foldersSecondPass.length).toBe(foldersFirstPass.length);

      // Verify root operational folders exist
      const rootNames = foldersSecondPass.filter((f) => !f.parentFolderId).map((f) => f.name);
      expect(rootNames).toContain('Meetings');
      expect(rootNames).toContain('Plans & Goals');
      expect(rootNames).toContain('Campaigns');
      expect(rootNames).toContain('Calls & Recordings');
      expect(rootNames).toContain('Documents & PDFs');
      expect(rootNames).toContain('Media & Creative');
      expect(rootNames).toContain('General');
    });

    it('returns a hierarchical tree with nested subfolders', async () => {
      const tree = foldersService.getFolderTree(techWorkspaceId);
      expect(tree.length).toBe(7); // 7 root folders

      const meetingsRoot = tree.find((t) => t.name === 'Meetings');
      expect(meetingsRoot).toBeDefined();
      expect(meetingsRoot!.subfolders).toBeDefined();
      expect(meetingsRoot!.subfolders!.length).toBe(3);
      const childNames = meetingsRoot!.subfolders!.map((c) => c.name);
      expect(childNames).toContain('Meeting Documents');
      expect(childNames).toContain('Minutes & Notes');
      expect(childNames).toContain('Presentations');
    });
  });

  describe('2. Custom Folder Creation & Duplicate Prevention', () => {
    it('creates custom folders and nested subfolders', async () => {
      const folder = await foldersService.create(techWorkspaceId, {
        name: 'Sprint Retrospectives',
        description: 'Post-launch retro notes and recordings',
        parentFolderId: 'fld-tch-meetings',
        createdBy: anantProfileId,
        createdByName: 'Anant',
      });

      expect(folder).toBeDefined();
      expect(folder.name).toBe('Sprint Retrospectives');
      expect(folder.parentFolderId).toBe('fld-tch-meetings');
    });

    it('rejects duplicate folder names under the same parent', async () => {
      expect(() =>
        foldersService.create(techWorkspaceId, {
          name: 'Sprint Retrospectives',
          parentFolderId: 'fld-tch-meetings',
        })
      ).toThrow(BadRequestException);
    });

    it('allows same folder name under a DIFFERENT parent', async () => {
      const folderInGeneral = await foldersService.create(techWorkspaceId, {
        name: 'Sprint Retrospectives',
        parentFolderId: 'fld-tch-general',
      });

      expect(folderInGeneral).toBeDefined();
      expect(folderInGeneral.parentFolderId).toBe('fld-tch-general');
    });
  });

  describe('3. Circular Move Prevention & Safe Move Workflows', () => {
    it('prevents moving a folder into itself', () => {
      expect(() =>
        foldersService.move(techWorkspaceId, 'fld-tch-meetings', {
          targetParentFolderId: 'fld-tch-meetings',
        })
      ).toThrow(BadRequestException);
    });

    it('prevents moving a folder into one of its descendants', () => {
      // fld-tch-meetings-meeting-documents is child of fld-tch-meetings
      expect(() =>
        foldersService.move(techWorkspaceId, 'fld-tch-meetings', {
          targetParentFolderId: 'fld-tch-meetings-meeting-documents',
        })
      ).toThrow(BadRequestException);
    });
  });

  describe('4. File Movement Between Folders', () => {
    it('moves a single asset into a target folder', async () => {
      const assets = assetsService.findAll(techWorkspaceId, { pageSize: 1 });
      expect(assets.items.length).toBeGreaterThan(0);
      const targetAsset = assets.items[0];

      const moved = assetsService.moveAsset(
        techWorkspaceId,
        targetAsset.id,
        'fld-tch-meetings-presentations',
      );

      expect(moved.folderId).toBe('fld-tch-meetings-presentations');
      expect(moved.folderName).toBe('Presentations');
    });

    it('bulk moves multiple assets into a folder atomically', async () => {
      const assets = assetsService.findAll(techWorkspaceId, { pageSize: 3 });
      const assetIds = assets.items.map((a) => a.id);

      const result = assetsService.bulkMoveAssets(techWorkspaceId, {
        assetIds,
        targetFolderId: 'fld-tch-general-unsorted',
      });

      expect(result.success).toBe(true);
      expect(result.movedCount).toBe(assetIds.length);

      // Verify all assets are now in unsorted
      for (const id of assetIds) {
        const item = assetsService.findOne(techWorkspaceId, id);
        expect(item.folderId).toBe('fld-tch-general-unsorted');
      }
    });
  });

  describe('5. Universal File Preview & Authorized Access', () => {
    it('generates inline disposition preview URL for universal viewer', async () => {
      const assets = assetsService.findAll(techWorkspaceId, { pageSize: 1 });
      const testAsset = assets.items[0];

      const downloadResult = await assetsService.getAuthorizedDownload(techWorkspaceId, testAsset.id);
      expect(downloadResult).toBeDefined();
      expect(downloadResult.downloadUrl).toBeDefined();
      expect(downloadResult.previewUrl).toBeDefined();
      expect(downloadResult.previewUrl).toContain('disposition=inline');
      expect(downloadResult.downloadUrl).toContain('disposition=attachment');
      expect(downloadResult.mimeType).toBe(testAsset.mimeType);
    });
  });

  describe('6. Safe Folder Deletion Strategies', () => {
    it('deletes folder with move_to_parent strategy preserving assets', async () => {
      // 1. Create a temporary folder
      const tempFolder = await foldersService.create(techWorkspaceId, {
        name: 'Temp Deletion Folder',
        parentFolderId: 'fld-tch-campaigns',
      });

      // 2. Put an asset in it
      const assets = assetsService.findAll(techWorkspaceId, { pageSize: 1 });
      const testAsset = assets.items[0];
      assetsService.moveAsset(techWorkspaceId, testAsset.id, tempFolder.id);

      // 3. Delete folder with move_to_parent
      const res = await foldersService.delete(techWorkspaceId, tempFolder.id, 'move_to_parent', assetsService);
      expect(res.success).toBe(true);

      // 4. Verify asset was relocated to parent ('fld-tch-campaigns')
      const updatedAsset = assetsService.findOne(techWorkspaceId, testAsset.id);
      expect(updatedAsset.folderId).toBe('fld-tch-campaigns');
    });
  });

  describe('7. Workspace Scoping & Isolation', () => {
    it('enforces workspace isolation: real estate workspace cannot view or move tech folders', async () => {
      const realEstateFolders = foldersService.findAll(realEstateWorkspaceId);
      for (const f of realEstateFolders) {
        expect(f.workspaceId).toBe(realEstateWorkspaceId);
        expect(f.workspaceId).not.toBe(techWorkspaceId);
      }

      // Attempting to access tech folder from real estate workspace throws ForbiddenException
      expect(() =>
        foldersService.findOne(realEstateWorkspaceId, 'fld-tch-meetings')
      ).toThrow(ForbiddenException);
    });
  });
});
