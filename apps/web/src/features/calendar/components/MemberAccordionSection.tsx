import React from 'react';
import {
  TeamMemberCalendarGroup,
  TaskItem,
  TaskStatus,
  TaskPriority,
} from '@corviin-hub/shared';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import {
  ChevronDown,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Layers,
  ShieldAlert,
} from 'lucide-react';

interface MemberAccordionSectionProps {
  group: TeamMemberCalendarGroup;
  expanded: boolean;
  onToggle: () => void;
  onSelectTask: (task: TaskItem) => void;
  onStartSession: (task: TaskItem) => void;
  onPauseSession: (task: TaskItem) => void;
  onCompleteTask: (task: TaskItem) => void;
  onRescheduleTask: (task: TaskItem) => void;
  onAddTaskForMember: (memberId: string) => void;
}

export function MemberAccordionSection({
  group,
  expanded,
  onToggle,
  onSelectTask,
  onStartSession,
  onPauseSession,
  onCompleteTask,
  onRescheduleTask,
  onAddTaskForMember,
}: MemberAccordionSectionProps) {
  const now = new Date();

  return (
    <div className="border border-ch-border rounded-card bg-surface overflow-hidden">
      {/* Collapsed Header */}
      <div
        onClick={onToggle}
        className="p-3.5 flex items-center justify-between gap-3 cursor-pointer select-none bg-surface hover:bg-surface-muted/50 transition-none"
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="p-1 rounded text-ch-text-secondary hover:text-ch-text-primary transition-none"
            aria-label={expanded ? `Collapse ${group.profileName}` : `Expand ${group.profileName}`}
          >
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>

          <Avatar name={group.profileName} size="sm" />

          <div>
            <div className="text-sm font-bold text-ch-text-primary leading-tight">
              {group.profileName}
            </div>
            <div className="text-xs text-ch-text-secondary mt-0.5">
              {group.taskCount} {group.taskCount === 1 ? 'task' : 'tasks'} scheduled
            </div>
          </div>
        </div>

        {/* Badges on right side */}
        <div className="flex items-center gap-2">
          {group.inProgressCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border border-info/30 bg-info/10 text-info">
              <Play size={10} className="fill-current" />
              <span>{group.inProgressCount} active</span>
            </span>
          )}

          {group.overdueCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border border-danger/40 bg-danger/10 text-danger">
              <AlertTriangle size={11} />
              <span>{group.overdueCount} overdue</span>
            </span>
          )}

          {group.urgentCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border border-danger/30 bg-danger/5 text-danger">
              <span>{group.urgentCount} urgent</span>
            </span>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onAddTaskForMember(group.profileId);
            }}
            className="text-xs h-7 px-2 gap-1 ml-1"
          >
            <Plus size={12} />
            <span>Add</span>
          </Button>
        </div>
      </div>

      {/* Expanded Task Cards */}
      {expanded && (
        <div className="border-t border-ch-border p-3 space-y-2.5 bg-canvas/60">
          {group.tasks.length === 0 ? (
            <div className="text-center py-6 text-xs text-ch-text-muted bg-surface rounded border border-ch-border">
              No tasks scheduled for {group.profileName} on this date.
            </div>
          ) : (
            group.tasks.map((task) => {
              const isOverdue =
                Boolean(task.deadline && new Date(task.deadline) < now) &&
                task.status !== TaskStatus.COMPLETED &&
                task.status !== TaskStatus.CANCELLED;
              const isBlocked = task.status === TaskStatus.BLOCKED;
              const isInProgress = task.status === TaskStatus.IN_PROGRESS;
              const isCompleted = task.status === TaskStatus.COMPLETED;

              return (
                <div
                  key={task.id}
                  className={`p-3 rounded-card border bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-ch-border-strong transition-none select-none ${
                    isOverdue
                      ? 'border-danger/40 bg-danger/5'
                      : isBlocked
                      ? 'border-danger/30 bg-danger/5'
                      : 'border-ch-border'
                  }`}
                >
                  {/* Task Metadata & Timestamps */}
                  <div
                    onClick={() => onSelectTask(task)}
                    className="flex-1 cursor-pointer space-y-1.5"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Status */}
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                          isCompleted
                            ? 'border-success/30 bg-success/10 text-success'
                            : isInProgress
                            ? 'border-info/30 bg-info/10 text-info'
                            : isBlocked
                            ? 'border-danger/40 bg-danger/10 text-danger'
                            : 'border-ch-border bg-surface-muted text-ch-text-secondary'
                        }`}
                      >
                        {task.status.replace(/_/g, ' ')}
                      </span>

                      {/* Priority */}
                      <span
                        className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                          task.priority === TaskPriority.URGENT
                            ? 'border-danger/30 bg-danger/10 text-danger'
                            : task.priority === TaskPriority.HIGH
                            ? 'border-warning/30 bg-warning/10 text-warning'
                            : 'border-ch-border text-ch-text-muted'
                        }`}
                      >
                        {task.priority}
                      </span>

                      {/* Linked Record Badge */}
                      {task.linkedRecord && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-accent font-medium truncate max-w-[220px]">
                          <Layers size={11} className="shrink-0" />
                          <span className="truncate">{task.linkedRecord.title}</span>
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-ch-text-primary leading-snug">
                      {task.title}
                    </h4>

                    {/* Schedule vs Actual execution timestamps */}
                    <div className="flex items-center gap-4 flex-wrap text-xs text-ch-text-muted pt-0.5">
                      {task.plannedStart && (
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          <span>
                            Start: {new Date(task.plannedStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </span>
                      )}

                      {task.deadline && (
                        <span
                          className={`flex items-center gap-1 ${
                            isOverdue ? 'text-danger font-semibold' : ''
                          }`}
                        >
                          <Clock size={11} />
                          <span>
                            Due: {new Date(task.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </span>
                      )}

                      {task.actualStart && (
                        <span className="flex items-center gap-1 text-info font-medium">
                          <span>Actual Start: {new Date(task.actualStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </span>
                      )}

                      {task.completedAt && (
                        <span className="flex items-center gap-1 text-success font-medium">
                          <CheckCircle2 size={11} />
                          <span>Completed: {new Date(task.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </span>
                      )}

                      {task.rescheduleHistory.length > 0 && (
                        <span className="text-[11px] text-warning flex items-center gap-1">
                          <RotateCcw size={10} />
                          <span>Rescheduled ({task.rescheduleHistory.length}x)</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Contextual Action Buttons */}
                  <div className="flex items-center gap-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-ch-border shrink-0">
                    {/* Session Toggle */}
                    {isInProgress ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPauseSession(task)}
                        className="text-xs h-7 px-2 font-medium"
                      >
                        <Pause size={11} className="mr-1" />
                        <span>Pause</span>
                      </Button>
                    ) : (
                      !isCompleted && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onStartSession(task)}
                          className="text-xs h-7 px-2 font-medium text-info border-info/30 hover:bg-info/10"
                        >
                          <Play size={11} className="mr-1 fill-current" />
                          <span>Start</span>
                        </Button>
                      )
                    )}

                    {/* Complete */}
                    {!isCompleted && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onCompleteTask(task)}
                        className="text-xs h-7 px-2 font-medium text-success border-success/30 hover:bg-success/10"
                      >
                        <CheckCircle2 size={11} className="mr-1" />
                        <span>Complete</span>
                      </Button>
                    )}

                    {/* Reschedule */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRescheduleTask(task)}
                      className="text-xs h-7 px-2 text-ch-text-secondary"
                    >
                      <RotateCcw size={11} className="mr-1" />
                      <span>Reschedule</span>
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

