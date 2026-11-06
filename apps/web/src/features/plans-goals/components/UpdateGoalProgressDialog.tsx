import React, { useState } from 'react';
import { GoalItem, GoalStatus, ProgressMode } from '@corviin-hub/shared';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { FormField } from '@/components/ui/FormField';

interface UpdateGoalProgressDialogProps {
  goal: GoalItem | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (
    id: string,
    updates: {
      status?: GoalStatus;
      progressPercent?: number;
      progressMode?: ProgressMode;
      metricCurrentValue?: number;
      riskReason?: string;
    },
  ) => Promise<void>;
}

export function UpdateGoalProgressDialog({
  goal,
  open,
  onClose,
  onUpdate,
}: UpdateGoalProgressDialogProps) {
  const [status, setStatus] = useState<GoalStatus>(GoalStatus.IN_PROGRESS);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [progressMode, setProgressMode] = useState<ProgressMode>(ProgressMode.MANUAL);
  const [metricCurrentValue, setMetricCurrentValue] = useState<string>('');
  const [isAtRisk, setIsAtRisk] = useState(false);
  const [riskReason, setRiskReason] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (goal && open) {
      setStatus(goal.status);
      setProgressPercent(goal.progressPercent);
      setProgressMode(goal.progressMode);
      setMetricCurrentValue(goal.metric ? String(goal.metric.currentValue) : '');
      setIsAtRisk(goal.isAtRisk || goal.status === GoalStatus.AT_RISK);
      setRiskReason(goal.riskReason || '');
      setError('');
    }
  }, [goal, open]);

  if (!goal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError('');
      await onUpdate(goal.id, {
        status: isAtRisk ? GoalStatus.AT_RISK : status,
        progressPercent: Number(progressPercent),
        progressMode,
        metricCurrentValue: metricCurrentValue !== '' ? Number(metricCurrentValue) : undefined,
        riskReason: isAtRisk ? riskReason.trim() : undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to update goal progress.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Update Goal Progress & Status"
      description={`Update progress metric and operational health for "${goal.title}".`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs bg-danger/10 border border-danger/20 text-danger rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Goal Status">
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as GoalStatus)}
              options={[
                { value: GoalStatus.NOT_STARTED, label: 'Not Started' },
                { value: GoalStatus.IN_PROGRESS, label: 'In Progress' },
                { value: GoalStatus.ACHIEVED, label: 'Achieved' },
                { value: GoalStatus.MISSED, label: 'Missed' },
                { value: GoalStatus.CANCELLED, label: 'Cancelled' },
              ]}
            />
          </FormField>

          <FormField label="Progress Mode">
            <Select
              value={progressMode}
              onChange={(e) => setProgressMode(e.target.value as ProgressMode)}
              options={[
                { value: ProgressMode.MANUAL, label: 'Manual' },
                { value: ProgressMode.TASK_DERIVED, label: 'Task-Derived' },
                { value: ProgressMode.MILESTONE_DERIVED, label: 'Milestone-Derived' },
              ]}
            />
          </FormField>
        </div>

        {goal.metric && (
          <FormField label={`Current Metric Value (${goal.metric.name} - Target: ${goal.metric.targetValue} ${goal.metric.unit || ''})`}>
            <Input
              type="number"
              value={metricCurrentValue}
              onChange={(e) => setMetricCurrentValue(e.target.value)}
            />
          </FormField>
        )}

        <FormField label={`Overall Progress: ${progressPercent}%`}>
          <input
            type="range"
            min={0}
            max={100}
            value={progressPercent}
            onChange={(e) => setProgressPercent(Number(e.target.value))}
            className="w-full h-2 bg-surface-muted rounded-lg appearance-none cursor-pointer accent-accent"
          />
        </FormField>

        {/* At Risk section */}
        <div className="p-3 bg-surface-muted/30 rounded border border-ch-border space-y-2.5">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="flag-at-risk"
              checked={isAtRisk}
              onChange={(e) => setIsAtRisk(e.target.checked)}
              className="rounded border-ch-border text-danger focus:ring-danger"
            />
            <label htmlFor="flag-at-risk" className="text-xs font-semibold text-danger cursor-pointer">
              Flag Goal as At-Risk
            </label>
          </div>

          {isAtRisk && (
            <FormField label="Explainable Risk Impediment" required>
              <Textarea
                rows={2}
                placeholder="Explain why this goal is at risk (e.g. key vendor delay, resource shortage, regulatory pause)..."
                value={riskReason}
                onChange={(e) => setRiskReason(e.target.value)}
                required={isAtRisk}
              />
            </FormField>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-ch-border">
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={submitting}>
            Save Progress
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

