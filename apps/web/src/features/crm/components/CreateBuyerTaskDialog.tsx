import React, { useState } from 'react';
import { CreateBuyerLinkedTaskDto, TaskPriority } from '@corviin-hub/shared';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';

interface CreateBuyerTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateBuyerLinkedTaskDto) => Promise<void>;
  buyerName: string;
  members: Array<{ id: string; name: string }>;
  defaultAssigneeId?: string;
}

export const CreateBuyerTaskDialog: React.FC<CreateBuyerTaskDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  buyerName,
  members,
  defaultAssigneeId,
}) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [assigneeId, setAssigneeId] = useState(defaultAssigneeId || members[0]?.id || '');
  const [deadline, setDeadline] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      setTitle(`Follow-up with ${buyerName}`);
      setPriority(TaskPriority.MEDIUM);
      setAssigneeId(defaultAssigneeId || members[0]?.id || '');
      setDeadline(new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]); // 2 days
      setNotes('');
      setErrorMsg('');
      setIsSubmitting(false);
    }
  }, [isOpen, buyerName, defaultAssigneeId, members]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Task title is required.');
      return;
    }

    const dto: CreateBuyerLinkedTaskDto = {
      title: title.trim(),
      priority,
      assigneeId: assigneeId || undefined,
      deadline: deadline || undefined,
      description: notes.trim() || undefined,
    };

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await onSubmit(dto);
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
      title="Create Buyer Follow-up Task"
      description={`Creates a task pre-linked to ${buyerName} in the shared Task Engine.`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-3 pt-2">
        {errorMsg && (
          <div className="p-3 text-xs bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-md">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-ch-text-secondary mb-1">
            Task Title *
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Call to confirm Saturday 11am site visit"
            className="w-full text-xs"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-ch-text-secondary mb-1">
              Priority
            </label>
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full text-xs"
            >
              <option value={TaskPriority.LOW}>Low</option>
              <option value={TaskPriority.MEDIUM}>Medium</option>
              <option value={TaskPriority.HIGH}>High</option>
              <option value={TaskPriority.URGENT}>Urgent</option>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-ch-text-secondary mb-1">
              Assignee
            </label>
            <Select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full text-xs"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-ch-text-secondary mb-1">
              Deadline
            </label>
            <Input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ch-text-secondary mb-1">
            Task Description / Instructions
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Share updated payment plans, ask about loan pre-approval..."
            className="w-full text-xs"
            rows={2}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-ch-border">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
