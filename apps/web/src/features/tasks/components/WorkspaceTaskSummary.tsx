import React from 'react';
import type { TaskItem } from '@corviin-hub/shared';
import { isTaskOverdue, getTaskDateBucket } from '../utils/task-utils';
import {
  Layers,
  Inbox,
  PlayCircle,
  AlertOctagon,
  ShieldAlert,
  UserX,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export type WorkspaceSummaryFilterKey =
  | 'total'
  | 'open'
  | 'in_progress'
  | 'overdue'
  | 'blocked'
  | 'unassigned'
  | 'completed'
  | 'due_today';

interface WorkspaceTaskSummaryProps {
  tasks: TaskItem[];
  activeFilter?: WorkspaceSummaryFilterKey | null;
  onSelectFilter: (filter: WorkspaceSummaryFilterKey) => void;
}

export function WorkspaceTaskSummary({
  tasks,
  activeFilter,
  onSelectFilter,
}: WorkspaceTaskSummaryProps) {
  const totalTasks = tasks.length;

  const openTasks = tasks.filter(
    (t) => t.status !== 'COMPLETED' && t.status !== 'CANCELLED',
  ).length;

  const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS').length;

  const overdue = tasks.filter((t) => isTaskOverdue(t)).length;

  const blocked = tasks.filter((t) => t.status === 'BLOCKED').length;

  const unassigned = tasks.filter(
    (t) => !t.assigneeId || t.assigneeId === 'unassigned',
  ).length;

  const completed = tasks.filter((t) => t.status === 'COMPLETED').length;

  const dueToday = tasks.filter(
    (t) =>
      t.status !== 'COMPLETED' &&
      t.status !== 'CANCELLED' &&
      getTaskDateBucket(t) === 'Today',
  ).length;

  const cards: {
    key: WorkspaceSummaryFilterKey;
    label: string;
    count: number;
    icon: React.ElementType;
    badgeClasses: string;
    attention?: boolean;
  }[] = [
    {
      key: 'total',
      label: 'Total Tasks',
      count: totalTasks,
      icon: Layers,
      badgeClasses: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    },
    {
      key: 'open',
      label: 'Open Tasks',
      count: openTasks,
      icon: Inbox,
      badgeClasses: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
    },
    {
      key: 'in_progress',
      label: 'In Progress',
      count: inProgress,
      icon: PlayCircle,
      badgeClasses: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300',
    },
    {
      key: 'due_today',
      label: 'Due Today',
      count: dueToday,
      icon: Calendar,
      badgeClasses: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
      attention: dueToday > 0,
    },
    {
      key: 'overdue',
      label: 'Overdue',
      count: overdue,
      icon: AlertOctagon,
      badgeClasses: 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300',
      attention: overdue > 0,
    },
    {
      key: 'blocked',
      label: 'Blocked',
      count: blocked,
      icon: ShieldAlert,
      badgeClasses: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
      attention: blocked > 0,
    },
    {
      key: 'unassigned',
      label: 'Unassigned',
      count: unassigned,
      icon: UserX,
      badgeClasses: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300',
      attention: unassigned > 0,
    },
    {
      key: 'completed',
      label: 'Completed',
      count: completed,
      icon: CheckCircle2,
      badgeClasses: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
      {cards.map((c) => {
        const Icon = c.icon;
        const isSelected = activeFilter === c.key;

        return (
          <button
            key={c.key}
            type="button"
            onClick={() => onSelectFilter(c.key)}
            className={`flex flex-col justify-between p-2.5 rounded-lg border text-left transition-none ${
              isSelected
                ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-500 dark:border-blue-400 ring-1 ring-blue-500'
                : 'bg-surface border-ch-border hover:bg-surface-muted'
            }`}
          >
            <div className="flex items-center justify-between gap-1 mb-1">
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
                <Icon size={12} />
              </div>
            </div>

            <div className="flex items-baseline justify-between mt-auto">
              <span
                className={`text-lg font-bold tracking-tight ${
                  c.attention && c.count > 0
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-ch-text-primary'
                }`}
              >
                {c.count}
              </span>
              {isSelected && (
                <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400">
                  Active
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
