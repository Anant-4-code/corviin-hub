import React from 'react';
import type { TaskItem } from '@corviin-hub/shared';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityIndicator } from '@/components/ui/PriorityIndicator';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import {
  formatDateTime,
  formatDate,
  formatDuration,
  getStatusBadgeType,
  getStatusLabel,
  isTaskOverdue,
} from '../utils/task-utils';
import {
  Calendar,
  Clock,
  ArrowRight,
  Layers,
  AlertTriangle,
  Play,
  Pause,
  CheckCircle2,
} from 'lucide-react';

interface TaskCalendarViewProps {
  tasks: TaskItem[];
  onSelectTask: (task: TaskItem) => void;
  onStart: (id: string, e: React.MouseEvent) => void;
  onPause: (id: string, e: React.MouseEvent) => void;
  onResume: (id: string, e: React.MouseEvent) => void;
  onComplete: (task: TaskItem, e: React.MouseEvent) => void;
}

export function TaskCalendarView({
  tasks,
  onSelectTask,
  onStart,
  onPause,
  onResume,
  onComplete,
}: TaskCalendarViewProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 bg-surface rounded-lg border border-ch-border">
        <p className="text-sm font-medium text-ch-text-secondary">No scheduled tasks match the active filters.</p>
      </div>
    );
  }

  // Sort tasks by deadline
  const sorted = [...tasks].sort((a, b) => a.deadline.localeCompare(b.deadline));

  // Group by date (YYYY-MM-DD)
  const groupedByDate: Record<string, TaskItem[]> = {};
  for (const t of sorted) {
    const dateKey = formatDate(t.deadline);
    if (!groupedByDate[dateKey]) groupedByDate[dateKey] = [];
    groupedByDate[dateKey].push(t);
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedByDate).map(([dateLabel, dayTasks]) => {
        const isToday = formatDate(new Date().toISOString()) === dateLabel;

        return (
          <div key={dateLabel} className="space-y-3">
            {/* Date Group Header */}
            <div className="flex items-center gap-3 pb-1 border-b border-ch-border">
              <div className="flex items-center gap-2">
                <Calendar size={14} className={isToday ? 'text-accent' : 'text-ch-text-secondary'} />
                <h3 className={`text-xs font-bold uppercase tracking-wider ${isToday ? 'text-accent' : 'text-ch-text-primary'}`}>
                  {dateLabel} {isToday && '(Today)'}
                </h3>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.2 rounded-full bg-surface-muted text-ch-text-secondary border border-ch-border">
                {dayTasks.length} {dayTasks.length === 1 ? 'task' : 'tasks'}
              </span>
            </div>

            {/* Day Agenda Items */}
            <div className="space-y-2.5">
              {dayTasks.map((task) => {
                const isOverdue = isTaskOverdue(task);
                const hasTimeSpan = !!task.plannedStart;

                return (
                  <div
                    key={task.id}
                    onClick={() => onSelectTask(task)}
                    className="p-3 bg-surface rounded-lg border border-ch-border hover:border-ch-border-strong cursor-pointer select-none flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-none"
                  >
                    {/* Left: Schedule Span, Title, Badges */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Time span representation */}
                        <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-ch-text-secondary bg-surface-muted px-2 py-0.5 rounded border border-ch-border">
                          <Clock size={12} />
                          {hasTimeSpan ? (
                            <>
                              <span>{new Date(task.plannedStart!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              <ArrowRight size={10} className="text-ch-text-muted" />
                              <span className={isOverdue ? 'text-danger font-bold' : ''}>
                                {new Date(task.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </>
                          ) : (
                            <span className={isOverdue ? 'text-danger font-bold' : ''}>
                              Due {new Date(task.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>

                        <StatusBadge type={getStatusBadgeType(task.status)} label={getStatusLabel(task.status)} />
                        <PriorityIndicator priority={task.priority} />

                        {isOverdue && (
                          <span className="text-[10px] font-bold text-danger bg-danger/10 px-1.5 py-0.2 rounded border border-danger/20 flex items-center gap-1">
                            <AlertTriangle size={11} /> Overdue
                          </span>
                        )}
                      </div>

                      <div className="text-sm font-semibold text-ch-text-primary line-clamp-1">
                        {task.title}
                      </div>

                      {task.linkedRecord && (
                        <div className="flex items-center gap-1 text-[11px] text-ch-text-secondary truncate">
                          <Layers size={11} className="shrink-0" />
                          <span className="truncate">{task.linkedRecord.title}</span>
                        </div>
                      )}
                    </div>

                    {/* Right: Assignee & Quick Actions */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-ch-border" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2 text-xs">
                        <Avatar
                          name={task.assigneeName || 'Unassigned'}
                          size="sm"
                        />
                        <span className="font-medium text-ch-text-primary hidden md:inline">
                          {task.assigneeName || 'Unassigned'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {task.status === 'TODO' && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={(e) => onStart(task.id, e)}
                            className="h-8 px-2.5 text-xs"
                          >
                            <Play size={12} className="mr-1 fill-current" />
                            Start
                          </Button>
                        )}

                        {task.status === 'IN_PROGRESS' && (
                          <>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={(e) => onPause(task.id, e)}
                              className="h-8 px-2 text-xs"
                            >
                              <Pause size={12} className="mr-1" />
                              Pause
                            </Button>
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={(e) => onComplete(task, e)}
                              className="h-8 px-2 text-xs"
                            >
                              <CheckCircle2 size={12} className="mr-1" />
                              Done
                            </Button>
                          </>
                        )}

                        {task.status === 'ON_HOLD' && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={(e) => onResume(task.id, e)}
                            className="h-8 px-2.5 text-xs"
                          >
                            <Play size={12} className="mr-1 fill-current" />
                            Resume
                          </Button>
                        )}

                        {task.status === 'COMPLETED' && (
                          <span className="text-xs text-success font-medium flex items-center gap-1 pr-1">
                            <CheckCircle2 size={13} /> Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
