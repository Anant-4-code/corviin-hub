import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  TaskPriority,
  GoalStatus,
  PlanStatus,
  type GoalItem,
  type PlanItem,
  type CreateGoalDto,
  type CreatePlanDto,
} from '@corviin-hub/shared';
import { useAppStore } from '@/lib/store';
import { useProfiles } from '@/hooks/useProfiles';
import { useWorkspaces } from '@/hooks/useWorkspaces';
import {
  fetchPlansGoalsOverview,
  createGoal,
  updateGoal,
  createPlan,
  updatePlan,
  addPlanMilestone,
  updatePlanMilestone,
} from '@/services/plans-goals';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Tabs } from '@/components/ui/Tabs';
import { SummaryStrip } from './components/SummaryStrip';
import { GoalCard } from './components/GoalCard';
import { PlanCard } from './components/PlanCard';
import { GoalDetailDrawer } from './components/GoalDetailDrawer';
import { PlanDetailDrawer } from './components/PlanDetailDrawer';
import { CreateGoalDialog } from './components/CreateGoalDialog';
import { CreatePlanDialog } from './components/CreatePlanDialog';
import { UpdateGoalProgressDialog } from './components/UpdateGoalProgressDialog';
import {
  Plus,
  Search,
  RotateCcw,
  Target,
  Compass,
  AlertTriangle,
} from 'lucide-react';

type PlansGoalsTab = 'overview' | 'goals' | 'plans' | 'at_risk' | 'completed';

export function PlansGoalsPage() {
  const queryClient = useQueryClient();
  const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);

  const { data: profiles = [] } = useProfiles();
  const { data: workspaces = [] } = useWorkspaces();
  const activeWorkspace = workspaces.find((w) => w.id === selectedWorkspaceId);

  // Tabs & Filter State
  const [activeTab, setActiveTab] = useState<PlansGoalsTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOwnerId, setSelectedOwnerId] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');

  // Drawer & Modal States
  const [selectedGoal, setSelectedGoal] = useState<GoalItem | null>(null);
  const [isGoalDetailOpen, setIsGoalDetailOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanItem | null>(null);
  const [isPlanDetailOpen, setIsPlanDetailOpen] = useState(false);

  const [isCreateGoalOpen, setIsCreateGoalOpen] = useState(false);
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false);
  const [preselectedGoalIdForPlan, setPreselectedGoalIdForPlan] = useState<string | undefined>();
  const [goalToUpdateProgress, setGoalToUpdateProgress] = useState<GoalItem | null>(null);

  // Fetch Overview Data
  const {
    data: overviewData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['plans-goals', selectedWorkspaceId],
    queryFn: () => fetchPlansGoalsOverview(),
    staleTime: 10_000,
  });

  const allGoals = overviewData?.goals || [];
  const allPlans = overviewData?.plans || [];

  // Sync selected records when data updates
  React.useEffect(() => {
    if (selectedGoal) {
      const updated = allGoals.find((g) => g.id === selectedGoal.id);
      if (updated) setSelectedGoal(updated);
    }
  }, [allGoals]);

  React.useEffect(() => {
    if (selectedPlan) {
      const updated = allPlans.find((p) => p.id === selectedPlan.id);
      if (updated) setSelectedPlan(updated);
    }
  }, [allPlans]);

  const invalidatePlansGoals = () => {
    queryClient.invalidateQueries({ queryKey: ['plans-goals'] });
  };

  // Filter logic
  const filterRecord = (item: { title: string; ownerId: string; priority: TaskPriority }) => {
    if (selectedOwnerId !== 'ALL' && item.ownerId !== selectedOwnerId) return false;
    if (selectedPriority !== 'ALL' && item.priority !== selectedPriority) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!item.title.toLowerCase().includes(q)) return false;
    }
    return true;
  };

  const filteredGoals = allGoals.filter(filterRecord);
  const filteredPlans = allPlans.filter(filterRecord);

  const atRiskGoals = allGoals.filter((g) => g.status === GoalStatus.AT_RISK || g.isAtRisk);
  const atRiskPlans = allPlans.filter((p) => p.isAtRisk);

  const completedGoals = allGoals.filter((g) => g.status === GoalStatus.ACHIEVED);
  const completedPlans = allPlans.filter((p) => p.status === PlanStatus.COMPLETED);

  // Actions
  const handleSelectGoal = (goal: GoalItem) => {
    setSelectedGoal(goal);
    setIsGoalDetailOpen(true);
  };

  const handleSelectPlan = (plan: PlanItem) => {
    setSelectedPlan(plan);
    setIsPlanDetailOpen(true);
  };

  const handleCreatePlanForGoal = (goal: GoalItem) => {
    setPreselectedGoalIdForPlan(goal.id);
    setIsCreatePlanOpen(true);
  };

  const handleInspectGoalFromPlan = (goalId: string) => {
    const goal = allGoals.find((g) => g.id === goalId);
    if (goal) {
      setIsPlanDetailOpen(false);
      setSelectedGoal(goal);
      setIsGoalDetailOpen(true);
    }
  };

  const handleToggleMilestone = async (planId: string, milestoneId: string, targetStatus: string) => {
    await updatePlanMilestone(planId, milestoneId, {
      status: targetStatus as any,
    });
    invalidatePlansGoals();
  };

  const handleAddMilestone = async (planId: string, title: string, dueDate: string) => {
    await addPlanMilestone(planId, { title, dueDate });
    invalidatePlansGoals();
  };

  const handleUpdateGoalProgress = async (
    id: string,
    updates: {
      status?: GoalStatus;
      progressPercent?: number;
      progressMode?: any;
      metricCurrentValue?: number;
      riskReason?: string;
    },
  ) => {
    await updateGoal(id, {
      status: updates.status,
      progressPercent: updates.progressPercent,
      progressMode: updates.progressMode,
      metric: updates.metricCurrentValue !== undefined ? ({ currentValue: updates.metricCurrentValue } as any) : undefined,
      riskReason: updates.riskReason,
    });
    invalidatePlansGoals();
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedOwnerId('ALL');
    setSelectedPriority('ALL');
  };

  const hasActiveFilters = searchQuery !== '' || selectedOwnerId !== 'ALL' || selectedPriority !== 'ALL';

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'goals', label: 'Goals', count: allGoals.length },
    { id: 'plans', label: 'Plans', count: allPlans.length },
    { id: 'at_risk', label: 'At Risk', count: atRiskGoals.length + atRiskPlans.length },
    { id: 'completed', label: 'Completed', count: completedGoals.length + completedPlans.length },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/app/dashboard' },
              { label: 'Plans & Goals' },
            ]}
          />
          <h1 className="text-2xl font-bold text-ch-text-primary tracking-tight mt-1">
            Plans & Goals
          </h1>
          <p className="text-xs text-ch-text-secondary mt-0.5">
            Strategic outcomes (Goals), operational approaches (Plans), and checkpoint milestones for{' '}
            <span className="font-semibold text-ch-text-primary">
              {activeWorkspace?.name || 'Current Workspace'}
            </span>
          </p>
        </div>

        {/* Create Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              setPreselectedGoalIdForPlan(undefined);
              setIsCreatePlanOpen(true);
            }}
            className="w-full sm:w-auto"
          >
            <Compass size={15} className="mr-1.5" />
            Create Plan
          </Button>
          <Button
            variant="primary"
            onClick={() => setIsCreateGoalOpen(true)}
            className="w-full sm:w-auto"
          >
            <Target size={15} className="mr-1.5" />
            Create Goal
          </Button>
        </div>
      </div>

      {/* Summary Metrics Strip */}
      {overviewData?.summary && (
        <SummaryStrip
          activeGoals={overviewData.summary.activeGoalsCount}
          activePlans={overviewData.summary.activePlansCount}
          atRiskCount={overviewData.summary.atRiskCount}
          milestonesDueSoon={overviewData.summary.milestonesDueSoonCount}
        />
      )}

      {/* Tabs */}
      <div className="border-b border-ch-border">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(id) => setActiveTab(id as PlansGoalsTab)}
          className="border-b-0"
        />
      </div>

      {/* Filter Toolbar */}
      <div className="bg-surface p-3 rounded-lg border border-ch-border flex flex-wrap items-center gap-2.5 text-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ch-text-muted" />
          <Input
            placeholder="Search goals or plans by title or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>

        {/* Owner Filter */}
        <div className="w-40">
          <Select
            value={selectedOwnerId}
            onChange={(e) => setSelectedOwnerId(e.target.value)}
            className="h-8 text-xs"
            options={[
              { value: 'ALL', label: 'All Owners' },
              ...profiles.map((p) => ({
                value: p.id,
                label: p.displayName,
              })),
            ]}
          />
        </div>

        {/* Priority Filter */}
        <div className="w-36">
          <Select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="h-8 text-xs"
            options={[
              { value: 'ALL', label: 'All Priorities' },
              { value: TaskPriority.URGENT, label: 'Urgent' },
              { value: TaskPriority.HIGH, label: 'High' },
              { value: TaskPriority.MEDIUM, label: 'Medium' },
              { value: TaskPriority.LOW, label: 'Low' },
            ]}
          />
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className="h-8 px-2 text-xs text-ch-text-secondary hover:text-ch-text-primary"
            title="Reset filters"
          >
            <RotateCcw size={13} className="mr-1" />
            Reset
          </Button>
        )}
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="text-center py-16 bg-surface rounded-lg border border-ch-border">
          <p className="text-xs text-ch-text-secondary">Loading strategic goals and execution plans...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-12 bg-surface rounded-lg border border-danger/30 text-danger text-xs">
          <p className="font-semibold">Unable to load plans & goals for this workspace.</p>
          <Button variant="secondary" size="sm" onClick={() => refetch()} className="mt-3">
            Retry
          </Button>
        </div>
      ) : (
        <>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Strategic Goals Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1.5 border-b border-ch-border">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-ch-text-primary flex items-center gap-2">
                    <Target size={14} className="text-accent" />
                    Strategic Goals ({filteredGoals.length})
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredGoals.map((goal) => (
                    <GoalCard key={goal.id} goal={goal} onClick={handleSelectGoal} />
                  ))}
                  {filteredGoals.length === 0 && (
                    <div className="col-span-full text-center py-8 text-xs text-ch-text-secondary border border-dashed border-ch-border rounded">
                      No goals found matching the active filters.
                    </div>
                  )}
                </div>
              </div>

              {/* Execution Plans Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1.5 border-b border-ch-border">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-ch-text-primary flex items-center gap-2">
                    <Compass size={14} className="text-info" />
                    Execution Plans ({filteredPlans.length})
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredPlans.map((plan) => (
                    <PlanCard key={plan.id} plan={plan} onClick={handleSelectPlan} />
                  ))}
                  {filteredPlans.length === 0 && (
                    <div className="col-span-full text-center py-8 text-xs text-ch-text-secondary border border-dashed border-ch-border rounded">
                      No execution plans found matching the active filters.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GOALS */}
          {activeTab === 'goals' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} onClick={handleSelectGoal} />
              ))}
              {filteredGoals.length === 0 && (
                <div className="col-span-full text-center py-12 text-xs text-ch-text-secondary border border-dashed border-ch-border rounded">
                  No strategic goals match the selected filters.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PLANS */}
          {activeTab === 'plans' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredPlans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} onClick={handleSelectPlan} />
              ))}
              {filteredPlans.length === 0 && (
                <div className="col-span-full text-center py-12 text-xs text-ch-text-secondary border border-dashed border-ch-border rounded">
                  No execution plans match the selected filters.
                </div>
              )}
            </div>
          )}

          {/* TAB 4: AT RISK */}
          {activeTab === 'at_risk' && (
            <div className="space-y-6">
              {atRiskGoals.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-danger flex items-center gap-2 pb-1 border-b border-ch-border">
                    <AlertTriangle size={14} /> At-Risk Goals ({atRiskGoals.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {atRiskGoals.map((goal) => (
                      <GoalCard key={goal.id} goal={goal} onClick={handleSelectGoal} />
                    ))}
                  </div>
                </div>
              )}

              {atRiskPlans.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-danger flex items-center gap-2 pb-1 border-b border-ch-border">
                    <AlertTriangle size={14} /> At-Risk Execution Plans ({atRiskPlans.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {atRiskPlans.map((plan) => (
                      <PlanCard key={plan.id} plan={plan} onClick={handleSelectPlan} />
                    ))}
                  </div>
                </div>
              )}

              {atRiskGoals.length === 0 && atRiskPlans.length === 0 && (
                <div className="text-center py-12 text-xs text-success border border-dashed border-success/30 rounded bg-success/5">
                  <span className="font-bold">No At-Risk Items:</span> All goals and execution plans are healthy and on schedule.
                </div>
              )}
            </div>
          )}

          {/* TAB 5: COMPLETED */}
          {activeTab === 'completed' && (
            <div className="space-y-6">
              {completedGoals.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-success flex items-center gap-2 pb-1 border-b border-ch-border">
                    <Target size={14} /> Achieved Goals ({completedGoals.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {completedGoals.map((goal) => (
                      <GoalCard key={goal.id} goal={goal} onClick={handleSelectGoal} />
                    ))}
                  </div>
                </div>
              )}

              {completedPlans.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-success flex items-center gap-2 pb-1 border-b border-ch-border">
                    <Compass size={14} /> Completed Plans ({completedPlans.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {completedPlans.map((plan) => (
                      <PlanCard key={plan.id} plan={plan} onClick={handleSelectPlan} />
                    ))}
                  </div>
                </div>
              )}

              {completedGoals.length === 0 && completedPlans.length === 0 && (
                <div className="text-center py-12 text-xs text-ch-text-secondary border border-dashed border-ch-border rounded">
                  No completed goals or plans yet.
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Goal Detail Drawer */}
      <GoalDetailDrawer
        goal={selectedGoal}
        linkedPlans={allPlans.filter((p) => p.goalId === selectedGoal?.id)}
        open={isGoalDetailOpen}
        onClose={() => setIsGoalDetailOpen(false)}
        onOpenUpdateProgress={(goal) => setGoalToUpdateProgress(goal)}
        onCreatePlanForGoal={handleCreatePlanForGoal}
        onSelectPlan={handleSelectPlan}
      />

      {/* Plan Detail Drawer */}
      <PlanDetailDrawer
        plan={selectedPlan}
        open={isPlanDetailOpen}
        onClose={() => setIsPlanDetailOpen(false)}
        onToggleMilestoneStatus={handleToggleMilestone}
        onAddMilestone={handleAddMilestone}
        onInspectGoal={handleInspectGoalFromPlan}
      />

      {/* Create Goal Dialog */}
      <CreateGoalDialog
        open={isCreateGoalOpen}
        onClose={() => setIsCreateGoalOpen(false)}
        onCreate={async (dto: CreateGoalDto) => {
          await createGoal(dto);
          invalidatePlansGoals();
        }}
      />

      {/* Create Plan Dialog */}
      <CreatePlanDialog
        goals={allGoals}
        preselectedGoalId={preselectedGoalIdForPlan}
        open={isCreatePlanOpen}
        onClose={() => setIsCreatePlanOpen(false)}
        onCreate={async (dto: CreatePlanDto) => {
          await createPlan(dto);
          invalidatePlansGoals();
        }}
      />

      {/* Update Goal Progress Dialog */}
      <UpdateGoalProgressDialog
        goal={goalToUpdateProgress}
        open={!!goalToUpdateProgress}
        onClose={() => setGoalToUpdateProgress(null)}
        onUpdate={handleUpdateGoalProgress}
      />
    </div>
  );
}
