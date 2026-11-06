import React, { useState } from 'react';
import { RealEstateBuyerStage, ChangeBuyerStageDto } from '@corviin-hub/shared';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Input } from '@/components/ui/Input';
import {
  BUYER_STAGE_ORDER,
  BUYER_ALTERNATIVE_STAGES,
  BUYER_STAGE_LABELS,
} from './buyer-crm-constants';

interface ChangeBuyerStageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: ChangeBuyerStageDto) => Promise<void>;
  currentStage: RealEstateBuyerStage;
  buyerName: string;
}

export const ChangeBuyerStageDialog: React.FC<ChangeBuyerStageDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentStage,
  buyerName,
}) => {
  const [selectedStage, setSelectedStage] = useState<RealEstateBuyerStage>(currentStage);
  const [notes, setNotes] = useState('');
  const [lostReason, setLostReason] = useState('');
  const [followUpLaterDate, setFollowUpLaterDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  React.useEffect(() => {
    setSelectedStage(currentStage);
    setNotes('');
    setLostReason('');
    setFollowUpLaterDate('');
    setErrorMsg('');
  }, [currentStage, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (selectedStage === RealEstateBuyerStage.LOST || selectedStage === RealEstateBuyerStage.NOT_INTERESTED) &&
      !lostReason.trim()
    ) {
      setErrorMsg('Please specify the reason for losing or closing this buyer enquiry.');
      return;
    }

    if (selectedStage === RealEstateBuyerStage.FOLLOW_UP_LATER && !followUpLaterDate) {
      setErrorMsg('Please specify the future follow up date.');
      return;
    }

    const dto: ChangeBuyerStageDto = {
      stage: selectedStage,
      notes: notes.trim() || undefined,
      lostReason: lostReason.trim() || undefined,
      followUpLaterDate: followUpLaterDate || undefined,
    };

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await onSubmit(dto);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update pipeline stage.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const allStages = [...BUYER_STAGE_ORDER, ...BUYER_ALTERNATIVE_STAGES];

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title="Change Buyer Stage"
      description={`Update sales journey stage for ${buyerName}.`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {errorMsg && (
          <div className="p-3 text-xs bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-md">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-ch-text-secondary mb-1">
            New Pipeline Stage *
          </label>
          <Select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value as RealEstateBuyerStage)}
            className="w-full text-xs"
          >
            <optgroup label="Linear Sales Pipeline">
              {BUYER_STAGE_ORDER.map((stage) => (
                <option key={stage} value={stage}>
                  {BUYER_STAGE_LABELS[stage]}
                </option>
              ))}
            </optgroup>
            <optgroup label="Alternative / Resolution Stages">
              {BUYER_ALTERNATIVE_STAGES.map((stage) => (
                <option key={stage} value={stage}>
                  {BUYER_STAGE_LABELS[stage]}
                </option>
              ))}
            </optgroup>
          </Select>
        </div>

        {(selectedStage === RealEstateBuyerStage.LOST || selectedStage === RealEstateBuyerStage.NOT_INTERESTED) && (
          <div>
            <label className="block text-xs font-semibold text-rose-600 dark:text-rose-400 mb-1">
              Lost / Dropped Reason *
            </label>
            <Textarea
              value={lostReason}
              onChange={(e) => setLostReason(e.target.value)}
              placeholder="e.g. Budget mismatch, purchased elsewhere, changed location preference..."
              className="w-full text-xs"
              rows={2}
            />
          </div>
        )}

        {selectedStage === RealEstateBuyerStage.FOLLOW_UP_LATER && (
          <div>
            <label className="block text-xs font-semibold text-violet-600 dark:text-violet-400 mb-1">
              Scheduled Re-engagement Date *
            </label>
            <Input
              type="date"
              value={followUpLaterDate}
              onChange={(e) => setFollowUpLaterDate(e.target.value)}
              className="w-full text-xs"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-ch-text-secondary mb-1">
            Stage Change Notes (Optional)
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Key discussion points, customer feedback, next commitments..."
            className="w-full text-xs"
            rows={2}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-ch-border">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Confirm Stage Change'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

