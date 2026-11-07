import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { TaskItem, TaskPriority, TaskStatus } from '@corviin-hub/shared';
import { TaskCard } from '@/features/tasks/components/TaskCard';
import { TaskTableView } from '@/features/tasks/components/TaskTableView';
import { TaskKanbanBoard } from '@/features/tasks/components/TaskKanbanBoard';
import { RescheduleTaskDialog } from '@/features/tasks/components/RescheduleTaskDialog';
import { BlockTaskDialog } from '@/features/tasks/components/BlockTaskDialog';
import { CompleteTaskDialog } from '@/features/tasks/components/CompleteTaskDialog';
import { TaskDetailDrawer } from '@/features/tasks/components/TaskDetailDrawer';
import { MyTasksPage } from '@/features/tasks/MyTasksPage';

const mockTask: TaskItem = {
  id: 'task-001',
  workspaceId: 'ws-tech-0001-0000-000000000001',
  title: 'Audit Postgres schema indexes',
  description: 'Review index utilization for tenant foreign keys and queries.',
  status: TaskStatus.TODO,
  priority: TaskPriority.HIGH,
  creatorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  creatorName: 'Anant',
  assigneeId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  assigneeName: 'Anant',
  deadline: new Date(Date.now() + 86400000).toISOString(),
  checklist: [
    { id: 'chk-1', title: 'Run pg_stat_user_indexes', completed: true },
    { id: 'chk-2', title: 'Verify composite index on workspace_id', completed: false },
  ],
  workSessions: [
    {
      id: 'ws-1',
      actorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      actorName: 'Anant',
      startedAt: new Date(Date.now() - 3600000).toISOString(),
      endedAt: new Date(Date.now() - 1800000).toISOString(),
      durationSeconds: 1800,
    },
  ],
  rescheduleHistory: [
    {
      id: 'rs-1',
      oldDeadline: new Date(Date.now() - 86400000).toISOString(),
      newDeadline: new Date(Date.now() + 86400000).toISOString(),
      reason: 'Shifted deadline due to migration dependency',
      actorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      actorName: 'Anant',
      timestamp: new Date().toISOString(),
    },
  ],
  comments: [
    {
      id: 'c-1',
      authorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      authorName: 'Anant',
      content: 'Initial index scan completed.',
      createdAt: new Date().toISOString(),
    },
  ],
  attachments: [
    {
      id: 'att-1',
      name: 'index_report.pdf',
      url: '/files/index_report.pdf',
      size: 1048576,
      type: 'document',
      uploadedAt: new Date().toISOString(),
    },
  ],
  activity: [
    {
      id: 'act-1',
      action: 'Task created',
      actorName: 'Anant',
      timestamp: new Date().toISOString(),
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
}

describe('My Tasks Components and Views', () => {
  it('TaskCard renders title, status, priority, and Start button for TODO task', () => {
    const onStart = vi.fn();
    const onClick = vi.fn();

    render(
      <TaskCard
        task={mockTask}
        onClick={onClick}
        onStart={onStart}
        onPause={vi.fn()}
        onResume={vi.fn()}
        onComplete={vi.fn()}
        onReschedule={vi.fn()}
        onBlock={vi.fn()}
      />,
    );

    expect(screen.getAllByText('Audit Postgres schema indexes').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('1/2 subtasks')).toBeInTheDocument();

    const startBtn = screen.getByRole('button', { name: /start/i });
    expect(startBtn).toBeInTheDocument();
    fireEvent.click(startBtn);
    expect(onStart).toHaveBeenCalledWith(mockTask.id, expect.anything());
  });

  it('TaskCard renders Pause and Complete buttons for IN_PROGRESS task', () => {
    const inProgressTask: TaskItem = { ...mockTask, status: TaskStatus.IN_PROGRESS };
    const onPause = vi.fn();
    const onComplete = vi.fn();

    render(
      <TaskCard
        task={inProgressTask}
        onClick={vi.fn()}
        onStart={vi.fn()}
        onPause={onPause}
        onResume={vi.fn()}
        onComplete={onComplete}
        onReschedule={vi.fn()}
        onBlock={vi.fn()}
      />,
    );

    const pauseBtn = screen.getByRole('button', { name: /pause/i });
    const completeBtn = screen.getByRole('button', { name: /complete/i });
    expect(pauseBtn).toBeInTheDocument();
    expect(completeBtn).toBeInTheDocument();

    fireEvent.click(pauseBtn);
    expect(onPause).toHaveBeenCalledWith(inProgressTask.id, expect.anything());

    fireEvent.click(completeBtn);
    expect(onComplete).toHaveBeenCalledWith(inProgressTask, expect.anything());
  });

  it('TaskTableView renders tasks in compact tabular format', () => {
    const onSelectTask = vi.fn();
    render(
      <TaskTableView
        tasks={[mockTask]}
        onSelectTask={onSelectTask}
        onStart={vi.fn()}
        onPause={vi.fn()}
        onResume={vi.fn()}
        onComplete={vi.fn()}
        onReschedule={vi.fn()}
        onBlock={vi.fn()}
      />,
    );

    expect(screen.getAllByText('Audit Postgres schema indexes').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Task Details')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Priority')).toBeInTheDocument();
    expect(screen.getByText('Deadline')).toBeInTheDocument();
  });

  it('TaskKanbanBoard categorizes tasks into 4 kanban columns', () => {
    const tasks: TaskItem[] = [
      { ...mockTask, id: 't1', status: TaskStatus.TODO },
      { ...mockTask, id: 't2', status: TaskStatus.IN_PROGRESS },
      { ...mockTask, id: 't3', status: TaskStatus.ON_HOLD },
      { ...mockTask, id: 't4', status: TaskStatus.COMPLETED },
    ];

    render(
      <TaskKanbanBoard
        tasks={tasks}
        onSelectTask={vi.fn()}
        onStart={vi.fn()}
        onPause={vi.fn()}
        onResume={vi.fn()}
        onComplete={vi.fn()}
        onReschedule={vi.fn()}
        onBlock={vi.fn()}
      />,
    );

    expect(screen.getByRole('heading', { name: 'To Do' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'In Progress' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'On Hold' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Blocked' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Completed' })).toBeInTheDocument();
  });

  it('RescheduleTaskDialog enforces required reason and submits new deadline', async () => {
    const onReschedule = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();

    render(
      <RescheduleTaskDialog
        task={mockTask}
        open={true}
        onClose={onClose}
        onReschedule={onReschedule}
      />,
    );

    expect(screen.getByText(/Rescheduling task/i)).toBeInTheDocument();

    // Reason input
    const reasonInput = screen.getByPlaceholderText(/Explain why this deadline is changing/i);
    fireEvent.change(reasonInput, { target: { value: 'Client requested architectural delay' } });

    const submitBtn = screen.getByRole('button', { name: /save new schedule/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(onReschedule).toHaveBeenCalledWith(
        mockTask.id,
        expect.any(String),
        'Client requested architectural delay',
        undefined,
      );
    });
  });

  it('BlockTaskDialog submits blocker reason', async () => {
    const onBlock = vi.fn().mockResolvedValue(undefined);

    render(
      <BlockTaskDialog
        task={mockTask}
        open={true}
        onClose={vi.fn()}
        onBlock={onBlock}
      />,
    );

    const reasonInput = screen.getByPlaceholderText(/Describe the blocker/i);
    fireEvent.change(reasonInput, { target: { value: 'Awaiting AWS credentials from IT' } });

    const confirmBtn = screen.getByRole('button', { name: /confirm block/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(onBlock).toHaveBeenCalledWith(
        mockTask.id,
        'Awaiting AWS credentials from IT',
        undefined,
      );
    });
  });

  it('CompleteTaskDialog displays warning if checklist items are incomplete', () => {
    render(
      <CompleteTaskDialog
        task={mockTask}
        open={true}
        onClose={vi.fn()}
        onComplete={vi.fn()}
      />,
    );

    expect(screen.getByText(/incomplete subtask checklist item/i)).toBeInTheDocument();
  });

  it('TaskDetailDrawer renders all sections and tabs', () => {
    const onToggleChecklist = vi.fn();
    render(
      <TaskDetailDrawer
        task={mockTask}
        open={true}
        onClose={vi.fn()}
        onStartSession={vi.fn()}
        onPauseSession={vi.fn()}
        onResumeSession={vi.fn()}
        onOpenCompleteModal={vi.fn()}
        onOpenBlockModal={vi.fn()}
        onOpenRescheduleModal={vi.fn()}
        onToggleChecklist={onToggleChecklist}
        onAddChecklist={vi.fn()}
        onAddComment={vi.fn()}
        onAddAttachment={vi.fn()}
      />,
    );

    expect(screen.getAllByText('Audit Postgres schema indexes').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Overview & Schedule')).toBeInTheDocument();

    // Switch to Checklist tab
    const checklistTab = screen.getByRole('button', { name: /checklist/i });
    fireEvent.click(checklistTab);
    expect(screen.getByText('Run pg_stat_user_indexes')).toBeInTheDocument();
    expect(screen.getByText('Verify composite index on workspace_id')).toBeInTheDocument();

    // Switch to History & Sessions tab
    const historyTab = screen.getByRole('button', { name: /history & sessions/i });
    fireEvent.click(historyTab);
    expect(screen.getByText(/Reschedule History/i)).toBeInTheDocument();
    expect(screen.getByText(/Shifted deadline due to migration dependency/i)).toBeInTheDocument();

    // Switch to Comments tab
    const commentsTab = screen.getByRole('button', { name: /comments/i });
    fireEvent.click(commentsTab);
    expect(screen.getByText('Initial index scan completed.')).toBeInTheDocument();
  });

  it('MyTasksPage renders tabs and allows switching view mode', async () => {
    render(<MyTasksPage />, { wrapper: createWrapper() });

    expect(screen.getByRole('heading', { name: 'My Tasks' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /today/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /upcoming/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /overdue/i })).toBeInTheDocument();

    // Switch view mode to board
    const boardBtn = screen.getByTitle('Kanban Board View');
    fireEvent.click(boardBtn);
    expect(screen.getByText('Board')).toBeInTheDocument();
  });
});
