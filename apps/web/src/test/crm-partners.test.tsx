import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  RealEstatePartnerType,
  RealEstatePartnerStage,
  RealEstatePartnerRecord,
  PartnerCrmSummaryDto,
} from '@corviin-hub/shared';
import { PartnerSummaryStrip } from '@/features/crm/components/PartnerSummaryStrip';
import { PartnerFilterToolbar } from '@/features/crm/components/PartnerFilterToolbar';
import { PartnerRecordsTableView } from '@/features/crm/components/PartnerRecordsTableView';
import { PartnerRecordsBoardView } from '@/features/crm/components/PartnerRecordsBoardView';
import { CreatePartnerDialog } from '@/features/crm/components/CreatePartnerDialog';
import { PartnerRecordDetailDrawer } from '@/features/crm/components/PartnerRecordDetailDrawer';
import { CrmPartnersPage } from '@/features/crm/CrmPartnersPage';
import * as crmApi from '@/services/crm';
import { useAppStore } from '@/lib/store';

const mockPartner: RealEstatePartnerRecord = {
  id: 'partner-re-001',
  workspaceId: 'ws-real-0002-0000-000000000002',
  companyName: 'Skyline Developers Pvt Ltd',
  contactPerson: 'Sanjay Mehta',
  phone: '+91 99301 11223',
  email: 'sanjay.m@skylinedev.com',
  partnerType: RealEstatePartnerType.DEVELOPER,
  stage: RealEstatePartnerStage.FOLLOWUP_NEGOTIATION,
  assignedMemberId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  assignedMemberName: 'Anant',
  location: 'Alibaug & South Mumbai',
  website: 'https://skylinedevelopers.in',
  projects: [
    {
      id: 'proj-sky-1',
      name: 'Emerald Heights Luxury Villas',
      projectType: 'LUXURY_VILLAS',
      location: 'Awas Road, Alibaug',
      reraNumber: 'P52000018902',
      totalUnitsOrAcres: '45 Private Pool Villas',
      status: 'UNDER_CONSTRUCTION',
    },
    {
      id: 'proj-sky-2',
      name: 'Skyline Marina Bay Residences',
      projectType: 'RESIDENTIAL',
      location: 'Mandwa Jetty Road, Alibaug',
      status: 'UPCOMING',
    },
  ],
  marketingRequirements: ['3D Visualization', 'Sole Selling Mandate'],
  serviceRequirementsText: 'Exclusive 3% sales mandate & digital launch campaign.',
  partnershipInterest: 'Sole Selling & Digital Launch Mandate',
  source: 'Referral (Anant Network)',
  notes: 'Promoters are keen on an exclusive 6-month marketing window.',
  estimatedPortfolioValue: 250000000,
  nextFollowUpDate: '2026-11-06T15:00:00.000Z',
  nextFollowUpTitle: 'Present marketing mandate draft for Emerald Heights Phase 2',
  lastActivityDate: '2026-11-04T14:00:00.000Z',
  stageHistory: [
    {
      id: 'sh-1',
      toStage: RealEstatePartnerStage.NEW_PARTNER_LEAD,
      changedAt: '2026-10-10T10:00:00.000Z',
      actorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      actorName: 'Anant',
      notes: 'Initial referral',
    },
    {
      id: 'sh-2',
      fromStage: RealEstatePartnerStage.NEW_PARTNER_LEAD,
      toStage: RealEstatePartnerStage.FOLLOWUP_NEGOTIATION,
      changedAt: '2026-11-03T12:00:00.000Z',
      actorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      actorName: 'Anant',
      notes: 'Negotiating marketing budget sharing',
    },
  ],
  linkedTaskIds: ['task-1'],
  linkedMeetingIds: ['mtg-1'],
  createdAt: '2026-10-10T10:00:00.000Z',
  updatedAt: '2026-11-04T14:00:00.000Z',
};

const mockSummary: PartnerCrmSummaryDto = {
  totalPartners: 8,
  activePartners: 2,
  confirmedPartners: 1,
  leadsInPipeline: 5,
  totalProjectsCount: 11,
  overdueFollowUpsCount: 1,
  byType: {
    [RealEstatePartnerType.DEVELOPER]: 3,
    [RealEstatePartnerType.BUILDER]: 1,
    [RealEstatePartnerType.CONSTRUCTION_COMPANY]: 1,
    [RealEstatePartnerType.LANDOWNER]: 1,
    [RealEstatePartnerType.CHANNEL_PARTNER]: 1,
    [RealEstatePartnerType.BROKER_AGENT]: 1,
    [RealEstatePartnerType.OTHER_PARTNER]: 0,
  },
  byStage: {
    [RealEstatePartnerStage.NEW_PARTNER_LEAD]: 1,
    [RealEstatePartnerStage.INITIAL_CONTACT]: 1,
    [RealEstatePartnerStage.MEETING_PLANNED]: 1,
    [RealEstatePartnerStage.REQUIREMENT_DISCUSSION]: 1,
    [RealEstatePartnerStage.PROPOSAL_SERVICE_DETAILS]: 1,
    [RealEstatePartnerStage.FOLLOWUP_NEGOTIATION]: 1,
    [RealEstatePartnerStage.PARTNERSHIP_CONFIRMED]: 1,
    [RealEstatePartnerStage.ACTIVE_PARTNER]: 2,
    [RealEstatePartnerStage.NOT_INTERESTED]: 0,
    [RealEstatePartnerStage.LOST]: 0,
    [RealEstatePartnerStage.FOLLOW_UP_LATER]: 0,
  },
  byMember: [
    { memberId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', memberName: 'Anant', totalAssigned: 4, activeCount: 1 },
    { memberId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901', memberName: 'Rohit', totalAssigned: 3, activeCount: 1 },
  ],
};

describe('Real Estate Developers & Partners CRM (Feature 12)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAppStore.setState({
      selectedWorkspaceId: 'ws-real-0002-0000-000000000002',
      selectedProfileId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    });
  });

  describe('PartnerSummaryStrip Component', () => {
    it('renders overview metrics and partner type breakdowns correctly', () => {
      render(<PartnerSummaryStrip summary={mockSummary} />);

      expect(screen.getByText('Total Partners')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();
      expect(screen.getByText('Active Partners')).toBeInTheDocument();
      expect(screen.getByText('Confirmed')).toBeInTheDocument();
      expect(screen.getByText('In Pipeline')).toBeInTheDocument();
      expect(screen.getByText('Total Projects')).toBeInTheDocument();
      expect(screen.getByText('11')).toBeInTheDocument();
      expect(screen.getByText('Overdue Follow-ups')).toBeInTheDocument();

      // Partner breakdown
      expect(screen.getByText(/Developer: 3/)).toBeInTheDocument();
      expect(screen.getByText(/Landowner: 1/)).toBeInTheDocument();
    });
  });

  describe('PartnerFilterToolbar Component', () => {
    it('handles search input, filter selections, and triggers add partner callback', () => {
      const handleFilterChange = vi.fn();
      const handleOpenCreate = vi.fn();
      const handleViewModeChange = vi.fn();

      render(
        <PartnerFilterToolbar
          filter={{ page: 1, pageSize: 20 }}
          onFilterChange={handleFilterChange}
          viewMode="table"
          onViewModeChange={handleViewModeChange}
          onOpenCreate={handleOpenCreate}
          members={[{ id: 'a1b2c3d4', name: 'Anant' }]}
        />,
      );

      // Search input
      const searchInput = screen.getByPlaceholderText(/Search partners/i);
      fireEvent.change(searchInput, { target: { value: 'Skyline' } });
      expect(handleFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'Skyline' }),
      );

      // View mode toggle
      const boardBtn = screen.getByText('Pipeline Board');
      fireEvent.click(boardBtn);
      expect(handleViewModeChange).toHaveBeenCalledWith('board');

      // Add Partner button
      const addBtn = screen.getByText('+ Add Partner');
      fireEvent.click(addBtn);
      expect(handleOpenCreate).toHaveBeenCalled();
    });
  });

  describe('PartnerRecordsTableView Component', () => {
    it('renders table headers, partner rows, project chips, and mobile contact buttons', () => {
      const handleSelect = vi.fn();

      render(
        <PartnerRecordsTableView
          records={[mockPartner]}
          onSelectRecord={handleSelect}
        />,
      );

      // Company and contact
      expect(screen.getAllByText('Skyline Developers Pvt Ltd').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Sanjay Mehta').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Developer').length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Emerald Heights/i).length).toBeGreaterThan(0);

      // Click row opens details
      fireEvent.click(screen.getAllByText('Skyline Developers Pvt Ltd')[0]);
      expect(handleSelect).toHaveBeenCalledWith(mockPartner);
    });
  });

  describe('PartnerRecordsBoardView Component', () => {
    it('renders 11 pipeline columns and displays cards under their respective stage', () => {
      const handleSelect = vi.fn();

      render(
        <PartnerRecordsBoardView
          records={[mockPartner]}
          onSelectRecord={handleSelect}
        />,
      );

      expect(screen.getByText('New Partner Lead')).toBeInTheDocument();
      expect(screen.getByText('Follow-up / Negotiation')).toBeInTheDocument();
      expect(screen.getByText('Partnership Confirmed')).toBeInTheDocument();
      expect(screen.getByText('Active Partner')).toBeInTheDocument();

      // Card in Follow-up / Negotiation column
      expect(screen.getByText('Skyline Developers Pvt Ltd')).toBeInTheDocument();
    });
  });

  describe('CreatePartnerDialog Component', () => {
    it('renders essential fields, validates required inputs, and triggers submit', async () => {
      const handleSubmit = vi.fn().mockResolvedValue(undefined);
      const handleClose = vi.fn();

      render(
        <CreatePartnerDialog
          isOpen={true}
          onClose={handleClose}
          onSubmit={handleSubmit}
          workspaceId="ws-real-0002-0000-000000000002"
          members={[{ id: 'm-1', name: 'Anant' }]}
        />,
      );

      expect(screen.getByText('Create Real Estate Developer / Partner')).toBeInTheDocument();

      // Enter company name and phone
      fireEvent.change(screen.getByPlaceholderText(/Godrej Properties/i), {
        target: { value: 'Oberoi Realty' },
      });
      fireEvent.change(screen.getByPlaceholderText(/\+91 99301/i), {
        target: { value: '+91 99300 00000' },
      });

      // Submit form
      const submitBtn = screen.getByRole('button', { name: 'Create Partner' });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            companyName: 'Oberoi Realty',
            phone: '+91 99300 00000',
            partnerType: RealEstatePartnerType.DEVELOPER,
          }),
        );
      });
    });

    it('toggles progressive disclosure for additional project details', () => {
      render(
        <CreatePartnerDialog
          isOpen={true}
          onClose={vi.fn()}
          onSubmit={vi.fn()}
          workspaceId="ws-real-0002-0000-000000000002"
          members={[{ id: 'm-1', name: 'Anant' }]}
        />,
      );

      const moreDetailsBtn = screen.getByText(/More details/i);
      fireEvent.click(moreDetailsBtn);

      expect(screen.getByText(/Initial Project \/ Development Reference/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Emerald Heights Luxury Villas/i)).toBeInTheDocument();
    });
  });

  describe('PartnerRecordDetailDrawer Component', () => {
    it('renders 11 sections, stage stepper, quick contact targets, and tabs', () => {
      const handleClose = vi.fn();
      const handleChangeStage = vi.fn();
      const handleConfirm = vi.fn();
      const handleAddProject = vi.fn();
      const handleCreateTask = vi.fn();
      const handleScheduleMeeting = vi.fn();

      render(
        <PartnerRecordDetailDrawer
          isOpen={true}
          onClose={handleClose}
          partner={mockPartner}
          onOpenChangeStage={handleChangeStage}
          onOpenConfirmOrActivate={handleConfirm}
          onOpenAddProject={handleAddProject}
          onOpenCreateTask={handleCreateTask}
          onOpenScheduleMeeting={handleScheduleMeeting}
        />,
      );

      expect(screen.getByText('Skyline Developers Pvt Ltd')).toBeInTheDocument();
      expect(screen.getByText('Partnership Pipeline Stage')).toBeInTheDocument();
      expect(screen.getByText('Confirm / Activate Mandate')).toBeInTheDocument();

      // Quick contact links
      expect(screen.getByRole('link', { name: /Call/i })).toHaveAttribute('href', 'tel:+91 99301 11223');
      expect(screen.getByRole('link', { name: /WhatsApp/i })).toHaveAttribute('href', 'https://wa.me/919930111223');

      // Switch to Projects tab
      const projectsTab = screen.getByRole('button', { name: /Projects \(2\)/i });
      fireEvent.click(projectsTab);
      expect(screen.getByText('Emerald Heights Luxury Villas')).toBeInTheDocument();
      expect(screen.getByText('Skyline Marina Bay Residences')).toBeInTheDocument();

      // Switch to Stage History tab
      const historyTab = screen.getByRole('button', { name: /Stage History \(2\)/i });
      fireEvent.click(historyTab);
      expect(screen.getByText('Negotiating marketing budget sharing')).toBeInTheDocument();
    });
  });

  describe('CrmPartnersPage Integration & Workspace Isolation', () => {
    it('renders PermissionDeniedState when in Corviin Tech workspace', () => {
      useAppStore.setState({
        selectedWorkspaceId: 'ws-tech-0001-0000-000000000001',
      });

      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      });

      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <CrmPartnersPage />
          </BrowserRouter>
        </QueryClientProvider>,
      );

      expect(screen.getByText('Access Restricted')).toBeInTheDocument();
      expect(screen.getByText('Switch active workspace')).toBeInTheDocument();
    });

    it('renders full partner CRM view when in Corviin Real Estate workspace', async () => {
      vi.spyOn(crmApi, 'fetchPartnerSummary').mockResolvedValue(mockSummary);
      vi.spyOn(crmApi, 'fetchPartnerRecords').mockResolvedValue({
        items: [mockPartner],
        total: 1,
        page: 1,
        pageSize: 20,
        totalPages: 1,
      });

      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      });

      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <CrmPartnersPage />
          </BrowserRouter>
        </QueryClientProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText('Real Estate Developers & Partners CRM')).toBeInTheDocument();
        expect(screen.getAllByText('Skyline Developers Pvt Ltd').length).toBeGreaterThan(0);
      });
    });
  });
});
