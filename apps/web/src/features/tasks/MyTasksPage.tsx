import React, { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  TaskPriority,
  TaskStatus,
  type TaskItem,
  type CreateTaskDto,
  type RescheduleTaskDto,
  type BlockTaskDto,
  type CompleteTaskDto,
} from '@corviin-hub/shared';
import { useAppStore } from '@/lib/store';
import { useProfiles } from '@/hooks/useProfiles';
import { useWorkspaces } from '@/hooks/useWorkspaces';
import {
  fetchTasks,
  createTask,
  startWorkSession,
  pauseWorkSession,
  resumeWorkSession,
  completeTask,
  blockTask,
  rescheduleTask,
  addChecklistItem,
  toggleChecklistItem,
  addTaskComment,
  addTaskAttachment,
} from '@/services/tasks';
import { MyTasksHeader } from './components/MyTasksHeader';
import {
  MyTasksSummaryCards,
  type TaskSummaryFilterKey,
} from './components/MyTasksSummaryCards';
import {
  TaskFilterToolbar,
  type TaskFilterState,
  type DateFilterOption,
} from './components/TaskFilterToolbar';
import { TaskTableView } from './components/TaskTableView';
import { TaskKanbanBoard } from './components/TaskKanbanBoard';
import { TaskDateGroupedView } from './components/TaskDateGroupedView';
import { TaskDetailDrawer } from './components/TaskDetailDrawer';
import { CreateTaskDialog } from './components/CreateTaskDialog';
import { RescheduleTaskDialog } from './components/RescheduleTaskDialog';
import { BlockTaskDialog } from './components/BlockTaskDialog';
import { CompleteTaskDialog } from './components/CompleteTaskDialog';
import { Tabs } from '@/components/ui/Tabs';
import { isTaskOverdue, getTaskDateBucket } from './utils/task-utils';
import { List, Columns, Calendar, AlertCircle } from 'lucide-react';

type ViewMode = 'table' | 'board' | 'grouped';
type TaskTab = 'today' | 'upcoming' | 'overdue' | 'in_progress' | 'completed' | 'all';

export function MyTasksPage() {
  const queryClient = useQueryClient();
  const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);
  const selectedProfileId = useAppStore((s) => s.selectedProfileId);

  const { data: profiles = [] } = useProfiles();
  const { data: workspaces = [] } = useWorkspaces();

  const activeProfile = profiles.find((p) => p.id === selectedProfileId);
  const activeWorkspace = workspaces.find((w) => w.id === selectedWorkspaceId);

  // Quick Tabs & View Mode
  const [activeTab, setActiveTab] = useState<TaskTab>('today');
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  // Summary KPI Filter (Quick Filter)
  const [summaryFilter, setSummaryFilter] = useState<TaskSummaryFilterKey | null>(null);

  // Search & Filters State
  const [filters, setFilters] = useState<TaskFilterState>({
    search: '',
    status: 'ALL',
    priority: 'ALL',
    dateRange: 'ALL',
  });

  // Dialogs & Drawers
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [rescheduleTargetTask, setRescheduleTargetTask] = useState<TaskItem | null>(null);
  const [blockTargetTask, setBlockTargetTask] = useState<TaskItem | null>(null);
  const [completeTargetTask, setCompleteTargetTask] = useState<TaskItem | null>(null);

  // Fetch all tasks for acting profile in current workspace
  const {
    data: rawTasks = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['tasks', selectedWorkspaceId, selectedProfileId, { mine: true }],
    queryFn: () =>
      fetchTasks({
        mine: true,
      }),
    staleTime: 10_000,
  });

  // Client-side filtering ensures immediate UI responsiveness and consistent KPI calculations
  const filteredTasks = useMemo(() => {
    let result = rawTasks;

    // 1. KPI Summary Card Filter
    if (summaryFilter) {
      switch (summaryFilter) {
        case 'all_open':
          result = result.filter((t) => t.status !== 'COMPLETED' && t.status !== 'CANCELLED');
          break;
        case 'in_progress':
          result = result.filter((t) => t.status === 'IN_PROGRESS');
          break;
        case 'due_today':
          result = result.filter(
            (t) =>
              t.status !== 'COMPLETED' &&
              t.status !== 'CANCELLED' &&
              getTaskDateBucket(t) === 'Today',
          );
          break;
        case 'overdue':
          result = result.filter((t) => isTaskOverdue(t));
          break;
        case 'completed':
          result = result.filter((t) => t.status === 'COMPLETED');
          break;
        case 'blocked':
          result = result.filter((t) => t.status === 'BLOCKED');
          break;
      }
    }

    // 2. Search query filter
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q)) ||
          (t.linkedRecordTitle && t.linkedRecordTitle.toLowerCase().includes(q)),
      );
    }

    // 3. Status filter
    if (filters.status !== 'ALL') {
      result = result.filter((t) => t.status === filters.status);
    }

    // 4. Priority filter
    if (filters.priority !== 'ALL') {
      result = result.filter((t) => t.priority === filters.priority);
    }

    // 5. Date Range filter
    if (filters.dateRange !== 'ALL') {
      switch (filters.dateRange) {
        case 'TODAY':
          result = result.filter((t) => getTaskDateBucket(t) === 'Today');
          break;
        case 'TOMORROW':
          result = result.filter((t) => getTaskDateBucket(t) === 'Tomorrow');
          break;
        case 'OVERDUE':
          result = result.filter((t) => isTaskOverdue(t));
          break;
        case 'THIS_WEEK': {
          const now = new Date();
          const nextWeek = new Date(now.getTime() + 7 * 24 * 3600 * 1000);
          result = result.filter((t) => {
            if (!t.deadline) return false;
            const d = new Date(t.deadline);
            return d >= now && d <= nextWeek;
          });
          break;
        }
        case 'NEXT_WEEK': {
          const now = new Date();
          const in7Days = new Date(now.getTime() + 7 * 24 * 3600 * 1000);
          const in14Days = new Date(now.getTime() + 14 * 24 * 3600 * 1000);
          result = result.filter((t) => {
            if (!t.deadline) return false;
            const d = new Date(t.deadline);
            return d >= in7Days && d <= in14Days;
          });
          break;
        }
      }
    }

    return result;
  }, [rawTasks, summaryFilter, filters]);

  // Keep selectedTask in sync when tasks update
  React.useEffect(() => {
    if (selectedTask) {
      const updated = rawTasks.find((t) => t.id === selectedTask.id);
      if (updated) {
        setSelectedTask(updated);
      }
    }
  }, [rawTasks]);

  // Query Invalidation
  const invalidateTasks = () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  };

  // Quick Action Handlers
  const handleStartSession = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    await startWorkSession(id);
    invalidateTasks();
  };

  const handlePauseSession = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    await pauseWorkSession(id);
    invalidateTasks();
  };

  const handleResumeSession = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    await resumeWorkSession(id);
    invalidateTasks();
  };

  const handleOpenComplete = (task: TaskItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCompleteTargetTask(task);
  };

  const handleConfirmComplete = async (id: string, note?: string) => {
    await completeTask(id, { completionNote: note });
    invalidateTasks();
  };

  const handleOpenBlock = (task: TaskItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setBlockTargetTask(task);
  };

  const handleConfirmBlock = async (
    id: string,
    blockerReason: string,
    expectedResolutionDate?: string,
  ) => {
    await blockTask(id, { blockerReason, expectedResolutionDate });
    invalidateTasks();
  };

  const handleOpenReschedule = (task: TaskItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setRescheduleTargetTask(task);
  };

  const handleConfirmReschedule = async (
    id: string,
    newDeadline: string,
    reason: string,
    newPlannedStart?: string,
  ) => {
    await rescheduleTask(id, { newDeadline, newPlannedStart, reason });
    invalidateTasks();
  };

  const handleToggleChecklist = async (taskId: string, checklistId: string) => {
    await toggleChecklistItem(taskId, checklistId);
    invalidateTasks();
  };

  const handleAddChecklist = async (taskId: string, title: string) => {
    await addChecklistItem(taskId, title);
    invalidateTasks();
  };

  const handleAddComment = async (taskId: string, content: string) => {
    await addTaskComment(taskId, content);
    invalidateTasks();
  };

  const handleAddAttachment = async (taskId: string, file: any) => {
    await addTaskAttachment(taskId, file);
    invalidateTasks();
  };

  const handleSelectTask = (task: TaskItem) => {
    setSelectedTask(task);
    setIsDetailOpen(true);
  };

  const tabs = [
    { id: 'today', label: 'Today' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'overdue', label: 'Overdue' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
    { id: 'all', label: 'All Tasks' },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as TaskTab);
    if (tabId === 'today') {
      setSummaryFilter('due_today');
    } else if (tabId === 'upcoming') {
      setSummaryFilter(null);
      setFilters((f) => ({ ...f, dateRange: 'THIS_WEEK' }));
    } else if (tabId === 'overdue') {
      setSummaryFilter('overdue');
    } else if (tabId === 'in_progress') {
      setSummaryFilter('in_progress');
    } else if (tabId === 'completed') {
      setSummaryFilter('completed');
    } else {
      setSummaryFilter(null);
      setFilters((f) => ({ ...f, dateRange: 'ALL' }));
    }
  };

  const handleResetFilters = () => {
    setActiveTab('all');
    setSummaryFilter(null);
    setFilters({
      search: '',
      status: 'ALL',
      priority: 'ALL',
      dateRange: 'ALL',
    });
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 pb-16">
      {/* 1. Page Header */}
      <MyTasksHeader
        workspaceName={activeWorkspace?.name}
        profileName={activeProfile?.displayName}
        profileInitials={activeProfile?.initials}
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
        onCreateTask={() => setIsCreateOpen(true)}
      />

      {/* Tabs */}
      <div className="border-b border-ch-border">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          className="border-b-0"
        />
      </div>

      {/* 2. Personal Task Summary (6 KPI Cards) */}
      <MyTasksSummaryCards
        tasks={rawTasks}
        activeFilter={summaryFilter}
        onSelectFilter={(key) => {
          if (summaryFilter === key) {
            setSummaryFilter(null); // toggle off
          } else {
            setSummaryFilter(key);
          }
        }}
      />

      {/* 3. Search and Filters Toolbar */}
      <TaskFilterToolbar
        filters={filters}
        onFilterChange={setFilters}
        onReset={handleResetFilters}
        totalResults={filteredTasks.length}
      />

      {/* 4. View Switcher Header Strip */}
      <div className="flex items-center justify-between border-b border-ch-border pb-2 pt-1">
        <div className="text-xs text-ch-text-secondary font-medium">
          Showing <span className="font-bold text-ch-text-primary">{filteredTasks.length}</span>{' '}
          {filteredTasks.length === 1 ? 'task' : 'tasks'}
          {summaryFilter && (
            <span className="ml-2 inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 font-semibold">
              Filter: {summaryFilter.replace('_', ' ')}
              <button
                type="button"
                onClick={() => setSummaryFilter(null)}
                className="hover:opacity-75"
              >
                ×
              </button>
            </span>
          )}
        </div>

        {/* View Switcher Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded text-xs flex items-center gap-1.5 border transition-none ${
              viewMode === 'table'
                ? 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800 font-semibold'
                : 'bg-surface text-ch-text-secondary border-ch-border hover:bg-surface-muted'
            }`}
            title="List Table View"
          >
            <List size={14} />
            <span className="hidden sm:inline">List</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('board')}
            className={`p-1.5 rounded text-xs flex items-center gap-1.5 border transition-none ${
              viewMode === 'board'
                ? 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800 font-semibold'
                : 'bg-surface text-ch-text-secondary border-ch-border hover:bg-surface-muted'
            }`}
            title="Kanban Board View"
          >
            <Columns size={14} />
            <span className="hidden sm:inline">Board</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('grouped')}
            className={`p-1.5 rounded text-xs flex items-center gap-1.5 border transition-none ${
              viewMode === 'grouped'
                ? 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800 font-semibold'
                : 'bg-surface text-ch-text-secondary border-ch-border hover:bg-surface-muted'
            }`}
            title="Date Grouped View"
          >
            <Calendar size={14} />
            <span className="hidden sm:inline">By Date</span>
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-3 py-6">
          <div className="h-10 bg-surface-muted rounded border border-ch-border animate-pulse" />
          <div className="h-16 bg-surface-muted rounded border border-ch-border animate-pulse" />
          <div className="h-16 bg-surface-muted rounded border border-ch-border animate-pulse" />
        </div>
      )}

      {/* Error State */}
      {isError && !isLoading && (
        <div className="p-6 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900/60 text-center space-y-2">
          <AlertCircle size={24} className="mx-auto text-red-600 dark:text-red-400" />
          <h3 className="text-sm font-semibold text-red-800 dark:text-red-300">
            Unable to load tasks
          </h3>
          <p className="text-xs text-red-600 dark:text-red-400">
            There was an error communicating with the task service. Please try again.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-2 px-3 py-1.5 rounded text-xs font-semibold bg-red-600 text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* 5. Main Task Content (Views) */}
      {!isLoading && !isError && (
        <>
          {viewMode === 'table' && (
            <TaskTableView
              tasks={filteredTasks}
              onSelectTask={handleSelectTask}
              onStart={handleStartSession}
              onPause={handlePauseSession}
              onResume={handleResumeSession}
              onComplete={handleOpenComplete}
              onReschedule={handleOpenReschedule}
              onBlock={handleOpenBlock}
              onCreateTask={() => setIsCreateOpen(true)}
            />
          )}

          {viewMode === 'board' && (
            <TaskKanbanBoard
              tasks={filteredTasks}
              onSelectTask={handleSelectTask}
              onStart={handleStartSession}
              onPause={handlePauseSession}
              onResume={handleResumeSession}
              onComplete={handleOpenComplete}
              onReschedule={handleOpenReschedule}
              onBlock={handleOpenBlock}
            />
          )}

          {viewMode === 'grouped' && (
            <TaskDateGroupedView
              tasks={filteredTasks}
              onSelectTask={handleSelectTask}
              onStart={handleStartSession}
              onPause={handlePauseSession}
              onResume={handleResumeSession}
              onComplete={handleOpenComplete}
              onReschedule={handleOpenReschedule}
              onBlock={handleOpenBlock}
            />
          )}
        </>
      )}

      {/* 6. Task Detail Drawer */}
      <TaskDetailDrawer
        task={selectedTask}
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onStartSession={handleStartSession}
        onPauseSession={handlePauseSession}
        onResumeSession={handleResumeSession}
        onOpenCompleteModal={handleOpenComplete}
        onOpenBlockModal={handleOpenBlock}
        onOpenRescheduleModal={handleOpenReschedule}
        onToggleChecklist={handleToggleChecklist}
        onAddChecklist={handleAddChecklist}
        onAddComment={handleAddComment}
        onAddAttachment={handleAddAttachment}
      />

      {/* 7. Dialogs */}
      <CreateTaskDialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreateTask={async (dto) => {
          await createTask({
            ...dto,
            assigneeId: selectedProfileId || dto.assigneeId,
          });
          invalidateTasks();
        }}
        preselectedAssigneeId={selectedProfileId}
      />

      <RescheduleTaskDialog
        task={rescheduleTargetTask}
        open={Boolean(rescheduleTargetTask)}
        onClose={() => setRescheduleTargetTask(null)}
        onConfirm={handleConfirmReschedule}
      />

      <BlockTaskDialog
        task={blockTargetTask}
        open={Boolean(blockTargetTask)}
        onClose={() => setBlockTargetTask(null)}
        onConfirm={handleConfirmBlock}
      />

      <CompleteTaskDialog
        task={completeTargetTask}
        open={Boolean(completeTargetTask)}
        onClose={() => setCompleteTargetTask(null)}
        onConfirm={handleConfirmComplete}
      />
    </div>
  );
}
