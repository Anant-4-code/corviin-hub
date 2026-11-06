import React, { useState } from 'react';
import { SchedulePartnerMeetingDto, PartnerProjectRef } from '@corviin-hub/shared';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';

interface SchedulePartnerMeetingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: SchedulePartnerMeetingDto) => Promise<void>;
  partnerName: string;
  projects?: PartnerProjectRef[];
  members: Array<{ id: string; name: string }>;
  defaultHostId?: string;
}

export const SchedulePartnerMeetingDialog: React.FC<SchedulePartnerMeetingDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  partnerName,
  projects = [],
  members,
  defaultHostId,
}) => {
  const [title, setTitle] = useState(`Meeting with ${partnerName}`);
  const [scheduledAt, setScheduledAt] = useState('');
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [hostId, setHostId] = useState(defaultHostId || members[0]?.id || '');
  const [agenda, setAgenda] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Meeting title is required.');
      return;
    }
    if (!scheduledAt) {
      setErrorMsg('Meeting date and time is required.');
      return;
    }

    const dto: SchedulePartnerMeetingDto = {
      title: title.trim(),
      scheduledAt: new Date(scheduledAt).toISOString(),
      projectId: projectId || undefined,
      hostId,
      agenda: agenda.trim() || undefined,
    };

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await onSubmit(dto);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to schedule meeting.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title="Schedule Partner Meeting"
      description={`Prelink partner ${partnerName} and project to schedule an official discussion.`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-3 pt-2">
        {errorMsg && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded text-xs text-rose-700 dark:text-rose-300">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-ch-text-primary mb-1">
            Meeting Title <span className="text-rose-500">*</span>
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="text-xs"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-ch-text-primary mb-1">
              Date & Time <span className="text-rose-500">*</span>
            </label>
            <Input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              required
              className="text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ch-text-primary mb-1">
              Host / Organizer
            </label>
            <Select
              value={hostId}
              onChange={(e) => setHostId(e.target.value)}
              className="text-xs"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {projects.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-ch-text-primary mb-1">
              Prelink Relevant Project Development
            </label>
            <Select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="text-xs"
            >
              <option value="">No specific project (General partnership)</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.location})
                </option>
              ))}
            </Select>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-ch-text-primary mb-1">
            Agenda & Objectives
          </label>
          <Textarea
            placeholder="Key discussion points, commission alignment, campaign deliverables..."
            value={agenda}
            onChange={(e) => setAgenda(e.target.value)}
            rows={3}
            className="text-xs"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-ch-border">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Scheduling...' : 'Schedule Meeting'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
