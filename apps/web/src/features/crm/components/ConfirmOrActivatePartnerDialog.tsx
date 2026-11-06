import React, { useState } from 'react';
import { ConfirmOrActivatePartnerDto } from '@corviin-hub/shared';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

interface ConfirmOrActivatePartnerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: ConfirmOrActivatePartnerDto) => Promise<void>;
  partnerName: string;
  defaultMode?: 'CONFIRM' | 'ACTIVATE';
}

export const ConfirmOrActivatePartnerDialog: React.FC<ConfirmOrActivatePartnerDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  partnerName,
  defaultMode = 'CONFIRM',
}) => {
  const [mode, setMode] = useState<'CONFIRM' | 'ACTIVATE'>(defaultMode);
  const [mandateType, setMandateType] = useState('Sole Selling Mandate (3% Commission)');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await onSubmit({
        mode,
        mandateType: mode === 'CONFIRM' ? mandateType : undefined,
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Operation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title={mode === 'CONFIRM' ? 'Confirm Partnership Mandate' : 'Activate Operational Partner'}
      description={`Update partnership status for ${partnerName}. Differentiate signed commercial terms from ongoing active campaigns.`}
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
            Partnership Action Mode
          </label>
          <Select
            value={mode}
            onChange={(e) => setMode(e.target.value as 'CONFIRM' | 'ACTIVATE')}
            className="text-xs"
          >
            <option value="CONFIRM">Partnership Confirmed (Mandate Signed / Terms Finalized)</option>
            <option value="ACTIVATE">Active Partner (Ongoing Operational Campaigns & Sales)</option>
          </Select>
        </div>

        {mode === 'CONFIRM' ? (
          <div>
            <label className="block text-xs font-medium text-ch-text-primary mb-1">
              Mandate / Agreement Structure
            </label>
            <Input
              placeholder="e.g. Sole Selling Mandate (3%), JV Advisory Retainer, Channel Partner Tie-up"
              value={mandateType}
              onChange={(e) => setMandateType(e.target.value)}
              className="text-xs"
            />
          </div>
        ) : (
          <div className="p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-md text-xs text-green-800 dark:text-green-300">
            Active status marks this partner as having live marketing campaigns, active unit inventories, or ongoing operational sales deliverables.
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-ch-text-primary mb-1">
            Notes & Sign-off Details
          </label>
          <Textarea
            placeholder="Record legal MoU execution date, board resolutions, or key handover points..."
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
            {isSubmitting ? 'Saving...' : mode === 'CONFIRM' ? 'Confirm Mandate' : 'Activate Partner'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
