import React, { useState, useEffect } from 'react';
import {
  CreateCampaignDto,
  CampaignStage,
  ContentPlatform,
  TaskPriority,
} from '@corviin-hub/shared';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { FormField } from '@/components/ui/FormField';
import { useProfiles } from '@/hooks/useProfiles';
import { useAppStore } from '@/lib/store';

interface CreateCampaignDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (dto: CreateCampaignDto) => Promise<void>;
}

export function CreateCampaignDialog({
  open,
  onClose,
  onCreate,
}: CreateCampaignDialogProps) {
  const { data: profiles = [] } = useProfiles();
  const selectedProfileId = useAppStore((s) => s.selectedProfileId);
  const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);
  const defaultOwnerId = selectedProfileId || profiles[0]?.id || '';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [stage, setStage] = useState<CampaignStage>(CampaignStage.INITIAL_IDEA);
  const [platform, setPlatform] = useState<ContentPlatform>(ContentPlatform.YOUTUBE);
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.HIGH);
  const [ownerId, setOwnerId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [targetPublishDate, setTargetPublishDate] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setTitle('');
      setDescription('');
      setStage(CampaignStage.INITIAL_IDEA);
      setPlatform(ContentPlatform.YOUTUBE);
      setPriority(TaskPriority.HIGH);
      setOwnerId(defaultOwnerId);

      const today = new Date();
      const inTwoWeeks = new Date();
      inTwoWeeks.setDate(today.getDate() + 14);
      const pad = (n: number) => String(n).padStart(2, '0');
      setStartDate(
        `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}T09:00`,
      );
      setTargetPublishDate(
        `${inTwoWeeks.getFullYear()}-${pad(inTwoWeeks.getMonth() + 1)}-${pad(inTwoWeeks.getDate())}T17:00`,
      );
      setError('');
    }
  }, [open, defaultOwnerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Campaign title is required.');
      return;
    }
    if (!description.trim()) {
      setError('Short description / objective is required.');
      return;
    }
    if (!targetPublishDate) {
      setError('Target publish date is required.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await onCreate({
        workspaceId: selectedWorkspaceId || 'ws-tech-0001-0000-000000000001',
        title: title.trim(),
        description: description.trim(),
        stage,
        platform,
        priority,
        ownerId: ownerId || defaultOwnerId,
        startDate: new Date(startDate || Date.now()).toISOString(),
        targetPublishDate: new Date(targetPublishDate).toISOString(),
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to create campaign.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} title="Create Marketing Campaign">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Campaign Title" required>
          <Input
            placeholder="e.g., Enterprise Migration Blueprint & Q4 Demo Blast"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xs h-9"
            required
          />
        </FormField>

        <FormField label="Short Description / Objective" required>
          <Textarea
            rows={2}
            placeholder="Outline the core thesis, target audience, and primary outcome..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="text-xs resize-none"
            required
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <FormField label="Primary Platform" required>
            <Select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as ContentPlatform)}
              className="text-xs h-9"
              required
            >
              <option value={ContentPlatform.YOUTUBE}>YouTube</option>
              <option value={ContentPlatform.LINKEDIN}>LinkedIn</option>
              <option value={ContentPlatform.INSTAGRAM}>Instagram</option>
              <option value={ContentPlatform.TWITTER_X}>X / Twitter</option>
              <option value={ContentPlatform.WEBSITE_BLOG}>Website / Blog</option>
              <option value={ContentPlatform.NEWSLETTER}>Newsletter</option>
            </Select>
          </FormField>

          <FormField label="Initial Stage" required>
            <Select
              value={stage}
              onChange={(e) => setStage(e.target.value as CampaignStage)}
              className="text-xs h-9"
              required
            >
              <option value={CampaignStage.INITIAL_IDEA}>Initial Idea</option>
              <option value={CampaignStage.SCRIPTING_PLANNING}>Scripting & Planning</option>
              <option value={CampaignStage.RECORDING_UPLOAD}>Recording & Assets</option>
              <option value={CampaignStage.EDITING_FINAL}>Editing & Final Asset</option>
              <option value={CampaignStage.POSTING_COMPLETION}>Posting & Completion</option>
            </Select>
          </FormField>

          <FormField label="Priority" required>
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="text-xs h-9"
              required
            >
              <option value={TaskPriority.URGENT}>Urgent</option>
              <option value={TaskPriority.HIGH}>High</option>
              <option value={TaskPriority.MEDIUM}>Medium</option>
              <option value={TaskPriority.LOW}>Low</option>
            </Select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Assigned Owner" required>
            <Select
              value={ownerId}
              onChange={(e) => setOwnerId(e.target.value)}
              className="text-xs h-9"
              required
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.displayName}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Target Publish Date & Time" required>
            <Input
              type="datetime-local"
              value={targetPublishDate}
              onChange={(e) => setTargetPublishDate(e.target.value)}
              className="text-xs h-9"
              required
            />
          </FormField>
        </div>

        {error && (
          <div className="p-2.5 rounded bg-danger/10 border border-danger/30 text-xs text-danger">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-ch-border">
          <Button variant="outline" type="button" size="sm" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" size="sm" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Campaign'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

