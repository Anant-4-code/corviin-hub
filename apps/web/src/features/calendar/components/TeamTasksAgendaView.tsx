import React from 'react';
import type { TaskItem } from '@corviin-hub/shared';
import { TeamTaskCard } from './TeamTaskCard';
import { Calendar, Plus, ListFilter } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface TeamTasksAgendaViewProps {
  tasks: TaskItem[];
  onSelectTask: (task: TaskItem) => void;
  onRescheduleTask?: (task: TaskItem) => void;
  onCompleteTask?: (task: TaskItem) => void;
  onCreateTask?: () => void;
}

export function TeamTasksAgendaView({
  tasks,
  onSelectTask,
  onRescheduleTask,
  onCompleteTask,
  onCreateTask,
}: TeamTasksAgendaViewProps) {
  // Only tasks with deadlines
  const scheduledTasks = tasks.filter((t) => Boolean(t.deadline));

  if (scheduledTasks.length === 0) {
    return (
      <div className="text-center py-12 bg-surface rounded-card border border-ch-border p-6 space-y-3">
        <Calendar size={32} className="mx-auto text-ch-text-muted" />
        <h3 className="text-sm font-bold text-ch-text-primary">No tasks in this agenda schedule</h3>
        <p className="text-xs text-ch-text-secondary max-w-sm mx-auto">
          No tasks match the active filters for the selected period. You can clear filters or create a new task.
        </p>
        {onCreateTask && (
          <Button
            size="sm"
            onClick={onCreateTask}
            className="text-xs h-8 px-3 font-semibold bg-accent text-accent-foreground"
          >
            <Plus size={13} className="mr-1" /> Create Task
          </Button>
        )}
      </div>
    );
  }

  // Sort tasks chronologically by deadline
  const sorted = [...scheduledTasks].sort((a, b) => {
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  // Group by date string (YYYY-MM-DD)
  const grouped: Record<string, TaskItem[]> = {};
  for (const t of sorted) {
    const key = t.deadline.slice(0, 10);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(t);
  }

  const todayKey = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowKey = tomorrow.toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([dateKey, dayTasks]) => {
        const isToday = dateKey === todayKey;
        const isTomorrow = dateKey === tomorrowKey;

        let relativeLabel = '';
        if (isToday) relativeLabel = 'Today';
        else if (isTomorrow) relativeLabel = 'Tomorrow';

        let formattedHeader = dateKey;
        try {
          const d = new Date(`${dateKey}T12:00:00.000Z`);
          formattedHeader = d.toLocaleDateString([], {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });
        } catch {
          // ignore
        }

        return (
          <div key={dateKey} className="space-y-3">
            {/* Date Group Header */}
            <div className="flex items-center justify-between pb-1.5 border-b border-ch-border sticky top-0 bg-canvas/95 backdrop-blur z-10 py-1">
              <div className="flex items-center gap-2">
                <Calendar
                  size={14}
                  className={isToday ? 'text-accent' : 'text-ch-text-secondary'}
                />
                <h3
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isToday ? 'text-accent' : 'text-ch-text-primary'
                  }`}
                >
                  {formattedHeader}
                </h3>
                {relativeLabel && (
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-accent/15 text-accent border border-accent/20">
                    {relativeLabel}
                  </span>
                )}
              </div>

              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-surface text-ch-text-secondary border border-ch-border">
                {dayTasks.length} {dayTasks.length === 1 ? 'task' : 'tasks'}
              </span>
            </div>

            {/* Tasks in this Day */}
            <div className="space-y-2.5">
              {dayTasks.map((task) => (
                <TeamTaskCard
                  key={task.id}
                  task={task}
                  variant="full"
                  onClick={() => onSelectTask(task)}
                  onReschedule={(e) => {
                    e.stopPropagation();
                    onRescheduleTask?.(task);
                  }}
                  onToggleComplete={(e) => {
                    e.stopPropagation();
                    onCompleteTask?.(task);
                  }}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

