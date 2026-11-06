import React, { useState } from 'react';
import type { TaskItem } from '@corviin-hub/shared';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { TaskCard } from './TaskCard';
import { isTaskOverdue, formatDuration } from '../utils/task-utils';
import { ChevronDown, ChevronRight, User, AlertTriangle, Clock, Plus } from 'lucide-react';

interface TaskByMemberViewProps {
  tasks: TaskItem[];
  profiles: Array<{ id: string; displayName: string; initials: string }>;
  onSelectTask: (task: TaskItem) => void;
  onStart: (id: string, e: React.MouseEvent) => void;
  onPause: (id: string, e: React.MouseEvent) => void;
  onResume: (id: string, e: React.MouseEvent) => void;
  onComplete: (task: TaskItem, e: React.MouseEvent) => void;
  onReschedule: (task: TaskItem, e: React.MouseEvent) => void;
  onBlock: (task: TaskItem, e: React.MouseEvent) => void;
  onCreateTaskForMember: (memberId: string) => void;
}

export function TaskByMemberView({
  tasks,
  profiles,
  onSelectTask,
  onStart,
  onPause,
  onResume,
  onComplete,
  onReschedule,
  onBlock,
  onCreateTaskForMember,
}: TaskByMemberViewProps) {
  // Keep all members expanded by default
  const [expandedMembers, setExpandedMembers] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = { unassigned: true };
    profiles.forEach((p) => {
      init[p.id] = true;
    });
    return init;
  });

  const toggleMember = (id: string) => {
    setExpandedMembers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Build member buckets
  const memberBuckets = profiles.map((p) => {
    const memberTasks = tasks.filter((t) => t.assigneeId === p.id);
    const openTasks = memberTasks.filter((t) => t.status !== 'COMPLETED' && t.status !== 'CANCELLED');
    const inProgressTasks = memberTasks.filter((t) => t.status === 'IN_PROGRESS');
    const overdueTasks = memberTasks.filter((t) => isTaskOverdue(t));
    const totalDurationSeconds = memberTasks.reduce(
      (acc, t) => acc + (t.workSessions || []).reduce((sAcc, s) => sAcc + (s.durationSeconds || 0), 0),
      0,
    );

    return {
      id: p.id,
      name: p.displayName,
      initials: p.initials,
      tasks: memberTasks,
      openCount: openTasks.length,
      inProgressCount: inProgressTasks.length,
      overdueCount: overdueTasks.length,
      totalDurationSeconds,
    };
  });

  // Handle unassigned tasks if any
  const unassignedTasks = tasks.filter((t) => !t.assigneeId);
  if (unassignedTasks.length > 0) {
    const openTasks = unassignedTasks.filter((t) => t.status !== 'COMPLETED' && t.status !== 'CANCELLED');
    const inProgressTasks = unassignedTasks.filter((t) => t.status === 'IN_PROGRESS');
    const overdueTasks = unassignedTasks.filter((t) => isTaskOverdue(t));

    memberBuckets.push({
      id: 'unassigned',
      name: 'Unassigned Queue',
      initials: 'UA',
      tasks: unassignedTasks,
      openCount: openTasks.length,
      inProgressCount: inProgressTasks.length,
      overdueCount: overdueTasks.length,
      totalDurationSeconds: 0,
    });
  }

  return (
    <div className="space-y-4">
      {memberBuckets.map((bucket) => {
        const isExpanded = expandedMembers[bucket.id] !== false;

        return (
          <div
            key={bucket.id}
            className="rounded-lg border border-ch-border bg-surface overflow-hidden"
          >
            {/* Member Accordion Header */}
            <div
              onClick={() => toggleMember(bucket.id)}
              className="p-3.5 bg-surface-muted/40 hover:bg-surface-muted/70 cursor-pointer select-none flex flex-wrap items-center justify-between gap-3 border-b border-ch-border"
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="p-0.5 text-ch-text-secondary hover:text-ch-text-primary"
                  aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
                >
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>

                <Avatar name={bucket.name} size="sm" />

                <div>
                  <h3 className="text-sm font-bold text-ch-text-primary flex items-center gap-2">
                    {bucket.name}
                    <span className="text-xs font-semibold px-2 py-0.2 rounded-full bg-surface text-ch-text-secondary border border-ch-border">
                      {bucket.tasks.length} {bucket.tasks.length === 1 ? 'task' : 'tasks'}
                    </span>
                  </h3>
                </div>
              </div>

              {/* Workload Stats & Actions */}
              <div className="flex items-center gap-4 text-xs" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-3 text-ch-text-secondary">
                  <span>
                    <strong className="text-ch-text-primary">{bucket.openCount}</strong> open
                  </span>
                  <span>
                    <strong className="text-info">{bucket.inProgressCount}</strong> active
                  </span>
                  {bucket.overdueCount > 0 && (
                    <span className="text-danger flex items-center gap-1 font-semibold">
                      <AlertTriangle size={12} /> {bucket.overdueCount} overdue
                    </span>
                  )}
                  {bucket.totalDurationSeconds > 0 && (
                    <span className="hidden sm:inline font-mono">
                      <Clock size={12} className="inline mr-1" />
                      {formatDuration(bucket.totalDurationSeconds)} logged
                    </span>
                  )}
                </div>

                {bucket.id !== 'unassigned' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onCreateTaskForMember(bucket.id)}
                    className="h-7 text-xs px-2"
                  >
                    <Plus size={13} className="mr-1" />
                    Assign Task
                  </Button>
                )}
              </div>
            </div>

            {/* Member Tasks Grid */}
            {isExpanded && (
              <div className="p-4 bg-surface">
                {bucket.tasks.length === 0 ? (
                  <div className="text-center py-6 text-xs text-ch-text-secondary border border-dashed border-ch-border rounded">
                    No tasks currently assigned to {bucket.name}.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {bucket.tasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onClick={onSelectTask}
                        onStart={onStart}
                        onPause={onPause}
                        onResume={onResume}
                        onComplete={onComplete}
                        onReschedule={onReschedule}
                        onBlock={onBlock}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
