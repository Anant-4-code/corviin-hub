import React, { useState } from 'react';
import { TaskPriority, CreatePartnerLinkedTaskDto } from '@corviin-hub/shared';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';

interface CreatePartnerTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreatePartnerLinkedTaskDto) => Promise<void>;
  partnerName: string;
  members: Array<{ id: string; name: string }>;
  defaultAssigneeId?: string;
}

export const CreatePartnerTaskDialog: React.FC<CreatePartnerTaskDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  partnerName,
  members,
  defaultAssigneeId,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [assigneeId, setAssigneeId] = useState(defaultAssigneeId || members[0]?.id || '');
  const [deadline, setDeadline] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Task title is required.');
      return;
    }

    const dto: CreatePartnerLinkedTaskDto = {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      assigneeId,
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
    };

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await onSubmit(dto);
      setTitle('');
      setDescription('');
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title="Create Follow-up / Linked Task"
      description={`Add an actionable task into the workspace task register linked to ${partnerName}.`}
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
            Task Title <span className="text-rose-500">*</span>
          </label>
          <Input
            placeholder="e.g. Prepare sole selling draft contract, site visit inspection..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="text-xs"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-ch-text-primary mb-1">
              Priority
            </label>
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="text-xs"
            >
              <option value={TaskPriority.LOW}>Low</option>
              <option value={TaskPriority.MEDIUM}>Medium</option>
              <option value={TaskPriority.HIGH}>High</option>
              <option value={TaskPriority.URGENT}>Urgent</option>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-medium text-ch-text-primary mb-1">
              Assignee
            </label>
            <Select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
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

        <div>
          <label className="block text-xs font-medium text-ch-text-primary mb-1">
            Deadline
          </label>
          <Input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-ch-text-primary mb-1">
            Description & Notes
          </label>
          <Textarea
            placeholder="Action items, commitments, or background context..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="text-xs"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-ch-border">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Linked Task'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
