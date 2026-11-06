import { PrismaService } from '../src/prisma/prisma.service';
import { StorageService } from '../src/modules/storage/storage.service';
import { MockStorageProvider } from '../src/modules/storage/mock-storage.provider';
import { AssetsService } from '../src/modules/assets/assets.service';
import { NotificationsService } from '../src/modules/notifications/notifications.service';
import {
  AssetCategory,
  NotificationType,
  AuditEntityType,
  AuditAction,
  UploadIntentDto,
  ConfirmUploadDto,
} from '@corviin-hub/shared';
import { BadRequestException, ForbiddenException } from '@nestjs/common';

describe('PHASE 7: Assets, Notifications & Operational Services Integration', () => {
  let prisma: PrismaService;
  let storageService: StorageService;
  let assetsService: AssetsService;
  let notificationsService: NotificationsService;

  const techWorkspaceId = 'ws-tech-0001-0000-000000000001';
  const realEstateWorkspaceId = 'ws-real-0002-0000-000000000002';

  const anantProfileId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
  const rohitProfileId = 'b2c3d4e5-f6a7-8901-bcde-f12345678901';

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.onModuleInit();

    const mockProvider = new MockStorageProvider();
    storageService = new StorageService(mockProvider);
    assetsService = new AssetsService();
    notificationsService = new NotificationsService();
  });

  afterAll(async () => {
    await prisma.onModuleDestroy();
  });

  // =========================================================================
  // 1. CLOUDFLARE R2 STORAGE & SIGNED URLS
  // =========================================================================
  describe('1. Cloudflare R2 Storage & Signed URL Workflows', () => {
    it('generates private workspace-isolated storage keys', () => {
      const key = storageService.buildStorageKey(techWorkspaceId, 'Architecture Diagram v1.png');
      expect(key).toContain(`workspaces/${techWorkspaceId}/assets/`);
      expect(key).toContain('Architecture_Diagram_v1.png');
    });

    it('sanitizes unsafe characters in filenames', () => {
      const sanitized = storageService.sanitizeFilename('report & notes (final)#1.pdf');
      expect(sanitized).toBe('report___notes__final__1.pdf');
    });

    it('generates presigned upload URL with expiry and content-type headers', async () => {
      const key = storageService.buildStorageKey(techWorkspaceId, 'video_raw.mp4');
      const res = await storageService.createUploadUrl(key, 'video/mp4', 300);

      expect(res.uploadUrl).toBeDefined();
      expect(res.storageKey).toBe(key);
      expect(res.headers?.['Content-Type']).toBe('video/mp4');
      expect(new Date(res.expiresAt).getTime()).toBeGreaterThan(Date.now());
    });

    it('generates presigned download URL for private asset access', async () => {
      const key = storageService.buildStorageKey(techWorkspaceId, 'spec.pdf');
      const res = await storageService.createDownloadUrl(key, 600);

      expect(res.downloadUrl).toBeDefined();
      expect(new Date(res.expiresAt).getTime()).toBeGreaterThan(Date.now());
    });

    it('retries transient operations with exponential backoff and succeeds', async () => {
      let attempts = 0;
      const transientOperation = async () => {
        attempts++;
        if (attempts < 3) {
          throw new Error('Transient socket timeout');
        }
        return 'success';
      };

      const result = await storageService.withRetry(transientOperation, 3, 50);
      expect(result).toBe('success');
      expect(attempts).toBe(3);
    });

    it('reports operational storage health status', async () => {
      const health = await storageService.getStorageHealth();
      expect(health.status).toBeDefined();
      expect(health.configured).toBe(true);
      expect(health.bucketName).toBeDefined();
    });
  });

  // =========================================================================
  // 2. ASSET MANAGEMENT, POLICY & RELATIONSHIPS
  // =========================================================================
  describe('2. Asset Management & Security Validation', () => {
    it('rejects disallowed executable file extensions', () => {
      const intent: UploadIntentDto = {
        fileName: 'malicious.bat',
        mimeType: 'application/x-bat',
        sizeBytes: 2048,
        category: AssetCategory.OTHER,
      };
      expect(() => assetsService.getUploadIntent(techWorkspaceId, intent)).toThrow(
        BadRequestException,
      );
    });

    it('rejects files exceeding maximum file size of 500 MB', () => {
      const intent: UploadIntentDto = {
        fileName: 'massive_video.mkv',
        mimeType: 'video/x-matroska',
        sizeBytes: 550 * 1024 * 1024,
        category: AssetCategory.RAW_FOOTAGE,
      };
      expect(() => assetsService.getUploadIntent(techWorkspaceId, intent)).toThrow(
        BadRequestException,
      );
    });

    it('completes secure upload intent and confirms asset registration', () => {
      const intent: UploadIntentDto = {
        fileName: 'brand_typography_2026.otf',
        mimeType: 'font/otf',
        sizeBytes: 450000,
        category: AssetCategory.IMAGES,
        title: 'Brand Typography',
      };
      const intentRes = assetsService.getUploadIntent(techWorkspaceId, intent);
      expect(intentRes.uploadIntentId).toBeDefined();
      expect(intentRes.storageKey).toContain(techWorkspaceId);

      const confirmDto: ConfirmUploadDto = {
        uploadIntentId: intentRes.uploadIntentId,
        storageKey: intentRes.storageKey,
        fileName: intent.fileName,
        mimeType: intent.mimeType,
        sizeBytes: intent.sizeBytes,
        category: intent.category,
        title: intent.title,
        uploaderId: anantProfileId,
        uploaderName: 'Anant',
      };
      const confirmedAsset = assetsService.confirmUpload(techWorkspaceId, confirmDto);
      expect(confirmedAsset.id).toBeDefined();
      expect(confirmedAsset.title).toBe('Brand Typography');
      expect(confirmedAsset.currentVersionNumber).toBe(1);
      expect(confirmedAsset.versions.length).toBe(1);
    });

    it('rejects unauthorized cross-workspace asset download', () => {
      // ast-raw-01 belongs to Tech workspace
      expect(() =>
        assetsService.getAuthorizedDownload(realEstateWorkspaceId, 'ast-raw-01'),
      ).toThrow(ForbiddenException);
    });

    it('links existing asset to campaign and unlinks without deleting file', () => {
      const asset = assetsService.confirmUpload(techWorkspaceId, {
        uploadIntentId: 'intent-dummy',
        storageKey: `workspaces/${techWorkspaceId}/assets/campaign_thumbnail.png`,
        fileName: 'campaign_thumbnail.png',
        mimeType: 'image/png',
        sizeBytes: 120000,
        category: AssetCategory.IMAGES,
        title: 'Campaign 4K Thumbnail',
        uploaderId: anantProfileId,
        uploaderName: 'Anant',
      });

      // Link to campaign
      const relationship = assetsService.addRelationship(techWorkspaceId, asset.id, {
        relatedType: 'campaign',
        relatedId: 'cmp-tech-999',
        relatedTitle: 'Q4 Product Blitz',
        stage: 'EDITING',
      });
      expect(relationship.relatedId).toBe('cmp-tech-999');

      // Verify relationship is listed
      const loaded = assetsService.findOne(techWorkspaceId, asset.id);
      expect(loaded.relationships.length).toBe(1);

      // Unlink from campaign
      assetsService.removeRelationship(techWorkspaceId, asset.id, relationship.id);

      // Verify relationship removed but asset still exists
      const afterUnlink = assetsService.findOne(techWorkspaceId, asset.id);
      expect(afterUnlink.relationships.length).toBe(0);
      expect(afterUnlink.id).toBe(asset.id);
      expect(afterUnlink.storageKey).toBe(asset.storageKey);
    });
  });

  // =========================================================================
  // 3. IN-APP NOTIFICATIONS & PREFERENCE FILTERING
  // =========================================================================
  describe('3. In-App Notifications & Preference Filtering', () => {
    it('creates in-app notification and calculates unread count accurately', () => {
      const initialCount = notificationsService.getUnreadCount(techWorkspaceId, anantProfileId);

      const res = notificationsService.emitEvent({
        workspaceId: techWorkspaceId,
        actorId: rohitProfileId,
        actorName: 'Rohit',
        entityType: AuditEntityType.TASK,
        entityId: 'tsk-notif-01',
        entityTitle: 'Complete Security Verification',
        changeSummary: 'Assigned task to Anant',
        action: AuditAction.CREATED,
        notification: {
          recipientId: anantProfileId,
          type: NotificationType.TASK_ASSIGNED,
          title: 'New High Priority Task',
          message: 'Rohit assigned you to complete security verification.',
          actionDestination: '/tasks/tsk-notif-01',
        },
      });
      expect(res.notificationId).toBeDefined();

      const newCount = notificationsService.getUnreadCount(techWorkspaceId, anantProfileId);
      expect(newCount.count).toBe(initialCount.count + 1);
    });

    it('prevents duplicate notification creation for the same event and recipient', () => {
      const payload = {
        workspaceId: techWorkspaceId,
        actorId: rohitProfileId,
        actorName: 'Rohit',
        entityType: AuditEntityType.TASK,
        entityId: 'tsk-dedup-01',
        entityTitle: 'Duplicate Prevention Task',
        changeSummary: 'Checking duplicate prevention logic.',
        action: AuditAction.CREATED,
        notification: {
          recipientId: anantProfileId,
          type: NotificationType.TASK_ASSIGNED,
          title: 'Duplicate Prevention Check',
          message: 'Checking duplicate prevention logic.',
          actionDestination: '/tasks/tsk-dedup-01',
        },
      };

      // First emission creates notification
      const res1 = notificationsService.emitEvent(payload);
      const countAfterFirst = notificationsService.getUnreadCount(techWorkspaceId, anantProfileId);

      // Second identical emission should reuse existing notification ID and not increment count
      const res2 = notificationsService.emitEvent(payload);
      const countAfterSecond = notificationsService.getUnreadCount(techWorkspaceId, anantProfileId);

      expect(res2.notificationId).toBe(res1.notificationId);
      expect(countAfterSecond.count).toBe(countAfterFirst.count);
    });

    it('suppresses notifications when recipient preferences disable the category', () => {
      const res = notificationsService.emitEvent({
        workspaceId: techWorkspaceId,
        actorId: rohitProfileId,
        actorName: 'Rohit',
        entityType: AuditEntityType.TASK,
        entityId: 'tsk-pref-suppressed',
        entityTitle: 'Opted-out Task',
        changeSummary: 'Task assigned but alert suppressed by settings',
        action: AuditAction.CREATED,
        recipientPreferences: {
          taskAssignments: false, // User opted out of task assignment alerts
          inAppChannel: true,
        },
        notification: {
          recipientId: anantProfileId,
          type: NotificationType.TASK_ASSIGNED,
          title: 'Opted-out Task Alert',
          message: 'This alert should be suppressed by personal settings.',
          actionDestination: '/tasks/tsk-pref-suppressed',
        },
      });

      expect(res.suppressedByPreferences).toBe(true);
      expect(res.notificationId).toBeUndefined();
    });

    it('marks notification as read and supports marking all as read', () => {
      const notifs = notificationsService.getNotifications({
        workspaceId: techWorkspaceId,
        profileId: anantProfileId,
        unreadOnly: true,
      });
      expect(notifs.length).toBeGreaterThan(0);

      // Mark single notification read
      const updated = notificationsService.markAsRead(notifs[0].id, true);
      expect(updated.isRead).toBe(true);
      expect(updated.readAt).toBeDefined();

      // Mark all read
      const markAllResult = notificationsService.markAllAsRead(techWorkspaceId, anantProfileId);
      expect(markAllResult.updatedCount).toBeGreaterThanOrEqual(0);

      const remainingUnread = notificationsService.getUnreadCount(techWorkspaceId, anantProfileId);
      expect(remainingUnread.count).toBe(0);
    });
  });

  // =========================================================================
  // 4. ACTIVITY & AUDIT TIMELINE (SECURITY & REDACTION)
  // =========================================================================
  describe('4. Activity & Audit Security Logging', () => {
    it('appends audit event and redacts sensitive credentials/tokens from payloads', () => {
      const auditResult = notificationsService.emitEvent({
        workspaceId: techWorkspaceId,
        actorId: anantProfileId,
        actorName: 'Anant',
        entityType: AuditEntityType.SETTINGS,
        entityId: 'ws-settings-01',
        entityTitle: 'Workspace Settings',
        action: AuditAction.UPDATED,
        previousValues: {
          apiSecret: 'super-secret-key-12345',
          passwordHash: '$2b$10$hashed_password_sample',
          publicCurrency: 'INR',
        },
        newValues: {
          apiSecret: 'new-secret-key-99999',
          presignedUrl: 'https://r2.cloudflarestorage.com/bucket/key?X-Amz-Signature=xyz123',
          publicCurrency: 'INR',
        },
        changeSummary: 'Updated API integration credentials and currency settings.',
      });

      const event = notificationsService.getAuditEventById(auditResult.eventId);
      expect(event).toBeDefined();

      // Verify redaction
      const prev = event.previousValues as Record<string, string>;
      const next = event.newValues as Record<string, string>;

      expect(prev.apiSecret).toBe('[REDACTED]');
      expect(prev.passwordHash).toBe('[REDACTED]');
      expect(prev.publicCurrency).toBe('INR');

      expect(next.apiSecret).toBe('[REDACTED]');
      expect(next.presignedUrl).toBe('[REDACTED]');
      expect(next.publicCurrency).toBe('INR');
    });

    it('enforces workspace boundary on audit event queries', () => {
      const techEvents = notificationsService.getAuditEvents({
        workspaceId: techWorkspaceId,
      });
      expect(techEvents.every((e) => e.workspaceId === techWorkspaceId)).toBe(true);

      const realEstateEvents = notificationsService.getAuditEvents({
        workspaceId: realEstateWorkspaceId,
      });
      expect(realEstateEvents.every((e) => e.workspaceId === realEstateWorkspaceId)).toBe(true);

      // Verify no overlap
      const techEventIds = new Set(techEvents.map((e) => e.id));
      for (const reEvent of realEstateEvents) {
        expect(techEventIds.has(reEvent.id)).toBe(false);
      }
    });
  });

  // =========================================================================
  // 5. POSTGRESQL PERSISTENCE & ROLLBACK SAFETY
  // =========================================================================
  describe('5. Database Atomic Rollback & State Preservation', () => {
    const testAssetId = 'ast-phase7-rollback-01';

    afterAll(async () => {
      await prisma.asset.deleteMany({ where: { id: testAssetId } });
    });

    it('rolls back asset creation atomically on transaction failure', async () => {
      const failTx = async () => {
        await prisma.$transaction(async (tx) => {
          await tx.asset.create({
            data: {
              id: testAssetId,
              workspaceId: techWorkspaceId,
              title: 'Temporary Rollback Test Asset',
              originalFileName: 'rollback.png',
              storageKey: `workspaces/${techWorkspaceId}/assets/rollback.png`,
              storageProvider: 'r2',
              mimeType: 'image/png',
              sizeBytes: 5000,
              category: 'IMAGES',
              typeGroup: 'IMAGE',
              uploaderId: anantProfileId,
              uploaderName: 'Anant',
            },
          });
          // Intentionally abort
          throw new Error('Forced atomic rollback in Phase 7 test');
        });
      };

      await expect(failTx()).rejects.toThrow('Forced atomic rollback in Phase 7 test');

      const assetInDb = await prisma.asset.findUnique({
        where: { id: testAssetId },
      });
      expect(assetInDb).toBeNull();
    });
  });
});
