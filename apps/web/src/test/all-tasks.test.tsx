import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { TaskItem, TaskPriority, TaskStatus } from '@corviin-hub/shared';
import { AllTasksTableView } from '@/features/tasks/components/AllTasksTableView';
import { BulkActionBar } from '@/features/tasks/components/BulkActionBar';
import { TaskByMemberView } from '@/features/tasks/components/TaskByMemberView';
import { TaskCalendarView } from '@/features/tasks/components/TaskCalendarView';
import { AllTasksPage } from '@/features/tasks/AllTasksPage';

const mockTasks: TaskItem[] = [
  {
    id: 'task-101',
    workspaceId: 'ws-tech-0001-0000-000000000001',
    title: 'Migrate NestJS database migrations to Prisma',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.URGENT,
    assigneeId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    assigneeName: 'Anant',
    creatorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    creatorName: 'Anant',
    plannedStart: '2026-11-05T09:00:00.000Z',
    deadline: '2026-11-05T17:00:00.000Z',
    checklist: [{ id: 'c1', title: 'Setup schema.prisma', completed: true }],
    workSessions: [{ id: 'ws1', startedAt: '2026-11-05T09:00:00.000Z', durationSeconds: 3600, actorId: 'a1', actorName: 'Anant' }],
    rescheduleHistory: [],
    comments: [],
    attachments: [],
    activity: [],
    createdAt: '2026-11-05T08:00:00.000Z',
    updatedAt: '2026-11-05T09:00:00.000Z',
  },
  {
    id: 'task-102',
    workspaceId: 'ws-tech-0001-0000-000000000001',
    title: 'Review Docker container resource limits',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    assigneeId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    assigneeName: 'Rohit',
    creatorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    creatorName: 'Anant',
    deadline: '2026-11-06T12:00:00.000Z',
    checklist: [],
    workSessions: [],
    rescheduleHistory: [],
    comments: [],
    attachments: [],
    activity: [],
    createdAt: '2026-11-04T10:00:00.000Z',
    updatedAt: '2026-11-04T10:00:00.000Z',
  },
];

const mockProfiles = [
  { id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', displayName: 'Anant', initials: 'AN' },
  { id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901', displayName: 'Rohit', initials: 'RO' },
  { id: 'c3d4e5f6-a7b8-9012-cdef-123456789012', displayName: 'Utkarsh', initials: 'UT' },
];

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

describe('All Tasks Views and Bulk Operations', () => {
  it('AllTasksTableView renders table headers and handles select all', () => {
    const onToggleSelectAll = vi.fn();
    const onToggleSelectTask = vi.fn();

    render(
      <AllTasksTableView
        tasks={mockTasks}
        selectedTaskIds={['task-101']}
        onToggleSelectTask={onToggleSelectTask}
        onToggleSelectAll={onToggleSelectAll}
        onSelectTask={vi.fn()}
        onStart={vi.fn()}
        onPause={vi.fn()}
        onResume={vi.fn()}
        onComplete={vi.fn()}
        onReschedule={vi.fn()}
        onBlock={vi.fn()}
      />,
    );

    expect(screen.getByText('Migrate NestJS database migrations to Prisma')).toBeInTheDocument();
    expect(screen.getByText('Review Docker container resource limits')).toBeInTheDocument();

    const selectAllCheckbox = screen.getByLabelText(/select all tasks/i);
    expect(selectAllCheckbox).toBeInTheDocument();
    fireEvent.click(selectAllCheckbox);
    expect(onToggleSelectAll).toHaveBeenCalledTimes(1);
  });

  it('BulkActionBar renders selection count and triggers bulk action buttons', () => {
    const onClear = vi.fn();
    const onReassign = vi.fn();
    const onSetPriority = vi.fn();
    const onComplete = vi.fn();

    render(
      <BulkActionBar
        selectedCount={3}
        onClearSelection={onClear}
        onBulkReassign={onReassign}
        onBulkSetPriority={onSetPriority}
        onBulkComplete={onComplete}
      />,
      { wrapper: createWrapper() },
    );

    expect(screen.getByText(/3 selected/i)).toBeInTheDocument();

    // Mark complete button
    const completeBtn = screen.getByRole('button', { name: /mark completed/i });
    fireEvent.click(completeBtn);
    expect(onComplete).toHaveBeenCalledTimes(1);

    // Clear selection
    const clearBtn = screen.getByLabelText(/clear selection/i);
    fireEvent.click(clearBtn);
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('TaskByMemberView groups tasks by member and displays workload stats', () => {
    const onSelectTask = vi.fn();
    const onCreateForMember = vi.fn();

    render(
      <TaskByMemberView
        tasks={mockTasks}
        profiles={mockProfiles}
        onSelectTask={onSelectTask}
        onStart={vi.fn()}
        onPause={vi.fn()}
        onResume={vi.fn()}
        onComplete={vi.fn()}
        onReschedule={vi.fn()}
        onBlock={vi.fn()}
        onCreateTaskForMember={onCreateForMember}
      />,
    );

    // Members should be listed
    expect(screen.getByRole('heading', { name: /Anant/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Rohit/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Utkarsh/i })).toBeInTheDocument();

    // Assign task buttons
    const assignButtons = screen.getAllByRole('button', { name: /assign task/i });
    expect(assignButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('TaskCalendarView groups tasks by scheduled date', () => {
    render(
      <TaskCalendarView
        tasks={mockTasks}
        onSelectTask={vi.fn()}
        onStart={vi.fn()}
        onPause={vi.fn()}
        onResume={vi.fn()}
        onComplete={vi.fn()}
      />,
    );

    expect(screen.getByText('Migrate NestJS database migrations to Prisma')).toBeInTheDocument();
    expect(screen.getByText('Review Docker container resource limits')).toBeInTheDocument();
  });

  it('AllTasksPage renders all quick tabs and view switcher modes', () => {
    render(<AllTasksPage />, { wrapper: createWrapper() });

    expect(screen.getByRole('heading', { name: 'All Tasks' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'All Tasks' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Open' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'My Tasks' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Overdue' })).toBeInTheDocument();

    // Switch view modes
    const kanbanBtn = screen.getByTitle('Kanban Board View');
    fireEvent.click(kanbanBtn);
    expect(screen.getByText('Kanban')).toBeInTheDocument();

    const calendarBtn = screen.getByTitle('Calendar / Agenda View');
    fireEvent.click(calendarBtn);
    expect(screen.getByText('Calendar')).toBeInTheDocument();

    const membersBtn = screen.getByTitle('By Member Workload View');
    fireEvent.click(membersBtn);
    expect(screen.getByText('By Member')).toBeInTheDocument();
  });
});

