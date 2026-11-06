import React from 'react';
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
  const todoTasks = tasks.filter((t) => t.status === 'TODO');
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS');
  const onHoldOrBlockedTasks = tasks.filter((t) => t.status === 'ON_HOLD' || t.status === 'BLOCKED');
  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED');

  const columns = [
    { title: 'To Do', count: todoTasks.length, items: todoTasks, borderColor: 'border-t-ch-border-strong' },
    { title: 'In Progress', count: inProgressTasks.length, items: inProgressTasks, borderColor: 'border-t-info' },
    { title: 'On Hold / Blocked', count: onHoldOrBlockedTasks.length, items: onHoldOrBlockedTasks, borderColor: 'border-t-warning' },
    { title: 'Completed', count: completedTasks.length, items: completedTasks, borderColor: 'border-t-success' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
      {columns.map((col) => (
        <div
          key={col.title}
          className={`bg-surface-muted/30 border border-ch-border border-t-4 ${col.borderColor} rounded-lg p-3 space-y-3 min-h-[400px] flex flex-col`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-ch-border">
            <h3 className="text-xs font-bold uppercase tracking-wider text-ch-text-primary">
              {col.title}
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-surface text-ch-text-secondary border border-ch-border">
              {col.count}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
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
              <div className="text-center py-10 text-xs text-ch-text-muted border border-dashed border-ch-border rounded">
                No tasks
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

