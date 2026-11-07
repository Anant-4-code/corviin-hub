import React from 'react';
import type { TaskItem } from '@corviin-hub/shared';
import { TeamTaskCard } from './TeamTaskCard';
import { Calendar, Clock, Plus, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface TeamTasksDayGridProps {
  currentDate: Date;
  tasks: TaskItem[];
  onSelectTask: (task: TaskItem) => void;
  onCreateTaskForDate?: (dateStr: string) => void;
  onRescheduleTask?: (task: TaskItem) => void;
  onCompleteTask?: (task: TaskItem) => void;
}

export function TeamTasksDayGrid({
  currentDate,
  tasks,
  onSelectTask,
  onCreateTaskForDate,
  onRescheduleTask,
  onCompleteTask,
}: TeamTasksDayGridProps) {
  const dateKey = currentDate.toISOString().slice(0, 10);
  const formattedDay = currentDate.toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Filter tasks due or planned for this date
  const dayTasks = tasks.filter((t) => {
    if (!t.deadline) return false;
    return t.deadline.slice(0, 10) === dateKey;
  });

  // Split into All-Day and Timed
  const allDayTasks: TaskItem[] = [];
  const timedTasks: TaskItem[] = [];

  for (const t of dayTasks) {
    try {
      const d = new Date(t.deadline);
      if (d.getHours() !== 0 || d.getMinutes() !== 0 || t.plannedStart) {
        timedTasks.push(t);
      } else {
        allDayTasks.push(t);
      }
    } catch {
      allDayTasks.push(t);
    }
  }

  // Sort timed tasks chronologically
  timedTasks.sort((a, b) => {
    const timeA = new Date(a.plannedStart || a.deadline).getTime();
    const timeB = new Date(b.plannedStart || b.deadline).getTime();
    return timeA - timeB;
  });

  return (
    <div className="bg-surface border border-ch-border rounded-card p-4 sm:p-6 space-y-6 shadow-sm">
      {/* Day Title and Action Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-ch-border">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-accent">
            Daily Task Schedule
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-ch-text-primary">
            {formattedDay}
          </h2>
          <p className="text-xs text-ch-text-secondary mt-0.5">
            {dayTasks.length} {dayTasks.length === 1 ? 'task scheduled' : 'tasks scheduled'} for this day
          </p>
        </div>

        {onCreateTaskForDate && (
          <Button
            size="sm"
            onClick={() => onCreateTaskForDate(dateKey)}
            className="text-xs h-8 px-3 font-semibold bg-accent text-accent-foreground flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus size={14} /> Add Task for Today
          </Button>
        )}
      </div>

      {dayTasks.length === 0 ? (
        <div className="text-center py-12 bg-canvas rounded-card border border-dashed border-ch-border">
          <Calendar size={28} className="mx-auto text-ch-text-muted mb-2" />
          <h4 className="text-sm font-semibold text-ch-text-primary">No tasks scheduled for this date</h4>
          <p className="text-xs text-ch-text-secondary mt-1 max-w-sm mx-auto">
            You can create a task due on this date or pick another date from the calendar toolbar.
          </p>
          {onCreateTaskForDate && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCreateTaskForDate(dateKey)}
              className="mt-4 text-xs h-8 font-semibold"
            >
              <Plus size={13} className="mr-1" /> Create Task
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* 1. All-Day / Date-Only Tasks */}
          {allDayTasks.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ch-text-secondary">
                <Calendar size={13} className="text-accent" />
                <span>All-Day / Date-Based Tasks ({allDayTasks.length})</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {allDayTasks.map((task) => (
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
          )}

          {/* 2. Timed / Scheduled Tasks */}
          {timedTasks.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ch-text-secondary">
                <Clock size={13} className="text-accent" />
                <span>Timed Work & Deadlines ({timedTasks.length})</span>
              </div>
              <div className="space-y-3">
                {timedTasks.map((task) => (
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
          )}
        </div>
      )}
    </div>
  );
}

