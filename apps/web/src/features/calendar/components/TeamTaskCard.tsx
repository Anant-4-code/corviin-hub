import React from 'react';
import type { TaskItem } from '@corviin-hub/shared';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityIndicator } from '@/components/ui/PriorityIndicator';
import { Avatar } from '@/components/ui/Avatar';
import {
  formatDateTime,
  formatDate,
  getStatusBadgeType,
  getStatusLabel,
  isTaskOverdue,
} from '@/features/tasks/utils/task-utils';
import {
  Clock,
  AlertTriangle,
  Play,
  CheckCircle2,
  Calendar,
  Layers,
  FolderKanban,
  CheckSquare,
} from 'lucide-react';
import { cn } from '@/lib/cn';

interface TeamTaskCardProps {
  task: TaskItem;
  variant?: 'compact' | 'full';
  onClick?: () => void;
  onReschedule?: (e: React.MouseEvent) => void;
  onToggleComplete?: (e: React.MouseEvent) => void;
}

export function TeamTaskCard({
  task,
  variant = 'compact',
  onClick,
  onReschedule,
  onToggleComplete,
}: TeamTaskCardProps) {
  const isOverdue = isTaskOverdue(task);
  const isBlocked = task.status === 'BLOCKED';
  const isCompleted = task.status === 'COMPLETED';

  // Planned time format
  const hasPlannedStart = Boolean(task.plannedStart);
  let timeLabel = '';
  if (task.deadline) {
    try {
      const d = new Date(task.deadline);
      const hours = d.getHours();
      const minutes = d.getMinutes();
      // If it has non-midnight time
      if (hours !== 0 || minutes !== 0) {
        timeLabel = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    } catch {
      // ignore
    }
  }

  if (variant === 'compact') {
    return (
      <div
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick?.();
          }
        }}
        title={`${task.title} (${task.status}) - ${task.assigneeName || 'Unassigned'}`}
        className={cn(
          'w-full text-left p-1.5 rounded text-xs select-none cursor-pointer border transition-none flex items-center justify-between gap-1.5',
          isOverdue
            ? 'bg-danger/10 border-danger/30 text-danger hover:bg-danger/15'
            : isBlocked
            ? 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'
            : isCompleted
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400 line-through opacity-80'
            : 'bg-surface border-ch-border hover:border-ch-border-strong text-ch-text-primary',
        )}
      >
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <PriorityIndicator priority={task.priority} showLabel={false} className="shrink-0" />
          <span className="truncate font-medium text-[11px] leading-tight">
            {task.title}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {timeLabel && (
            <span className="text-[10px] font-mono text-ch-text-muted hidden sm:inline">
              {timeLabel}
            </span>
          )}
          {task.assigneeName && (
            <span className="text-[10px] text-ch-text-secondary font-medium truncate max-w-[70px]">
              {task.assigneeName}
            </span>
          )}
          <Avatar
            name={task.assigneeName || 'Unassigned'}
            size="xs"
            className="w-4 h-4 text-[9px] shrink-0"
          />
        </div>
      </div>
    );
  }

  // Full Variant for Agenda & Day Views
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={cn(
        'p-3.5 rounded-card border bg-surface transition-none cursor-pointer select-none space-y-2.5',
        isOverdue
          ? 'border-danger/40 bg-danger/5 hover:border-danger'
          : isBlocked
          ? 'border-red-500/40 bg-red-500/5 hover:border-red-500'
          : 'border-ch-border hover:border-ch-border-strong',
      )}
    >
      {/* Top Header: Entity Tag & Badges */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <PriorityIndicator priority={task.priority} />
          <StatusBadge
            type={getStatusBadgeType(task.status)}
            label={getStatusLabel(task.status)}
          />
          {isOverdue && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-danger/20 text-danger border border-danger/30">
              <AlertTriangle size={11} /> Overdue
            </span>
          )}
          {task.linkedRecord && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium bg-surface-muted text-ch-text-secondary border border-ch-border">
              <FolderKanban size={11} className="text-accent" />
              <span className="capitalize">{task.linkedRecord.type}</span>: {task.linkedRecord.title}
            </span>
          )}
        </div>

        {/* Due Date & Times */}
        <div className="flex items-center gap-2 text-xs text-ch-text-secondary font-mono">
          <Clock size={12} className="text-ch-text-muted" />
          <span>{formatDate(task.deadline)}</span>
          {timeLabel && <span className="font-semibold text-ch-text-primary">({timeLabel})</span>}
        </div>
      </div>

      {/* Title & Description */}
      <div>
        <h4 className={cn('text-sm font-bold text-ch-text-primary', isCompleted && 'line-through text-ch-text-muted')}>
          {task.title}
        </h4>
        {task.description && (
          <p className="text-xs text-ch-text-secondary mt-1 line-clamp-2">
            {task.description}
          </p>
        )}
      </div>

      {/* Bottom Metadata: Assignee, Checklist, Work Sessions */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-ch-border text-xs flex-wrap">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Avatar name={task.assigneeName || 'Unassigned'} size="xs" />
            <span className="text-ch-text-secondary font-medium">
              {task.assigneeName || 'Unassigned'}
            </span>
          </div>

          {task.checklist && task.checklist.length > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-ch-text-muted">
              <CheckSquare size={12} />
              <span>
                {task.checklist.filter((c) => c.completed).length}/{task.checklist.length}
              </span>
            </div>
          )}

          {task.workSessions && task.workSessions.length > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-info">
              <Play size={10} className="fill-info" />
              <span>{task.workSessions.length} sessions</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {onReschedule && (
            <button
              type="button"
              onClick={onReschedule}
              className="text-xs font-semibold px-2 py-1 rounded border border-ch-border hover:bg-surface-muted text-ch-text-secondary hover:text-ch-text-primary transition-none"
            >
              Reschedule
            </button>
          )}
          {onToggleComplete && !isCompleted && (
            <button
              type="button"
              onClick={onToggleComplete}
              className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white transition-none flex items-center gap-1"
            >
              <CheckCircle2 size={12} /> Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
