import React, { useState } from 'react';
import type { TaskItem } from '@corviin-hub/shared';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { FormField } from '@/components/ui/FormField';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface CompleteTaskDialogProps {
  task: TaskItem | null;
  open: boolean;
  onClose: () => void;
  onComplete: (id: string, completionNote?: string) => Promise<void>;
}

export function CompleteTaskDialog({ task, open, onClose, onComplete }: CompleteTaskDialogProps) {
  const [completionNote, setCompletionNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (task && open) {
      setCompletionNote('');
      setError('');
    }
  }, [task, open]);

  if (!task) return null;

  const incompleteChecklistCount = (task.checklist || []).filter((i) => !i.completed).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError('');
      await onComplete(task.id, completionNote.trim() || undefined);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to complete task.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Complete Task"
      description={`Mark "${task.title}" as completed.`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs bg-danger/10 border border-danger/20 text-danger rounded">
            {error}
          </div>
        )}

        {incompleteChecklistCount > 0 && (
          <div className="p-3 bg-warning/10 border border-warning/20 rounded flex items-start gap-2 text-warning text-xs">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Notice:</span> There are still{' '}
              <span className="font-bold">{incompleteChecklistCount}</span> incomplete subtask checklist
              item(s) on this task. You can still complete it, but please confirm this is intentional.
            </div>
          </div>
        )}

        <FormField label="Completion Note (Optional)">
          <Textarea
            rows={3}
            placeholder="Add handover note, final deliverable link, or remarks on outcome..."
            value={completionNote}
            onChange={(e) => setCompletionNote(e.target.value)}
          />
        </FormField>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-ch-border">
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={submitting}>
            <CheckCircle2 size={16} className="mr-1.5" />
            Confirm Completion
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
