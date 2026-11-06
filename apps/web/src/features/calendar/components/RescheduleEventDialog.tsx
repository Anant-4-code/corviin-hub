import React, { useState, useEffect } from 'react';
import { CalendarItemDto } from '@corviin-hub/shared';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { FormField } from '@/components/ui/FormField';

interface RescheduleEventDialogProps {
  item: CalendarItemDto | null;
  open: boolean;
  onClose: () => void;
  onReschedule: (eventId: string, newDate: string, reason: string) => Promise<void>;
}

export function RescheduleEventDialog({
  item,
  open,
  onClose,
  onReschedule,
}: RescheduleEventDialogProps) {
  const [newDate, setNewDate] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && item) {
      // Default to 3 days after existing planned date
      const d = new Date(item.plannedDate);
      d.setDate(d.getDate() + 3);
      const pad = (n: number) => String(n).padStart(2, '0');
      const formatted = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      setNewDate(formatted);
      setReason('');
      setError('');
    }
  }, [open, item]);

  if (!item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate) {
      setError('Please provide a new scheduled date and time.');
      return;
    }
    if (!reason.trim()) {
      setError('A mandatory reason is required to reschedule.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await onReschedule(item.sourceId, new Date(newDate).toISOString(), reason.trim());
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to reschedule event.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} title="Reschedule Production Milestone">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-canvas border border-ch-border rounded p-3 text-xs text-ch-text-secondary space-y-1">
          <div className="font-semibold text-ch-text-primary">{item.title}</div>
          <div>
            Current Planned Date:{' '}
            <span className="font-mono text-ch-text-primary">
              {new Date(item.plannedDate).toLocaleString()}
            </span>
          </div>
        </div>

        <FormField label="New Production Date & Time" required>
          <Input
            type="datetime-local"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="text-xs h-9"
            required
          />
        </FormField>

        <FormField
          label="Mandatory Reschedule Reason"
          description="Explain why this deadline is shifting. This is permanently appended to schedule history."
          required
        >
          <Textarea
            rows={3}
            placeholder="e.g., Studio audio equipment delay; speaker availability changed."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="text-xs resize-none"
            required
          />
        </FormField>

        {error && (
          <div className="p-2.5 rounded bg-danger/10 border border-danger/30 text-xs text-danger">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-ch-border">
          <Button variant="outline" type="button" size="sm" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" size="sm" disabled={submitting}>
            {submitting ? 'Updating...' : 'Confirm Reschedule'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

