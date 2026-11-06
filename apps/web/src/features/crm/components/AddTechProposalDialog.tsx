import { useState } from 'react';
import { FileText } from 'lucide-react';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { FormField } from '@/components/ui/FormField';
import { AddTechProposalDto } from '@corviin-hub/shared';

interface AddTechProposalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  recordCompany: string;
  onSubmit: (dto: AddTechProposalDto) => Promise<void>;
}

export function AddTechProposalDialog({
  isOpen,
  onClose,
  recordCompany,
  onSubmit,
}: AddTechProposalDialogProps) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED'>('SENT');
  const [referenceUrl, setReferenceUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('Proposal title is required.');
      return;
    }

    const dto: AddTechProposalDto = {
      title: title.trim(),
      amount: amount ? parseFloat(amount) : undefined,
      status,
      referenceUrl: referenceUrl.trim() || undefined,
    };

    try {
      setIsSubmitting(true);
      await onSubmit(dto);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to add proposal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title="Add Proposal / Quotation Reference"
      description={`Track commercial quotes and scope agreements for ${recordCompany}.`}
      size="md"
    >
      <div className="space-y-3">
        {errorMessage && (
          <div className="p-2 bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          <FormField label="Proposal Title / Document Name" required>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Cloud Modernization Scope Proposal v1.0"
              className="h-8 text-xs"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Quotation Amount (INR)">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 450000"
                className="h-8 text-xs"
              />
            </FormField>

            <FormField label="Status" required>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="h-8 text-xs"
              >
                <option value="DRAFT">Draft</option>
                <option value="SENT">Sent to Client</option>
                <option value="ACCEPTED">Accepted / Approved</option>
                <option value="REJECTED">Rejected</option>
              </Select>
            </FormField>
          </div>

          <FormField label="Document / Public Link (URL)">
            <Input
              value={referenceUrl}
              onChange={(e) => setReferenceUrl(e.target.value)}
              placeholder="https://docs.corviin.tech/..."
              className="h-8 text-xs"
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
              {isSubmitting ? 'Saving...' : 'Add Proposal'}
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}
