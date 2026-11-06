import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SettingsPage } from '@/features/settings/SettingsPage';
import {
  SettingsScopeNavigation,
  PersonalProfileSection,
  AppearanceSection,
  RegionalAndCalendarSection,
  PersonalNotificationsSection,
  AccountSecuritySection,
  WorkspaceGeneralSection,
  WorkspaceTaskDefaultsSection,
  WorkspaceCampaignsSection,
  WorkspaceCrmSection,
  WorkspaceStorageSection,
  WorkspaceAccessBackupSection,
} from '@/features/settings/components';
import * as settingsApi from '@/services/settings';
import { useAppStore } from '@/lib/store';
import { ThemeProvider } from '@/app/providers/ThemeProvider';
import { TaskPriority } from '@corviin-hub/shared';
import type {
  PersonalSettings,
  WorkspaceSettings,
  AccountSecuritySummary,
} from '@corviin-hub/shared';

const mockPersonalSettings: PersonalSettings = {
  profileId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  displayName: 'Anant',
  email: 'anant@corviin.tech',
  phone: '+91-98450-11111',
  initials: 'A',
  bio: 'Full Stack Tech Lead',
  role: 'Tech Lead',
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

const mockSecuritySummary: AccountSecuritySummary = {
  profileId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  authProvider: 'Local Operational Session (Dev / Phase 3)',
  mfaConfigured: false,
  activeSessions: [
    {
      id: 'sess-01',
      deviceType: 'DESKTOP',
      browser: 'Chrome 131.0',
      os: 'Windows 11 x64',
      ipAddress: '127.0.0.1',
      location: 'Bengaluru, India',
      lastActive: '2026-11-05T12:00:00.000Z',
      isCurrent: true,
    },
  ],
  securityNotices: [
    'Profile switching is an operational perspective and not an identity verification boundary.',
    'Passwords and secret tokens are never exposed over client APIs.',
  ],
  identityNotice:
    'Acting profile switcher is strictly for pair-programming and multi-member simulation. It does not verify identity.',
};

const mockWorkspaceSettingsTech: WorkspaceSettings = {
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
    allowedAssetCategories: ['REFERENCES', 'SCRIPTS', 'RAW_FOOTAGE', 'FINAL_APPROVED'],
    requireScriptApproval: true,
    autoCreateStageTasks: true,
  },
  crmConfig: {
    workspaceType: 'TECH',
    techEnquirySources: ['Website Inbound', 'Referral', 'LinkedIn Outreach'],
    techServiceCategories: ['Custom Software Development', 'Web Platform & SaaS'],
  },
  storageConfig: {
    usedBytes: 2576980377, // ~2.4 GB
    maxBytes: 10737418240, // 10 GB
    maxUploadFileBytes: 52428800, // 50 MB
    allowedExtensions: ['pdf', 'docx', 'png', 'jpg', 'mp4', 'zip'],
    versioningPolicy: 'Strict SHA-256 deduplication',
    retentionPolicy: 'Indefinite operational retention',
    storageProvider: 'Cloudflare R2 Object Store',
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
    backupCadence: 'Daily automated snapshot at 02:00 UTC',
    databaseEngine: 'PostgreSQL 16',
    storageEngine: 'Cloudflare R2 Object Storage',
    uptimePercentage: 99.98,
    totalAuditEvents: 142,
    lastConfigChangeAt: '2026-11-01T10:00:00.000Z',
    lastConfigChangeBy: 'Anant',
  },
  memberCount: 3,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-11-01T10:00:00.000Z',
};

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>{ui}</BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>,
  );
}

describe('Feature 16: Settings & Preferences Slice', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    useAppStore.setState({
      selectedWorkspaceId: mockWorkspaceSettingsTech.workspaceId,
      selectedProfileId: mockPersonalSettings.profileId,
    });
  });

  describe('SettingsScopeNavigation Component', () => {
    it('switches between Personal and Workspace scope tabs', () => {
      const onScopeChange = vi.fn();
      const onPersonalTabChange = vi.fn();
      const onWorkspaceTabChange = vi.fn();

      render(
        <SettingsScopeNavigation
          scope="PERSONAL"
          onScopeChange={onScopeChange}
          personalTab="profile"
          onPersonalTabChange={onPersonalTabChange}
          workspaceTab="general"
          onWorkspaceTabChange={onWorkspaceTabChange}
          workspaceName="Corviin Tech"
        />,
      );

      expect(screen.getByText('Personal Preferences')).toBeInTheDocument();
      expect(screen.getByText('Workspace: Corviin Tech')).toBeInTheDocument();
      expect(screen.getByText('My Profile')).toBeInTheDocument();
      expect(screen.getByText('Appearance & Theme')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Workspace: Corviin Tech'));
      expect(onScopeChange).toHaveBeenCalledWith('WORKSPACE');
    });
  });

  describe('PersonalProfileSection Component', () => {
    it('renders profile fields, explains historical attribution, and saves updates', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined);

      render(
        <PersonalProfileSection
          settings={mockPersonalSettings}
          onSave={onSave}
          isSaving={false}
        />,
      );

      expect(screen.getByDisplayValue('Anant')).toBeInTheDocument();
      expect(screen.getByDisplayValue('anant@corviin.tech')).toBeInTheDocument();
      expect(screen.getByText(/Historical Attribution Notice/i)).toBeInTheDocument();

      fireEvent.change(screen.getByDisplayValue('Anant'), {
        target: { value: 'Anant Sharma' },
      });
      fireEvent.click(screen.getByRole('button', { name: /Save Profile Changes/i }));

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith(
          expect.objectContaining({
            displayName: 'Anant Sharma',
          }),
        );
      });
    });
  });

  describe('AppearanceSection Component', () => {
    it('renders Light, Dark, System theme options and enforces zero-animation notice', () => {
      render(
        <ThemeProvider>
          <BrowserRouter>
            <AppearanceSection />
          </BrowserRouter>
        </ThemeProvider>,
      );

      expect(screen.getByText('Light Theme')).toBeInTheDocument();
      expect(screen.getByText('Dark Theme')).toBeInTheDocument();
      expect(screen.getByText('System Theme')).toBeInTheDocument();
      expect(screen.getByText(/Absolute Design Rule: Zero Animation/i)).toBeInTheDocument();
      expect(screen.getByText('Design System Catalog & Preview')).toBeInTheDocument();
    });
  });

  describe('RegionalAndCalendarSection Component', () => {
    it('manages timezone, date formats, and calendar default views', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined);

      render(
        <RegionalAndCalendarSection
          settings={mockPersonalSettings}
          onSave={onSave}
          isSaving={false}
        />,
      );

      expect(screen.getByDisplayValue(/Asia\/Kolkata/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/DD\/MM\/YYYY/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/12-hour clock/i)).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: /Save Preferences/i }));
      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith(
          expect.objectContaining({
            timezone: 'Asia/Kolkata',
            dateFormat: 'DD/MM/YYYY',
            timeFormat: '12h',
          }),
        );
      });
    });
  });

  describe('PersonalNotificationsSection Component', () => {
    it('shows supported in-app channel and simulated push/email notices', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined);

      render(
        <PersonalNotificationsSection
          settings={mockPersonalSettings}
          onSave={onSave}
          isSaving={false}
        />,
      );

      expect(screen.getByText('In-App Notifications')).toBeInTheDocument();
      expect(screen.getByText('Active / Supported')).toBeInTheDocument();
      expect(screen.getAllByText('Phase 7 / Simulated').length).toBe(2);

      fireEvent.click(screen.getByRole('button', { name: /Save Notification Preferences/i }));
      await waitFor(() => {
        expect(onSave).toHaveBeenCalled();
      });
    });
  });

  describe('AccountSecuritySection Component', () => {
    it('displays active session and explains architecture boundary without exposing secrets', () => {
      render(<AccountSecuritySection securitySummary={mockSecuritySummary} />);

      expect(screen.getByText('Chrome 131.0')).toBeInTheDocument();
      expect(screen.getByText('Current Session')).toBeInTheDocument();
      expect(screen.getByText(/Architecture Notice: Profile Switching vs. Authentication/i)).toBeInTheDocument();
      expect(screen.queryByText(/password_hash|jwt|Bearer/i)).not.toBeInTheDocument();
    });
  });

  describe('WorkspaceTaskDefaultsSection Component', () => {
    it('configures default priority, due days offset, and operating days', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined);

      render(
        <WorkspaceTaskDefaultsSection
          settings={mockWorkspaceSettingsTech}
          onSave={onSave}
          isSaving={false}
        />,
      );

      expect(screen.getByDisplayValue(/Medium — Standard operational/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue('3')).toBeInTheDocument();
      expect(screen.getByText(/Historical Integrity Guarantee/i)).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: /Save Task Defaults/i }));
      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith(
          expect.objectContaining({
            taskDefaults: expect.objectContaining({
              defaultPriority: TaskPriority.MEDIUM,
              defaultDueDays: 3,
            }),
          }),
        );
      });
    });
  });

  describe('WorkspaceCrmSection Component & Consequential Impact', () => {
    it('renders Tech service categories and checks consequential impact on removal', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined);
      vi.spyOn(settingsApi, 'checkImpact').mockResolvedValue({
        affectedCount: 4,
        message: 'Warning: 4 active records depend on Custom Software Development.',
        safeToRemove: false,
      });

      render(
        <WorkspaceCrmSection
          settings={mockWorkspaceSettingsTech}
          onSave={onSave}
          isSaving={false}
        />,
      );

      expect(screen.getByText('Corviin Tech CRM Configuration')).toBeInTheDocument();
      expect(screen.getByText('Custom Software Development')).toBeInTheDocument();

      // Trigger delete icon for category
      const deleteButtons = screen.getAllByTitle('Remove category');
      fireEvent.click(deleteButtons[0]);

      // Consequential impact modal should appear
      await waitFor(() => {
        expect(screen.getByText(/Consequential Impact Detected: 4 Records/i)).toBeInTheDocument();
      });
    });
  });

  describe('WorkspaceStorageSection Component', () => {
    it('renders storage meter, upload limit, and allowed extensions without animation', () => {
      render(<WorkspaceStorageSection settings={mockWorkspaceSettingsTech} />);

      expect(screen.getByText(/2.40 GB of 10 GB/i)).toBeInTheDocument();
      expect(screen.getByText('50 MB')).toBeInTheDocument();
      expect(screen.getByText('.PDF')).toBeInTheDocument();
      expect(screen.getByText('.DOCX')).toBeInTheDocument();
      expect(screen.getByText('Cloudflare R2 / S3')).toBeInTheDocument();
    });
  });

  describe('WorkspaceAccessBackupSection Component', () => {
    it('renders operational status badge and handles reset confirmation flow', async () => {
      const onReset = vi.fn().mockResolvedValue(undefined);

      render(
        <WorkspaceAccessBackupSection
          settings={mockWorkspaceSettingsTech}
          onResetDefaults={onReset}
          isResetting={false}
        />,
      );

      expect(screen.getByText('OPERATIONAL')).toBeInTheDocument();
      expect(screen.getByText('PostgreSQL 16')).toBeInTheDocument();

      // Open reset modal
      fireEvent.click(screen.getByRole('button', { name: /Reset to Workspace Defaults/i }));
      expect(screen.getByText('Confirm Configuration Reset')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: /Yes, Reset Defaults/i }));
      await waitFor(() => {
        expect(onReset).toHaveBeenCalled();
      });
    });
  });

  describe('SettingsPage Full Integration', () => {
    it('loads personal and workspace settings and enables switching between scopes', async () => {
      vi.spyOn(settingsApi, 'fetchPersonalSettings').mockResolvedValue(mockPersonalSettings);
      vi.spyOn(settingsApi, 'fetchAccountSecurity').mockResolvedValue(mockSecuritySummary);
      vi.spyOn(settingsApi, 'fetchWorkspaceSettings').mockResolvedValue(mockWorkspaceSettingsTech);

      renderWithClient(<SettingsPage />);

      await waitFor(() => {
        expect(screen.getByText('Settings & Preferences')).toBeInTheDocument();
        expect(screen.getByText('Personal Preferences')).toBeInTheDocument();
        expect(screen.getByText('Workspace: Corviin Tech')).toBeInTheDocument();
      });

      // Switch to Workspace scope
      fireEvent.click(screen.getByText('Workspace: Corviin Tech'));

      await waitFor(() => {
        expect(screen.getByText('General & Branding')).toBeInTheDocument();
        expect(screen.getByText('Task Defaults')).toBeInTheDocument();
        expect(screen.getByText('Storage Limits')).toBeInTheDocument();
      });
    });
  });
});
