import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import {
  CampaignItem,
  CampaignStage,
  ContentStatus,
  ContentPlatform,
  TaskPriority,
} from '@corviin-hub/shared';
import { CampaignsSummaryStrip } from '../features/campaigns/components/CampaignsSummaryStrip';
import { CampaignsTableView } from '../features/campaigns/components/CampaignsTableView';
import { CampaignsBoardView } from '../features/campaigns/components/CampaignsBoardView';
import { CampaignStageStepper } from '../features/campaigns/components/CampaignStageStepper';
import { StageWorkspace } from '../features/campaigns/components/StageWorkspace';
import { CampaignAssetsTab } from '../features/campaigns/components/CampaignAssetsTab';
import { CampaignTasksTab } from '../features/campaigns/components/CampaignTasksTab';
import { AdvanceStageDialog } from '../features/campaigns/components/AdvanceStageDialog';
import { CampaignsPage } from '../features/campaigns/CampaignsPage';
import * as campaignsService from '../services/campaigns';

const mockCampaign: CampaignItem = {
  id: 'cmp-tech-001',
  workspaceId: 'ws-tech-0001-0000-000000000001',
  title: 'Corviin CRM v2.0 Launch Video & Demo Sprint',
  description: 'Comprehensive product walkthrough highlighting zero-animation speed and enterprise APIs.',
  stage: CampaignStage.SCRIPTING_PLANNING,
  ownerId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  startDate: '2026-11-01T09:00:00.000Z',
  targetPublishDate: '2026-11-20T17:00:00.000Z',
  platform: ContentPlatform.YOUTUBE,
  priority: TaskPriority.HIGH,
  status: ContentStatus.IN_PROGRESS,
  progressPercent: 35,
  objective: 'Demonstrate zero animation speed',
  targetAudience: 'Engineering Leaders',
  conceptNotes: 'Focus on sub-second interactions',
  referenceLinks: ['https://linear.app'],
  scripts: [
    {
      id: 'scr-1',
      versionNumber: 1,
      content: 'Script content body',
      hook: 'Stop waiting for slow animations',
      status: 'DRAFT',
      authorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      authorName: 'Anant',
      timestamp: '2026-11-04T12:00:00.000Z',
    },
  ],
  footageChecklist: [
    { id: 'ftg-1', label: 'Screen recording of Kanban', category: 'SCREEN_RECORDING', status: 'DONE' },
  ],
  assetLinks: [
    {
      id: 'link-1',
      assetId: 'ast-1',
      campaignId: 'cmp-tech-001',
      workspaceId: 'ws-tech-0001-0000-000000000001',
      title: 'Studio Feed 4K',
      fileName: 'studio_4k.mp4',
      fileSize: 104857600,
      mimeType: 'video/mp4',
      category: 'RAW_FOOTAGE',
      stage: CampaignStage.RECORDING_UPLOAD,
      url: 'https://cdn.corviin.com/studio_4k.mp4',
      uploadedBy: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      uploadedByName: 'Anant',
      createdAt: '2026-11-04T10:00:00.000Z',
    },
  ],
  stageHistory: [
    {
      id: 'sth-1',
      fromStage: CampaignStage.INITIAL_IDEA,
      toStage: CampaignStage.SCRIPTING_PLANNING,
      actorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      actorName: 'Anant',
      timestamp: '2026-11-02T10:00:00.000Z',
      notes: 'Concept approved',
    },
  ],
  contentItems: [],
  rescheduleHistory: [],
  activity: [],
  createdAt: '2026-11-01T09:00:00.000Z',
  updatedAt: '2026-11-04T12:00:00.000Z',
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

describe('Feature 08 — Campaigns', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('CampaignsSummaryStrip', () => {
    it('renders overview counts across all 5 stages', () => {
      render(<CampaignsSummaryStrip campaigns={[mockCampaign]} />);

      expect(screen.getByText('All Campaigns')).toBeInTheDocument();
      expect(screen.getAllByText('1').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('1. Ideation')).toBeInTheDocument();
      expect(screen.getByText('2. Scripting')).toBeInTheDocument();
      expect(screen.getByText('3 & 4. Production')).toBeInTheDocument();
      expect(screen.getByText('5. Published')).toBeInTheDocument();
    });
  });

  describe('CampaignStageStepper', () => {
    it('renders all 5 stages in order and indicates active progress', () => {
      render(
        <CampaignStageStepper
          currentStage={CampaignStage.SCRIPTING_PLANNING}
          activeViewStage={CampaignStage.SCRIPTING_PLANNING}
          onSelectStage={vi.fn()}
        />,
      );

      expect(screen.getByText('Stage 1')).toBeInTheDocument();
      expect(screen.getByText('Initial Idea')).toBeInTheDocument();
      expect(screen.getByText('Stage 2')).toBeInTheDocument();
      expect(screen.getByText('Scripting & Planning')).toBeInTheDocument();
      expect(screen.getByText('Stage 3')).toBeInTheDocument();
      expect(screen.getByText('Recording & Asset Upload')).toBeInTheDocument();
      expect(screen.getByText('Stage 4')).toBeInTheDocument();
      expect(screen.getByText('Editing & Final Asset')).toBeInTheDocument();
      expect(screen.getByText('Stage 5')).toBeInTheDocument();
      expect(screen.getByText('Posting & Completion')).toBeInTheDocument();
    });
  });

  describe('StageWorkspace (Stage 2: Scripting)', () => {
    it('displays script revisions and allows approving script', async () => {
      const onApproveScript = vi.fn().mockResolvedValue(undefined);

      render(
        <StageWorkspace
          campaign={mockCampaign}
          viewingStage={CampaignStage.SCRIPTING_PLANNING}
          workspaceId="ws-tech-0001-0000-000000000001"
          onUpdateCampaign={vi.fn()}
          onAddScriptVersion={vi.fn()}
          onUpdateScriptStatus={onApproveScript}
          onUpdateFootageChecklist={vi.fn()}
        />,
      );

      expect(screen.getByText('Stage 2: Scripting & Planning Workspace')).toBeInTheDocument();
      expect(screen.getByText('"Stop waiting for slow animations"')).toBeInTheDocument();
      expect(screen.getByText('Script content body')).toBeInTheDocument();

      const approveBtn = screen.getByText('Approve Script');
      fireEvent.click(approveBtn);

      await waitFor(() => {
        expect(onApproveScript).toHaveBeenCalledWith('scr-1', 'APPROVED', '');
      });
    });
  });

  describe('CampaignAssetsTab', () => {
    it('shows only campaign-linked assets and handles unlinking', async () => {
      const onUnlink = vi.fn().mockResolvedValue(undefined);

      render(
        <CampaignAssetsTab
          assets={mockCampaign.assetLinks}
          campaignStage={CampaignStage.SCRIPTING_PLANNING}
          onLinkAsset={vi.fn()}
          onUnlinkAsset={onUnlink}
        />,
      );

      expect(screen.getByText('Studio Feed 4K')).toBeInTheDocument();
      expect(screen.getByText('studio_4k.mp4')).toBeInTheDocument();

      const unlinkBtn = screen.getByText('Unlink');
      fireEvent.click(unlinkBtn);

      await waitFor(() => {
        expect(onUnlink).toHaveBeenCalledWith('link-1');
      });
    });
  });

  describe('CampaignTasksTab', () => {
    it('renders stage tasks and creates task via shared task engine', async () => {
      const onAddTask = vi.fn().mockResolvedValue(undefined);
      const members = [{ id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', displayName: 'Anant' }];

      render(
        <CampaignTasksTab
          tasks={[]}
          campaignStage={CampaignStage.SCRIPTING_PLANNING}
          members={members}
          onAddTask={onAddTask}
          onToggleTaskStatus={vi.fn()}
        />,
      );

      expect(screen.getByText('Stage Tasks (Shared Task Engine)')).toBeInTheDocument();

      // Open task dialog
      fireEvent.click(screen.getByText('Add Stage Task'));
      expect(screen.getByText('Add Campaign Task')).toBeInTheDocument();

      fireEvent.change(screen.getByPlaceholderText('e.g. Conduct script review with Rohit...'), {
        target: { value: 'Review scene timings' },
      });

      fireEvent.click(screen.getByText('Create Shared Task'));

      await waitFor(() => {
        expect(onAddTask).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Review scene timings',
            stage: CampaignStage.SCRIPTING_PLANNING,
          }),
        );
      });
    });
  });

  describe('AdvanceStageDialog', () => {
    it('blocks advancing to recording when script is not approved', () => {
      const unapprovedCampaign: CampaignItem = {
        ...mockCampaign,
        scriptApproved: false,
        scripts: [{ ...mockCampaign.scripts![0], status: 'DRAFT' }],
      };

      render(
        <AdvanceStageDialog
          open={true}
          onClose={vi.fn()}
          campaign={unapprovedCampaign}
          targetStage={CampaignStage.RECORDING_UPLOAD}
          onConfirm={vi.fn()}
        />,
      );

      expect(screen.getByText('Stage Prerequisite Not Met')).toBeInTheDocument();
      expect(screen.getByText(/Script must be officially marked APPROVED/)).toBeInTheDocument();
    });

    it('allows advancing to recording when script is approved', async () => {
      const approvedCampaign: CampaignItem = {
        ...mockCampaign,
        scriptApproved: true,
      };

      const onConfirm = vi.fn().mockResolvedValue(undefined);

      render(
        <AdvanceStageDialog
          open={true}
          onClose={vi.fn()}
          campaign={approvedCampaign}
          targetStage={CampaignStage.RECORDING_UPLOAD}
          onConfirm={onConfirm}
        />,
      );

      expect(screen.getByText(/All stage prerequisites verified/)).toBeInTheDocument();

      fireEvent.click(screen.getByText('Advance to RECORDING_UPLOAD'));

      await waitFor(() => {
        expect(onConfirm).toHaveBeenCalledWith(CampaignStage.RECORDING_UPLOAD, undefined);
      });
    });
  });

  describe('CampaignsPage', () => {
    it('fetches and displays campaigns in list and board views', async () => {
      vi.spyOn(campaignsService, 'fetchCampaigns').mockResolvedValue([mockCampaign]);

      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <CampaignsPage />
        </Wrapper>,
      );

      await waitFor(() => {
        expect(screen.getByText('Corviin CRM v2.0 Launch Video & Demo Sprint')).toBeInTheDocument();
      });

      // Switch to List View
      const listBtn = screen.getByLabelText('List View');
      fireEvent.click(listBtn);

      expect(screen.getByText('Campaign Title')).toBeInTheDocument();
      expect(screen.getByText('Platform')).toBeInTheDocument();
      expect(screen.getByText('Workspace')).toBeInTheDocument();
    });
  });
});

