import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TaskItem, CreateTaskDto, RescheduleTaskDto, CompleteTaskDto, BlockTaskDto } from '@corviin-hub/shared';
import { useAppStore } from '@/lib/store';
import { fetchTeamTasksCalendar } from '@/services/calendar';
import {
  startWorkSession,
  pauseWorkSession,
  resumeWorkSession,
  rescheduleTask,
  completeTask,
  blockTask,
  createTask,
  toggleChecklistItem,
  addChecklistItem,
  addTaskComment,
  addTaskAttachment,
} from '@/services/tasks';
import { TeamTasksSummaryStrip } from './components/TeamTasksSummaryStrip';
import { TeamTasksDateNavigation } from './components/TeamTasksDateNavigation';
import { TeamTasksFilterToolbar } from './components/TeamTasksFilterToolbar';
import { MemberAccordionSection } from './components/MemberAccordionSection';
import { TaskDetailDrawer } from '@/features/tasks/components/TaskDetailDrawer';
import { RescheduleTaskDialog } from '@/features/tasks/components/RescheduleTaskDialog';
import { CompleteTaskDialog } from '@/features/tasks/components/CompleteTaskDialog';
import { BlockTaskDialog } from '@/features/tasks/components/BlockTaskDialog';
import { CreateTaskDialog } from '@/features/tasks/components/CreateTaskDialog';
import { LoadingState, ErrorState } from '@/components/ui/States';

export function CalendarTeamTasksPage() {
  const queryClient = useQueryClient();
  const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId) || 'ws-tech-0001-0000-000000000001';
  const selectedProfileId = useAppStore((s) => s.selectedProfileId);

  // Date and View Mode
  const [currentDate, setCurrentDate] = useState<string>('2026-11-05');
  const [viewMode, setViewMode] = useState<'BY_MEMBER' | 'AGENDA'>('BY_MEMBER');

  // Filters
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedLinkedType, setSelectedLinkedType] = useState('');
  const [overdueOnly, setOverdueOnly] = useState(false);

  // Accordion Expand/Collapse Map
  const [expandedMembers, setExpandedMembers] = useState<Record<string, boolean>>({});

  // Active Drawers and Modals
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [rescheduleTaskTarget, setRescheduleTaskTarget] = useState<TaskItem | null>(null);
  const [completeTaskTarget, setCompleteTaskTarget] = useState<TaskItem | null>(null);
  const [blockTaskTarget, setBlockTaskTarget] = useState<TaskItem | null>(null);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [preselectedAssigneeId, setPreselectedAssigneeId] = useState<string | undefined>();

  // Fetch Team Tasks Calendar
  const {
    data: calendarData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      'team-tasks-calendar',
      selectedWorkspaceId,
      currentDate,
      selectedMemberId,
      selectedStatus,
      selectedPriority,
      selectedLinkedType,
      overdueOnly,
    ],
    queryFn: () =>
      fetchTeamTasksCalendar({
        workspaceId: selectedWorkspaceId,
        date: currentDate,
        memberId: selectedMemberId || undefined,
        status: selectedStatus || undefined,
        priority: selectedPriority || undefined,
        linkedRecordType: selectedLinkedType || undefined,
        overdueOnly,
      }),
  });

  // Date navigation handlers
  const handlePrevDay = () => {
    const d = new Date(`${currentDate}T00:00:00.000Z`);
    d.setDate(d.getDate() - 1);
    setCurrentDate(d.toISOString().slice(0, 10));
  };

  const handleNextDay = () => {
    const d = new Date(`${currentDate}T00:00:00.000Z`);
    d.setDate(d.getDate() + 1);
    setCurrentDate(d.toISOString().slice(0, 10));
  };

  const handleToday = () => {
    setCurrentDate('2026-11-05');
  };

  const handleClearFilters = () => {
    setSelectedMemberId('');
    setSelectedStatus('');
    setSelectedPriority('');
    setSelectedLinkedType('');
    setOverdueOnly(false);
  };

  const toggleMemberAccordion = (profileId: string) => {
    setExpandedMembers((prev) => ({
      ...prev,
      [profileId]: prev[profileId] === undefined ? false : !prev[profileId],
    }));
  };

  // Task Mutations
  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['team-tasks-calendar'] });
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  };

  const startSessionMutation = useMutation({
    mutationFn: (task: TaskItem) => startWorkSession(task.id),
    onSuccess: invalidateQueries,
  });

  const pauseSessionMutation = useMutation({
    mutationFn: (task: TaskItem) => pauseWorkSession(task.id),
    onSuccess: invalidateQueries,
  });

  const rescheduleMutation = useMutation({
    mutationFn: ({ taskId, dto }: { taskId: string; dto: RescheduleTaskDto }) =>
      rescheduleTask(taskId, dto),
    onSuccess: invalidateQueries,
  });

  const completeMutation = useMutation({
    mutationFn: ({ taskId, dto }: { taskId: string; dto: CompleteTaskDto }) =>
      completeTask(taskId, dto),
    onSuccess: invalidateQueries,
  });

  const blockMutation = useMutation({
    mutationFn: ({ taskId, dto }: { taskId: string; dto: BlockTaskDto }) =>
      blockTask(taskId, dto),
    onSuccess: invalidateQueries,
  });

  const createTaskMutation = useMutation({
    mutationFn: (dto: CreateTaskDto) => createTask(dto),
    onSuccess: invalidateQueries,
  });

  if (isLoading) {
    return (
      <div className="py-12">
        <LoadingState message="Loading team tasks schedule and member workloads..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-12">
        <ErrorState
          title="Failed to Load Team Tasks Calendar"
          message={error instanceof Error ? error.message : 'An unexpected error occurred.'}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const metrics = calendarData?.metrics || {
    totalScheduled: 0,
    totalOverdue: 0,
    totalInProgress: 0,
    totalCompleted: 0,
  };

  const members = calendarData?.members || [];
  const unassigned = calendarData?.unassigned;

  return (
    <div className="space-y-4">
      {/* 1. Summary Strip */}
      <TeamTasksSummaryStrip metrics={metrics} />

      {/* 2. Date Navigation Controls */}
      <TeamTasksDateNavigation
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        onPrevDay={handlePrevDay}
        onNextDay={handleNextDay}
        onToday={handleToday}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenCreateTask={() => {
          setPreselectedAssigneeId(undefined);
          setIsCreateTaskOpen(true);
        }}
      />

      {/* 3. Filters Toolbar */}
      <TeamTasksFilterToolbar
        selectedMemberId={selectedMemberId}
        onMemberChange={setSelectedMemberId}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedPriority={selectedPriority}
        onPriorityChange={setSelectedPriority}
        selectedLinkedType={selectedLinkedType}
        onLinkedTypeChange={setSelectedLinkedType}
        overdueOnly={overdueOnly}
        onOverdueOnlyChange={setOverdueOnly}
        onClearFilters={handleClearFilters}
      />

      {/* 4. Main Schedule Display */}
      {viewMode === 'BY_MEMBER' ? (
        <div className="space-y-3">
          {members.map((group) => {
            // Default open unless explicitly toggled closed
            const isExpanded = expandedMembers[group.profileId] ?? true;

            return (
              <MemberAccordionSection
                key={group.profileId}
                group={group}
                expanded={isExpanded}
                onToggle={() => toggleMemberAccordion(group.profileId)}
                onSelectTask={(task) => {
                  setSelectedTask(task);
                  setIsDetailOpen(true);
                }}
                onStartSession={(task) => startSessionMutation.mutate(task)}
                onPauseSession={(task) => pauseSessionMutation.mutate(task)}
                onCompleteTask={(task) => setCompleteTaskTarget(task)}
                onRescheduleTask={(task) => setRescheduleTaskTarget(task)}
                onAddTaskForMember={(memberId) => {
                  setPreselectedAssigneeId(memberId);
                  setIsCreateTaskOpen(true);
                }}
              />
            );
          })}

          {/* Unassigned Tasks if any */}
          {unassigned && unassigned.taskCount > 0 && (
            <div className="border border-ch-border rounded-card bg-surface p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ch-text-secondary mb-2">
                Unassigned Tasks ({unassigned.taskCount})
              </h4>
              <div className="space-y-2">
                {unassigned.tasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setSelectedTask(t);
                      setIsDetailOpen(true);
                    }}
                    className="p-2.5 rounded border border-ch-border bg-canvas cursor-pointer hover:border-ch-border-strong text-xs flex items-center justify-between"
                  >
                    <span className="font-semibold text-ch-text-primary">{t.title}</span>
                    <span className="text-ch-text-muted">{t.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Agenda Flattened List */
        <div className="space-y-2">
          {members.flatMap((m) => m.tasks).length === 0 ? (
            <div className="text-center py-12 bg-surface rounded-card border border-ch-border text-xs text-ch-text-muted">
              No tasks scheduled for this date.
            </div>
          ) : (
            members
              .flatMap((m) => m.tasks)
              .map((task) => (
                <div
                  key={task.id}
                  onClick={() => {
                    setSelectedTask(task);
                    setIsDetailOpen(true);
                  }}
                  className="p-3.5 bg-surface border border-ch-border rounded-card cursor-pointer hover:border-ch-border-strong flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs text-ch-text-muted">{task.assigneeName || 'Unassigned'}</div>
                    <div className="text-sm font-bold text-ch-text-primary">{task.title}</div>
                  </div>
                  <div className="text-xs font-semibold px-2 py-0.5 rounded border border-ch-border bg-canvas">
                    {task.status}
                  </div>
                </div>
              ))
          )}
        </div>
      )}

      {/* 5. Task Detail Drawer */}
      <TaskDetailDrawer
        task={selectedTask}
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onStartSession={async (id) => {
          await startWorkSession(id);
          invalidateQueries();
        }}
        onPauseSession={async (id) => {
          await pauseWorkSession(id);
          invalidateQueries();
        }}
        onResumeSession={async (id) => {
          await resumeWorkSession(id);
          invalidateQueries();
        }}
        onOpenRescheduleModal={(task: TaskItem) => {
          setIsDetailOpen(false);
          setRescheduleTaskTarget(task);
        }}
        onOpenCompleteModal={(task: TaskItem) => {
          setIsDetailOpen(false);
          setCompleteTaskTarget(task);
        }}
        onOpenBlockModal={(task: TaskItem) => {
          setIsDetailOpen(false);
          setBlockTaskTarget(task);
        }}
        onToggleChecklist={async (taskId, checklistId) => {
          await toggleChecklistItem(taskId, checklistId);
          invalidateQueries();
        }}
        onAddChecklist={async (taskId, title) => {
          await addChecklistItem(taskId, title);
          invalidateQueries();
        }}
        onAddComment={async (taskId, content) => {
          await addTaskComment(taskId, content);
          invalidateQueries();
        }}
        onAddAttachment={async (taskId, file) => {
          await addTaskAttachment(taskId, file);
          invalidateQueries();
        }}
      />

      {/* 6. Reschedule Task Dialog */}
      <RescheduleTaskDialog
        task={rescheduleTaskTarget}
        open={Boolean(rescheduleTaskTarget)}
        onClose={() => setRescheduleTaskTarget(null)}
        onReschedule={async (taskId, newDeadline, reason, newPlannedStart) => {
          await rescheduleMutation.mutateAsync({
            taskId,
            dto: { newDeadline, reason, newPlannedStart },
          });
        }}
      />

      {/* 7. Complete Task Dialog */}
      <CompleteTaskDialog
        task={completeTaskTarget}
        open={Boolean(completeTaskTarget)}
        onClose={() => setCompleteTaskTarget(null)}
        onComplete={async (taskId, completionNote) => {
          await completeMutation.mutateAsync({
            taskId,
            dto: { completionNote },
          });
        }}
      />

      {/* 8. Block Task Dialog */}
      <BlockTaskDialog
        task={blockTaskTarget}
        open={Boolean(blockTaskTarget)}
        onClose={() => setBlockTaskTarget(null)}
        onBlock={async (taskId, blockerReason, expectedResolutionDate) => {
          await blockMutation.mutateAsync({
            taskId,
            dto: { blockerReason, expectedResolutionDate },
          });
        }}
      />

      {/* 9. Create Task Dialog */}
      <CreateTaskDialog
        open={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        onCreate={async (dto) => {
          await createTaskMutation.mutateAsync(dto);
        }}
        initialAssigneeId={preselectedAssigneeId}
        defaultDeadline={new Date(`${currentDate}T17:00:00.000Z`).toISOString()}
      />
    </div>
  );
}
