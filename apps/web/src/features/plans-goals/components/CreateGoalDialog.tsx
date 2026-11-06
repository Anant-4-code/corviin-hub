import React, { useState } from 'react';
import { CreateGoalDto, TaskPriority, ProgressMode } from '@corviin-hub/shared';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { FormField } from '@/components/ui/FormField';
import { useProfiles } from '@/hooks/useProfiles';
import { useAppStore } from '@/lib/store';

interface CreateGoalDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (dto: CreateGoalDto) => Promise<void>;
}

export function CreateGoalDialog({ open, onClose, onCreate }: CreateGoalDialogProps) {
  const { data: profiles = [] } = useProfiles();
  const selectedProfileId = useAppStore((s) => s.selectedProfileId);
  const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);
  const defaultOwnerId = selectedProfileId || profiles[0]?.id || '';

  const [title, setTitle] = useState('');
  const [expectedOutcome, setExpectedOutcome] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.HIGH);
  const [progressMode, setProgressMode] = useState<ProgressMode>(ProgressMode.MANUAL);

  // Optional metric
  const [hasMetric, setHasMetric] = useState(false);
  const [metricName, setMetricName] = useState('');
  const [metricTargetValue, setMetricTargetValue] = useState('');
  const [metricCurrentValue, setMetricCurrentValue] = useState('');
  const [metricUnit, setMetricUnit] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (open) {
      setTitle('');
      setExpectedOutcome('');
      setOwnerId(defaultOwnerId);
      setPriority(TaskPriority.HIGH);
      setProgressMode(ProgressMode.MANUAL);

      // Default target date to end of quarter
      const defaultDate = new Date();
      defaultDate.setMonth(defaultDate.getMonth() + 2);
      const pad = (n: number) => String(n).padStart(2, '0');
      setTargetDate(`${defaultDate.getFullYear()}-${pad(defaultDate.getMonth() + 1)}-${pad(defaultDate.getDate())}`);

      setHasMetric(false);
      setMetricName('');
      setMetricTargetValue('');
      setMetricCurrentValue('');
      setMetricUnit('');
      setError('');
    }
  }, [open, defaultOwnerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Goal title is required.');
      return;
    }
    if (!expectedOutcome.trim()) {
      setError('Expected outcome description is required.');
      return;
    }
    if (!targetDate) {
      setError('Target date is required.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await onCreate({
        workspaceId: selectedWorkspaceId || 'ws-tech-0001-0000-000000000001',
        title: title.trim(),
        expectedOutcome: expectedOutcome.trim(),
        ownerId: ownerId || selectedProfileId || 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        targetDate: new Date(targetDate).toISOString(),
        priority,
        progressMode,
        metric: hasMetric && metricName.trim()
          ? {
              name: metricName.trim(),
              targetValue: Number(metricTargetValue) || 100,
              currentValue: Number(metricCurrentValue) || 0,
              unit: metricUnit.trim() || undefined,
            }
          : undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to create goal.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Create New Strategic Goal"
      description="Define a high-level intended outcome, accountability ownership, and optional quantitative metric."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
        {error && (
          <div className="p-3 text-xs bg-danger/10 border border-danger/20 text-danger rounded">
            {error}
          </div>
        )}

        <FormField label="Goal Title" required>
          <Input
            placeholder="e.g. Onboard 50 Enterprise Tech Clients in Q4"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />
        </FormField>

        <FormField label="Expected Business Outcome" required>
          <Textarea
            rows={3}
            placeholder="Describe the concrete business result, value generated, or operational milestone..."
            value={expectedOutcome}
            onChange={(e) => setExpectedOutcome(e.target.value)}
            required
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField label="Goal Owner" required>
            <Select
              value={ownerId}
              onChange={(e) => setOwnerId(e.target.value)}
              options={profiles.map((p) => ({
                value: p.id,
                label: p.displayName,
              }))}
            />
          </FormField>

          <FormField label="Priority" required>
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              options={[
                { value: TaskPriority.URGENT, label: 'Urgent (Critical Strategic Priority)' },
                { value: TaskPriority.HIGH, label: 'High' },
                { value: TaskPriority.MEDIUM, label: 'Medium' },
                { value: TaskPriority.LOW, label: 'Low' },
              ]}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField label="Target Completion Date" required>
            <Input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              required
            />
          </FormField>

          <FormField label="Progress Tracking Mode">
            <Select
              value={progressMode}
              onChange={(e) => setProgressMode(e.target.value as ProgressMode)}
              options={[
                { value: ProgressMode.MANUAL, label: 'Manual Progress (% completion)' },
                { value: ProgressMode.TASK_DERIVED, label: 'Task-Derived (from linked tasks)' },
                { value: ProgressMode.MILESTONE_DERIVED, label: 'Milestone-Derived (from plan checkpoints)' },
              ]}
            />
          </FormField>
        </div>

        {/* Metric Toggle */}
        <div className="pt-2 border-t border-ch-border space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="has-metric"
              checked={hasMetric}
              onChange={(e) => setHasMetric(e.target.checked)}
              className="rounded border-ch-border text-accent focus:ring-accent"
            />
            <label htmlFor="has-metric" className="text-xs font-semibold text-ch-text-primary cursor-pointer">
              Attach Quantitative Measurement Metric (Optional)
            </label>
          </div>

          {hasMetric && (
            <div className="p-3 bg-surface-muted/30 rounded border border-ch-border space-y-3">
              <FormField label="Metric Name">
                <Input
                  placeholder="e.g. Enterprise Contracts Signed, ARR, Units Closed"
                  value={metricName}
                  onChange={(e) => setMetricName(e.target.value)}
                />
              </FormField>

              <div className="grid grid-cols-3 gap-2">
                <FormField label="Target Value">
                  <Input
                    type="number"
                    placeholder="50"
                    value={metricTargetValue}
                    onChange={(e) => setMetricTargetValue(e.target.value)}
                  />
                </FormField>

                <FormField label="Current Value">
                  <Input
                    type="number"
                    placeholder="0"
                    value={metricCurrentValue}
                    onChange={(e) => setMetricCurrentValue(e.target.value)}
                  />
                </FormField>

                <FormField label="Unit">
                  <Input
                    placeholder="clients, $, %"
                    value={metricUnit}
                    onChange={(e) => setMetricUnit(e.target.value)}
                  />
                </FormField>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-ch-border">
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={submitting}>
            Create Strategic Goal
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
