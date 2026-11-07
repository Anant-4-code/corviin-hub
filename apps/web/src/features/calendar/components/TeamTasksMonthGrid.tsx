import React, { useState } from 'react';
import type { TaskItem } from '@corviin-hub/shared';
import { TeamTaskCard } from './TeamTaskCard';
import { isTaskOverdue } from '@/features/tasks/utils/task-utils';
import { Plus, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/cn';

interface TeamTasksMonthGridProps {
  currentDate: Date;
  tasks: TaskItem[];
  onSelectTask: (task: TaskItem) => void;
  onSelectDate: (date: Date) => void;
  onCreateTaskForDate?: (dateStr: string) => void;
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function TeamTasksMonthGrid({
  currentDate,
  tasks,
  onSelectTask,
  onSelectDate,
  onCreateTaskForDate,
}: TeamTasksMonthGridProps) {
  const [expandedDateKey, setExpandedDateKey] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // First day of current month (0: Sun, 1: Mon, ..., 6: Sat)
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Adjust so Monday is 0, Sunday is 6
  let startingDayOfWeek = firstDayOfMonth.getDay() - 1;
  if (startingDayOfWeek === -1) startingDayOfWeek = 6;

  // Previous month padding days
  const prevMonthDays = new Date(year, month, 0).getDate();
  const days: Array<{
    dayNumber: number;
    date: Date;
    dateKey: string;
    isCurrentMonth: boolean;
    isToday: boolean;
  }> = [];

  const today = new Date();
  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const toDateKey = (d: Date) => d.toISOString().slice(0, 10);

  // 1. Fill previous month days
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, prevMonthDays - i);
    days.push({
      dayNumber: prevMonthDays - i,
      date: d,
      dateKey: toDateKey(d),
      isCurrentMonth: false,
      isToday: isSameDay(d, today),
    });
  }

  // 2. Fill current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i);
    days.push({
      dayNumber: i,
      date: d,
      dateKey: toDateKey(d),
      isCurrentMonth: true,
      isToday: isSameDay(d, today),
    });
  }

  // 3. Fill remaining trailing days to complete 6 full weeks (42 cells) or 5 weeks
  const totalCells = days.length > 35 ? 42 : 35;
  const remaining = totalCells - days.length;
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, month + 1, i);
    days.push({
      dayNumber: i,
      date: d,
      dateKey: toDateKey(d),
      isCurrentMonth: false,
      isToday: isSameDay(d, today),
    });
  }

  // Group tasks by date string (YYYY-MM-DD) based on deadline or plannedStart
  const tasksByDate: Record<string, TaskItem[]> = {};
  for (const t of tasks) {
    if (!t.deadline) continue;
    try {
      const key = t.deadline.slice(0, 10);
      if (!tasksByDate[key]) tasksByDate[key] = [];
      tasksByDate[key].push(t);
    } catch {
      // ignore
    }
  }

  return (
    <div className="bg-surface border border-ch-border rounded-card overflow-hidden shadow-sm">
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 border-b border-ch-border bg-surface-muted text-xs font-semibold text-ch-text-secondary">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-2.5 text-center select-none uppercase tracking-wider text-[11px]">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-ch-border">
        {days.map((cell) => {
          const dayTasks = tasksByDate[cell.dateKey] || [];
          const hasOverdue = dayTasks.some(isTaskOverdue);
          const maxVisible = 3;
          const overflowCount = dayTasks.length - maxVisible;
          const isExpanded = expandedDateKey === cell.dateKey;
          const isSelected = isSameDay(cell.date, currentDate);

          return (
            <div
              key={cell.dateKey}
              onClick={() => onSelectDate(cell.date)}
              className={cn(
                'min-h-[105px] sm:min-h-[120px] p-1.5 flex flex-col justify-between transition-none select-none group relative',
                !cell.isCurrentMonth && 'bg-canvas/40 opacity-60',
                cell.isCurrentMonth && 'bg-surface hover:bg-surface-muted/40',
                isSelected && 'ring-2 ring-accent ring-inset',
              )}
            >
              {/* Day Number and Quick Action Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span
                    className={cn(
                      'text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center',
                      cell.isToday
                        ? 'bg-accent text-accent-foreground font-black'
                        : cell.isCurrentMonth
                        ? 'text-ch-text-primary'
                        : 'text-ch-text-muted',
                    )}
                  >
                    {cell.dayNumber}
                  </span>

                  {hasOverdue && (
                    <span title="Contains overdue task(s)">
                      <AlertTriangle size={11} className="text-danger" />
                    </span>
                  )}
                </div>

                {/* Add Task for this Date Hover Button */}
                {onCreateTaskForDate && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCreateTaskForDate(cell.dateKey);
                    }}
                    title={`Add task for ${cell.dateKey}`}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-surface-muted text-ch-text-secondary hover:text-accent transition-none"
                  >
                    <Plus size={12} />
                  </button>
                )}
              </div>

              {/* Tasks List */}
              <div className="mt-1 space-y-1 flex-1 overflow-hidden">
                {(isExpanded ? dayTasks : dayTasks.slice(0, maxVisible)).map((task) => (
                  <div key={task.id} onClick={(e) => e.stopPropagation()}>
                    <TeamTaskCard
                      task={task}
                      variant="compact"
                      onClick={() => onSelectTask(task)}
                    />
                  </div>
                ))}

                {overflowCount > 0 && !isExpanded && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedDateKey(cell.dateKey);
                    }}
                    className="w-full text-left px-1.5 py-0.5 rounded text-[10px] font-semibold text-accent hover:bg-accent/10 transition-none"
                  >
                    +{overflowCount} more
                  </button>
                )}

                {isExpanded && dayTasks.length > maxVisible && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedDateKey(null);
                    }}
                    className="w-full text-left px-1.5 py-0.5 rounded text-[10px] font-semibold text-ch-text-muted hover:text-ch-text-primary transition-none"
                  >
                    Show less
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

