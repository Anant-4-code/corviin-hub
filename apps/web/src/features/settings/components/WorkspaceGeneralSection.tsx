import React, { useState, useEffect } from 'react';
import type { WorkspaceSettings, UpdateWorkspaceSettingsDto } from '@corviin-hub/shared';

interface WorkspaceGeneralSectionProps {
  settings: WorkspaceSettings;
  onSave: (dto: UpdateWorkspaceSettingsDto) => Promise<void>;
  isSaving: boolean;
}

export const WorkspaceGeneralSection: React.FC<WorkspaceGeneralSectionProps> = ({
  settings,
  onSave,
  isSaving,
}) => {
  const [displayName, setDisplayName] = useState(settings.displayName);
  const [currency, setCurrency] = useState(settings.currency);
  const [timezone, setTimezone] = useState(settings.timezone);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    setDisplayName(settings.displayName);
    setCurrency(settings.currency);
    setTimezone(settings.timezone);
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    try {
      await onSave({
        displayName: displayName.trim(),
        currency,
        timezone,
      });
      setStatusMessage('Workspace general configuration saved.');
    } catch {
      setStatusMessage('Failed to update workspace configuration.');
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-5 space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-primary">Workspace General & Branding</h2>
        <p className="text-xs text-secondary mt-0.5">
          Workspace-level metadata, business operating currency, and regional alignment.
        </p>
      </div>

      <div className="p-3 bg-surface-muted border border-border rounded-md text-xs text-secondary leading-relaxed">
        <strong>Workspace Scope Boundary:</strong> Changes applied here take effect immediately for all
        members working within <strong>{settings.displayName}</strong>. This configuration is isolated and
        will not alter or affect other workspaces.
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-primary mb-1">
              Workspace Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full text-xs bg-surface border border-border rounded px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal min-h-[38px]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary mb-1">
              Business Operating Model
            </label>
            <input
              type="text"
              readOnly
              disabled
              value={settings.businessType === 'TECHNOLOGY' ? 'Technology Services & SaaS' : 'Real Estate Mandates & Land'}
              className="w-full text-xs bg-surface-muted border border-border rounded px-3 py-2 text-secondary min-h-[38px] cursor-not-allowed"
            />
            <p className="text-[10px] text-tertiary mt-1">
              Fixed workspace architecture domain.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary mb-1">
              Primary Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as any)}
              className="w-full text-xs bg-surface border border-border rounded px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal min-h-[38px]"
            >
              <option value="INR">INR (₹) — Indian Rupee (Primary)</option>
              <option value="USD">USD ($) — US Dollar</option>
              <option value="EUR">EUR (€) — Euro</option>
            </select>
            <p className="text-[10px] text-tertiary mt-1">
              Used in CRM quotations, deals, budgets, and operational financial rollups.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary mb-1">
              Workspace Operational Timezone
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full text-xs bg-surface border border-border rounded px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal min-h-[38px]"
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST +05:30)</option>
              <option value="UTC">UTC (Coordinated Universal Time)</option>
              <option value="America/New_York">America/New_York (EST / EDT)</option>
              <option value="Europe/London">Europe/London (GMT / BST)</option>
            </select>
          </div>
        </div>

        {statusMessage && (
          <div
            className={`p-3 rounded text-xs border ${
              statusMessage.includes('saved')
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800'
                : 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200 border-rose-300 dark:border-rose-800'
            }`}
          >
            {statusMessage}
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 text-xs font-semibold rounded bg-brand-teal text-white hover:bg-brand-teal/90 disabled:opacity-50 min-h-[44px]"
          >
            {isSaving ? 'Saving Changes...' : 'Save Workspace Branding'}
          </button>
        </div>
      </form>
    </div>
  );
};

