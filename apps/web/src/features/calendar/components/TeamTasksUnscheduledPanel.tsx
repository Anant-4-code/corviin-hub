import React from 'react';
import type { TaskItem } from '@corviin-hub/shared';
import { Avatar } from '@/components/ui/Avatar';
import { PriorityIndicator } from '@/components/ui/PriorityIndicator';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  getStatusBadgeType,
  getStatusLabel,
  formatDate,
} from '@/features/tasks/utils/task-utils';
import { Inbox, Calendar, X, Plus } from 'lucide-react';

interface TeamTasksUnscheduledPanelProps {
  tasks: TaskItem[];
  onSelectTask: (task: TaskItem) => void;
  onScheduleTask: (task: TaskItem) => void;
  onClose?: () => void;
}

export function TeamTasksUnscheduledPanel({
  tasks,
  onSelectTask,
  onScheduleTask,
  onClose,
}: TeamTasksUnscheduledPanelProps) {
  // Tasks with no deadline
  const unscheduled = tasks.filter((t) => !t.deadline);

  return (
    <div className="bg-surface border border-ch-border rounded-card p-4 space-y-4 shadow-sm">
      <div className="flex items-center justify-between pb-2 border-b border-ch-border">
        <div className="flex items-center gap-2">
          <Inbox size={16} className="text-accent" />
          <h3 className="text-sm font-bold text-ch-text-primary">
            Unscheduled Tasks ({unscheduled.length})
          </h3>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-ch-text-muted hover:text-ch-text-primary transition-none"
            aria-label="Close unscheduled tasks panel"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <p className="text-xs text-ch-text-secondary">
        Tasks with no planned due date. Click &quot;Schedule&quot; to assign a deadline and place on the calendar.
      </p>

      {unscheduled.length === 0 ? (
        <div className="text-center py-6 text-xs text-ch-text-muted italic bg-canvas rounded border border-ch-border">
          All workspace tasks currently have a planned due date.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {unscheduled.map((task) => (
            <div
              key={task.id}
              onClick={() => onSelectTask(task)}
              className="p-3 rounded border border-ch-border bg-canvas hover:border-ch-border-strong transition-none cursor-pointer flex flex-col justify-between gap-2"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-1">
                  <PriorityIndicator priority={task.priority} />
                  <StatusBadge
                    type={getStatusBadgeType(task.status)}
                    label={getStatusLabel(task.status)}
                  />
                </div>
                <h4 className="text-xs font-bold text-ch-text-primary truncate">
                  {task.title}
                </h4>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-ch-border text-xs">
                <div className="flex items-center gap-1.5">
                  <Avatar name={task.assigneeName || 'Unassigned'} size="xs" />
                  <span className="text-[11px] text-ch-text-secondary truncate max-w-[100px]">
                    {task.assigneeName || 'Unassigned'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onScheduleTask(task);
                  }}
                  className="px-2 py-1 rounded bg-accent text-accent-foreground text-[11px] font-semibold hover:opacity-90 transition-none flex items-center gap-1"
                >
                  <Calendar size={11} />
                  <span>Schedule</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

