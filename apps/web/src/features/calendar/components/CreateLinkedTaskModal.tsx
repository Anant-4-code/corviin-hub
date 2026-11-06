import React, { useState, useEffect } from 'react';
import { CalendarItemDto, TaskPriority } from '@corviin-hub/shared';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { FormField } from '@/components/ui/FormField';
import { useProfiles } from '@/hooks/useProfiles';
import { useAppStore } from '@/lib/store';
import { createTask } from '@/services/tasks';

interface CreateLinkedTaskModalProps {
  item: CalendarItemDto | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateLinkedTaskModal({
  item,
  open,
  onClose,
  onSuccess,
}: CreateLinkedTaskModalProps) {
  const { data: profiles = [] } = useProfiles();
  const selectedProfileId = useAppStore((s) => s.selectedProfileId);
  const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);
  const defaultAssigneeId = selectedProfileId || profiles[0]?.id || '';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.HIGH);
  const [deadline, setDeadline] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && item) {
      setTitle(`Task: ${item.title}`);
      setDescription(`Action item for campaign "${item.campaignTitle || item.title}"`);
      setAssigneeId(defaultAssigneeId);
      setPriority(TaskPriority.HIGH);

      const d = new Date(item.plannedDate);
      const pad = (n: number) => String(n).padStart(2, '0');
      setDeadline(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`);
      setError('');
    }
  }, [open, item, defaultAssigneeId]);

  if (!item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }
    if (!deadline) {
      setError('Task deadline is required.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await createTask({
        workspaceId: selectedWorkspaceId || 'ws-tech-0001-0000-000000000001',
        title: title.trim(),
        description: description.trim(),
        assigneeId: assigneeId || defaultAssigneeId,
        priority,
        deadline: new Date(deadline).toISOString(),
        linkedRecord: {
          id: item.campaignId || item.sourceId,
          title: item.campaignTitle || item.title,
          type: 'campaign',
        },
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to create linked campaign task.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} title="Create Linked Campaign Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-canvas border border-ch-border rounded p-3 text-xs text-ch-text-secondary">
          Linked Source:{' '}
          <span className="font-semibold text-accent">
            {item.campaignTitle || item.title}
          </span>
        </div>

        <FormField label="Task Title" required>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xs h-9"
            required
          />
        </FormField>

        <FormField label="Task Description">
          <Textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="text-xs resize-none"
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Assignee" required>
            <Select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="text-xs h-9"
              required
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.displayName}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Priority" required>
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="text-xs h-9"
              required
            >
              <option value={TaskPriority.URGENT}>Urgent</option>
              <option value={TaskPriority.HIGH}>High</option>
              <option value={TaskPriority.MEDIUM}>Medium</option>
              <option value={TaskPriority.LOW}>Low</option>
            </Select>
          </FormField>
        </div>

        <FormField label="Task Deadline" required>
          <Input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="text-xs h-9"
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
            {submitting ? 'Creating...' : 'Create Linked Task'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

