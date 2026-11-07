import React, { useState } from 'react';
import type { MeetingDecisionRecord } from '@corviin-hub/shared';
import { TEAM_MEMBERS } from './meeting-constants';
import { Dialog } from '@/components/ui/Dialog';

interface AddDecisionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (decision: Omit<MeetingDecisionRecord, 'id' | 'createdAt'>) => void;
}

export const AddDecisionDialog: React.FC<AddDecisionDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [decisionText, setDecisionText] = useState('');
  const [responsiblePersonId, setResponsiblePersonId] = useState(TEAM_MEMBERS[0].id);
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decisionText.trim()) return;

    onSubmit({
      decisionText: decisionText.trim(),
      responsiblePersonId,
      dueDate: dueDate ? `${dueDate}T17:00:00.000Z` : undefined,
      createdByName: 'Acting Profile',
    });
    setDecisionText('');
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title="Document Formal Decision"
      subtitle="Record the agreed-upon direction, policy, or technical outcome."
      size="sm"
    >
      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-primary mb-1">
            Decision Text <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={3}
            value={decisionText}
            onChange={(e) => setDecisionText(e.target.value)}
            placeholder="Record the agreed-upon direction, policy, or technical decision..."
            className="w-full text-sm bg-surface border border-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-primary mb-1">Accountable Member</label>
            <select
              value={responsiblePersonId}
              onChange={(e) => setResponsiblePersonId(e.target.value)}
              className="w-full text-sm bg-surface border border-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
            >
              {TEAM_MEMBERS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-primary mb-1">Effective By Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full text-sm bg-surface border border-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
            />
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
            Record Decision
          </button>
        </div>
      </form>
    </Dialog>
  );
};
