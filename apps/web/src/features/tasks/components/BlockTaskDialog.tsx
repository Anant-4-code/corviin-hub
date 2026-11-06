import React, { useState } from 'react';
import type { TaskItem } from '@corviin-hub/shared';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { FormField } from '@/components/ui/FormField';

interface BlockTaskDialogProps {
  task: TaskItem | null;
  open: boolean;
  onClose: () => void;
  onBlock: (id: string, blockerReason: string, expectedResolutionDate?: string) => Promise<void>;
}

export function BlockTaskDialog({ task, open, onClose, onBlock }: BlockTaskDialogProps) {
  const [blockerReason, setBlockerReason] = useState('');
  const [expectedResolutionDate, setExpectedResolutionDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (task && open) {
      setBlockerReason(task.blockerReason || '');
      setExpectedResolutionDate('');
      setError('');
    }
  }, [task, open]);

  if (!task) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockerReason.trim()) {
      setError('Please provide a specific blocker reason.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await onBlock(
        task.id,
        blockerReason.trim(),
        expectedResolutionDate ? new Date(expectedResolutionDate).toISOString() : undefined,
      );
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to mark task as blocked.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Flag Task as Blocked"
      description={`Marking task "${task.title}" as blocked. This alerts the team that work cannot proceed until prerequisites are met.`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs bg-danger/10 border border-danger/20 text-danger rounded">
            {error}
          </div>
        )}

        <FormField label="Blocker Reason / Impediment" required>
          <Textarea
            rows={3}
            placeholder="Describe the blocker (e.g. Waiting on client sign-off, external API downtime, missing floor plans)..."
            value={blockerReason}
            onChange={(e) => setBlockerReason(e.target.value)}
            required
          />
        </FormField>

        <FormField label="Expected Resolution Date (Optional)">
          <Input
            type="date"
            value={expectedResolutionDate}
            onChange={(e) => setExpectedResolutionDate(e.target.value)}
          />
        </FormField>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-ch-border">
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="danger" loading={submitting}>
            Confirm Block
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

