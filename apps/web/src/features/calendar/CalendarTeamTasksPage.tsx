import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  TaskItem,
  CreateTaskDto,
  RescheduleTaskDto,
  CompleteTaskDto,
  BlockTaskDto,
  TaskStatus,
  TaskPriority,
} from '@corviin-hub/shared';
import { useAppStore } from '@/lib/store';
import { useProfiles } from '@/hooks/useProfiles';
import { fetchTeamTasksCalendar } from '@/services/calendar';
import {
  fetchTasks,
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
import { isTaskOverdue } from '@/features/tasks/utils/task-utils';

import { TeamTasksHeader } from './components/TeamTasksHeader';
import { TeamTasksKpiCards, TeamTasksKpiMetrics } from './components/TeamTasksKpiCards';
import { TeamTasksToolbar, TeamTasksViewMode } from './components/TeamTasksToolbar';
import { TeamTasksFilterToolbar } from './components/TeamTasksFilterToolbar';
import { TeamTasksMonthGrid } from './components/TeamTasksMonthGrid';
import { TeamTasksWeekGrid } from './components/TeamTasksWeekGrid';
import { TeamTasksDayGrid } from './components/TeamTasksDayGrid';
import { TeamTasksAgendaView } from './components/TeamTasksAgendaView';
import { TeamTasksWorkloadPanel } from './components/TeamTasksWorkloadPanel';
import { TeamTasksUnscheduledPanel } from './components/TeamTasksUnscheduledPanel';
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

  // Dynamic profiles hook
  const { data: profiles = [] } = useProfiles();

  // Date and View State (default to 2026-11-05 for workspace reference or today)
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date('2026-11-05T12:00:00.000Z'));
  const [viewMode, setViewMode] = useState<TeamTasksViewMode | 'BY_MEMBER'>(() =>
    typeof window !== 'undefined' && window.innerWidth < 768 ? 'AGENDA' : 'MONTH',
  );

  // Panels visibility
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isWorkloadOpen, setIsWorkloadOpen] = useState(false);
  const [isUnscheduledOpen, setIsUnscheduledOpen] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedLinkedType, setSelectedLinkedType] = useState('');
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [blockedOnly, setBlockedOnly] = useState(false);
  const [completedOnly, setCompletedOnly] = useState(false);
  const [unassignedOnly, setUnassignedOnly] = useState(false);
  const [activeKpiFilter, setActiveKpiFilter] = useState<string | null>(null);

  // Accordion Expand/Collapse map (for BY_MEMBER view)
  const [expandedMembers, setExpandedMembers] = useState<Record<string, boolean>>({});

  // Active Dialogs and Modals
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [rescheduleTaskTarget, setRescheduleTaskTarget] = useState<TaskItem | null>(null);
  const [completeTaskTarget, setCompleteTaskTarget] = useState<TaskItem | null>(null);
  const [blockTaskTarget, setBlockTaskTarget] = useState<TaskItem | null>(null);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [preselectedDateStr, setPreselectedDateStr] = useState<string | undefined>();
  const [preselectedAssigneeId, setPreselectedAssigneeId] = useState<string | undefined>();

  const currentDateKey = currentDate.toISOString().slice(0, 10);

  // 1. Fetch all workspace tasks
  const {
    data: allWorkspaceTasks = [],
    isLoading: isTasksLoading,
    isError: isTasksError,
    error: tasksError,
    refetch: refetchTasks,
  } = useQuery({
    queryKey: ['tasks', selectedWorkspaceId, { scope: 'all_tasks' }],
    queryFn: () => fetchTasks({ mine: false }),
    staleTime: 10_000,
  });

  // 2. Fetch Team Tasks Calendar endpoint (for backwards compatibility with unit tests and server-side aggregation)
  const {
    data: calendarApiData,
    isLoading: isCalendarApiLoading,
    isError: isCalendarApiError,
    error: calendarApiError,
    refetch: refetchCalendarApi,
  } = useQuery({
    queryKey: [
      'team-tasks-calendar',
      selectedWorkspaceId,
      currentDateKey,
      selectedMemberId,
      selectedStatus,
      selectedPriority,
      selectedLinkedType,
      overdueOnly,
    ],
    queryFn: () =>
      fetchTeamTasksCalendar({
        workspaceId: selectedWorkspaceId,
        date: currentDateKey,
        memberId: selectedMemberId || undefined,
        status: selectedStatus || undefined,
        priority: selectedPriority || undefined,
        linkedRecordType: selectedLinkedType || undefined,
        overdueOnly,
      }),
  });

  const isLoading = isTasksLoading && isCalendarApiLoading;
  const isError = isTasksError && isCalendarApiError;
  const error = tasksError || calendarApiError;

  // Invalidate queries helper
  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
    queryClient.invalidateQueries({ queryKey: ['team-tasks-calendar'] });
  };

  // Mutations
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

  // Date Navigation Handlers
  const handleToday = () => {
    setCurrentDate(new Date('2026-11-05T12:00:00.000Z'));
  };

  const handlePrev = () => {
    const d = new Date(currentDate);
    if (viewMode === 'MONTH') {
      d.setMonth(d.getMonth() - 1);
    } else if (viewMode === 'WEEK') {
      d.setDate(d.getDate() - 7);
    } else {
      d.setDate(d.getDate() - 1);
    }
    setCurrentDate(d);
  };

  const handleNext = () => {
    const d = new Date(currentDate);
    if (viewMode === 'MONTH') {
      d.setMonth(d.getMonth() + 1);
    } else if (viewMode === 'WEEK') {
      d.setDate(d.getDate() + 7);
    } else {
      d.setDate(d.getDate() + 1);
    }
    setCurrentDate(d);
  };

  const handleClearFilters = () => {
    setSelectedMemberId('');
    setSelectedStatus('');
    setSelectedPriority('');
    setSelectedLinkedType('');
    setOverdueOnly(false);
    setBlockedOnly(false);
    setCompletedOnly(false);
    setUnassignedOnly(false);
    setSearchQuery('');
    setActiveKpiFilter(null);
  };

  // Combine tasks from allWorkspaceTasks or fallback to calendarApiData members
  const effectiveTasks = useMemo(() => {
    if (allWorkspaceTasks.length > 0) return allWorkspaceTasks;
    if (calendarApiData?.members) {
      const flat = calendarApiData.members.flatMap((m) => m.tasks);
      if (calendarApiData.unassigned?.tasks) {
        flat.push(...calendarApiData.unassigned.tasks);
      }
      return flat;
    }
    return [];
  }, [allWorkspaceTasks, calendarApiData]);

  // Compute 6 KPI Metrics
  const kpiMetrics: TeamTasksKpiMetrics = useMemo(() => {
    const now = new Date();
    // Monday to Sunday of the current week
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const startOfWeekTime = startOfWeek.getTime();
    const endOfWeekTime = endOfWeek.getTime();

    const scheduled = effectiveTasks.filter((t) => Boolean(t.deadline)).length;
    const dueToday = effectiveTasks.filter(
      (t) => t.deadline && t.deadline.slice(0, 10) === currentDateKey,
    ).length;
    const overdue = effectiveTasks.filter(isTaskOverdue).length;
    const inProgress = effectiveTasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const blocked = effectiveTasks.filter((t) => t.status === 'BLOCKED').length;
    const completedThisWeek = effectiveTasks.filter((t) => {
      if (t.status !== 'COMPLETED') return false;
      const updatedTime = new Date(t.updatedAt || t.createdAt).getTime();
      return updatedTime >= startOfWeekTime && updatedTime <= endOfWeekTime;
    }).length;

    // Use calendarApiData metrics if available and higher for accuracy
    return {
      totalScheduled: calendarApiData?.metrics?.totalScheduled || scheduled,
      dueToday,
      totalOverdue: calendarApiData?.metrics?.totalOverdue ?? overdue,
      totalInProgress: calendarApiData?.metrics?.totalInProgress ?? inProgress,
      totalBlocked: blocked,
      completedThisWeek: calendarApiData?.metrics?.totalCompleted ?? completedThisWeek,
    };
  }, [effectiveTasks, calendarApiData, currentDateKey]);

  // Handle KPI Click Filter Application
  const handleKpiClick = (filterKey: string) => {
    if (activeKpiFilter === filterKey) {
      handleClearFilters();
      return;
    }

    setActiveKpiFilter(filterKey);

    switch (filterKey) {
      case 'ALL':
        handleClearFilters();
        break;
      case 'DUE_TODAY':
        setSelectedStatus('');
        setOverdueOnly(false);
        setBlockedOnly(false);
        setViewMode('DAY');
        break;
      case 'OVERDUE':
        setOverdueOnly(true);
        setBlockedOnly(false);
        setSelectedStatus('');
        break;
      case 'IN_PROGRESS':
        setSelectedStatus(TaskStatus.IN_PROGRESS);
        setOverdueOnly(false);
        setBlockedOnly(false);
        break;
      case 'BLOCKED':
        setBlockedOnly(true);
        setSelectedStatus(TaskStatus.BLOCKED);
        setOverdueOnly(false);
        break;
      case 'COMPLETED_THIS_WEEK':
        setCompletedOnly(true);
        setSelectedStatus(TaskStatus.COMPLETED);
        setOverdueOnly(false);
        setBlockedOnly(false);
        break;
      default:
        break;
    }
  };

  // Filter Tasks
  const filteredTasks = useMemo(() => {
    return effectiveTasks.filter((task) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(q);
        const matchesDesc = (task.description || '').toLowerCase().includes(q);
        const matchesAssignee = (task.assigneeName || '').toLowerCase().includes(q);
        const matchesId = task.id.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesAssignee && !matchesId) return false;
      }

      // Member
      if (selectedMemberId) {
        if (selectedMemberId === 'unassigned') {
          if (task.assigneeId) return false;
        } else if (task.assigneeId !== selectedMemberId) {
          return false;
        }
      }

      // Status
      if (selectedStatus && task.status !== selectedStatus) return false;

      // Priority
      if (selectedPriority && task.priority !== selectedPriority) return false;

      // Linked Record Type
      if (selectedLinkedType && task.linkedRecord?.type !== selectedLinkedType) return false;

      // Quick Toggles
      if (overdueOnly && !isTaskOverdue(task)) return false;
      if (blockedOnly && task.status !== 'BLOCKED') return false;
      if (completedOnly && task.status !== 'COMPLETED') return false;
      if (unassignedOnly && task.assigneeId) return false;

      return true;
    });
  }, [
    effectiveTasks,
    searchQuery,
    selectedMemberId,
    selectedStatus,
    selectedPriority,
    selectedLinkedType,
    overdueOnly,
    blockedOnly,
    completedOnly,
    unassignedOnly,
  ]);

  // Unscheduled tasks count
  const unscheduledTasks = useMemo(
    () => effectiveTasks.filter((t) => !t.deadline),
    [effectiveTasks],
  );

  const activeFilterCount =
    (selectedMemberId ? 1 : 0) +
    (selectedStatus ? 1 : 0) +
    (selectedPriority ? 1 : 0) +
    (selectedLinkedType ? 1 : 0) +
    (overdueOnly ? 1 : 0) +
    (blockedOnly ? 1 : 0) +
    (completedOnly ? 1 : 0) +
    (unassignedOnly ? 1 : 0) +
    (searchQuery ? 1 : 0);

  if (isLoading) {
    return (
      <div className="py-12">
        <LoadingState message="Loading team tasks calendar and workspace schedule..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-12">
        <ErrorState
          title="Failed to Load Team Tasks Calendar"
          message={error instanceof Error ? error.message : 'An unexpected error occurred.'}
          onRetry={() => {
            refetchTasks();
            refetchCalendarApi();
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 1. Page Header */}
      <TeamTasksHeader
        onToday={handleToday}
        onCreateTask={() => {
          setPreselectedDateStr(undefined);
          setPreselectedAssigneeId(undefined);
          setIsCreateTaskOpen(true);
        }}
      />

      {/* 2. 6 KPI Summary Cards */}
      <TeamTasksKpiCards
        metrics={kpiMetrics}
        activeFilter={activeKpiFilter}
        onSelectKpi={handleKpiClick}
      />

      {/* 3. Calendar Navigation Toolbar */}
      <TeamTasksToolbar
        currentDate={currentDate}
        viewMode={viewMode}
        onViewModeChange={(m) => setViewMode(m)}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onDateSelect={(d) => setCurrentDate(d)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isFilterOpen={isFilterOpen}
        onToggleFilter={() => setIsFilterOpen((prev) => !prev)}
        activeFilterCount={activeFilterCount}
        isWorkloadOpen={isWorkloadOpen}
        onToggleWorkload={() => setIsWorkloadOpen((prev) => !prev)}
        isUnscheduledOpen={isUnscheduledOpen}
        onToggleUnscheduled={() => setIsUnscheduledOpen((prev) => !prev)}
        unscheduledCount={unscheduledTasks.length}
        onCreateTask={() => {
          setPreselectedDateStr(currentDateKey);
          setIsCreateTaskOpen(true);
        }}
      />

      {/* 4. Filter Toolbar (collapsible or active) */}
      {(isFilterOpen || activeFilterCount > 0) && (
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
          blockedOnly={blockedOnly}
          onBlockedOnlyChange={setBlockedOnly}
          completedOnly={completedOnly}
          onCompletedOnlyChange={setCompletedOnly}
          unassignedOnly={unassignedOnly}
          onUnassignedOnlyChange={setUnassignedOnly}
          onClearFilters={handleClearFilters}
          totalCount={effectiveTasks.length}
          filteredCount={filteredTasks.length}
        />
      )}

      {/* 5. Optional Workload Panel */}
      {isWorkloadOpen && (
        <TeamTasksWorkloadPanel
          tasks={effectiveTasks}
          selectedMemberId={selectedMemberId}
          onSelectMember={(id) => setSelectedMemberId(id)}
          onClose={() => setIsWorkloadOpen(false)}
        />
      )}

      {/* 6. Optional Unscheduled Tasks Panel */}
      {isUnscheduledOpen && (
        <TeamTasksUnscheduledPanel
          tasks={effectiveTasks}
          onSelectTask={(task) => {
            setSelectedTask(task);
            setIsDetailOpen(true);
          }}
          onScheduleTask={(task) => setRescheduleTaskTarget(task)}
          onClose={() => setIsUnscheduledOpen(false)}
        />
      )}

      {/* 7. Main Calendar View */}
      {viewMode === 'MONTH' && (
        <TeamTasksMonthGrid
          currentDate={currentDate}
          tasks={filteredTasks}
          onSelectTask={(task) => {
            setSelectedTask(task);
            setIsDetailOpen(true);
          }}
          onSelectDate={(date) => {
            setCurrentDate(date);
            setViewMode('DAY');
          }}
          onCreateTaskForDate={(dateStr) => {
            setPreselectedDateStr(dateStr);
            setIsCreateTaskOpen(true);
          }}
        />
      )}

      {viewMode === 'WEEK' && (
        <TeamTasksWeekGrid
          currentDate={currentDate}
          tasks={filteredTasks}
          onSelectTask={(task) => {
            setSelectedTask(task);
            setIsDetailOpen(true);
          }}
          onSelectDate={(date) => {
            setCurrentDate(date);
            setViewMode('DAY');
          }}
          onCreateTaskForDate={(dateStr) => {
            setPreselectedDateStr(dateStr);
            setIsCreateTaskOpen(true);
          }}
        />
      )}

      {viewMode === 'DAY' && (
        <TeamTasksDayGrid
          currentDate={currentDate}
          tasks={filteredTasks}
          onSelectTask={(task) => {
            setSelectedTask(task);
            setIsDetailOpen(true);
          }}
          onCreateTaskForDate={(dateStr) => {
            setPreselectedDateStr(dateStr);
            setIsCreateTaskOpen(true);
          }}
          onRescheduleTask={(task) => setRescheduleTaskTarget(task)}
          onCompleteTask={(task) => setCompleteTaskTarget(task)}
        />
      )}

      {viewMode === 'AGENDA' && (
        <TeamTasksAgendaView
          tasks={filteredTasks}
          onSelectTask={(task) => {
            setSelectedTask(task);
            setIsDetailOpen(true);
          }}
          onRescheduleTask={(task) => setRescheduleTaskTarget(task)}
          onCompleteTask={(task) => setCompleteTaskTarget(task)}
          onCreateTask={() => setIsCreateTaskOpen(true)}
        />
      )}

      {/* Legacy / Compatibility Accordion Section (when viewMode is BY_MEMBER) */}
      {viewMode === 'BY_MEMBER' && calendarApiData?.members && (
        <div className="space-y-3">
          {calendarApiData.members.map((group) => {
            const isExpanded = expandedMembers[group.profileId] ?? true;
            return (
              <MemberAccordionSection
                key={group.profileId}
                group={group}
                expanded={isExpanded}
                onToggle={() =>
                  setExpandedMembers((prev) => ({
                    ...prev,
                    [group.profileId]: prev[group.profileId] === undefined ? false : !prev[group.profileId],
                  }))
                }
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
        </div>
      )}

      {/* 8. Task Detail Drawer */}
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

      {/* 9. Reschedule Task Dialog */}
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

      {/* 10. Complete Task Dialog */}
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

      {/* 11. Block Task Dialog */}
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

      {/* 12. Create Task Dialog */}
      <CreateTaskDialog
        open={isCreateTaskOpen}
        onClose={() => {
          setIsCreateTaskOpen(false);
          setPreselectedDateStr(undefined);
          setPreselectedAssigneeId(undefined);
        }}
        onCreate={async (dto) => {
          await createTaskMutation.mutateAsync(dto);
        }}
        initialAssigneeId={preselectedAssigneeId}
        defaultDeadline={
          preselectedDateStr
            ? new Date(`${preselectedDateStr}T17:00:00.000Z`).toISOString()
            : new Date(`${currentDateKey}T17:00:00.000Z`).toISOString()
        }
      />
    </div>
  );
}
