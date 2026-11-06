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
  PartnerCrmFilterDto,
  RealEstatePartnerRecord,
  CreatePartnerRecordDto,
  ChangePartnerStageDto,
  ConfirmOrActivatePartnerDto,
  AddPartnerProjectDto,
  CreatePartnerLinkedTaskDto,
  SchedulePartnerMeetingDto,
  RealEstatePartnerStage,
  CrmInteractionType,
} from '@corviin-hub/shared';
import {
  fetchPartnerSummary,
  fetchPartnerRecords,
  fetchPartnerRecordById,
  createPartnerRecord,
  changePartnerStage,
  confirmOrActivatePartner,
  addPartnerProject,
  createPartnerLinkedTask,
  schedulePartnerMeeting,
  addPartnerInteraction,
} from '@/services/crm';
import { PartnerSummaryStrip } from './components/PartnerSummaryStrip';
import { PartnerFilterToolbar } from './components/PartnerFilterToolbar';
import { PartnerRecordsTableView } from './components/PartnerRecordsTableView';
import { PartnerRecordsBoardView } from './components/PartnerRecordsBoardView';
import { CreatePartnerDialog } from './components/CreatePartnerDialog';
import { ChangePartnerStageDialog } from './components/ChangePartnerStageDialog';
import { ConfirmOrActivatePartnerDialog } from './components/ConfirmOrActivatePartnerDialog';
import { AddPartnerProjectDialog } from './components/AddPartnerProjectDialog';
import { CreatePartnerTaskDialog } from './components/CreatePartnerTaskDialog';
import { SchedulePartnerMeetingDialog } from './components/SchedulePartnerMeetingDialog';
import { PartnerRecordDetailDrawer } from './components/PartnerRecordDetailDrawer';

export function CrmPartnersPage() {
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
  const [filters, setFilters] = useState<PartnerCrmFilterDto>({
    page: 1,
    pageSize: 20,
    followUpDue: 'ALL',
  });

  // Drawer & Dialog States
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isChangeStageOpen, setIsChangeStageOpen] = useState(false);
  const [isConfirmOrActivateOpen, setIsConfirmOrActivateOpen] = useState(false);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isScheduleMeetingOpen, setIsScheduleMeetingOpen] = useState(false);

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
    queryKey: ['partner-crm-summary', workspaceId],
    queryFn: () => fetchPartnerSummary(workspaceId),
    enabled: isRealEstateWorkspace,
  });

  // Records Query
  const {
    data: recordsResponse,
    isLoading: isRecordsLoading,
    error: recordsError,
    refetch: refetchRecords,
  } = useQuery({
    queryKey: ['partner-crm-records', workspaceId, filters],
    queryFn: () => fetchPartnerRecords(workspaceId, filters),
    enabled: isRealEstateWorkspace,
  });

  // Detail Drawer Partner Query
  const {
    data: selectedPartner,
    refetch: refetchSelectedPartner,
  } = useQuery({
    queryKey: ['partner-crm-detail', workspaceId, selectedPartnerId],
    queryFn: () => fetchPartnerRecordById(workspaceId, selectedPartnerId!),
    enabled: Boolean(selectedPartnerId) && isRealEstateWorkspace,
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
            { label: 'Real Estate Partners' },
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
  const handleCreatePartner = async (dto: CreatePartnerRecordDto) => {
    const created = await createPartnerRecord(workspaceId, dto);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['partner-crm-summary', workspaceId] }),
      queryClient.invalidateQueries({ queryKey: ['partner-crm-records', workspaceId] }),
    ]);
    setSelectedPartnerId(created.id);
  };

  const handleChangeStage = async (dto: ChangePartnerStageDto) => {
    if (!selectedPartnerId) return;
    await changePartnerStage(workspaceId, selectedPartnerId, {
      ...dto,
      actorId: currentProfile?.id,
      actorName: currentProfile?.displayName,
    });
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['partner-crm-summary', workspaceId] }),
      queryClient.invalidateQueries({ queryKey: ['partner-crm-records', workspaceId] }),
      refetchSelectedPartner(),
    ]);
  };

  const handleConfirmOrActivate = async (dto: ConfirmOrActivatePartnerDto) => {
    if (!selectedPartnerId) return;
    await confirmOrActivatePartner(workspaceId, selectedPartnerId, {
      ...dto,
      actorId: currentProfile?.id,
      actorName: currentProfile?.displayName,
    });
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['partner-crm-summary', workspaceId] }),
      queryClient.invalidateQueries({ queryKey: ['partner-crm-records', workspaceId] }),
      refetchSelectedPartner(),
    ]);
  };

  const handleAddProject = async (dto: AddPartnerProjectDto) => {
    if (!selectedPartnerId) return;
    await addPartnerProject(workspaceId, selectedPartnerId, dto);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['partner-crm-summary', workspaceId] }),
      queryClient.invalidateQueries({ queryKey: ['partner-crm-records', workspaceId] }),
      refetchSelectedPartner(),
    ]);
  };

  const handleCreateTask = async (dto: CreatePartnerLinkedTaskDto) => {
    if (!selectedPartnerId) return;
    await createPartnerLinkedTask(workspaceId, selectedPartnerId, dto);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['tasks'] }),
      refetchSelectedPartner(),
    ]);
  };

  const handleScheduleMeeting = async (dto: SchedulePartnerMeetingDto) => {
    if (!selectedPartnerId) return;
    await schedulePartnerMeeting(workspaceId, selectedPartnerId, dto);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['meetings'] }),
      refetchSelectedPartner(),
    ]);
  };

  const handleAddNote = async (noteText: string) => {
    if (!selectedPartnerId) return;
    await addPartnerInteraction(workspaceId, selectedPartnerId, {
      type: CrmInteractionType.NOTE,
      title: 'Partner conversation note',
      description: noteText,
      actorId: currentProfile?.id,
      actorName: currentProfile?.displayName,
    });
    await refetchSelectedPartner();
  };

  const handleQuickAdvanceStage = async (stage: RealEstatePartnerStage) => {
    if (!selectedPartnerId) return;
    await handleChangeStage({
      stage,
      notes: `Quick advanced to ${stage}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'CRM Overview', href: '/app/crm' },
          { label: 'Real Estate Developers & Partners' },
        ]}
      />

      {/* Page Header */}
      <PageHeader
        title="Real Estate Developers & Partners CRM"
        description="Manage developer, builder, landowner, and channel partner pipelines from initial prospecting through active mandates."
      />

      {/* Summary KPI Strip */}
      {summaryError ? (
        <ErrorState
          message="Failed to load partner summary metrics"
          onRetry={() => refetchSummary()}
        />
      ) : (
        <PartnerSummaryStrip summary={summary} isLoading={isSummaryLoading} />
      )}

      {/* Filter Toolbar */}
      <PartnerFilterToolbar
        filter={filters}
        onFilterChange={setFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenCreate={() => setIsCreateOpen(true)}
        members={memberOptions}
      />

      {/* Main View: Table or Board */}
      {recordsError ? (
        <ErrorState
          message="Failed to load partner directory records"
          onRetry={() => refetchRecords()}
        />
      ) : isRecordsLoading ? (
        <LoadingState message="Loading developer and partner records..." />
      ) : viewMode === 'table' ? (
        <div className="space-y-4">
          <PartnerRecordsTableView
            records={recordsResponse?.items || []}
            onSelectRecord={(r) => setSelectedPartnerId(r.id)}
            isLoading={isRecordsLoading}
          />
          {recordsResponse && recordsResponse.totalPages > 1 && (
            <Pagination
              page={recordsResponse.page}
              pageSize={recordsResponse.pageSize}
              total={recordsResponse.total}
              onPageChange={(p) => setFilters({ ...filters, page: p })}
            />
          )}
        </div>
      ) : (
        <PartnerRecordsBoardView
          records={recordsResponse?.items || []}
          onSelectRecord={(r) => setSelectedPartnerId(r.id)}
          isLoading={isRecordsLoading}
        />
      )}

      {/* ============================================================
          DIALOGS & DRAWERS
         ============================================================ */}

      {/* Create Partner Dialog */}
      <CreatePartnerDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreatePartner}
        workspaceId={workspaceId}
        members={memberOptions}
        onOpenExisting={(existingId) => setSelectedPartnerId(existingId)}
      />

      {/* Partner Detail Drawer */}
      <PartnerRecordDetailDrawer
        isOpen={Boolean(selectedPartnerId)}
        onClose={() => setSelectedPartnerId(null)}
        partner={selectedPartner || null}
        onOpenChangeStage={() => setIsChangeStageOpen(true)}
        onOpenConfirmOrActivate={() => setIsConfirmOrActivateOpen(true)}
        onOpenAddProject={() => setIsAddProjectOpen(true)}
        onOpenCreateTask={() => setIsCreateTaskOpen(true)}
        onOpenScheduleMeeting={() => setIsScheduleMeetingOpen(true)}
        onQuickAdvanceStage={handleQuickAdvanceStage}
        onAddNote={handleAddNote}
      />

      {/* Change Stage Dialog */}
      {selectedPartner && (
        <ChangePartnerStageDialog
          isOpen={isChangeStageOpen}
          onClose={() => setIsChangeStageOpen(false)}
          currentStage={selectedPartner.stage}
          onSubmit={handleChangeStage}
          partnerName={selectedPartner.companyName}
        />
      )}

      {/* Confirm / Activate Dialog */}
      {selectedPartner && (
        <ConfirmOrActivatePartnerDialog
          isOpen={isConfirmOrActivateOpen}
          onClose={() => setIsConfirmOrActivateOpen(false)}
          onSubmit={handleConfirmOrActivate}
          partnerName={selectedPartner.companyName}
          defaultMode={
            selectedPartner.stage === RealEstatePartnerStage.PARTNERSHIP_CONFIRMED
              ? 'ACTIVATE'
              : 'CONFIRM'
          }
        />
      )}

      {/* Add Project Dialog */}
      {selectedPartner && (
        <AddPartnerProjectDialog
          isOpen={isAddProjectOpen}
          onClose={() => setIsAddProjectOpen(false)}
          onSubmit={handleAddProject}
          partnerName={selectedPartner.companyName}
          defaultLocation={selectedPartner.location}
        />
      )}

      {/* Create Linked Task Dialog */}
      {selectedPartner && (
        <CreatePartnerTaskDialog
          isOpen={isCreateTaskOpen}
          onClose={() => setIsCreateTaskOpen(false)}
          onSubmit={handleCreateTask}
          partnerName={selectedPartner.companyName}
          members={memberOptions}
          defaultAssigneeId={selectedPartner.assignedMemberId}
        />
      )}

      {/* Schedule Meeting Dialog */}
      {selectedPartner && (
        <SchedulePartnerMeetingDialog
          isOpen={isScheduleMeetingOpen}
          onClose={() => setIsScheduleMeetingOpen(false)}
          onSubmit={handleScheduleMeeting}
          partnerName={selectedPartner.companyName}
          projects={selectedPartner.projects || []}
          members={memberOptions}
          defaultHostId={selectedPartner.assignedMemberId}
        />
      )}
    </div>
  );
}
