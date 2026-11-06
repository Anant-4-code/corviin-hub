import React, { useState } from 'react';
import { Database, ShieldCheck, RotateCcw, AlertTriangle } from 'lucide-react';
import type { WorkspaceSettings } from '@corviin-hub/shared';

interface WorkspaceAccessBackupSectionProps {
  settings: WorkspaceSettings;
  onResetDefaults: () => Promise<void>;
  isResetting: boolean;
}

export const WorkspaceAccessBackupSection: React.FC<WorkspaceAccessBackupSectionProps> = ({
  settings,
  onResetDefaults,
  isResetting,
}) => {
  const { operationalStatus } = settings;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleConfirmReset = async () => {
    setStatusMessage(null);
    try {
      await onResetDefaults();
      setConfirmOpen(false);
      setStatusMessage('Workspace configuration reset to defaults successfully.');
    } catch {
      setStatusMessage('Failed to reset workspace configuration.');
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-5 space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-primary">Access, Activity & Operational Status</h2>
        <p className="text-xs text-secondary mt-0.5">
          Workspace administrative metadata, database backup status, and disaster recovery posture.
        </p>
      </div>

      {/* Operational System Health Banner */}
      <div className="p-4 bg-surface-muted border border-border rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 max-w-2xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-primary">Workspace Infrastructure Status</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-emerald-500" />
                {operationalStatus.status}
              </span>
            </div>
            <div className="text-[11px] text-secondary mt-0.5">
              Service uptime: {operationalStatus.uptimePercentage}% across all API routes.
            </div>
          </div>
        </div>
      </div>

      {/* Access & Audit Status */}
      <div className="space-y-3 max-w-2xl">
        <h3 className="text-xs font-semibold text-primary">Workspace Access & Governance</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded bg-surface border border-border">
            <div className="text-tertiary text-[11px]">Active Team Members</div>
            <div className="text-lg font-bold text-primary mt-0.5">{settings.memberCount} Members</div>
            <div className="text-[10px] text-secondary mt-0.5">
              Filtered dynamically by workspace access.
            </div>
          </div>

          <div className="p-3 rounded bg-surface border border-border">
            <div className="text-tertiary text-[11px]">Total Audit Events Recorded</div>
            <div className="text-lg font-bold text-primary mt-0.5">
              {operationalStatus.totalAuditEvents} Events
            </div>
            <div className="text-[10px] text-secondary mt-0.5">
              Immutable operational log.
            </div>
          </div>

          <div className="p-3 rounded bg-surface border border-border">
            <div className="text-tertiary text-[11px]">Last Configuration Update</div>
            <div className="text-xs font-bold text-primary mt-0.5">
              {operationalStatus.lastConfigChangeBy || 'System Seed'}
            </div>
            <div className="text-[10px] text-secondary mt-0.5">
              {operationalStatus.lastConfigChangeAt
                ? new Date(operationalStatus.lastConfigChangeAt).toLocaleString()
                : 'Initial repository setup'}
            </div>
          </div>

          <div className="p-3 rounded bg-surface border border-border">
            <div className="text-tertiary text-[11px]">Workspace Provisioned On</div>
            <div className="text-xs font-bold text-primary mt-0.5">1 January 2026</div>
            <div className="text-[10px] text-secondary mt-0.5">ID: {settings.workspaceId}</div>
          </div>
        </div>
      </div>

      {/* Database Backup Posture (Read-Only) */}
      <div className="space-y-3 pt-2 border-t border-border max-w-2xl">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
          <Database size={15} className="text-brand-teal" />
          <span>Automated Backup & Operational Status (Managed)</span>
        </div>

        <div className="p-3.5 rounded-md bg-surface-muted border border-border space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-secondary">Database Engine</span>
            <span className="font-semibold text-primary">{operationalStatus.databaseEngine}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-secondary">Object Storage Backend</span>
            <span className="font-semibold text-primary">{operationalStatus.storageEngine}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-secondary">Automated Backup Cadence</span>
            <span className="font-semibold text-primary">{operationalStatus.backupCadence}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-secondary">Last Verified Snapshot</span>
            <span className="font-semibold text-primary">
              {new Date(operationalStatus.lastBackupAt).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Reset to Workspace Defaults */}
      <div className="pt-3 border-t border-border space-y-3 max-w-2xl">
        <div>
          <div className="text-xs font-semibold text-rose-600 dark:text-rose-400">
            Reset Workspace Configuration
          </div>
          <p className="text-[11px] text-secondary mt-0.5">
            Restores default priority settings, campaign platforms, working hours, and standard CRM
            presets. Existing tasks, client leads, and assets are not deleted.
          </p>
        </div>

        {statusMessage && (
          <div
            className={`p-3 rounded text-xs border ${
              statusMessage.includes('successfully')
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800'
                : 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200 border-rose-300 dark:border-rose-800'
            }`}
          >
            {statusMessage}
          </div>
        )}

        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          disabled={isResetting}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded bg-surface border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 min-h-[44px]"
        >
          <RotateCcw size={14} />
          <span>Reset to Workspace Defaults</span>
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-surface border border-border rounded-lg max-w-md w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <AlertTriangle size={20} />
              <h3 className="text-sm font-bold text-primary">Confirm Configuration Reset</h3>
            </div>
            <p className="text-xs text-secondary leading-relaxed">
              Are you sure you want to reset configuration defaults for{' '}
              <strong className="text-primary font-semibold">{settings.displayName}</strong>?
              This will restore standard task priority presets, working hours, and CRM option lists.
              Your historical task records and customer data will remain completely intact.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="px-3.5 py-2 text-xs font-semibold rounded bg-surface-muted text-secondary hover:text-primary border border-border min-h-[44px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                disabled={isResetting}
                className="px-4 py-2 text-xs font-semibold rounded bg-rose-600 text-white hover:bg-rose-700 min-h-[44px]"
              >
                {isResetting ? 'Resetting...' : 'Yes, Reset Defaults'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

