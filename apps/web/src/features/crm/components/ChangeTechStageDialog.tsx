import { useState, useEffect } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { FormField } from '@/components/ui/FormField';
import {
  TechPipelineStage,
  ChangeTechStageDto,
  TechCrmRecord,
} from '@corviin-hub/shared';
import {
  TECH_STAGE_LABELS,
  TECH_PIPELINE_STAGES_ORDER,
} from './tech-crm-constants';

interface ChangeTechStageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  record: TechCrmRecord | null;
  onSubmit: (dto: ChangeTechStageDto) => Promise<void>;
  currentProfileName?: string;
  currentProfileId?: string;
}

export function ChangeTechStageDialog({
  isOpen,
  onClose,
  record,
  onSubmit,
  currentProfileName,
  currentProfileId,
}: ChangeTechStageDialogProps) {
  const [targetStage, setTargetStage] = useState<TechPipelineStage>(
    record?.stage || TechPipelineStage.NEW_ENQUIRY,
  );
  const [notes, setNotes] = useState('');
  const [lostReason, setLostReason] = useState('');
  const [followUpLaterDate, setFollowUpLaterDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (record) {
      setTargetStage(record.stage);
      setNotes('');
      setLostReason('');
      const defaultLater = new Date(Date.now() + 14 * 86400000)
        .toISOString()
        .slice(0, 10);
      setFollowUpLaterDate(defaultLater);
      setErrorMessage('');
    }
  }, [record, isOpen]);

  if (!record) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (targetStage === TechPipelineStage.LOST && !lostReason.trim()) {
      setErrorMessage('Please provide a reason why this opportunity was lost.');
      return;
    }

    if (targetStage === TechPipelineStage.FOLLOW_UP_LATER && !followUpLaterDate) {
      setErrorMessage('Please select a scheduled follow-up date.');
      return;
    }

    const dto: ChangeTechStageDto = {
      stage: targetStage,
      notes: notes.trim() || undefined,
      lostReason: targetStage === TechPipelineStage.LOST ? lostReason.trim() : undefined,
      followUpLaterDate:
        targetStage === TechPipelineStage.FOLLOW_UP_LATER
          ? new Date(followUpLaterDate).toISOString()
          : undefined,
      actorId: currentProfileId,
      actorName: currentProfileName,
    };

    try {
      setIsSubmitting(true);
      await onSubmit(dto);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update stage.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title="Change Pipeline Stage"
      description={`Updating pipeline position for ${record.company}.`}
      size="md"
    >
      <div className="space-y-3">
        {errorMessage && (
          <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          <FormField label="Target Pipeline Stage" required>
            <Select
              value={targetStage}
              onChange={(e) => setTargetStage(e.target.value as TechPipelineStage)}
              className="h-8 text-xs"
            >
              {TECH_PIPELINE_STAGES_ORDER.map((stage) => (
                <option key={stage} value={stage}>
                  {TECH_STAGE_LABELS[stage]}
                </option>
              ))}
            </Select>
          </FormField>

          {/* Conditional Lost Reason */}
          {targetStage === TechPipelineStage.LOST && (
            <FormField label="Reason Lost" required>
              <Textarea
                value={lostReason}
                onChange={(e) => setLostReason(e.target.value)}
                placeholder="e.g. Budget mismatch, built in-house, chose competitor..."
                rows={2}
                className="text-xs"
              />
            </FormField>
          )}

          {/* Conditional Follow Up Later Date */}
          {targetStage === TechPipelineStage.FOLLOW_UP_LATER && (
            <FormField label="Follow Up Later Target Date" required>
              <Input
                type="date"
                value={followUpLaterDate}
                onChange={(e) => setFollowUpLaterDate(e.target.value)}
                className="h-8 text-xs"
              />
            </FormField>
          )}

          <FormField label="Stage Transition Notes">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Context regarding decision, discussion outcome, or next steps..."
              rows={2}
              className="text-xs"
            />
          </FormField>

          <div className="pt-3 border-t border-ch-border flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-8 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-8 text-xs font-semibold bg-ch-accent text-white hover:bg-ch-accent/90"
            >
              {isSubmitting ? 'Updating...' : 'Update Stage'}
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}
