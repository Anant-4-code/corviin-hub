import React from 'react';
import { MemberStatus } from '@corviin-hub/shared';
import { MEMBER_STATUS_CONFIG } from './team-constants';

interface TeamFilterToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  viewMode: 'GRID' | 'TABLE';
  onViewModeChange: (vm: 'GRID' | 'TABLE') => void;
  onResetFilters: () => void;
  onAddMemberClick: () => void;
}

export const TeamFilterToolbar: React.FC<TeamFilterToolbarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  viewMode,
  onViewModeChange,
  onResetFilters,
  onAddMemberClick,
}) => {
  const hasActiveFilters = searchQuery.trim().length > 0 || statusFilter !== 'ALL';

  return (
    <div className="bg-surface border border-border rounded-md p-4 mb-4">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
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
              placeholder="Search team members by name, role, or email..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-surface border border-border rounded-md text-primary placeholder-tertiary focus:outline-none focus:ring-1 focus:ring-brand-teal"
            />
          </div>
        </div>

        {/* Status Filter, View Toggle & Add Button */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Status Dropdown */}
          <div className="min-w-[140px]">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="w-full text-xs bg-surface border border-border rounded-md px-2.5 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
            >
              <option value="ALL">All Statuses</option>
              {Object.values(MemberStatus).map((st) => (
                <option key={st} value={st}>
                  {MEMBER_STATUS_CONFIG[st]?.label || st}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Switcher */}
          <div className="inline-flex rounded-md border border-border bg-surface-muted p-0.5">
            <button
              type="button"
              onClick={() => onViewModeChange('GRID')}
              className={`px-3 py-1.5 text-xs font-medium rounded ${
                viewMode === 'GRID'
                  ? 'bg-surface text-primary shadow-none'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              Cards
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('TABLE')}
              className={`px-3 py-1.5 text-xs font-medium rounded ${
                viewMode === 'TABLE'
                  ? 'bg-surface text-primary shadow-none'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              Table
            </button>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="py-1.5 px-3 text-xs font-medium text-secondary hover:text-primary bg-surface border border-border rounded-md hover:bg-surface-hover"
            >
              Reset
            </button>
          )}

          {/* Add Member Button */}
          <button
            type="button"
            onClick={onAddMemberClick}
            className="inline-flex items-center justify-center px-3.5 py-2 text-xs font-semibold rounded-md bg-brand-teal text-white hover:bg-brand-teal/90 min-h-[38px] whitespace-nowrap"
          >
            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Member
          </button>
        </div>
      </div>
    </div>
  );
};

