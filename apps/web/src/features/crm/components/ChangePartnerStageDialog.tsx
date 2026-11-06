import React, { useState } from 'react';
import { RealEstatePartnerStage, ChangePartnerStageDto } from '@corviin-hub/shared';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import {
  PARTNER_STAGE_ORDER,
  PARTNER_ALTERNATIVE_STAGES,
  PARTNER_STAGE_LABELS,
} from './partner-crm-constants';

interface ChangePartnerStageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentStage: RealEstatePartnerStage;
  onSubmit: (dto: ChangePartnerStageDto) => Promise<void>;
  partnerName: string;
}

export const ChangePartnerStageDialog: React.FC<ChangePartnerStageDialogProps> = ({
  isOpen,
  onClose,
  currentStage,
  onSubmit,
  partnerName,
}) => {
  const [selectedStage, setSelectedStage] = useState<RealEstatePartnerStage>(currentStage);
  const [notes, setNotes] = useState('');
  const [lostReason, setLostReason] = useState('');
  const [followUpLaterDate, setFollowUpLaterDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isLostOrNotInterested =
    selectedStage === RealEstatePartnerStage.LOST ||
    selectedStage === RealEstatePartnerStage.NOT_INTERESTED;

  const isFollowUpLater = selectedStage === RealEstatePartnerStage.FOLLOW_UP_LATER;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLostOrNotInterested && !lostReason.trim() && !notes.trim()) {
      setErrorMsg('A reason or explanatory note is required when marking a partner as Lost or Not Interested.');
      return;
    }

    if (isFollowUpLater && !followUpLaterDate) {
      setErrorMsg('A scheduled next-action date is required when moving to Follow Up Later stage.');
      return;
    }

    const dto: ChangePartnerStageDto = {
      stage: selectedStage,
      notes: notes.trim() || undefined,
      lostReason: isLostOrNotInterested ? (lostReason.trim() || notes.trim()) : undefined,
      followUpLaterDate: isFollowUpLater ? followUpLaterDate : undefined,
    };

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await onSubmit(dto);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update partner stage.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title="Change Partnership Stage"
      description={`Update the pipeline stage and log an audit history entry for ${partnerName}.`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {errorMsg && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded text-xs text-rose-700 dark:text-rose-300">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-ch-text-primary mb-1">
            Target Pipeline Stage <span className="text-rose-500">*</span>
          </label>
          <Select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value as RealEstatePartnerStage)}
            className="text-xs"
          >
            <optgroup label="Active Progression">
              {PARTNER_STAGE_ORDER.map((st) => (
                <option key={st} value={st}>
                  {PARTNER_STAGE_LABELS[st]}
                </option>
              ))}
            </optgroup>
            <optgroup label="Alternative / Inactive">
              {PARTNER_ALTERNATIVE_STAGES.map((st) => (
                <option key={st} value={st}>
                  {PARTNER_STAGE_LABELS[st]}
                </option>
              ))}
            </optgroup>
          </Select>
        </div>

        {/* Reason for Lost / Not Interested */}
        {isLostOrNotInterested && (
          <div>
            <label className="block text-xs font-medium text-ch-text-primary mb-1">
              Reason for Lost / Not Interested <span className="text-rose-500">*</span>
            </label>
            <Input
              placeholder="e.g. Developer selected in-house sales team, land title dispute..."
              value={lostReason}
              onChange={(e) => setLostReason(e.target.value)}
              required
              className="text-xs"
            />
          </div>
        )}

        {/* Follow-up Later Next Action Date */}
        {isFollowUpLater && (
          <div>
            <label className="block text-xs font-medium text-ch-text-primary mb-1">
              Next Action Date <span className="text-rose-500">*</span>
            </label>
            <Input
              type="date"
              value={followUpLaterDate}
              onChange={(e) => setFollowUpLaterDate(e.target.value)}
              required
              className="text-xs"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-ch-text-primary mb-1">
            Stage Change Notes & Remarks
          </label>
          <Textarea
            placeholder="Record decisions, meeting outcomes, or context for this transition..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="text-xs"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-ch-border">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Confirm Stage Change'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
