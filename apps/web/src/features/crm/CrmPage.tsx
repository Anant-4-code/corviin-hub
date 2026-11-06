import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CrmType,
  CrmRecordSummaryItem,
  CrmFollowUpItem,
  CompleteFollowUpDto,
} from '@corviin-hub/shared';
import { useAppStore } from '@/lib/store';
import {
  fetchCrmOverview,
  completeCrmFollowUp,
} from '@/services/crm';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { LoadingState, ErrorState } from '@/components/ui/States';
import { CrmMetricsCards } from './components/CrmMetricsCards';
import { CrmEntryCards } from './components/CrmEntryCards';
import { CrmGlobalSearch } from './components/CrmGlobalSearch';
import { CrmUpcomingFollowUps } from './components/CrmUpcomingFollowUps';
import { CrmRecentInteractionsTimeline } from './components/CrmRecentInteractionsTimeline';
import { QuickCreateCrmDialog } from './components/QuickCreateCrmDialog';
import { ScheduleFollowUpDialog } from './components/ScheduleFollowUpDialog';
import { LogInteractionDialog } from './components/LogInteractionDialog';
import { Users, UserPlus } from 'lucide-react';

export function CrmPage() {
  const queryClient = useQueryClient();
  const workspaceId = useAppStore((s) => s.selectedWorkspaceId) || 'ws-tech-0001-0000-000000000001';
  const profileId = useAppStore((s) => s.selectedProfileId) || 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

  // Dialog States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createInitialType, setCreateInitialType] = useState<CrmType | undefined>(undefined);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isLogInteractionOpen, setIsLogInteractionOpen] = useState(false);
  const [activeRecordForAction, setActiveRecordForAction] = useState<CrmRecordSummaryItem | null>(null);

  // Fetch Overview Data
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['crm-overview', workspaceId],
    queryFn: () => fetchCrmOverview(workspaceId),
    enabled: Boolean(workspaceId),
  });

  const workspaceType = data?.workspaceType || (workspaceId.includes('real') ? 'REAL_ESTATE' : 'TECH');
  const recentRecords = data?.recentRecords || [];
  const upcomingFollowUps = data?.upcomingFollowUps || [];
  const recentInteractions = data?.recentInteractions || [];

  // Handle Complete Follow-up
  const handleCompleteFollowUp = async (followUp: CrmFollowUpItem) => {
    const note = window.prompt(`Add completion notes for: "${followUp.title}" (Optional):`, '');
    if (note === null) return; // User cancelled

    await completeCrmFollowUp(workspaceId, followUp.id, {
      completionNotes: note || undefined,
      completedBy: 'Acting Profile',
    });
    await queryClient.invalidateQueries({ queryKey: ['crm-overview', workspaceId] });
  };

  const handleOpenQuickCreate = (type?: CrmType) => {
    setCreateInitialType(type);
    setIsCreateOpen(true);
  };

  const handleOpenScheduleForRecord = (record: CrmRecordSummaryItem) => {
    setActiveRecordForAction(record);
    setIsScheduleOpen(true);
  };

  const handleSuccess = async () => {
    await queryClient.invalidateQueries({ queryKey: ['crm-overview', workspaceId] });
    await queryClient.invalidateQueries({ queryKey: ['crm-search', workspaceId] });
  };

  return (
    <div className="space-y-4">
      {/* 1. Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'CRM Overview' }]} />

      {/* 2. Page Header Card */}
      <div className="p-4 bg-surface border border-ch-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-primary" />
            <h1 className="text-base font-bold text-ch-text-primary">CRM Overview</h1>
          </div>
          <p className="text-xs text-ch-text-secondary max-w-2xl">
            {workspaceType === 'TECH'
              ? 'Relationship pipeline for Corviin Tech software enquiries, client retainers, and technology alliances.'
              : 'Relationship pipeline for Corviin Real Estate developers, land parcels, and property buyer walkthroughs.'}
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => handleOpenQuickCreate()}
          className="gap-1.5 shrink-0"
        >
          <UserPlus size={14} />
          <span>New CRM Record</span>
        </Button>
      </div>

      {isLoading ? (
        <LoadingState message="Loading CRM relationship data..." />
      ) : isError ? (
        <ErrorState
          message="Failed to load CRM overview for workspace."
          onRetry={() => refetch()}
        />
      ) : (
        <>
          {/* 3. Metrics Cards */}
          <CrmMetricsCards
            workspaceType={workspaceType}
            techMetrics={data?.techMetrics}
            realEstateMetrics={data?.realEstateMetrics}
          />

          {/* 4. Pipeline Entry Cards */}
          <CrmEntryCards
            workspaceType={workspaceType}
            onQuickCreate={handleOpenQuickCreate}
          />

          {/* 5. Universal CRM Search */}
          <div className="space-y-1">
            <h3 className="font-bold text-xs uppercase tracking-wider text-ch-text-secondary px-1">
              Global CRM Search
            </h3>
            <CrmGlobalSearch
              workspaceId={workspaceId}
              workspaceType={workspaceType}
              onScheduleFollowUp={handleOpenScheduleForRecord}
            />
          </div>

          {/* 6. Two-Column Follow-ups & Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CrmUpcomingFollowUps
              followUps={upcomingFollowUps}
              onCompleteFollowUp={handleCompleteFollowUp}
              onOpenSchedule={() => {
                setActiveRecordForAction(null);
                setIsScheduleOpen(true);
              }}
            />

            <CrmRecentInteractionsTimeline
              interactions={recentInteractions}
              onOpenLogInteraction={() => {
                setActiveRecordForAction(null);
                setIsLogInteractionOpen(true);
              }}
            />
          </div>
        </>
      )}

      {/* Modals & Dialogs */}
      <QuickCreateCrmDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        workspaceId={workspaceId}
        workspaceType={workspaceType}
        initialType={createInitialType}
        onSuccess={handleSuccess}
      />

      <ScheduleFollowUpDialog
        isOpen={isScheduleOpen}
        onClose={() => {
          setIsScheduleOpen(false);
          setActiveRecordForAction(null);
        }}
        workspaceId={workspaceId}
        records={recentRecords}
        preselectedRecord={activeRecordForAction}
        onSuccess={handleSuccess}
      />

      <LogInteractionDialog
        isOpen={isLogInteractionOpen}
        onClose={() => {
          setIsLogInteractionOpen(false);
          setActiveRecordForAction(null);
        }}
        workspaceId={workspaceId}
        records={recentRecords}
        preselectedRecord={activeRecordForAction}
        actorName="Acting Profile"
        actorId={profileId}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
