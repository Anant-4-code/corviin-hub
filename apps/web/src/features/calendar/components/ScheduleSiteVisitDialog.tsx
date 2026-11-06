import React, { useState } from 'react';
import { CreateSiteVisitDto } from '@corviin-hub/shared';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Building2 } from 'lucide-react';

interface MemberOption {
  id: string;
  displayName: string;
}

interface ScheduleSiteVisitDialogProps {
  open: boolean;
  onClose: () => void;
  workspaceId: string;
  members: MemberOption[];
  onSchedule: (dto: CreateSiteVisitDto) => Promise<void>;
}

export function ScheduleSiteVisitDialog({
  open,
  onClose,
  workspaceId,
  members,
  onSchedule,
}: ScheduleSiteVisitDialogProps) {
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectLocation, setProjectLocation] = useState('');
  const [propertyUnit, setPropertyUnit] = useState('');
  const [visitDate, setVisitDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('15:30');
  const [responsibleMemberId, setResponsibleMemberId] = useState(() => members[0]?.id || '');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!buyerName.trim() || !projectName.trim()) {
      setError('Buyer name and project name are required.');
      return;
    }

    const startIso = `${visitDate}T${startTime}:00.000Z`;
    const endIso = `${visitDate}T${endTime}:00.000Z`;

    if (new Date(endIso) <= new Date(startIso)) {
      setError('End time must be after start time.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSchedule({
        workspaceId,
        buyerName: buyerName.trim(),
        buyerPhone: buyerPhone.trim() || undefined,
        projectName: projectName.trim(),
        projectLocation: projectLocation.trim() || 'Bangalore Property Site',
        propertyUnit: propertyUnit.trim() || undefined,
        visitDate,
        startTime: startIso,
        endTime: endIso,
        responsibleMemberId: responsibleMemberId || members[0]?.id || 'acting-profile',
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to schedule property site visit.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Schedule Property Site Visit"
      description="Book a physical site inspection or villa walkthrough with prospective buyers."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        {error && (
          <div className="p-2.5 bg-danger/10 border border-danger/30 text-danger text-xs font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Buyer Name *" required>
            <Input
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              placeholder="e.g. Vikram & Sunita Sharma"
              required
              className="text-xs"
            />
          </FormField>

          <FormField label="Buyer Phone Number">
            <Input
              value={buyerPhone}
              onChange={(e) => setBuyerPhone(e.target.value)}
              placeholder="+91-98450-..."
              className="text-xs font-mono"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Project / Community *" required>
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. Sobha Dream Acres"
              required
              className="text-xs"
            />
          </FormField>

          <FormField label="Unit / Villa Specification">
            <Input
              value={propertyUnit}
              onChange={(e) => setPropertyUnit(e.target.value)}
              placeholder="e.g. Villa #14 (4BHK East-facing)"
              className="text-xs"
            />
          </FormField>
        </div>

        <FormField label="Site Address / Location">
          <Input
            value={projectLocation}
            onChange={(e) => setProjectLocation(e.target.value)}
            placeholder="e.g. Panathur Main Road, Balagere, Bangalore"
            className="text-xs"
          />
        </FormField>

        <div className="grid grid-cols-3 gap-2">
          <FormField label="Visit Date *">
            <Input
              type="date"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
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

        <FormField label="Responsible Property Advisor *">
          <Select
            value={responsibleMemberId}
            onChange={(e) => setResponsibleMemberId(e.target.value)}
            className="text-xs"
          >
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.displayName}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Visit Notes & Preparation Checklist">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Amenities to highlight, printed brochures needed, payment plans..."
            className="w-full p-2 bg-surface border border-ch-border text-xs text-ch-text-primary placeholder:text-ch-text-muted focus:outline-none focus:border-primary resize-none"
          />
        </FormField>

        <div className="pt-3 border-t border-ch-border flex items-center justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose} className="text-xs">
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" disabled={isSubmitting} className="text-xs">
            {isSubmitting ? 'Scheduling...' : 'Confirm Site Visit'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

