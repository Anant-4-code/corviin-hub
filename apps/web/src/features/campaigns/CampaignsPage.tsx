import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CampaignItem, CreateCampaignDto, CampaignStage, ContentStatus } from '@corviin-hub/shared';
import { useAppStore } from '@/lib/store';
import { useProfiles } from '@/hooks/useProfiles';
import { fetchCampaigns, createCampaign } from '@/services/campaigns';
import { CampaignsHeader } from './components/CampaignsHeader';
import { CampaignsKpiOverview } from './components/CampaignsKpiOverview';
import { CampaignsSummaryStrip } from './components/CampaignsSummaryStrip';
import { CampaignsFilterToolbar, CampaignViewMode } from './components/CampaignsFilterToolbar';
import { CampaignsGridView } from './components/CampaignsGridView';
import { CampaignsTableView } from './components/CampaignsTableView';
import { CampaignsBoardView } from './components/CampaignsBoardView';
import { CreateCampaignDialog } from './components/CreateCampaignDialog';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/States';

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
  const [completedOnly, setCompletedOnly] = useState(false);
  const [onHoldOnly, setOnHoldOnly] = useState(false);
  const [upcomingOnly, setUpcomingOnly] = useState(false);
  const [activeKpiFilter, setActiveKpiFilter] = useState<string | null>(null);

  // View Mode: GRID | LIST | BOARD (default to BOARD or GRID)
  const [viewMode, setViewMode] = useState<CampaignViewMode>('BOARD');

  // Dialog State
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Fetch Campaigns
  const {
    data: allCampaigns = [],
    isLoading,
    isError,
    error,
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

  // Handle KPI Click Filter
  const handleSelectKpi = (kpiId: string) => {
    if (activeKpiFilter === kpiId) {
      handleClearFilters();
      return;
    }

    setActiveKpiFilter(kpiId);

    switch (kpiId) {
      case 'ALL':
        handleClearFilters();
        break;
      case 'ACTIVE':
        setSelectedStage('');
        setCompletedOnly(false);
        setOnHoldOnly(false);
        setUpcomingOnly(false);
        break;
      case 'PLANNING':
        setSelectedStage(CampaignStage.INITIAL_IDEA);
        setCompletedOnly(false);
        setOnHoldOnly(false);
        setUpcomingOnly(false);
        break;
      case 'COMPLETED':
        setCompletedOnly(true);
        setOnHoldOnly(false);
        setUpcomingOnly(false);
        setSelectedStage('');
        break;
      case 'ON_HOLD':
        setOnHoldOnly(true);
        setCompletedOnly(false);
        setUpcomingOnly(false);
        setSelectedStage('');
        break;
      case 'UPCOMING':
        setUpcomingOnly(true);
        setCompletedOnly(false);
        setOnHoldOnly(false);
        setSelectedStage('');
        break;
      default:
        break;
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedStage('');
    setSelectedPlatform('');
    setSelectedOwnerId('');
    setSelectedPriority('');
    setCompletedOnly(false);
    setOnHoldOnly(false);
    setUpcomingOnly(false);
    setActiveKpiFilter(null);
  };

  // Filter campaigns locally for quick toggles
  const filteredCampaigns = useMemo(() => {
    const now = new Date();
    return allCampaigns.filter((c) => {
      if (completedOnly) {
        const isCompleted =
          c.stage === CampaignStage.POSTING_COMPLETION || c.status === ContentStatus.PUBLISHED;
        if (!isCompleted) return false;
      }

      if (onHoldOnly) {
        if (c.status !== ContentStatus.ARCHIVED) return false;
      }

      if (upcomingOnly) {
        try {
          if (new Date(c.startDate) <= now) return false;
        } catch {
          return false;
        }
      }

      return true;
    });
  }, [allCampaigns, completedOnly, onHoldOnly, upcomingOnly]);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 pb-16">
      {/* 1. Page Header */}
      <CampaignsHeader onCreateCampaign={() => setIsCreateOpen(true)} />

      {/* 2. 6-KPI Summary Overview */}
      <CampaignsKpiOverview
        campaigns={allCampaigns}
        activeFilter={activeKpiFilter}
        onSelectKpi={handleSelectKpi}
      />

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
        onReset={handleClearFilters}
        totalCount={allCampaigns.length}
        filteredCount={filteredCampaigns.length}
        completedOnly={completedOnly}
        onCompletedOnlyChange={setCompletedOnly}
        onHoldOnly={onHoldOnly}
        onOnHoldOnlyChange={setOnHoldOnly}
        upcomingOnly={upcomingOnly}
        onUpcomingOnlyChange={setUpcomingOnly}
      />

      {/* 4. Content Views */}
      {isLoading ? (
        <LoadingState message="Loading operational campaigns and sprints..." />
      ) : isError ? (
        <ErrorState
          title="Failed to load campaigns"
          message={error instanceof Error ? error.message : 'Could not retrieve campaign records for this workspace.'}
          onRetry={() => refetch()}
        />
      ) : filteredCampaigns.length === 0 ? (
        <EmptyState
          title="No campaigns match active criteria"
          description="Create your first campaign or clear filters to view active production sprints."
          action={{
            label: 'Create Campaign',
            onClick: () => setIsCreateOpen(true),
          }}
        />
      ) : viewMode === 'GRID' ? (
        <CampaignsGridView campaigns={filteredCampaigns} getMemberName={getMemberName} />
      ) : viewMode === 'LIST' ? (
        <CampaignsTableView campaigns={filteredCampaigns} getMemberName={getMemberName} />
      ) : (
        <CampaignsBoardView campaigns={filteredCampaigns} getMemberName={getMemberName} />
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
