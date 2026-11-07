import React, { useMemo } from 'react';
import type { AuditEventItem } from '@corviin-hub/shared';

interface ActivitySummaryCardsProps {
  events: AuditEventItem[];
  onFilterSelect?: (filter: { dateRange?: string; entityType?: string }) => void;
}

export const ActivitySummaryCards: React.FC<ActivitySummaryCardsProps> = ({
  events,
  onFilterSelect,
}) => {
  const totalEvents = events.length;

  const now = new Date();
  const todayStr = now.toDateString();
  const todayCount = useMemo(
    () => events.filter((e) => new Date(e.timestamp).toDateString() === todayStr).length,
    [events, todayStr],
  );

  const activeMembersCount = useMemo(() => {
    const actors = new Set<string>();
    events.forEach((e) => {
      if (e.actorName) actors.add(e.actorName);
    });
    return actors.size;
  }, [events]);

  const activeModulesCount = useMemo(() => {
    const modules = new Set<string>();
    events.forEach((e) => {
      if (e.entityType) modules.add(e.entityType);
    });
    return modules.size;
  }, [events]);

  const cards = [
    {
      id: 'total',
      label: 'Total Activity Events',
      value: totalEvents,
      accent: 'border-l-brand-teal text-primary',
      desc: 'Immutable platform audit log',
      filter: { dateRange: 'ALL', entityType: 'ALL' },
    },
    {
      id: 'today',
      label: "Today's Events",
      value: todayCount,
      accent: 'border-l-blue-500 text-blue-600 dark:text-blue-400',
      desc: 'Changes committed in last 24h',
      filter: { dateRange: 'TODAY', entityType: 'ALL' },
    },
    {
      id: 'members',
      label: 'Active Members',
      value: activeMembersCount,
      accent: 'border-l-emerald-500 text-emerald-600 dark:text-emerald-400',
      desc: 'Distinct team actors logged',
      filter: { dateRange: 'ALL', entityType: 'ALL' },
    },
    {
      id: 'modules',
      label: 'Modules with Activity',
      value: activeModulesCount,
      accent: 'border-l-purple-500 text-purple-600 dark:text-purple-400',
      desc: 'Active operational domains',
      filter: { dateRange: 'ALL', entityType: 'ALL' },
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
export default ActivitySummaryCards;

