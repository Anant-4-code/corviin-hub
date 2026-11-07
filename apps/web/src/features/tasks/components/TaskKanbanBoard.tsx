import React, { useState } from 'react';
import type { TaskItem } from '@corviin-hub/shared';
import { TaskCard } from './TaskCard';

interface TaskKanbanBoardProps {
  tasks: TaskItem[];
  onSelectTask: (task: TaskItem) => void;
  onStart: (id: string, e: React.MouseEvent) => void;
  onPause: (id: string, e: React.MouseEvent) => void;
  onResume: (id: string, e: React.MouseEvent) => void;
  onComplete: (task: TaskItem, e: React.MouseEvent) => void;
  onReschedule: (task: TaskItem, e: React.MouseEvent) => void;
  onBlock: (task: TaskItem, e: React.MouseEvent) => void;
}

export function TaskKanbanBoard({
  tasks,
  onSelectTask,
  onStart,
  onPause,
  onResume,
  onComplete,
  onReschedule,
  onBlock,
}: TaskKanbanBoardProps) {
  const [mobileActiveColumn, setMobileActiveColumn] = useState<string>('TODO');

  const todoTasks = tasks.filter((t) => t.status === 'TODO');
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS');
  const onHoldTasks = tasks.filter((t) => t.status === 'ON_HOLD');
  const blockedTasks = tasks.filter((t) => t.status === 'BLOCKED');
  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED');
  const cancelledTasks = tasks.filter((t) => t.status === 'CANCELLED');

  const columns = [
    {
      id: 'TODO',
      title: 'To Do',
      count: todoTasks.length,
      items: todoTasks,
      borderTop: 'border-t-slate-400 dark:border-t-slate-600',
      badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    },
    {
      id: 'IN_PROGRESS',
      title: 'In Progress',
      count: inProgressTasks.length,
      items: inProgressTasks,
      borderTop: 'border-t-blue-500',
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    },
    {
      id: 'ON_HOLD',
      title: 'On Hold',
      count: onHoldTasks.length,
      items: onHoldTasks,
      borderTop: 'border-t-amber-500',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    },
    {
      id: 'BLOCKED',
      title: 'Blocked',
      count: blockedTasks.length,
      items: blockedTasks,
      borderTop: 'border-t-rose-500',
      badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
    },
    {
      id: 'COMPLETED',
      title: 'Completed',
      count: completedTasks.length,
      items: completedTasks,
      borderTop: 'border-t-emerald-500',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    },
    {
      id: 'CANCELLED',
      title: 'Cancelled',
      count: cancelledTasks.length,
      items: cancelledTasks,
      borderTop: 'border-t-slate-300 dark:border-t-slate-700',
      badgeColor: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
    },
  ];

  return (
    <div className="space-y-3">
      {/* Mobile Column Switcher Pills (< 768px) */}
      <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {columns.map((col) => (
          <button
            key={col.id}
            type="button"
            onClick={() => setMobileActiveColumn(col.id)}
            className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap flex items-center gap-1.5 border transition-none ${
              mobileActiveColumn === col.id
                ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                : 'bg-surface text-ch-text-secondary border-ch-border hover:bg-surface-muted'
            }`}
          >
            <span>{col.title}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                mobileActiveColumn === col.id
                  ? 'bg-white/20 text-white'
                  : 'bg-surface-muted text-ch-text-secondary'
              }`}
            >
              {col.count}
            </span>
          </button>
        ))}
      </div>

      {/* Kanban Columns (Single DOM structure: on mobile only active is visible; on desktop all 6 grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 items-start">
        {columns.map((col) => {
          const isVisibleOnMobile = mobileActiveColumn === col.id;

          return (
            <div
              key={col.id}
              className={`bg-surface-muted/30 border border-ch-border border-t-4 ${col.borderTop} rounded-lg p-2.5 space-y-2.5 min-h-[400px] ${
                isVisibleOnMobile ? 'flex' : 'hidden md:flex'
              } flex-col`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-ch-border">
                <h3 className="text-xs font-bold uppercase tracking-wider text-ch-text-primary truncate">
                  {col.title}
                </h3>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${col.badgeColor}`}>
                  {col.count}
                </span>
              </div>

              <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[calc(100vh-280px)]">
                {col.items.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={onSelectTask}
                    onStart={onStart}
                    onPause={onPause}
                    onResume={onResume}
                    onComplete={onComplete}
                    onReschedule={onReschedule}
                    onBlock={onBlock}
                  />
                ))}

                {col.items.length === 0 && (
                  <div className="text-center py-10 text-xs text-ch-text-muted border border-dashed border-ch-border rounded-lg bg-surface/50">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
