import React from 'react';
import { Card } from '@/components/ui/Card';
import { Calendar, Play, AlertTriangle, CheckCircle2, Clock, Ban } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface TeamTasksKpiMetrics {
  totalScheduled: number;
  dueToday: number;
  totalOverdue: number;
  totalInProgress: number;
  totalBlocked: number;
  completedThisWeek: number;
}

interface TeamTasksKpiCardsProps {
  metrics: TeamTasksKpiMetrics;
  activeFilter?: string | null;
  onSelectKpi?: (filterKey: string) => void;
}

export function TeamTasksKpiCards({
  metrics,
  activeFilter,
  onSelectKpi,
}: TeamTasksKpiCardsProps) {
  const cards = [
    {
      id: 'ALL',
      title: 'Scheduled for Date',
      subtitle: 'Total Tasks',
      value: metrics.totalScheduled,
      unit: 'in scope',
      icon: Calendar,
      color: 'text-ch-text-primary',
      activeBg: 'border-accent bg-accent/5 ring-1 ring-accent/30',
    },
    {
      id: 'DUE_TODAY',
      title: 'Due Today',
      subtitle: 'Current date',
      value: metrics.dueToday,
      unit: 'tasks',
      icon: Clock,
      color: 'text-amber-500 dark:text-amber-400',
      activeBg: 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500/30',
    },
    {
      id: 'OVERDUE',
      title: 'Urgent / Overdue',
      subtitle: 'Needs attention',
      value: metrics.totalOverdue,
      unit: 'tasks',
      icon: AlertTriangle,
      color: metrics.totalOverdue > 0 ? 'text-danger' : 'text-ch-text-muted',
      activeBg: 'border-danger bg-danger/10 ring-1 ring-danger/30',
    },
    {
      id: 'IN_PROGRESS',
      title: 'In Progress',
      subtitle: 'Active Work Sessions',
      value: metrics.totalInProgress,
      unit: 'in progress',
      icon: Play,
      color: 'text-blue-500 dark:text-blue-400',
      activeBg: 'border-blue-500 bg-blue-500/10 ring-1 ring-blue-500/30',
    },
    {
      id: 'BLOCKED',
      title: 'Blocked',
      subtitle: 'Action required',
      value: metrics.totalBlocked,
      unit: 'blocked',
      icon: Ban,
      color: metrics.totalBlocked > 0 ? 'text-red-500' : 'text-ch-text-muted',
      activeBg: 'border-red-500 bg-red-500/10 ring-1 ring-red-500/30',
    },
    {
      id: 'COMPLETED_THIS_WEEK',
      title: 'Completed',
      subtitle: 'Completed This Week',
      value: metrics.completedThisWeek,
      unit: 'delivered',
      icon: CheckCircle2,
      color: 'text-emerald-500 dark:text-emerald-400',
      activeBg: 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeFilter === card.id;

        return (
          <Card
            key={card.id}
            onClick={() => onSelectKpi?.(card.id)}
            className={cn(
              'p-3 border transition-none cursor-pointer select-none text-left flex flex-col justify-between',
              isActive
                ? card.activeBg
                : 'border-ch-border bg-surface hover:border-ch-border-strong',
            )}
            role="button"
            tabIndex={0}
            aria-pressed={isActive}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectKpi?.(card.id);
              }
            }}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[11px] font-semibold text-ch-text-secondary truncate">
                {card.title}
              </span>
              <Icon size={14} className={card.color} />
            </div>

            <div className="mt-2 flex items-baseline gap-1.5">
              <span className={cn('text-xl font-bold tracking-tight', card.color)}>
                {card.value}
              </span>
              <span className="text-[10px] text-ch-text-muted truncate">
                {card.unit}
              </span>
            </div>

            <div className="mt-1 text-[10px] text-ch-text-muted truncate font-medium">
              {card.subtitle}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

