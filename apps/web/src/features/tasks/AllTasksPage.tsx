import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  TaskPriority,
  TaskStatus,
  type TaskItem,
  type CreateTaskDto,
  type BulkTaskActionDto,
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
  bulkTaskAction,
} from '@/services/tasks';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Tabs } from '@/components/ui/Tabs';
import { AllTasksTableView } from './components/AllTasksTableView';
import { TaskKanbanBoard } from './components/TaskKanbanBoard';
import { TaskCalendarView } from './components/TaskCalendarView';
import { TaskByMemberView } from './components/TaskByMemberView';
import { BulkActionBar } from './components/BulkActionBar';
import { TaskDetailDrawer } from './components/TaskDetailDrawer';
import { CreateTaskDialog } from './components/CreateTaskDialog';
import { RescheduleTaskDialog } from './components/RescheduleTaskDialog';
import { BlockTaskDialog } from './components/BlockTaskDialog';
import { CompleteTaskDialog } from './components/CompleteTaskDialog';
import {
  Plus,
  Search,
  RotateCcw,
  List,
  Columns,
  Calendar,
  Users,
} from 'lucide-react';

type QuickTab = 'all' | 'open' | 'mine' | 'overdue' | 'in_progress' | 'completed';
type ViewMode = 'table' | 'kanban' | 'calendar' | 'members';

export function AllTasksPage() {
  const queryClient = useQueryClient();
  const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);
  const selectedProfileId = useAppStore((s) => s.selectedProfileId);

  const { data: profiles = [] } = useProfiles();
  const { data: workspaces = [] } = useWorkspaces();

  const activeWorkspace = workspaces.find((w) => w.id === selectedWorkspaceId);

  // View & Filters State
  const [activeTab, setActiveTab] = useState<QuickTab>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Multi-select & Bulk operations state
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  // Dialogs & Drawer State
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [rescheduleTargetTask, setRescheduleTargetTask] = useState<TaskItem | null>(null);
  const [blockTargetTask, setBlockTargetTask] = useState<TaskItem | null>(null);
  const [completeTargetTask, setCompleteTargetTask] = useState<TaskItem | null>(null);

  // Compute effective filters
  const isMineFilter = activeTab === 'mine';
  const effectiveAssigneeId = isMineFilter
    ? selectedProfileId || undefined
    : selectedAssigneeId !== 'ALL'
    ? selectedAssigneeId
    : undefined;

  const effectiveStatus =
    activeTab === 'in_progress'
      ? TaskStatus.IN_PROGRESS
      : activeTab === 'completed'
      ? TaskStatus.COMPLETED
      : selectedStatus !== 'ALL'
      ? (selectedStatus as TaskStatus)
      : undefined;

  const tabParam =
    activeTab === 'overdue' ? 'overdue' : activeTab === 'open' ? 'all' : undefined;

  // Fetch Tasks for Active Workspace
  const {
    data: allFetchedTasks = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      'tasks',
      selectedWorkspaceId,
      {
        scope: 'all_tasks',
        tab: activeTab,
        assigneeId: effectiveAssigneeId,
        status: effectiveStatus,
        priority: selectedPriority !== 'ALL' ? selectedPriority : undefined,
        search: searchQuery.trim() || undefined,
      },
    ],
    queryFn: () =>
      fetchTasks({
        mine: false,
        tab: tabParam,
        assigneeId: effectiveAssigneeId,
        status: effectiveStatus,
        priority: selectedPriority !== 'ALL' ? (selectedPriority as TaskPriority) : undefined,
        search: searchQuery.trim() || undefined,
      }),
    staleTime: 10_000,
  });

  // Client-side open filter refinement if tab is 'open'
  const tasks = activeTab === 'open'
    ? allFetchedTasks.filter((t) => t.status !== TaskStatus.COMPLETED && t.status !== TaskStatus.CANCELLED)
    : allFetchedTasks;

  // Keep selectedTask in sync when tasks update
  React.useEffect(() => {
    if (selectedTask) {
      const updated = tasks.find((t) => t.id === selectedTask.id);
      if (updated) {
        setSelectedTask(updated);
      }
    }
  }, [tasks]);

  // Invalidation
  const invalidateTasks = () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  };

  // Selection handlers
  const handleToggleSelectTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTaskIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedTaskIds.length === tasks.length) {
      setSelectedTaskIds([]);
    } else {
      setSelectedTaskIds(tasks.map((t) => t.id));
    }
  };

  const handleClearSelection = () => {
    setSelectedTaskIds([]);
  };

  // Bulk operation actions
  const handleBulkReassign = async (targetAssigneeId: string) => {
    if (selectedTaskIds.length === 0) return;
    await bulkTaskAction({
      taskIds: selectedTaskIds,
      action: 'reassign',
      assigneeId: targetAssigneeId,
    });
    setSelectedTaskIds([]);
    invalidateTasks();
  };

  const handleBulkSetPriority = async (priority: TaskPriority) => {
    if (selectedTaskIds.length === 0) return;
    await bulkTaskAction({
      taskIds: selectedTaskIds,
      action: 'set_priority',
      priority,
    });
    setSelectedTaskIds([]);
    invalidateTasks();
  };

  const handleBulkComplete = async () => {
    if (selectedTaskIds.length === 0) return;
    await bulkTaskAction({
      taskIds: selectedTaskIds,
      action: 'complete',
      completionNote: 'Completed via workspace bulk operation',
    });
    setSelectedTaskIds([]);
    invalidateTasks();
  };

  // Work session controls
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

  const handleConfirmBlock = async (id: string, blockerReason: string, expectedResolutionDate?: string) => {
    await blockTask(id, { blockerReason, expectedResolutionDate });
    invalidateTasks();
  };

  const handleOpenReschedule = (task: TaskItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setRescheduleTargetTask(task);
  };

  const handleConfirmReschedule = async (id: string, newDeadline: string, reason: string, newPlannedStart?: string) => {
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

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedAssigneeId('ALL');
    setSelectedPriority('ALL');
    setSelectedStatus('ALL');
    setActiveTab('all');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedAssigneeId !== 'ALL' ||
    selectedPriority !== 'ALL' ||
    selectedStatus !== 'ALL' ||
    activeTab !== 'all';

  // Tabs configuration
  const quickTabs = [
    { id: 'all', label: 'All Tasks' },
    { id: 'open', label: 'Open' },
    { id: 'mine', label: 'My Tasks' },
    { id: 'overdue', label: 'Overdue' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/app/dashboard' },
              { label: 'Tasks', href: '/app/tasks' },
              { label: 'All Tasks' },
            ]}
          />
          <h1 className="text-2xl font-bold text-ch-text-primary tracking-tight mt-1">
            All Tasks
          </h1>
          <p className="text-xs text-ch-text-secondary mt-0.5">
            Central task register and workload management across{' '}
            <span className="font-semibold text-ch-text-primary">
              {activeWorkspace?.name || 'Current Workspace'}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            onClick={() => setIsCreateOpen(true)}
            className="w-full sm:w-auto"
          >
            <Plus size={16} className="mr-1.5" />
            Create Task
          </Button>
        </div>
      </div>

      {/* Tabs & View Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-ch-border">
        <Tabs
          tabs={quickTabs}
          activeTab={activeTab}
          onTabChange={(id) => setActiveTab(id as QuickTab)}
          className="border-b-0"
        />

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 self-end md:self-auto pb-2 md:pb-0">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            title="List / Table View"
            className={`p-1.5 rounded text-xs flex items-center gap-1 border ${
              viewMode === 'table'
                ? 'bg-surface-muted text-ch-text-primary border-ch-border-strong font-semibold'
                : 'text-ch-text-secondary border-transparent hover:bg-surface-muted'
            }`}
          >
            <List size={15} />
            <span className="hidden sm:inline">Table</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('kanban')}
            title="Kanban Board View"
            className={`p-1.5 rounded text-xs flex items-center gap-1 border ${
              viewMode === 'kanban'
                ? 'bg-surface-muted text-ch-text-primary border-ch-border-strong font-semibold'
                : 'text-ch-text-secondary border-transparent hover:bg-surface-muted'
            }`}
          >
            <Columns size={15} />
            <span className="hidden sm:inline">Kanban</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('calendar')}
            title="Calendar / Agenda View"
            className={`p-1.5 rounded text-xs flex items-center gap-1 border ${
              viewMode === 'calendar'
                ? 'bg-surface-muted text-ch-text-primary border-ch-border-strong font-semibold'
                : 'text-ch-text-secondary border-transparent hover:bg-surface-muted'
            }`}
          >
            <Calendar size={15} />
            <span className="hidden sm:inline">Calendar</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('members')}
            title="By Member Workload View"
            className={`p-1.5 rounded text-xs flex items-center gap-1 border ${
              viewMode === 'members'
                ? 'bg-surface-muted text-ch-text-primary border-ch-border-strong font-semibold'
                : 'text-ch-text-secondary border-transparent hover:bg-surface-muted'
            }`}
          >
            <Users size={15} />
            <span className="hidden sm:inline">By Member</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-surface p-3 rounded-lg border border-ch-border flex flex-wrap items-center gap-2.5 text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ch-text-muted" />
          <Input
            placeholder="Search tasks across entire workspace..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>

        {/* Assignee Filter */}
        <div className="w-40">
          <Select
            value={selectedAssigneeId}
            onChange={(e) => setSelectedAssigneeId(e.target.value)}
            className="h-8 text-xs"
            disabled={activeTab === 'mine'}
            options={[
              { value: 'ALL', label: 'All Assignees' },
              ...profiles.map((p) => ({
                value: p.id,
                label: p.displayName,
              })),
            ]}
          />
        </div>

        {/* Priority Filter */}
        <div className="w-36">
          <Select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="h-8 text-xs"
            options={[
              { value: 'ALL', label: 'All Priorities' },
              { value: TaskPriority.URGENT, label: 'Urgent' },
              { value: TaskPriority.HIGH, label: 'High' },
              { value: TaskPriority.MEDIUM, label: 'Medium' },
              { value: TaskPriority.LOW, label: 'Low' },
            ]}
          />
        </div>

        {/* Status Filter */}
        <div className="w-36">
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-8 text-xs"
            disabled={activeTab === 'in_progress' || activeTab === 'completed'}
            options={[
              { value: 'ALL', label: 'All Statuses' },
              { value: TaskStatus.TODO, label: 'To Do' },
              { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
              { value: TaskStatus.ON_HOLD, label: 'On Hold' },
              { value: TaskStatus.BLOCKED, label: 'Blocked' },
              { value: TaskStatus.COMPLETED, label: 'Completed' },
            ]}
          />
        </div>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className="h-8 px-2 text-xs text-ch-text-secondary hover:text-ch-text-primary"
            title="Reset filters"
          >
            <RotateCcw size={13} className="mr-1" />
            Reset
          </Button>
        )}
      </div>

      {/* Floating Bulk Operations Toolbar */}
      {selectedTaskIds.length > 0 && (
        <BulkActionBar
          selectedCount={selectedTaskIds.length}
          onClearSelection={handleClearSelection}
          onBulkReassign={handleBulkReassign}
          onBulkSetPriority={handleBulkSetPriority}
          onBulkComplete={handleBulkComplete}
        />
      )}

      {/* Main Views */}
      {isLoading ? (
        <div className="text-center py-16 bg-surface rounded-lg border border-ch-border">
          <p className="text-xs text-ch-text-secondary">Loading workspace tasks...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-12 bg-surface rounded-lg border border-danger/30 text-danger text-xs">
          <p className="font-semibold">Unable to load tasks for this workspace.</p>
          <Button variant="secondary" size="sm" onClick={() => refetch()} className="mt-3">
            Retry
          </Button>
        </div>
      ) : (
        <>
          {viewMode === 'table' && (
            <AllTasksTableView
              tasks={tasks}
              selectedTaskIds={selectedTaskIds}
              onToggleSelectTask={handleToggleSelectTask}
              onToggleSelectAll={handleToggleSelectAll}
              onSelectTask={handleSelectTask}
              onStart={handleStartSession}
              onPause={handlePauseSession}
              onResume={handleResumeSession}
              onComplete={handleOpenComplete}
              onReschedule={handleOpenReschedule}
              onBlock={handleOpenBlock}
            />
          )}

          {viewMode === 'kanban' && (
            <TaskKanbanBoard
              tasks={tasks}
              onSelectTask={handleSelectTask}
              onStart={handleStartSession}
              onPause={handlePauseSession}
              onResume={handleResumeSession}
              onComplete={handleOpenComplete}
              onReschedule={handleOpenReschedule}
              onBlock={handleOpenBlock}
            />
          )}

          {viewMode === 'calendar' && (
            <TaskCalendarView
              tasks={tasks}
              onSelectTask={handleSelectTask}
              onStart={handleStartSession}
              onPause={handlePauseSession}
              onResume={handleResumeSession}
              onComplete={handleOpenComplete}
            />
          )}

          {viewMode === 'members' && (
            <TaskByMemberView
              tasks={tasks}
              profiles={profiles}
              onSelectTask={handleSelectTask}
              onStart={handleStartSession}
              onPause={handlePauseSession}
              onResume={handleResumeSession}
              onComplete={handleOpenComplete}
              onReschedule={handleOpenReschedule}
              onBlock={handleOpenBlock}
              onCreateTaskForMember={(memberId) => {
                setIsCreateOpen(true);
              }}
            />
          )}
        </>
      )}

      {/* Task Detail Drawer */}
      <TaskDetailDrawer
        task={selectedTask}
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onStartSession={handleStartSession}
        onPauseSession={handlePauseSession}
        onResumeSession={handleResumeSession}
        onOpenCompleteModal={(task) => setCompleteTargetTask(task)}
        onOpenBlockModal={(task) => setBlockTargetTask(task)}
        onOpenRescheduleModal={(task) => setRescheduleTargetTask(task)}
        onToggleChecklist={handleToggleChecklist}
        onAddChecklist={handleAddChecklist}
        onAddComment={handleAddComment}
        onAddAttachment={handleAddAttachment}
      />

      {/* Create Task Dialog */}
      <CreateTaskDialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={async (dto: CreateTaskDto) => {
          await createTask(dto);
          invalidateTasks();
        }}
      />

      {/* Reschedule Task Dialog */}
      <RescheduleTaskDialog
        task={rescheduleTargetTask}
        open={!!rescheduleTargetTask}
        onClose={() => setRescheduleTargetTask(null)}
        onReschedule={handleConfirmReschedule}
      />

      {/* Block Task Dialog */}
      <BlockTaskDialog
        task={blockTargetTask}
        open={!!blockTargetTask}
        onClose={() => setBlockTargetTask(null)}
        onBlock={handleConfirmBlock}
      />

      {/* Complete Task Dialog */}
      <CompleteTaskDialog
        task={completeTargetTask}
        open={!!completeTargetTask}
        onClose={() => setCompleteTargetTask(null)}
        onComplete={handleConfirmComplete}
      />
    </div>
  );
}
