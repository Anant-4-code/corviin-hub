import React, { useState } from 'react';
import { AddPartnerProjectDto } from '@corviin-hub/shared';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

interface AddPartnerProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: AddPartnerProjectDto) => Promise<void>;
  partnerName: string;
  defaultLocation?: string;
}

export const AddPartnerProjectDialog: React.FC<AddPartnerProjectDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  partnerName,
  defaultLocation = '',
}) => {
  const [name, setName] = useState('');
  const [projectType, setProjectType] = useState<'RESIDENTIAL' | 'COMMERCIAL' | 'PLOTTED_DEVELOPMENT' | 'LUXURY_VILLAS' | 'MIXED_USE'>('RESIDENTIAL');
  const [location, setLocation] = useState(defaultLocation);
  const [reraNumber, setReraNumber] = useState('');
  const [totalUnitsOrAcres, setTotalUnitsOrAcres] = useState('');
  const [status, setStatus] = useState<'UPCOMING' | 'UNDER_CONSTRUCTION' | 'READY_TO_MOVE' | 'COMPLETED'>('UNDER_CONSTRUCTION');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Project name is required.');
      return;
    }

    const dto: AddPartnerProjectDto = {
      name: name.trim(),
      projectType,
      location: location.trim() || 'Maharashtra',
      reraNumber: reraNumber.trim() || undefined,
      totalUnitsOrAcres: totalUnitsOrAcres.trim() || undefined,
      status,
    };

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await onSubmit(dto);
      setName('');
      setReraNumber('');
      setTotalUnitsOrAcres('');
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to add project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title="Add Project Development"
      description={`Add a property development or land asset associated with ${partnerName}.`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-3 pt-2">
        {errorMsg && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded text-xs text-rose-700 dark:text-rose-300">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-ch-text-primary mb-1">
            Project Name <span className="text-rose-500">*</span>
          </label>
          <Input
            placeholder="e.g. Emerald Heights Luxury Villas"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="text-xs"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-ch-text-primary mb-1">
              Development Type
            </label>
            <Select
              value={projectType}
              onChange={(e) => setProjectType(e.target.value as any)}
              className="text-xs"
            >
              <option value="RESIDENTIAL">Residential Apartment</option>
              <option value="LUXURY_VILLAS">Luxury Villas</option>
              <option value="COMMERCIAL">Commercial / Office</option>
              <option value="PLOTTED_DEVELOPMENT">Plotted Development / Land</option>
              <option value="MIXED_USE">Mixed Use</option>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-medium text-ch-text-primary mb-1">
              Project Status
            </label>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="text-xs"
            >
              <option value="UPCOMING">Upcoming / Pre-launch</option>
              <option value="UNDER_CONSTRUCTION">Under Construction</option>
              <option value="READY_TO_MOVE">Ready to Move</option>
              <option value="COMPLETED">Completed</option>
            </Select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-ch-text-primary mb-1">
            Location / Micro-market
          </label>
          <Input
            placeholder="e.g. Awas Road, Alibaug or Worli Sea Face, Mumbai"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="text-xs"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-ch-text-primary mb-1">
              RERA Registration Number
            </label>
            <Input
              placeholder="e.g. P52000018902"
              value={reraNumber}
              onChange={(e) => setReraNumber(e.target.value)}
              className="text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ch-text-primary mb-1">
              Inventory / Acreage
            </label>
            <Input
              placeholder="e.g. 45 Units or 15 Acres"
              value={totalUnitsOrAcres}
              onChange={(e) => setTotalUnitsOrAcres(e.target.value)}
              className="text-xs"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-ch-border">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Project'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
