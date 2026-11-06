import React, { useState } from 'react';
import { TaskPriority } from '@corviin-hub/shared';
import type { MeetingActionItem } from '@corviin-hub/shared';
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

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-none">
      <div className="bg-surface border border-border rounded-lg shadow-xl max-w-md w-full overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface-muted/30">
          <h2 className="text-base font-semibold text-primary">Add Action Item</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-tertiary hover:text-primary p-1 rounded-md"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
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

          <div className="grid grid-cols-2 gap-3">
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
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-secondary hover:text-primary bg-surface border border-border rounded-md hover:bg-surface-hover"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 text-xs font-semibold rounded-md bg-brand-teal text-white hover:bg-brand-teal/90"
            >
              Add Action Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

