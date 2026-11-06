import React from 'react';
import { CampaignStage, ContentPlatform, TaskPriority } from '@corviin-hub/shared';
import { Search, X, List, LayoutGrid, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface MemberOption {
  id: string;
  displayName: string;
}

interface CampaignsFilterToolbarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedStage: string;
  onStageChange: (val: string) => void;
  selectedPlatform: string;
  onPlatformChange: (val: string) => void;
  selectedOwnerId: string;
  onOwnerIdChange: (val: string) => void;
  selectedPriority: string;
  onPriorityChange: (val: string) => void;
  viewMode: 'LIST' | 'BOARD';
  onViewModeChange: (mode: 'LIST' | 'BOARD') => void;
  members: MemberOption[];
  onOpenCreate: () => void;
  onReset: () => void;
}

export function CampaignsFilterToolbar({
  searchQuery,
  onSearchChange,
  selectedStage,
  onStageChange,
  selectedPlatform,
  onPlatformChange,
  selectedOwnerId,
  onOwnerIdChange,
  selectedPriority,
  onPriorityChange,
  viewMode,
  onViewModeChange,
  members,
  onOpenCreate,
  onReset,
}: CampaignsFilterToolbarProps) {
  const hasActiveFilters = Boolean(
    searchQuery || selectedStage || selectedPlatform || selectedOwnerId || selectedPriority,
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 bg-surface border border-ch-border text-xs">
      <div className="flex flex-wrap items-center gap-2 flex-1">
        {/* Search */}
        <div className="relative min-w-[180px] max-w-xs">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ch-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search campaigns, concepts..."
            className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-surface border border-ch-border text-ch-text-primary placeholder:text-ch-text-muted focus:outline-none focus:border-primary"
          />
        </div>

        {/* Stage Filter */}
        <select
          value={selectedStage}
          onChange={(e) => onStageChange(e.target.value)}
          aria-label="Filter by Stage"
          className="py-1.5 px-2 bg-surface border border-ch-border text-ch-text-primary text-xs focus:outline-none focus:border-primary"
        >
          <option value="">All Stages</option>
          <option value={CampaignStage.INITIAL_IDEA}>1. Initial Idea</option>
          <option value={CampaignStage.SCRIPTING_PLANNING}>2. Scripting & Planning</option>
          <option value={CampaignStage.RECORDING_UPLOAD}>3. Recording & Upload</option>
          <option value={CampaignStage.EDITING_FINAL}>4. Editing & Final Asset</option>
          <option value={CampaignStage.POSTING_COMPLETION}>5. Posting & Completion</option>
        </select>

        {/* Platform Filter */}
        <select
          value={selectedPlatform}
          onChange={(e) => onPlatformChange(e.target.value)}
          aria-label="Filter by Platform"
          className="py-1.5 px-2 bg-surface border border-ch-border text-ch-text-primary text-xs focus:outline-none focus:border-primary"
        >
          <option value="">All Platforms</option>
          <option value={ContentPlatform.YOUTUBE}>YouTube</option>
          <option value={ContentPlatform.LINKEDIN}>LinkedIn</option>
          <option value={ContentPlatform.INSTAGRAM}>Instagram</option>
          <option value={ContentPlatform.TWITTER_X}>Twitter / X</option>
          <option value={ContentPlatform.WEBSITE_BLOG}>Website Blog</option>
          <option value={ContentPlatform.NEWSLETTER}>Newsletter</option>
        </select>

        {/* Owner Filter */}
        <select
          value={selectedOwnerId}
          onChange={(e) => onOwnerIdChange(e.target.value)}
          aria-label="Filter by Owner"
          className="py-1.5 px-2 bg-surface border border-ch-border text-ch-text-primary text-xs focus:outline-none focus:border-primary"
        >
          <option value="">All Owners</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.displayName}
            </option>
          ))}
        </select>

        {/* Priority Filter */}
        <select
          value={selectedPriority}
          onChange={(e) => onPriorityChange(e.target.value)}
          aria-label="Filter by Priority"
          className="py-1.5 px-2 bg-surface border border-ch-border text-ch-text-primary text-xs focus:outline-none focus:border-primary"
        >
          <option value="">All Priorities</option>
          <option value={TaskPriority.URGENT}>Urgent</option>
          <option value={TaskPriority.HIGH}>High</option>
          <option value={TaskPriority.MEDIUM}>Medium</option>
          <option value={TaskPriority.LOW}>Low</option>
        </select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-7 px-2 text-xs text-ch-text-muted hover:text-ch-text-primary gap-1"
          >
            <X size={13} />
            <span>Reset</span>
          </Button>
        )}
      </div>

      {/* Right Controls: View Switcher & Create Button */}
      <div className="flex items-center gap-2">
        <div className="flex border border-ch-border bg-surface-muted/50 p-0.5">
          <button
            onClick={() => onViewModeChange('LIST')}
            title="List View"
            aria-label="List View"
            className={`p-1.5 transition-none ${
              viewMode === 'LIST'
                ? 'bg-surface text-ch-text-primary font-semibold'
                : 'text-ch-text-muted hover:text-ch-text-primary'
            }`}
          >
            <List size={14} />
          </button>
          <button
            onClick={() => onViewModeChange('BOARD')}
            title="Board View"
            aria-label="Board View"
            className={`p-1.5 transition-none ${
              viewMode === 'BOARD'
                ? 'bg-surface text-ch-text-primary font-semibold'
                : 'text-ch-text-muted hover:text-ch-text-primary'
            }`}
          >
            <LayoutGrid size={14} />
          </button>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={onOpenCreate}
          className="h-8 text-xs gap-1.5 font-medium"
        >
          <Plus size={14} />
          <span>New Campaign</span>
        </Button>
      </div>
    </div>
  );
}

