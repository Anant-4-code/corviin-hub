import React, { useState } from 'react';
import type { MeetingAgendaTopic } from '@corviin-hub/shared';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
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
    <Dialog
      open={isOpen}
      onClose={onClose}
      title="Add Agenda Item"
      description="Define an agenda topic, discussion lead, and allocated minutes."
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit">
            Add to Agenda
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
