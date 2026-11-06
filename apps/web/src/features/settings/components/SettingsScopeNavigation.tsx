import React from 'react';
import { User, Building2 } from 'lucide-react';

export type SettingsScope = 'PERSONAL' | 'WORKSPACE';

export type PersonalTab = 'profile' | 'appearance' | 'regional' | 'notifications' | 'security';
export type WorkspaceTab =
  | 'general'
  | 'tasks'
  | 'campaigns'
  | 'crm'
  | 'storage'
  | 'ws_notifications'
  | 'backup';

interface SettingsScopeNavigationProps {
  scope: SettingsScope;
  onScopeChange: (scope: SettingsScope) => void;
  personalTab: PersonalTab;
  onPersonalTabChange: (tab: PersonalTab) => void;
  workspaceTab: WorkspaceTab;
  onWorkspaceTabChange: (tab: WorkspaceTab) => void;
  workspaceName: string;
}

export const SettingsScopeNavigation: React.FC<SettingsScopeNavigationProps> = ({
  scope,
  onScopeChange,
  personalTab,
  onPersonalTabChange,
  workspaceTab,
  onWorkspaceTabChange,
  workspaceName,
}) => {
  const personalTabs: Array<{ id: PersonalTab; label: string }> = [
    { id: 'profile', label: 'My Profile' },
    { id: 'appearance', label: 'Appearance & Theme' },
    { id: 'regional', label: 'Timezone & Calendar' },
    { id: 'notifications', label: 'Personal Notifications' },
    { id: 'security', label: 'Account & Security' },
  ];

  const workspaceTabs: Array<{ id: WorkspaceTab; label: string }> = [
    { id: 'general', label: 'General & Branding' },
    { id: 'tasks', label: 'Task Defaults' },
    { id: 'campaigns', label: 'Campaign Defaults' },
    { id: 'crm', label: 'CRM Pipelines & Fields' },
    { id: 'storage', label: 'Storage Limits' },
    { id: 'ws_notifications', label: 'Workspace Alerts' },
    { id: 'backup', label: 'Access, Backup & Status' },
  ];

  return (
    <div className="space-y-4">
      {/* Scope Switcher Banner */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-3.5 bg-surface border border-border rounded-lg gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-surface-muted rounded-md border border-border">
          <button
            type="button"
            onClick={() => onScopeChange('PERSONAL')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded min-h-[38px] ${
              scope === 'PERSONAL'
                ? 'bg-surface text-primary border border-border shadow-xs'
                : 'text-secondary hover:text-primary'
            }`}
          >
            <User size={15} />
            <span>Personal Preferences</span>
          </button>
          <button
            type="button"
            onClick={() => onScopeChange('WORKSPACE')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded min-h-[38px] ${
              scope === 'WORKSPACE'
                ? 'bg-surface text-primary border border-border shadow-xs'
                : 'text-secondary hover:text-primary'
            }`}
          >
            <Building2 size={15} />
            <span>Workspace: {workspaceName}</span>
          </button>
        </div>

        <div className="text-[11px] text-tertiary">
          {scope === 'PERSONAL' ? (
            <span>Settings apply only to your acting profile and device.</span>
          ) : (
            <span>Settings apply to all members within {workspaceName}.</span>
          )}
        </div>
      </div>

      {/* Sub-Tabs Navigation Strip */}
      <div className="flex items-center overflow-x-auto pb-1 gap-1 border-b border-border">
        {scope === 'PERSONAL'
          ? personalTabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onPersonalTabChange(t.id)}
                className={`px-3 py-2 text-xs font-semibold whitespace-nowrap border-b-2 -mb-[1px] min-h-[40px] ${
                  personalTab === t.id
                    ? 'border-brand-teal text-primary'
                    : 'border-transparent text-secondary hover:text-primary'
                }`}
              >
                {t.label}
              </button>
            ))
          : workspaceTabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onWorkspaceTabChange(t.id)}
                className={`px-3 py-2 text-xs font-semibold whitespace-nowrap border-b-2 -mb-[1px] min-h-[40px] ${
                  workspaceTab === t.id
                    ? 'border-brand-teal text-primary'
                    : 'border-transparent text-secondary hover:text-primary'
                }`}
              >
                {t.label}
              </button>
            ))}
      </div>
    </div>
  );
};

