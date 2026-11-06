import React from 'react';
import type { PlanItem } from '@corviin-hub/shared';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityIndicator } from '@/components/ui/PriorityIndicator';
import { Avatar } from '@/components/ui/Avatar';
import { formatDate } from '@/features/tasks/utils/task-utils';
import { Compass, Calendar, CheckSquare, Target, AlertTriangle } from 'lucide-react';

interface PlanCardProps {
  plan: PlanItem;
  onClick: (plan: PlanItem) => void;
}

export function PlanCard({ plan, onClick }: PlanCardProps) {
  const getPlanStatusBadgeType = (status: PlanItem['status']) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'ACTIVE':
        return 'info';
      case 'ON_HOLD':
        return 'warning';
      case 'ARCHIVED':
      case 'DRAFT':
      default:
        return 'neutral';
    }
  };

  const getStatusLabel = (status: PlanItem['status']) => {
    switch (status) {
      case 'DRAFT':
        return 'Draft';
      case 'ACTIVE':
        return 'Active';
      case 'ON_HOLD':
        return 'On Hold';
      case 'COMPLETED':
        return 'Completed';
      case 'ARCHIVED':
        return 'Archived';
      default:
        return status;
    }
  };

  const totalMilestones = (plan.milestones || []).length;
  const completedMilestones = (plan.milestones || []).filter((m) => m.status === 'COMPLETED').length;

  return (
    <Card
      onClick={() => onClick(plan)}
      className="p-4 cursor-pointer hover:border-ch-border-strong border-ch-border transition-none select-none flex flex-col justify-between"
    >
      <div className="space-y-3">
        {/* Top bar: Status, Priority, Linked Goal */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge
              type={getPlanStatusBadgeType(plan.status)}
              label={getStatusLabel(plan.status)}
            />
            <PriorityIndicator priority={plan.priority} />
            {plan.isAtRisk && (
              <span className="text-[11px] font-bold text-danger bg-danger/10 px-2 py-0.5 rounded border border-danger/20 flex items-center gap-1">
                <AlertTriangle size={11} /> At Risk
              </span>
            )}
          </div>

          {plan.goalTitle && (
            <div className="flex items-center gap-1 text-[10px] font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20 truncate max-w-[160px]" title={`Goal: ${plan.goalTitle}`}>
              <Target size={11} className="shrink-0" />
              <span className="truncate">{plan.goalTitle}</span>
            </div>
          )}
        </div>

        {/* Title & Strategy */}
        <div>
          <h3 className="text-sm font-bold text-ch-text-primary line-clamp-2 leading-snug">
            {plan.title}
          </h3>
          <p className="text-xs text-ch-text-secondary line-clamp-2 mt-1 leading-relaxed">
            {plan.strategySummary}
          </p>
        </div>

        {/* Milestone progress */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-ch-text-secondary flex items-center gap-1">
              <CheckSquare size={12} />
              {totalMilestones > 0
                ? `${completedMilestones} of ${totalMilestones} milestones`
                : 'Execution Progress'}
            </span>
            <span className="font-bold text-ch-text-primary">{plan.progressPercent}%</span>
          </div>

          <div className="w-full h-2 bg-surface-muted rounded-full overflow-hidden">
            <div
              className={`h-full ${plan.isAtRisk ? 'bg-danger' : 'bg-info'}`}
              style={{ width: `${plan.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer: Owner & Dates */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-ch-border text-xs text-ch-text-secondary mt-4">
        <div className="flex items-center gap-2">
          <Avatar name={plan.ownerName} size="xs" />
          <span className="font-medium text-ch-text-primary">{plan.ownerName}</span>
        </div>

        <div className="flex items-center gap-1">
          <Calendar size={12} />
          <span>Due {formatDate(plan.targetDate)}</span>
        </div>
      </div>
    </Card>
  );
}

