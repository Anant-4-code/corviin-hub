import React, { useState, useEffect } from 'react';
import type { WorkspaceSettings, UpdateWorkspaceSettingsDto } from '@corviin-hub/shared';

interface WorkspaceNotificationsSectionProps {
  settings: WorkspaceSettings;
  onSave: (dto: UpdateWorkspaceSettingsDto) => Promise<void>;
  isSaving: boolean;
}

export const WorkspaceNotificationsSection: React.FC<WorkspaceNotificationsSectionProps> = ({
  settings,
  onSave,
  isSaving,
}) => {
  const [dailyMorningDigest, setDailyMorningDigest] = useState(
    settings.notifications.dailyMorningDigest,
  );
  const [digestTime, setDigestTime] = useState(settings.notifications.digestTime);
  const [weeklyReport, setWeeklyReport] = useState(settings.notifications.weeklyReport);
  const [overdueEscalationHours, setOverdueEscalationHours] = useState(
    settings.notifications.overdueEscalationHours,
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    setDailyMorningDigest(settings.notifications.dailyMorningDigest);
    setDigestTime(settings.notifications.digestTime);
    setWeeklyReport(settings.notifications.weeklyReport);
    setOverdueEscalationHours(settings.notifications.overdueEscalationHours);
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    try {
      await onSave({
        notifications: {
          dailyMorningDigest,
          digestTime,
          weeklyReport,
          overdueEscalationHours: Number(overdueEscalationHours),
        },
      });
      setStatusMessage('Workspace notification rules updated.');
    } catch {
      setStatusMessage('Failed to update workspace notification rules.');
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-5 space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-primary">Workspace Notification & Alert Rules</h2>
        <p className="text-xs text-secondary mt-0.5">
          Configure workspace-wide automated summaries, overdue escalation thresholds, and digests.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-md bg-surface-muted border border-border gap-3">
            <div>
              <div className="text-xs font-semibold text-primary">Daily Morning Workload Digest</div>
              <div className="text-[11px] text-secondary">
                Generates a morning summary of tasks due today, upcoming meetings, and overdue alerts.
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="time"
                value={digestTime}
                onChange={(e) => setDigestTime(e.target.value)}
                disabled={!dailyMorningDigest}
                className="text-xs bg-surface border border-border rounded px-2 py-1 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal min-h-[36px] disabled:opacity-50"
              />
              <input
                type="checkbox"
                checked={dailyMorningDigest}
                onChange={(e) => setDailyMorningDigest(e.target.checked)}
                className="w-4 h-4 text-brand-teal rounded border-border focus:ring-brand-teal"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-md bg-surface-muted border border-border">
            <div>
              <div className="text-xs font-semibold text-primary">Weekly Operational Delivery Report</div>
              <div className="text-[11px] text-secondary">
                Summarizes completed deliverables, closed CRM leads, and campaigns published this week.
              </div>
            </div>
            <input
              type="checkbox"
              checked={weeklyReport}
              onChange={(e) => setWeeklyReport(e.target.checked)}
              className="w-4 h-4 text-brand-teal rounded border-border focus:ring-brand-teal"
            />
          </div>

          <div className="p-3.5 rounded-md bg-surface-muted border border-border space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-primary">Overdue Escalation Threshold</div>
                <div className="text-[11px] text-secondary">
                  Hours after deadline before a task triggers an urgent red banner in Team Workload.
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="72"
                  value={overdueEscalationHours}
                  onChange={(e) => setOverdueEscalationHours(parseInt(e.target.value, 10) || 12)}
                  className="w-20 text-xs bg-surface border border-border rounded px-2.5 py-1 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal min-h-[36px]"
                />
                <span className="text-xs text-secondary font-medium">hours</span>
              </div>
            </div>
          </div>
        </div>

        {statusMessage && (
          <div
            className={`p-3 rounded text-xs border ${
              statusMessage.includes('updated')
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
            {isSaving ? 'Saving Changes...' : 'Save Workspace Alerts'}
          </button>
        </div>
      </form>
    </div>
  );
};

