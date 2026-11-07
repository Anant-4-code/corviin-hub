import React from 'react';
import type { TaskItem } from '@corviin-hub/shared';

interface TaskDistributionProps {
  tasks: TaskItem[];
  selectedStatus?: string;
  onSelectStatus: (status: string) => void;
}

export function TaskDistribution({
  tasks,
  selectedStatus,
  onSelectStatus,
}: TaskDistributionProps) {
  const total = tasks.length;

  const counts: Record<string, { label: string; count: number; colorClass: string; bgClass: string }> = {
    TODO: {
      label: 'To Do',
      count: tasks.filter((t) => t.status === 'TODO').length,
      colorClass: 'bg-slate-400 dark:bg-slate-500',
      bgClass: 'text-slate-700 dark:text-slate-300',
    },
    IN_PROGRESS: {
      label: 'In Progress',
      count: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
      colorClass: 'bg-blue-500 dark:bg-blue-400',
      bgClass: 'text-blue-700 dark:text-blue-300',
    },
    ON_HOLD: {
      label: 'On Hold',
      count: tasks.filter((t) => t.status === 'ON_HOLD').length,
      colorClass: 'bg-amber-500 dark:bg-amber-400',
      bgClass: 'text-amber-700 dark:text-amber-300',
    },
    BLOCKED: {
      label: 'Blocked',
      count: tasks.filter((t) => t.status === 'BLOCKED').length,
      colorClass: 'bg-rose-500 dark:bg-rose-400',
      bgClass: 'text-rose-700 dark:text-rose-300',
    },
    COMPLETED: {
      label: 'Completed',
      count: tasks.filter((t) => t.status === 'COMPLETED').length,
      colorClass: 'bg-emerald-500 dark:bg-emerald-400',
      bgClass: 'text-emerald-700 dark:text-emerald-300',
    },
    CANCELLED: {
      label: 'Cancelled',
      count: tasks.filter((t) => t.status === 'CANCELLED').length,
      colorClass: 'bg-slate-300 dark:bg-slate-700',
      bgClass: 'text-slate-500 dark:text-slate-400',
    },
  };

  if (total === 0) {
    return (
      <div className="bg-surface rounded-lg border border-ch-border p-3 text-xs text-ch-text-secondary flex items-center justify-between">
        <span className="font-semibold text-ch-text-primary">Status Distribution</span>
        <span className="text-ch-text-muted">No task records in this workspace</span>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg border border-ch-border p-3 space-y-2.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-ch-text-primary">
          Status Distribution
        </span>
        <span className="text-[11px] text-ch-text-muted">
          {total} {total === 1 ? 'task' : 'total tasks'}
        </span>
      </div>

      {/* Segmented Bar */}
      <div className="h-2.5 w-full bg-surface-muted rounded-full overflow-hidden flex">
        {Object.entries(counts).map(([statusKey, info]) => {
          if (info.count === 0) return null;
          const percent = Math.round((info.count / total) * 100);

          return (
            <div
              key={statusKey}
              onClick={() => onSelectStatus(selectedStatus === statusKey ? 'ALL' : statusKey)}
              title={`${info.label}: ${info.count} (${percent}%)`}
              style={{ width: `${(info.count / total) * 100}%` }}
              className={`h-full ${info.colorClass} cursor-pointer hover:opacity-85 transition-none`}
            />
          );
        })}
      </div>

      {/* Legend & Quick Filters */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
        {Object.entries(counts).map(([statusKey, info]) => {
          const percent = total > 0 ? Math.round((info.count / total) * 100) : 0;
          const isSelected = selectedStatus === statusKey;

          return (
            <button
              key={statusKey}
              type="button"
              onClick={() =>
                onSelectStatus(isSelected ? 'ALL' : statusKey)
              }
              className={`inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded transition-none ${
                isSelected
                  ? 'bg-blue-100 text-blue-900 dark:bg-blue-900/40 dark:text-blue-200 font-bold'
                  : 'text-ch-text-secondary hover:text-ch-text-primary hover:bg-surface-muted'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${info.colorClass}`} />
              <span>{info.label}:</span>
              <span className="font-mono font-semibold">{info.count}</span>
              <span className="text-ch-text-muted">({percent}%)</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
