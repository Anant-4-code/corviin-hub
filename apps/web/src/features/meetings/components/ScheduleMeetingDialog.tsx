import React, { useState } from 'react';
import { MeetingCategory } from '@corviin-hub/shared';
import type { CreateMeetingDto } from '@corviin-hub/shared';
import { MEETING_CATEGORY_CONFIG, TEAM_MEMBERS } from './meeting-constants';

interface ScheduleMeetingDialogProps {
  isOpen: boolean;
  workspaceId: string;
  onClose: () => void;
  onSubmit: (dto: CreateMeetingDto) => Promise<void>;
}

export const ScheduleMeetingDialog: React.FC<ScheduleMeetingDialogProps> = ({
  isOpen,
  workspaceId,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MeetingCategory>(MeetingCategory.CLIENT);
  const [date, setDate] = useState('2026-11-06');
  const [startTimeStr, setStartTimeStr] = useState('10:00');
  const [endTimeStr, setEndTimeStr] = useState('11:00');
  const [organiserId, setOrganiserId] = useState(TEAM_MEMBERS[0].id);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([TEAM_MEMBERS[0].id]);
  const [externalAttendees, setExternalAttendees] = useState('');
  const [meetingUrl, setMeetingUrl] = useState('');
  const [location, setLocation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [agenda, setAgenda] = useState('');
  const [prepNotes, setPrepNotes] = useState('');
  const [relatedTitle, setRelatedTitle] = useState('');
  const [relatedType, setRelatedType] = useState<'client' | 'lead' | 'buyer' | 'project' | 'campaign'>('client');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleToggleParticipant = (memberId: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Meeting title is required.');
      return;
    }

    if (!date) {
      setError('Date is required.');
      return;
    }

    if (endTimeStr <= startTimeStr) {
      setError('End time must be after start time.');
      return;
    }

    const startIso = `${date}T${startTimeStr}:00.000Z`;
    const endIso = `${date}T${endTimeStr}:00.000Z`;

    const parsedExternal = externalAttendees
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const dto: CreateMeetingDto = {
      workspaceId,
      title: title.trim(),
      category,
      date,
      startTime: startIso,
      endTime: endIso,
      organiserId,
      participantIds: selectedParticipants.length > 0 ? selectedParticipants : [organiserId],
      externalParticipants: parsedExternal.length > 0 ? parsedExternal : undefined,
      meetingUrl: meetingUrl.trim() || undefined,
      location: location.trim() || undefined,
      phoneNumber: phoneNumber.trim() || undefined,
      agenda: agenda.trim() || undefined,
      preparation: prepNotes.trim()
        ? {
            background: prepNotes.trim(),
          }
        : undefined,
      linkedRecord: relatedTitle.trim()
        ? {
            id: `rec-${Date.now()}`,
            title: relatedTitle.trim(),
            type: relatedType,
          }
        : undefined,
    };

    try {
      setIsSubmitting(true);
      await onSubmit(dto);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to schedule meeting.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-none">
      <div className="bg-surface border border-border rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-muted/30">
          <div>
            <h2 className="text-base font-semibold text-primary">Schedule Meeting</h2>
            <p className="text-xs text-secondary mt-0.5">
              Create an operational meeting record with agenda, preparation, and participants.
            </p>
          </div>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-md">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-primary mb-1">
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. NexaCorp Architecture Review or Sobha Commercial Terms"
              className="w-full text-sm bg-surface border border-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
            />
          </div>

          {/* Type & Organiser */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-primary mb-1">
                Meeting Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MeetingCategory)}
                className="w-full text-sm bg-surface border border-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
              >
                {Object.values(MeetingCategory).map((cat) => (
                  <option key={cat} value={cat}>
                    {MEETING_CATEGORY_CONFIG[cat]?.label || cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-primary mb-1">
                Organiser <span className="text-rose-500">*</span>
              </label>
              <select
                value={organiserId}
                onChange={(e) => setOrganiserId(e.target.value)}
                className="w-full text-sm bg-surface border border-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
              >
                {TEAM_MEMBERS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Time Range */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-primary mb-1">
                Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-sm bg-surface border border-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-primary mb-1">
                Start Time <span className="text-rose-500">*</span>
              </label>
              <input
                type="time"
                required
                value={startTimeStr}
                onChange={(e) => setStartTimeStr(e.target.value)}
                className="w-full text-sm bg-surface border border-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-primary mb-1">
                End Time <span className="text-rose-500">*</span>
              </label>
              <input
                type="time"
                required
                value={endTimeStr}
                onChange={(e) => setEndTimeStr(e.target.value)}
                className="w-full text-sm bg-surface border border-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
              />
            </div>
          </div>

          {/* Internal Participants */}
          <div>
            <label className="block text-xs font-semibold text-primary mb-1">Internal Team Participants</label>
            <div className="flex flex-wrap gap-2">
              {TEAM_MEMBERS.map((m) => {
                const isSelected = selectedParticipants.includes(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleToggleParticipant(m.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md border text-left ${
                      isSelected
                        ? 'bg-brand-teal/15 text-brand-teal border-brand-teal/40'
                        : 'bg-surface-muted text-secondary border-border hover:bg-surface-hover'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {m.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* External Participants (no CORVIIN HUB account needed) */}
          <div>
            <label className="block text-xs font-semibold text-primary mb-1">
              External Attendees (Optional, separated by comma)
            </label>
            <input
              type="text"
              value={externalAttendees}
              onChange={(e) => setExternalAttendees(e.target.value)}
              placeholder="e.g. client@example.com, john.smith@partner.io"
              className="w-full text-sm bg-surface border border-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
            />
          </div>

          {/* Online URL, Location & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-primary mb-1">Meeting URL</label>
              <input
                type="url"
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
                placeholder="https://meet.google.com/xyz"
                className="w-full text-sm bg-surface border border-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-primary mb-1">Physical Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Meeting Room B or Office"
                className="w-full text-sm bg-surface border border-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-primary mb-1">Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91-98765-43210"
                className="w-full text-sm bg-surface border border-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
              />
            </div>
          </div>

          {/* Linked CRM or Project record */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-primary mb-1">Related Record Title</label>
              <input
                type="text"
                value={relatedTitle}
                onChange={(e) => setRelatedTitle(e.target.value)}
                placeholder="e.g. NexaCorp Solutions Lead or Sobha Dream Acres"
                className="w-full text-sm bg-surface border border-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-primary mb-1">Record Type</label>
              <select
                value={relatedType}
                onChange={(e) => setRelatedType(e.target.value as any)}
                className="w-full text-sm bg-surface border border-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
              >
                <option value="client">Client</option>
                <option value="lead">Lead</option>
                <option value="buyer">Buyer</option>
                <option value="project">Project</option>
                <option value="campaign">Campaign</option>
              </select>
            </div>
          </div>

          {/* Agenda & Preparation */}
          <div>
            <label className="block text-xs font-semibold text-primary mb-1">Agenda & Objective</label>
            <textarea
              rows={2}
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
              placeholder="Outline discussion items and session objective..."
              className="w-full text-sm bg-surface border border-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary mb-1">Preparation Notes</label>
            <textarea
              rows={2}
              value={prepNotes}
              onChange={(e) => setPrepNotes(e.target.value)}
              placeholder="Background context, required documents, or questions to address..."
              className="w-full text-sm bg-surface border border-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-secondary hover:text-primary bg-surface border border-border rounded-md hover:bg-surface-hover"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-semibold rounded-md bg-brand-teal text-white hover:bg-brand-teal/90 disabled:opacity-50"
            >
              {isSubmitting ? 'Scheduling...' : 'Schedule Meeting'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

