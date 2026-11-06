import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  CrmType,
  CrmFollowUpStatus,
  CrmInteractionType,
  CrmRecordSummaryItem,
  CrmFollowUpItem,
  CrmInteractionItem,
  CrmOverviewResponseDto,
} from '@corviin-hub/shared';
import { CrmMetricsCards } from '@/features/crm/components/CrmMetricsCards';
import { CrmEntryCards } from '@/features/crm/components/CrmEntryCards';
import { CrmGlobalSearch } from '@/features/crm/components/CrmGlobalSearch';
import { CrmUpcomingFollowUps } from '@/features/crm/components/CrmUpcomingFollowUps';
import { CrmRecentInteractionsTimeline } from '@/features/crm/components/CrmRecentInteractionsTimeline';
import { QuickCreateCrmDialog } from '@/features/crm/components/QuickCreateCrmDialog';
import { CrmPage } from '@/features/crm/CrmPage';
import * as crmApi from '@/services/crm';

const mockTechRecord: CrmRecordSummaryItem = {
  id: 'crm-tech-001',
  workspaceId: 'ws-tech-0001-0000-000000000001',
  type: CrmType.TECH_LEAD,
  name: 'Acme Financial Systems',
  company: 'Acme Corp FinTech',
  phone: '+91 98201 12345',
  email: 'rajesh.k@acmefin.com',
  stage: 'Proposal/Quotation',
  assignedMemberId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  assignedMemberName: 'Anant',
  nextFollowUpDate: '2026-11-06T11:00:00.000Z',
  nextFollowUpTitle: 'Review security compliance clause in proposal draft',
  lastActivityDate: '2026-11-04T16:30:00.000Z',
  requirementSummary: 'Cloud infrastructure migration and microservices audit',
  estimatedValue: 450000,
  createdAt: '2026-10-25T10:00:00.000Z',
  updatedAt: '2026-11-04T16:30:00.000Z',
};

const mockFollowUp: CrmFollowUpItem = {
  id: 'fup-1',
  workspaceId: 'ws-tech-0001-0000-000000000001',
  recordId: 'crm-tech-001',
  recordType: CrmType.TECH_LEAD,
  recordTitle: 'Acme Financial Systems',
  title: 'Call to review revised payment milestones',
  assignedMemberId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  assignedMemberName: 'Anant',
  dueDate: '2026-11-06T11:00:00.000Z',
  status: CrmFollowUpStatus.PENDING,
  createdAt: '2026-11-04T10:00:00.000Z',
  updatedAt: '2026-11-04T10:00:00.000Z',
};

const mockInteraction: CrmInteractionItem = {
  id: 'int-1',
  workspaceId: 'ws-tech-0001-0000-000000000001',
  recordId: 'crm-tech-001',
  recordType: CrmType.TECH_LEAD,
  type: CrmInteractionType.CALL,
  title: 'Phone Consultation with Rajesh (CTO)',
  description: 'Discussed architecture and timelines.',
  actorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  actorName: 'Anant',
  timestamp: '2026-11-04T16:30:00.000Z',
};

const mockOverview: CrmOverviewResponseDto = {
  workspaceId: 'ws-tech-0001-0000-000000000001',
  workspaceType: 'TECH',
  techMetrics: {
    openEnquiriesCount: 3,
    qualifiedLeadsCount: 1,
    proposalsOutCount: 1,
    activeClientsCount: 1,
    techPartnersCount: 1,
    pendingFollowUpsCount: 2,
    overdueFollowUpsCount: 0,
  },
  recentRecords: [mockTechRecord],
  upcomingFollowUps: [mockFollowUp],
  recentInteractions: [mockInteraction],
};

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>,
  );
}

describe('Feature 10 — CRM Overview', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('CrmMetricsCards', () => {
    it('renders Tech CRM metrics for Tech workspace', () => {
      render(
        <CrmMetricsCards
          workspaceType="TECH"
          techMetrics={mockOverview.techMetrics}
        />,
      );

      expect(screen.getByText('Open Enquiries')).toBeInTheDocument();
      expect(screen.getByText('Qualified Leads')).toBeInTheDocument();
      expect(screen.getByText('Proposals Out')).toBeInTheDocument();
      expect(screen.getByText('Active Clients')).toBeInTheDocument();
      expect(screen.getByText('Follow-ups Due')).toBeInTheDocument();
    });

    it('renders Real Estate CRM metrics for Real Estate workspace', () => {
      render(
        <CrmMetricsCards
          workspaceType="REAL_ESTATE"
          realEstateMetrics={{
            activeDevelopersCount: 3,
            channelPartnersCount: 1,
            activeBuyersCount: 4,
            siteVisitsPendingCount: 2,
            pendingFollowUpsCount: 3,
            overdueFollowUpsCount: 1,
          }}
        />,
      );

      expect(screen.getByText('Developers & Lands')).toBeInTheDocument();
      expect(screen.getByText('Active Buyers')).toBeInTheDocument();
      expect(screen.getByText('Site Visits Pending')).toBeInTheDocument();
      expect(screen.getByText('Channel Partners')).toBeInTheDocument();
      expect(screen.getByText(/1 overdue/i)).toBeInTheDocument();
    });
  });

  describe('CrmEntryCards', () => {
    it('renders Tech CRM pipeline cards in Tech workspace', () => {
      const onQuickCreate = vi.fn();
      render(
        <BrowserRouter>
          <CrmEntryCards workspaceType="TECH" onQuickCreate={onQuickCreate} />
        </BrowserRouter>,
      );

      expect(screen.getByText('Enquiries & Tech Leads')).toBeInTheDocument();
      expect(screen.getByText('Clients & Retainers')).toBeInTheDocument();
      expect(screen.getByText('Technology Partners')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Add Lead'));
      expect(onQuickCreate).toHaveBeenCalledWith(CrmType.TECH_LEAD);
    });

    it('renders Real Estate CRM pipeline cards in Real Estate workspace', () => {
      const onQuickCreate = vi.fn();
      render(
        <BrowserRouter>
          <CrmEntryCards workspaceType="REAL_ESTATE" onQuickCreate={onQuickCreate} />
        </BrowserRouter>,
      );

      expect(screen.getByText('Developers & Partners CRM')).toBeInTheDocument();
      expect(screen.getByText('Buyers & Property Customers CRM')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Add Partner / Developer'));
      expect(onQuickCreate).toHaveBeenCalledWith(CrmType.RE_PARTNER);
    });
  });

  describe('CrmGlobalSearch', () => {
    it('renders search input and record type selector', () => {
      renderWithProviders(
        <CrmGlobalSearch
          workspaceId="ws-tech-1"
          workspaceType="TECH"
          onScheduleFollowUp={vi.fn()}
        />,
      );

      expect(
        screen.getByPlaceholderText(/Search CRM by name, company, phone/i),
      ).toBeInTheDocument();
    });
  });

  describe('CrmUpcomingFollowUps', () => {
    it('renders follow-ups queue with action buttons', () => {
      const onComplete = vi.fn();
      const onOpenSchedule = vi.fn();

      render(
        <CrmUpcomingFollowUps
          followUps={[mockFollowUp]}
          onCompleteFollowUp={onComplete}
          onOpenSchedule={onOpenSchedule}
        />,
      );

      expect(screen.getByText('Upcoming Follow-ups Queue')).toBeInTheDocument();
      expect(screen.getByText('Call to review revised payment milestones')).toBeInTheDocument();
      expect(screen.getByText('Acme Financial Systems')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Mark Complete'));
      expect(onComplete).toHaveBeenCalledWith(mockFollowUp);
    });
  });

  describe('CrmRecentInteractionsTimeline', () => {
    it('renders interaction events with actor attribution', () => {
      render(
        <CrmRecentInteractionsTimeline
          interactions={[mockInteraction]}
          onOpenLogInteraction={vi.fn()}
        />,
      );

      expect(screen.getByText('Recent Interactions Timeline')).toBeInTheDocument();
      expect(screen.getByText('Phone Consultation with Rajesh (CTO)')).toBeInTheDocument();
      expect(screen.getByText('Logged by Anant')).toBeInTheDocument();
    });
  });

  describe('QuickCreateCrmDialog', () => {
    it('renders form fields and enforces required name and phone', () => {
      render(
        <QuickCreateCrmDialog
          isOpen={true}
          onClose={vi.fn()}
          workspaceId="ws-tech-1"
          workspaceType="TECH"
          onSuccess={vi.fn()}
        />,
      );

      expect(screen.getByText('Create New CRM Record')).toBeInTheDocument();
      expect(screen.getByText('Client / Lead Name *')).toBeInTheDocument();
      expect(screen.getByText('Phone Number (Required) *')).toBeInTheDocument();
    });
  });

  describe('CrmPage', () => {
    it('fetches overview and renders complete CRM dashboard', async () => {
      vi.spyOn(crmApi, 'fetchCrmOverview').mockResolvedValue(mockOverview);

      renderWithProviders(<CrmPage />);

      await waitFor(() => {
        expect(screen.getAllByText('CRM Overview').length).toBeGreaterThanOrEqual(1);
        expect(screen.getByText('Open Enquiries')).toBeInTheDocument();
        expect(screen.getByText('Enquiries & Tech Leads')).toBeInTheDocument();
        expect(screen.getByText('Upcoming Follow-ups Queue')).toBeInTheDocument();
        expect(screen.getByText('Recent Interactions Timeline')).toBeInTheDocument();
      });
    });
  });
});
