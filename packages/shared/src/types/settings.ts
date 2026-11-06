import { TaskPriority } from '../enums';

export type SupportedDateFormat = 'DD/MM/YYYY' | 'YYYY-MM-DD' | 'MM/DD/YYYY';
export type SupportedTimeFormat = '12h' | '24h';
export type SupportedWeekStart = 'MONDAY' | 'SUNDAY';
export type SupportedCalendarView = 'MONTH' | 'WEEK' | 'DAY' | 'AGENDA';
export type SupportedTheme = 'light' | 'dark' | 'system';

export interface PersonalNotificationPreferences {
  taskAssignments: boolean;
  deadlineReminders: boolean;
  overdueAlerts: boolean;
  campaignMilestones: boolean;
  meetingReminders: boolean;
  inAppChannel: boolean;
  pushChannel: boolean; // Visibly marked as simulated/configured
  emailChannel: boolean; // Visibly marked as simulated/configured
}

export interface PersonalSettings {
  profileId: string;
  displayName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  initials: string;
  bio?: string;
  role: string;
  timezone: string; // e.g., 'Asia/Kolkata'
  dateFormat: SupportedDateFormat;
  timeFormat: SupportedTimeFormat;
  weekStartDay: SupportedWeekStart;
  defaultCalendarView: SupportedCalendarView;
  theme: SupportedTheme;
  notifications: PersonalNotificationPreferences;
}

export interface SecuritySessionInfo {
  id: string;
  deviceType: 'DESKTOP' | 'MOBILE' | 'TABLET';
  browser: string;
  os: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface AccountSecuritySummary {
  profileId: string;
  authProvider: string;
  mfaConfigured: boolean;
  lastPasswordChangeDate?: string;
  activeSessions: SecuritySessionInfo[];
  securityNotices: string[];
  identityNotice: string;
}

export interface WorkspaceTaskDefaults {
  defaultPriority: TaskPriority;
  defaultDueDays: number;
  workingDays: string[]; // ['MON', 'TUE', 'WED', 'THU', 'FRI']
  workingHoursStart: string; // '09:00'
  workingHoursEnd: string; // '18:00'
  autoOverdueEscalation: boolean;
}

export interface WorkspaceCampaignDefaults {
  allowedPlatforms: string[];
  allowedAssetCategories: string[];
  requireScriptApproval: boolean;
  autoCreateStageTasks: boolean;
}

export interface WorkspaceCrmConfig {
  workspaceType: 'TECH' | 'REAL_ESTATE';
  techEnquirySources?: string[];
  techServiceCategories?: string[];
  partnerTypes?: string[];
  buyerPropertyConfigs?: string[];
  buyerLeadSources?: string[];
}

export interface WorkspaceStorageConfig {
  usedBytes: number;
  maxBytes: number;
  maxUploadFileBytes: number;
  allowedExtensions: string[];
  versioningPolicy: string;
  retentionPolicy: string;
  storageProvider: string;
}

export interface WorkspaceNotificationDefaults {
  dailyMorningDigest: boolean;
  digestTime: string; // '09:00'
  weeklyReport: boolean;
  overdueEscalationHours: number;
}

export interface WorkspaceOperationalStatus {
  status: 'OPERATIONAL' | 'DEGRADED' | 'MAINTENANCE';
  lastBackupAt: string;
  backupCadence: string;
  databaseEngine: string;
  storageEngine: string;
  uptimePercentage: number;
  totalAuditEvents: number;
  lastConfigChangeAt?: string;
  lastConfigChangeBy?: string;
}

export interface WorkspaceSettings {
  workspaceId: string;
  displayName: string;
  businessType: 'TECHNOLOGY' | 'REAL_ESTATE';
  currency: 'INR' | 'USD' | 'EUR';
  timezone: string;
  taskDefaults: WorkspaceTaskDefaults;
  campaignDefaults: WorkspaceCampaignDefaults;
  crmConfig: WorkspaceCrmConfig;
  storageConfig: WorkspaceStorageConfig;
  notifications: WorkspaceNotificationDefaults;
  operationalStatus: WorkspaceOperationalStatus;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdatePersonalSettingsDto {
  displayName?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  initials?: string;
  bio?: string;
  role?: string;
  timezone?: string;
  dateFormat?: SupportedDateFormat;
  timeFormat?: SupportedTimeFormat;
  weekStartDay?: SupportedWeekStart;
  defaultCalendarView?: SupportedCalendarView;
  theme?: SupportedTheme;
  notifications?: Partial<PersonalNotificationPreferences>;
}

export interface UpdateWorkspaceSettingsDto {
  displayName?: string;
  currency?: 'INR' | 'USD' | 'EUR';
  timezone?: string;
  taskDefaults?: Partial<WorkspaceTaskDefaults>;
  campaignDefaults?: Partial<WorkspaceCampaignDefaults>;
  crmConfig?: Partial<WorkspaceCrmConfig>;
  notifications?: Partial<WorkspaceNotificationDefaults>;
}

