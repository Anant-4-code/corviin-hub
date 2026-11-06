import React from 'react';
import type { GoalItem } from '@corviin-hub/shared';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityIndicator } from '@/components/ui/PriorityIndicator';
import { Avatar } from '@/components/ui/Avatar';
import { formatDate } from '@/features/tasks/utils/task-utils';
import { Target, Calendar, AlertTriangle, Layers, Activity } from 'lucide-react';

interface GoalCardProps {
  goal: GoalItem;
  onClick: (goal: GoalItem) => void;
}

export function GoalCard({ goal, onClick }: GoalCardProps) {
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

  const getStatusLabel = (status: GoalItem['status']) => {
    switch (status) {
      case 'NOT_STARTED':
        return 'Not Started';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'AT_RISK':
        return 'At Risk';
      case 'ACHIEVED':
        return 'Achieved';
      case 'MISSED':
        return 'Missed';
      case 'CANCELLED':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getProgressModeLabel = (mode: GoalItem['progressMode']) => {
    switch (mode) {
      case 'TASK_DERIVED':
        return 'Task-derived';
      case 'MILESTONE_DERIVED':
        return 'Milestone-derived';
      case 'MANUAL':
      default:
        return 'Manual';
    }
  };

  return (
    <Card
      onClick={() => onClick(goal)}
      className="p-4 cursor-pointer hover:border-ch-border-strong border-ch-border transition-none select-none flex flex-col justify-between"
    >
      <div className="space-y-3">
        {/* Top bar: Status, Priority, Progress Mode */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge
              type={getGoalStatusBadgeType(goal.status)}
              label={getStatusLabel(goal.status)}
            />
            <PriorityIndicator priority={goal.priority} />
            {goal.isAtRisk && (
              <span className="text-[11px] font-bold text-danger bg-danger/10 px-2 py-0.5 rounded border border-danger/20 flex items-center gap-1">
                <AlertTriangle size={11} /> At Risk
              </span>
            )}
          </div>

          <span className="text-[10px] uppercase font-semibold text-ch-text-secondary bg-surface-muted px-2 py-0.5 rounded border border-ch-border">
            {getProgressModeLabel(goal.progressMode)}
          </span>
        </div>

        {/* Title & Outcome */}
        <div>
          <h3 className="text-sm font-bold text-ch-text-primary line-clamp-2 leading-snug">
            {goal.title}
          </h3>
          <p className="text-xs text-ch-text-secondary line-clamp-2 mt-1 leading-relaxed">
            {goal.expectedOutcome}
          </p>
        </div>

        {/* Risk reason if at risk */}
        {goal.isAtRisk && goal.riskReason && (
          <div className="p-2 bg-danger/10 border border-danger/20 rounded text-xs text-danger space-y-0.5">
            <span className="font-semibold block">Risk Impediment:</span>
            <span className="text-ch-text-primary">{goal.riskReason}</span>
          </div>
        )}

        {/* Metric & Progress bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-ch-text-secondary flex items-center gap-1">
              <Activity size={12} />
              {goal.metric ? goal.metric.name : 'Goal Progress'}
            </span>
            <span className="font-bold text-ch-text-primary">
              {goal.metric
                ? `${goal.metric.currentValue} / ${goal.metric.targetValue} ${goal.metric.unit || ''} (${goal.progressPercent}%)`
                : `${goal.progressPercent}%`}
            </span>
          </div>

          <div className="w-full h-2 bg-surface-muted rounded-full overflow-hidden">
            <div
              className={`h-full ${goal.isAtRisk ? 'bg-danger' : 'bg-accent'}`}
              style={{ width: `${goal.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer: Owner, Target Date, Linked Plans */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-ch-border text-xs text-ch-text-secondary mt-4">
        <div className="flex items-center gap-2">
          <Avatar name={goal.ownerName} size="xs" />
          <span className="font-medium text-ch-text-primary">{goal.ownerName}</span>
        </div>

        <div className="flex items-center gap-3">
          {(goal.linkedPlanIds || []).length > 0 && (
            <span className="flex items-center gap-1 text-[11px]" title="Linked execution plans">
              <Layers size={12} />
              {goal.linkedPlanIds?.length} {goal.linkedPlanIds?.length === 1 ? 'plan' : 'plans'}
            </span>
          )}

          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>Target {formatDate(goal.targetDate)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

