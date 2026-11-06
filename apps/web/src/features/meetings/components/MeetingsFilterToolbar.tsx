import React from 'react';
import { MeetingCategory, MeetingStatus } from '@corviin-hub/shared';
import { MEETING_CATEGORY_CONFIG, MEETING_STATUS_CONFIG, TEAM_MEMBERS } from './meeting-constants';

interface MeetingsFilterToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedMember: string;
  onMemberChange: (mem: string) => void;
  dateFilter: string;
  onDateFilterChange: (df: string) => void;
  onResetFilters: () => void;
  onScheduleClick: () => void;
}

export const MeetingsFilterToolbar: React.FC<MeetingsFilterToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  selectedMember,
  onMemberChange,
  dateFilter,
  onDateFilterChange,
  onResetFilters,
  onScheduleClick,
}) => {
  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedCategory !== 'ALL' ||
    selectedStatus !== 'ALL' ||
    selectedMember !== 'ALL' ||
    dateFilter !== 'ALL';

  return (
    <div className="bg-surface border border-border rounded-md p-4 mb-4">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="flex-1 min-w-[240px]">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-tertiary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search meetings by title, agenda, external attendee, or linked CRM..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-surface border border-border rounded-md text-primary placeholder-tertiary focus:outline-none focus:ring-1 focus:ring-brand-teal"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onScheduleClick}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-brand-teal text-white hover:bg-brand-teal/90 focus:outline-none focus:ring-1 focus:ring-brand-teal min-h-[40px] whitespace-nowrap"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Schedule Meeting
          </button>
        </div>
      </div>

      {/* Filter Selectors Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5 mt-3 pt-3 border-t border-border">
        {/* Category / Type */}
        <div>
          <label className="block text-[11px] font-medium text-tertiary mb-1">Meeting Type</label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full text-xs bg-surface border border-border rounded-md px-2.5 py-1.5 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
          >
            <option value="ALL">All Types</option>
            {Object.values(MeetingCategory).map((cat) => (
              <option key={cat} value={cat}>
                {MEETING_CATEGORY_CONFIG[cat]?.label || cat}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-[11px] font-medium text-tertiary mb-1">Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full text-xs bg-surface border border-border rounded-md px-2.5 py-1.5 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
          >
            <option value="ALL">All Statuses</option>
            {Object.values(MeetingStatus).map((st) => (
              <option key={st} value={st}>
                {MEETING_STATUS_CONFIG[st]?.label || st}
              </option>
            ))}
          </select>
        </div>

        {/* Member / Organiser */}
        <div>
          <label className="block text-[11px] font-medium text-tertiary mb-1">Organiser / Member</label>
          <select
            value={selectedMember}
            onChange={(e) => onMemberChange(e.target.value)}
            className="w-full text-xs bg-surface border border-border rounded-md px-2.5 py-1.5 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
          >
            <option value="ALL">All Members</option>
            {TEAM_MEMBERS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.role.split(' ')[0]})
              </option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div>
          <label className="block text-[11px] font-medium text-tertiary mb-1">Date Horizon</label>
          <select
            value={dateFilter}
            onChange={(e) => onDateFilterChange(e.target.value)}
            className="w-full text-xs bg-surface border border-border rounded-md px-2.5 py-1.5 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
          >
            <option value="ALL">All Dates</option>
            <option value="TODAY">Today (2026-11-05)</option>
            <option value="TOMORROW">Tomorrow (2026-11-06)</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="PAST">Past Meetings</option>
          </select>
        </div>

        {/* Reset Filter Action */}
        <div className="col-span-2 sm:col-span-4 lg:col-span-1 flex items-end">
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={onResetFilters}
              className="w-full py-1.5 px-3 text-xs font-medium text-secondary hover:text-primary bg-surface-muted border border-border rounded-md hover:bg-surface-hover focus:outline-none"
            >
              Reset Filters
            </button>
          ) : (
            <div className="text-[11px] text-tertiary self-center pl-1">Showing all records</div>
          )}
        </div>
      </div>
    </div>
  );
};

