import React from 'react';
import { Link } from 'react-router-dom';
import {
  CheckSquare,
  Users2,
  Video,
  Megaphone,
  Target,
  FolderOpen,
  Settings,
  Bell,
  ArrowRight,
} from 'lucide-react';
import type { InAppNotificationItem } from '@corviin-hub/shared';
import { formatRelativeTime, formatExactDateTime } from './notification-constants';

interface NotificationCardProps {
  notification: InAppNotificationItem;
  onToggleRead: (id: string, isRead: boolean) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onToggleRead,
}) => {
  const getDomainConfig = () => {
    switch (notification.entityType) {
      case 'TASK':
        return {
          icon: <CheckSquare size={16} className="text-blue-500" />,
          label: 'Task',
          borderClass: 'border-l-blue-500',
          badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        };
      case 'CRM':
        return {
          icon: <Users2 size={16} className="text-emerald-500" />,
          label: 'CRM',
          borderClass: 'border-l-emerald-500',
          badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        };
      case 'MEETING':
        return {
          icon: <Video size={16} className="text-purple-500" />,
          label: 'Meeting',
          borderClass: 'border-l-purple-500',
          badgeClass: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800',
        };
      case 'CAMPAIGN':
        return {
          icon: <Megaphone size={16} className="text-amber-500" />,
          label: 'Campaign',
          borderClass: 'border-l-amber-500',
          badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
        };
      case 'GOAL':
        return {
          icon: <Target size={16} className="text-rose-500" />,
          label: 'Goal',
          borderClass: 'border-l-rose-500',
          badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
        };
      case 'ASSET':
        return {
          icon: <FolderOpen size={16} className="text-cyan-500" />,
          label: 'Asset',
          borderClass: 'border-l-cyan-500',
          badgeClass: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
        };
      case 'SETTINGS':
        return {
          icon: <Settings size={16} className="text-stone-500" />,
          label: 'System',
          borderClass: 'border-l-stone-500',
          badgeClass: 'bg-stone-100 text-stone-800 dark:bg-stone-900/60 dark:text-stone-300 border-stone-200 dark:border-stone-800',
        };
      default:
        return {
          icon: <Bell size={16} className="text-brand-teal" />,
          label: 'Alert',
          borderClass: 'border-l-brand-teal',
          badgeClass: 'bg-surface-muted text-secondary border-border',
        };
    }
  };

  const getPriorityBadge = (priority?: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border-rose-300 dark:border-rose-800';
      case 'HIGH':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-300 dark:border-blue-800';
      case 'LOW':
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700';
    }
  };

  const domain = getDomainConfig();
  const relativeTime = formatRelativeTime(notification.createdAt);
  const exactTime = formatExactDateTime(notification.createdAt);

  return (
    <div
      className={`p-3.5 sm:p-4 rounded-lg border border-l-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 transition-none ${
        domain.borderClass
      } ${
        notification.isRead
          ? 'bg-surface border-border text-secondary'
          : 'bg-surface border-border ring-1 ring-brand-teal/30 text-primary shadow-xs'
      }`}
    >
      <div className="flex items-start gap-3 min-w-0">
        {/* Category Icon */}
        <div className="p-2 rounded bg-surface-muted border border-border shrink-0 mt-0.5">
          {domain.icon}
        </div>

        {/* Content Body */}
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border ${domain.badgeClass}`}
            >
              {domain.label}
            </span>

            {notification.priority && (
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border ${getPriorityBadge(
                  notification.priority,
                )}`}
              >
                {notification.priority}
              </span>
            )}

            <span
              className={`text-xs ${
                notification.isRead ? 'font-semibold text-secondary' : 'font-bold text-primary'
              }`}
            >
              {notification.title}
            </span>

            {!notification.isRead && (
              <span
                className="w-2 h-2 rounded-full bg-brand-teal shrink-0"
                title="Unread notification"
              />
            )}

            <span className="text-[11px] text-tertiary ml-auto sm:ml-0" title={exactTime}>
              {relativeTime}
            </span>
          </div>

          <p className="text-xs leading-relaxed text-secondary break-words">
            {notification.message}
          </p>

          <div className="flex items-center gap-2 text-[11px] text-tertiary flex-wrap">
            <span>
              From: <strong className="text-primary font-medium">{notification.actorName}</strong>
            </span>
            <span>•</span>
            <span className="truncate">
              Target ID: <code className="font-mono text-[10px]">{notification.entityId}</code>
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0">
        <button
          type="button"
          onClick={() => onToggleRead(notification.id, !notification.isRead)}
          className={`px-3 py-1.5 rounded text-xs font-semibold border min-h-[38px] transition-none cursor-pointer ${
            notification.isRead
              ? 'bg-surface-muted text-secondary border-border hover:bg-surface-hover hover:text-primary'
              : 'bg-brand-teal/10 text-brand-teal border-brand-teal/30 hover:bg-brand-teal/20'
          }`}
          title={notification.isRead ? 'Mark as unread' : 'Mark as read'}
        >
          {notification.isRead ? 'Mark unread' : 'Mark read'}
        </button>

        <Link
          to={notification.actionDestination}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-surface-muted text-primary border border-border hover:bg-surface-hover hover:border-brand-teal min-h-[38px] transition-none"
        >
          <span>Open</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
};
export default NotificationCard;
