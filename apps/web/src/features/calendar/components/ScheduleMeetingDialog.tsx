import React, { useState } from 'react';
import { CreateMeetingDto, MeetingCategory } from '@corviin-hub/shared';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Video, Calendar, Clock, MapPin, Phone } from 'lucide-react';

interface MemberOption {
  id: string;
  displayName: string;
}

interface ScheduleMeetingDialogProps {
  open: boolean;
  onClose: () => void;
  workspaceId: string;
  members: MemberOption[];
  onSchedule: (dto: CreateMeetingDto) => Promise<void>;
}

export function ScheduleMeetingDialog({
  open,
  onClose,
  workspaceId,
  members,
  onSchedule,
}: ScheduleMeetingDialogProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MeetingCategory>(MeetingCategory.INTERNAL);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [organiserId, setOrganiserId] = useState(() => members[0]?.id || '');
  const [meetingUrl, setMeetingUrl] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [agenda, setAgenda] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Meeting title is required.');
      return;
    }

    const startIso = `${date}T${startTime}:00.000Z`;
    const endIso = `${date}T${endTime}:00.000Z`;

    if (new Date(endIso) <= new Date(startIso)) {
      setError('End time must be after start time.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSchedule({
        workspaceId,
        title: title.trim(),
        category,
        date,
        startTime: startIso,
        endTime: endIso,
        organiserId: organiserId || members[0]?.id || 'acting-profile',
        participantIds: [organiserId || members[0]?.id || 'acting-profile'],
        meetingUrl: meetingUrl.trim() || undefined,
        phoneNumber: phoneNumber.trim() || undefined,
        location: location.trim() || undefined,
        agenda: agenda.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to schedule meeting.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Schedule Team or Client Meeting"
      description="Create a calendar meeting linked to active workspace participants."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        {error && (
          <div className="p-2.5 bg-danger/10 border border-danger/30 text-danger text-xs font-medium">
            {error}
          </div>
        )}

        <FormField label="Meeting Title *" required>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Architecture Alignment & Token Review"
            required
            className="text-xs"
          />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Category *">
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value as MeetingCategory)}
              className="text-xs"
            >
              <option value={MeetingCategory.INTERNAL}>Internal Team</option>
              <option value={MeetingCategory.CLIENT}>Client Discovery</option>
              <option value={MeetingCategory.PARTNER}>Partner / Vendor</option>
              <option value={MeetingCategory.BUYER}>Buyer Consultation</option>
              <option value={MeetingCategory.ONLINE}>Online / Video Only</option>
              <option value={MeetingCategory.OTHER}>Other</option>
            </Select>
          </FormField>

          <FormField label="Organiser *">
            <Select
              value={organiserId}
              onChange={(e) => setOrganiserId(e.target.value)}
              className="text-xs"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.displayName}
                </option>
              ))}
            </Select>
          </FormField>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <FormField label="Date *">
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="text-xs font-mono"
            />
          </FormField>

          <FormField label="Start Time *">
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              className="text-xs font-mono"
            />
          </FormField>

          <FormField label="End Time *">
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              className="text-xs font-mono"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Meeting URL (Google Meet / Zoom)">
            <Input
              value={meetingUrl}
              onChange={(e) => setMeetingUrl(e.target.value)}
              placeholder="https://meet.google.com/..."
              className="text-xs font-mono"
            />
          </FormField>

          <FormField label="Phone Number">
            <Input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+91-98450-..."
              className="text-xs font-mono"
            />
          </FormField>
        </div>

        <FormField label="Physical Location / Office Room">
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Conference Room B or client office address"
            className="text-xs"
          />
        </FormField>

        <FormField label="Agenda & Meeting Objectives">
          <textarea
            value={agenda}
            onChange={(e) => setAgenda(e.target.value)}
            rows={2}
            placeholder="Key discussion points, expected outcomes, preparation needed..."
            className="w-full p-2 bg-surface border border-ch-border text-xs text-ch-text-primary placeholder:text-ch-text-muted focus:outline-none focus:border-primary resize-none"
          />
        </FormField>

        <div className="pt-3 border-t border-ch-border flex items-center justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose} className="text-xs">
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" disabled={isSubmitting} className="text-xs">
            {isSubmitting ? 'Scheduling...' : 'Confirm Meeting'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

