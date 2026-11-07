import React from 'react';
import { CampaignStage, ContentPlatform, TaskPriority } from '@corviin-hub/shared';
import {
  Search,
  X,
  List,
  LayoutGrid,
  Columns,
  Plus,
  Filter,
  CheckCircle2,
  PauseCircle,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

interface MemberOption {
  id: string;
  displayName: string;
}

export type CampaignViewMode = 'GRID' | 'LIST' | 'BOARD';

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
  viewMode: CampaignViewMode;
  onViewModeChange: (mode: CampaignViewMode) => void;
  members: MemberOption[];
  onOpenCreate: () => void;
  onReset: () => void;
  totalCount?: number;
  filteredCount?: number;
  // Quick toggles
  completedOnly?: boolean;
  onCompletedOnlyChange?: (val: boolean) => void;
  onHoldOnly?: boolean;
  onOnHoldOnlyChange?: (val: boolean) => void;
  upcomingOnly?: boolean;
  onUpcomingOnlyChange?: (val: boolean) => void;
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
  totalCount,
  filteredCount,
  completedOnly = false,
  onCompletedOnlyChange,
  onHoldOnly = false,
  onOnHoldOnlyChange,
  upcomingOnly = false,
  onUpcomingOnlyChange,
}: CampaignsFilterToolbarProps) {
  const hasActiveFilters = Boolean(
    searchQuery ||
      selectedStage ||
      selectedPlatform ||
      selectedOwnerId ||
      selectedPriority ||
      completedOnly ||
      onHoldOnly ||
      upcomingOnly,
  );

  return (
    <div className="bg-surface border border-ch-border rounded-card p-3 space-y-3 shadow-sm text-xs">
      {/* Top Line: Search, Filter Selectors & View Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search Input */}
          <div className="relative min-w-[200px] flex-1 max-w-sm">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ch-text-muted pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search campaigns, concepts, IDs..."
              className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-canvas border border-ch-border rounded text-ch-text-primary placeholder:text-ch-text-muted focus:outline-none focus:border-accent"
            />
          </div>

          {/* Stage Filter */}
          <select
            value={selectedStage}
            onChange={(e) => onStageChange(e.target.value)}
            aria-label="Filter by Stage"
            className="py-1.5 px-2 bg-canvas border border-ch-border rounded text-ch-text-primary text-xs focus:outline-none focus:border-accent"
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
            className="py-1.5 px-2 bg-canvas border border-ch-border rounded text-ch-text-primary text-xs focus:outline-none focus:border-accent"
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
            className="py-1.5 px-2 bg-canvas border border-ch-border rounded text-ch-text-primary text-xs focus:outline-none focus:border-accent"
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
            className="py-1.5 px-2 bg-canvas border border-ch-border rounded text-ch-text-primary text-xs focus:outline-none focus:border-accent"
          >
            <option value="">All Priorities</option>
            <option value={TaskPriority.URGENT}>Urgent</option>
            <option value={TaskPriority.HIGH}>High</option>
            <option value={TaskPriority.MEDIUM}>Medium</option>
            <option value={TaskPriority.LOW}>Low</option>
          </select>

          {/* Quick Toggle: Completed */}
          {onCompletedOnlyChange && (
            <button
              type="button"
              onClick={() => onCompletedOnlyChange(!completedOnly)}
              className={cn(
                'h-8 px-2.5 rounded border text-xs font-semibold flex items-center gap-1.5 transition-none',
                completedOnly
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'border-ch-border bg-canvas text-ch-text-secondary hover:text-emerald-500',
              )}
            >
              <CheckCircle2 size={12} />
              <span>Completed</span>
            </button>
          )}

          {/* Quick Toggle: On Hold */}
          {onOnHoldOnlyChange && (
            <button
              type="button"
              onClick={() => onOnHoldOnlyChange(!onHoldOnly)}
              className={cn(
                'h-8 px-2.5 rounded border text-xs font-semibold flex items-center gap-1.5 transition-none',
                onHoldOnly
                  ? 'bg-ch-text-primary text-white border-ch-text-primary shadow-sm'
                  : 'border-ch-border bg-canvas text-ch-text-secondary hover:text-ch-text-primary',
              )}
            >
              <PauseCircle size={12} />
              <span>On Hold</span>
            </button>
          )}

          {/* Quick Toggle: Upcoming */}
          {onUpcomingOnlyChange && (
            <button
              type="button"
              onClick={() => onUpcomingOnlyChange(!upcomingOnly)}
              className={cn(
                'h-8 px-2.5 rounded border text-xs font-semibold flex items-center gap-1.5 transition-none',
                upcomingOnly
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                  : 'border-ch-border bg-canvas text-ch-text-secondary hover:text-purple-500',
              )}
            >
              <Calendar size={12} />
              <span>Upcoming</span>
            </button>
          )}
        </div>

        {/* View Switcher & Clear Filters */}
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-xs h-8 px-2.5 text-ch-text-muted hover:text-ch-text-primary"
            >
              <X size={13} className="mr-1" />
              Clear
            </Button>
          )}

          {/* 3-Way View Switcher */}
          <div className="inline-flex rounded-md border border-ch-border bg-canvas p-0.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => onViewModeChange('GRID')}
              aria-label="Grid View"
              className={cn(
                'px-2.5 py-1 rounded transition-none text-xs font-semibold flex items-center gap-1.5',
                viewMode === 'GRID'
                  ? 'bg-accent text-accent-foreground shadow-sm'
                  : 'text-ch-text-secondary hover:text-ch-text-primary',
              )}
            >
              <LayoutGrid size={13} />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('LIST')}
              aria-label="List View"
              className={cn(
                'px-2.5 py-1 rounded transition-none text-xs font-semibold flex items-center gap-1.5',
                viewMode === 'LIST'
                  ? 'bg-accent text-accent-foreground shadow-sm'
                  : 'text-ch-text-secondary hover:text-ch-text-primary',
              )}
            >
              <List size={13} />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('BOARD')}
              aria-label="Board View"
              className={cn(
                'px-2.5 py-1 rounded transition-none text-xs font-semibold flex items-center gap-1.5',
                viewMode === 'BOARD'
                  ? 'bg-accent text-accent-foreground shadow-sm'
                  : 'text-ch-text-secondary hover:text-ch-text-primary',
              )}
            >
              <Columns size={13} />
              <span className="hidden sm:inline">Kanban</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Line: Active Filter Badges & Result Count */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-ch-border text-xs flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-ch-text-muted font-medium">Active:</span>

          {!hasActiveFilters && (
            <span className="text-[11px] text-ch-text-muted italic">Showing all authorized campaigns</span>
          )}

          {selectedStage && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20 font-medium text-[11px]">
              Stage: {selectedStage}
              <button
                type="button"
                onClick={() => onStageChange('')}
                className="hover:text-accent-foreground rounded-full p-0.2"
              >
                <X size={10} />
              </button>
            </span>
          )}

          {selectedPlatform && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-muted text-ch-text-primary border border-ch-border font-medium text-[11px]">
              Platform: {selectedPlatform}
              <button
                type="button"
                onClick={() => onPlatformChange('')}
                className="hover:text-danger rounded-full p-0.2"
              >
                <X size={10} />
              </button>
            </span>
          )}

          {selectedOwnerId && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-muted text-ch-text-primary border border-ch-border font-medium text-[11px]">
              Owner: {members.find((m) => m.id === selectedOwnerId)?.displayName || selectedOwnerId}
              <button
                type="button"
                onClick={() => onOwnerIdChange('')}
                className="hover:text-danger rounded-full p-0.2"
              >
                <X size={10} />
              </button>
            </span>
          )}

          {selectedPriority && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-muted text-ch-text-primary border border-ch-border font-medium text-[11px]">
              Priority: {selectedPriority}
              <button
                type="button"
                onClick={() => onPriorityChange('')}
                className="hover:text-danger rounded-full p-0.2"
              >
                <X size={10} />
              </button>
            </span>
          )}
        </div>

        {totalCount !== undefined && filteredCount !== undefined && (
          <div className="text-[11px] font-mono font-medium text-ch-text-muted ml-auto">
            Showing <strong className="text-ch-text-primary">{filteredCount}</strong> of {totalCount} campaigns
          </div>
        )}
      </div>
    </div>
  );
}
