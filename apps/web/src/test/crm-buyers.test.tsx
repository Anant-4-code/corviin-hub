import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  RealEstateBuyerStage,
  BuyerPropertyConfiguration,
  BuyerPropertyType,
  BuyerBuyingTimeline,
  BuyerPurchasePurpose,
  RealEstateBuyerRecord,
  BuyerCrmSummaryDto,
} from '@corviin-hub/shared';
import { BuyerSummaryStrip } from '@/features/crm/components/BuyerSummaryStrip';
import { BuyerFilterToolbar } from '@/features/crm/components/BuyerFilterToolbar';
import { BuyerRecordsTableView } from '@/features/crm/components/BuyerRecordsTableView';
import { BuyerRecordsBoardView } from '@/features/crm/components/BuyerRecordsBoardView';
import { CreateBuyerDialog } from '@/features/crm/components/CreateBuyerDialog';
import { BuyerRecordDetailDrawer } from '@/features/crm/components/BuyerRecordDetailDrawer';
import { CrmBuyersPage } from '@/features/crm/CrmBuyersPage';
import * as crmApi from '@/services/crm';
import { useAppStore } from '@/lib/store';

const mockBuyer: any = {
  id: 'buyer-re-001',
  workspaceId: 'ws-real-0002-0000-000000000002',
  customerName: 'Vikram Malhotra',
  fullName: 'Vikram Malhotra',
  phone: '+91 98450 12345',
  email: 'vikram.m@techcorp.com',
  preferredContactMethod: 'WHATSAPP',
  stage: RealEstateBuyerStage.SITE_VISIT_PLANNED,
  propertyType: BuyerPropertyType.APARTMENT,
  configuration: BuyerPropertyConfiguration.THREE_BHK,
  minBudget: 18000000,
  maxBudget: 25000000,
  minBudgetINR: 18000000,
  maxBudgetINR: 25000000,
  locality: 'Sarjapur Road / Bellandur, Bangalore',
  preferredLocality: 'Sarjapur Road / Bellandur, Bangalore',
  buyingTimeline: BuyerBuyingTimeline.ONE_TO_THREE_MONTHS,
  timeline: BuyerBuyingTimeline.ONE_TO_THREE_MONTHS,
  purpose: BuyerPurchasePurpose.END_USE,
  preferredProject: 'Sobha Neopolis',
  enquirySource: 'Meta Ad Campaign (Instagram)',
  source: 'Meta Ad Campaign (Instagram)',
  campaignId: 'camp-re-001',
  assignedMemberId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  assignedMemberName: 'Anant',
  notes: 'Wants east-facing high floor unit with 2 car parking slots.',
  nextFollowUpDate: '2026-11-06T10:00:00.000Z',
  siteVisitIds: ['sv-1'],
  siteVisits: [
    {
      id: 'sv-1',
      buyerId: 'buyer-re-001',
      propertyName: 'Sobha Neopolis Phase 2',
      location: 'Panathur Main Road',
      unitNumber: 'Tower 4 - Unit 1402',
      visitDate: '2026-11-07',
      startTime: '11:00',
      endTime: '12:30',
      status: 'SCHEDULED',
      responsibleMemberId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      responsibleMemberName: 'Anant',
      feedbackNotes: 'Buyer family attending with parents.',
      calendarEventId: 'mtg-sv-001',
      createdAt: '2026-11-04T10:00:00.000Z',
    },
  ],
  sharedProperties: [
    {
      id: 'sp-1',
      buyerId: 'buyer-re-001',
      propertyName: 'Sobha Neopolis Phase 2',
      projectLocation: 'Panathur Road',
      propertyType: BuyerPropertyType.APARTMENT,
      configuration: BuyerPropertyConfiguration.THREE_BHK,
      estimatedPriceINR: 21500000,
      brochureUrl: 'https://sobha.example.com/neopolis.pdf',
      sharedAt: '2026-11-02T11:00:00.000Z',
      notes: 'Sent via WhatsApp, buyer liked high rise layout.',
    },
  ],
  linkedTasks: [
    {
      id: 'task-buyer-1',
      title: 'Call to confirm Saturday 11am site visit',
      status: 'TODO',
      priority: 'HIGH',
      assigneeName: 'Anant',
      deadline: '2026-11-06T17:00:00.000Z',
    },
  ],
  stageHistory: [
    {
      id: 'bsh-1',
      toStage: RealEstateBuyerStage.NEW_ENQUIRY,
      changedAt: '2026-10-28T09:00:00.000Z',
      changedById: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      changedByName: 'Anant',
      notes: 'Initial Instagram lead form',
    },
    {
      id: 'bsh-2',
      fromStage: RealEstateBuyerStage.NEW_ENQUIRY,
      toStage: RealEstateBuyerStage.SITE_VISIT_PLANNED,
      changedAt: '2026-11-03T11:00:00.000Z',
      changedById: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      changedByName: 'Anant',
      notes: 'Scheduled site visit for Saturday',
    },
  ],
  createdAt: '2026-10-28T09:00:00.000Z',
  updatedAt: '2026-11-04T10:00:00.000Z',
};

const mockSummary: any = {
  totalBuyers: 8,
  activePipelineCount: 6,
  inPipeline: 6,
  siteVisitsPlannedCount: 3,
  siteVisitsPlanned: 3,
  siteVisitsCompletedCount: 4,
  siteVisitsCompleted: 4,
  bookingsConvertedCount: 1,
  bookingsConverted: 1,
  overdueFollowUpsCount: 1,
  byConfiguration: {
    [BuyerPropertyConfiguration.ONE_BHK]: 0,
    [BuyerPropertyConfiguration.TWO_BHK]: 1,
    [BuyerPropertyConfiguration.THREE_BHK]: 4,
    [BuyerPropertyConfiguration.FOUR_PLUS_BHK]: 1,
    [BuyerPropertyConfiguration.VILLA]: 1,
    [BuyerPropertyConfiguration.PLOT_LAND]: 1,
    [BuyerPropertyConfiguration.COMMERCIAL]: 0,
    [BuyerPropertyConfiguration.OTHER]: 0,
  },
  byStage: {
    [RealEstateBuyerStage.NEW_ENQUIRY]: 1,
    [RealEstateBuyerStage.CONTACT_PENDING]: 1,
    [RealEstateBuyerStage.CONTACTED]: 1,
    [RealEstateBuyerStage.REQUIREMENT_CAPTURED]: 1,
    [RealEstateBuyerStage.QUALIFIED_BUYER]: 1,
    [RealEstateBuyerStage.PROPERTY_SHARED]: 1,
    [RealEstateBuyerStage.SITE_VISIT_PLANNED]: 1,
    [RealEstateBuyerStage.SITE_VISIT_COMPLETED]: 0,
    [RealEstateBuyerStage.FOLLOWUP_DISCUSSION]: 0,
    [RealEstateBuyerStage.BOOKING_CONVERTED]: 1,
    [RealEstateBuyerStage.NOT_INTERESTED]: 0,
    [RealEstateBuyerStage.LOST]: 0,
    [RealEstateBuyerStage.FOLLOW_UP_LATER]: 0,
  },
  byMember: [
    { memberId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', memberName: 'Anant', totalAssigned: 4, activeCount: 3 },
    { memberId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901', memberName: 'Rohit', totalAssigned: 2, activeCount: 2 },
    { memberId: 'c3d4e5f6-a7b8-9012-cdef-123456789012', memberName: 'Utkarsh', totalAssigned: 2, activeCount: 1 },
  ],
};

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Real Estate Buyers CRM (Feature 13)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAppStore.setState({
      selectedWorkspaceId: 'ws-real-0002-0000-000000000002',
      selectedProfileId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    });
  });

  describe('BuyerSummaryStrip', () => {
    it('renders key pipeline metrics correctly', () => {
      render(<BuyerSummaryStrip summary={mockSummary} />);

      expect(screen.getByText('Total Buyers')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();

      expect(screen.getByText('In Pipeline')).toBeInTheDocument();
      expect(screen.getByText('6')).toBeInTheDocument();

      expect(screen.getByText('Visits Planned')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();

      expect(screen.getByText('Bookings')).toBeInTheDocument();
      expect(screen.getAllByText('1').length).toBeGreaterThan(0);

      expect(screen.getByText('Overdue Follow-ups')).toBeInTheDocument();
    });
  });

  describe('BuyerFilterToolbar', () => {
    it('handles search input and filter changes', () => {
      const onFilterChange = vi.fn();
      const onViewModeChange = vi.fn();
      const onOpenCreate = vi.fn();

      render(
        <BuyerFilterToolbar
          filters={{ page: 1, pageSize: 20 }}
          onFilterChange={onFilterChange}
          viewMode="table"
          onViewModeChange={onViewModeChange}
          members={[{ id: 'm1', name: 'Anant' }]}
          onOpenCreate={onOpenCreate}
        />
      );

      const searchInput = screen.getByPlaceholderText(/Search buyers/i);
      fireEvent.change(searchInput, { target: { value: 'Vikram' } });
      expect(onFilterChange).toHaveBeenCalledWith(expect.objectContaining({ search: 'Vikram', page: 1 }));

      const createButton = screen.getByText('+ Add Buyer');
      fireEvent.click(createButton);
      expect(onOpenCreate).toHaveBeenCalled();

      const boardToggle = screen.getByTitle('Board View');
      fireEvent.click(boardToggle);
      expect(onViewModeChange).toHaveBeenCalledWith('board');
    });
  });

  describe('BuyerRecordsTableView', () => {
    it('renders buyer table headers, data rows and direct call / WhatsApp links', () => {
      const onSelect = vi.fn();
      render(
        <BuyerRecordsTableView
          records={[mockBuyer]}
          onSelectRecord={onSelect}
        />
      );

      expect(screen.getAllByText('Vikram Malhotra').length).toBeGreaterThan(0);
      expect(screen.getAllByText('3 BHK').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Site Visit Planned').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Sobha Neopolis').length).toBeGreaterThan(0);

      // Check quick contact links
      const callLinks = screen.getAllByTitle('Click to call');
      expect(callLinks[0]).toHaveAttribute('href', 'tel:+91 98450 12345');

      const waLinks = screen.getAllByTitle('Message on WhatsApp');
      expect(waLinks[0]).toHaveAttribute('href', 'https://wa.me/919845012345');
    });
  });

  describe('BuyerRecordsBoardView', () => {
    it('groups buyers by stage and displays cards in correct columns', () => {
      const onSelect = vi.fn();
      render(
        <BuyerRecordsBoardView
          records={[mockBuyer]}
          onSelectRecord={onSelect}
        />
      );

      expect(screen.getByText('Site Visit Planned')).toBeInTheDocument();
      expect(screen.getAllByText('Vikram Malhotra').length).toBeGreaterThan(0);
      expect(screen.getByText('📍 1 Site Visit')).toBeInTheDocument();
    });
  });

  describe('CreateBuyerDialog', () => {
    it('validates required fields and shows progressive disclosure toggle', () => {
      const onSubmit = vi.fn();
      const onClose = vi.fn();

      render(
        <CreateBuyerDialog
          isOpen={true}
          onClose={onClose}
          onSubmit={onSubmit}
          workspaceId="ws-real-0002-0000-000000000002"
          members={[{ id: 'm1', name: 'Anant' }]}
        />
      );

      expect(screen.getByText('Add New Real Estate Buyer')).toBeInTheDocument();
      expect(screen.getByText('► Add Property Preferences & Budget (Optional)')).toBeInTheDocument();

      // Click progressive disclosure
      fireEvent.click(screen.getByText('► Add Property Preferences & Budget (Optional)'));
      expect(screen.getByText('Min Budget (INR)')).toBeInTheDocument();
      expect(screen.getByText('Max Budget (INR)')).toBeInTheDocument();
    });
  });

  describe('BuyerRecordDetailDrawer', () => {
    it('renders buyer details, stepper, and navigates between tabs', () => {
      const onClose = vi.fn();
      render(
        <BuyerRecordDetailDrawer
          isOpen={true}
          onClose={onClose}
          buyer={mockBuyer}
          onOpenChangeStage={vi.fn()}
          onOpenScheduleSiteVisit={vi.fn()}
          onOpenShareProperty={vi.fn()}
          onOpenCreateTask={vi.fn()}
        />
      );

      expect(screen.getAllByText('Vikram Malhotra').length).toBeGreaterThan(0);
      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Shared Properties')).toBeInTheDocument();
      expect(screen.getByText('Site Visits')).toBeInTheDocument();
      expect(screen.getByText('Tasks')).toBeInTheDocument();
      expect(screen.getByText('History')).toBeInTheDocument();

      // Click Site Visits tab
      fireEvent.click(screen.getByText('Site Visits'));
      expect(screen.getByText('📍 Sobha Neopolis Phase 2')).toBeInTheDocument();
      expect(screen.getByText('Tower 4 - Unit 1402', { exact: false })).toBeInTheDocument();

      // Click Shared Properties tab
      fireEvent.click(screen.getByText('Shared Properties'));
      expect(screen.getByText('Sobha Neopolis Phase 2')).toBeInTheDocument();
      expect(screen.getByText('🔗 View Shared Brochure / Deck')).toBeInTheDocument();
    });
  });

  describe('CrmBuyersPage Workspace Guard', () => {
    it('displays PermissionDeniedState when in Corviin Tech workspace', async () => {
      useAppStore.setState({
        selectedWorkspaceId: 'ws-tech-0001-0000-000000000001',
      });

      renderWithProviders(<CrmBuyersPage />);

      expect(screen.getByText('Access Restricted')).toBeInTheDocument();
      expect(screen.getByText('Switch active workspace')).toBeInTheDocument();
    });

    it('loads and renders buyer CRM when in Corviin Real Estate workspace', async () => {
      vi.spyOn(crmApi, 'fetchBuyerSummary').mockResolvedValue(mockSummary);
      vi.spyOn(crmApi, 'fetchBuyerRecords').mockResolvedValue({
        items: [mockBuyer],
        total: 1,
        page: 1,
        pageSize: 20,
        totalPages: 1,
      });

      renderWithProviders(<CrmBuyersPage />);

      await waitFor(() => {
        expect(screen.getByText('Real Estate Buyers CRM')).toBeInTheDocument();
        expect(screen.getByText('Total Buyers')).toBeInTheDocument();
      });
    });
  });
});
