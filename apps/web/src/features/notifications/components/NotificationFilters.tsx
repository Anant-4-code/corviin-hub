import React from 'react';
import { CheckCheck } from 'lucide-react';

interface NotificationFiltersProps {
  unreadOnly: boolean;
  onUnreadOnlyChange: (unread: boolean) => void;
  typeFilter: string;
  onTypeFilterChange: (type: string) => void;
  onMarkAllRead: () => void;
  unreadCount: number;
}

export const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  unreadOnly,
  onUnreadOnlyChange,
  typeFilter,
  onTypeFilterChange,
  onMarkAllRead,
  unreadCount,
}) => {
  const typeOptions = [
    { id: 'ALL', label: 'All Categories' },
    { id: 'TASK_ASSIGNED', label: 'Task Assignments' },
    { id: 'TASK_DUE_SOON', label: 'Due Soon / Overdue' },
    { id: 'CRM_FOLLOW_UP_DUE', label: 'CRM Leads & Follow-ups' },
    { id: 'MEETING_APPROACHING', label: 'Meetings & Site Visits' },
    { id: 'CAMPAIGN_REVIEW_PENDING', label: 'Campaign Reviews' },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-surface border border-border rounded-lg">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center p-0.5 bg-surface-muted rounded border border-border">
          <button
            type="button"
            onClick={() => onUnreadOnlyChange(false)}
            className={`px-3 py-1.5 text-xs font-semibold rounded min-h-[36px] ${
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
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded min-h-[36px] ${
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

        <select
          value={typeFilter}
          onChange={(e) => onTypeFilterChange(e.target.value)}
          className="text-xs bg-surface border border-border rounded px-3 py-1.5 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal min-h-[36px]"
        >
          {typeOptions.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {unreadCount > 0 && (
        <button
          type="button"
          onClick={onMarkAllRead}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-surface-muted border border-border text-secondary hover:text-primary hover:bg-surface-hover min-h-[38px] self-end sm:self-center"
        >
          <CheckCheck size={14} className="text-brand-teal" />
          <span>Mark all read</span>
        </button>
      )}
    </div>
  );
};

