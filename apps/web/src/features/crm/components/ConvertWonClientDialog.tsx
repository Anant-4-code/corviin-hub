import { useState } from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { FormField } from '@/components/ui/FormField';
import { TechCrmRecord, ConvertWonToClientDto } from '@corviin-hub/shared';

interface ConvertWonClientDialogProps {
  isOpen: boolean;
  onClose: () => void;
  record: TechCrmRecord | null;
  onSubmit: (dto: ConvertWonToClientDto) => Promise<void>;
  currentProfileName?: string;
  currentProfileId?: string;
}

export function ConvertWonClientDialog({
  isOpen,
  onClose,
  record,
  onSubmit,
  currentProfileName,
  currentProfileId,
}: ConvertWonClientDialogProps) {
  const [retainerAmount, setRetainerAmount] = useState(
    record?.estimatedBudget ? String(record.estimatedBudget) : '',
  );
  const [serviceAgreementDetails, setServiceAgreementDetails] = useState('');
  const [createProject, setCreateProject] = useState(true);
  const [projectName, setProjectName] = useState(
    record ? `${record.company} - Platform Delivery` : '',
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!record) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const dto: ConvertWonToClientDto = {
      retainerAmount: retainerAmount ? parseFloat(retainerAmount) : undefined,
      serviceAgreementDetails: serviceAgreementDetails.trim() || undefined,
      createProject,
      projectName: createProject ? projectName.trim() : undefined,
      actorId: currentProfileId,
      actorName: currentProfileName,
    };

    try {
      setIsSubmitting(true);
      await onSubmit(dto);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to convert to client.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title="Convert Won Enquiry to Client Account"
      description={`Promote ${record.company} into an active client relationship.`}
      size="md"
    >
      <div className="space-y-3">
        {/* History preservation reassurance alert */}
        <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">History Preserved:</span> All previous discussions, call logs, proposals, and linked tasks are permanently retained in this record's history.
          </div>
        </div>

        {errorMessage && (
          <div className="p-2 bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          <FormField label="Monthly Retainer / Project Value (INR)">
            <Input
              type="number"
              value={retainerAmount}
              onChange={(e) => setRetainerAmount(e.target.value)}
              placeholder="e.g. 150000"
              className="h-8 text-xs"
            />
          </FormField>

          <FormField label="Service Agreement & SLA Details">
            <Textarea
              value={serviceAgreementDetails}
              onChange={(e) => setServiceAgreementDetails(e.target.value)}
              placeholder="e.g. Signed 12-month master services agreement for Next.js engineering and cloud support."
              rows={2}
              className="text-xs"
            />
          </FormField>

          {/* Create initial project toggle */}
          <div className="p-2.5 bg-surface-raised border border-ch-border space-y-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-ch-text-primary cursor-pointer">
              <input
                type="checkbox"
                checked={createProject}
                onChange={(e) => setCreateProject(e.target.checked)}
                className="w-4 h-4 text-ch-accent rounded"
              />
              <span>Initialize Delivery Project / Workstream</span>
            </label>

            {createProject && (
              <FormField label="Initial Project Name">
                <Input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Acme FinTech - Platform Modernization"
                  className="h-8 text-xs"
                />
              </FormField>
            )}
          </div>

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
              className="h-8 text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {isSubmitting ? 'Converting...' : 'Confirm Client Conversion'}
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}
