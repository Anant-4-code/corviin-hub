import React, { useState } from 'react';
import { CreateCampaignDto, ContentPlatform, TaskPriority } from '@corviin-hub/shared';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Megaphone } from 'lucide-react';

interface MemberOption {
  id: string;
  displayName: string;
}

interface CreateCampaignDialogProps {
  open: boolean;
  onClose: () => void;
  workspaceId: string;
  members: MemberOption[];
  onCreate: (dto: CreateCampaignDto) => Promise<void>;
}

export function CreateCampaignDialog({
  open,
  onClose,
  workspaceId,
  members,
  onCreate,
}: CreateCampaignDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [platform, setPlatform] = useState<ContentPlatform>(ContentPlatform.YOUTUBE);
  const [ownerId, setOwnerId] = useState(() => members[0]?.id || '');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.HIGH);
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [targetPublishDate, setTargetPublishDate] = useState(() =>
    new Date(Date.now() + 86400000 * 14).toISOString().slice(0, 10),
  );
  const [objective, setObjective] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Campaign title is required.');
      return;
    }
    if (!description.trim()) {
      setError('Short description is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onCreate({
        workspaceId,
        title: title.trim(),
        description: description.trim(),
        platform,
        ownerId: ownerId || members[0]?.id || 'acting-profile',
        priority,
        startDate: `${startDate}T09:00:00.000Z`,
        targetPublishDate: `${targetPublishDate}T17:00:00.000Z`,
        objective: objective.trim() || undefined,
        targetAudience: targetAudience.trim() || undefined,
      });
      onClose();
      setTitle('');
      setDescription('');
      setObjective('');
      setTargetAudience('');
    } catch (err: any) {
      setError(err?.message || 'Failed to create campaign.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Create New Operational Campaign"
      description="Starts a new production pipeline in Stage 1: Initial Idea."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        {error && (
          <div className="p-2.5 bg-danger/10 border border-danger/30 text-danger font-medium">
            {error}
          </div>
        )}

        <FormField label="Campaign Title *" required>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Q4 CRM Product Launch Video"
            required
            className="text-xs"
          />
        </FormField>

        <FormField label="Short Description / Executive Summary *" required>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Brief 1-2 sentence overview of the campaign purpose..."
            required
            className="w-full p-2 bg-surface border border-ch-border text-xs text-ch-text-primary placeholder:text-ch-text-muted focus:outline-none focus:border-primary resize-none"
          />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Target Platform *">
            <Select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as ContentPlatform)}
              className="text-xs"
            >
              <option value={ContentPlatform.YOUTUBE}>YouTube</option>
              <option value={ContentPlatform.LINKEDIN}>LinkedIn</option>
              <option value={ContentPlatform.INSTAGRAM}>Instagram</option>
              <option value={ContentPlatform.TWITTER_X}>Twitter / X</option>
              <option value={ContentPlatform.WEBSITE_BLOG}>Website Blog</option>
              <option value={ContentPlatform.NEWSLETTER}>Newsletter</option>
            </Select>
          </FormField>

          <FormField label="Campaign Owner *">
            <Select
              value={ownerId}
              onChange={(e) => setOwnerId(e.target.value)}
              className="text-xs"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.displayName}
                </option>
              ))}
            </Select>
          </FormField>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <FormField label="Start Date *">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="text-xs font-mono"
            />
          </FormField>

          <FormField label="Target Publish Date *">
            <Input
              type="date"
              value={targetPublishDate}
              onChange={(e) => setTargetPublishDate(e.target.value)}
              required
              className="text-xs font-mono"
            />
          </FormField>

          <FormField label="Priority *">
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="text-xs"
            >
              <option value={TaskPriority.URGENT}>Urgent</option>
              <option value={TaskPriority.HIGH}>High</option>
              <option value={TaskPriority.MEDIUM}>Medium</option>
              <option value={TaskPriority.LOW}>Low</option>
            </Select>
          </FormField>
        </div>

        <div className="pt-3 border-t border-ch-border flex items-center justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Campaign'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

