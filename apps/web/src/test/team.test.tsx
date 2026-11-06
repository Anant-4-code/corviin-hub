import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemberStatus } from '@corviin-hub/shared';
import type { TeamMemberSummaryDto, TeamMemberDetailDto } from '@corviin-hub/shared';
import { TeamSummaryStrip } from '../features/team/components/TeamSummaryStrip';
import { TeamFilterToolbar } from '../features/team/components/TeamFilterToolbar';
import { MemberCard } from '../features/team/components/MemberCard';
import { MemberTableView } from '../features/team/components/MemberTableView';
import { AddMemberDialog } from '../features/team/components/AddMemberDialog';
import { EditMemberDialog } from '../features/team/components/EditMemberDialog';
import { TeamPage } from '../features/team/TeamPage';
import { TeamMemberPage } from '../features/team/TeamMemberPage';
import * as teamApi from '../services/team';
import { useAppStore } from '@/lib/store';

const mockMembers: TeamMemberSummaryDto[] = [
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    displayName: 'Anant',
    initials: 'A',
    email: 'anant@corviin.tech',
    phone: '+91-98450-11111',
    role: 'Full Stack & Tech Lead',
    workspaceIds: ['ws-tech-0001-0000-000000000001'],
    status: MemberStatus.ACTIVE,
    bio: 'Monorepo architecture and frontend components.',
    joinedAt: '2026-01-01T00:00:00.000Z',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-11-01T09:00:00.000Z',
    workload: {
      openTasksCount: 4,
      overdueTasksCount: 1,
      tasksDueThisWeekCount: 2,
      completedTasksCount: 8,
      activeCampaignsCount: 1,
      upcomingMeetingsCount: 2,
    },
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    displayName: 'Rohit',
    initials: 'R',
    email: 'rohit@corviin.realestate',
    phone: '+91-98765-43210',
    role: 'Partner Relations & Real Estate Lead',
    workspaceIds: ['ws-tech-0001-0000-000000000001'],
    status: MemberStatus.ACTIVE,
    bio: 'Developer partnerships and commercial inventory.',
    joinedAt: '2026-01-01T00:00:00.000Z',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-11-02T10:00:00.000Z',
    workload: {
      openTasksCount: 3,
      overdueTasksCount: 0,
      tasksDueThisWeekCount: 1,
      completedTasksCount: 5,
      activeCampaignsCount: 2,
      upcomingMeetingsCount: 1,
    },
  },
  {
    id: 'd4e5f6a7-b8c9-0123-def0-123456789013',
    displayName: 'Vikramaditya Rao',
    initials: 'VR',
    email: 'vikram@corviin.partner',
    phone: '+91-99440-55555',
    role: 'Specialist Advisor (Former)',
    workspaceIds: ['ws-tech-0001-0000-000000000001'],
    status: MemberStatus.INACTIVE,
    bio: 'External advisor retained for historical attribution.',
    joinedAt: '2026-02-01T00:00:00.000Z',
    createdAt: '2026-02-01T00:00:00.000Z',
    updatedAt: '2026-06-01T00:00:00.000Z',
    workload: {
      openTasksCount: 0,
      overdueTasksCount: 0,
      tasksDueThisWeekCount: 0,
      completedTasksCount: 3,
      activeCampaignsCount: 0,
      upcomingMeetingsCount: 0,
    },
  },
];

const mockMemberDetail: TeamMemberDetailDto = {
  member: mockMembers[0],
  workspaces: [
    {
      id: 'ws-tech-0001-0000-000000000001',
      name: 'Corviin Tech',
      slug: 'corviin-tech',
      type: 'TECH',
    },
  ],
  workload: mockMembers[0].workload,
  assignedTasks: [
    {
      id: 'tsk-101',
      workspaceId: 'ws-tech-0001-0000-000000000001',
      title: 'Implement Team Directory and Workload Slice',
      status: 'IN_PROGRESS' as any,
      priority: 'HIGH' as any,
      deadline: '2026-11-06T18:00:00.000Z',
      assigneeId: mockMembers[0].id,
      assigneeName: 'Anant',
      creatorId: mockMembers[0].id,
      creatorName: 'Anant',
      checklist: [],
      workSessions: [],
      rescheduleHistory: [],
      comments: [],
      attachments: [],
      activity: [],
      createdAt: '2026-11-05T09:00:00.000Z',
      updatedAt: '2026-11-05T09:00:00.000Z',
    },
  ],
  completedTasks: [
    {
      id: 'tsk-comp-1',
      workspaceId: 'ws-tech-0001-0000-000000000001',
      title: 'Complete Meetings Management Feature Slice',
      status: 'COMPLETED' as any,
      priority: 'HIGH' as any,
      deadline: '2026-11-05T17:00:00.000Z',
      completedAt: '2026-11-05T17:30:00.000Z',
      assigneeId: mockMembers[0].id,
      assigneeName: 'Anant',
      creatorId: mockMembers[0].id,
      creatorName: 'Anant',
      checklist: [],
      workSessions: [],
      rescheduleHistory: [],
      comments: [],
      attachments: [],
      activity: [],
      createdAt: '2026-11-04T09:00:00.000Z',
      updatedAt: '2026-11-05T17:30:00.000Z',
    },
  ],
  plansAndGoals: [
    {
      id: 'gol-1',
      workspaceId: 'ws-tech-0001-0000-000000000001',
      title: 'Full Stack Monorepo Release',
      expectedOutcome: 'Ship 18 vertical feature slices.',
      ownerName: 'Anant',
      priority: 'HIGH' as any,
      progressMode: 'PERCENTAGE' as any,
      status: 'IN_PROGRESS' as any,
      progressPercent: 83,
      targetDate: '2026-11-15T00:00:00.000Z',
      ownerId: mockMembers[0].id,
      activity: [],
      createdAt: '2026-11-01T00:00:00.000Z',
      updatedAt: '2026-11-05T00:00:00.000Z',
    },
  ],
  campaigns: [
    {
      id: 'cmp-1',
      workspaceId: 'ws-tech-0001-0000-000000000001',
      title: 'Corviin Tech OS Architecture Brief',
      description: 'Architecture brief video',
      stage: 'RECORDING_UPLOAD' as any,
      platform: 'YOUTUBE' as any,
      priority: 'HIGH' as any,
      status: 'IN_PROGRESS' as any,
      progressPercent: 60,
      startDate: '2026-11-02T00:00:00.000Z',
      ownerId: mockMembers[0].id,
      targetPublishDate: '2026-11-10T00:00:00.000Z',
      contentItems: [],
      assetLinks: [],
      stageHistory: [],
      rescheduleHistory: [],
      activity: [],
      createdAt: '2026-11-02T00:00:00.000Z',
      updatedAt: '2026-11-05T00:00:00.000Z',
    },
  ],
  meetings: [
    {
      id: 'mtg-1',
      workspaceId: 'ws-tech-0001-0000-000000000001',
      title: 'Weekly Tech Architecture Alignment',
      date: '2026-11-05',
      startTime: '2026-11-05T10:00:00.000Z',
      endTime: '2026-11-05T11:00:00.000Z',
      organiserId: mockMembers[0].id,
      participantIds: [mockMembers[0].id],
      status: 'SCHEDULED' as any,
      category: 'INTERNAL' as any,
      rescheduleHistory: [],
      activity: [],
      createdAt: '2026-11-01T00:00:00.000Z',
      updatedAt: '2026-11-01T00:00:00.000Z',
    },
  ],
  recentActivity: [
    {
      id: 'act-1',
      action: 'Completed task',
      actorName: 'Anant',
      timestamp: '2026-11-05T17:30:00.000Z',
      details: 'Delivered Meetings Slice',
    },
  ],
};

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

describe('Feature 15: Team Directory & Workload Slice', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    useAppStore.setState({
      selectedWorkspaceId: 'ws-tech-0001-0000-000000000001',
      selectedProfileId: mockMembers[0].id,
    });
  });

  describe('TeamSummaryStrip', () => {
    it('aggregates and displays team workload statistics', () => {
      render(<TeamSummaryStrip members={mockMembers} />);

      expect(screen.getByText('Workspace Team')).toBeInTheDocument();
      expect(screen.getAllByText('3').length).toBe(3); // 3 members, 3 due this week, 3 active campaigns
      expect(screen.getByText('Open Tasks')).toBeInTheDocument();
      expect(screen.getByText('7')).toBeInTheDocument(); // 4 + 3 + 0
      expect(screen.getByText('Overdue Tasks')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument(); // 1 overdue
      expect(screen.getByText('Due This Week')).toBeInTheDocument();
      expect(screen.getByText('Active Campaigns')).toBeInTheDocument();
      expect(screen.getByText('Completed Tasks')).toBeInTheDocument();
    });
  });

  describe('TeamFilterToolbar', () => {
    it('handles query typing, status selection, view mode toggle, and add click', () => {
      const onSearchChange = vi.fn();
      const onStatusChange = vi.fn();
      const onViewModeChange = vi.fn();
      const onAddClick = vi.fn();

      render(
        <TeamFilterToolbar
          searchQuery=""
          onSearchChange={onSearchChange}
          statusFilter="ALL"
          onStatusFilterChange={onStatusChange}
          viewMode="GRID"
          onViewModeChange={onViewModeChange}
          onResetFilters={vi.fn()}
          onAddMemberClick={onAddClick}
        />,
      );

      const searchInput = screen.getByPlaceholderText(/Search team members/i);
      fireEvent.change(searchInput, { target: { value: 'Rohit' } });
      expect(onSearchChange).toHaveBeenCalledWith('Rohit');

      const tableBtn = screen.getByRole('button', { name: /Table/i });
      fireEvent.click(tableBtn);
      expect(onViewModeChange).toHaveBeenCalledWith('TABLE');

      const addBtn = screen.getByRole('button', { name: /Add Member/i });
      fireEvent.click(addBtn);
      expect(onAddClick).toHaveBeenCalled();
    });
  });

  describe('MemberCard Component', () => {
    it('renders member profile, workload stats, and touch targets without exposing secrets', () => {
      const onSelect = vi.fn();
      renderWithClient(
        <MemberCard
          member={mockMembers[1]}
          isActingProfile={false}
          onSelectActingProfile={onSelect}
        />,
      );

      expect(screen.getByText('Rohit')).toBeInTheDocument();
      expect(screen.getByText('Partner Relations & Real Estate Lead')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument(); // Open tasks count

      // Ensure no passwords/tokens exist
      expect(screen.queryByText(/password/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/token/i)).not.toBeInTheDocument();

      // Touch target verification
      const detailLink = screen.getByText('View Profile & Workload');
      expect(detailLink.className).toContain('min-h-[44px]');

      // Switch acting profile trigger
      const actBtn = screen.getByRole('button', { name: /Act as Rohit/i });
      expect(actBtn.className).toContain('min-h-[44px]');
      fireEvent.click(actBtn);
      expect(onSelect).toHaveBeenCalledWith(mockMembers[1].id);
    });

    it('indicates current active acting profile', () => {
      renderWithClient(
        <MemberCard member={mockMembers[0]} isActingProfile={true} />,
      );

      expect(screen.getByText(/Current Acting Profile/i)).toBeInTheDocument();
    });
  });

  describe('MemberTableView Component', () => {
    it('renders desktop table with 9 columns and member data', () => {
      renderWithClient(
        <MemberTableView members={mockMembers} actingProfileId={mockMembers[0].id} />,
      );

      expect(screen.getByText('Member')).toBeInTheDocument();
      expect(screen.getByText('Role / Responsibilities')).toBeInTheDocument();
      expect(screen.getByText('Workspaces')).toBeInTheDocument();
      expect(screen.getByText('Open Tasks')).toBeInTheDocument();

      expect(screen.getByText('Anant')).toBeInTheDocument();
      expect(screen.getByText('Rohit')).toBeInTheDocument();
      expect(screen.getByText('Vikramaditya Rao')).toBeInTheDocument();
      expect(screen.getByText('Inactive / Former')).toBeInTheDocument();
    });
  });

  describe('AddMemberDialog & EditMemberDialog', () => {
    it('enforces required fields and submits dynamic new member', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      const onClose = vi.fn();

      render(
        <AddMemberDialog
          isOpen={true}
          defaultWorkspaceId="ws-tech-0001-0000-000000000001"
          onClose={onClose}
          onSubmit={onSubmit}
        />,
      );

      const nameInput = screen.getByPlaceholderText(/e\.g\. Priya Sundaram/i);
      fireEvent.change(nameInput, { target: { value: 'Priya Sundaram' } });

      const roleInput = screen.getByPlaceholderText(/e\.g\. Growth Marketing Lead/i);
      fireEvent.change(roleInput, { target: { value: 'Content Lead' } });

      const submitBtn = screen.getByRole('button', { name: /Add Team Member/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            displayName: 'Priya Sundaram',
            role: 'Content Lead',
            workspaceIds: ['ws-tech-0001-0000-000000000001'],
          }),
        );
      });
    });

    it('renders edit dialog with current values and submits update', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      render(
        <EditMemberDialog
          isOpen={true}
          member={mockMembers[0]}
          onClose={vi.fn()}
          onSubmit={onSubmit}
        />,
      );

      const roleInput = screen.getByDisplayValue('Full Stack & Tech Lead');
      fireEvent.change(roleInput, { target: { value: 'Chief Technology Architect' } });

      fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          mockMembers[0].id,
          expect.objectContaining({
            role: 'Chief Technology Architect',
          }),
        );
      });
    });
  });

  describe('TeamMemberPage Detail View', () => {
    it('renders member profile, workload summary, and 8 operational tabs', async () => {
      vi.spyOn(teamApi, 'fetchTeamMemberDetail').mockResolvedValue(mockMemberDetail);

      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false, gcTime: 0 } },
      });

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={[`/app/team/${mockMembers[0].id}`]}>
            <Routes>
              <Route path="/app/team/:memberId" element={<TeamMemberPage />} />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>,
      );

      // Verify header rendered
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Anant' })).toBeInTheDocument();
        expect(screen.getAllByText('anant@corviin.tech').length).toBeGreaterThanOrEqual(1);
      });

      // Verify workload cards rendered
      expect(screen.getAllByText('Open Tasks').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Overdue Tasks').length).toBeGreaterThanOrEqual(1);

      // Verify tabs exist
      expect(screen.getByRole('button', { name: /Overview & Workspaces/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Assigned Tasks/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Completed Deliverables/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Plans & Goals/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Campaigns Owned/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Meetings & Visits/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Operational Activity/i })).toBeInTheDocument();

      // Test switching to Assigned Tasks tab
      fireEvent.click(screen.getByRole('button', { name: /Assigned Tasks/i }));
      expect(screen.getByText('Implement Team Directory and Workload Slice')).toBeInTheDocument();

      // Test switching to Plans & Goals tab
      fireEvent.click(screen.getByRole('button', { name: /Plans & Goals/i }));
      expect(screen.getByText('Full Stack Monorepo Release')).toBeInTheDocument();

      // Test switching to Campaigns tab
      fireEvent.click(screen.getByRole('button', { name: /Campaigns Owned/i }));
      expect(screen.getByText('Corviin Tech OS Architecture Brief')).toBeInTheDocument();
    });
  });

  describe('TeamPage Integration', () => {
    it('loads workspace members, allows search filtering, and view toggling', async () => {
      vi.spyOn(teamApi, 'fetchTeamMembers').mockResolvedValue(mockMembers);

      renderWithClient(<TeamPage />);

      await waitFor(() => {
        expect(screen.getByText('Team Directory & Workload')).toBeInTheDocument();
        expect(screen.getByText('Anant')).toBeInTheDocument();
        expect(screen.getByText('Rohit')).toBeInTheDocument();
      });

      // Test Search Filter
      const searchInput = screen.getByPlaceholderText(/Search team members/i);
      fireEvent.change(searchInput, { target: { value: 'Rohit' } });

      expect(screen.queryByText('Anant')).not.toBeInTheDocument();
      expect(screen.getByText('Rohit')).toBeInTheDocument();

      // Switch to Table View
      fireEvent.change(searchInput, { target: { value: '' } });
      const tableBtn = screen.getByRole('button', { name: /Table/i });
      fireEvent.click(tableBtn);

      expect(screen.getByText('Member')).toBeInTheDocument();
      expect(screen.getByText('Role / Responsibilities')).toBeInTheDocument();
    });
  });
});

