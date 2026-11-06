import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import {
  GoalItem,
  PlanItem,
  GoalStatus,
  PlanStatus,
  MilestoneStatus,
  ProgressMode,
  TaskPriority,
} from '@corviin-hub/shared';
import { SummaryStrip } from '@/features/plans-goals/components/SummaryStrip';
import { GoalCard } from '@/features/plans-goals/components/GoalCard';
import { PlanCard } from '@/features/plans-goals/components/PlanCard';
import { GoalDetailDrawer } from '@/features/plans-goals/components/GoalDetailDrawer';
import { PlanDetailDrawer } from '@/features/plans-goals/components/PlanDetailDrawer';
import { CreateGoalDialog } from '@/features/plans-goals/components/CreateGoalDialog';
import { CreatePlanDialog } from '@/features/plans-goals/components/CreatePlanDialog';
import { UpdateGoalProgressDialog } from '@/features/plans-goals/components/UpdateGoalProgressDialog';
import { PlansGoalsPage } from '@/features/plans-goals/PlansGoalsPage';

const mockGoal: GoalItem = {
  id: 'gl-001',
  workspaceId: 'ws-tech-0001-0000-000000000001',
  title: 'Onboard 50 Enterprise Tech Clients in Q4',
  expectedOutcome: 'Expand enterprise revenue baseline and sign long-term MSAs.',
  ownerId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  ownerName: 'Anant',
  targetDate: '2026-12-31T18:00:00.000Z',
  startDate: '2026-10-01T09:00:00.000Z',
  priority: TaskPriority.URGENT,
  status: GoalStatus.IN_PROGRESS,
  progressMode: ProgressMode.TASK_DERIVED,
  progressPercent: 64,
  metric: {
    name: 'Enterprise Contracts Signed',
    targetValue: 50,
    currentValue: 32,
    unit: 'clients',
  },
  linkedPlanIds: ['pln-001'],
  activity: [
    {
      id: 'act-1',
      action: 'updated metric to 32 clients',
      actorName: 'Anant',
      timestamp: new Date().toISOString(),
    },
  ],
  createdAt: '2026-10-01T09:00:00.000Z',
  updatedAt: '2026-11-04T16:00:00.000Z',
};

const mockPlan: PlanItem = {
  id: 'pln-001',
  workspaceId: 'ws-tech-0001-0000-000000000001',
  goalId: 'gl-001',
  goalTitle: 'Onboard 50 Enterprise Tech Clients in Q4',
  title: 'Enterprise Outbound Tech Acquisition Sprint',
  strategySummary: 'Outbound sequence targeting FinTech and PropTech engineering leaders.',
  ownerId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  ownerName: 'Anant',
  startDate: '2026-10-01T09:00:00.000Z',
  targetDate: '2026-12-15T18:00:00.000Z',
  priority: TaskPriority.URGENT,
  status: PlanStatus.ACTIVE,
  progressMode: ProgressMode.MILESTONE_DERIVED,
  progressPercent: 67,
  milestones: [
    {
      id: 'm-1',
      planId: 'pln-001',
      title: 'Curate Top 200 Account List',
      dueDate: '2026-10-15T18:00:00.000Z',
      status: MilestoneStatus.COMPLETED,
      completedAt: '2026-10-14T15:00:00.000Z',
      orderIndex: 0,
    },
    {
      id: 'm-2',
      planId: 'pln-001',
      title: 'Complete 30 Technical Demos',
      dueDate: '2026-11-15T18:00:00.000Z',
      status: MilestoneStatus.IN_PROGRESS,
      orderIndex: 1,
    },
  ],
  resources: ['HubSpot Enterprise Export', 'Custom Benchmark Deck'],
  risks: ['Extended legal review cycles'],
  activity: [],
  createdAt: '2026-10-01T09:00:00.000Z',
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

describe('Plans & Goals Components and Workflows', () => {
  it('SummaryStrip renders all 4 key metric cards', () => {
    render(
      <SummaryStrip
        activeGoals={5}
        activePlans={8}
        atRiskCount={2}
        milestonesDueSoon={3}
      />,
    );

    expect(screen.getByText('Active Goals')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Active Plans')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('Items At Risk')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Milestones Due Soon')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('GoalCard renders goal title, metric breakdown, and progress mode', () => {
    const onClick = vi.fn();
    render(<GoalCard goal={mockGoal} onClick={onClick} />);

    expect(screen.getByText('Onboard 50 Enterprise Tech Clients in Q4')).toBeInTheDocument();
    expect(screen.getByText('Task-derived')).toBeInTheDocument();
    expect(screen.getByText(/32 \/ 50 clients/i)).toBeInTheDocument();
    expect(screen.getByText(/64%/)).toBeInTheDocument();
    expect(screen.getByText('Anant')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Onboard 50 Enterprise Tech Clients in Q4'));
    expect(onClick).toHaveBeenCalledWith(mockGoal);
  });

  it('PlanCard renders plan title, linked goal, and milestone progress', () => {
    const onClick = vi.fn();
    render(<PlanCard plan={mockPlan} onClick={onClick} />);

    expect(screen.getByText('Enterprise Outbound Tech Acquisition Sprint')).toBeInTheDocument();
    expect(screen.getByText('Onboard 50 Enterprise Tech Clients in Q4')).toBeInTheDocument();
    expect(screen.getByText('1 of 2 milestones')).toBeInTheDocument();
    expect(screen.getByText('67%')).toBeInTheDocument();
  });

  it('GoalDetailDrawer renders 8 sections and linked plans', () => {
    const onOpenUpdateProgress = vi.fn();
    const onCreatePlan = vi.fn();
    const onSelectPlan = vi.fn();

    render(
      <GoalDetailDrawer
        goal={mockGoal}
        linkedPlans={[mockPlan]}
        open={true}
        onClose={vi.fn()}
        onOpenUpdateProgress={onOpenUpdateProgress}
        onCreatePlanForGoal={onCreatePlan}
        onSelectPlan={onSelectPlan}
      />,
    );

    expect(screen.getAllByText('Onboard 50 Enterprise Tech Clients in Q4').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Expected Business Outcome')).toBeInTheDocument();
    expect(screen.getByText('Measurement & Progress')).toBeInTheDocument();
    expect(screen.getByText('Enterprise Outbound Tech Acquisition Sprint')).toBeInTheDocument();

    const updateBtn = screen.getByRole('button', { name: /update metric \/ progress/i });
    fireEvent.click(updateBtn);
    expect(onOpenUpdateProgress).toHaveBeenCalledWith(mockGoal);
  });

  it('PlanDetailDrawer renders milestones timeline with interactive toggle', () => {
    const onToggleMilestone = vi.fn();
    const onAddMilestone = vi.fn();

    render(
      <PlanDetailDrawer
        plan={mockPlan}
        open={true}
        onClose={vi.fn()}
        onToggleMilestoneStatus={onToggleMilestone}
        onAddMilestone={onAddMilestone}
        onInspectGoal={vi.fn()}
      />,
    );

    expect(screen.getAllByText('Enterprise Outbound Tech Acquisition Sprint').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Curate Top 200 Account List')).toBeInTheDocument();
    expect(screen.getByText('Complete 30 Technical Demos')).toBeInTheDocument();

    // Toggle milestone
    const m2Item = screen.getByText('Complete 30 Technical Demos');
    fireEvent.click(m2Item);
    expect(onToggleMilestone).toHaveBeenCalledWith('pln-001', 'm-2', 'COMPLETED');
  });

  it('CreateGoalDialog enforces required fields and submits new goal', async () => {
    const onCreate = vi.fn().mockResolvedValue(undefined);
    render(
      <CreateGoalDialog
        open={true}
        onClose={vi.fn()}
        onCreate={onCreate}
      />,
      { wrapper: createWrapper() },
    );

    const titleInput = screen.getByPlaceholderText(/e\.g\. Onboard 50 Enterprise Tech Clients/i);
    fireEvent.change(titleInput, { target: { value: 'Launch Multi-Tenant Billing System' } });

    const outcomeInput = screen.getByPlaceholderText(/Describe the concrete business result/i);
    fireEvent.change(outcomeInput, { target: { value: 'Enable automated credit card billing and invoicing.' } });

    const submitBtn = screen.getByRole('button', { name: /create strategic goal/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(onCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Launch Multi-Tenant Billing System',
          expectedOutcome: 'Enable automated credit card billing and invoicing.',
        }),
      );
    });
  });

  it('CreatePlanDialog submits plan linked to a strategic goal', async () => {
    const onCreate = vi.fn().mockResolvedValue(undefined);
    render(
      <CreatePlanDialog
        goals={[mockGoal]}
        open={true}
        onClose={vi.fn()}
        onCreate={onCreate}
      />,
      { wrapper: createWrapper() },
    );

    const titleInput = screen.getByPlaceholderText(/e\.g\. Enterprise Outbound Tech Acquisition Sprint/i);
    fireEvent.change(titleInput, { target: { value: 'Stripe Billing Integration Sprint' } });

    const strategyInput = screen.getByPlaceholderText(/Explain how this plan will execute/i);
    fireEvent.change(strategyInput, { target: { value: 'Integrate Stripe Customer Portal and webhooks.' } });

    const submitBtn = screen.getByRole('button', { name: /create plan/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(onCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Stripe Billing Integration Sprint',
          strategySummary: 'Integrate Stripe Customer Portal and webhooks.',
        }),
      );
    });
  });

  it('UpdateGoalProgressDialog updates metric and flags at-risk state', async () => {
    const onUpdate = vi.fn().mockResolvedValue(undefined);
    render(
      <UpdateGoalProgressDialog
        goal={mockGoal}
        open={true}
        onClose={vi.fn()}
        onUpdate={onUpdate}
      />,
    );

    const atRiskCheckbox = screen.getByRole('checkbox', { name: /flag goal as at-risk/i });
    fireEvent.click(atRiskCheckbox);

    const riskInput = screen.getByPlaceholderText(/Explain why this goal is at risk/i);
    fireEvent.change(riskInput, { target: { value: 'Critical partner delayed security audit' } });

    const saveBtn = screen.getByRole('button', { name: /save progress/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledWith(
        mockGoal.id,
        expect.objectContaining({
          status: GoalStatus.AT_RISK,
          riskReason: 'Critical partner delayed security audit',
        }),
      );
    });
  });

  it('PlansGoalsPage renders summary strip, tabs, and filters', () => {
    render(<PlansGoalsPage />, { wrapper: createWrapper() });

    expect(screen.getByRole('heading', { name: 'Plans & Goals' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Goals/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Plans/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /At Risk/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Completed/i })).toBeInTheDocument();
  });
});
