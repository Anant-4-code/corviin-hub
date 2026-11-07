import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CampaignItem,
  CampaignStage,
  ContentStatus,
  FootageChecklistItem,
} from '@corviin-hub/shared';
import { useAppStore } from '@/lib/store';
import { useProfiles } from '@/hooks/useProfiles';
import {
  fetchCampaignById,
  updateCampaign,
  advanceCampaignStage,
  addScriptVersion,
  updateScriptStatus,
  updateFootageChecklist,
  linkCampaignAsset,
  unlinkCampaignAsset,
  createCampaignTask,
  fetchCampaignTasks,
  archiveCampaign,
} from '@/services/campaigns';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { Card } from '@/components/ui/Card';
import { LoadingState, ErrorState } from '@/components/ui/States';
import { CampaignStageStepper } from './components/CampaignStageStepper';
import { StageWorkspace } from './components/StageWorkspace';
import { CampaignTasksTab } from './components/CampaignTasksTab';
import { CampaignAssetsTab } from './components/CampaignAssetsTab';
import { AdvanceStageDialog } from './components/AdvanceStageDialog';
import {
  Calendar,
  User,
  ArrowRight,
  Archive,
  History,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';

const NEXT_STAGE_MAP: Record<CampaignStage, CampaignStage | null> = {
  [CampaignStage.INITIAL_IDEA]: CampaignStage.SCRIPTING_PLANNING,
  [CampaignStage.SCRIPTING_PLANNING]: CampaignStage.RECORDING_UPLOAD,
  [CampaignStage.RECORDING_UPLOAD]: CampaignStage.EDITING_FINAL,
  [CampaignStage.EDITING_FINAL]: CampaignStage.POSTING_COMPLETION,
  [CampaignStage.POSTING_COMPLETION]: null,
};

export function CampaignDetailPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId) || 'ws-tech-0001-0000-000000000001';
  const { data: profiles = [] } = useProfiles();

  // Active Tab & Viewing Stage State
  const [activeTab, setActiveTab] = useState<'workspace' | 'tasks' | 'assets' | 'overview' | 'history'>('workspace');
  const [viewingStage, setViewingStage] = useState<CampaignStage | null>(null);

  // Dialog State
  const [isAdvanceOpen, setIsAdvanceOpen] = useState(false);
  const [targetAdvanceStage, setTargetAdvanceStage] = useState<CampaignStage | null>(null);

  // Query Campaign Detail
  const {
    data: campaign,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['campaign-detail', selectedWorkspaceId, campaignId],
    queryFn: () => (campaignId ? fetchCampaignById(selectedWorkspaceId, campaignId) : null),
    enabled: Boolean(campaignId),
  });

  // Query Campaign Tasks
  const { data: campaignTasks = [], refetch: refetchTasks } = useQuery({
    queryKey: ['campaign-tasks', selectedWorkspaceId, campaignId],
    queryFn: () => (campaignId ? fetchCampaignTasks(selectedWorkspaceId, campaignId) : []),
    enabled: Boolean(campaignId),
  });

  if (isLoading) {
    return <LoadingState message="Loading campaign workspace..." />;
  }

  if (isError || !campaign) {
    return (
      <ErrorState
        title="Campaign not found"
        message="This campaign could not be located in the current workspace."
        onRetry={() => refetch()}
      />
    );
  }

  const effectiveViewingStage = viewingStage || campaign.stage;
  const nextStage = NEXT_STAGE_MAP[campaign.stage];

  const getMemberName = (id: string) => {
    const prof = profiles.find((p) => p.id === id);
    return prof ? prof.displayName : 'Team Member';
  };

  // Actions
  const handleAdvanceStage = async (toStage: CampaignStage, notes?: string) => {
    if (!campaignId) return;
    await advanceCampaignStage(selectedWorkspaceId, campaignId, { toStage, notes });
    await queryClient.invalidateQueries({ queryKey: ['campaign-detail', selectedWorkspaceId, campaignId] });
    await queryClient.invalidateQueries({ queryKey: ['campaigns'] });
  };

  const handleUpdateCampaign = async (data: Partial<CampaignItem>) => {
    if (!campaignId) return;
    await updateCampaign(selectedWorkspaceId, campaignId, data);
    await queryClient.invalidateQueries({ queryKey: ['campaign-detail', selectedWorkspaceId, campaignId] });
  };

  const handleAddScriptVersion = async (dto: any) => {
    if (!campaignId) return;
    await addScriptVersion(selectedWorkspaceId, campaignId, dto);
    await queryClient.invalidateQueries({ queryKey: ['campaign-detail', selectedWorkspaceId, campaignId] });
  };

  const handleUpdateScriptStatus = async (scriptId: string, status: any, feedback?: string) => {
    if (!campaignId) return;
    await updateScriptStatus(selectedWorkspaceId, campaignId, scriptId, { status, feedback });
    await queryClient.invalidateQueries({ queryKey: ['campaign-detail', selectedWorkspaceId, campaignId] });
  };

  const handleUpdateFootageChecklist = async (items: FootageChecklistItem[]) => {
    if (!campaignId) return;
    await updateFootageChecklist(selectedWorkspaceId, campaignId, { items });
    await queryClient.invalidateQueries({ queryKey: ['campaign-detail', selectedWorkspaceId, campaignId] });
  };

  const handleLinkAsset = async (dto: any) => {
    if (!campaignId) return;
    await linkCampaignAsset(selectedWorkspaceId, campaignId, dto);
    await queryClient.invalidateQueries({ queryKey: ['campaign-detail', selectedWorkspaceId, campaignId] });
  };

  const handleUnlinkAsset = async (linkId: string) => {
    if (!campaignId) return;
    await unlinkCampaignAsset(selectedWorkspaceId, campaignId, linkId);
    await queryClient.invalidateQueries({ queryKey: ['campaign-detail', selectedWorkspaceId, campaignId] });
  };

  const handleAddTask = async (dto: any) => {
    if (!campaignId) return;
    await createCampaignTask(selectedWorkspaceId, campaignId, dto);
    refetchTasks();
  };

  const handleArchive = async () => {
    if (!campaignId) return;
    if (window.confirm('Are you sure you want to archive and close this campaign?')) {
      await archiveCampaign(selectedWorkspaceId, campaignId);
      await queryClient.invalidateQueries({ queryKey: ['campaign-detail', selectedWorkspaceId, campaignId] });
      navigate('/app/campaigns');
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 pb-16">
      {/* 1. Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Campaigns', href: '/app/campaigns' },
          { label: campaign.title },
        ]}
      />

      {/* 2. Campaign Header Card */}
      <div className="p-4 bg-surface border border-ch-border space-y-3">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary">{campaign.stage}</Badge>
              <Badge variant="outline">{campaign.status}</Badge>
              <span className="font-mono text-[11px] font-semibold text-ch-text-secondary uppercase">
                {campaign.platform}
              </span>
              <span className="text-[11px] text-ch-text-muted capitalize">
                Priority: {campaign.priority?.toLowerCase()}
              </span>
            </div>

            <h1 className="text-xl font-bold text-ch-text-primary leading-tight">
              {campaign.title}
            </h1>

            <p className="text-xs text-ch-text-secondary max-w-3xl leading-relaxed">
              {campaign.description}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ch-text-muted pt-1">
              <div className="flex items-center gap-1 font-medium text-ch-text-primary">
                <User size={13} className="text-primary" />
                <span>Owner: {getMemberName(campaign.ownerId)}</span>
              </div>
              <div className="flex items-center gap-1 font-mono">
                <Calendar size={13} />
                <span>Target: {new Date(campaign.targetPublishDate).toLocaleDateString()}</span>
              </div>
              {campaign.actualPublishDate && (
                <div className="flex items-center gap-1 font-mono text-success font-semibold">
                  <CheckCircle2 size={13} />
                  <span>Published: {new Date(campaign.actualPublishDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Primary Action: Advance Stage */}
          <div className="flex sm:flex-col items-stretch sm:items-end gap-2 shrink-0">
            {nextStage ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setTargetAdvanceStage(nextStage);
                  setIsAdvanceOpen(true);
                }}
                className="text-xs h-9 px-3 gap-1.5 font-bold shadow-none"
              >
                <span>Advance to {nextStage}</span>
                <ArrowRight size={14} />
              </Button>
            ) : (
              <div className="text-xs font-bold text-success flex items-center gap-1 p-2 bg-success/10 border border-success/30">
                <CheckCircle2 size={14} />
                <span>Stage 5: Completed</span>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleArchive}
              className="text-xs h-8 text-ch-text-muted hover:text-danger gap-1"
            >
              <Archive size={13} />
              <span>Archive</span>
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="pt-2 border-t border-ch-border space-y-1">
          <div className="flex justify-between text-[11px] font-mono text-ch-text-muted">
            <span className="font-semibold text-ch-text-primary">Overall Campaign Progress</span>
            <span>{campaign.progressPercent}%</span>
          </div>
          <div className="w-full bg-surface-muted h-2 border border-ch-border">
            <div
              className="bg-primary h-full transition-none"
              style={{ width: `${Math.min(100, Math.max(0, campaign.progressPercent))}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. 5-Stage Stepper */}
      <CampaignStageStepper
        currentStage={campaign.stage}
        activeViewStage={effectiveViewingStage}
        onSelectStage={(stage) => {
          setViewingStage(stage);
          setActiveTab('workspace');
        }}
      />

      {/* 4. Tab Navigation */}
      <Tabs
        activeTab={activeTab}
        onTabChange={(tabId: string) => setActiveTab(tabId as any)}
        tabs={[
          { id: 'workspace', label: `Stage Workspace (${effectiveViewingStage})` },
          { id: 'tasks', label: 'Linked Tasks', count: campaignTasks.length },
          { id: 'assets', label: 'Campaign Assets', count: campaign.assetLinks ? campaign.assetLinks.length : 0 },
          { id: 'overview', label: 'Overview & Brief' },
          { id: 'history', label: 'Stage Audit History', count: campaign.stageHistory ? campaign.stageHistory.length : 0 },
        ]}
      />

      {/* 5. Tab Panels */}
      <div className="pt-1">
        {activeTab === 'workspace' && (
          <StageWorkspace
            campaign={campaign}
            viewingStage={effectiveViewingStage}
            workspaceId={selectedWorkspaceId}
            onUpdateCampaign={handleUpdateCampaign}
            onAddScriptVersion={handleAddScriptVersion}
            onUpdateScriptStatus={handleUpdateScriptStatus}
            onUpdateFootageChecklist={handleUpdateFootageChecklist}
          />
        )}

        {activeTab === 'tasks' && (
          <CampaignTasksTab
            tasks={campaignTasks}
            campaignStage={campaign.stage}
            members={profiles}
            onAddTask={handleAddTask}
            onToggleTaskStatus={async (taskId, currentStatus) => {
              // Toggle task status
              refetchTasks();
            }}
          />
        )}

        {activeTab === 'assets' && (
          <CampaignAssetsTab
            assets={campaign.assetLinks || []}
            campaignStage={campaign.stage}
            onLinkAsset={handleLinkAsset}
            onUnlinkAsset={handleUnlinkAsset}
          />
        )}

        {activeTab === 'overview' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 border border-ch-border bg-surface space-y-2">
                <h4 className="font-bold text-ch-text-primary uppercase text-[11px] tracking-wider">
                  Target Objectives
                </h4>
                <p className="text-ch-text-secondary leading-relaxed">
                  {campaign.objective || 'No explicit objective documented.'}
                </p>
              </Card>

              <Card className="p-4 border border-ch-border bg-surface space-y-2">
                <h4 className="font-bold text-ch-text-primary uppercase text-[11px] tracking-wider">
                  Audience Profile
                </h4>
                <p className="text-ch-text-secondary leading-relaxed">
                  {campaign.targetAudience || 'General community audience.'}
                </p>
              </Card>
            </div>

            <Card className="p-4 border border-ch-border bg-surface space-y-2">
              <h4 className="font-bold text-ch-text-primary uppercase text-[11px] tracking-wider">
                Concept & Narrative Pitch
              </h4>
              <p className="text-ch-text-secondary leading-relaxed whitespace-pre-wrap">
                {campaign.conceptNotes || 'No concept notes added.'}
              </p>
            </Card>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3">
            <div className="pb-1 border-b border-ch-border">
              <h3 className="text-xs font-bold text-ch-text-primary uppercase tracking-wider flex items-center gap-1.5">
                <History size={14} className="text-primary" />
                Immutable Stage Progression History ({campaign.stageHistory ? campaign.stageHistory.length : 0})
              </h3>
            </div>

            <div className="space-y-2 border border-ch-border bg-surface p-3">
              {(campaign.stageHistory || []).map((h) => (
                <div
                  key={h.id}
                  className="p-2.5 border-b border-ch-border last:border-0 pb-2 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-ch-text-primary">
                      {h.fromStage} → {h.toStage}
                    </span>
                    <span className="text-[10px] text-ch-text-muted font-mono">
                      {new Date(h.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-[11px] text-ch-text-secondary italic">
                    "{h.notes || 'Stage advanced without notes.'}"
                  </div>
                  <div className="text-[10px] text-ch-text-muted">
                    Logged by actor: {h.actorName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 6. Advance Stage Dialog */}
      {targetAdvanceStage && (
        <AdvanceStageDialog
          open={isAdvanceOpen}
          onClose={() => setIsAdvanceOpen(false)}
          campaign={campaign}
          targetStage={targetAdvanceStage}
          onConfirm={handleAdvanceStage}
        />
      )}
    </div>
  );
}
