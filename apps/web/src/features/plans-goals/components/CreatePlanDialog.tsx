import React, { useState } from 'react';
import { CreatePlanDto, TaskPriority, type GoalItem } from '@corviin-hub/shared';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { FormField } from '@/components/ui/FormField';
import { useProfiles } from '@/hooks/useProfiles';
import { useAppStore } from '@/lib/store';
import { Plus, Trash2 } from 'lucide-react';

interface CreatePlanDialogProps {
  goals: GoalItem[];
  preselectedGoalId?: string;
  open: boolean;
  onClose: () => void;
  onCreate: (dto: CreatePlanDto) => Promise<void>;
}

export function CreatePlanDialog({
  goals,
  preselectedGoalId,
  open,
  onClose,
  onCreate,
}: CreatePlanDialogProps) {
  const { data: profiles = [] } = useProfiles();
  const selectedProfileId = useAppStore((s) => s.selectedProfileId);
  const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);
  const defaultOwnerId = selectedProfileId || profiles[0]?.id || '';

  const [title, setTitle] = useState('');
  const [strategySummary, setStrategySummary] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [goalId, setGoalId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);

  // Milestones
  const [milestones, setMilestones] = useState<Array<{ title: string; dueDate: string }>>([]);
  const [newMlsTitle, setNewMlsTitle] = useState('');
  const [newMlsDueDate, setNewMlsDueDate] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (open) {
      setTitle('');
      setStrategySummary('');
      setOwnerId(defaultOwnerId);
      setGoalId(preselectedGoalId || '');
      setPriority(TaskPriority.MEDIUM);

      const today = new Date();
      const inTwoMonths = new Date();
      inTwoMonths.setMonth(today.getMonth() + 2);
      const pad = (n: number) => String(n).padStart(2, '0');
      setStartDate(`${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`);
      setTargetDate(`${inTwoMonths.getFullYear()}-${pad(inTwoMonths.getMonth() + 1)}-${pad(inTwoMonths.getDate())}`);

      setMilestones([]);
      setNewMlsTitle('');
      setNewMlsDueDate('');
      setError('');
    }
  }, [open, preselectedGoalId, defaultOwnerId]);

  const handleAddMilestone = () => {
    if (!newMlsTitle.trim() || !newMlsDueDate) return;
    setMilestones((prev) => [...prev, { title: newMlsTitle.trim(), dueDate: newMlsDueDate }]);
    setNewMlsTitle('');
    setNewMlsDueDate('');
  };

  const handleRemoveMilestone = (idx: number) => {
    setMilestones((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Plan title is required.');
      return;
    }
    if (!strategySummary.trim()) {
      setError('Strategy summary is required.');
      return;
    }
    if (!startDate || !targetDate) {
      setError('Start and target dates are required.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await onCreate({
        workspaceId: selectedWorkspaceId || 'ws-tech-0001-0000-000000000001',
        title: title.trim(),
        strategySummary: strategySummary.trim(),
        ownerId: ownerId || selectedProfileId || 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        goalId: goalId || undefined,
        startDate: new Date(startDate).toISOString(),
        targetDate: new Date(targetDate).toISOString(),
        priority,
        milestones: milestones.map((m) => ({
          title: m.title,
          dueDate: new Date(m.dueDate).toISOString(),
        })),
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to create plan.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Create Execution Plan"
      description="Define an operational approach, strategy, and milestone checkpoints supporting strategic goals."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
        {error && (
          <div className="p-3 text-xs bg-danger/10 border border-danger/20 text-danger rounded">
            {error}
          </div>
        )}

        <FormField label="Plan Title" required>
          <Input
            placeholder="e.g. Enterprise Outbound Tech Acquisition Sprint"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />
        </FormField>

        <FormField label="Supporting Strategic Goal (Optional)">
          <Select
            value={goalId}
            onChange={(e) => setGoalId(e.target.value)}
            options={[
              { value: '', label: 'None (Standalone Execution Plan)' },
              ...goals.map((g) => ({
                value: g.id,
                label: `${g.title} (${g.ownerName})`,
              })),
            ]}
          />
        </FormField>

        <FormField label="Strategy & Rationale" required>
          <Textarea
            rows={3}
            placeholder="Explain how this plan will execute, what methodology will be used, and key operational hypotheses..."
            value={strategySummary}
            onChange={(e) => setStrategySummary(e.target.value)}
            required
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField label="Plan Owner" required>
            <Select
              value={ownerId}
              onChange={(e) => setOwnerId(e.target.value)}
              options={profiles.map((p) => ({
                value: p.id,
                label: p.displayName,
              }))}
            />
          </FormField>

          <FormField label="Priority" required>
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
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField label="Start Date" required>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </FormField>

          <FormField label="Target Completion Date" required>
            <Input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              required
            />
          </FormField>
        </div>

        {/* Checkpoint Milestones */}
        <div className="pt-2 border-t border-ch-border space-y-3">
          <label className="text-xs font-semibold text-ch-text-secondary uppercase tracking-wider block">
            Initial Checkpoint Milestones (Optional)
          </label>

          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Milestone title..."
              value={newMlsTitle}
              onChange={(e) => setNewMlsTitle(e.target.value)}
              className="flex-1"
            />
            <Input
              type="date"
              value={newMlsDueDate}
              onChange={(e) => setNewMlsDueDate(e.target.value)}
              className="w-full sm:w-40"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddMilestone}
              disabled={!newMlsTitle.trim() || !newMlsDueDate}
              className="shrink-0"
            >
              <Plus size={14} className="mr-1" /> Add
            </Button>
          </div>

          {milestones.length > 0 && (
            <div className="space-y-1.5 bg-surface-muted/50 p-2.5 rounded border border-ch-border">
              {milestones.map((m, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1 px-2.5 bg-surface rounded border border-ch-border">
                  <span className="font-medium text-ch-text-primary">{m.title}</span>
                  <div className="flex items-center gap-3 text-ch-text-secondary">
                    <span>Due {m.dueDate}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMilestone(idx)}
                      className="text-ch-text-muted hover:text-danger p-0.5"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-ch-border">
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={submitting}>
            Create Plan
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
