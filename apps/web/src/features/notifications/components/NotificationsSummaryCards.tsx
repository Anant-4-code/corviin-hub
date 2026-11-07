import React from 'react';
import type { InAppNotificationItem } from '@corviin-hub/shared';

interface NotificationsSummaryCardsProps {
  notifications: InAppNotificationItem[];
  activeFilter?: string;
  onFilterSelect?: (filter: { unreadOnly?: boolean; priority?: string; todayOnly?: boolean }) => void;
}

export const NotificationsSummaryCards: React.FC<NotificationsSummaryCardsProps> = ({
  notifications,
  activeFilter,
  onFilterSelect,
}) => {
  const totalCount = notifications.length;
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const highPriorityCount = notifications.filter(
    (n) => n.priority === 'HIGH' || n.priority === 'URGENT',
  ).length;

  const now = new Date();
  const todayStr = now.toDateString();
  const todayCount = notifications.filter(
    (n) => new Date(n.createdAt).toDateString() === todayStr,
  ).length;

  const cards = [
    {
      id: 'all',
      label: 'All Notifications',
      value: totalCount,
      accent: 'border-l-brand-teal text-primary',
      desc: 'Total inbox notifications',
      filter: { unreadOnly: false, priority: 'ALL', todayOnly: false },
    },
    {
      id: 'unread',
      label: 'Unread',
      value: unreadCount,
      accent: 'border-l-amber-500 text-amber-600 dark:text-amber-400',
      desc: 'Actionable items requiring attention',
      filter: { unreadOnly: true, priority: 'ALL', todayOnly: false },
    },
    {
      id: 'high_priority',
      label: 'High Priority',
      value: highPriorityCount,
      accent: 'border-l-rose-500 text-rose-600 dark:text-rose-400',
      desc: 'Urgent & high priority alerts',
      filter: { unreadOnly: false, priority: 'HIGH', todayOnly: false },
    },
    {
      id: 'today',
      label: 'Today',
      value: todayCount,
      accent: 'border-l-blue-500 text-blue-600 dark:text-blue-400',
      desc: 'Events logged in the last 24h',
      filter: { unreadOnly: false, priority: 'ALL', todayOnly: true },
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map((card) => (
        <button
          key={card.id}
          type="button"
          onClick={() => onFilterSelect && onFilterSelect(card.filter)}
          className={`bg-surface border rounded-md p-3.5 border-l-4 text-left transition-none select-none cursor-pointer border-border hover:bg-surface-muted/60 ${
            card.accent
          }`}
        >
          <div className="text-xs font-medium text-secondary truncate">{card.label}</div>
          <div className="text-2xl font-bold tracking-tight mt-1">{card.value}</div>
          <div className="text-[11px] text-tertiary truncate mt-0.5">{card.desc}</div>
        </button>
      ))}
    </div>
  );
};
export default NotificationsSummaryCards;

