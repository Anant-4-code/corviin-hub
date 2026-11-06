import React from 'react';
import { MeetingCategory, MeetingStatus } from '@corviin-hub/shared';
import { Search, X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface MemberOption {
  id: string;
  displayName: string;
}

interface MeetingsFilterToolbarProps {
  category: string;
  onCategoryChange: (category: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
  memberId: string;
  onMemberIdChange: (memberId: string) => void;
  searchQuery: string;
  onSearchChange: (search: string) => void;
  members: MemberOption[];
  onReset: () => void;
}

export function MeetingsFilterToolbar({
  category,
  onCategoryChange,
  status,
  onStatusChange,
  memberId,
  onMemberIdChange,
  searchQuery,
  onSearchChange,
  members,
  onReset,
}: MeetingsFilterToolbarProps) {
  const hasActiveFilters = Boolean(category || status || memberId || searchQuery);

  return (
    <div className="flex flex-wrap items-center gap-2.5 p-2.5 bg-surface border border-ch-border text-xs">
      {/* Search Input */}
      <div className="relative min-w-[180px] flex-1 max-w-xs">
        <Search
          size={14}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ch-text-muted"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search title, buyer, project..."
          className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-surface border border-ch-border text-ch-text-primary placeholder:text-ch-text-muted focus:outline-none focus:border-primary"
        />
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-1.5">
        <span className="text-ch-text-secondary font-medium">Category:</span>
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          aria-label="Filter by Category"
          className="py-1.5 px-2 bg-surface border border-ch-border text-ch-text-primary text-xs focus:outline-none focus:border-primary"
        >
          <option value="">All Categories</option>
          <option value={MeetingCategory.SITE_VISIT}>Site Visits (Real Estate)</option>
          <option value={MeetingCategory.INTERNAL}>Internal Team</option>
          <option value={MeetingCategory.CLIENT}>Client Discovery / Review</option>
          <option value={MeetingCategory.PARTNER}>Partner / Vendor</option>
          <option value={MeetingCategory.BUYER}>Buyer Consultation</option>
          <option value={MeetingCategory.ONLINE}>Online / Video Only</option>
          <option value={MeetingCategory.OTHER}>Other</option>
        </select>
      </div>

      {/* Member Filter */}
      <div className="flex items-center gap-1.5">
        <span className="text-ch-text-secondary font-medium">Member:</span>
        <select
          value={memberId}
          onChange={(e) => onMemberIdChange(e.target.value)}
          aria-label="Filter by Member"
          className="py-1.5 px-2 bg-surface border border-ch-border text-ch-text-primary text-xs focus:outline-none focus:border-primary"
        >
          <option value="">All Members</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.displayName}
            </option>
          ))}
        </select>
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-1.5">
        <span className="text-ch-text-secondary font-medium">Status:</span>
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          aria-label="Filter by Status"
          className="py-1.5 px-2 bg-surface border border-ch-border text-ch-text-primary text-xs focus:outline-none focus:border-primary"
        >
          <option value="">All Statuses</option>
          <option value={MeetingStatus.SCHEDULED}>Scheduled</option>
          <option value={MeetingStatus.CONFIRMED}>Confirmed</option>
          <option value={MeetingStatus.RESCHEDULED}>Rescheduled</option>
          <option value={MeetingStatus.COMPLETED}>Completed</option>
          <option value={MeetingStatus.CANCELLED}>Cancelled</option>
          <option value={MeetingStatus.NO_SHOW}>No Show</option>
        </select>
      </div>

      {/* Reset Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-7 px-2 text-xs text-ch-text-muted hover:text-ch-text-primary gap-1 ml-auto"
        >
          <X size={13} />
          <span>Reset Filters</span>
        </Button>
      )}
    </div>
  );
}

