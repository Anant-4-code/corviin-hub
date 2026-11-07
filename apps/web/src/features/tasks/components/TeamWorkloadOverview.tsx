import React from 'react';
import type { TaskItem } from '@corviin-hub/shared';
import { isTaskOverdue } from '../utils/task-utils';
import { User, UserX, Clock, AlertOctagon, CheckCircle2 } from 'lucide-react';

interface MemberWorkload {
  id: string;
  name: string;
  openCount: number;
  inProgressCount: number;
  overdueCount: number;
  blockedCount: number;
  completedCount: number;
}

interface TeamWorkloadOverviewProps {
  tasks: TaskItem[];
  profiles: { id: string; displayName: string; initials?: string }[];
  selectedAssigneeId?: string;
  onSelectAssignee: (assigneeId: string) => void;
}

export function TeamWorkloadOverview({
  tasks,
  profiles,
  selectedAssigneeId,
  onSelectAssignee,
}: TeamWorkloadOverviewProps) {
  // Compute metrics per member
  const workloads: MemberWorkload[] = profiles.map((p) => {
    const memberTasks = tasks.filter((t) => t.assigneeId === p.id);
    return {
      id: p.id,
      name: p.displayName,
      openCount: memberTasks.filter(
        (t) => t.status !== 'COMPLETED' && t.status !== 'CANCELLED',
      ).length,
      inProgressCount: memberTasks.filter((t) => t.status === 'IN_PROGRESS').length,
      overdueCount: memberTasks.filter((t) => isTaskOverdue(t)).length,
      blockedCount: memberTasks.filter((t) => t.status === 'BLOCKED').length,
      completedCount: memberTasks.filter((t) => t.status === 'COMPLETED').length,
    };
  });

  // Also include unassigned tasks
  const unassignedTasks = tasks.filter(
    (t) => !t.assigneeId || t.assigneeId === 'unassigned',
  );
  if (unassignedTasks.length > 0) {
    workloads.push({
      id: 'UNASSIGNED',
      name: 'Unassigned',
      openCount: unassignedTasks.filter(
        (t) => t.status !== 'COMPLETED' && t.status !== 'CANCELLED',
      ).length,
      inProgressCount: unassignedTasks.filter((t) => t.status === 'IN_PROGRESS').length,
      overdueCount: unassignedTasks.filter((t) => isTaskOverdue(t)).length,
      blockedCount: unassignedTasks.filter((t) => t.status === 'BLOCKED').length,
      completedCount: unassignedTasks.filter((t) => t.status === 'COMPLETED').length,
    });
  }

  return (
    <div className="bg-surface rounded-lg border border-ch-border p-3.5 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-ch-text-primary">
            Team Workload Overview
          </h3>
          <p className="text-[11px] text-ch-text-secondary mt-0.5">
            Active workload, in-progress tasks, and deadline risks across members.
          </p>
        </div>
        {selectedAssigneeId && selectedAssigneeId !== 'ALL' && (
          <button
            type="button"
            onClick={() => onSelectAssignee('ALL')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Show All Team
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {workloads.map((w) => {
          const isSelected = selectedAssigneeId === w.id;

          return (
            <div
              key={w.id}
              onClick={() =>
                onSelectAssignee(isSelected ? 'ALL' : w.id)
              }
              className={`p-3 rounded-lg border cursor-pointer transition-none ${
                isSelected
                  ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-500 dark:border-blue-400 ring-1 ring-blue-500'
                  : 'bg-surface-muted/30 border-ch-border hover:bg-surface-muted'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-ch-border/60">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 flex items-center justify-center text-[10px] font-bold">
                    {w.id === 'UNASSIGNED' ? (
                      <UserX size={12} />
                    ) : (
                      w.name.charAt(0)
                    )}
                  </div>
                  <span className="text-xs font-bold text-ch-text-primary">
                    {w.name}
                  </span>
                </div>
                {isSelected && (
                  <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                    Selected
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-1.5 pt-2 text-[11px]">
                <div>
                  <div className="text-ch-text-muted">Open</div>
                  <div className="font-semibold text-ch-text-primary">{w.openCount}</div>
                </div>

                <div>
                  <div className="text-ch-text-muted">In Progress</div>
                  <div className="font-semibold text-blue-600 dark:text-blue-400">
                    {w.inProgressCount}
                  </div>
                </div>

                <div>
                  <div className="text-ch-text-muted">Overdue</div>
                  <div
                    className={`font-semibold ${
                      w.overdueCount > 0
                        ? 'text-red-600 dark:text-red-400 font-bold'
                        : 'text-ch-text-secondary'
                    }`}
                  >
                    {w.overdueCount}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
