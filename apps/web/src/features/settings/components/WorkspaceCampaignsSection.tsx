import React, { useState, useEffect } from 'react';
import type { WorkspaceSettings, UpdateWorkspaceSettingsDto } from '@corviin-hub/shared';

interface WorkspaceCampaignsSectionProps {
  settings: WorkspaceSettings;
  onSave: (dto: UpdateWorkspaceSettingsDto) => Promise<void>;
  isSaving: boolean;
}

export const WorkspaceCampaignsSection: React.FC<WorkspaceCampaignsSectionProps> = ({
  settings,
  onSave,
  isSaving,
}) => {
  const [allowedPlatforms, setAllowedPlatforms] = useState<string[]>(
    settings.campaignDefaults.allowedPlatforms,
  );
  const [requireScriptApproval, setRequireScriptApproval] = useState(
    settings.campaignDefaults.requireScriptApproval,
  );
  const [autoCreateStageTasks, setAutoCreateStageTasks] = useState(
    settings.campaignDefaults.autoCreateStageTasks,
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    setAllowedPlatforms(settings.campaignDefaults.allowedPlatforms);
    setRequireScriptApproval(settings.campaignDefaults.requireScriptApproval);
    setAutoCreateStageTasks(settings.campaignDefaults.autoCreateStageTasks);
  }, [settings]);

  const candidatePlatforms = [
    { id: 'YOUTUBE', label: 'YouTube' },
    { id: 'INSTAGRAM', label: 'Instagram' },
    { id: 'LINKEDIN', label: 'LinkedIn' },
    { id: 'TWITTER_X', label: 'Twitter / X' },
    { id: 'FACEBOOK', label: 'Facebook' },
    { id: 'OTHER', label: 'Other Platforms' },
  ];

  const handleTogglePlatform = (plat: string) => {
    if (allowedPlatforms.includes(plat)) {
      if (allowedPlatforms.length === 1) return; // Prevent 0 platforms
      setAllowedPlatforms(allowedPlatforms.filter((p) => p !== plat));
    } else {
      setAllowedPlatforms([...allowedPlatforms, plat]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    try {
      await onSave({
        campaignDefaults: {
          allowedPlatforms,
          requireScriptApproval,
          autoCreateStageTasks,
        },
      });
      setStatusMessage('Workspace campaign settings saved.');
    } catch {
      setStatusMessage('Failed to update campaign defaults.');
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-5 space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-primary">Campaign Platforms & Asset Defaults</h2>
        <p className="text-xs text-secondary mt-0.5">
          Configure active publishing channels, stage approval gates, and asset library defaults.
        </p>
      </div>

      <div className="p-3 bg-surface-muted border border-border rounded-md text-xs text-secondary leading-relaxed">
        <strong>5-Stage Pipeline Enforcement:</strong> All campaigns advance through the standard lifecycle:
        Initial Idea → Scripting & Planning → Recording & Upload → Editing & Final Asset → Posting & Completion.
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
        <div>
          <label className="block text-xs font-semibold text-primary mb-2">
            Active Marketing & Content Platforms
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {candidatePlatforms.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleTogglePlatform(p.id)}
                className={`flex items-center justify-between p-2.5 rounded border text-xs font-medium min-h-[42px] ${
                  allowedPlatforms.includes(p.id)
                    ? 'bg-brand-teal/10 border-brand-teal text-brand-teal'
                    : 'bg-surface border-border text-secondary hover:bg-surface-muted'
                }`}
              >
                <span>{p.label}</span>
                {allowedPlatforms.includes(p.id) && <span className="font-bold text-xs">✓</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-md bg-surface-muted border border-border">
            <div>
              <div className="text-xs font-semibold text-primary">Mandatory Script Approval (Stage 2)</div>
              <div className="text-[11px] text-secondary">
                Requires explicit team member sign-off on script versions before advancing to recording.
              </div>
            </div>
            <input
              type="checkbox"
              checked={requireScriptApproval}
              onChange={(e) => setRequireScriptApproval(e.target.checked)}
              className="w-4 h-4 text-brand-teal rounded border-border focus:ring-brand-teal"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-md bg-surface-muted border border-border">
            <div>
              <div className="text-xs font-semibold text-primary">Auto-Create Stage Tasks in Shared Engine</div>
              <div className="text-[11px] text-secondary">
                Automatically provisions linked deliverables in My Tasks and Calendar when advancing stages.
              </div>
            </div>
            <input
              type="checkbox"
              checked={autoCreateStageTasks}
              onChange={(e) => setAutoCreateStageTasks(e.target.checked)}
              className="w-4 h-4 text-brand-teal rounded border-border focus:ring-brand-teal"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-primary mb-1">
            Standard Asset Categories (System-Managed)
          </label>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {settings.campaignDefaults.allowedAssetCategories.map((cat) => (
              <span
                key={cat}
                className="px-2 py-0.5 rounded text-[11px] font-medium bg-surface-muted text-secondary border border-border"
              >
                {cat}
              </span>
            ))}
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
            {isSaving ? 'Saving Changes...' : 'Save Campaign Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

