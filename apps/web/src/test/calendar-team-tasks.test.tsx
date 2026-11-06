import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import {
  TeamMemberCalendarGroup,
  TaskItem,
  TaskStatus,
  TaskPriority,
} from '@corviin-hub/shared';
import { TeamTasksSummaryStrip } from '../features/calendar/components/TeamTasksSummaryStrip';
import { TeamTasksDateNavigation } from '../features/calendar/components/TeamTasksDateNavigation';
import { MemberAccordionSection } from '../features/calendar/components/MemberAccordionSection';
import { CalendarTeamTasksPage } from '../features/calendar/CalendarTeamTasksPage';
import * as calendarService from '../services/calendar';

const mockTask: TaskItem = {
  id: 'tsk-tch-001',
  workspaceId: 'ws-tech-0001-0000-000000000001',
  title: 'Review OpenAPI Swagger documentation',
  description: 'Verify schema annotations and error contracts',
  status: TaskStatus.IN_PROGRESS,
  priority: TaskPriority.HIGH,
  assigneeId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  assigneeName: 'Anant',
  creatorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  creatorName: 'Anant',
  plannedStart: '2026-11-05T09:00:00.000Z',
  deadline: '2026-11-05T17:00:00.000Z',
  checklist: [],
  workSessions: [
    {
      id: 'sess-1',
      startedAt: '2026-11-05T09:30:00.000Z',
      actorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      actorName: 'Anant',
    },
  ],
  rescheduleHistory: [],
  comments: [],
  attachments: [],
  activity: [],
  createdAt: '2026-11-05T08:00:00.000Z',
  updatedAt: '2026-11-05T09:30:00.000Z',
};

const mockMemberGroup: TeamMemberCalendarGroup = {
  profileId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  profileName: 'Anant',
  profileInitials: 'A',
  taskCount: 1,
  urgentCount: 0,
  overdueCount: 0,
  inProgressCount: 1,
  tasks: [mockTask],
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

describe('Calendar: Team Tasks Components', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('TeamTasksSummaryStrip renders all 4 key metric cards', () => {
    render(
      <TeamTasksSummaryStrip
        metrics={{
          totalScheduled: 12,
          totalInProgress: 4,
          totalOverdue: 2,
          totalCompleted: 6,
        }}
      />,
    );

    expect(screen.getByText('Scheduled for Date')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('Active Work Sessions')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('Urgent / Overdue')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
  });

  it('TeamTasksDateNavigation displays date and triggers day navigation', () => {
    const onDateChange = vi.fn();
    const onPrevDay = vi.fn();
    const onNextDay = vi.fn();
    const onToday = vi.fn();
    const onViewModeChange = vi.fn();

    render(
      <TeamTasksDateNavigation
        currentDate="2026-11-05"
        onDateChange={onDateChange}
        onPrevDay={onPrevDay}
        onNextDay={onNextDay}
        onToday={onToday}
        viewMode="BY_MEMBER"
        onViewModeChange={onViewModeChange}
        onOpenCreateTask={vi.fn()}
      />,
    );

    expect(screen.getByText(/5 November 2026/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Today' }));
    expect(onToday).toHaveBeenCalled();

    fireEvent.click(screen.getByLabelText('Previous day'));
    expect(onPrevDay).toHaveBeenCalled();

    fireEvent.click(screen.getByLabelText('Next day'));
    expect(onNextDay).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /agenda/i }));
    expect(onViewModeChange).toHaveBeenCalledWith('AGENDA');
  });

  it('MemberAccordionSection renders member header and expands to show task cards', () => {
    const onToggle = vi.fn();
    const onSelectTask = vi.fn();
    const onPauseSession = vi.fn();

    const { rerender } = render(
      <MemberAccordionSection
        group={mockMemberGroup}
        expanded={false}
        onToggle={onToggle}
        onSelectTask={onSelectTask}
        onStartSession={vi.fn()}
        onPauseSession={onPauseSession}
        onCompleteTask={vi.fn()}
        onRescheduleTask={vi.fn()}
        onAddTaskForMember={vi.fn()}
      />,
    );

    expect(screen.getByText('Anant')).toBeInTheDocument();
    expect(screen.getByText('1 task scheduled')).toBeInTheDocument();
    expect(screen.queryByText('Review OpenAPI Swagger documentation')).not.toBeInTheDocument();

    // Rerender as expanded
    rerender(
      <MemberAccordionSection
        group={mockMemberGroup}
        expanded={true}
        onToggle={onToggle}
        onSelectTask={onSelectTask}
        onStartSession={vi.fn()}
        onPauseSession={onPauseSession}
        onCompleteTask={vi.fn()}
        onRescheduleTask={vi.fn()}
        onAddTaskForMember={vi.fn()}
      />,
    );

    expect(screen.getByText('Review OpenAPI Swagger documentation')).toBeInTheDocument();
    expect(screen.getByText('IN PROGRESS')).toBeInTheDocument();

    // Trigger pause session
    const pauseBtn = screen.getByRole('button', { name: /pause/i });
    fireEvent.click(pauseBtn);
    expect(onPauseSession).toHaveBeenCalledWith(mockTask);
  });

  it('CalendarTeamTasksPage renders dynamic member groups from backend query', async () => {
    vi.spyOn(calendarService, 'fetchTeamTasksCalendar').mockResolvedValue({
      selectedDate: '2026-11-05',
      members: [mockMemberGroup],
      unassigned: { taskCount: 0, tasks: [] },
      metrics: {
        totalScheduled: 1,
        totalInProgress: 1,
        totalOverdue: 0,
        totalCompleted: 0,
      },
    });

    render(<CalendarTeamTasksPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Scheduled for Date')).toBeInTheDocument();
      expect(screen.getByText('Anant')).toBeInTheDocument();
      expect(screen.getByText('Review OpenAPI Swagger documentation')).toBeInTheDocument();
    });
  });
});

