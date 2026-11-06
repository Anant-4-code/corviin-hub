import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  PersonalSettings,
  UpdatePersonalSettingsDto,
  AccountSecuritySummary,
  WorkspaceSettings,
  UpdateWorkspaceSettingsDto,
  TaskPriority,
} from '@corviin-hub/shared';
import { WorkspacesService } from '../workspaces/workspaces.service';

@Injectable()
export class SettingsService {
  constructor(private readonly workspacesService: WorkspacesService) {}

  // Deterministic Personal Settings repository
  private personalSettingsMap: Map<string, PersonalSettings> = new Map([
    [
      'a1b2c3d4-e5f6-7890-abcd-ef1234567890', // Anant
      {
        profileId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        displayName: 'Anant',
        email: 'anant@corviin.tech',
        phone: '+91-98450-11111',
        initials: 'A',
        bio: 'Technical lead driving full-stack monorepo architecture, design systems, and API governance.',
        role: 'Full Stack & Tech Lead',
        timezone: 'Asia/Kolkata',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '12h',
        weekStartDay: 'MONDAY',
        defaultCalendarView: 'WEEK',
        theme: 'light',
        notifications: {
          taskAssignments: true,
          deadlineReminders: true,
          overdueAlerts: true,
          campaignMilestones: true,
          meetingReminders: true,
          inAppChannel: true,
          pushChannel: false,
          emailChannel: true,
        },
      },
    ],
    [
      'b2c3d4e5-f6a7-8901-bcde-f12345678901', // Rohit
      {
        profileId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
        displayName: 'Rohit',
        email: 'rohit@corviin.realestate',
        phone: '+91-98765-43210',
        initials: 'R',
        bio: 'Leading developer relationships, RERA alignment, commercial inventory mandates, and brand partnerships.',
        role: 'Partner Relations & Real Estate Lead',
        timezone: 'Asia/Kolkata',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '12h',
        weekStartDay: 'MONDAY',
        defaultCalendarView: 'AGENDA',
        theme: 'light',
        notifications: {
          taskAssignments: true,
          deadlineReminders: true,
          overdueAlerts: true,
          campaignMilestones: false,
          meetingReminders: true,
          inAppChannel: true,
          pushChannel: false,
          emailChannel: true,
        },
      },
    ],
    [
      'c3d4e5f6-a7b8-9012-cdef-123456789012', // Utkarsh
      {
        profileId: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
        displayName: 'Utkarsh',
        email: 'utkarsh@corviin.growth',
        phone: '+91-98801-23456',
        initials: 'U',
        bio: 'Focusing on buyer pipeline velocity, CRM lead qualification, campaigns, and site visit conversions.',
        role: 'Buyer Relations & Growth Lead',
        timezone: 'Asia/Kolkata',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '12h',
        weekStartDay: 'MONDAY',
        defaultCalendarView: 'MONTH',
        theme: 'dark',
        notifications: {
          taskAssignments: true,
          deadlineReminders: true,
          overdueAlerts: true,
          campaignMilestones: true,
          meetingReminders: true,
          inAppChannel: true,
          pushChannel: false,
          emailChannel: true,
        },
      },
    ],
  ]);

  // Deterministic Workspace Settings repository
  private workspaceSettingsMap: Map<string, WorkspaceSettings> = new Map([
    [
      'ws-tech-0001-0000-000000000001', // Corviin Tech
      {
        workspaceId: 'ws-tech-0001-0000-000000000001',
        displayName: 'Corviin Tech',
        businessType: 'TECHNOLOGY',
        currency: 'INR',
        timezone: 'Asia/Kolkata',
        taskDefaults: {
          defaultPriority: TaskPriority.MEDIUM,
          defaultDueDays: 3,
          workingDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
          workingHoursStart: '09:00',
          workingHoursEnd: '18:00',
          autoOverdueEscalation: true,
        },
        campaignDefaults: {
          allowedPlatforms: ['YOUTUBE', 'LINKEDIN', 'TWITTER_X', 'INSTAGRAM'],
          allowedAssetCategories: [
            'REFERENCES',
            'SCRIPTS',
            'RAW_FOOTAGE',
            'IMAGES',
            'AUDIO_VO',
            'DRAFT_EDITS',
            'FINAL_APPROVED',
            'PUBLISHED_PROOF',
          ],
          requireScriptApproval: true,
          autoCreateStageTasks: true,
        },
        crmConfig: {
          workspaceType: 'TECH',
          techEnquirySources: [
            'Website Inbound',
            'Referral',
            'LinkedIn Outreach',
            'Direct Call',
            'Partner Network',
            'Technical Conference',
          ],
          techServiceCategories: [
            'Custom Software Development',
            'Web Platform & SaaS',
            'Automation & AI Engineering',
            'Cloud Architecture & DevOps',
            'Technical Architecture Advisory',
          ],
        },
        storageConfig: {
          usedBytes: 2576980377, // ~2.4 GB
          maxBytes: 10737418240, // 10 GB
          maxUploadFileBytes: 52428800, // 50 MB
          allowedExtensions: ['pdf', 'docx', 'png', 'jpg', 'jpeg', 'mp4', 'mov', 'zip'],
          versioningPolicy: 'Strict SHA-256 deduplication with immutable history',
          retentionPolicy: 'Indefinite operational retention; soft-deletion archive',
          storageProvider: 'Cloudflare R2 / AWS S3 Compatible Object Store',
        },
        notifications: {
          dailyMorningDigest: true,
          digestTime: '09:00',
          weeklyReport: true,
          overdueEscalationHours: 24,
        },
        operationalStatus: {
          status: 'OPERATIONAL',
          lastBackupAt: '2026-11-05T02:00:00.000Z',
          backupCadence: 'Daily automated snapshot at 02:00 UTC with point-in-time recovery',
          databaseEngine: 'PostgreSQL 16 (Relational & Audit Store)',
          storageEngine: 'Cloudflare R2 Object Storage',
          uptimePercentage: 99.98,
          totalAuditEvents: 142,
          lastConfigChangeAt: '2026-11-01T10:00:00.000Z',
          lastConfigChangeBy: 'Anant',
        },
        memberCount: 3,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-11-01T10:00:00.000Z',
      },
    ],
    [
      'ws-real-0002-0000-000000000002', // Corviin Real Estate
      {
        workspaceId: 'ws-real-0002-0000-000000000002',
        displayName: 'Corviin Real Estate',
        businessType: 'REAL_ESTATE',
        currency: 'INR',
        timezone: 'Asia/Kolkata',
        taskDefaults: {
          defaultPriority: TaskPriority.MEDIUM,
          defaultDueDays: 2,
          workingDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
          workingHoursStart: '09:30',
          workingHoursEnd: '18:30',
          autoOverdueEscalation: true,
        },
        campaignDefaults: {
          allowedPlatforms: ['INSTAGRAM', 'YOUTUBE', 'LINKEDIN', 'FACEBOOK'],
          allowedAssetCategories: [
            'REFERENCES',
            'SCRIPTS',
            'RAW_FOOTAGE',
            'IMAGES',
            'AUDIO_VO',
            'DRAFT_EDITS',
            'FINAL_APPROVED',
            'PUBLISHED_PROOF',
          ],
          requireScriptApproval: false,
          autoCreateStageTasks: true,
        },
        crmConfig: {
          workspaceType: 'REAL_ESTATE',
          partnerTypes: [
            'Developer',
            'Builder',
            'Construction Company',
            'Landowner',
            'Channel Partner',
            'Broker / Agent',
            'Other Partner',
          ],
          buyerPropertyConfigs: [
            '1 BHK',
            '2 BHK',
            '3 BHK',
            '4+ BHK',
            'Villa',
            'Plot',
            'Commercial',
            'Other',
          ],
          buyerLeadSources: [
            'Website Portal',
            'Walk-in Inquiry',
            'Channel Partner Referral',
            'Direct Calling',
            'Social Media Campaign',
            'Property Exhibition',
            'Other',
          ],
        },
        storageConfig: {
          usedBytes: 6228514816, // ~5.8 GB
          maxBytes: 10737418240, // 10 GB
          maxUploadFileBytes: 104857600, // 100 MB
          allowedExtensions: ['pdf', 'docx', 'png', 'jpg', 'jpeg', 'mp4', 'mov', 'zip'],
          versioningPolicy: 'Strict SHA-256 deduplication with immutable history',
          retentionPolicy: 'Indefinite operational retention; RERA compliance hold',
          storageProvider: 'Cloudflare R2 / AWS S3 Compatible Object Store',
        },
        notifications: {
          dailyMorningDigest: true,
          digestTime: '09:30',
          weeklyReport: true,
          overdueEscalationHours: 12,
        },
        operationalStatus: {
          status: 'OPERATIONAL',
          lastBackupAt: '2026-11-05T02:30:00.000Z',
          backupCadence: 'Daily automated snapshot at 02:30 UTC with point-in-time recovery',
          databaseEngine: 'PostgreSQL 16 (Relational & Audit Store)',
          storageEngine: 'Cloudflare R2 Object Storage',
          uptimePercentage: 99.95,
          totalAuditEvents: 287,
          lastConfigChangeAt: '2026-11-02T11:00:00.000Z',
          lastConfigChangeBy: 'Rohit',
        },
        memberCount: 3,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-11-02T11:00:00.000Z',
      },
    ],
  ]);

  /**
   * Fetch personal settings for profile
   */
  getPersonalSettings(profileId: string): PersonalSettings {
    const existing = this.personalSettingsMap.get(profileId);
    if (existing) {
      return existing;
    }

    // Dynamic fallback for any newly added team member
    const fallback: PersonalSettings = {
      profileId,
      displayName: 'Team Member',
      email: 'member@corviin.hub',
      phone: '',
      initials: 'TM',
      role: 'Member',
      timezone: 'Asia/Kolkata',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '12h',
      weekStartDay: 'MONDAY',
      defaultCalendarView: 'WEEK',
      theme: 'light',
      notifications: {
        taskAssignments: true,
        deadlineReminders: true,
        overdueAlerts: true,
        campaignMilestones: true,
        meetingReminders: true,
        inAppChannel: true,
        pushChannel: false,
        emailChannel: true,
      },
    };
    this.personalSettingsMap.set(profileId, fallback);
    return fallback;
  }

  /**
   * Update personal preferences
   */
  updatePersonalSettings(
    profileId: string,
    dto: UpdatePersonalSettingsDto,
  ): PersonalSettings {
    const current = this.getPersonalSettings(profileId);

    // Validation
    if (dto.dateFormat && !['DD/MM/YYYY', 'YYYY-MM-DD', 'MM/DD/YYYY'].includes(dto.dateFormat)) {
      throw new BadRequestException(`Unsupported date format: ${dto.dateFormat}`);
    }
    if (dto.timeFormat && !['12h', '24h'].includes(dto.timeFormat)) {
      throw new BadRequestException(`Unsupported time format: ${dto.timeFormat}`);
    }
    if (dto.theme && !['light', 'dark', 'system'].includes(dto.theme)) {
      throw new BadRequestException(`Unsupported theme: ${dto.theme}`);
    }
    if (dto.weekStartDay && !['MONDAY', 'SUNDAY'].includes(dto.weekStartDay)) {
      throw new BadRequestException(`Unsupported week start day: ${dto.weekStartDay}`);
    }

    const updated: PersonalSettings = {
      ...current,
      ...(dto.displayName ? { displayName: dto.displayName.trim() } : {}),
      ...(dto.email !== undefined ? { email: dto.email.trim() } : {}),
      ...(dto.phone !== undefined ? { phone: dto.phone.trim() } : {}),
      ...(dto.avatarUrl !== undefined ? { avatarUrl: dto.avatarUrl } : {}),
      ...(dto.initials !== undefined ? { initials: dto.initials.toUpperCase() } : {}),
      ...(dto.bio !== undefined ? { bio: dto.bio } : {}),
      ...(dto.role !== undefined ? { role: dto.role } : {}),
      ...(dto.timezone ? { timezone: dto.timezone } : {}),
      ...(dto.dateFormat ? { dateFormat: dto.dateFormat } : {}),
      ...(dto.timeFormat ? { timeFormat: dto.timeFormat } : {}),
      ...(dto.weekStartDay ? { weekStartDay: dto.weekStartDay } : {}),
      ...(dto.defaultCalendarView ? { defaultCalendarView: dto.defaultCalendarView } : {}),
      ...(dto.theme ? { theme: dto.theme } : {}),
      notifications: {
        ...current.notifications,
        ...(dto.notifications || {}),
      },
    };

    this.personalSettingsMap.set(profileId, updated);
    return updated;
  }

  /**
   * Get account and security overview
   */
  getAccountSecurity(profileId: string): AccountSecuritySummary {
    return {
      profileId,
      authProvider: 'Local Operational Session (Dev / Phase 3)',
      mfaConfigured: false,
      lastPasswordChangeDate: '2026-01-01T00:00:00.000Z',
      activeSessions: [
        {
          id: 'sess-current-01',
          deviceType: 'DESKTOP',
          browser: 'Chrome 131.0 / Desktop',
          os: 'Windows 11 x64',
          ipAddress: '127.0.0.1 (Localhost / Intranet)',
          location: 'Bengaluru, India',
          lastActive: new Date().toISOString(),
          isCurrent: true,
        },
      ],
      securityNotices: [
        'Security & authentication are planned for Phase 4/5 integration with PostgreSQL persistence and OAuth/OIDC.',
        'Profile switching in the TopBar provides an operational acting perspective and is not an authentication or identity boundary.',
        'Passwords, security tokens, and encryption secrets are never exposed over client APIs.',
      ],
      identityNotice:
        'Acting profile switcher is strictly for pair-programming and multi-member simulation. It does not verify identity.',
    };
  }

  /**
   * Get workspace settings
   */
  getWorkspaceSettings(workspaceId: string): WorkspaceSettings {
    const settings = this.workspaceSettingsMap.get(workspaceId);
    if (!settings) {
      throw new NotFoundException(`Workspace configuration not found for workspace ID: ${workspaceId}`);
    }
    return settings;
  }

  /**
   * Update workspace settings with consequential effect validation
   */
  updateWorkspaceSettings(
    workspaceId: string,
    actorId: string,
    dto: UpdateWorkspaceSettingsDto,
  ): WorkspaceSettings {
    const current = this.getWorkspaceSettings(workspaceId);

    // Consequential validation: do not allow empty names or negative values
    if (dto.displayName !== undefined && !dto.displayName.trim()) {
      throw new BadRequestException('Workspace display name cannot be empty.');
    }
    if (dto.taskDefaults?.defaultDueDays !== undefined && dto.taskDefaults.defaultDueDays < 0) {
      throw new BadRequestException('Default due days cannot be negative.');
    }
    if (dto.taskDefaults?.workingDays && dto.taskDefaults.workingDays.length === 0) {
      throw new BadRequestException('Workspace must have at least one working day configured.');
    }

    const updated: WorkspaceSettings = {
      ...current,
      ...(dto.displayName ? { displayName: dto.displayName.trim() } : {}),
      ...(dto.currency ? { currency: dto.currency } : {}),
      ...(dto.timezone ? { timezone: dto.timezone } : {}),
      taskDefaults: {
        ...current.taskDefaults,
        ...(dto.taskDefaults || {}),
      },
      campaignDefaults: {
        ...current.campaignDefaults,
        ...(dto.campaignDefaults || {}),
      },
      crmConfig: {
        ...current.crmConfig,
        ...(dto.crmConfig || {}),
      },
      notifications: {
        ...current.notifications,
        ...(dto.notifications || {}),
      },
      operationalStatus: {
        ...current.operationalStatus,
        lastConfigChangeAt: new Date().toISOString(),
        lastConfigChangeBy: actorId,
      },
      updatedAt: new Date().toISOString(),
    };

    this.workspaceSettingsMap.set(workspaceId, updated);
    return updated;
  }

  /**
   * Check consequential impact before destructive configuration changes
   */
  checkImpact(
    workspaceId: string,
    changeType: 'CRM_STAGE' | 'CRM_CATEGORY' | 'CRM_SOURCE' | 'PARTNER_TYPE',
    value: string,
  ): { affectedCount: number; message: string; safeToRemove: boolean } {
    this.getWorkspaceSettings(workspaceId);

    // Simulated check against domain records
    const simulatedImpacts: Record<string, number> = {
      'Custom Software Development': 4,
      'Website Inbound': 8,
      Developer: 6,
      '1 BHK': 5,
    };

    const count = simulatedImpacts[value] || 0;
    if (count > 0) {
      return {
        affectedCount: count,
        message: `Warning: ${count} active records currently depend on "${value}". Removing this option will leave existing records orphaned unless remapped.`,
        safeToRemove: false,
      };
    }

    return {
      affectedCount: 0,
      message: `Safe to modify: No active records currently depend on "${value}".`,
      safeToRemove: true,
    };
  }

  /**
   * Reset workspace configuration to defaults
   */
  resetWorkspaceDefaults(workspaceId: string, actorId: string): WorkspaceSettings {
    const isTech = workspaceId.includes('tech');
    const defaultSettings: WorkspaceSettings = isTech
      ? {
          workspaceId,
          displayName: 'Corviin Tech',
          businessType: 'TECHNOLOGY',
          currency: 'INR',
          timezone: 'Asia/Kolkata',
          taskDefaults: {
            defaultPriority: TaskPriority.MEDIUM,
            defaultDueDays: 3,
            workingDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
            workingHoursStart: '09:00',
            workingHoursEnd: '18:00',
            autoOverdueEscalation: true,
          },
          campaignDefaults: {
            allowedPlatforms: ['YOUTUBE', 'LINKEDIN', 'TWITTER_X', 'INSTAGRAM'],
            allowedAssetCategories: [
              'REFERENCES',
              'SCRIPTS',
              'RAW_FOOTAGE',
              'IMAGES',
              'AUDIO_VO',
              'DRAFT_EDITS',
              'FINAL_APPROVED',
              'PUBLISHED_PROOF',
            ],
            requireScriptApproval: true,
            autoCreateStageTasks: true,
          },
          crmConfig: {
            workspaceType: 'TECH',
            techEnquirySources: [
              'Website Inbound',
              'Referral',
              'LinkedIn Outreach',
              'Direct Call',
              'Partner Network',
              'Technical Conference',
            ],
            techServiceCategories: [
              'Custom Software Development',
              'Web Platform & SaaS',
              'Automation & AI Engineering',
              'Cloud Architecture & DevOps',
              'Technical Architecture Advisory',
            ],
          },
          storageConfig: {
            usedBytes: 2576980377,
            maxBytes: 10737418240,
            maxUploadFileBytes: 52428800,
            allowedExtensions: ['pdf', 'docx', 'png', 'jpg', 'jpeg', 'mp4', 'mov', 'zip'],
            versioningPolicy: 'Strict SHA-256 deduplication with immutable history',
            retentionPolicy: 'Indefinite operational retention; soft-deletion archive',
            storageProvider: 'Cloudflare R2 / AWS S3 Compatible Object Store',
          },
          notifications: {
            dailyMorningDigest: true,
            digestTime: '09:00',
            weeklyReport: true,
            overdueEscalationHours: 24,
          },
          operationalStatus: {
            status: 'OPERATIONAL',
            lastBackupAt: '2026-11-05T02:00:00.000Z',
            backupCadence: 'Daily automated snapshot at 02:00 UTC with point-in-time recovery',
            databaseEngine: 'PostgreSQL 16 (Relational & Audit Store)',
            storageEngine: 'Cloudflare R2 Object Storage',
            uptimePercentage: 99.98,
            totalAuditEvents: 142,
            lastConfigChangeAt: new Date().toISOString(),
            lastConfigChangeBy: actorId,
          },
          memberCount: 3,
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: new Date().toISOString(),
        }
      : {
          workspaceId,
          displayName: 'Corviin Real Estate',
          businessType: 'REAL_ESTATE',
          currency: 'INR',
          timezone: 'Asia/Kolkata',
          taskDefaults: {
            defaultPriority: TaskPriority.MEDIUM,
            defaultDueDays: 2,
            workingDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
            workingHoursStart: '09:30',
            workingHoursEnd: '18:30',
            autoOverdueEscalation: true,
          },
          campaignDefaults: {
            allowedPlatforms: ['INSTAGRAM', 'YOUTUBE', 'LINKEDIN', 'FACEBOOK'],
            allowedAssetCategories: [
              'REFERENCES',
              'SCRIPTS',
              'RAW_FOOTAGE',
              'IMAGES',
              'AUDIO_VO',
              'DRAFT_EDITS',
              'FINAL_APPROVED',
              'PUBLISHED_PROOF',
            ],
            requireScriptApproval: false,
            autoCreateStageTasks: true,
          },
          crmConfig: {
            workspaceType: 'REAL_ESTATE',
            partnerTypes: [
              'Developer',
              'Builder',
              'Construction Company',
              'Landowner',
              'Channel Partner',
              'Broker / Agent',
              'Other Partner',
            ],
            buyerPropertyConfigs: [
              '1 BHK',
              '2 BHK',
              '3 BHK',
              '4+ BHK',
              'Villa',
              'Plot',
              'Commercial',
              'Other',
            ],
            buyerLeadSources: [
              'Website Portal',
              'Walk-in Inquiry',
              'Channel Partner Referral',
              'Direct Calling',
              'Social Media Campaign',
              'Property Exhibition',
              'Other',
            ],
          },
          storageConfig: {
            usedBytes: 6228514816,
            maxBytes: 10737418240,
            maxUploadFileBytes: 104857600,
            allowedExtensions: ['pdf', 'docx', 'png', 'jpg', 'jpeg', 'mp4', 'mov', 'zip'],
            versioningPolicy: 'Strict SHA-256 deduplication with immutable history',
            retentionPolicy: 'Indefinite operational retention; RERA compliance hold',
            storageProvider: 'Cloudflare R2 / AWS S3 Compatible Object Store',
          },
          notifications: {
            dailyMorningDigest: true,
            digestTime: '09:30',
            weeklyReport: true,
            overdueEscalationHours: 12,
          },
          operationalStatus: {
            status: 'OPERATIONAL',
            lastBackupAt: '2026-11-05T02:30:00.000Z',
            backupCadence: 'Daily automated snapshot at 02:30 UTC with point-in-time recovery',
            databaseEngine: 'PostgreSQL 16 (Relational & Audit Store)',
            storageEngine: 'Cloudflare R2 Object Storage',
            uptimePercentage: 99.95,
            totalAuditEvents: 287,
            lastConfigChangeAt: new Date().toISOString(),
            lastConfigChangeBy: actorId,
          },
          memberCount: 3,
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: new Date().toISOString(),
        };

    this.workspaceSettingsMap.set(workspaceId, defaultSettings);
    return defaultSettings;
  }
}

