import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { WorkspacesModule } from '../workspaces/workspaces.module';
import { TaskPriority } from '@corviin-hub/shared';

describe('SettingsController', () => {
  let controller: SettingsController;
  let service: SettingsService;

  const TECH_WS = 'ws-tech-0001-0000-000000000001';
  const REAL_WS = 'ws-real-0002-0000-000000000002';
  const ANANT_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [WorkspacesModule],
      controllers: [SettingsController],
      providers: [SettingsService],
    }).compile();

    controller = module.get<SettingsController>(SettingsController);
    service = module.get<SettingsService>(SettingsService);
  });

  describe('Personal Settings', () => {
    it('returns personal settings for a known profile', () => {
      const res = controller.getPersonalSettings(ANANT_ID);
      expect(res).toBeDefined();
      expect(res.profileId).toBe(ANANT_ID);
      expect(res.displayName).toBe('Anant');
      expect(res.timezone).toBe('Asia/Kolkata');
      expect(res.dateFormat).toBe('DD/MM/YYYY');
      expect(res.theme).toBe('light');
    });

    it('updates personal preferences without modifying actor identity', () => {
      const updated = controller.updatePersonalSettings(
        {
          timezone: 'America/New_York',
          dateFormat: 'YYYY-MM-DD',
          timeFormat: '24h',
          weekStartDay: 'SUNDAY',
          theme: 'dark',
          notifications: {
            deadlineReminders: false,
          },
        },
        ANANT_ID,
      );

      expect(updated.timezone).toBe('America/New_York');
      expect(updated.dateFormat).toBe('YYYY-MM-DD');
      expect(updated.timeFormat).toBe('24h');
      expect(updated.weekStartDay).toBe('SUNDAY');
      expect(updated.theme).toBe('dark');
      expect(updated.notifications.deadlineReminders).toBe(false);
      // Profile ID remains stable
      expect(updated.profileId).toBe(ANANT_ID);
    });

    it('rejects unsupported date format with BadRequestException', () => {
      expect(() => {
        controller.updatePersonalSettings(
          { dateFormat: 'INVALID_FORMAT' as any },
          ANANT_ID,
        );
      }).toThrow(BadRequestException);
    });

    it('rejects unsupported theme with BadRequestException', () => {
      expect(() => {
        controller.updatePersonalSettings(
          { theme: 'neon-glow' as any },
          ANANT_ID,
        );
      }).toThrow(BadRequestException);
    });

    it('returns account security summary with operational notice and active sessions', () => {
      const sec = controller.getAccountSecurity(ANANT_ID);
      expect(sec).toBeDefined();
      expect(sec.profileId).toBe(ANANT_ID);
      expect(sec.activeSessions.length).toBeGreaterThanOrEqual(1);
      expect(sec.activeSessions[0].isCurrent).toBe(true);
      expect(sec.securityNotices.length).toBeGreaterThan(0);
      expect(sec.identityNotice).toContain('Acting profile switcher is strictly');
    });
  });

  describe('Workspace Settings & Scope Isolation', () => {
    it('returns workspace settings strictly scoped to Corviin Tech', () => {
      const res = controller.getWorkspaceSettings(TECH_WS);
      expect(res).toBeDefined();
      expect(res.workspaceId).toBe(TECH_WS);
      expect(res.businessType).toBe('TECHNOLOGY');
      expect(res.crmConfig.workspaceType).toBe('TECH');
      expect(res.crmConfig.techServiceCategories?.length).toBeGreaterThan(0);
      expect(res.storageConfig.usedBytes).toBeGreaterThan(0);
    });

    it('returns workspace settings strictly scoped to Corviin Real Estate', () => {
      const res = controller.getWorkspaceSettings(REAL_WS);
      expect(res).toBeDefined();
      expect(res.workspaceId).toBe(REAL_WS);
      expect(res.businessType).toBe('REAL_ESTATE');
      expect(res.crmConfig.workspaceType).toBe('REAL_ESTATE');
      expect(res.crmConfig.partnerTypes?.length).toBeGreaterThan(0);
      expect(res.crmConfig.buyerPropertyConfigs?.length).toBeGreaterThan(0);
    });

    it('updates workspace settings and verifies one workspace does not affect another', () => {
      // 1. Update Corviin Tech
      const techUpdate = controller.updateWorkspaceSettings(
        TECH_WS,
        {
          taskDefaults: {
            defaultPriority: TaskPriority.URGENT,
            defaultDueDays: 5,
            workingDays: ['MON', 'TUE', 'WED', 'THU'],
          },
          currency: 'USD',
        },
        ANANT_ID,
      );

      expect(techUpdate.taskDefaults.defaultPriority).toBe(TaskPriority.URGENT);
      expect(techUpdate.taskDefaults.defaultDueDays).toBe(5);
      expect(techUpdate.currency).toBe('USD');

      // 2. Read Corviin Real Estate to confirm complete isolation
      const realEstateSettings = controller.getWorkspaceSettings(REAL_WS);
      expect(realEstateSettings.currency).toBe('INR'); // Untouched
      expect(realEstateSettings.taskDefaults.defaultPriority).toBe(TaskPriority.MEDIUM); // Untouched
      expect(realEstateSettings.taskDefaults.defaultDueDays).toBe(2); // Untouched
    });

    it('rejects empty workspace display name with BadRequestException', () => {
      expect(() => {
        controller.updateWorkspaceSettings(
          TECH_WS,
          { displayName: '   ' },
          ANANT_ID,
        );
      }).toThrow(BadRequestException);
    });

    it('rejects negative due days with BadRequestException', () => {
      expect(() => {
        controller.updateWorkspaceSettings(
          TECH_WS,
          { taskDefaults: { defaultDueDays: -1 } },
          ANANT_ID,
        );
      }).toThrow(BadRequestException);
    });

    it('throws NotFoundException for non-existent workspace ID', () => {
      expect(() => {
        controller.getWorkspaceSettings('ws-unknown-9999');
      }).toThrow(NotFoundException);
    });

    it('evaluates consequential impact of removing CRM category or source', () => {
      const activeImpact = controller.checkImpact(
        TECH_WS,
        'CRM_CATEGORY',
        'Custom Software Development',
      );
      expect(activeImpact.safeToRemove).toBe(false);
      expect(activeImpact.affectedCount).toBe(4);
      expect(activeImpact.message).toContain('active records currently depend');

      const safeImpact = controller.checkImpact(
        TECH_WS,
        'CRM_CATEGORY',
        'Unused Obsolete Category',
      );
      expect(safeImpact.safeToRemove).toBe(true);
      expect(safeImpact.affectedCount).toBe(0);
    });

    it('resets workspace settings to pristine defaults', () => {
      const reset = controller.resetWorkspaceDefaults(TECH_WS, ANANT_ID);
      expect(reset.currency).toBe('INR');
      expect(reset.taskDefaults.defaultPriority).toBe(TaskPriority.MEDIUM);
    });
  });
});

