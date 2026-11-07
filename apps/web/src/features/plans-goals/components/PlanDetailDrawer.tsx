import React, { useState } from 'react';
import type { PlanItem, MilestoneItem } from '@corviin-hub/shared';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityIndicator } from '@/components/ui/PriorityIndicator';
import { Avatar } from '@/components/ui/Avatar';
import { formatDate, formatDateTime } from '@/features/tasks/utils/task-utils';
import {
  Compass,
  Calendar,
  AlertTriangle,
  User,
  Target,
  CheckSquare,
  Plus,
  Clock,
  CheckCircle2,
  ListTodo,
} from 'lucide-react';

interface PlanDetailDrawerProps {
  plan: PlanItem | null;
  open: boolean;
  onClose: () => void;
  onToggleMilestoneStatus: (planId: string, milestoneId: string, currentStatus: string) => Promise<void>;
  onAddMilestone: (planId: string, title: string, dueDate: string) => Promise<void>;
  onInspectGoal: (goalId: string) => void;
}

export function PlanDetailDrawer({
  plan,
  open,
  onClose,
  onToggleMilestoneStatus,
  onAddMilestone,
  onInspectGoal,
}: PlanDetailDrawerProps) {
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDueDate, setNewMilestoneDueDate] = useState('');
  const [addingMilestone, setAddingMilestone] = useState(false);

  if (!plan) return null;

  const totalMilestones = (plan.milestones || []).length;
  const completedMilestones = (plan.milestones || []).filter((m) => m.status === 'COMPLETED').length;

  const handleAddMilestoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim() || !newMilestoneDueDate) return;
    try {
      setAddingMilestone(true);
      await onAddMilestone(plan.id, newMilestoneTitle.trim(), new Date(newMilestoneDueDate).toISOString());
      setNewMilestoneTitle('');
      setNewMilestoneDueDate('');
    } finally {
      setAddingMilestone(false);
    }
  };

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

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={plan.title}
      subtitle={`Operational Plan • ${plan.status}`}
      size="xl"
    >
      <div className="space-y-6 pb-12">
        {/* Header & Status */}
        <div className="space-y-3 pb-4 border-b border-ch-border">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <StatusBadge
                type={getPlanStatusBadgeType(plan.status)}
                label={plan.status}
              />
              <PriorityIndicator priority={plan.priority} />
              {plan.isAtRisk && (
                <span className="text-[11px] font-bold text-danger bg-danger/10 px-2 py-0.5 rounded border border-danger/20 flex items-center gap-1">
                  <AlertTriangle size={11} /> At Risk
                </span>
              )}
            </div>

            <div className="text-xs text-ch-text-secondary">
              Plan ID: <span className="font-mono">{plan.id}</span>
            </div>
          </div>

          <h1 className="text-xl font-bold text-ch-text-primary tracking-tight">
            {plan.title}
          </h1>

          {/* Linked Goal Banner */}
          {plan.goalId && plan.goalTitle && (
            <div
              onClick={() => onInspectGoal(plan.goalId!)}
              className="p-2.5 bg-accent/10 hover:bg-accent/15 border border-accent/30 rounded cursor-pointer select-none flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2 text-accent font-semibold">
                <Target size={14} className="shrink-0" />
                <span>Supporting Goal: {plan.goalTitle}</span>
              </div>
              <span className="text-[11px] text-accent underline">View Goal</span>
            </div>
          )}
        </div>

        {/* Section 1: Strategy & Rationale */}
        <div className="space-y-1.5">
          <h2 className="text-xs font-semibold text-ch-text-secondary uppercase tracking-wider">
            Strategy & Execution Rationale
          </h2>
          <div className="text-sm text-ch-text-primary whitespace-pre-wrap leading-relaxed bg-surface-muted/30 p-3 rounded border border-ch-border">
            {plan.strategySummary}
          </div>
        </div>

        {/* Section 2: Progress Breakdown */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-ch-text-secondary uppercase tracking-wider flex items-center gap-1.5">
              <Compass size={13} /> Execution Progress Breakdown
            </h2>
            <span className="text-[11px] font-semibold text-ch-text-secondary bg-surface-muted px-2 py-0.5 rounded border border-ch-border">
              Mode: {plan.progressMode.replace('_', ' ')}
            </span>
          </div>

          <div className="bg-surface-muted/20 p-3.5 rounded border border-ch-border space-y-2 text-xs">
            <div className="flex justify-between font-medium">
              <span className="text-ch-text-secondary">
                {plan.progressMode === 'MILESTONE_DERIVED'
                  ? `${completedMilestones} of ${totalMilestones} milestones completed`
                  : 'Manual strategic completion'}
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

        {/* Section 3: Milestones Timeline */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-ch-text-secondary uppercase tracking-wider flex items-center gap-1.5">
              <CheckSquare size={13} /> Checkpoint Milestones ({totalMilestones})
            </h2>
          </div>

          <div className="space-y-2">
            {(plan.milestones || []).map((milestone) => {
              const isCompleted = milestone.status === 'COMPLETED';
              const isOverdue = !isCompleted && new Date(milestone.dueDate).getTime() < Date.now();

              return (
                <div
                  key={milestone.id}
                  onClick={() =>
                    onToggleMilestoneStatus(
                      plan.id,
                      milestone.id,
                      isCompleted ? 'PENDING' : 'COMPLETED',
                    )
                  }
                  className={`p-3 rounded border text-xs cursor-pointer select-none transition-none flex items-start gap-3 ${
                    isCompleted
                      ? 'bg-surface-muted/30 border-ch-border text-ch-text-secondary'
                      : 'bg-surface border-ch-border text-ch-text-primary hover:border-accent'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => {}}
                    className="mt-0.5 rounded border-ch-border text-accent focus:ring-accent cursor-pointer"
                  />

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`font-semibold ${isCompleted ? 'line-through text-ch-text-secondary' : 'text-ch-text-primary'}`}>
                        {milestone.title}
                      </span>
                      {isOverdue && (
                        <span className="text-[10px] font-bold text-danger bg-danger/10 px-1.5 py-0.2 rounded border border-danger/20 flex items-center gap-1">
                          <AlertTriangle size={10} /> Overdue
                        </span>
                      )}
                    </div>

                    {milestone.description && (
                      <p className="text-ch-text-secondary text-[11px] leading-relaxed">
                        {milestone.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2 text-[10px] text-ch-text-secondary pt-0.5">
                      <Clock size={11} />
                      <span>Due {formatDate(milestone.dueDate)}</span>
                      {milestone.completedAt && (
                        <span>• Completed {formatDate(milestone.completedAt)}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {totalMilestones === 0 && (
              <div className="text-center py-6 text-xs text-ch-text-secondary border border-dashed border-ch-border rounded">
                No milestones defined for this plan. Add milestones below to track checkpoints.
              </div>
            )}
          </div>

          {/* Add Milestone Form */}
          <form onSubmit={handleAddMilestoneSubmit} className="pt-2 flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Milestone title..."
              value={newMilestoneTitle}
              onChange={(e) => setNewMilestoneTitle(e.target.value)}
              className="flex-1 text-xs px-3 py-1.5 rounded bg-surface border border-ch-border text-ch-text-primary placeholder:text-ch-text-muted focus:outline-none focus:ring-1 focus:ring-accent"
              required
            />
            <input
              type="date"
              value={newMilestoneDueDate}
              onChange={(e) => setNewMilestoneDueDate(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded bg-surface border border-ch-border text-ch-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              required
            />
            <Button
              type="submit"
              size="sm"
              variant="secondary"
              disabled={!newMilestoneTitle.trim() || !newMilestoneDueDate || addingMilestone}
              className="h-8 text-xs shrink-0"
            >
              <Plus size={13} className="mr-1" /> Add Milestone
            </Button>
          </form>
        </div>

        {/* Section 4: Owner & Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <h2 className="text-xs font-semibold text-ch-text-secondary uppercase tracking-wider flex items-center gap-1.5">
              <User size={13} /> Plan Owner
            </h2>
            <div className="p-3 bg-surface-muted/20 rounded border border-ch-border flex items-center gap-2.5">
              <Avatar name={plan.ownerName} size="sm" />
              <div>
                <div className="font-semibold text-xs text-ch-text-primary">{plan.ownerName}</div>
                <div className="text-[10px] text-ch-text-secondary">Execution Lead</div>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xs font-semibold text-ch-text-secondary uppercase tracking-wider flex items-center gap-1.5">
              <Calendar size={13} /> Timeline
            </h2>
            <div className="p-3 bg-surface-muted/20 rounded border border-ch-border space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-ch-text-secondary">Start Date:</span>
                <span className="font-medium text-ch-text-primary">{formatDate(plan.startDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ch-text-secondary">Target Date:</span>
                <span className="font-bold text-ch-text-primary">{formatDate(plan.targetDate)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Resources & Risks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <h2 className="text-xs font-semibold text-ch-text-secondary uppercase tracking-wider">
              Resources & Artifacts
            </h2>
            <div className="p-3 bg-surface-muted/20 rounded border border-ch-border text-xs text-ch-text-primary space-y-1">
              {(plan.resources || []).map((res, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span>{res}</span>
                </div>
              ))}
              {(!plan.resources || plan.resources.length === 0) && (
                <span className="text-ch-text-secondary">No specific resources listed.</span>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xs font-semibold text-ch-text-secondary uppercase tracking-wider">
              Identified Risks & Blockers
            </h2>
            <div className="p-3 bg-surface-muted/20 rounded border border-ch-border text-xs text-ch-text-primary space-y-1">
              {(plan.risks || []).map((risk, i) => (
                <div key={i} className="flex items-center gap-1.5 text-danger font-medium">
                  <AlertTriangle size={12} className="shrink-0" />
                  <span>{risk}</span>
                </div>
              ))}
              {(!plan.risks || plan.risks.length === 0) && (
                <span className="text-ch-text-secondary">No immediate risks identified.</span>
              )}
            </div>
          </div>
        </div>

        {/* Section 8: Activity Log */}
        <div className="space-y-2">
          <h2 className="text-xs font-semibold text-ch-text-secondary uppercase tracking-wider">
            Plan Activity Timeline
          </h2>
          <div className="space-y-2">
            {(plan.activity || []).map((act) => (
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

