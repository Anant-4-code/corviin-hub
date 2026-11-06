import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Tabs } from '@/components/ui/Tabs';
import { TaskTableView } from './components/TaskTableView';
import { TaskKanbanBoard } from './components/TaskKanbanBoard';
import { TaskDateGroupedView } from './components/TaskDateGroupedView';
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
  Filter,
} from 'lucide-react';

type TaskTab = 'today' | 'upcoming' | 'overdue' | 'in_progress' | 'completed' | 'all';
type ViewMode = 'table' | 'grouped' | 'board';

export function MyTasksPage() {
  const queryClient = useQueryClient();
  const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);
  const selectedProfileId = useAppStore((s) => s.selectedProfileId);

  const { data: profiles } = useProfiles();
  const { data: workspaces } = useWorkspaces();

  const activeProfile = profiles?.find((p) => p.id === selectedProfileId);
  const activeWorkspace = workspaces?.find((w) => w.id === selectedWorkspaceId);

  // Filters & State
  const [activeTab, setActiveTab] = useState<TaskTab>('today');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Modals & Drawer State
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [rescheduleTargetTask, setRescheduleTargetTask] = useState<TaskItem | null>(null);
  const [blockTargetTask, setBlockTargetTask] = useState<TaskItem | null>(null);
  const [completeTargetTask, setCompleteTargetTask] = useState<TaskItem | null>(null);

  // Fetch Tasks for Active Workspace & Profile
  const {
    data: tasks = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      'tasks',
      selectedWorkspaceId,
      selectedProfileId,
      {
        mine: true,
        tab: activeTab,
        status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
        priority: selectedPriority !== 'ALL' ? selectedPriority : undefined,
        search: searchQuery.trim() || undefined,
      },
    ],
    queryFn: () =>
      fetchTasks({
        mine: true,
        tab: activeTab,
        status: selectedStatus !== 'ALL' ? (selectedStatus as TaskStatus) : undefined,
        priority: selectedPriority !== 'ALL' ? (selectedPriority as TaskPriority) : undefined,
        search: searchQuery.trim() || undefined,
      }),
    staleTime: 10_000,
  });

  // Keep selectedTask in sync when tasks update
  React.useEffect(() => {
    if (selectedTask) {
      const updated = tasks.find((t) => t.id === selectedTask.id);
      if (updated) {
        setSelectedTask(updated);
      }
    }
  }, [tasks]);

  // Mutations
  const invalidateTasks = () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  };

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
    setSelectedPriority('ALL');
    setSelectedStatus('ALL');
  };

  const hasActiveFilters = searchQuery !== '' || selectedPriority !== 'ALL' || selectedStatus !== 'ALL';

  // Tab definitions
  const tabs = [
    { id: 'today', label: 'Today' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'overdue', label: 'Overdue' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
    { id: 'all', label: 'All Tasks' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/app/dashboard' },
              { label: 'Tasks', href: '/app/tasks' },
              { label: 'My Tasks' },
            ]}
          />
          <h1 className="text-2xl font-bold text-ch-text-primary tracking-tight mt-1">
            My Tasks
          </h1>
          <p className="text-xs text-ch-text-secondary mt-0.5">
            Personal operational queue for{' '}
            <span className="font-semibold text-ch-text-primary">
              {activeProfile?.displayName || 'Active Profile'}
            </span>{' '}
            in{' '}
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
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(id) => setActiveTab(id as TaskTab)}
          className="border-b-0"
        />

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 self-end md:self-auto pb-2 md:pb-0">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            title="Compact Table View"
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
            onClick={() => setViewMode('grouped')}
            title="Date Grouped View"
            className={`p-1.5 rounded text-xs flex items-center gap-1 border ${
              viewMode === 'grouped'
                ? 'bg-surface-muted text-ch-text-primary border-ch-border-strong font-semibold'
                : 'text-ch-text-secondary border-transparent hover:bg-surface-muted'
            }`}
          >
            <Calendar size={15} />
            <span className="hidden sm:inline">By Date</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('board')}
            title="Kanban Board View"
            className={`p-1.5 rounded text-xs flex items-center gap-1 border ${
              viewMode === 'board'
                ? 'bg-surface-muted text-ch-text-primary border-ch-border-strong font-semibold'
                : 'text-ch-text-secondary border-transparent hover:bg-surface-muted'
            }`}
          >
            <Columns size={15} />
            <span className="hidden sm:inline">Board</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-surface p-3 rounded-lg border border-ch-border flex flex-wrap items-center gap-2.5 text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ch-text-muted" />
          <Input
            placeholder="Search tasks by title or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-xs"
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

      {/* Main Task List Views */}
      {isLoading ? (
        <div className="text-center py-16 bg-surface rounded-lg border border-ch-border">
          <p className="text-xs text-ch-text-secondary">Loading operational tasks...</p>
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
            <TaskTableView
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

          {viewMode === 'grouped' && (
            <TaskDateGroupedView
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

          {viewMode === 'board' && (
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
