import React from 'react';
import {
  CampaignItem,
  ContentEventType,
  ContentPlatform,
  ContentStatus,
} from '@corviin-hub/shared';
import { useProfiles } from '@/hooks/useProfiles';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Filter, X } from 'lucide-react';

interface CalendarFilterToolbarProps {
  campaigns: CampaignItem[];
  selectedCampaignId: string;
  onCampaignChange: (val: string) => void;
  selectedOwnerId: string;
  onOwnerChange: (val: string) => void;
  selectedEventType: string;
  onEventTypeChange: (val: string) => void;
  selectedPlatform: string;
  onPlatformChange: (val: string) => void;
  selectedStatus: string;
  onStatusChange: (val: string) => void;
  onClearFilters: () => void;
}

export function CalendarFilterToolbar({
  campaigns,
  selectedCampaignId,
  onCampaignChange,
  selectedOwnerId,
  onOwnerChange,
  selectedEventType,
  onEventTypeChange,
  selectedPlatform,
  onPlatformChange,
  selectedStatus,
  onStatusChange,
  onClearFilters,
}: CalendarFilterToolbarProps) {
  const { data: profiles = [] } = useProfiles();

  const isAnyFilterActive =
    Boolean(selectedCampaignId) ||
    Boolean(selectedOwnerId) ||
    Boolean(selectedEventType) ||
    Boolean(selectedPlatform) ||
    Boolean(selectedStatus);

  return (
    <div className="flex items-center gap-2 flex-wrap py-1 text-xs">
      <div className="flex items-center gap-1.5 text-ch-text-secondary font-medium mr-1">
        <Filter size={13} />
        <span>Filters:</span>
      </div>

      {/* Campaign Filter */}
      <Select
        value={selectedCampaignId}
        onChange={(e) => onCampaignChange(e.target.value)}
        aria-label="Filter by Campaign"
        className="text-xs h-8 py-0 min-w-[150px]"
      >
        <option value="">All Campaigns</option>
        {campaigns.map((c) => (
          <option key={c.id} value={c.id}>
            {c.title}
          </option>
        ))}
      </Select>

      {/* Owner Filter */}
      <Select
        value={selectedOwnerId}
        onChange={(e) => onOwnerChange(e.target.value)}
        aria-label="Filter by Owner"
        className="text-xs h-8 py-0 min-w-[120px]"
      >
        <option value="">All Owners</option>
        {profiles.map((p) => (
          <option key={p.id} value={p.id}>
            {p.displayName}
          </option>
        ))}
      </Select>

      {/* Event Type / Stage Filter */}
      <Select
        value={selectedEventType}
        onChange={(e) => onEventTypeChange(e.target.value)}
        aria-label="Filter by Event Type"
        className="text-xs h-8 py-0 min-w-[140px]"
      >
        <option value="">All Event Types</option>
        <option value={ContentEventType.TOPIC_RESEARCH}>Topic Research</option>
        <option value={ContentEventType.SCRIPT_WRITING}>Script Writing</option>
        <option value={ContentEventType.SCRIPT_REVIEW}>Script Review</option>
        <option value={ContentEventType.RECORDING}>Recording</option>
        <option value={ContentEventType.EDITING}>Editing</option>
        <option value={ContentEventType.FINAL_APPROVAL}>Final Approval</option>
        <option value={ContentEventType.SCHEDULED_POST}>Scheduled Post</option>
        <option value={ContentEventType.ACTUAL_PUBLISHED_POST}>Published Post</option>
        <option value={ContentEventType.CAMPAIGN_MILESTONE}>Campaign Milestone</option>
        <option value="CAMPAIGN_TASK">Campaign Task</option>
      </Select>

      {/* Platform Filter */}
      <Select
        value={selectedPlatform}
        onChange={(e) => onPlatformChange(e.target.value)}
        aria-label="Filter by Platform"
        className="text-xs h-8 py-0 min-w-[120px]"
      >
        <option value="">All Platforms</option>
        <option value={ContentPlatform.YOUTUBE}>YouTube</option>
        <option value={ContentPlatform.LINKEDIN}>LinkedIn</option>
        <option value={ContentPlatform.INSTAGRAM}>Instagram</option>
        <option value={ContentPlatform.TWITTER_X}>X / Twitter</option>
        <option value={ContentPlatform.WEBSITE_BLOG}>Website / Blog</option>
        <option value={ContentPlatform.NEWSLETTER}>Newsletter</option>
      </Select>

      {/* Status Filter */}
      <Select
        value={selectedStatus}
        onChange={(e) => onStatusChange(e.target.value)}
        aria-label="Filter by Status"
        className="text-xs h-8 py-0 min-w-[120px]"
      >
        <option value="">All Statuses</option>
        <option value={ContentStatus.PLANNED}>Planned</option>
        <option value={ContentStatus.IN_PROGRESS}>In Progress</option>
        <option value={ContentStatus.READY_FOR_REVIEW}>Ready for Review</option>
        <option value={ContentStatus.APPROVED}>Approved</option>
        <option value={ContentStatus.PUBLISHED}>Published</option>
        <option value={ContentStatus.DELAYED}>Delayed</option>
        <option value={ContentStatus.CANCELLED}>Cancelled</option>
      </Select>

      {/* Clear Filters */}
      {isAnyFilterActive && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          className="text-xs h-8 px-2 text-ch-text-secondary hover:text-ch-text-primary gap-1"
        >
          <X size={12} />
          <span>Clear Filters</span>
        </Button>
      )}
    </div>
  );
}

