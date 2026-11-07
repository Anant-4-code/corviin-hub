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
import { PartnerFollowUpsOverview } from './components/PartnerFollowUpsOverview';
import { PartnerUpcomingMeetings } from './components/PartnerUpcomingMeetings';
import { PartnerRecentActivityFeed } from './components/PartnerRecentActivityFeed';
import { CrmPartnersHeader } from './components/CrmPartnersHeader';

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

  // Dynamic Workspace Members from profile store
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
  const [partnerForAction, setPartnerForAction] = useState<RealEstatePartnerRecord | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isChangeStageOpen, setIsChangeStageOpen] = useState(false);
  const [isConfirmOrActivateOpen, setIsConfirmOrActivateOpen] = useState(false);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isScheduleMeetingOpen, setIsScheduleMeetingOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 pb-16">
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
    const targetId = partnerForAction?.id || selectedPartnerId;
    if (!targetId) return;
    await changePartnerStage(workspaceId, targetId, {
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
    const targetId = partnerForAction?.id || selectedPartnerId;
    if (!targetId) return;
    await confirmOrActivatePartner(workspaceId, targetId, {
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
    const targetId = partnerForAction?.id || selectedPartnerId;
    if (!targetId) return;
    await addPartnerProject(workspaceId, targetId, dto);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['partner-crm-summary', workspaceId] }),
      queryClient.invalidateQueries({ queryKey: ['partner-crm-records', workspaceId] }),
      refetchSelectedPartner(),
    ]);
  };

  const handleCreateTask = async (dto: CreatePartnerLinkedTaskDto) => {
    const targetId = partnerForAction?.id || selectedPartnerId;
    if (!targetId) return;
    await createPartnerLinkedTask(workspaceId, targetId, dto);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['tasks'] }),
      refetchSelectedPartner(),
    ]);
  };

  const handleScheduleMeeting = async (dto: SchedulePartnerMeetingDto) => {
    const targetId = partnerForAction?.id || selectedPartnerId;
    if (!targetId) return;
    await schedulePartnerMeeting(workspaceId, targetId, dto);
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

  const handleBoardQuickAdvance = async (recordId: string, stage: RealEstatePartnerStage) => {
    await changePartnerStage(workspaceId, recordId, {
      stage,
      notes: `Quick advanced from board view to ${stage}`,
      actorId: currentProfile?.id,
      actorName: currentProfile?.displayName,
    });
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['partner-crm-summary', workspaceId] }),
      queryClient.invalidateQueries({ queryKey: ['partner-crm-records', workspaceId] }),
    ]);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetchSummary(), refetchRecords()]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleKpiFilterSelect = (partialFilter: Partial<PartnerCrmFilterDto>) => {
    setFilters((prev) => ({
      ...prev,
      ...partialFilter,
      page: 1,
    }));
  };

  const activeModalPartner = partnerForAction || selectedPartner;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 pb-16">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'CRM Overview', href: '/app/crm' },
          { label: 'Real Estate Developers & Partners CRM' },
        ]}
      />

      {/* Top Header */}
      <CrmPartnersHeader
        onOpenCreate={() => setIsCreateOpen(true)}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Summary KPI Strip & Clickable Filter Cards */}
      {summaryError ? (
        <ErrorState
          message="Failed to load partner summary metrics"
          onRetry={() => refetchSummary()}
        />
      ) : (
        <PartnerSummaryStrip
          summary={summary}
          isLoading={isSummaryLoading}
          activeFilter={filters}
          onFilterSelect={handleKpiFilterSelect}
        />
      )}

      {/* Search & Multi-Filter Toolbar */}
      <PartnerFilterToolbar
        filter={filters}
        onFilterChange={setFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenCreate={() => setIsCreateOpen(true)}
        members={memberOptions}
        totalCount={summary?.totalPartners}
        filteredCount={recordsResponse?.total}
      />

      {/* Main Workspace: Table or Board */}
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
            onOpenChangeStage={(r) => {
              setPartnerForAction(r);
              setIsChangeStageOpen(true);
            }}
            onOpenScheduleMeeting={(r) => {
              setPartnerForAction(r);
              setIsScheduleMeetingOpen(true);
            }}
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
          onQuickAdvanceStage={handleBoardQuickAdvance}
          isLoading={isRecordsLoading}
        />
      )}

      {/* Operational Sections: Follow-ups, Upcoming Meetings, Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
        <PartnerFollowUpsOverview
          records={recordsResponse?.items || []}
          onSelectPartner={(pId) => setSelectedPartnerId(pId)}
        />
        <PartnerUpcomingMeetings
          records={recordsResponse?.items || []}
          onSelectPartner={(pId) => setSelectedPartnerId(pId)}
          onOpenScheduleMeeting={(p) => {
            setPartnerForAction(p);
            setIsScheduleMeetingOpen(true);
          }}
        />
      </div>

      <PartnerRecentActivityFeed
        records={recordsResponse?.items || []}
        onSelectPartner={(pId) => setSelectedPartnerId(pId)}
      />

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

      {/* Partner Detail Drawer (8 Tabs) */}
      <PartnerRecordDetailDrawer
        isOpen={Boolean(selectedPartnerId)}
        onClose={() => {
          setSelectedPartnerId(null);
          setPartnerForAction(null);
        }}
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
      {activeModalPartner && (
        <ChangePartnerStageDialog
          isOpen={isChangeStageOpen}
          onClose={() => {
            setIsChangeStageOpen(false);
            setPartnerForAction(null);
          }}
          currentStage={activeModalPartner.stage}
          onSubmit={handleChangeStage}
          partnerName={activeModalPartner.companyName}
        />
      )}

      {/* Confirm / Activate Dialog */}
      {activeModalPartner && (
        <ConfirmOrActivatePartnerDialog
          isOpen={isConfirmOrActivateOpen}
          onClose={() => {
            setIsConfirmOrActivateOpen(false);
            setPartnerForAction(null);
          }}
          onSubmit={handleConfirmOrActivate}
          partnerName={activeModalPartner.companyName}
          defaultMode={
            activeModalPartner.stage === RealEstatePartnerStage.PARTNERSHIP_CONFIRMED
              ? 'ACTIVATE'
              : 'CONFIRM'
          }
        />
      )}

      {/* Add Project Dialog */}
      {activeModalPartner && (
        <AddPartnerProjectDialog
          isOpen={isAddProjectOpen}
          onClose={() => {
            setIsAddProjectOpen(false);
            setPartnerForAction(null);
          }}
          onSubmit={handleAddProject}
          partnerName={activeModalPartner.companyName}
          defaultLocation={activeModalPartner.location}
        />
      )}

      {/* Create Linked Task Dialog */}
      {activeModalPartner && (
        <CreatePartnerTaskDialog
          isOpen={isCreateTaskOpen}
          onClose={() => {
            setIsCreateTaskOpen(false);
            setPartnerForAction(null);
          }}
          onSubmit={handleCreateTask}
          partnerName={activeModalPartner.companyName}
          members={memberOptions}
          defaultAssigneeId={activeModalPartner.assignedMemberId}
        />
      )}

      {/* Schedule Meeting Dialog */}
      {activeModalPartner && (
        <SchedulePartnerMeetingDialog
          isOpen={isScheduleMeetingOpen}
          onClose={() => {
            setIsScheduleMeetingOpen(false);
            setPartnerForAction(null);
          }}
          onSubmit={handleScheduleMeeting}
          partnerName={activeModalPartner.companyName}
          projects={activeModalPartner.projects || []}
          members={memberOptions}
          defaultHostId={activeModalPartner.assignedMemberId}
        />
      )}
    </div>
  );
}
