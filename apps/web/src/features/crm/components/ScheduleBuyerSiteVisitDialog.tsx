import React, { useState } from 'react';
import { ScheduleBuyerSiteVisitDto } from '@corviin-hub/shared';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';

interface ScheduleBuyerSiteVisitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: ScheduleBuyerSiteVisitDto) => Promise<void>;
  buyerName: string;
  defaultProjectName?: string;
  members: Array<{ id: string; name: string }>;
  defaultResponsibleMemberId?: string;
}

export const ScheduleBuyerSiteVisitDialog: React.FC<ScheduleBuyerSiteVisitDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  buyerName,
  defaultProjectName,
  members,
  defaultResponsibleMemberId,
}) => {
  const [projectName, setProjectName] = useState(defaultProjectName || '');
  const [projectLocation, setProjectLocation] = useState('');
  const [unitNumberOrBlock, setUnitNumberOrBlock] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [startTime, setStartTime] = useState('11:00');
  const [endTime, setEndTime] = useState('12:30');
  const [responsibleMemberId, setResponsibleMemberId] = useState(
    defaultResponsibleMemberId || members[0]?.id || ''
  );
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      setProjectName(defaultProjectName || '');
      setProjectLocation('');
      setUnitNumberOrBlock('');
      setVisitDate(new Date(Date.now() + 86400000).toISOString().split('T')[0]); // tomorrow default
      setStartTime('11:00');
      setEndTime('12:30');
      setResponsibleMemberId(defaultResponsibleMemberId || members[0]?.id || '');
      setNotes('');
      setErrorMsg('');
      setIsSubmitting(false);
    }
  }, [isOpen, defaultProjectName, defaultResponsibleMemberId, members]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) {
      setErrorMsg('Project name is required.');
      return;
    }
    if (!visitDate) {
      setErrorMsg('Visit date is required.');
      return;
    }
    if (!startTime) {
      setErrorMsg('Start time is required.');
      return;
    }
    if (!responsibleMemberId) {
      setErrorMsg('Please select a responsible member to accompany the buyer.');
      return;
    }

    const dto: ScheduleBuyerSiteVisitDto = {
      projectName: projectName.trim(),
      projectLocation: projectLocation.trim() || 'Project Site',
      propertyUnit: unitNumberOrBlock.trim() || undefined,
      visitDate,
      startTime,
      endTime: endTime || '12:30',
      responsibleMemberId,
      notes: notes.trim() || undefined,
    };

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await onSubmit(dto);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to schedule site visit.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title="Schedule Property Site Visit"
      description={`Plan an on-site property tour for ${buyerName}. Automatically synchronizes with the Meetings & Visits Calendar.`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-3 pt-2">
        {errorMsg && (
          <div className="p-3 text-xs bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-md">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-ch-text-secondary mb-1">
              Project Name *
            </label>
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. Prestige Meridian Heights"
              className="w-full text-xs"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ch-text-secondary mb-1">
              Location / Landmark
            </label>
            <Input
              value={projectLocation}
              onChange={(e) => setProjectLocation(e.target.value)}
              placeholder="e.g. Sarjapur Main Road, Bangalore"
              className="w-full text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-ch-text-secondary mb-1">
              Visit Date *
            </label>
            <Input
              type="date"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              className="w-full text-xs"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ch-text-secondary mb-1">
              Start Time *
            </label>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full text-xs"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ch-text-secondary mb-1">
              End Time
            </label>
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-ch-text-secondary mb-1">
              Sample Flat / Unit / Tower
            </label>
            <Input
              value={unitNumberOrBlock}
              onChange={(e) => setUnitNumberOrBlock(e.target.value)}
              placeholder="e.g. Tower B - Show Unit 402"
              className="w-full text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ch-text-secondary mb-1">
              Escorting Team Member *
            </label>
            <Select
              value={responsibleMemberId}
              onChange={(e) => setResponsibleMemberId(e.target.value)}
              className="w-full text-xs"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ch-text-secondary mb-1">
            Site Visit Instructions & Notes
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Cab pickup details, family members attending, key amenities to showcase..."
            className="w-full text-xs"
            rows={2}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-ch-border">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Scheduling...' : 'Schedule Site Visit'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
