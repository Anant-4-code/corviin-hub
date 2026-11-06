import React, { useState } from 'react';
import type { TaskItem } from '@corviin-hub/shared';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { FormField } from '@/components/ui/FormField';

interface RescheduleTaskDialogProps {
  task: TaskItem | null;
  open: boolean;
  onClose: () => void;
  onReschedule: (id: string, newDeadline: string, reason: string, newPlannedStart?: string) => Promise<void>;
}

export function RescheduleTaskDialog({ task, open, onClose, onReschedule }: RescheduleTaskDialogProps) {
  const [newDeadline, setNewDeadline] = useState('');
  const [newPlannedStart, setNewPlannedStart] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (task && open) {
      // Initialize with current deadline in input format YYYY-MM-DDTHH:mm
      try {
        const d = new Date(task.deadline);
        const pad = (n: number) => String(n).padStart(2, '0');
        const formatted = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
        setNewDeadline(formatted);
      } catch {
        setNewDeadline('');
      }
      setNewPlannedStart('');
      setReason('');
      setError('');
    }
  }, [task, open]);

  if (!task) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeadline) {
      setError('New deadline is required.');
      return;
    }
    if (!reason.trim()) {
      setError('Please provide a reason for rescheduling to preserve the audit trail.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await onReschedule(
        task.id,
        new Date(newDeadline).toISOString(),
        reason.trim(),
        newPlannedStart ? new Date(newPlannedStart).toISOString() : undefined,
      );
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to reschedule task.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Reschedule Task"
      description={`Rescheduling task "${task.title}". This change will be permanently appended to the schedule history.`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs bg-danger/10 border border-danger/20 text-danger rounded">
            {error}
          </div>
        )}

        <FormField label="Current Deadline">
          <div className="text-sm font-medium text-ch-text-secondary bg-surface-muted px-3 py-2 rounded border border-ch-border">
            {new Date(task.deadline).toLocaleString()}
          </div>
        </FormField>

        <FormField label="New Deadline" required>
          <Input
            type="datetime-local"
            value={newDeadline}
            onChange={(e) => setNewDeadline(e.target.value)}
            required
          />
        </FormField>

        <FormField label="New Planned Start (Optional)">
          <Input
            type="datetime-local"
            value={newPlannedStart}
            onChange={(e) => setNewPlannedStart(e.target.value)}
          />
        </FormField>

        <FormField label="Reason for Rescheduling" required>
          <Textarea
            rows={3}
            placeholder="Explain why this deadline is changing (e.g., Client delay on asset review, Scope revision)..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </FormField>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-ch-border">
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={submitting}>
            Save New Schedule
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

