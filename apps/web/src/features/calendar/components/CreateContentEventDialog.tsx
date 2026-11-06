import React, { useState, useEffect } from 'react';
import {
  CampaignItem,
  ContentEventType,
  ContentPlatform,
  CreateContentEventDto,
} from '@corviin-hub/shared';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { FormField } from '@/components/ui/FormField';
import { useProfiles } from '@/hooks/useProfiles';
import { useAppStore } from '@/lib/store';

interface CreateContentEventDialogProps {
  campaigns: CampaignItem[];
  preselectedCampaignId?: string;
  open: boolean;
  onClose: () => void;
  onCreate: (campaignId: string, dto: Omit<CreateContentEventDto, 'campaignId'>) => Promise<void>;
}

export function CreateContentEventDialog({
  campaigns,
  preselectedCampaignId,
  open,
  onClose,
  onCreate,
}: CreateContentEventDialogProps) {
  const { data: profiles = [] } = useProfiles();
  const selectedProfileId = useAppStore((s) => s.selectedProfileId);
  const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);
  const defaultOwnerId = selectedProfileId || profiles[0]?.id || '';

  const [campaignId, setCampaignId] = useState('');
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState<ContentEventType>(ContentEventType.RECORDING);
  const [plannedDate, setPlannedDate] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [platform, setPlatform] = useState<ContentPlatform>(ContentPlatform.YOUTUBE);
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setCampaignId(preselectedCampaignId || campaigns[0]?.id || '');
      setTitle('');
      setEventType(ContentEventType.RECORDING);

      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      const pad = (n: number) => String(n).padStart(2, '0');
      setPlannedDate(
        `${nextWeek.getFullYear()}-${pad(nextWeek.getMonth() + 1)}-${pad(nextWeek.getDate())}T14:00`,
      );

      setOwnerId(defaultOwnerId);
      setPlatform(ContentPlatform.YOUTUBE);
      setNotes('');
      setError('');
    }
  }, [open, preselectedCampaignId, campaigns, defaultOwnerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignId) {
      setError('Please select an owning campaign.');
      return;
    }
    if (!title.trim()) {
      setError('Milestone title is required.');
      return;
    }
    if (!plannedDate) {
      setError('Planned date and time is required.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await onCreate(campaignId, {
        workspaceId: selectedWorkspaceId || 'ws-tech-0001-0000-000000000001',
        title: title.trim(),
        eventType,
        plannedDate: new Date(plannedDate).toISOString(),
        ownerId: ownerId || defaultOwnerId,
        platform,
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to create content milestone.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} title="Add Content / Campaign Milestone">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Owning Campaign" required>
          <Select
            value={campaignId}
            onChange={(e) => setCampaignId(e.target.value)}
            className="text-xs h-9"
            required
          >
            <option value="">Select campaign...</option>
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} ({c.stage})
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Milestone Title" required>
          <Input
            placeholder="e.g., Final 4K Drone Footage Review & Color Grade"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xs h-9"
            required
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Stage / Event Type" required>
            <Select
              value={eventType}
              onChange={(e) => setEventType(e.target.value as ContentEventType)}
              className="text-xs h-9"
              required
            >
              <option value={ContentEventType.TOPIC_RESEARCH}>Topic Research</option>
              <option value={ContentEventType.SCRIPT_WRITING}>Script Writing</option>
              <option value={ContentEventType.SCRIPT_REVIEW}>Script Review</option>
              <option value={ContentEventType.RECORDING}>Recording</option>
              <option value={ContentEventType.EDITING}>Editing</option>
              <option value={ContentEventType.FINAL_APPROVAL}>Final Approval</option>
              <option value={ContentEventType.SCHEDULED_POST}>Scheduled Post</option>
              <option value={ContentEventType.CAMPAIGN_MILESTONE}>Campaign Milestone</option>
            </Select>
          </FormField>

          <FormField label="Target Platform" required>
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Planned Date & Time" required>
            <Input
              type="datetime-local"
              value={plannedDate}
              onChange={(e) => setPlannedDate(e.target.value)}
              className="text-xs h-9"
              required
            />
          </FormField>

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
        </div>

        <FormField label="Brief / Production Notes" description="Optional requirements, equipment, or hooks.">
          <Textarea
            rows={2}
            placeholder="Add shoot details, script links, or reviewer notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="text-xs resize-none"
          />
        </FormField>

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
            {submitting ? 'Creating...' : 'Add Milestone'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

