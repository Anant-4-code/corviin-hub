import React from 'react';
import type { TaskItem } from '@corviin-hub/shared';
import { TeamTaskCard } from './TeamTaskCard';
import { isTaskOverdue, formatDate } from '@/features/tasks/utils/task-utils';
import { Plus, Clock, Calendar } from 'lucide-react';
import { cn } from '@/lib/cn';

interface TeamTasksWeekGridProps {
  currentDate: Date;
  tasks: TaskItem[];
  onSelectTask: (task: TaskItem) => void;
  onSelectDate: (date: Date) => void;
  onCreateTaskForDate?: (dateStr: string) => void;
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function TeamTasksWeekGrid({
  currentDate,
  tasks,
  onSelectTask,
  onSelectDate,
  onCreateTaskForDate,
}: TeamTasksWeekGridProps) {
  // Calculate Monday of the current week
  const day = currentDate.getDay();
  const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(currentDate);
  monday.setDate(diff);

  const days: Array<{
    date: Date;
    dateKey: string;
    dayName: string;
    dayNumber: number;
    isToday: boolean;
  }> = [];

  const today = new Date();
  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push({
      date: d,
      dateKey: d.toISOString().slice(0, 10),
      dayName: WEEKDAYS[i],
      dayNumber: d.getDate(),
      isToday: isSameDay(d, today),
    });
  }

  // Filter tasks for this week
  const tasksByDate: Record<string, { allDay: TaskItem[]; timed: TaskItem[] }> = {};
  for (const dayObj of days) {
    tasksByDate[dayObj.dateKey] = { allDay: [], timed: [] };
  }

  for (const t of tasks) {
    if (!t.deadline) continue;
    try {
      const key = t.deadline.slice(0, 10);
      if (tasksByDate[key]) {
        const d = new Date(t.deadline);
        // If hour & minute are not 0:00 or if plannedStart exists with time
        if (d.getHours() !== 0 || d.getMinutes() !== 0 || t.plannedStart) {
          tasksByDate[key].timed.push(t);
        } else {
          tasksByDate[key].allDay.push(t);
        }
      }
    } catch {
      // ignore
    }
  }

  return (
    <div className="bg-surface border border-ch-border rounded-card overflow-hidden shadow-sm">
      {/* 7 Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 divide-y md:divide-y-0 md:divide-x divide-ch-border">
        {days.map((dayObj) => {
          const dayData = tasksByDate[dayObj.dateKey] || { allDay: [], timed: [] };
          const totalDayTasks = dayData.allDay.length + dayData.timed.length;

          return (
            <div
              key={dayObj.dateKey}
              onClick={() => onSelectDate(dayObj.date)}
              className={cn(
                'min-h-[380px] p-2 flex flex-col transition-none',
                dayObj.isToday ? 'bg-accent/5' : 'bg-surface hover:bg-surface-muted/20',
              )}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between pb-2 border-b border-ch-border">
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      'text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center',
                      dayObj.isToday
                        ? 'bg-accent text-accent-foreground font-black'
                        : 'text-ch-text-primary bg-surface-muted',
                    )}
                  >
                    {dayObj.dayNumber}
                  </span>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-ch-text-secondary">
                      {dayObj.dayName}
                    </span>
                    {totalDayTasks > 0 && (
                      <span className="ml-1 text-[10px] text-ch-text-muted">
                        ({totalDayTasks})
                      </span>
                    )}
                  </div>
                </div>

                {onCreateTaskForDate && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCreateTaskForDate(dayObj.dateKey);
                    }}
                    title={`Create task on ${dayObj.dateKey}`}
                    className="p-1 rounded hover:bg-surface-muted text-ch-text-secondary hover:text-accent transition-none"
                  >
                    <Plus size={13} />
                  </button>
                )}
              </div>

              {/* Day Tasks Container */}
              <div className="mt-2 space-y-2 flex-1">
                {/* All-Day / Date-Only Tasks */}
                {dayData.allDay.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-ch-text-muted flex items-center gap-1">
                      <Calendar size={10} /> Date-Only
                    </div>
                    {dayData.allDay.map((task) => (
                      <div key={task.id} onClick={(e) => e.stopPropagation()}>
                        <TeamTaskCard
                          task={task}
                          variant="compact"
                          onClick={() => onSelectTask(task)}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Timed Tasks */}
                {dayData.timed.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-ch-text-muted flex items-center gap-1">
                      <Clock size={10} /> Scheduled
                    </div>
                    {dayData.timed.map((task) => (
                      <div key={task.id} onClick={(e) => e.stopPropagation()}>
                        <TeamTaskCard
                          task={task}
                          variant="compact"
                          onClick={() => onSelectTask(task)}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {totalDayTasks === 0 && (
                  <div className="h-full flex items-center justify-center text-center py-8">
                    <span className="text-[11px] text-ch-text-muted italic">
                      No tasks
                    </span>
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

