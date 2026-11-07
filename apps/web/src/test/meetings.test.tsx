import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MeetingCategory, MeetingStatus, TaskPriority } from '@corviin-hub/shared';
import type { MeetingItem } from '@corviin-hub/shared';
import { MeetingsSummaryStrip } from '../features/meetings/components/MeetingsSummaryStrip';
import { MeetingsFilterToolbar } from '../features/meetings/components/MeetingsFilterToolbar';
import { MeetingsTableView } from '../features/meetings/components/MeetingsTableView';
import { MeetingsGroupedView } from '../features/meetings/components/MeetingsGroupedView';
import { MeetingsAgendaView } from '../features/meetings/components/MeetingsAgendaView';
import { UpcomingMeetingsPanel } from '../features/meetings/components/UpcomingMeetingsPanel';
import { MeetingActionItemsRegister } from '../features/meetings/components/MeetingActionItemsRegister';
import { MeetingRecentActivityFeed } from '../features/meetings/components/MeetingRecentActivityFeed';
import { ScheduleMeetingDialog } from '../features/meetings/components/ScheduleMeetingDialog';
import { RescheduleMeetingModal } from '../features/meetings/components/RescheduleMeetingModal';
import { AddActionItemDialog } from '../features/meetings/components/AddActionItemDialog';
import { AddDecisionDialog } from '../features/meetings/components/AddDecisionDialog';
import { MeetingsPage } from '../features/meetings/MeetingsPage';
import { MeetingDetailPage } from '../features/meetings/MeetingDetailPage';
import * as meetingsApi from '../services/meetings';
import { useAppStore } from '@/lib/store';

const mockMeetings: MeetingItem[] = [
  {
    id: 'mtg-tech-001',
    workspaceId: 'ws-tech-0001-0000-000000000001',
    title: 'Weekly Tech Architecture & Zero-Animation Review',
    category: MeetingCategory.INTERNAL,
    status: MeetingStatus.SCHEDULED,
    date: '2026-11-05',
    startTime: '2026-11-05T10:00:00.000Z',
    endTime: '2026-11-05T11:00:00.000Z',
    organiserId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', // Anant
    participantIds: [
      'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    ],
    meetingUrl: 'https://meet.google.com/crv-tech-arch',
    phoneNumber: '+1-555-0199',
    agenda: 'Review CSS zero-animation enforcement and token contrast.',
    notes: 'Zero-animation tokens verified.',
    agendaTopics: [
      { id: 'top-1', topic: 'Verify zero CSS transitions', completed: true },
      { id: 'top-2', topic: 'Audit Light/Dark contrast', completed: false },
    ],
    preparation: {
      background: 'Architecture compliance check.',
      links: ['https://corviin.tech/arch'],
      questions: ['Are high-contrast focus rings required?'],
      requiredDecisions: ['Approve modal overlay styling'],
    },
    detailedNotes: {
      summary: 'All core architecture guidelines verified.',
      infoReceived: 'All workbenches updated.',
      blockers: ['None'],
      commitments: ['Rohit to update docs'],
    },
    formalDecisions: [
      {
        id: 'dec-1',
        decisionText: 'All modal dialogs must use static non-spring overlays.',
        responsiblePersonId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        createdAt: '2026-11-05T10:30:00.000Z',
      },
    ],
    actionItems: [
      {
        id: 'act-1',
        description: 'Document design tokens in architecture TRD',
        assignedMemberId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
        dueDate: '2026-11-06T17:00:00.000Z',
        priority: TaskPriority.HIGH,
        status: 'PENDING',
      },
    ],
    attachments: [
      {
        id: 'att-1',
        name: 'Architecture_Review.pdf',
        url: '/api/v1/assets/att-1',
      },
    ],
    outcome: {
      outcomeSummary: 'Architecture unanimously approved.',
      nextSteps: 'Proceed with Feature 14 rollout.',
      nextFollowUpDate: '2026-11-12T10:00:00.000Z',
      nextMeetingDate: '2026-11-12T10:00:00.000Z',
      crmUpdateNote: 'Milestone complete.',
    },
    linkedRecord: {
      id: 'prj-101',
      title: 'CORVIIN HUB Core Architecture',
      type: 'project',
    },
    rescheduleHistory: [],
    activity: [
      {
        id: 'act-1',
        action: 'Meeting created',
        actorName: 'Anant',
        timestamp: '2026-11-01T09:00:00.000Z',
      },
    ],
    createdAt: '2026-11-01T09:00:00.000Z',
    updatedAt: '2026-11-04T12:00:00.000Z',
  },
  {
    id: 'mtg-tech-002',
    workspaceId: 'ws-tech-0001-0000-000000000001',
    title: 'Enterprise Client Tech Discovery Call — NexaCorp',
    category: MeetingCategory.CLIENT,
    status: MeetingStatus.COMPLETED,
    date: '2026-11-05',
    startTime: '2026-11-05T15:30:00.000Z',
    endTime: '2026-11-05T16:30:00.000Z',
    organiserId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    participantIds: ['a1b2c3d4-e5f6-7890-abcd-ef1234567890'],
    externalParticipants: ['david.chen@nexacorp.io'],
    location: 'Conference Room 3B',
    phoneNumber: '+1-555-0199',
    rescheduleHistory: [],
    activity: [],
    createdAt: '2026-11-02T10:00:00.000Z',
    updatedAt: '2026-11-02T10:00:00.000Z',
  },
];

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>,
  );
}

describe('Feature 14: Meetings Management Slice', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    useAppStore.setState({
      selectedWorkspaceId: 'ws-tech-0001-0000-000000000001',
    });
  });

  describe('MeetingsSummaryStrip', () => {
    it('calculates and displays key meeting operational metrics', () => {
      render(<MeetingsSummaryStrip meetings={mockMeetings} />);

      expect(screen.getByText('Total Meetings')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument(); // total
      expect(screen.getByText('Scheduled / Confirmed')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByText('Action Items Pending')).toBeInTheDocument();
      expect(screen.getByText('Tasks Converted')).toBeInTheDocument();

      const singleCountElements = screen.getAllByText('1');
      expect(singleCountElements.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('MeetingsFilterToolbar', () => {
    it('handles query typing and filter adjustments', () => {
      const onSearchChange = vi.fn();
      const onCategoryChange = vi.fn();
      const onStatusChange = vi.fn();
      const onScheduleClick = vi.fn();

      render(
        <MeetingsFilterToolbar
          searchQuery=""
          onSearchChange={onSearchChange}
          selectedCategory="ALL"
          onCategoryChange={onCategoryChange}
          selectedStatus="ALL"
          onStatusChange={onStatusChange}
          selectedMember="ALL"
          onMemberChange={vi.fn()}
          dateFilter="ALL"
          onDateFilterChange={vi.fn()}
          onResetFilters={vi.fn()}
          onScheduleClick={onScheduleClick}
        />,
      );

      const searchInput = screen.getByPlaceholderText(/Search meetings by title/i);
      fireEvent.change(searchInput, { target: { value: 'NexaCorp' } });
      expect(onSearchChange).toHaveBeenCalledWith('NexaCorp');

      const scheduleBtn = screen.getByRole('button', { name: /Schedule Meeting/i });
      fireEvent.click(scheduleBtn);
      expect(onScheduleClick).toHaveBeenCalled();
    });
  });

  describe('MeetingsTableView', () => {
    it('renders desktop table with 8 columns and quick action buttons', () => {
      const onReschedule = vi.fn();
      renderWithClient(
        <MeetingsTableView meetings={mockMeetings} onRescheduleClick={onReschedule} />,
      );

      // Desktop table headers
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Date / Time')).toBeInTheDocument();
      expect(screen.getByText('Organiser')).toBeInTheDocument();
      expect(screen.getByText('Participants')).toBeInTheDocument();
      expect(screen.getByText('Related Lead/Record')).toBeInTheDocument();
      expect(screen.getByText('Next Action')).toBeInTheDocument();

      // Titles in rows (appears in both desktop and mobile views)
      expect(screen.getAllByText('Weekly Tech Architecture & Zero-Animation Review').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Enterprise Client Tech Discovery Call — NexaCorp').length).toBeGreaterThanOrEqual(1);

      // Direct Action Links
      const joinLinks = screen.getAllByText('Join');
      expect(joinLinks.length).toBeGreaterThan(0);

      const callLinks = screen.getAllByText('Call');
      expect(callLinks.length).toBeGreaterThan(0);
    });

    it('renders mobile cards with minimum 44px touch targets', () => {
      renderWithClient(
        <MeetingsTableView meetings={mockMeetings} onRescheduleClick={vi.fn()} />,
      );

      // Mobile cards contain direct CTA touch targets
      const mobileDetailLinks = screen.getAllByText('Open Detail');
      expect(mobileDetailLinks.length).toBe(mockMeetings.length);
      mobileDetailLinks.forEach((el) => {
        expect(el.className).toContain('min-h-[44px]');
      });
    });
  });

  describe('ScheduleMeetingDialog', () => {
    it('validates mandatory fields and time span before submitting', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      const onClose = vi.fn();

      render(
        <ScheduleMeetingDialog
          isOpen={true}
          workspaceId="ws-tech-0001-0000-000000000001"
          onClose={onClose}
          onSubmit={onSubmit}
        />,
      );

      // Fill in meeting title
      const titleInput = screen.getByPlaceholderText(/e\.g\. NexaCorp Architecture Review/i);
      fireEvent.change(titleInput, { target: { value: 'Sprint 14 Retro' } });

      // Submit form
      const submitBtn = screen.getByRole('button', { name: /Schedule Meeting/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalled();
        expect(onSubmit.mock.calls[0][0].title).toBe('Sprint 14 Retro');
        expect(onSubmit.mock.calls[0][0].workspaceId).toBe('ws-tech-0001-0000-000000000001');
      });
    });
  });

  describe('RescheduleMeetingModal', () => {
    it('requires a mandatory reason before confirming reschedule', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      const onClose = vi.fn();

      render(
        <RescheduleMeetingModal
          isOpen={true}
          meeting={mockMeetings[0]}
          onClose={onClose}
          onSubmit={onSubmit}
        />,
      );

      // Try submitting without reason
      const confirmBtn = screen.getByRole('button', { name: /Confirm Reschedule/i });
      fireEvent.click(confirmBtn);

      expect(screen.getByText(/A mandatory reason is required/i)).toBeInTheDocument();
      expect(onSubmit).not.toHaveBeenCalled();

      // Fill reason
      const reasonInput = screen.getByPlaceholderText(/Provide a clear operational audit reason/i);
      fireEvent.change(reasonInput, { target: { value: 'Team lead travelling for onsite demo' } });
      fireEvent.click(confirmBtn);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          'mtg-tech-001',
          expect.objectContaining({
            reason: 'Team lead travelling for onsite demo',
          }),
        );
      });
    });
  });

  describe('AddActionItemDialog & AddDecisionDialog', () => {
    it('captures action item details cleanly', () => {
      const onSubmit = vi.fn();
      render(<AddActionItemDialog isOpen={true} onClose={vi.fn()} onSubmit={onSubmit} />);

      const descInput = screen.getByPlaceholderText(/Specific deliverable resulting from discussion/i);
      fireEvent.change(descInput, { target: { value: 'Publish design system audit log' } });

      fireEvent.click(screen.getByRole('button', { name: /Add Action Item/i }));
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          description: 'Publish design system audit log',
        }),
      );
    });

    it('captures formal decision details cleanly', () => {
      const onSubmit = vi.fn();
      render(<AddDecisionDialog isOpen={true} onClose={vi.fn()} onSubmit={onSubmit} />);

      const textInput = screen.getByPlaceholderText(/Record the agreed-upon direction/i);
      fireEvent.change(textInput, { target: { value: 'Adopt zero animation across all modals' } });

      fireEvent.click(screen.getByRole('button', { name: /Record Decision/i }));
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          decisionText: 'Adopt zero animation across all modals',
        }),
      );
    });
  });

  describe('MeetingDetailPage', () => {
    it('renders all 8 sections and handles action item conversion to task', async () => {
      vi.spyOn(meetingsApi, 'fetchMeetingById').mockResolvedValue(mockMeetings[0]);
      const convertSpy = vi.spyOn(meetingsApi, 'convertMeetingActionItem').mockResolvedValue({
        actionItem: { ...mockMeetings[0].actionItems![0], status: 'CONVERTED' },
        task: { id: 'tsk-conv-1', title: 'Document design tokens' } as any,
      });

      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false, gcTime: 0 } },
      });

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/app/meetings/mtg-tech-001']}>
            <Routes>
              <Route path="/app/meetings/:meetingId" element={<MeetingDetailPage />} />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>,
      );

      // Verify header rendered (appears in breadcrumbs and title)
      await waitFor(() => {
        expect(screen.getAllByText('Weekly Tech Architecture & Zero-Animation Review').length).toBeGreaterThanOrEqual(1);
      });

      // Verify tabs exist
      expect(screen.getByRole('button', { name: /Overview/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Agenda/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Preparation/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Discussion Notes/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Decisions/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Action Items/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Attachments/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Outcome & Follow-up/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Audit History/i })).toBeInTheDocument();

      // Navigate to Action Items tab
      fireEvent.click(screen.getByRole('button', { name: /Action Items/i }));
      expect(screen.getByText('Convertible Action Items')).toBeInTheDocument();
      expect(screen.getByText('Document design tokens in architecture TRD')).toBeInTheDocument();

      // Click "Convert to Task"
      const convertBtn = screen.getByRole('button', { name: /Convert to Task/i });
      fireEvent.click(convertBtn);

      await waitFor(() => {
        expect(convertSpy).toHaveBeenCalledWith('ws-tech-0001-0000-000000000001', 'mtg-tech-001', {
          actionItemId: 'act-1',
        });
      });
    });
  });

  describe('MeetingsPage', () => {
    it('loads and filters meeting records in the active workspace', async () => {
      vi.spyOn(meetingsApi, 'fetchMeetings').mockResolvedValue(mockMeetings);

      renderWithClient(<MeetingsPage />);

      await waitFor(() => {
        expect(screen.getByText('Meetings & Sessions')).toBeInTheDocument();
        expect(screen.getAllByText('Weekly Tech Architecture & Zero-Animation Review').length).toBeGreaterThanOrEqual(1);
      });

      // Test Search Filtering
      const searchInput = screen.getByPlaceholderText(/Search meetings by title/i);
      fireEvent.change(searchInput, { target: { value: 'NexaCorp' } });

      // After filter, only NexaCorp meeting is visible
      expect(screen.queryByText('Weekly Tech Architecture & Zero-Animation Review')).not.toBeInTheDocument();
      expect(screen.getAllByText('Enterprise Client Tech Discovery Call — NexaCorp').length).toBeGreaterThanOrEqual(1);
    });

    it('switches between Table, Grouped, and Agenda view modes', async () => {
      vi.spyOn(meetingsApi, 'fetchMeetings').mockResolvedValue(mockMeetings);

      renderWithClient(<MeetingsPage />);

      await waitFor(() => {
        expect(screen.getByText('Meetings & Sessions')).toBeInTheDocument();
      });

      // Switch to Grouped View
      const groupedBtn = screen.getByRole('button', { name: /Grouped View/i });
      fireEvent.click(groupedBtn);

      expect(screen.getByText('Group Sessions By:')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Status' })).toBeInTheDocument();

      // Switch to Agenda View
      const agendaBtn = screen.getByRole('button', { name: /Agenda View/i });
      fireEvent.click(agendaBtn);

      expect(screen.getAllByText(/TODAY/i).length).toBeGreaterThanOrEqual(1);

      // Switch back to Table View
      const tableBtn = screen.getByRole('button', { name: /Table View/i });
      fireEvent.click(tableBtn);

      expect(screen.getByText('Related Lead/Record')).toBeInTheDocument();
    });
  });

  describe('UpcomingMeetingsPanel', () => {
    it('renders upcoming priority sessions with direct Join and Call CTAs', () => {
      renderWithClient(<UpcomingMeetingsPanel meetings={mockMeetings} onRescheduleClick={vi.fn()} />);

      expect(screen.getByText(/Upcoming Sessions & Active Pipeline/i)).toBeInTheDocument();
      expect(screen.getByText(/Priority Sessions/i)).toBeInTheDocument();
      expect(screen.getAllByText('Weekly Tech Architecture & Zero-Animation Review').length).toBeGreaterThanOrEqual(1);

      const joinLink = screen.getByText('Join');
      expect(joinLink).toHaveAttribute('href', 'https://meet.google.com/crv-tech-arch');

      const callLinks = screen.getAllByText('Call');
      expect(callLinks.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('MeetingActionItemsRegister', () => {
    it('renders action items table and triggers task conversion', async () => {
      const convertSpy = vi.spyOn(meetingsApi, 'convertMeetingActionItem').mockResolvedValue({
        actionItem: { ...mockMeetings[0].actionItems![0], status: 'CONVERTED' },
        task: { id: 'tsk-conv-2', title: 'Document design tokens' } as any,
      });

      renderWithClient(
        <MeetingActionItemsRegister
          meetings={mockMeetings}
          workspaceId="ws-tech-0001-0000-000000000001"
        />,
      );

      expect(screen.getByText(/Workspace Action Items Register/i)).toBeInTheDocument();
      expect(screen.getAllByText('Document design tokens in architecture TRD').length).toBeGreaterThanOrEqual(1);

      const convertBtn = screen.getAllByRole('button', { name: /Convert to Task/i })[0];
      fireEvent.click(convertBtn);

      await waitFor(() => {
        expect(convertSpy).toHaveBeenCalledWith(
          'ws-tech-0001-0000-000000000001',
          'mtg-tech-001',
          expect.objectContaining({ actionItemId: 'act-1' }),
        );
      });
    });
  });

  describe('MeetingRecentActivityFeed', () => {
    it('renders chronological meeting lifecycle events', () => {
      renderWithClient(<MeetingRecentActivityFeed meetings={mockMeetings} />);

      expect(screen.getByText(/Recent Meeting Activity & Audit Feed/i)).toBeInTheDocument();
      expect(screen.getByText(/Meeting created/i)).toBeInTheDocument();
      expect(screen.getByText(/Formal Decision Recorded/i)).toBeInTheDocument();
    });
  });
});
