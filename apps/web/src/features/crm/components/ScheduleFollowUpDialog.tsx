import { useState, useEffect } from 'react';
import { CrmRecordSummaryItem, TaskPriority } from '@corviin-hub/shared';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { AlertCircle, Clock } from 'lucide-react';
import { createCrmFollowUp } from '@/services/crm';

interface ScheduleFollowUpDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  records: CrmRecordSummaryItem[];
  preselectedRecord: CrmRecordSummaryItem | null;
  onSuccess: () => void;
}

export function ScheduleFollowUpDialog({
  isOpen,
  onClose,
  workspaceId,
  records,
  preselectedRecord,
  onSuccess,
}: ScheduleFollowUpDialogProps) {
  const [selectedRecordId, setSelectedRecordId] = useState('');
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.HIGH);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (preselectedRecord) {
      setSelectedRecordId(preselectedRecord.id);
    } else if (records.length > 0 && !selectedRecordId) {
      setSelectedRecordId(records[0].id);
    }
  }, [preselectedRecord, records]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecordId) {
      setErrorMessage('Please select a CRM record.');
      return;
    }
    if (!title.trim()) {
      setErrorMessage('Follow-up reason is required.');
      return;
    }
    if (!dueDate) {
      setErrorMessage('Due date is required.');
      return;
    }

    const rec = records.find((r) => r.id === selectedRecordId) || preselectedRecord;
    if (!rec) {
      setErrorMessage('Selected record not found.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await createCrmFollowUp(workspaceId, {
        recordId: rec.id,
        recordType: rec.type,
        title: title.trim(),
        dueDate: new Date(dueDate).toISOString(),
        priority,
        assignedMemberId: rec.assignedMemberId,
        assignedMemberName: rec.assignedMemberName,
      });

      setTitle('');
      setDueDate('');
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || err?.message || 'Failed to schedule follow-up.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} title="Schedule Structured Follow-up" size="md">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {errorMessage && (
          <div className="p-3 rounded bg-danger/10 border border-danger/30 text-danger flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <p className="text-[11px]">{errorMessage}</p>
          </div>
        )}

        {/* Record Selection */}
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

        {/* Title */}
        <div>
          <label className="text-[11px] text-ch-text-secondary block mb-1">Follow-up Reason / Action Item *</label>
          <Input
            required
            placeholder="e.g. Call to review revised payment milestones and SLA draft"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Due Date & Priority */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-ch-text-secondary block mb-1">Due Date & Time *</label>
            <Input
              type="datetime-local"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[11px] text-ch-text-secondary block mb-1">Priority</label>
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              options={[
                { value: TaskPriority.URGENT, label: 'Urgent' },
                { value: TaskPriority.HIGH, label: 'High' },
                { value: TaskPriority.MEDIUM, label: 'Medium' },
                { value: TaskPriority.LOW, label: 'Low' },
              ]}
            />
          </div>
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
            <Clock size={13} />
            <span>{isSubmitting ? 'Scheduling...' : 'Schedule Follow-up'}</span>
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

