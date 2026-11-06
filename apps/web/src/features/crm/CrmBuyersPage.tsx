import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '@/lib/store';
import { useProfiles } from '@/hooks/useProfiles';
import { useWorkspaces } from '@/hooks/useWorkspaces';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { PageHeader } from '@/components/ui/PageHeader';
import { Pagination } from '@/components/ui/Pagination';
import {
  LoadingState,
  ErrorState,
  PermissionDeniedState,
} from '@/components/ui/States';
import {
  BuyerCrmFilterDto,
  RealEstateBuyerRecord,
  CreateBuyerRecordDto,
  ChangeBuyerStageDto,
  ScheduleBuyerSiteVisitDto,
  ShareBuyerPropertyDto,
  CreateBuyerLinkedTaskDto,
  RealEstateBuyerStage,
  CrmInteractionType,
} from '@corviin-hub/shared';
import {
  fetchBuyerSummary,
  fetchBuyerRecords,
  fetchBuyerRecordById,
  createBuyerRecord,
  changeBuyerStage,
  scheduleBuyerSiteVisit,
  shareBuyerProperty,
  createBuyerLinkedTask,
  addBuyerInteraction,
} from '@/services/crm';
import { BuyerSummaryStrip } from './components/BuyerSummaryStrip';
import { BuyerFilterToolbar } from './components/BuyerFilterToolbar';
import { BuyerRecordsTableView } from './components/BuyerRecordsTableView';
import { BuyerRecordsBoardView } from './components/BuyerRecordsBoardView';
import { CreateBuyerDialog } from './components/CreateBuyerDialog';
import { ChangeBuyerStageDialog } from './components/ChangeBuyerStageDialog';
import { ScheduleBuyerSiteVisitDialog } from './components/ScheduleBuyerSiteVisitDialog';
import { ShareBuyerPropertyDialog } from './components/ShareBuyerPropertyDialog';
import { CreateBuyerTaskDialog } from './components/CreateBuyerTaskDialog';
import { BuyerRecordDetailDrawer } from './components/BuyerRecordDetailDrawer';

export function CrmBuyersPage() {
  const queryClient = useQueryClient();
  const { selectedWorkspaceId, setSelectedWorkspaceId, selectedProfileId } = useAppStore();
  const { data: workspaces } = useWorkspaces();
  const { data: profiles } = useProfiles();

  const workspaceId = selectedWorkspaceId || 'ws-real-0002-0000-000000000002';
  const activeWorkspace = workspaces?.find((w) => w.id === workspaceId) || {
    id: workspaceId,
    name: workspaceId.includes('tech') ? 'Corviin Tech' : 'Corviin Real Estate',
    type: workspaceId.includes('tech') ? 'TECH' : 'REAL_ESTATE',
  };

  const currentProfile = (profiles || []).find((p) => p.id === selectedProfileId);

  // Dynamic Workspace Members
  const memberOptions = (profiles || []).map((p) => ({
    id: p.id,
    name: p.displayName,
  }));

  // Views & Filters state
  const [viewMode, setViewMode] = useState<'table' | 'board'>('table');
  const [filters, setFilters] = useState<BuyerCrmFilterDto>({
    page: 1,
    pageSize: 20,
    followUpDue: 'ALL',
  });

  // Drawer & Dialog States
  const [selectedBuyerId, setSelectedBuyerId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isChangeStageOpen, setIsChangeStageOpen] = useState(false);
  const [isScheduleSiteVisitOpen, setIsScheduleSiteVisitOpen] = useState(false);
  const [isSharePropertyOpen, setIsSharePropertyOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  // Workspace Isolation Check
  const isRealEstateWorkspace =
    workspaceId === 'ws-real-0002-0000-000000000002' ||
    workspaceId.toLowerCase().includes('real') ||
    activeWorkspace.type === 'REAL_ESTATE';

  // Summary Query
  const {
    data: summary,
    isLoading: isSummaryLoading,
    error: summaryError,
    refetch: refetchSummary,
  } = useQuery({
    queryKey: ['buyer-crm-summary', workspaceId],
    queryFn: () => fetchBuyerSummary(workspaceId),
    enabled: isRealEstateWorkspace,
  });

  // Records Query
  const {
    data: recordsResponse,
    isLoading: isRecordsLoading,
    error: recordsError,
    refetch: refetchRecords,
  } = useQuery({
    queryKey: ['buyer-crm-records', workspaceId, filters],
    queryFn: () => fetchBuyerRecords(workspaceId, filters),
    enabled: isRealEstateWorkspace,
  });

  // Detail Drawer Buyer Query
  const {
    data: selectedBuyer,
    refetch: refetchSelectedBuyer,
  } = useQuery({
    queryKey: ['buyer-crm-detail', workspaceId, selectedBuyerId],
    queryFn: () => fetchBuyerRecordById(workspaceId, selectedBuyerId!),
    enabled: Boolean(selectedBuyerId) && isRealEstateWorkspace,
  });

  // ==========================================
  // Workspace Guard
  // ==========================================
  if (!isRealEstateWorkspace) {
    return (
      <div className="space-y-6">
        <Breadcrumbs
          items={[
            { label: 'CRM', href: '/app/crm' },
            { label: 'Real Estate Buyers' },
          ]}
        />
        <PermissionDeniedState
          workspaceName={activeWorkspace.name}
          onSwitchWorkspace={() =>
            setSelectedWorkspaceId('ws-real-0002-0000-000000000002')
          }
        />
      </div>
    );
  }

  // ==========================================
  // Mutation Handlers
  // ==========================================
  const handleCreateBuyer = async (dto: CreateBuyerRecordDto) => {
    const created = await createBuyerRecord(workspaceId, dto);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['buyer-crm-summary', workspaceId] }),
      queryClient.invalidateQueries({ queryKey: ['buyer-crm-records', workspaceId] }),
    ]);
    setSelectedBuyerId(created.id);
  };

  const handleChangeStage = async (dto: ChangeBuyerStageDto) => {
    if (!selectedBuyerId) return;
    await changeBuyerStage(workspaceId, selectedBuyerId, {
      ...dto,
      actorId: currentProfile?.id,
      actorName: currentProfile?.displayName,
    });
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['buyer-crm-summary', workspaceId] }),
      queryClient.invalidateQueries({ queryKey: ['buyer-crm-records', workspaceId] }),
      refetchSelectedBuyer(),
    ]);
  };

  const handleScheduleSiteVisit = async (dto: ScheduleBuyerSiteVisitDto) => {
    if (!selectedBuyerId) return;
    await scheduleBuyerSiteVisit(workspaceId, selectedBuyerId, dto);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['buyer-crm-summary', workspaceId] }),
      queryClient.invalidateQueries({ queryKey: ['buyer-crm-records', workspaceId] }),
      queryClient.invalidateQueries({ queryKey: ['meetings'] }),
      refetchSelectedBuyer(),
    ]);
  };

  const handleShareProperty = async (dto: ShareBuyerPropertyDto) => {
    if (!selectedBuyerId) return;
    await shareBuyerProperty(workspaceId, selectedBuyerId, dto);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['buyer-crm-records', workspaceId] }),
      refetchSelectedBuyer(),
    ]);
  };

  const handleCreateTask = async (dto: CreateBuyerLinkedTaskDto) => {
    if (!selectedBuyerId) return;
    await createBuyerLinkedTask(workspaceId, selectedBuyerId, dto);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['tasks'] }),
      refetchSelectedBuyer(),
    ]);
  };

  const handleAddNote = async (noteText: string) => {
    if (!selectedBuyerId) return;
    await addBuyerInteraction(workspaceId, selectedBuyerId, {
      type: CrmInteractionType.NOTE,
      title: 'Buyer consultation note',
      description: noteText,
      actorId: currentProfile?.id || 'm-anant-001',
      actorName: currentProfile?.displayName || 'Anant',
    });
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['buyer-crm-records', workspaceId] }),
      refetchSelectedBuyer(),
    ]);
  };

  const records = recordsResponse?.items || [];
  const total = recordsResponse?.total || 0;
  const page = filters.page || 1;
  const pageSize = filters.pageSize || 20;

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'CRM', href: '/app/crm' },
          { label: 'Real Estate Buyers' },
        ]}
      />

      <PageHeader
        title="Real Estate Buyers CRM"
        description="End-to-end buyer pipeline tracking: enquiries, BHK preferences, budget matching, on-site tours, and booking conversions."
      />

      {/* Summary KPI Strip */}
      {isSummaryLoading ? (
        <LoadingState message="Loading buyer pipeline metrics..." />
      ) : summaryError ? (
        <ErrorState
          title="Could not load buyer summary"
          message={(summaryError as Error).message}
          onRetry={refetchSummary}
        />
      ) : summary ? (
        <BuyerSummaryStrip summary={summary} />
      ) : null}

      {/* Filter Toolbar */}
      <BuyerFilterToolbar
        filters={filters}
        onFilterChange={(newFilters) => setFilters(newFilters)}
        viewMode={viewMode}
        onViewModeChange={(mode) => setViewMode(mode)}
        members={memberOptions}
        onOpenCreate={() => setIsCreateOpen(true)}
      />

      {/* Views: Table or Board */}
      {isRecordsLoading ? (
        <LoadingState message="Loading buyer records..." />
      ) : recordsError ? (
        <ErrorState
          title="Could not load buyer records"
          message={(recordsError as Error).message}
          onRetry={refetchRecords}
        />
      ) : viewMode === 'table' ? (
        <div className="space-y-4">
          <BuyerRecordsTableView
            records={records}
            onSelectRecord={(rec: RealEstateBuyerRecord) => setSelectedBuyerId(rec.id)}
            isLoading={isRecordsLoading}
          />
          {total > pageSize && (
            <Pagination
              page={page}
              total={total}
              pageSize={pageSize}
              onPageChange={(newPage) => setFilters((prev) => ({ ...prev, page: newPage }))}
            />
          )}
        </div>
      ) : (
        <BuyerRecordsBoardView
          records={records}
          onSelectRecord={(rec: RealEstateBuyerRecord) => setSelectedBuyerId(rec.id)}
          isLoading={isRecordsLoading}
        />
      )}

      {/* Create Buyer Dialog */}
      <CreateBuyerDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateBuyer}
        workspaceId={workspaceId}
        members={memberOptions}
        onOpenExisting={(existingId) => setSelectedBuyerId(existingId)}
      />

      {/* Detail Drawer */}
      <BuyerRecordDetailDrawer
        isOpen={Boolean(selectedBuyerId)}
        onClose={() => setSelectedBuyerId(null)}
        buyer={selectedBuyer || records.find((r: RealEstateBuyerRecord) => r.id === selectedBuyerId) || null}
        onOpenChangeStage={() => setIsChangeStageOpen(true)}
        onOpenScheduleSiteVisit={() => setIsScheduleSiteVisitOpen(true)}
        onOpenShareProperty={() => setIsSharePropertyOpen(true)}
        onOpenCreateTask={() => setIsCreateTaskOpen(true)}
        onQuickAdvanceStage={(stage: RealEstateBuyerStage) => handleChangeStage({ stage })}
        onAddNote={handleAddNote}
      />

      {/* Stage Change Dialog */}
      {selectedBuyer && (
        <ChangeBuyerStageDialog
          isOpen={isChangeStageOpen}
          onClose={() => setIsChangeStageOpen(false)}
          onSubmit={handleChangeStage}
          currentStage={selectedBuyer.stage}
          buyerName={selectedBuyer.customerName}
        />
      )}

      {/* Schedule Site Visit Dialog */}
      {selectedBuyer && (
        <ScheduleBuyerSiteVisitDialog
          isOpen={isScheduleSiteVisitOpen}
          onClose={() => setIsScheduleSiteVisitOpen(false)}
          onSubmit={handleScheduleSiteVisit}
          buyerName={selectedBuyer.customerName}
          defaultProjectName={selectedBuyer.preferredProject}
          members={memberOptions}
          defaultResponsibleMemberId={selectedBuyer.assignedMemberId}
        />
      )}

      {/* Share Property Dialog */}
      {selectedBuyer && (
        <ShareBuyerPropertyDialog
          isOpen={isSharePropertyOpen}
          onClose={() => setIsSharePropertyOpen(false)}
          onSubmit={handleShareProperty}
          buyerName={selectedBuyer.customerName}
          defaultLocality={selectedBuyer.locality}
        />
      )}

      {/* Create Task Dialog */}
      {selectedBuyer && (
        <CreateBuyerTaskDialog
          isOpen={isCreateTaskOpen}
          onClose={() => setIsCreateTaskOpen(false)}
          onSubmit={handleCreateTask}
          buyerName={selectedBuyer.customerName}
          members={memberOptions}
          defaultAssigneeId={selectedBuyer.assignedMemberId}
        />
      )}
    </div>
  );
}
