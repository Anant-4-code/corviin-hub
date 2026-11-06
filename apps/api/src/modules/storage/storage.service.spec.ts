import { Test, TestingModule } from '@nestjs/testing';
import { StorageService } from './storage.service';
import { OBJECT_STORAGE_PROVIDER } from './object-storage.interface';
import { MockStorageProvider } from './mock-storage.provider';

describe('StorageService', () => {
  let service: StorageService;
  let mockProvider: MockStorageProvider;

  beforeEach(async () => {
    mockProvider = new MockStorageProvider();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StorageService,
        {
          provide: OBJECT_STORAGE_PROVIDER,
          useValue: mockProvider,
        },
      ],
    }).compile();

    service = module.get<StorageService>(StorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sanitizeFilename', () => {
    it('should sanitize special characters in file names', () => {
      const sanitized = service.sanitizeFilename('my file #1 (draft) [v2]?.png');
      expect(sanitized).toBe('my_file__1__draft___v2__.png');
      expect(sanitized).not.toContain(' ');
      expect(sanitized).not.toContain('#');
      expect(sanitized).not.toContain('?');
    });

    it('should keep standard alphanumeric, dot, dash, and underscore characters', () => {
      const sanitized = service.sanitizeFilename('report-2026_Q4.final.pdf');
      expect(sanitized).toBe('report-2026_Q4.final.pdf');
    });
  });

  describe('buildStorageKey', () => {
    it('should generate properly isolated storage key with workspace prefix', () => {
      const wsId = 'ws-tech-0001-0000-000000000001';
      const key = service.buildStorageKey(wsId, 'architecture_diagram.png', 'ast-test-01');

      expect(key.startsWith(`workspaces/${wsId}/assets/`)).toBe(true);
      expect(key.endsWith('ast-test-01-architecture_diagram.png')).toBe(true);
    });

    it('should throw if workspaceId is empty', () => {
      expect(() => service.buildStorageKey('', 'file.pdf')).toThrow(
        'Workspace ID is required',
      );
    });
  });

  describe('presigned URLs & lifecycle', () => {
    const wsId = 'ws-tech-0001-0000-000000000001';
    const storageKey = `workspaces/${wsId}/assets/2026/11/ast-test-document.pdf`;

    it('should generate presigned upload URL', async () => {
      const result = await service.createUploadUrl(storageKey, 'application/pdf', 600);

      expect(result.uploadUrl).toBeDefined();
      expect(result.uploadUrl).toContain(storageKey);
      expect(result.storageKey).toBe(storageKey);
      expect(result.expiresAt).toBeDefined();
      expect(result.headers?.['Content-Type']).toBe('application/pdf');
    });

    it('should generate presigned download URL', async () => {
      const result = await service.createDownloadUrl(storageKey, 1800);

      expect(result.downloadUrl).toBeDefined();
      expect(result.downloadUrl).toContain(storageKey);
      expect(result.expiresAt).toBeDefined();
    });

    it('should verify object existence and retrieve metadata', async () => {
      // Create upload registers mock object
      await service.createUploadUrl(storageKey, 'application/pdf');

      const exists = await service.objectExists(storageKey);
      expect(exists).toBe(true);

      const metadata = await service.getObjectMetadata(storageKey);
      expect(metadata).not.toBeNull();
      expect(metadata?.contentType).toBe('application/pdf');
      expect(metadata?.sizeBytes).toBeGreaterThan(0);
    });

    it('should delete object and verify absence', async () => {
      await service.createUploadUrl(storageKey, 'application/pdf');
      expect(await service.objectExists(storageKey)).toBe(true);

      await service.deleteObject(storageKey);
      expect(await service.objectExists(storageKey)).toBe(false);
      expect(await service.getObjectMetadata(storageKey)).toBeNull();
    });
  });
});
