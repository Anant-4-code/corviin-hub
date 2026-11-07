import React, { useState, useMemo } from 'react';
import type { TaskItem } from '@corviin-hub/shared';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityIndicator } from '@/components/ui/PriorityIndicator';
import { Avatar } from '@/components/ui/Avatar';
import { TaskMobileCard } from './TaskMobileCard';
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
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  UserX,
  FolderOpen,
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
  onCreateTask?: () => void;
}

type SortField = 'title' | 'assignee' | 'status' | 'priority' | 'deadline';
type SortOrder = 'asc' | 'desc';

const PRIORITY_ORDER: Record<string, number> = {
  URGENT: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

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
  onCreateTask,
}: AllTasksTableViewProps) {
  const [sortField, setSortField] = useState<SortField>('deadline');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'assignee':
          comparison = (a.assigneeName || 'zzz').localeCompare(b.assigneeName || 'zzz');
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'priority':
          comparison = (PRIORITY_ORDER[a.priority] || 0) - (PRIORITY_ORDER[b.priority] || 0);
          break;
        case 'deadline': {
          const aTime = a.deadline ? new Date(a.deadline).getTime() : Infinity;
          const bTime = b.deadline ? new Date(b.deadline).getTime() : Infinity;
          comparison = aTime - bTime;
          break;
        }
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [tasks, sortField, sortOrder]);

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 px-4 bg-surface rounded-lg border border-ch-border flex flex-col items-center justify-center space-y-3">
        <div className="p-3 rounded-full bg-surface-muted text-ch-text-muted">
          <FolderOpen size={24} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-ch-text-primary">
            No tasks found
          </h3>
          <p className="text-xs text-ch-text-secondary mt-0.5">
            There are no workspace tasks matching your active filters.
          </p>
        </div>
        {onCreateTask && (
          <button
            type="button"
            onClick={onCreateTask}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 underline underline-offset-2"
          >
            Create a new task
          </button>
        )}
      </div>
    );
  }

  const allSelected = tasks.length > 0 && selectedTaskIds.length === tasks.length;
  const someSelected = selectedTaskIds.length > 0 && selectedTaskIds.length < tasks.length;

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown size={12} className="text-ch-text-muted/60" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp size={12} className="text-blue-600 dark:text-blue-400" />
    ) : (
      <ArrowDown size={12} className="text-blue-600 dark:text-blue-400" />
    );
  };

  return (
    <div>
      {/* Mobile Stacked View (< 768px) */}
      <div className="space-y-2.5 md:hidden">
        {sortedTasks.map((task) => (
          <TaskMobileCard
            key={task.id}
            task={task}
            onSelect={onSelectTask}
            onStartSession={(id, e) => onStart(id, e!)}
            onPauseSession={(id, e) => onPause(id, e!)}
            onResumeSession={(id, e) => onResume(id, e!)}
            onOpenComplete={(t, e) => onComplete(t, e!)}
            onOpenReschedule={(t, e) => onReschedule(t, e!)}
            showAssignee={true}
          />
        ))}
      </div>

      {/* Desktop Structured Table (>= 768px) */}
      <div className="hidden md:block w-full overflow-x-auto rounded-lg border border-ch-border bg-surface">
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
                  className="rounded border-ch-border text-blue-600 focus:ring-blue-500 cursor-pointer"
                  aria-label="Select all tasks"
                />
              </th>
              <th
                onClick={() => handleSort('title')}
                className="py-3 px-3 cursor-pointer select-none hover:text-ch-text-primary"
              >
                <div className="flex items-center gap-1.5">
                  <span>Task Details</span>
                  {renderSortIcon('title')}
                </div>
              </th>
              <th
                onClick={() => handleSort('assignee')}
                className="py-3 px-3 cursor-pointer select-none hover:text-ch-text-primary"
              >
                <div className="flex items-center gap-1.5">
                  <span>Assignee</span>
                  {renderSortIcon('assignee')}
                </div>
              </th>
              <th
                onClick={() => handleSort('status')}
                className="py-3 px-3 cursor-pointer select-none hover:text-ch-text-primary"
              >
                <div className="flex items-center gap-1.5">
                  <span>Status</span>
                  {renderSortIcon('status')}
                </div>
              </th>
              <th
                onClick={() => handleSort('priority')}
                className="py-3 px-3 cursor-pointer select-none hover:text-ch-text-primary"
              >
                <div className="flex items-center gap-1.5">
                  <span>Priority</span>
                  {renderSortIcon('priority')}
                </div>
              </th>
              <th
                onClick={() => handleSort('deadline')}
                className="py-3 px-3 cursor-pointer select-none hover:text-ch-text-primary"
              >
                <div className="flex items-center gap-1.5">
                  <span>Deadline</span>
                  {renderSortIcon('deadline')}
                </div>
              </th>
              <th className="py-3 px-3">Linked Record</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ch-border">
            {sortedTasks.map((task) => {
              const isSelected = selectedTaskIds.includes(task.id);
              const isOverdue = isTaskOverdue(task);
              const totalSubtasks = (task.checklist || []).length;
              const completedSubtasks = (task.checklist || []).filter((i) => i.completed).length;
              const totalDuration = (task.workSessions || []).reduce(
                (acc, s) => acc + (s.durationSeconds || 0),
                0,
              );
              const activeSession = (task.workSessions || []).find((s) => !s.endedAt);

              return (
                <tr
                  key={task.id}
                  onClick={() => onSelectTask(task)}
                  className={`hover:bg-surface-muted/40 cursor-pointer select-none transition-none ${
                    isSelected ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                  }`}
                >
                  {/* Select Checkbox */}
                  <td
                    className="py-3 px-3 text-center"
                    onClick={(e) => onToggleSelectTask(task.id, e)}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="rounded border-ch-border text-blue-600 focus:ring-blue-500 cursor-pointer"
                      aria-label={`Select ${task.title}`}
                    />
                  </td>

                  {/* Title & Context */}
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
                      <div className="text-[11px] text-red-600 dark:text-red-400 mt-1 font-medium truncate flex items-center gap-1">
                        <AlertTriangle size={11} className="shrink-0" />
                        <span>Blocker: {task.blockerReason}</span>
                      </div>
                    )}
                  </td>

                  {/* Assignee */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    {task.assigneeName ? (
                      <div className="flex items-center gap-2">
                        <Avatar
                          name={task.assigneeName}
                          size="xs"
                          className="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 font-bold"
                        />
                        <span className="font-medium text-ch-text-primary">
                          {task.assigneeName}
                        </span>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-900/50">
                        <UserX size={11} />
                        Unassigned
                      </span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <StatusBadge
                      type={getStatusBadgeType(task.status)}
                      label={getStatusLabel(task.status)}
                    />
                  </td>

                  {/* Priority */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <PriorityIndicator priority={task.priority} />
                  </td>

                  {/* Deadline & Overdue */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div
                      className={`text-xs ${
                        isOverdue
                          ? 'font-bold text-red-600 dark:text-red-400'
                          : 'text-ch-text-secondary'
                      }`}
                    >
                      {formatDateTime(task.deadline)}
                    </div>
                    {isOverdue && (
                      <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-800">
                        Overdue
                      </span>
                    )}
                  </td>

                  {/* Linked Record */}
                  <td className="py-3 px-3 max-w-[160px] truncate text-ch-text-secondary">
                    {task.linkedRecordTitle ? (
                      <div className="flex items-center gap-1 truncate text-xs">
                        <Layers size={13} className="text-blue-500 shrink-0" />
                        <span className="truncate">{task.linkedRecordTitle}</span>
                      </div>
                    ) : (
                      <span className="text-ch-text-muted">—</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td
                    className="py-3 px-4 text-right whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      {activeSession ? (
                        <button
                          type="button"
                          onClick={(e) => onPause(task.id, e)}
                          title="Pause work session"
                          className="px-2 py-1 rounded bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 text-xs font-semibold flex items-center gap-1 hover:bg-amber-200"
                        >
                          <Pause size={12} />
                          Pause
                        </button>
                      ) : task.status !== 'COMPLETED' && task.status !== 'CANCELLED' ? (
                        <button
                          type="button"
                          onClick={(e) => onStart(task.id, e)}
                          title="Start work session"
                          className="px-2 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 text-xs font-semibold flex items-center gap-1 hover:bg-blue-200"
                        >
                          <Play size={12} />
                          Start
                        </button>
                      ) : null}

                      {task.status !== 'COMPLETED' && (
                        <button
                          type="button"
                          onClick={(e) => onComplete(task, e)}
                          title="Mark task as complete"
                          className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1 hover:bg-emerald-200"
                        >
                          <CheckCircle2 size={12} />
                          Done
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={(e) => onReschedule(task, e)}
                        title="Reschedule deadline"
                        className="p-1 rounded text-ch-text-secondary hover:text-ch-text-primary hover:bg-surface-muted"
                      >
                        <CalendarClock size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
