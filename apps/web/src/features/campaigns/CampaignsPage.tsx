import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CampaignItem, CreateCampaignDto } from '@corviin-hub/shared';
import { useAppStore } from '@/lib/store';
import { useProfiles } from '@/hooks/useProfiles';
import { fetchCampaigns, createCampaign } from '@/services/campaigns';
import { CampaignsSummaryStrip } from './components/CampaignsSummaryStrip';
import { CampaignsFilterToolbar } from './components/CampaignsFilterToolbar';
import { CampaignsTableView } from './components/CampaignsTableView';
import { CampaignsBoardView } from './components/CampaignsBoardView';
import { CreateCampaignDialog } from './components/CreateCampaignDialog';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/States';
import { Megaphone } from 'lucide-react';

export function CampaignsPage() {
  const queryClient = useQueryClient();
  const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId) || 'ws-tech-0001-0000-000000000001';
  const { data: profiles = [] } = useProfiles();

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedOwnerId, setSelectedOwnerId] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [viewMode, setViewMode] = useState<'LIST' | 'BOARD'>('BOARD');

  // Dialog State
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Fetch Campaigns
  const {
    data: campaigns = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      'campaigns',
      selectedWorkspaceId,
      selectedStage,
      selectedPlatform,
      selectedOwnerId,
      selectedPriority,
      searchQuery,
    ],
    queryFn: () =>
      fetchCampaigns(selectedWorkspaceId, {
        stage: selectedStage || undefined,
        platform: selectedPlatform || undefined,
        ownerId: selectedOwnerId || undefined,
        priority: selectedPriority || undefined,
        search: searchQuery || undefined,
      }),
  });

  const handleCreateCampaign = async (dto: CreateCampaignDto) => {
    await createCampaign(dto);
    await queryClient.invalidateQueries({ queryKey: ['campaigns'] });
  };

  const getMemberName = (id: string) => {
    const prof = profiles.find((p) => p.id === id);
    return prof ? prof.displayName : 'Team Member';
  };

  return (
    <div className="space-y-4">
      {/* 1. Header Information */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
        <div>
          <h1 className="text-lg font-bold text-ch-text-primary tracking-tight">Campaign Operations</h1>
          <p className="text-xs text-ch-text-secondary mt-0.5">
            Manage the linear 5-stage production pipeline from Initial Idea to Posting & Completion.
          </p>
        </div>
      </div>

      {/* 2. Overview Metrics Strip */}
      <CampaignsSummaryStrip campaigns={campaigns} />

      {/* 3. Filter Toolbar & View Switcher */}
      <CampaignsFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedStage={selectedStage}
        onStageChange={setSelectedStage}
        selectedPlatform={selectedPlatform}
        onPlatformChange={setSelectedPlatform}
        selectedOwnerId={selectedOwnerId}
        onOwnerIdChange={setSelectedOwnerId}
        selectedPriority={selectedPriority}
        onPriorityChange={setSelectedPriority}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        members={profiles}
        onOpenCreate={() => setIsCreateOpen(true)}
        onReset={() => {
          setSearchQuery('');
          setSelectedStage('');
          setSelectedPlatform('');
          setSelectedOwnerId('');
          setSelectedPriority('');
        }}
      />

      {/* 4. Content Views */}
      {isLoading ? (
        <LoadingState message="Loading operational campaigns..." />
      ) : isError ? (
        <ErrorState
          title="Failed to load campaigns"
          message="Could not retrieve campaign records for this workspace."
          onRetry={() => refetch()}
        />
      ) : campaigns.length === 0 ? (
        <EmptyState
          title="No campaigns found"
          description="Create your first campaign or clear active filters to inspect existing production sprints."
          action={{
            label: "Create Campaign",
            onClick: () => setIsCreateOpen(true),
          }}
        />
      ) : viewMode === 'LIST' ? (
        <CampaignsTableView campaigns={campaigns} getMemberName={getMemberName} />
      ) : (
        <CampaignsBoardView campaigns={campaigns} getMemberName={getMemberName} />
      )}

      {/* 5. Create Campaign Dialog */}
      <CreateCampaignDialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        workspaceId={selectedWorkspaceId}
        members={profiles}
        onCreate={handleCreateCampaign}
      />
    </div>
  );
}
