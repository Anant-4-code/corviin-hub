import React from 'react';
import type { TaskItem } from '@corviin-hub/shared';
import { PriorityIndicator } from '@/components/ui/PriorityIndicator';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  formatDateTime,
  formatDuration,
  isTaskOverdue,
  getStatusBadgeType,
  getStatusLabel,
} from '../utils/task-utils';
import {
  Clock,
  Calendar,
  Layers,
  Play,
  Pause,
  CheckCircle2,
  CalendarClock,
  MoreVertical,
  AlertTriangle,
} from 'lucide-react';

interface TaskMobileCardProps {
  task: TaskItem;
  onSelect: (task: TaskItem) => void;
  onStartSession?: (id: string, e?: React.MouseEvent) => void;
  onPauseSession?: (id: string, e?: React.MouseEvent) => void;
  onResumeSession?: (id: string, e?: React.MouseEvent) => void;
  onOpenComplete?: (task: TaskItem, e?: React.MouseEvent) => void;
  onOpenReschedule?: (task: TaskItem, e?: React.MouseEvent) => void;
  showAssignee?: boolean;
}

export function TaskMobileCard({
  task,
  onSelect,
  onStartSession,
  onPauseSession,
  onResumeSession,
  onOpenComplete,
  onOpenReschedule,
  showAssignee = false,
}: TaskMobileCardProps) {
  const isOverdue = isTaskOverdue(task);
  const activeSession = (task.workSessions || []).find((s) => !s.endedAt);
  const totalDuration = (task.workSessions || []).reduce(
    (acc, s) => acc + (s.durationSeconds || 0),
    0,
  );

  return (
    <div
      onClick={() => onSelect(task)}
      className="bg-surface border border-ch-border rounded-lg p-3.5 space-y-2.5 shadow-sm active:bg-surface-muted transition-none cursor-pointer"
    >
      {/* Top Header: Title and Priority */}
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-ch-text-primary leading-snug line-clamp-2">
          {task.title}
        </h4>
        <div className="shrink-0 pt-0.5">
          <PriorityIndicator priority={task.priority} />
        </div>
      </div>

      {/* Middle Context: Project / Campaign & Description */}
      {(task.linkedRecordTitle || task.description) && (
        <div className="space-y-1">
          {task.linkedRecordTitle && (
            <div className="flex items-center gap-1.5 text-xs text-ch-text-secondary truncate">
              <Layers size={12} className="text-blue-500 shrink-0" />
              <span className="font-medium truncate">{task.linkedRecordTitle}</span>
            </div>
          )}
          {task.description && (
            <p className="text-xs text-ch-text-muted line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}
        </div>
      )}

      {/* Blocker Reason if Blocked */}
      {task.status === 'BLOCKED' && task.blockerReason && (
        <div className="p-2 rounded bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-700 dark:text-red-300 flex items-start gap-1.5">
          <AlertTriangle size={13} className="shrink-0 mt-0.5" />
          <span className="line-clamp-2">Blocker: {task.blockerReason}</span>
        </div>
      )}

      {/* Bottom Metadata & Status */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-ch-border/60 text-xs">
        <div className="flex items-center gap-2">
          <StatusBadge
            type={getStatusBadgeType(task.status)}
            label={getStatusLabel(task.status)}
          />

          {showAssignee && (
            <span className="text-[11px] font-medium text-ch-text-secondary truncate max-w-[100px]">
              {task.assigneeName || 'Unassigned'}
            </span>
          )}
        </div>

        {/* Due Date Indicator */}
        <div className="flex items-center gap-1">
          <Calendar
            size={12}
            className={isOverdue ? 'text-red-600 dark:text-red-400' : 'text-ch-text-muted'}
          />
          <span
            className={`text-xs ${
              isOverdue
                ? 'font-bold text-red-600 dark:text-red-400'
                : 'text-ch-text-secondary'
            }`}
          >
            {formatDateTime(task.deadline)}
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-ch-border/40">
        <div className="flex items-center gap-1 text-[11px] text-ch-text-muted">
          {totalDuration > 0 && (
            <span className="flex items-center gap-1 font-mono">
              <Clock size={11} />
              {formatDuration(totalDuration)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {onOpenReschedule && (
            <button
              type="button"
              onClick={(e) => onOpenReschedule(task, e)}
              title="Reschedule"
              className="p-1.5 rounded text-ch-text-secondary hover:text-ch-text-primary hover:bg-surface-muted"
            >
              <CalendarClock size={14} />
            </button>
          )}

          {activeSession ? (
            <button
              type="button"
              onClick={(e) => onPauseSession?.(task.id, e)}
              className="px-2 py-1 rounded bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 text-xs font-semibold flex items-center gap-1"
            >
              <Pause size={12} />
              Pause
            </button>
          ) : task.status !== 'COMPLETED' && task.status !== 'CANCELLED' ? (
            <button
              type="button"
              onClick={(e) => onStartSession?.(task.id, e)}
              className="px-2 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 text-xs font-semibold flex items-center gap-1"
            >
              <Play size={12} />
              Start
            </button>
          ) : null}

          {task.status !== 'COMPLETED' && onOpenComplete && (
            <button
              type="button"
              onClick={(e) => onOpenComplete(task, e)}
              className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1"
            >
              <CheckCircle2 size={12} />
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
