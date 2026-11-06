import { useState } from 'react';
import { CrmRecordSummaryItem, CrmInteractionType } from '@corviin-hub/shared';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { AlertCircle, Activity } from 'lucide-react';
import { logCrmInteraction } from '@/services/crm';

interface LogInteractionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  records: CrmRecordSummaryItem[];
  preselectedRecord: CrmRecordSummaryItem | null;
  actorName: string;
  actorId: string;
  onSuccess: () => void;
}

export function LogInteractionDialog({
  isOpen,
  onClose,
  workspaceId,
  records,
  preselectedRecord,
  actorName,
  actorId,
  onSuccess,
}: LogInteractionDialogProps) {
  const [selectedRecordId, setSelectedRecordId] = useState(
    preselectedRecord?.id || (records[0]?.id ?? ''),
  );
  const [interactionType, setInteractionType] = useState<CrmInteractionType>(CrmInteractionType.CALL);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const recId = preselectedRecord ? preselectedRecord.id : selectedRecordId;
    if (!recId) {
      setErrorMessage('Please select a CRM record.');
      return;
    }
    if (!title.trim()) {
      setErrorMessage('Title / summary is required.');
      return;
    }

    const rec = records.find((r) => r.id === recId) || preselectedRecord;
    if (!rec) {
      setErrorMessage('Record not found.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await logCrmInteraction(workspaceId, {
        recordId: rec.id,
        recordType: rec.type,
        type: interactionType,
        title: title.trim(),
        description: description.trim() || undefined,
        actorId,
        actorName,
      });

      setTitle('');
      setDescription('');
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || err?.message || 'Failed to log interaction.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} title="Log CRM Interaction" size="md">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {errorMessage && (
          <div className="p-3 rounded bg-danger/10 border border-danger/30 text-danger flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <p className="text-[11px]">{errorMessage}</p>
          </div>
        )}

        {/* Record selection */}
        <div>
          <label className="text-[11px] text-ch-text-secondary block mb-1">CRM Record *</label>
          {preselectedRecord ? (
            <div className="p-2.5 rounded bg-surface border border-ch-border font-medium text-ch-text-primary">
              {preselectedRecord.name} ({preselectedRecord.type})
            </div>
          ) : (
            <Select
              value={selectedRecordId}
              onChange={(e) => setSelectedRecordId(e.target.value)}
              options={records.map((r) => ({
                value: r.id,
                label: `${r.name} (${r.type})`,
              }))}
            />
          )}
        </div>

        {/* Interaction Type */}
        <div>
          <label className="text-[11px] text-ch-text-secondary block mb-1">Interaction Channel / Type *</label>
          <Select
            value={interactionType}
            onChange={(e) => setInteractionType(e.target.value as CrmInteractionType)}
            options={[
              { value: CrmInteractionType.CALL, label: 'Phone Call Logged' },
              { value: CrmInteractionType.MESSAGE, label: 'WhatsApp / Message Logged' },
              { value: CrmInteractionType.EMAIL, label: 'Email Correspondence' },
              { value: CrmInteractionType.NOTE, label: 'Internal Note / Update' },
              { value: CrmInteractionType.MEETING, label: 'Discussion / Meeting Completed' },
              { value: CrmInteractionType.SITE_VISIT, label: 'Site Walkthrough / Visit' },
            ]}
          />
        </div>

        {/* Title */}
        <div>
          <label className="text-[11px] text-ch-text-secondary block mb-1">Title / Interaction Summary *</label>
          <Input
            required
            placeholder="e.g. Discovery call with technical lead regarding architecture"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-[11px] text-ch-text-secondary block mb-1">Detailed Notes / Outcome</label>
          <Textarea
            rows={3}
            placeholder="Capture requirements, key questions answered, next steps agreed upon..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-ch-border">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSubmitting}
            className="gap-1.5"
          >
            <Activity size={13} />
            <span>{isSubmitting ? 'Logging...' : 'Save Interaction'}</span>
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

