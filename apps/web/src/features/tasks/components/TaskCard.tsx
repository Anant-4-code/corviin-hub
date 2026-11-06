import React from 'react';
import type { TaskItem } from '@corviin-hub/shared';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityIndicator } from '@/components/ui/PriorityIndicator';
import { Button } from '@/components/ui/Button';
import {
  formatDateTime,
  formatDuration,
  getStatusBadgeType,
  getStatusLabel,
  isTaskOverdue,
} from '../utils/task-utils';
import {
  Play,
  Pause,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Clock,
  Layers,
  CalendarClock,
  CheckSquare,
} from 'lucide-react';

interface TaskCardProps {
  task: TaskItem;
  onClick: (task: TaskItem) => void;
  onStart: (id: string, e: React.MouseEvent) => void;
  onPause: (id: string, e: React.MouseEvent) => void;
  onResume: (id: string, e: React.MouseEvent) => void;
  onComplete: (task: TaskItem, e: React.MouseEvent) => void;
  onReschedule: (task: TaskItem, e: React.MouseEvent) => void;
  onBlock: (task: TaskItem, e: React.MouseEvent) => void;
}

export function TaskCard({
  task,
  onClick,
  onStart,
  onPause,
  onResume,
  onComplete,
  onReschedule,
  onBlock,
}: TaskCardProps) {
  const isOverdue = isTaskOverdue(task);
  const totalSubtasks = (task.checklist || []).length;
  const completedSubtasks = (task.checklist || []).filter((i) => i.completed).length;
  const totalDuration = (task.workSessions || []).reduce((acc, s) => acc + (s.durationSeconds || 0), 0);

  return (
    <Card
      onClick={() => onClick(task)}
      className="p-4 cursor-pointer hover:border-ch-border-strong border-ch-border transition-none select-none relative group"
    >
      {/* Top row: Status, Priority, Overdue flag */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge type={getStatusBadgeType(task.status)} label={getStatusLabel(task.status)} />
          <PriorityIndicator priority={task.priority} />
          {isOverdue && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-danger bg-danger/10 px-2 py-0.5 rounded border border-danger/20">
              <AlertTriangle size={12} /> Overdue
            </span>
          )}
        </div>

        {totalDuration > 0 && (
          <span className="text-[11px] text-ch-text-secondary flex items-center gap-1 font-mono">
            <Clock size={12} /> {formatDuration(totalDuration)}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-ch-text-primary line-clamp-2 mb-1.5 leading-snug">
        {task.title}
      </h3>

      {/* Description preview if present */}
      {task.description && (
        <p className="text-xs text-ch-text-secondary line-clamp-1 mb-2.5">
          {task.description}
        </p>
      )}

      {/* Blocker alert if blocked */}
      {task.status === 'BLOCKED' && task.blockerReason && (
        <div className="mb-2.5 text-xs text-danger bg-danger/10 p-2 rounded border border-danger/20">
          <span className="font-semibold">Blocker: </span>
          {task.blockerReason}
        </div>
      )}

      {/* Metadata tags: Deadline, Subtask progress, Linked record */}
      <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3 text-xs text-ch-text-secondary pt-1 border-t border-ch-border/60 mb-3">
        <div className={`flex items-center gap-1 ${isOverdue ? 'text-danger font-medium' : ''}`}>
          <Calendar size={12} className="shrink-0" />
          <span>Due {formatDateTime(task.deadline)}</span>
        </div>

        {totalSubtasks > 0 && (
          <div className="flex items-center gap-1">
            <CheckSquare size={12} className="shrink-0" />
            <span>{completedSubtasks}/{totalSubtasks} subtasks</span>
          </div>
        )}

        {task.linkedRecord && (
          <div className="flex items-center gap-1 truncate max-w-[200px]" title={task.linkedRecord.title}>
            <Layers size={12} className="shrink-0" />
            <span className="truncate">{task.linkedRecord.title}</span>
          </div>
        )}
      </div>

      {/* Context-Sensitive Actions Footer */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-ch-border" onClick={(e) => e.stopPropagation()}>
        <div className="text-xs text-ch-text-secondary truncate">
          {task.assigneeName ? (
            <span>For <strong className="text-ch-text-primary font-medium">{task.assigneeName}</strong></span>
          ) : (
            <span>Unassigned</span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Primary Action Button */}
          {task.status === 'TODO' && (
            <Button
              size="sm"
              variant="primary"
              onClick={(e) => onStart(task.id, e)}
              className="min-h-[36px] px-3 text-xs"
            >
              <Play size={13} className="mr-1 fill-current" />
              Start
            </Button>
          )}

          {task.status === 'IN_PROGRESS' && (
            <>
              <Button
                size="sm"
                variant="secondary"
                onClick={(e) => onPause(task.id, e)}
                className="min-h-[36px] px-2.5 text-xs"
              >
                <Pause size={13} className="mr-1" />
                Pause
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={(e) => onComplete(task, e)}
                className="min-h-[36px] px-2.5 text-xs"
              >
                <CheckCircle2 size={13} className="mr-1" />
                Complete
              </Button>
            </>
          )}

          {task.status === 'ON_HOLD' && (
            <Button
              size="sm"
              variant="primary"
              onClick={(e) => onResume(task.id, e)}
              className="min-h-[36px] px-3 text-xs"
            >
              <Play size={13} className="mr-1 fill-current" />
              Resume
            </Button>
          )}

          {task.status === 'BLOCKED' && (
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => onResume(task.id, e)}
              className="min-h-[36px] px-3 text-xs"
            >
              <Play size={13} className="mr-1 fill-current" />
              Unblock
            </Button>
          )}

          {task.status === 'COMPLETED' && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onClick(task)}
              className="min-h-[36px] px-3 text-xs text-success"
            >
              <CheckCircle2 size={14} className="mr-1" />
              Completed
            </Button>
          )}

          {/* Additional quick actions */}
          {task.status !== 'COMPLETED' && task.status !== 'CANCELLED' && (
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => onReschedule(task, e)}
              className="min-h-[36px] px-2 text-ch-text-muted hover:text-ch-text-primary"
              title="Reschedule deadline"
              aria-label="Reschedule task"
            >
              <CalendarClock size={15} />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
