import React, { useState, useEffect } from 'react';
import { TaskPriority } from '@corviin-hub/shared';
import type { WorkspaceSettings, UpdateWorkspaceSettingsDto } from '@corviin-hub/shared';

interface WorkspaceTaskDefaultsSectionProps {
  settings: WorkspaceSettings;
  onSave: (dto: UpdateWorkspaceSettingsDto) => Promise<void>;
  isSaving: boolean;
}

export const WorkspaceTaskDefaultsSection: React.FC<WorkspaceTaskDefaultsSectionProps> = ({
  settings,
  onSave,
  isSaving,
}) => {
  const [defaultPriority, setDefaultPriority] = useState<TaskPriority>(
    settings.taskDefaults.defaultPriority,
  );
  const [defaultDueDays, setDefaultDueDays] = useState(settings.taskDefaults.defaultDueDays);
  const [workingDays, setWorkingDays] = useState<string[]>(settings.taskDefaults.workingDays);
  const [workingHoursStart, setWorkingHoursStart] = useState(
    settings.taskDefaults.workingHoursStart,
  );
  const [workingHoursEnd, setWorkingHoursEnd] = useState(settings.taskDefaults.workingHoursEnd);
  const [autoOverdueEscalation, setAutoOverdueEscalation] = useState(
    settings.taskDefaults.autoOverdueEscalation,
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    setDefaultPriority(settings.taskDefaults.defaultPriority);
    setDefaultDueDays(settings.taskDefaults.defaultDueDays);
    setWorkingDays(settings.taskDefaults.workingDays);
    setWorkingHoursStart(settings.taskDefaults.workingHoursStart);
    setWorkingHoursEnd(settings.taskDefaults.workingHoursEnd);
    setAutoOverdueEscalation(settings.taskDefaults.autoOverdueEscalation);
  }, [settings]);

  const allDays = [
    { id: 'MON', label: 'Mon' },
    { id: 'TUE', label: 'Tue' },
    { id: 'WED', label: 'Wed' },
    { id: 'THU', label: 'Thu' },
    { id: 'FRI', label: 'Fri' },
    { id: 'SAT', label: 'Sat' },
    { id: 'SUN', label: 'Sun' },
  ];

  const handleToggleDay = (dayId: string) => {
    if (workingDays.includes(dayId)) {
      if (workingDays.length === 1) return; // Prevent 0 days
      setWorkingDays(workingDays.filter((d) => d !== dayId));
    } else {
      setWorkingDays([...workingDays, dayId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    try {
      await onSave({
        taskDefaults: {
          defaultPriority,
          defaultDueDays: Number(defaultDueDays),
          workingDays,
          workingHoursStart,
          workingHoursEnd,
          autoOverdueEscalation,
        },
      });
      setStatusMessage('Workspace task defaults updated.');
    } catch {
      setStatusMessage('Failed to update task defaults.');
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-5 space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-primary">Workspace Task & Priority Defaults</h2>
        <p className="text-xs text-secondary mt-0.5">
          Define standard priority presets, working calendar days, and operational scheduling defaults.
        </p>
      </div>

      <div className="p-3 bg-surface-muted border border-border rounded-md text-xs text-secondary leading-relaxed">
        <strong>Historical Integrity Guarantee:</strong> Modifying task defaults or priority rules applies to
        newly scheduled deliverables. Existing completed tasks, active work sessions, reschedule histories,
        and audit records are never modified or invalidated.
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-primary mb-1">
              Default Task Priority
            </label>
            <select
              value={defaultPriority}
              onChange={(e) => setDefaultPriority(e.target.value as TaskPriority)}
              className="w-full text-xs bg-surface border border-border rounded px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal min-h-[38px]"
            >
              <option value={TaskPriority.LOW}>Low — Flexible target</option>
              <option value={TaskPriority.MEDIUM}>Medium — Standard operational</option>
              <option value={TaskPriority.HIGH}>High — Urgent milestone</option>
              <option value={TaskPriority.URGENT}>Urgent — Blocker / immediate</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary mb-1">
              Default Due Date Offset (Days)
            </label>
            <input
              type="number"
              min="0"
              max="90"
              required
              value={defaultDueDays}
              onChange={(e) => setDefaultDueDays(parseInt(e.target.value, 10) || 0)}
              className="w-full text-xs bg-surface border border-border rounded px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal min-h-[38px]"
            />
            <p className="text-[10px] text-tertiary mt-1">
              Auto-fills deadline when creating tasks without an explicit target date.
            </p>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-primary mb-1.5">
              Operating Working Days
            </label>
            <div className="flex flex-wrap gap-2">
              {allDays.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => handleToggleDay(d.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded border min-h-[38px] ${
                    workingDays.includes(d.id)
                      ? 'bg-brand-teal text-white border-brand-teal'
                      : 'bg-surface text-secondary border-border hover:bg-surface-muted'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-tertiary mt-1">
              Used to calculate working durations and calendar scheduling.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary mb-1">
              Working Hours Start
            </label>
            <input
              type="time"
              value={workingHoursStart}
              onChange={(e) => setWorkingHoursStart(e.target.value)}
              className="w-full text-xs bg-surface border border-border rounded px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal min-h-[38px]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary mb-1">
              Working Hours End
            </label>
            <input
              type="time"
              value={workingHoursEnd}
              onChange={(e) => setWorkingHoursEnd(e.target.value)}
              className="w-full text-xs bg-surface border border-border rounded px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal min-h-[38px]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-md bg-surface-muted border border-border">
          <div>
            <div className="text-xs font-semibold text-primary">Automatic Overdue Task Escalation</div>
            <div className="text-[11px] text-secondary">
              Highlights overdue tasks on team workload banners and prompts team redistribution.
            </div>
          </div>
          <input
            type="checkbox"
            checked={autoOverdueEscalation}
            onChange={(e) => setAutoOverdueEscalation(e.target.checked)}
            className="w-4 h-4 text-brand-teal rounded border-border focus:ring-brand-teal"
          />
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
            {isSaving ? 'Saving Changes...' : 'Save Task Defaults'}
          </button>
        </div>
      </form>
    </div>
  );
};

