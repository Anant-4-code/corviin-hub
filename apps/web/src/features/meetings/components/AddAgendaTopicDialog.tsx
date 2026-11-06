import React, { useState } from 'react';
import type { MeetingAgendaTopic } from '@corviin-hub/shared';
import { TEAM_MEMBERS } from './meeting-constants';

interface AddAgendaTopicDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (topic: Omit<MeetingAgendaTopic, 'id'>) => void;
}

export const AddAgendaTopicDialog: React.FC<AddAgendaTopicDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [topic, setTopic] = useState('');
  const [ownerId, setOwnerId] = useState(TEAM_MEMBERS[0].id);
  const [timeMinutes, setTimeMinutes] = useState(15);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    onSubmit({
      topic: topic.trim(),
      ownerId,
      timeMinutes: Number(timeMinutes) || 15,
      completed: false,
    });
    setTopic('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-none">
      <div className="bg-surface border border-border rounded-lg shadow-xl max-w-md w-full overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface-muted/30">
          <h2 className="text-base font-semibold text-primary">Add Agenda Item</h2>
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
              Agenda Topic <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Discuss Q4 commission structures"
              className="w-full text-sm bg-surface border border-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-primary mb-1">Discussion Lead</label>
              <select
                value={ownerId}
                onChange={(e) => setOwnerId(e.target.value)}
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
              <label className="block text-xs font-semibold text-primary mb-1">Est. Minutes</label>
              <input
                type="number"
                min={5}
                max={180}
                value={timeMinutes}
                onChange={(e) => setTimeMinutes(Number(e.target.value))}
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
              Add to Agenda
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

