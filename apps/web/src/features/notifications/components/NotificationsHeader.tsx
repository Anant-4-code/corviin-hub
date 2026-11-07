import React from 'react';
import { CheckCheck, RefreshCw, Bell, Shield } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface NotificationsHeaderProps {
  unreadCount: number;
  onMarkAllRead: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const NotificationsHeader: React.FC<NotificationsHeaderProps> = ({
  unreadCount,
  onMarkAllRead,
  onRefresh,
  isRefreshing,
}) => {
  const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);
  const selectedProfileId = useAppStore((s) => s.selectedProfileId);

  const workspaceName =
    selectedWorkspaceId === 'ws-real-0002-0000-000000000002'
      ? 'CORVIIN REAL ESTATE'
      : 'CORVIIN TECH';

  const getProfileName = (id?: string) => {
    switch (id) {
      case 'b2c3d4e5-f6a7-8901-bcde-f12345678901':
        return 'Rohit';
      case 'c3d4e5f6-a7b8-9012-cdef-123456789012':
        return 'Utkarsh';
      case 'a1b2c3d4-e5f6-7890-abcd-ef1234567890':
      default:
        return 'Anant';
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-border">
      <div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-bold text-primary tracking-tight">
            Notifications & Activity
          </h1>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-brand-teal/10 text-brand-teal border border-brand-teal/30">
            {workspaceName}
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-surface-muted text-secondary border border-border">
            Profile: <strong className="text-primary">{getProfileName(selectedProfileId)}</strong>
          </span>
        </div>
        <p className="text-xs sm:text-sm text-secondary mt-1">
          Stay updated on important changes and track workspace activity.
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {unreadCount > 0 && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-none" />
            <span>{unreadCount} Unread</span>
          </span>
        )}

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-surface border border-border text-secondary hover:text-primary hover:bg-surface-muted min-h-[36px] transition-none cursor-pointer"
          >
            <CheckCheck size={14} className="text-brand-teal" />
            <span>Mark all as read</span>
          </button>
        )}

        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-surface border border-border text-secondary hover:text-primary hover:bg-surface-muted min-h-[36px] transition-none disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw size={13} className={`text-brand-teal ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh Feed'}</span>
        </button>
      </div>
    </div>
  );
};
export default NotificationsHeader;

