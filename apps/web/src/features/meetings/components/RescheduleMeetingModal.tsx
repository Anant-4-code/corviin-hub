import React, { useState } from 'react';
import type { MeetingItem, RescheduleMeetingDto } from '@corviin-hub/shared';
import { formatMeetingDate, formatMeetingTimeRange } from './meeting-constants';

interface RescheduleMeetingModalProps {
  isOpen: boolean;
  meeting: MeetingItem | null;
  onClose: () => void;
  onSubmit: (meetingId: string, dto: RescheduleMeetingDto) => Promise<void>;
}

export const RescheduleMeetingModal: React.FC<RescheduleMeetingModalProps> = ({
  isOpen,
  meeting,
  onClose,
  onSubmit,
}) => {
  if (!isOpen || !meeting) return null;

  const [newDate, setNewDate] = useState(meeting.date);
  const [newStartTimeStr, setNewStartTimeStr] = useState(
    meeting.startTime ? meeting.startTime.slice(11, 16) : '10:00',
  );
  const [newEndTimeStr, setNewEndTimeStr] = useState(
    meeting.endTime ? meeting.endTime.slice(11, 16) : '11:00',
  );
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!reason.trim()) {
      setError('A mandatory reason is required to reschedule a meeting.');
      return;
    }

    if (newEndTimeStr <= newStartTimeStr) {
      setError('New end time must be after new start time.');
      return;
    }

    const newStartIso = `${newDate}T${newStartTimeStr}:00.000Z`;
    const newEndIso = `${newDate}T${newEndTimeStr}:00.000Z`;

    const dto: RescheduleMeetingDto = {
      newStartTime: newStartIso,
      newEndTime: newEndIso,
      reason: reason.trim(),
      actorId: 'acting-profile',
    };

    try {
      setIsSubmitting(true);
      await onSubmit(meeting.id, dto);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to reschedule meeting.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-none">
      <div className="bg-surface border border-border rounded-lg shadow-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface-muted/30">
          <div>
            <h2 className="text-base font-semibold text-primary">Reschedule Meeting</h2>
            <p className="text-xs text-secondary mt-0.5 truncate max-w-[280px]">
              {meeting.title}
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
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-2.5 text-xs bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-md">
              {error}
            </div>
          )}

          {/* Current schedule banner */}
          <div className="p-3 rounded-md bg-surface-muted border border-border text-xs">
            <span className="font-semibold text-secondary uppercase text-[10px] block mb-0.5">
              Current Scheduled Slot
            </span>
            <div className="text-primary font-medium">
              {formatMeetingDate(meeting.date)} • {formatMeetingTimeRange(meeting.startTime, meeting.endTime)}
            </div>
          </div>

          {/* New Date */}
          <div>
            <label className="block text-xs font-semibold text-primary mb-1">
              New Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full text-sm bg-surface border border-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
            />
          </div>

          {/* New Start / End times */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-primary mb-1">
                New Start Time <span className="text-rose-500">*</span>
              </label>
              <input
                type="time"
                required
                value={newStartTimeStr}
                onChange={(e) => setNewStartTimeStr(e.target.value)}
                className="w-full text-sm bg-surface border border-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-primary mb-1">
                New End Time <span className="text-rose-500">*</span>
              </label>
              <input
                type="time"
                required
                value={newEndTimeStr}
                onChange={(e) => setNewEndTimeStr(e.target.value)}
                className="w-full text-sm bg-surface border border-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
              />
            </div>
          </div>

          {/* Mandatory reason */}
          <div>
            <label className="block text-xs font-semibold text-primary mb-1">
              Reason for Reschedule <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide a clear operational audit reason (e.g. Client requested postponement, team emergency)..."
              className="w-full text-sm bg-surface border border-border rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-3.5 py-1.5 text-xs font-medium text-secondary hover:text-primary bg-surface border border-border rounded-md hover:bg-surface-hover"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-md bg-brand-teal text-white hover:bg-brand-teal/90 disabled:opacity-50"
            >
              {isSubmitting ? 'Rescheduling...' : 'Confirm Reschedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
