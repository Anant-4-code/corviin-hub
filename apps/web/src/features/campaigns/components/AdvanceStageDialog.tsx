import React, { useState } from 'react';
import { CampaignItem, CampaignStage } from '@corviin-hub/shared';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { Check, AlertTriangle, ArrowRight } from 'lucide-react';

interface AdvanceStageDialogProps {
  open: boolean;
  onClose: () => void;
  campaign: CampaignItem;
  targetStage: CampaignStage;
  onConfirm: (toStage: CampaignStage, notes?: string) => Promise<void>;
}

export function AdvanceStageDialog({
  open,
  onClose,
  campaign,
  targetStage,
  onConfirm,
}: AdvanceStageDialogProps) {
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check stage prerequisites
  let isBlocked = false;
  let blockerReason = '';

  if (targetStage === CampaignStage.RECORDING_UPLOAD) {
    const hasApprovedScript =
      campaign.scriptApproved ||
      (campaign.scripts && campaign.scripts.some((s) => s.status === 'APPROVED'));
    if (!hasApprovedScript) {
      isBlocked = true;
      blockerReason = 'Script must be officially marked APPROVED in Stage 2 before entering Recording.';
    }
  } else if (targetStage === CampaignStage.EDITING_FINAL) {
    const hasFootage =
      (campaign.assetLinks &&
        campaign.assetLinks.some(
          (a) => a.category === 'RAW_FOOTAGE' || a.category === 'AUDIO_VO',
        )) ||
      (campaign.footageChecklist && campaign.footageChecklist.some((f) => f.status === 'DONE'));
    if (!hasFootage) {
      isBlocked = true;
      blockerReason = 'At least one raw footage/audio asset must be linked or footage checklist item completed.';
    }
  } else if (targetStage === CampaignStage.POSTING_COMPLETION) {
    const hasApprovedAsset =
      campaign.finalAssetApproved ||
      (campaign.assetLinks &&
        campaign.assetLinks.some(
          (a) => a.isFinalApproved || a.category === 'FINAL_APPROVED',
        ));
    if (!hasApprovedAsset) {
      isBlocked = true;
      blockerReason = 'Final edited master asset must be officially APPROVED in Stage 4 before posting.';
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBlocked) return;

    try {
      setIsSubmitting(true);
      await onConfirm(targetStage, notes.trim() || undefined);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to advance stage.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Advance Campaign Stage"
      description="Stage transitions are immutable and recorded in the permanent audit trail."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Transition Summary */}
        <div className="p-3 bg-surface-muted/50 border border-ch-border flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-ch-text-muted uppercase">From Stage</span>
            <div className="font-semibold text-ch-text-primary">{campaign.stage}</div>
          </div>
          <ArrowRight size={16} className="text-primary shrink-0" />
          <div className="text-right">
            <span className="text-[10px] font-bold text-ch-text-muted uppercase">To Stage</span>
            <div className="font-bold text-primary">{targetStage}</div>
          </div>
        </div>

        {/* Prerequisite Check Alert */}
        {isBlocked ? (
          <div className="p-3 bg-danger/10 border border-danger/30 text-danger flex items-start gap-2">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Stage Prerequisite Not Met</span>
              <span>{blockerReason}</span>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-success/10 border border-success/30 text-success flex items-center gap-2 font-medium">
            <Check size={16} className="shrink-0" />
            <span>All stage prerequisites verified. Ready to advance.</span>
          </div>
        )}

        {error && (
          <div className="p-2.5 bg-danger/10 border border-danger/30 text-danger font-medium">
            {error}
          </div>
        )}

        <FormField
          label="Stage Transition Notes (Audited)"
          description="Document reason for advancing stage or any operational sign-offs."
        >
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="e.g. Script review completed by Rohit; studio slot booked..."
            className="w-full p-2.5 bg-surface border border-ch-border text-xs text-ch-text-primary placeholder:text-ch-text-muted focus:outline-none focus:border-primary resize-none"
          />
        </FormField>

        <div className="pt-3 border-t border-ch-border flex items-center justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isBlocked || isSubmitting}
            className="gap-1.5"
          >
            <ArrowRight size={14} />
            <span>{isSubmitting ? 'Advancing...' : `Advance to ${targetStage}`}</span>
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

