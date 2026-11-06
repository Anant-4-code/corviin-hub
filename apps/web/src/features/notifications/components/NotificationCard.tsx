import React from 'react';
import { Link } from 'react-router-dom';
import {
  CheckSquare,
  Users2,
  Video,
  Megaphone,
  Target,
  FileText,
  Bell,
  ArrowRight,
  Check,
} from 'lucide-react';
import type { InAppNotificationItem } from '@corviin-hub/shared';

interface NotificationCardProps {
  notification: InAppNotificationItem;
  onToggleRead: (id: string, isRead: boolean) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onToggleRead,
}) => {
  const getIcon = () => {
    switch (notification.entityType) {
      case 'TASK':
        return <CheckSquare size={16} className="text-blue-500" />;
      case 'CRM':
        return <Users2 size={16} className="text-emerald-500" />;
      case 'MEETING':
        return <Video size={16} className="text-purple-500" />;
      case 'CAMPAIGN':
        return <Megaphone size={16} className="text-amber-500" />;
      case 'GOAL':
        return <Target size={16} className="text-rose-500" />;
      default:
        return <Bell size={16} className="text-brand-teal" />;
    }
  };

  const formattedDate = new Date(notification.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        notification.isRead
          ? 'bg-surface border-border text-secondary'
          : 'bg-surface border-brand-teal/40 ring-1 ring-brand-teal/20 text-primary'
      }`}
    >
      <div className="flex items-start gap-3.5">
        <div className="p-2 rounded bg-surface-muted border border-border shrink-0 mt-0.5">
          {getIcon()}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-primary">{notification.title}</span>
            {!notification.isRead && (
              <span className="w-2 h-2 rounded-full bg-brand-teal" title="Unread" />
            )}
            <span className="text-[10px] text-tertiary">
              {new Date(notification.createdAt).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
              })}{' '}
              at {formattedDate}
            </span>
          </div>
          <p className="text-xs leading-relaxed text-secondary">{notification.message}</p>
          <div className="text-[10px] text-tertiary">
            From: <span className="font-medium text-primary">{notification.actorName}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0">
        <button
          type="button"
          onClick={() => onToggleRead(notification.id, !notification.isRead)}
          className={`px-2.5 py-1.5 rounded text-xs font-medium border min-h-[38px] ${
            notification.isRead
              ? 'bg-surface-muted text-secondary border-border hover:bg-surface-hover'
              : 'bg-brand-teal/10 text-brand-teal border-brand-teal/30 hover:bg-brand-teal/20'
          }`}
          title={notification.isRead ? 'Mark as unread' : 'Mark as read'}
        >
          {notification.isRead ? 'Mark unread' : 'Mark read'}
        </button>

        <Link
          to={notification.actionDestination}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-surface-muted text-primary border border-border hover:bg-surface-hover min-h-[38px]"
        >
          <span>Open</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
};

