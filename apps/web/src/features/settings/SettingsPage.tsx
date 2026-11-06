import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '@/lib/store';
import {
  fetchPersonalSettings,
  updatePersonalSettings,
  fetchAccountSecurity,
  fetchWorkspaceSettings,
  updateWorkspaceSettings,
  resetWorkspaceSettings,
} from '@/services/settings';
import type {
  UpdatePersonalSettingsDto,
  UpdateWorkspaceSettingsDto,
  SupportedTheme,
} from '@corviin-hub/shared';
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
  WorkspaceNotificationsSection,
  WorkspaceAccessBackupSection,
} from './components';
import type { SettingsScope, PersonalTab, WorkspaceTab } from './components';

export function SettingsPage() {
  const queryClient = useQueryClient();
  const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);
  const selectedProfileId = useAppStore((s) => s.selectedProfileId);

  const activeWorkspaceId = selectedWorkspaceId || 'ws-tech-0001-0000-000000000001';
  const activeProfileId = selectedProfileId || undefined;

  const [scope, setScope] = useState<SettingsScope>('PERSONAL');
  const [personalTab, setPersonalTab] = useState<PersonalTab>('profile');
  const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>('general');

  // 1. Fetch personal settings
  const {
    data: personalSettings,
    isLoading: isPersonalLoading,
    error: personalError,
  } = useQuery({
    queryKey: ['settings', 'personal', activeProfileId],
    queryFn: () => fetchPersonalSettings(activeProfileId),
    staleTime: 60000,
  });

  // 2. Fetch security summary
  const {
    data: securitySummary,
    isLoading: isSecurityLoading,
  } = useQuery({
    queryKey: ['settings', 'security', activeProfileId],
    queryFn: () => fetchAccountSecurity(activeProfileId),
    staleTime: 60000,
  });

  // 3. Fetch workspace settings
  const {
    data: workspaceSettings,
    isLoading: isWorkspaceLoading,
    error: workspaceError,
  } = useQuery({
    queryKey: ['settings', 'workspace', activeWorkspaceId],
    queryFn: () => fetchWorkspaceSettings(activeWorkspaceId),
    staleTime: 60000,
  });

  // Personal settings update mutation
  const updatePersonalMutation = useMutation({
    mutationFn: (dto: UpdatePersonalSettingsDto) =>
      updatePersonalSettings(dto, activeProfileId),
    onSuccess: (updated) => {
      queryClient.setQueryData(['settings', 'personal', activeProfileId], updated);
      queryClient.invalidateQueries({ queryKey: ['team', 'members'] });
    },
  });

  // Workspace settings update mutation
  const updateWorkspaceMutation = useMutation({
    mutationFn: (dto: UpdateWorkspaceSettingsDto) =>
      updateWorkspaceSettings(activeWorkspaceId, dto),
    onSuccess: (updated) => {
      queryClient.setQueryData(['settings', 'workspace', activeWorkspaceId], updated);
      queryClient.invalidateQueries({ queryKey: ['workspace', activeWorkspaceId] });
    },
  });

  // Reset workspace settings mutation
  const resetWorkspaceMutation = useMutation({
    mutationFn: () => resetWorkspaceSettings(activeWorkspaceId),
    onSuccess: (reset) => {
      queryClient.setQueryData(['settings', 'workspace', activeWorkspaceId], reset);
      queryClient.invalidateQueries({ queryKey: ['workspace', activeWorkspaceId] });
    },
  });

  const isLoading = isPersonalLoading || isWorkspaceLoading || isSecurityLoading;
  const isError = personalError || workspaceError;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-bold text-primary">Settings & Preferences</h1>
          <p className="text-xs text-secondary mt-0.5">
            Loading personal preferences and workspace configuration...
          </p>
        </div>
        <div className="p-8 text-center text-xs text-secondary bg-surface border border-border rounded-lg">
          Loading settings...
        </div>
      </div>
    );
  }

  if (isError || !personalSettings || !workspaceSettings || !securitySummary) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-bold text-primary">Settings & Preferences</h1>
          <p className="text-xs text-secondary mt-0.5">Error loading configuration</p>
        </div>
        <div className="p-6 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-lg text-xs text-rose-800 dark:text-rose-200 space-y-2">
          <div className="font-semibold">Unable to load settings</div>
          <p>An error occurred while loading settings for the selected workspace or profile.</p>
          <button
            type="button"
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ['settings'] });
            }}
            className="px-3 py-1.5 rounded bg-surface text-primary border border-border font-semibold hover:bg-surface-muted min-h-[36px]"
          >
            Retry Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-primary">Settings & Preferences</h1>
        <p className="text-xs text-secondary mt-0.5">
          Configure personal account preferences, theme styling, and isolated workspace operational parameters.
        </p>
      </div>

      {/* Scope and Sub-Navigation */}
      <SettingsScopeNavigation
        scope={scope}
        onScopeChange={setScope}
        personalTab={personalTab}
        onPersonalTabChange={setPersonalTab}
        workspaceTab={workspaceTab}
        onWorkspaceTabChange={setWorkspaceTab}
        workspaceName={workspaceSettings.displayName}
      />

      {/* Content Area */}
      <div>
        {scope === 'PERSONAL' && (
          <div className="space-y-4">
            {personalTab === 'profile' && (
              <PersonalProfileSection
                settings={personalSettings}
                onSave={async (dto) => {
                  await updatePersonalMutation.mutateAsync(dto);
                }}
                isSaving={updatePersonalMutation.isPending}
              />
            )}

            {personalTab === 'appearance' && (
              <AppearanceSection
                onThemeSaved={async (theme: SupportedTheme) => {
                  await updatePersonalMutation.mutateAsync({ theme });
                }}
              />
            )}

            {personalTab === 'regional' && (
              <RegionalAndCalendarSection
                settings={personalSettings}
                onSave={async (dto) => {
                  await updatePersonalMutation.mutateAsync(dto);
                }}
                isSaving={updatePersonalMutation.isPending}
              />
            )}

            {personalTab === 'notifications' && (
              <PersonalNotificationsSection
                settings={personalSettings}
                onSave={async (dto) => {
                  await updatePersonalMutation.mutateAsync(dto);
                }}
                isSaving={updatePersonalMutation.isPending}
              />
            )}

            {personalTab === 'security' && (
              <AccountSecuritySection securitySummary={securitySummary} />
            )}
          </div>
        )}

        {scope === 'WORKSPACE' && (
          <div className="space-y-4">
            {workspaceTab === 'general' && (
              <WorkspaceGeneralSection
                settings={workspaceSettings}
                onSave={async (dto) => {
                  await updateWorkspaceMutation.mutateAsync(dto);
                }}
                isSaving={updateWorkspaceMutation.isPending}
              />
            )}

            {workspaceTab === 'tasks' && (
              <WorkspaceTaskDefaultsSection
                settings={workspaceSettings}
                onSave={async (dto) => {
                  await updateWorkspaceMutation.mutateAsync(dto);
                }}
                isSaving={updateWorkspaceMutation.isPending}
              />
            )}

            {workspaceTab === 'campaigns' && (
              <WorkspaceCampaignsSection
                settings={workspaceSettings}
                onSave={async (dto) => {
                  await updateWorkspaceMutation.mutateAsync(dto);
                }}
                isSaving={updateWorkspaceMutation.isPending}
              />
            )}

            {workspaceTab === 'crm' && (
              <WorkspaceCrmSection
                settings={workspaceSettings}
                onSave={async (dto) => {
                  await updateWorkspaceMutation.mutateAsync(dto);
                }}
                isSaving={updateWorkspaceMutation.isPending}
              />
            )}

            {workspaceTab === 'storage' && (
              <WorkspaceStorageSection settings={workspaceSettings} />
            )}

            {workspaceTab === 'ws_notifications' && (
              <WorkspaceNotificationsSection
                settings={workspaceSettings}
                onSave={async (dto) => {
                  await updateWorkspaceMutation.mutateAsync(dto);
                }}
                isSaving={updateWorkspaceMutation.isPending}
              />
            )}

            {workspaceTab === 'backup' && (
              <WorkspaceAccessBackupSection
                settings={workspaceSettings}
                onResetDefaults={async () => {
                  await resetWorkspaceMutation.mutateAsync();
                }}
                isResetting={resetWorkspaceMutation.isPending}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
