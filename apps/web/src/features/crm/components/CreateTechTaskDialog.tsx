import { useState } from 'react';
import { CheckSquare } from 'lucide-react';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { FormField } from '@/components/ui/FormField';
import { TaskPriority, CreateTechLinkedTaskDto } from '@corviin-hub/shared';

interface MemberOption {
  id: string;
  name: string;
}

interface CreateTechTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  recordCompany: string;
  assignedMemberId: string;
  members: MemberOption[];
  onSubmit: (dto: CreateTechLinkedTaskDto) => Promise<void>;
}

export function CreateTechTaskDialog({
  isOpen,
  onClose,
  recordCompany,
  assignedMemberId,
  members,
  onSubmit,
}: CreateTechTaskDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
  );
  const [assigneeId, setAssigneeId] = useState(assignedMemberId || members[0]?.id || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('Task title is required.');
      return;
    }

    const dto: CreateTechLinkedTaskDto = {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
      assigneeId: assigneeId || undefined,
    };

    try {
      setIsSubmitting(true);
      await onSubmit(dto);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title="Create Linked Action Item / Task"
      description={`Creates an actionable task linked to ${recordCompany}.`}
      size="md"
    >
      <div className="space-y-3">
        {errorMessage && (
          <div className="p-2 bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          <FormField label="Task Title" required>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Prepare architecture diagram for cloud proposal"
              className="h-8 text-xs"
            />
          </FormField>

          <FormField label="Task Description">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context, acceptance requirements, or reference links..."
              rows={2}
              className="text-xs"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Priority" required>
              <Select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="h-8 text-xs"
              >
                <option value={TaskPriority.LOW}>Low</option>
                <option value={TaskPriority.MEDIUM}>Medium</option>
                <option value={TaskPriority.HIGH}>High</option>
                <option value={TaskPriority.URGENT}>Urgent</option>
              </Select>
            </FormField>

            <FormField label="Due Date" required>
              <Input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="h-8 text-xs"
              />
            </FormField>
          </div>

          <FormField label="Assignee" required>
            <Select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="h-8 text-xs"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </Select>
          </FormField>

          <div className="pt-3 border-t border-ch-border flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-8 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-8 text-xs font-semibold bg-ch-accent text-white hover:bg-ch-accent/90"
            >
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}
