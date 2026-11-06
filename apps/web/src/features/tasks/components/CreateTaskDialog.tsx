import React, { useState } from 'react';
import { CreateTaskDto, TaskPriority } from '@corviin-hub/shared';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { FormField } from '@/components/ui/FormField';
import { useProfiles } from '@/hooks/useProfiles';
import { useAppStore } from '@/lib/store';
import { Plus, Trash2 } from 'lucide-react';

interface CreateTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (dto: CreateTaskDto) => Promise<void>;
  initialAssigneeId?: string;
  defaultDeadline?: string;
}

export function CreateTaskDialog({
  open,
  onClose,
  onCreate,
  initialAssigneeId,
  defaultDeadline,
}: CreateTaskDialogProps) {
  const { data: profiles } = useProfiles();
  const selectedProfileId = useAppStore((s) => s.selectedProfileId);
  const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [plannedStart, setPlannedStart] = useState('');
  const [deadline, setDeadline] = useState('');
  const [checklistInputs, setChecklistInputs] = useState<string[]>([]);
  const [newChecklistText, setNewChecklistText] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (open) {
      setTitle('');
      setDescription('');
      setAssigneeId(initialAssigneeId || selectedProfileId || (profiles && profiles[0]?.id) || '');
      setPriority(TaskPriority.MEDIUM);
      setPlannedStart('');

      // Default deadline to tomorrow at 5:00 PM unless defaultDeadline provided
      if (defaultDeadline) {
        try {
          const dl = new Date(defaultDeadline);
          const pad = (n: number) => String(n).padStart(2, '0');
          setDeadline(`${dl.getFullYear()}-${pad(dl.getMonth() + 1)}-${pad(dl.getDate())}T${pad(dl.getHours())}:${pad(dl.getMinutes())}`);
        } catch {
          setDeadline('');
        }
      } else {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(17, 0, 0, 0);
        const pad = (n: number) => String(n).padStart(2, '0');
        const defaultDl = `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}T17:00`;
        setDeadline(defaultDl);
      }

      setChecklistInputs([]);
      setNewChecklistText('');
      setError('');
    }
  }, [open, selectedProfileId, profiles]);

  const handleAddChecklistItem = () => {
    if (!newChecklistText.trim()) return;
    setChecklistInputs((prev) => [...prev, newChecklistText.trim()]);
    setNewChecklistText('');
  };

  const handleRemoveChecklistItem = (idx: number) => {
    setChecklistInputs((prev) => prev.filter((_, i) => i !== idx));
  };

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
      await onCreate({
        title: title.trim(),
        description: description.trim() || undefined,
        workspaceId: selectedWorkspaceId || 'ws-tech-0001-0000-000000000001',
        assigneeId: assigneeId || selectedProfileId || 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        priority,
        plannedStart: plannedStart ? new Date(plannedStart).toISOString() : undefined,
        deadline: new Date(deadline).toISOString(),
        checklist: checklistInputs,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to create task.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Create New Operational Task"
      description="Create a task with clear deadline, assignee ownership, and checklist requirements."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
        {error && (
          <div className="p-3 text-xs bg-danger/10 border border-danger/20 text-danger rounded">
            {error}
          </div>
        )}

        <FormField label="Task Title" required>
          <Input
            placeholder="e.g. Prepare architectural CAD export for Skyline Tower"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField label="Assignee" required>
            <Select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              options={(profiles || []).map((p) => ({
                value: p.id,
                label: `${p.displayName} (${p.initials})`,
              }))}
            />
          </FormField>

          <FormField label="Priority" required>
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              options={[
                { value: TaskPriority.URGENT, label: 'Urgent (Highest focus)' },
                { value: TaskPriority.HIGH, label: 'High' },
                { value: TaskPriority.MEDIUM, label: 'Medium' },
                { value: TaskPriority.LOW, label: 'Low' },
              ]}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField label="Planned Start Date/Time (Optional)">
            <Input
              type="datetime-local"
              value={plannedStart}
              onChange={(e) => setPlannedStart(e.target.value)}
            />
          </FormField>

          <FormField label="Deadline Date/Time" required>
            <Input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </FormField>
        </div>

        <FormField label="Description (Optional)">
          <Textarea
            rows={3}
            placeholder="Detailed scope, prerequisites, output expectations, or instructions..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormField>

        {/* Subtask checklist */}
        <div className="space-y-2 pt-2 border-t border-ch-border">
          <label className="text-xs font-semibold text-ch-text-secondary uppercase tracking-wider">
            Subtask Checklist (Optional)
          </label>
          <div className="flex gap-2">
            <Input
              placeholder="Add actionable subtask step..."
              value={newChecklistText}
              onChange={(e) => setNewChecklistText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddChecklistItem();
                }
              }}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddChecklistItem}
              disabled={!newChecklistText.trim()}
            >
              <Plus size={16} />
            </Button>
          </div>

          {checklistInputs.length > 0 && (
            <div className="space-y-1.5 mt-2 bg-surface-muted/50 p-2.5 rounded border border-ch-border">
              {checklistInputs.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1 px-2 bg-surface rounded border border-ch-border">
                  <span className="text-ch-text-primary truncate">{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveChecklistItem(idx)}
                    className="text-ch-text-muted hover:text-danger p-0.5"
                    aria-label="Remove item"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-ch-border">
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={submitting}>
            Create Task
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
