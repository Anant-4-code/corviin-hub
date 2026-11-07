import React from 'react';
import type { TaskItem } from '@corviin-hub/shared';
import { isTaskOverdue, getTaskDateBucket } from '../utils/task-utils';
import {
  Inbox,
  PlayCircle,
  Calendar,
  AlertOctagon,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';

export type TaskSummaryFilterKey =
  | 'all_open'
  | 'in_progress'
  | 'due_today'
  | 'overdue'
  | 'completed'
  | 'blocked';

interface MyTasksSummaryCardsProps {
  tasks: TaskItem[];
  activeFilter?: TaskSummaryFilterKey | null;
  onSelectFilter: (filter: TaskSummaryFilterKey) => void;
}

export function MyTasksSummaryCards({
  tasks,
  activeFilter,
  onSelectFilter,
}: MyTasksSummaryCardsProps) {
  // Metric counts
  const totalOpen = tasks.filter(
    (t) => t.status !== 'COMPLETED' && t.status !== 'CANCELLED',
  ).length;

  const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS').length;

  const dueToday = tasks.filter(
    (t) =>
      t.status !== 'COMPLETED' &&
      t.status !== 'CANCELLED' &&
      getTaskDateBucket(t) === 'Today',
  ).length;

  const overdue = tasks.filter((t) => isTaskOverdue(t)).length;

  const completed = tasks.filter((t) => t.status === 'COMPLETED').length;

  const blocked = tasks.filter((t) => t.status === 'BLOCKED').length;

  const cards: {
    key: TaskSummaryFilterKey;
    label: string;
    count: number;
    icon: React.ElementType;
    colorClasses: string;
    badgeClasses: string;
    attention?: boolean;
  }[] = [
    {
      key: 'all_open',
      label: 'Total Open',
      count: totalOpen,
      icon: Inbox,
      colorClasses: 'border-blue-200 dark:border-blue-900/50 hover:border-blue-400',
      badgeClasses: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
    },
    {
      key: 'in_progress',
      label: 'In Progress',
      count: inProgress,
      icon: PlayCircle,
      colorClasses: 'border-indigo-200 dark:border-indigo-900/50 hover:border-indigo-400',
      badgeClasses: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300',
    },
    {
      key: 'due_today',
      label: 'Due Today',
      count: dueToday,
      icon: Calendar,
      colorClasses: 'border-amber-200 dark:border-amber-900/50 hover:border-amber-400',
      badgeClasses: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
      attention: dueToday > 0,
    },
    {
      key: 'overdue',
      label: 'Overdue',
      count: overdue,
      icon: AlertOctagon,
      colorClasses: 'border-red-200 dark:border-red-900/50 hover:border-red-400',
      badgeClasses: 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300',
      attention: overdue > 0,
    },
    {
      key: 'blocked',
      label: 'Blocked',
      count: blocked,
      icon: ShieldAlert,
      colorClasses: 'border-rose-200 dark:border-rose-900/50 hover:border-rose-400',
      badgeClasses: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
      attention: blocked > 0,
    },
    {
      key: 'completed',
      label: 'Completed',
      count: completed,
      icon: CheckCircle2,
      colorClasses: 'border-emerald-200 dark:border-emerald-900/50 hover:border-emerald-400',
      badgeClasses: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
      {cards.map((c) => {
        const Icon = c.icon;
        const isSelected = activeFilter === c.key;

        return (
          <button
            key={c.key}
            type="button"
            onClick={() => onSelectFilter(c.key)}
            className={`flex flex-col justify-between p-3 rounded-lg border text-left transition-none ${
              isSelected
                ? 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-500 dark:border-blue-400 ring-1 ring-blue-500'
                : 'bg-surface border-ch-border hover:bg-surface-muted'
            }`}
          >
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <span className="text-[11px] font-medium text-ch-text-secondary truncate">
                {c.label}
              </span>
              <div
                className={`p-1 rounded ${
                  isSelected
                    ? 'bg-blue-600 text-white dark:bg-blue-500'
                    : c.badgeClasses
                }`}
              >
                <Icon size={13} />
              </div>
            </div>

            <div className="flex items-baseline justify-between mt-auto">
              <span
                className={`text-xl font-bold tracking-tight ${
                  c.attention && c.count > 0
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-ch-text-primary'
                }`}
              >
                {c.count}
              </span>
              {isSelected && (
                <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                  Active Filter
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
