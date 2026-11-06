import React, { useState, useEffect } from 'react';
import type {
  PersonalSettings,
  PersonalNotificationPreferences,
  UpdatePersonalSettingsDto,
} from '@corviin-hub/shared';

interface PersonalNotificationsSectionProps {
  settings: PersonalSettings;
  onSave: (dto: UpdatePersonalSettingsDto) => Promise<void>;
  isSaving: boolean;
}

export const PersonalNotificationsSection: React.FC<PersonalNotificationsSectionProps> = ({
  settings,
  onSave,
  isSaving,
}) => {
  const [prefs, setPrefs] = useState<PersonalNotificationPreferences>(settings.notifications);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    setPrefs(settings.notifications);
  }, [settings]);

  const handleToggle = (key: keyof PersonalNotificationPreferences) => {
    setPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    try {
      await onSave({
        notifications: prefs,
      });
      setStatusMessage('Notification preferences updated.');
    } catch {
      setStatusMessage('Failed to update notification preferences.');
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-5 space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-primary">Personal Notification Preferences</h2>
        <p className="text-xs text-secondary mt-0.5">
          Control which operational alerts trigger notices for your acting profile.
        </p>
      </div>

      {/* Channel Configuration Status Banner */}
      <div className="p-3.5 bg-surface-muted border border-border rounded-md space-y-2">
        <div className="text-xs font-semibold text-primary">Operational Delivery Channels</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
          <div className="flex items-center justify-between p-2 rounded bg-surface border border-border">
            <span className="font-medium text-primary">In-App Notifications</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              Active / Supported
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded bg-surface border border-border">
            <span className="font-medium text-secondary">Browser & Android Push</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-surface-muted text-tertiary border border-border">
              Phase 7 / Simulated
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded bg-surface border border-border">
            <span className="font-medium text-secondary">Email Digest</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-surface-muted text-tertiary border border-border">
              Phase 7 / Simulated
            </span>
          </div>
        </div>
        <p className="text-[11px] text-tertiary pt-1">
          In Phase 3, notifications are reliably recorded in the internal activity log. Push and Email dispatches are staged for operational background workers in Phase 7.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-md bg-surface-muted border border-border">
            <div>
              <div className="text-xs font-semibold text-primary">Task Assignments</div>
              <div className="text-[11px] text-secondary">
                Receive alerts when a task is assigned or reassigned to you.
              </div>
            </div>
            <input
              type="checkbox"
              checked={prefs.taskAssignments}
              onChange={() => handleToggle('taskAssignments')}
              className="w-4 h-4 text-brand-teal rounded border-border focus:ring-brand-teal"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-md bg-surface-muted border border-border">
            <div>
              <div className="text-xs font-semibold text-primary">Deadline Reminders</div>
              <div className="text-[11px] text-secondary">
                Alerts 24 hours and 2 hours before a planned deadline.
              </div>
            </div>
            <input
              type="checkbox"
              checked={prefs.deadlineReminders}
              onChange={() => handleToggle('deadlineReminders')}
              className="w-4 h-4 text-brand-teal rounded border-border focus:ring-brand-teal"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-md bg-surface-muted border border-border">
            <div>
              <div className="text-xs font-semibold text-primary">Overdue Task Warnings</div>
              <div className="text-[11px] text-secondary">
                Immediate notification when a deliverable slips past its target date.
              </div>
            </div>
            <input
              type="checkbox"
              checked={prefs.overdueAlerts}
              onChange={() => handleToggle('overdueAlerts')}
              className="w-4 h-4 text-brand-teal rounded border-border focus:ring-brand-teal"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-md bg-surface-muted border border-border">
            <div>
              <div className="text-xs font-semibold text-primary">Campaign Milestones & Stage Changes</div>
              <div className="text-[11px] text-secondary">
                Alerts when a marketing campaign advances through its 5-stage lifecycle.
              </div>
            </div>
            <input
              type="checkbox"
              checked={prefs.campaignMilestones}
              onChange={() => handleToggle('campaignMilestones')}
              className="w-4 h-4 text-brand-teal rounded border-border focus:ring-brand-teal"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-md bg-surface-muted border border-border">
            <div>
              <div className="text-xs font-semibold text-primary">Meeting & Client Site Visit Reminders</div>
              <div className="text-[11px] text-secondary">
                Preparation alerts 30 minutes before client meetings or scheduled partner discussions.
              </div>
            </div>
            <input
              type="checkbox"
              checked={prefs.meetingReminders}
              onChange={() => handleToggle('meetingReminders')}
              className="w-4 h-4 text-brand-teal rounded border-border focus:ring-brand-teal"
            />
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
            {isSaving ? 'Saving Changes...' : 'Save Notification Preferences'}
          </button>
        </div>
      </form>
    </div>
  );
};

