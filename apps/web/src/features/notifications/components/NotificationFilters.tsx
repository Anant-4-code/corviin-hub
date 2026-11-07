import React from 'react';
import { CheckCheck, Search, X } from 'lucide-react';
import { NOTIFICATION_CATEGORIES } from './notification-constants';

interface NotificationFiltersProps {
  unreadOnly: boolean;
  onUnreadOnlyChange: (unread: boolean) => void;
  typeFilter: string;
  onTypeFilterChange: (type: string) => void;
  onMarkAllRead: () => void;
  unreadCount: number;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  priorityFilter?: string;
  onPriorityFilterChange?: (p: string) => void;
  onResetFilters?: () => void;
  totalCount?: number;
  filteredCount?: number;
}

export const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  unreadOnly,
  onUnreadOnlyChange,
  typeFilter,
  onTypeFilterChange,
  onMarkAllRead,
  unreadCount,
  searchQuery = '',
  onSearchChange,
  priorityFilter = 'ALL',
  onPriorityFilterChange,
  onResetFilters,
  totalCount,
  filteredCount,
}) => {
  const typeOptions = [
    { id: 'ALL', label: 'All Categories' },
    { id: 'TASK_ASSIGNED', label: 'Task Assignments' },
    { id: 'TASK_DUE_SOON', label: 'Due Soon / Overdue' },
    { id: 'CRM_FOLLOW_UP_DUE', label: 'CRM Leads & Follow-ups' },
    { id: 'MEETING_APPROACHING', label: 'Meetings & Site Visits' },
    { id: 'CAMPAIGN_REVIEW_PENDING', label: 'Campaign Reviews' },
    { id: 'APPROVAL_STATUS', label: 'Assets & Approvals' },
  ];

  const priorityOptions = [
    { id: 'ALL', label: 'All Priorities' },
    { id: 'HIGH', label: 'High & Urgent' },
    { id: 'MEDIUM', label: 'Medium' },
    { id: 'LOW', label: 'Low' },
  ];

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    unreadOnly ||
    typeFilter !== 'ALL' ||
    priorityFilter !== 'ALL';

  return (
    <div className="bg-surface border border-border rounded-lg p-3 space-y-3">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input */}
        {onSearchChange && (
          <div className="relative flex-1 min-w-[220px]">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search notifications by title, message, actor..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface border border-border rounded text-primary placeholder-tertiary focus:outline-none focus:ring-1 focus:ring-brand-teal min-h-[36px]"
            />
          </div>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          {/* Read State Toggle: All / Unread */}
          <div className="flex items-center p-0.5 bg-surface-muted rounded border border-border">
            <button
              type="button"
              onClick={() => onUnreadOnlyChange(false)}
              className={`px-3 py-1.5 text-xs font-semibold rounded min-h-[34px] transition-none cursor-pointer ${
                !unreadOnly
                  ? 'bg-surface text-primary border border-border shadow-xs'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => onUnreadOnlyChange(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded min-h-[34px] transition-none cursor-pointer ${
                unreadOnly
                  ? 'bg-surface text-primary border border-border shadow-xs'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              <span>Unread</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-brand-teal text-white">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Category Dropdown */}
          <select
            value={typeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value)}
            className="text-xs bg-surface border border-border rounded px-2.5 py-1.5 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal min-h-[36px]"
          >
            {typeOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Priority Dropdown */}
          {onPriorityFilterChange && (
            <select
              value={priorityFilter}
              onChange={(e) => onPriorityFilterChange(e.target.value)}
              className="text-xs bg-surface border border-border rounded px-2.5 py-1.5 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal min-h-[36px]"
            >
              {priorityOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}

          {/* Mark all read button */}
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllRead}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-surface-muted border border-border text-secondary hover:text-primary hover:bg-surface-hover min-h-[36px] transition-none cursor-pointer"
            >
              <CheckCheck size={14} className="text-brand-teal" />
              <span>Mark all read</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Info Bar / Active Filter Chips */}
      {(hasActiveFilters || (typeof filteredCount === 'number' && typeof totalCount === 'number')) && (
        <div className="flex items-center justify-between text-xs text-secondary pt-1 border-t border-border/60">
          <div>
            {typeof filteredCount === 'number' && (
              <span>
                Showing <strong>{filteredCount}</strong>
                {typeof totalCount === 'number' && totalCount !== filteredCount
                  ? ` of ${totalCount}`
                  : ''}{' '}
                notifications
              </span>
            )}
          </div>

          {hasActiveFilters && onResetFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 text-[11px] text-brand-teal hover:underline font-semibold"
            >
              <X size={12} />
              <span>Clear filters</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
export default NotificationFilters;
