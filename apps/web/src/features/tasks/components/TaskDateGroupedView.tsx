import React from 'react';
import type { TaskItem } from '@corviin-hub/shared';
import { TaskCard } from './TaskCard';
import { getTaskDateBucket } from '../utils/task-utils';

interface TaskDateGroupedViewProps {
  tasks: TaskItem[];
  onSelectTask: (task: TaskItem) => void;
  onStart: (id: string, e: React.MouseEvent) => void;
  onPause: (id: string, e: React.MouseEvent) => void;
  onResume: (id: string, e: React.MouseEvent) => void;
  onComplete: (task: TaskItem, e: React.MouseEvent) => void;
  onReschedule: (task: TaskItem, e: React.MouseEvent) => void;
  onBlock: (task: TaskItem, e: React.MouseEvent) => void;
}

export function TaskDateGroupedView({
  tasks,
  onSelectTask,
  onStart,
  onPause,
  onResume,
  onComplete,
  onReschedule,
  onBlock,
}: TaskDateGroupedViewProps) {
  const overdueTasks = tasks.filter((t) => t.status !== 'COMPLETED' && t.status !== 'CANCELLED' && getTaskDateBucket(t) === 'Overdue');
  const todayTasks = tasks.filter((t) => t.status !== 'COMPLETED' && t.status !== 'CANCELLED' && getTaskDateBucket(t) === 'Today');
  const tomorrowTasks = tasks.filter((t) => t.status !== 'COMPLETED' && t.status !== 'CANCELLED' && getTaskDateBucket(t) === 'Tomorrow');
  const upcomingTasks = tasks.filter((t) => t.status !== 'COMPLETED' && t.status !== 'CANCELLED' && (getTaskDateBucket(t) === 'Upcoming' || getTaskDateBucket(t) === 'No Deadline'));
  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED' || t.status === 'CANCELLED');

  const groups = [
    { title: 'Overdue Work', count: overdueTasks.length, items: overdueTasks, alertClass: 'text-danger' },
    { title: 'Today', count: todayTasks.length, items: todayTasks, alertClass: 'text-ch-text-primary' },
    { title: 'Tomorrow', count: tomorrowTasks.length, items: tomorrowTasks, alertClass: 'text-ch-text-primary' },
    { title: 'Later & Upcoming', count: upcomingTasks.length, items: upcomingTasks, alertClass: 'text-ch-text-primary' },
    { title: 'Completed', count: completedTasks.length, items: completedTasks, alertClass: 'text-success' },
  ].filter((g) => g.items.length > 0);

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 bg-surface rounded-lg border border-ch-border">
        <p className="text-sm font-medium text-ch-text-secondary">No tasks match the active filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.title} className="space-y-3">
          <div className="flex items-center justify-between pb-1.5 border-b border-ch-border">
            <h3 className={`text-xs font-bold uppercase tracking-wider ${group.alertClass} flex items-center gap-2`}>
              {group.title}
              <span className="text-[11px] font-semibold px-2 py-0.2 rounded-full bg-surface-muted text-ch-text-secondary border border-ch-border">
                {group.count}
              </span>
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {group.items.map((task) => (
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
          </div>
        </div>
      ))}
    </div>
  );
}

