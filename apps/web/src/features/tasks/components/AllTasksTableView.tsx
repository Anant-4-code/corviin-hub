import React from 'react';
import type { TaskItem } from '@corviin-hub/shared';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityIndicator } from '@/components/ui/PriorityIndicator';
import { Avatar } from '@/components/ui/Avatar';
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
  CalendarClock,
  Layers,
  Clock,
  CheckSquare,
} from 'lucide-react';

interface AllTasksTableViewProps {
  tasks: TaskItem[];
  selectedTaskIds: string[];
  onToggleSelectTask: (id: string, e: React.MouseEvent) => void;
  onToggleSelectAll: () => void;
  onSelectTask: (task: TaskItem) => void;
  onStart: (id: string, e: React.MouseEvent) => void;
  onPause: (id: string, e: React.MouseEvent) => void;
  onResume: (id: string, e: React.MouseEvent) => void;
  onComplete: (task: TaskItem, e: React.MouseEvent) => void;
  onReschedule: (task: TaskItem, e: React.MouseEvent) => void;
  onBlock: (task: TaskItem, e: React.MouseEvent) => void;
}

export function AllTasksTableView({
  tasks,
  selectedTaskIds,
  onToggleSelectTask,
  onToggleSelectAll,
  onSelectTask,
  onStart,
  onPause,
  onResume,
  onComplete,
  onReschedule,
  onBlock,
}: AllTasksTableViewProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 bg-surface rounded-lg border border-ch-border">
        <p className="text-sm font-medium text-ch-text-secondary">No tasks match the active filters.</p>
      </div>
    );
  }

  const allSelected = tasks.length > 0 && selectedTaskIds.length === tasks.length;
  const someSelected = selectedTaskIds.length > 0 && selectedTaskIds.length < tasks.length;

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-ch-border bg-surface">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-ch-border bg-surface-muted/60 text-ch-text-secondary font-semibold uppercase tracking-wider">
            <th className="py-3 px-3 w-10 text-center">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(input) => {
                  if (input) input.indeterminate = someSelected;
                }}
                onChange={onToggleSelectAll}
                className="rounded border-ch-border text-accent focus:ring-accent cursor-pointer"
                aria-label="Select all tasks"
              />
            </th>
            <th className="py-3 px-3">Task Details</th>
            <th className="py-3 px-3">Assignee</th>
            <th className="py-3 px-3">Status</th>
            <th className="py-3 px-3">Priority</th>
            <th className="py-3 px-3">Deadline</th>
            <th className="py-3 px-3">Linked Record</th>
            <th className="py-3 px-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ch-border">
          {tasks.map((task) => {
            const isSelected = selectedTaskIds.includes(task.id);
            const isOverdue = isTaskOverdue(task);
            const totalSubtasks = (task.checklist || []).length;
            const completedSubtasks = (task.checklist || []).filter((i) => i.completed).length;
            const totalDuration = (task.workSessions || []).reduce((acc, s) => acc + (s.durationSeconds || 0), 0);

            return (
              <tr
                key={task.id}
                onClick={() => onSelectTask(task)}
                className={`hover:bg-surface-muted/40 cursor-pointer select-none transition-none ${isSelected ? 'bg-accent/5' : ''
                  }`}
              >
                {/* Checkbox */}
                <td className="py-3 px-3 text-center" onClick={(e) => onToggleSelectTask(task.id, e)}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => { }}
                    className="rounded border-ch-border text-accent focus:ring-accent cursor-pointer"
                    aria-label={`Select task ${task.title}`}
                  />
                </td>

                {/* Title & Subtasks */}
                <td className="py-3 px-3 max-w-xs sm:max-w-md">
                  <div className="font-semibold text-sm text-ch-text-primary line-clamp-1">
                    {task.title}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-ch-text-secondary mt-0.5">
                    {totalSubtasks > 0 && (
                      <span className="flex items-center gap-1">
                        <CheckSquare size={11} /> {completedSubtasks}/{totalSubtasks} subtasks
                      </span>
                    )}
                    {totalDuration > 0 && (
                      <span className="flex items-center gap-1 font-mono">
                        <Clock size={11} /> {formatDuration(totalDuration)}
                      </span>
                    )}
                  </div>
                  {task.status === 'BLOCKED' && task.blockerReason && (
                    <div className="text-[11px] text-danger mt-1 font-medium truncate">
                      Blocker: {task.blockerReason}
                    </div>
                  )}
                </td>

                {/* Assignee */}
                <td className="py-3 px-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Avatar
                      name={task.assigneeName || 'Unassigned'}
                      size="sm"
                    />
                    <span className="font-medium text-ch-text-primary">
                      {task.assigneeName || 'Unassigned'}
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td className="py-3 px-3 whitespace-nowrap">
                  <StatusBadge type={getStatusBadgeType(task.status)} label={getStatusLabel(task.status)} />
                </td>

                {/* Priority */}
                <td className="py-3 px-3 whitespace-nowrap">
                  <PriorityIndicator priority={task.priority} />
                </td>

                {/* Deadline */}
                <td className="py-3 px-3 whitespace-nowrap">
                  <div className={isOverdue ? 'text-danger font-semibold' : 'text-ch-text-secondary'}>
                    {formatDateTime(task.deadline)}
                  </div>
                  {isOverdue && (
                    <span className="text-[10px] text-danger uppercase font-bold tracking-wider">
                      Overdue
                    </span>
                  )}
                </td>

                {/* Linked Record */}
                <td className="py-3 px-3 whitespace-nowrap max-w-[160px] truncate">
                  {task.linkedRecord ? (
                    <div className="flex items-center gap-1 text-ch-text-secondary truncate" title={task.linkedRecord.title}>
                      <Layers size={12} className="shrink-0" />
                      <span className="truncate">{task.linkedRecord.title}</span>
                    </div>
                  ) : (
                    <span className="text-ch-text-muted">—</span>
                  )}
                </td>

                {/* Actions */}
                <td className="py-3 px-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1.5">
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

                    {task.status === 'BLOCKED' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => onResume(task.id, e)}
                        className="h-8 px-2.5 text-xs"
                      >
                        <Play size={12} className="mr-1 fill-current" />
                        Unblock
                      </Button>
                    )}

                    {task.status === 'COMPLETED' && (
                      <span className="text-xs text-success font-medium flex items-center gap-1 pr-2">
                        <CheckCircle2 size={13} /> Completed
                      </span>
                    )}

                    {task.status !== 'COMPLETED' && task.status !== 'CANCELLED' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => onReschedule(task, e)}
                        className="h-8 px-2 text-ch-text-muted hover:text-ch-text-primary"
                        title="Reschedule deadline"
                      >
                        <CalendarClock size={14} />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
