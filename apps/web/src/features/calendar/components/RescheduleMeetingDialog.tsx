import React, { useState, useEffect } from 'react';
import { MeetingVisitCalendarItemDto } from '@corviin-hub/shared';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface RescheduleMeetingDialogProps {
  open: boolean;
  onClose: () => void;
  item: MeetingVisitCalendarItemDto | null;
  onConfirm: (newStartTime: string, newEndTime: string, reason: string) => Promise<void>;
}

export function RescheduleMeetingDialog({
  open,
  onClose,
  item,
  onConfirm,
}: RescheduleMeetingDialogProps) {
  const [newDate, setNewDate] = useState('');
  const [newStartTime, setNewStartTime] = useState('10:00');
  const [newEndTime, setNewEndTime] = useState('11:00');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setNewDate(item.date || new Date().toISOString().slice(0, 10));
      try {
        const s = new Date(item.startTime);
        const e = new Date(item.endTime);
        setNewStartTime(s.toTimeString().slice(0, 5));
        setNewEndTime(e.toTimeString().slice(0, 5));
      } catch {
        setNewStartTime('10:00');
        setNewEndTime('11:00');
      }
      setReason('');
      setError(null);
    }
  }, [item]);

  if (!item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!reason.trim()) {
      setError('A mandatory reason is required to reschedule an event.');
      return;
    }

    const startIso = `${newDate}T${newStartTime}:00.000Z`;
    const endIso = `${newDate}T${newEndTime}:00.000Z`;

    if (new Date(endIso) <= new Date(startIso)) {
      setError('New end time must be after new start time.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onConfirm(startIso, endIso, reason.trim());
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to reschedule event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Reschedule Event"
      description={`Shift scheduled date or time for "${item.title}". Reschedule reason is audited.`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        {error && (
          <div className="p-2.5 bg-danger/10 border border-danger/30 text-danger text-xs font-medium">
            {error}
          </div>
        )}

        {/* Current Time Info */}
        <div className="p-2.5 bg-surface-muted/50 border border-ch-border text-xs space-y-1">
          <div className="text-[11px] font-semibold text-ch-text-secondary">Current Schedule:</div>
          <div className="text-ch-text-primary font-mono">
            {item.date} ({new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(item.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <FormField label="New Date *" required>
            <Input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              required
              className="text-xs font-mono"
            />
          </FormField>

          <FormField label="New Start Time *" required>
            <Input
              type="time"
              value={newStartTime}
              onChange={(e) => setNewStartTime(e.target.value)}
              required
              className="text-xs font-mono"
            />
          </FormField>

          <FormField label="New End Time *" required>
            <Input
              type="time"
              value={newEndTime}
              onChange={(e) => setNewEndTime(e.target.value)}
              required
              className="text-xs font-mono"
            />
          </FormField>
        </div>

        <FormField
          label="Mandatory Reschedule Reason *"
          required
          description="Document why this event is being postponed or shifted (audit trail)."
        >
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            required
            placeholder="e.g. Client requested postponement due to flight delay..."
            className="w-full p-2 bg-surface border border-ch-border text-xs text-ch-text-primary placeholder:text-ch-text-muted focus:outline-none focus:border-primary resize-none"
          />
        </FormField>

        <div className="pt-3 border-t border-ch-border flex items-center justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose} className="text-xs">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSubmitting || !reason.trim()}
            className="text-xs gap-1.5"
          >
            <RotateCcw size={13} />
            <span>{isSubmitting ? 'Updating...' : 'Confirm Reschedule'}</span>
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

