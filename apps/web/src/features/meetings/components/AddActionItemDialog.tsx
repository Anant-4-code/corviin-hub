import React, { useState } from 'react';
import { TaskPriority } from '@corviin-hub/shared';
import type { MeetingActionItem } from '@corviin-hub/shared';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { TEAM_MEMBERS, PRIORITY_CONFIG } from './meeting-constants';

interface AddActionItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<MeetingActionItem, 'id' | 'status'>) => void;
}

export const AddActionItemDialog: React.FC<AddActionItemDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [description, setDescription] = useState('');
  const [assignedMemberId, setAssignedMemberId] = useState(TEAM_MEMBERS[0].id);
  const [dueDate, setDueDate] = useState('2026-11-08');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.HIGH);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    onSubmit({
      description: description.trim(),
      assignedMemberId,
      dueDate: dueDate ? `${dueDate}T17:00:00.000Z` : undefined,
      priority,
    });
    setDescription('');
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title="Add Action Item"
      description="Record a concrete operational commitment resulting from discussion."
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-primary mb-1">
            Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Specific deliverable resulting from discussion..."
            className="w-full text-sm bg-surface border border-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-primary mb-1">
            Assignee <span className="text-rose-500">*</span>
          </label>
          <select
            value={assignedMemberId}
            onChange={(e) => setAssignedMemberId(e.target.value)}
            className="w-full text-sm bg-surface border border-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
          >
            {TEAM_MEMBERS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.role})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-primary mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full text-sm bg-surface border border-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-primary mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full text-sm bg-surface border border-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
            >
              {Object.values(TaskPriority).map((p) => (
                <option key={p} value={p}>
                  {PRIORITY_CONFIG[p]?.label || p}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit">
            Add Action Item
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
