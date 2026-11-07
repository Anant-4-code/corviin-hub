import React from 'react';
import type { TaskItem } from '@corviin-hub/shared';
import { useProfiles } from '@/hooks/useProfiles';
import { Avatar } from '@/components/ui/Avatar';
import { isTaskOverdue } from '@/features/tasks/utils/task-utils';
import { Users, AlertTriangle, Play, Ban, Clock, X, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/cn';

interface TeamTasksWorkloadPanelProps {
  tasks: TaskItem[];
  selectedMemberId: string;
  onSelectMember: (memberId: string) => void;
  onClose?: () => void;
}

export function TeamTasksWorkloadPanel({
  tasks,
  selectedMemberId,
  onSelectMember,
  onClose,
}: TeamTasksWorkloadPanelProps) {
  const { data: profiles = [] } = useProfiles();

  // Compute start and end of this week
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const mondayTime = monday.getTime();
  const sundayTime = sunday.getTime();

  return (
    <div className="bg-surface border border-ch-border rounded-card p-4 space-y-4 shadow-sm">
      <div className="flex items-center justify-between pb-2 border-b border-ch-border">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-accent" />
          <h3 className="text-sm font-bold text-ch-text-primary">Team Workload Distribution</h3>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-ch-text-muted hover:text-ch-text-primary transition-none"
            aria-label="Close workload panel"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <p className="text-xs text-ch-text-secondary">
        Workload across dynamic team members. Click a member to filter the calendar.
      </p>

      {/* Member Workload Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {profiles.map((profile) => {
          const memberTasks = tasks.filter((t) => t.assigneeId === profile.id);
          const totalAssigned = memberTasks.length;
          const dueThisWeek = memberTasks.filter((t) => {
            if (!t.deadline) return false;
            const time = new Date(t.deadline).getTime();
            return time >= mondayTime && time <= sundayTime;
          }).length;
          const overdue = memberTasks.filter(isTaskOverdue).length;
          const inProgress = memberTasks.filter((t) => t.status === 'IN_PROGRESS').length;
          const blocked = memberTasks.filter((t) => t.status === 'BLOCKED').length;

          const isSelected = selectedMemberId === profile.id;

          return (
            <div
              key={profile.id}
              onClick={() => onSelectMember(isSelected ? '' : profile.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectMember(isSelected ? '' : profile.id);
                }
              }}
              className={cn(
                'p-3.5 rounded-card border transition-none cursor-pointer select-none space-y-3',
                isSelected
                  ? 'border-accent bg-accent/5 ring-2 ring-accent'
                  : 'border-ch-border bg-canvas hover:border-ch-border-strong',
              )}
            >
              {/* Header: Avatar, Name & Selected Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar name={profile.displayName} size="sm" />
                  <div>
                    <h4 className="text-xs font-bold text-ch-text-primary">
                      {profile.displayName}
                    </h4>
                    <span className="text-[10px] text-ch-text-muted font-medium">
                      {totalAssigned} {totalAssigned === 1 ? 'task assigned' : 'tasks assigned'}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-accent text-accent-foreground">
                    Filtered
                  </span>
                )}
              </div>

              {/* Metric Breakdown Grid */}
              <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-ch-border text-center">
                <div className="p-1 rounded bg-surface border border-ch-border">
                  <div className="text-[10px] text-ch-text-muted">This Wk</div>
                  <div className="text-xs font-bold text-ch-text-primary">{dueThisWeek}</div>
                </div>

                <div
                  className={cn(
                    'p-1 rounded border',
                    inProgress > 0
                      ? 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400 font-bold'
                      : 'bg-surface border-ch-border text-ch-text-secondary',
                  )}
                >
                  <div className="text-[10px]">Active</div>
                  <div className="text-xs">{inProgress}</div>
                </div>

                <div
                  className={cn(
                    'p-1 rounded border',
                    overdue > 0
                      ? 'bg-danger/10 border-danger/30 text-danger font-bold'
                      : 'bg-surface border-ch-border text-ch-text-secondary',
                  )}
                >
                  <div className="text-[10px]">Overdue</div>
                  <div className="text-xs">{overdue}</div>
                </div>

                <div
                  className={cn(
                    'p-1 rounded border',
                    blocked > 0
                      ? 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400 font-bold'
                      : 'bg-surface border-ch-border text-ch-text-secondary',
                  )}
                >
                  <div className="text-[10px]">Blocked</div>
                  <div className="text-xs">{blocked}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

