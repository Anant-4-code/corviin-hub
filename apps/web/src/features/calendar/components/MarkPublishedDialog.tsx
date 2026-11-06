import React, { useState, useEffect } from 'react';
import { CalendarItemDto } from '@corviin-hub/shared';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';

interface MarkPublishedDialogProps {
  item: CalendarItemDto | null;
  open: boolean;
  onClose: () => void;
  onMarkPublished: (eventId: string, actualDate: string, publicUrl: string) => Promise<void>;
}

export function MarkPublishedDialog({
  item,
  open,
  onClose,
  onMarkPublished,
}: MarkPublishedDialogProps) {
  const [actualDate, setActualDate] = useState('');
  const [publicUrl, setPublicUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const formatted = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
      setActualDate(formatted);
      setPublicUrl('');
      setError('');
    }
  }, [open]);

  if (!item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicUrl.trim()) {
      setError('Live public URL is required to verify publication.');
      return;
    }
    if (!actualDate) {
      setError('Actual publication date/time is required.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await onMarkPublished(item.sourceId, new Date(actualDate).toISOString(), publicUrl.trim());
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to mark published.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} title="Mark Content as Published">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-canvas border border-ch-border rounded p-3 text-xs text-ch-text-secondary space-y-1">
          <div className="font-semibold text-ch-text-primary">{item.title}</div>
          <div>
            Target Date:{' '}
            <span className="font-mono text-ch-text-primary">
              {new Date(item.plannedDate).toLocaleString()}
            </span>
          </div>
        </div>

        <FormField
          label="Actual Publication Timestamp"
          description="The exact time this content went live. Planned schedule timestamp remains preserved."
          required
        >
          <Input
            type="datetime-local"
            value={actualDate}
            onChange={(e) => setActualDate(e.target.value)}
            className="text-xs h-9"
            required
          />
        </FormField>

        <FormField
          label="Public Live URL"
          description="Link to live post on YouTube, LinkedIn, Instagram, or website."
          required
        >
          <Input
            type="url"
            placeholder="https://youtube.com/watch?v=... or https://linkedin.com/posts/..."
            value={publicUrl}
            onChange={(e) => setPublicUrl(e.target.value)}
            className="text-xs h-9 font-mono"
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
          <Button
            variant="primary"
            type="submit"
            size="sm"
            disabled={submitting}
            className="bg-success hover:bg-success/90 text-white"
          >
            {submitting ? 'Recording...' : 'Record Publication'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

