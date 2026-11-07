import React, { useState } from 'react';
import type { GoalItem, PlanItem } from '@corviin-hub/shared';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityIndicator } from '@/components/ui/PriorityIndicator';
import { Avatar } from '@/components/ui/Avatar';
import { formatDate, formatDateTime } from '@/features/tasks/utils/task-utils';
import {
  Target,
  Calendar,
  AlertTriangle,
  User,
  Layers,
  Activity,
  Plus,
  Compass,
} from 'lucide-react';

interface GoalDetailDrawerProps {
  goal: GoalItem | null;
  linkedPlans: PlanItem[];
  open: boolean;
  onClose: () => void;
  onOpenUpdateProgress: (goal: GoalItem) => void;
  onCreatePlanForGoal: (goal: GoalItem) => void;
  onSelectPlan: (plan: PlanItem) => void;
}

export function GoalDetailDrawer({
  goal,
  linkedPlans,
  open,
  onClose,
  onOpenUpdateProgress,
  onCreatePlanForGoal,
  onSelectPlan,
}: GoalDetailDrawerProps) {
  if (!goal) return null;

  const getGoalStatusBadgeType = (status: GoalItem['status']) => {
    switch (status) {
      case 'ACHIEVED':
        return 'success';
      case 'IN_PROGRESS':
        return 'info';
      case 'AT_RISK':
        return 'danger';
      case 'MISSED':
      case 'CANCELLED':
        return 'danger';
      case 'NOT_STARTED':
      default:
        return 'neutral';
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={goal.title}
      subtitle={`Strategic Goal • ${goal.status.replace('_', ' ')}`}
      size="xl"
    >
      <div className="space-y-6 pb-12">
        {/* Header & Status */}
        <div className="space-y-3 pb-4 border-b border-ch-border">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <StatusBadge
                type={getGoalStatusBadgeType(goal.status)}
                label={goal.status.replace('_', ' ')}
              />
              <PriorityIndicator priority={goal.priority} />
              {goal.isAtRisk && (
                <span className="text-[11px] font-bold text-danger bg-danger/10 px-2 py-0.5 rounded border border-danger/20 flex items-center gap-1">
                  <AlertTriangle size={11} /> At Risk
                </span>
              )}
            </div>

            <div className="text-xs text-ch-text-secondary">
              Goal ID: <span className="font-mono">{goal.id}</span>
            </div>
          </div>

          <h1 className="text-xl font-bold text-ch-text-primary tracking-tight">
            {goal.title}
          </h1>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button
              variant="primary"
              size="sm"
              onClick={() => onOpenUpdateProgress(goal)}
            >
              <Activity size={14} className="mr-1.5" />
              Update Metric / Progress
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onCreatePlanForGoal(goal)}
            >
              <Plus size={14} className="mr-1.5" />
              Create Execution Plan
            </Button>
          </div>
        </div>

        {/* Risk Banner if At Risk */}
        {goal.isAtRisk && goal.riskReason && (
          <div className="p-3 bg-danger/10 border border-danger/30 rounded text-xs text-danger space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <AlertTriangle size={15} /> At-Risk Assessment:
            </div>
            <p className="text-ch-text-primary pl-5">{goal.riskReason}</p>
          </div>
        )}

        {/* Section 1: Expected Outcome */}
        <div className="space-y-1.5">
          <h2 className="text-xs font-semibold text-ch-text-secondary uppercase tracking-wider">
            Expected Business Outcome
          </h2>
          <div className="text-sm text-ch-text-primary whitespace-pre-wrap leading-relaxed bg-surface-muted/30 p-3 rounded border border-ch-border">
            {goal.expectedOutcome}
          </div>
        </div>

        {/* Section 2: Measurement Metric & Progress Mode */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-ch-text-secondary uppercase tracking-wider flex items-center gap-1.5">
              <Activity size={13} /> Measurement & Progress
            </h2>
            <span className="text-[11px] font-semibold text-ch-text-secondary bg-surface-muted px-2 py-0.5 rounded border border-ch-border">
              Mode: {goal.progressMode.replace('_', ' ')}
            </span>
          </div>

          <div className="bg-surface-muted/20 p-3.5 rounded border border-ch-border space-y-3">
            {goal.metric ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <div className="text-ch-text-secondary">Key Metric:</div>
                  <div className="font-semibold text-sm text-ch-text-primary mt-0.5">
                    {goal.metric.name}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-ch-text-secondary">Current vs Target:</div>
                  <div className="font-bold text-base text-ch-text-primary">
                    {goal.metric.currentValue} / {goal.metric.targetValue} {goal.metric.unit || ''}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-ch-text-secondary">
                Manual percentage outcome tracking
              </div>
            )}

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-ch-text-secondary">Progress Completion:</span>
                <span className="text-ch-text-primary">{goal.progressPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-surface-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${goal.isAtRisk ? 'bg-danger' : 'bg-accent'}`}
                  style={{ width: `${goal.progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3 & 4: Ownership & Schedule */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <h2 className="text-xs font-semibold text-ch-text-secondary uppercase tracking-wider flex items-center gap-1.5">
              <User size={13} /> Goal Owner
            </h2>
            <div className="p-3 bg-surface-muted/20 rounded border border-ch-border flex items-center gap-2.5">
              <Avatar name={goal.ownerName} size="sm" />
              <div>
                <div className="font-semibold text-xs text-ch-text-primary">{goal.ownerName}</div>
                <div className="text-[10px] text-ch-text-secondary">Accountable Owner</div>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xs font-semibold text-ch-text-secondary uppercase tracking-wider flex items-center gap-1.5">
              <Calendar size={13} /> Target Timeline
            </h2>
            <div className="p-3 bg-surface-muted/20 rounded border border-ch-border space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-ch-text-secondary">Started:</span>
                <span className="font-medium text-ch-text-primary">{formatDate(goal.startDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ch-text-secondary">Target Date:</span>
                <span className="font-bold text-ch-text-primary">{formatDate(goal.targetDate)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Linked Execution Plans */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-ch-text-secondary uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={13} /> Linked Execution Plans ({linkedPlans.length})
            </h2>
            <Button size="sm" variant="ghost" onClick={() => onCreatePlanForGoal(goal)} className="text-xs h-7">
              <Plus size={13} className="mr-1" /> Add Plan
            </Button>
          </div>

          <div className="space-y-2">
            {linkedPlans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => onSelectPlan(plan)}
                className="p-3 bg-surface rounded border border-ch-border hover:border-ch-border-strong cursor-pointer select-none flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="font-bold text-ch-text-primary truncate">{plan.title}</div>
                  <div className="text-ch-text-secondary text-[11px] truncate">
                    Owner: {plan.ownerName} • Due: {formatDate(plan.targetDate)}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-bold text-accent">{plan.progressPercent}%</span>
                  <span className="text-[10px] text-ch-text-secondary bg-surface-muted px-2 py-0.5 rounded border border-ch-border">
                    {plan.status}
                  </span>
                </div>
              </div>
            ))}

            {linkedPlans.length === 0 && (
              <div className="text-center py-6 text-xs text-ch-text-secondary border border-dashed border-ch-border rounded">
                No execution plans linked to this goal yet. Create a plan to break down strategic milestones.
              </div>
            )}
          </div>
        </div>

        {/* Section 8: Activity Log */}
        <div className="space-y-2">
          <h2 className="text-xs font-semibold text-ch-text-secondary uppercase tracking-wider">
            Goal Activity Timeline
          </h2>
          <div className="space-y-2">
            {(goal.activity || []).map((act) => (
              <div
                key={act.id}
                className="p-2.5 text-xs bg-surface-muted/20 border border-ch-border rounded flex items-start gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                <div className="flex-1">
                  <div className="text-ch-text-primary font-medium">{act.action}</div>
                  <div className="text-[10px] text-ch-text-secondary mt-0.5">
                    {act.actorName} • {formatDateTime(act.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Drawer>
  );
}

