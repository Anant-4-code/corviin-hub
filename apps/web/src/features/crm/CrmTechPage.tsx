import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Building2, Plus, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useProfiles } from '@/hooks/useProfiles';
import { useWorkspaces } from '@/hooks/useWorkspaces';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import {
  LoadingState,
  ErrorState,
  EmptyState,
  PermissionDeniedState,
} from '@/components/ui/States';
import {
  TechCrmFilterDto,
  TechCrmRecord,
  CreateTechRecordDto,
  ChangeTechStageDto,
  ConvertWonToClientDto,
  CreateTechLinkedTaskDto,
  AddTechProposalDto,
  CrmRecordSummaryItem,
  CrmType,
  TechRecordCategory,
  TechPipelineStage,
} from '@corviin-hub/shared';
import {
  fetchTechSummary,
  fetchTechRecords,
  fetchTechRecordById,
  createTechRecord,
  changeTechStage,
  convertWonToClient,
  createTechLinkedTask,
  addTechProposal,
  addTechRequirementNote,
  completeCrmFollowUp,
} from '@/services/crm';
import { TechSummaryStrip } from './components/TechSummaryStrip';
import { TechFilterToolbar } from './components/TechFilterToolbar';
import { TechRecordsTableView } from './components/TechRecordsTableView';
import { TechRecordsBoardView } from './components/TechRecordsBoardView';
import { CreateTechRecordDialog } from './components/CreateTechRecordDialog';
import { TechRecordDetailDrawer } from './components/TechRecordDetailDrawer';
import { ChangeTechStageDialog } from './components/ChangeTechStageDialog';
import { ConvertWonClientDialog } from './components/ConvertWonClientDialog';
import { AddTechProposalDialog } from './components/AddTechProposalDialog';
import { CreateTechTaskDialog } from './components/CreateTechTaskDialog';
import { ScheduleFollowUpDialog } from './components/ScheduleFollowUpDialog';
import { LogInteractionDialog } from './components/LogInteractionDialog';

export function CrmTechPage() {
  const queryClient = useQueryClient();
  const { selectedWorkspaceId, setSelectedWorkspaceId, selectedProfileId } = useAppStore();
  const { data: workspaces } = useWorkspaces();
  const { data: profiles } = useProfiles();

  const workspaceId = selectedWorkspaceId || 'ws-tech-0001-0000-000000000001';
  const activeWorkspace = workspaces?.find((w) => w.id === workspaceId) || {
    id: workspaceId,
    name: workspaceId.includes('real') ? 'Corviin Real Estate' : 'Corviin Tech',
    type: workspaceId.includes('real') ? 'REAL_ESTATE' : 'TECH',
  };

  const currentProfile = (profiles || []).find((p) => p.id === selectedProfileId);

  // Dynamic Workspace Members
  const memberOptions = (profiles || []).map((p) => ({
    id: p.id,
    name: p.displayName,
  }));

  // Views & Filters state
  const [viewMode, setViewMode] = useState<'table' | 'board'>('table');
  const [filters, setFilters] = useState<TechCrmFilterDto>({
    page: 1,
    pageSize: 25,
  });

  // Drawer & Dialog States
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isChangeStageOpen, setIsChangeStageOpen] = useState(false);
  const [isConvertClientOpen, setIsConvertClientOpen] = useState(false);
  const [isAddProposalOpen, setIsAddProposalOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isFollowUpOpen, setIsFollowUpOpen] = useState(false);
  const [isLogInteractionOpen, setIsLogInteractionOpen] = useState(false);

  // Workspace Isolation Check
  const isTechWorkspace =
    workspaceId === 'ws-tech-0001-0000-000000000001' ||
    workspaceId.toLowerCase().includes('tech') ||
    activeWorkspace.type === 'TECH';

  // Summary Query
  const {
    data: summary,
    isLoading: isSummaryLoading,
    error: summaryError,
    refetch: refetchSummary,
  } = useQuery({
    queryKey: ['crm-tech-summary', workspaceId],
    queryFn: () => fetchTechSummary(workspaceId),
    enabled: isTechWorkspace,
  });

  // Records Query
  const {
    data: recordsData,
    isLoading: isRecordsLoading,
    error: recordsError,
    refetch: refetchRecords,
  } = useQuery({
    queryKey: ['crm-tech-records', workspaceId, filters],
    queryFn: () => fetchTechRecords(workspaceId, filters),
    enabled: isTechWorkspace,
  });

  // Selected Record Detail Query
  const {
    data: recordDetail,
    refetch: refetchRecordDetail,
  } = useQuery({
    queryKey: ['crm-tech-record-detail', workspaceId, selectedRecordId],
    queryFn: () => fetchTechRecordById(workspaceId, selectedRecordId!),
    enabled: Boolean(selectedRecordId && isTechWorkspace),
  });

  // If in Real Estate workspace, render strict permission/guidance state
  if (!isTechWorkspace) {
    return (
      <div className="p-4 md:p-6 space-y-4 max-w-4xl mx-auto">
        <Breadcrumbs
          items={[
            { label: 'CRM Overview', href: '/app/crm' },
            { label: 'Tech Pipeline & Accounts' },
          ]}
        />
        <PermissionDeniedState
          workspaceName={activeWorkspace.name}
          onSwitchWorkspace={() =>
            setSelectedWorkspaceId('ws-tech-0001-0000-000000000001')
          }
        />
      </div>
    );
  }

  // Handle Create Record
  const handleCreateRecord = async (dto: CreateTechRecordDto) => {
    await createTechRecord(workspaceId, dto);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['crm-tech-records'] }),
      queryClient.invalidateQueries({ queryKey: ['crm-tech-summary'] }),
      queryClient.invalidateQueries({ queryKey: ['crm-overview'] }),
    ]);
  };

  // Handle Change Stage
  const handleChangeStage = async (dto: ChangeTechStageDto) => {
    if (!selectedRecordId) return;
    await changeTechStage(workspaceId, selectedRecordId, dto);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['crm-tech-records'] }),
      queryClient.invalidateQueries({ queryKey: ['crm-tech-summary'] }),
      queryClient.invalidateQueries({ queryKey: ['crm-tech-record-detail'] }),
      queryClient.invalidateQueries({ queryKey: ['crm-overview'] }),
    ]);
  };

  // Handle Convert to Client
  const handleConvertWonClient = async (dto: ConvertWonToClientDto) => {
    if (!selectedRecordId) return;
    await convertWonToClient(workspaceId, selectedRecordId, dto);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['crm-tech-records'] }),
      queryClient.invalidateQueries({ queryKey: ['crm-tech-summary'] }),
      queryClient.invalidateQueries({ queryKey: ['crm-tech-record-detail'] }),
      queryClient.invalidateQueries({ queryKey: ['crm-overview'] }),
    ]);
  };

  // Handle Add Proposal
  const handleAddProposal = async (dto: AddTechProposalDto) => {
    if (!selectedRecordId) return;
    await addTechProposal(workspaceId, selectedRecordId, dto);
    await queryClient.invalidateQueries({ queryKey: ['crm-tech-record-detail'] });
  };

  // Handle Create Linked Task
  const handleCreateLinkedTask = async (dto: CreateTechLinkedTaskDto) => {
    if (!selectedRecordId) return;
    await createTechLinkedTask(workspaceId, selectedRecordId, dto);
    await queryClient.invalidateQueries({ queryKey: ['crm-tech-record-detail'] });
    await queryClient.invalidateQueries({ queryKey: ['tasks'] });
  };

  // Handle Add Note
  const handleAddNote = async (note: string) => {
    if (!selectedRecordId) return;
    await addTechRequirementNote(
      workspaceId,
      selectedRecordId,
      note,
      currentProfile?.id,
      currentProfile?.displayName,
    );
    await queryClient.invalidateQueries({ queryKey: ['crm-tech-record-detail'] });
  };

  // Handle Complete Follow-up
  const handleCompleteFollowUp = async (followUpId: string) => {
    await completeCrmFollowUp(workspaceId, followUpId, {
      completedBy: currentProfile?.displayName || 'Account Lead',
      completionNotes: 'Follow-up marked complete from Tech CRM record.',
    });
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['crm-tech-record-detail'] }),
      queryClient.invalidateQueries({ queryKey: ['crm-tech-summary'] }),
      queryClient.invalidateQueries({ queryKey: ['crm-overview'] }),
    ]);
  };

  // Map Tech records to CrmRecordSummaryItem format for shared dialogs
  const currentRecord = recordDetail?.record || recordsData?.items.find((r) => r.id === selectedRecordId) || null;
  const mappedSummaries: CrmRecordSummaryItem[] = (recordsData?.items || []).map((r) => ({
    id: r.id,
    workspaceId: r.workspaceId,
    type:
      r.category === TechRecordCategory.EXISTING_CLIENT
        ? CrmType.TECH_CLIENT
        : r.category === TechRecordCategory.TECHNOLOGY_PARTNER
          ? CrmType.TECH_PARTNER
          : CrmType.TECH_LEAD,
    name: r.name,
    company: r.company,
    phone: r.phone,
    email: r.email,
    stage: r.stage,
    assignedMemberId: r.assignedMemberId,
    assignedMemberName: r.assignedMemberName,
    lastActivityDate: r.lastActivityDate,
    requirementSummary: r.requirementSummary,
    estimatedValue: r.estimatedBudget,
    projectOrLocation: r.location,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  }));

  const preselectedSummary = currentRecord
    ? mappedSummaries.find((s) => s.id === currentRecord.id) || null
    : null;

  return (
    <div className="space-y-4 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'CRM Overview', href: '/app/crm' },
          { label: 'Tech Pipeline & Accounts' },
        ]}
      />

      {/* Page Header */}
      <PageHeader
        title="Corviin Tech CRM"
        description="Client relationships, prospective projects, technology alliances, and enquiry pipeline for software and automation services."
      />

      {/* Summary Metrics Strip */}
      {isSummaryLoading ? (
        <div className="p-4 bg-surface border border-ch-border text-xs text-ch-text-secondary">
          Loading Tech pipeline metrics...
        </div>
      ) : summary ? (
        <TechSummaryStrip
          summary={summary}
          onFilterDueToday={() =>
            setFilters((prev) => ({ ...prev, followUpFilter: 'TODAY', page: 1 }))
          }
          onFilterOverdue={() =>
            setFilters((prev) => ({ ...prev, followUpFilter: 'OVERDUE', page: 1 }))
          }
          onFilterQualified={() =>
            setFilters((prev) => ({
              ...prev,
              stage: TechPipelineStage.QUALIFIED,
              page: 1,
            }))
          }
          onFilterWon={() =>
            setFilters((prev) => ({
              ...prev,
              stage: TechPipelineStage.WON_CLIENT,
              page: 1,
            }))
          }
        />
      ) : null}

      {/* Filter and View Mode Toolbar */}
      <TechFilterToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filters={filters}
        onFilterChange={setFilters}
        onResetFilters={() => setFilters({ page: 1, pageSize: 25 })}
        onOpenCreateDialog={() => setIsCreateOpen(true)}
        members={memberOptions}
        totalCount={recordsData?.total || 0}
      />

      {/* Error State */}
      {recordsError && (
        <ErrorState
          title="Failed to Load Tech Records"
          message="Could not retrieve enquiries from the server."
          onRetry={() => refetchRecords()}
        />
      )}

      {/* Loading State */}
      {isRecordsLoading && !recordsData && (
        <div className="p-12 text-center text-xs text-ch-text-secondary border border-ch-border bg-surface">
          Loading pipeline enquiries and client accounts...
        </div>
      )}

      {/* Records Content: Table vs Board */}
      {recordsData && recordsData.items.length === 0 ? (
        <EmptyState
          title="No Tech Enquiries Found"
          description="No records match your active filters. Clear filters or add a new technology enquiry."
          action={{
            label: 'Add Tech Record',
            onClick: () => setIsCreateOpen(true),
          }}
        />
      ) : recordsData ? (
        <>
          {viewMode === 'table' ? (
            <TechRecordsTableView
              records={recordsData.items}
              onSelectRecord={(r) => setSelectedRecordId(r.id)}
            />
          ) : (
            <TechRecordsBoardView
              records={recordsData.items}
              onSelectRecord={(r) => setSelectedRecordId(r.id)}
            />
          )}

          {/* Pagination */}
          {recordsData.totalPages > 1 && (
            <div className="flex justify-between items-center pt-2">
              <Pagination
                page={recordsData.page}
                pageSize={recordsData.pageSize}
                total={recordsData.total}
                onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
              />
            </div>
          )}
        </>
      ) : null}

      {/* ======================================================== */}
      {/* MODALS & DRAWERS                                         */}
      {/* ======================================================== */}

      {/* Create Tech Record Modal */}
      <CreateTechRecordDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateRecord}
        workspaceId={workspaceId}
        members={memberOptions}
        onOpenExistingRecord={(id) => setSelectedRecordId(id)}
      />

      {/* Master Detail Drawer */}
      <TechRecordDetailDrawer
        isOpen={Boolean(selectedRecordId)}
        onClose={() => setSelectedRecordId(null)}
        record={recordDetail?.record || currentRecord}
        linkedTasks={recordDetail?.linkedTasks || []}
        linkedMeetings={recordDetail?.linkedMeetings || []}
        followUps={recordDetail?.followUps || []}
        interactions={recordDetail?.interactions || []}
        members={memberOptions}
        onOpenChangeStage={() => setIsChangeStageOpen(true)}
        onOpenConvertClient={() => setIsConvertClientOpen(true)}
        onOpenAddProposal={() => setIsAddProposalOpen(true)}
        onOpenCreateTask={() => setIsCreateTaskOpen(true)}
        onOpenScheduleFollowUp={() => setIsFollowUpOpen(true)}
        onOpenLogInteraction={() => setIsLogInteractionOpen(true)}
        onAddNote={handleAddNote}
        onCompleteFollowUp={handleCompleteFollowUp}
      />

      {/* Change Stage Dialog */}
      <ChangeTechStageDialog
        isOpen={isChangeStageOpen}
        onClose={() => setIsChangeStageOpen(false)}
        record={recordDetail?.record || currentRecord}
        onSubmit={handleChangeStage}
        currentProfileName={currentProfile?.displayName}
        currentProfileId={currentProfile?.id}
      />

      {/* Convert Won to Client Dialog */}
      <ConvertWonClientDialog
        isOpen={isConvertClientOpen}
        onClose={() => setIsConvertClientOpen(false)}
        record={recordDetail?.record || currentRecord}
        onSubmit={handleConvertWonClient}
        currentProfileName={currentProfile?.displayName}
        currentProfileId={currentProfile?.id}
      />

      {/* Add Proposal Dialog */}
      <AddTechProposalDialog
        isOpen={isAddProposalOpen}
        onClose={() => setIsAddProposalOpen(false)}
        recordCompany={currentRecord?.company || 'Client'}
        onSubmit={handleAddProposal}
      />

      {/* Create Linked Task Dialog */}
      <CreateTechTaskDialog
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        recordCompany={currentRecord?.company || 'Client'}
        assignedMemberId={currentRecord?.assignedMemberId || ''}
        members={memberOptions}
        onSubmit={handleCreateLinkedTask}
      />

      {/* Schedule Follow-up Dialog (Reused from Feature 10) */}
      <ScheduleFollowUpDialog
        isOpen={isFollowUpOpen}
        onClose={() => setIsFollowUpOpen(false)}
        workspaceId={workspaceId}
        records={mappedSummaries}
        preselectedRecord={preselectedSummary}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['crm-tech-record-detail'] });
          queryClient.invalidateQueries({ queryKey: ['crm-tech-summary'] });
          queryClient.invalidateQueries({ queryKey: ['crm-overview'] });
        }}
      />

      {/* Log Interaction Dialog (Reused from Feature 10) */}
      <LogInteractionDialog
        isOpen={isLogInteractionOpen}
        onClose={() => setIsLogInteractionOpen(false)}
        workspaceId={workspaceId}
        records={mappedSummaries}
        preselectedRecord={preselectedSummary}
        actorName={currentProfile?.displayName || 'Account Lead'}
        actorId={currentProfile?.id || ''}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['crm-tech-record-detail'] });
          queryClient.invalidateQueries({ queryKey: ['crm-tech-summary'] });
          queryClient.invalidateQueries({ queryKey: ['crm-overview'] });
        }}
      />
    </div>
  );
}
