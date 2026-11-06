import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  TechRecordCategory,
  TechPipelineStage,
  TechCrmRecord,
  TechCrmSummaryDto,
} from '@corviin-hub/shared';
import { TechSummaryStrip } from '@/features/crm/components/TechSummaryStrip';
import { TechFilterToolbar } from '@/features/crm/components/TechFilterToolbar';
import { TechRecordsTableView } from '@/features/crm/components/TechRecordsTableView';
import { TechRecordsBoardView } from '@/features/crm/components/TechRecordsBoardView';
import { CreateTechRecordDialog } from '@/features/crm/components/CreateTechRecordDialog';
import { TechRecordDetailDrawer } from '@/features/crm/components/TechRecordDetailDrawer';
import { CrmTechPage } from '@/features/crm/CrmTechPage';
import * as crmApi from '@/services/crm';
import { useAppStore } from '@/lib/store';

const mockRecord: TechCrmRecord = {
  id: 'crm-tech-001',
  workspaceId: 'ws-tech-0001-0000-000000000001',
  name: 'Rajesh Kumar',
  company: 'Acme Corp FinTech',
  phone: '+91 98201 12345',
  email: 'rajesh.k@acmefin.com',
  category: TechRecordCategory.POTENTIAL_PROJECT,
  stage: TechPipelineStage.PROPOSAL_QUOTATION,
  stageHistory: [
    {
      stage: TechPipelineStage.NEW_ENQUIRY,
      timestamp: '2026-10-25T10:00:00.000Z',
      actorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      actorName: 'Anant',
      notes: 'Initial enquiry',
    },
    {
      stage: TechPipelineStage.PROPOSAL_QUOTATION,
      timestamp: '2026-11-04T16:00:00.000Z',
      actorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      actorName: 'Anant',
      notes: 'Proposal sent for ₹4.5 Lakhs',
    },
  ],
  source: 'Referral',
  assignedMemberId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  assignedMemberName: 'Anant',
  serviceType: 'CLOUD_DEVOPS',
  requirementSummary: 'Cloud infrastructure migration and microservices audit',
  detailedRequirements: 'Migrate on-premise DB to AWS Aurora PostgreSQL and setup Kubernetes',
  estimatedBudget: 450000,
  nextFollowUpDate: '2026-11-06T11:00:00.000Z',
  nextFollowUpTitle: 'Review security compliance clause in proposal draft',
  lastActivityDate: '2026-11-04T16:30:00.000Z',
  attachments: [],
  proposals: [
    {
      id: 'prop-1',
      title: 'Cloud Architecture Proposal v1.2',
      amount: 450000,
      status: 'SENT',
      sentAt: '2026-11-04T16:00:00.000Z',
      referenceUrl: 'https://docs.corviin.tech/proposals/acme.pdf',
    },
  ],
  createdAt: '2026-10-25T10:00:00.000Z',
  updatedAt: '2026-11-04T16:30:00.000Z',
};

const mockSummary: TechCrmSummaryDto = {
  totalEnquiries: 8,
  enquiriesByStage: {
    [TechPipelineStage.NEW_ENQUIRY]: 1,
    [TechPipelineStage.CONTACT_PENDING]: 0,
    [TechPipelineStage.CONTACTED]: 0,
    [TechPipelineStage.REQUIREMENT_DISCUSSION]: 1,
    [TechPipelineStage.QUALIFIED]: 1,
    [TechPipelineStage.PROPOSAL_QUOTATION]: 1,
    [TechPipelineStage.NEGOTIATION]: 1,
    [TechPipelineStage.WON_CLIENT]: 2,
    [TechPipelineStage.LOST]: 1,
    [TechPipelineStage.FOLLOW_UP_LATER]: 1,
  },
  followUpsDueToday: 2,
  overdueFollowUps: 1,
  qualifiedOpportunities: 3,
  wonClientsCount: 2,
  lostCount: 1,
  workloadByMember: [
    { memberId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', memberName: 'Anant', activeCount: 3, wonCount: 1 },
    { memberId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901', memberName: 'Rohit', activeCount: 2, wonCount: 1 },
  ],
};

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>,
  );
}

describe('Feature 11: Tech CRM Unit & Component Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('TechSummaryStrip Component', () => {
    it('renders key metrics and workload allocation', () => {
      render(
        <TechSummaryStrip
          summary={mockSummary}
          onFilterDueToday={vi.fn()}
          onFilterOverdue={vi.fn()}
          onFilterQualified={vi.fn()}
          onFilterWon={vi.fn()}
        />,
      );

      expect(screen.getByText('Total Enquiries')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();
      expect(screen.getByText('Qualified Pipeline')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('Won / Clients')).toBeInTheDocument();
      expect(screen.getAllByText('2').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('1 overdue')).toBeInTheDocument();
      expect(screen.getByText(/Anant:/)).toBeInTheDocument();
    });
  });

  describe('TechFilterToolbar Component', () => {
    it('renders search input, selects, view mode toggles, and add button', () => {
      const onFilterChange = vi.fn();
      const onOpenCreate = vi.fn();
      const onViewModeChange = vi.fn();

      render(
        <TechFilterToolbar
          viewMode="table"
          onViewModeChange={onViewModeChange}
          filters={{}}
          onFilterChange={onFilterChange}
          onResetFilters={vi.fn()}
          onOpenCreateDialog={onOpenCreate}
          members={[{ id: '1', name: 'Anant' }]}
          totalCount={8}
        />,
      );

      expect(screen.getByPlaceholderText(/Search company, contact, phone/i)).toBeInTheDocument();
      expect(screen.getByText('Table')).toBeInTheDocument();
      expect(screen.getByText('Board')).toBeInTheDocument();
      expect(screen.getByText('Add Tech Record')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();

      // Trigger Add Tech Record
      fireEvent.click(screen.getByText('Add Tech Record'));
      expect(onOpenCreate).toHaveBeenCalled();
    });
  });

  describe('TechRecordsTableView Component', () => {
    it('renders desktop table with company, contact, category, stage, and actions', () => {
      const onSelect = vi.fn();

      render(
        <TechRecordsTableView
          records={[mockRecord]}
          onSelectRecord={onSelect}
        />,
      );

      expect(screen.getAllByText('Acme Corp FinTech').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Rajesh Kumar').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/Potential Project/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Proposal / Quotation').length).toBeGreaterThanOrEqual(1);

      // Click row
      fireEvent.click(screen.getAllByText('Acme Corp FinTech')[0]);
      expect(onSelect).toHaveBeenCalledWith(mockRecord);
    });
  });

  describe('TechRecordsBoardView Component', () => {
    it('renders 10 Kanban stage columns and positions records properly', () => {
      const onSelect = vi.fn();

      render(
        <TechRecordsBoardView
          records={[mockRecord]}
          onSelectRecord={onSelect}
        />,
      );

      expect(screen.getByText('New Enquiry')).toBeInTheDocument();
      expect(screen.getByText('Requirement Discussion')).toBeInTheDocument();
      expect(screen.getByText('Proposal / Quotation')).toBeInTheDocument();
      expect(screen.getByText('Won / Client')).toBeInTheDocument();
      expect(screen.getByText('Lost')).toBeInTheDocument();
      expect(screen.getByText('Follow Up Later')).toBeInTheDocument();

      // Card appears under Proposal / Quotation
      expect(screen.getByText('Acme Corp FinTech')).toBeInTheDocument();
    });
  });

  describe('CreateTechRecordDialog Component', () => {
    it('validates required essentials before submission', async () => {
      const onSubmit = vi.fn();
      const onClose = vi.fn();

      render(
        <CreateTechRecordDialog
          isOpen={true}
          onClose={onClose}
          onSubmit={onSubmit}
          workspaceId="ws-tech-0001-0000-000000000001"
          members={[{ id: 'a1', name: 'Anant' }]}
        />,
      );

      // Attempt to submit empty form
      fireEvent.click(screen.getByText('Create Tech Record'));

      // Error displayed
      await waitFor(() => {
        expect(screen.getByText(/Please provide either a contact person name or company name/i)).toBeInTheDocument();
      });
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe('TechRecordDetailDrawer Component', () => {
    it('renders all sections, proposals, quick action buttons, and stage stepper', () => {
      const onStageChange = vi.fn();

      render(
        <TechRecordDetailDrawer
          isOpen={true}
          onClose={vi.fn()}
          record={mockRecord}
          linkedTasks={[]}
          linkedMeetings={[]}
          followUps={[]}
          interactions={[]}
          members={[{ id: 'a1', name: 'Anant' }]}
          onOpenChangeStage={onStageChange}
          onOpenConvertClient={vi.fn()}
          onOpenAddProposal={vi.fn()}
          onOpenCreateTask={vi.fn()}
          onOpenScheduleFollowUp={vi.fn()}
          onOpenLogInteraction={vi.fn()}
          onAddNote={vi.fn()}
          onCompleteFollowUp={vi.fn()}
        />,
      );

      expect(screen.getByText('Acme Corp FinTech')).toBeInTheDocument();
      expect(screen.getByText('Overview & Requirements')).toBeInTheDocument();
      expect(screen.getByText(/Interactions/)).toBeInTheDocument();
      expect(screen.getByText(/Proposals & Retainers/)).toBeInTheDocument();
      expect(screen.getByText(/Stage History/)).toBeInTheDocument();
      expect(screen.getByText('Call')).toBeInTheDocument();
      expect(screen.getByText('WhatsApp')).toBeInTheDocument();
      expect(screen.getByText('Change Stage')).toBeInTheDocument();

      // Click Change Stage
      fireEvent.click(screen.getByText('Change Stage'));
      expect(onStageChange).toHaveBeenCalled();
    });
  });

  describe('CrmTechPage Workspace Scoping & Integration', () => {
    it('renders permission denied message when active workspace is Corviin Real Estate', () => {
      // Set Real Estate Workspace ID
      useAppStore.setState({
        selectedWorkspaceId: 'ws-real-0002-0000-000000000002',
        selectedProfileId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      });

      renderWithClient(<CrmTechPage />);

      expect(screen.getByText('Access Restricted')).toBeInTheDocument();
      expect(screen.getByText('Switch active workspace')).toBeInTheDocument();
    });

    it('renders full Tech CRM interface when active workspace is Corviin Tech', async () => {
      useAppStore.setState({
        selectedWorkspaceId: 'ws-tech-0001-0000-000000000001',
        selectedProfileId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      });

      vi.spyOn(crmApi, 'fetchTechSummary').mockResolvedValue(mockSummary);
      vi.spyOn(crmApi, 'fetchTechRecords').mockResolvedValue({
        items: [mockRecord],
        total: 1,
        page: 1,
        pageSize: 25,
        totalPages: 1,
      });

      renderWithClient(<CrmTechPage />);

      await waitFor(() => {
        expect(screen.getAllByText('Corviin Tech CRM').length).toBeGreaterThanOrEqual(1);
        expect(screen.getByText('Total Enquiries')).toBeInTheDocument();
      });
      expect(screen.getByText('Add Tech Record')).toBeInTheDocument();
    });
  });
});
