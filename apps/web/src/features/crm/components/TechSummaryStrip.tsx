import {
  Users,
  CheckCircle2,
  Clock,
  Briefcase,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { TechCrmSummaryDto } from '@corviin-hub/shared';

interface TechSummaryStripProps {
  summary: TechCrmSummaryDto;
  onFilterOverdue?: () => void;
  onFilterDueToday?: () => void;
  onFilterQualified?: () => void;
  onFilterWon?: () => void;
}

export function TechSummaryStrip({
  summary,
  onFilterOverdue,
  onFilterDueToday,
  onFilterQualified,
  onFilterWon,
}: TechSummaryStripProps) {
  return (
    <div className="space-y-3">
      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Total Enquiries */}
        <Card className="p-3 bg-surface border-ch-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ch-text-secondary">
              Total Enquiries
            </span>
            <Users className="w-4 h-4 text-ch-text-muted" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-ch-text-primary">
              {summary.totalEnquiries}
            </span>
            <span className="text-xs text-ch-text-muted">pipeline items</span>
          </div>
        </Card>

        {/* Qualified Opportunities */}
        <Card
          className="p-3 bg-surface border-ch-border cursor-pointer hover:border-ch-accent/50"
          onClick={onFilterQualified}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ch-text-secondary">
              Qualified Pipeline
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {summary.qualifiedOpportunities}
            </span>
            <span className="text-xs text-ch-text-muted">deals active</span>
          </div>
        </Card>

        {/* Won Clients */}
        <Card
          className="p-3 bg-surface border-ch-border cursor-pointer hover:border-ch-accent/50"
          onClick={onFilterWon}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ch-text-secondary">
              Won / Clients
            </span>
            <Briefcase className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-sky-600 dark:text-sky-400">
              {summary.wonClientsCount}
            </span>
            <span className="text-xs text-ch-text-muted">retainers & accounts</span>
          </div>
        </Card>

        {/* Follow-ups Due & Overdue */}
        <Card className="p-3 bg-surface border-ch-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ch-text-secondary">
              Follow-ups Status
            </span>
            {summary.overdueFollowUps > 0 ? (
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            ) : (
              <Clock className="w-4 h-4 text-ch-text-muted" />
            )}
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <button
              onClick={onFilterDueToday}
              className="text-2xl font-bold text-ch-text-primary hover:underline"
              title="Click to view due today"
            >
              {summary.followUpsDueToday}
            </button>
            <span className="text-xs text-ch-text-muted">due today</span>
            {summary.overdueFollowUps > 0 && (
              <button
                onClick={onFilterOverdue}
                className="ml-auto inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-bold bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20"
                title="Click to filter overdue"
              >
                <span>{summary.overdueFollowUps} overdue</span>
              </button>
            )}
          </div>
        </Card>
      </div>

      {/* Member Workload Distribution Row */}
      {summary.workloadByMember && summary.workloadByMember.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 p-2.5 bg-surface border border-ch-border text-xs">
          <span className="font-semibold text-ch-text-secondary mr-1">
            Workload by Lead:
          </span>
          {summary.workloadByMember.map((m) => (
            <div
              key={m.memberId}
              className="inline-flex items-center gap-1.5 px-2 py-1 bg-surface-raised border border-ch-border"
            >
              <span className="font-medium text-ch-text-primary">
                {m.memberName}:
              </span>
              <span className="text-ch-text-secondary">
                {m.activeCount} active
              </span>
              {m.wonCount > 0 && (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  ({m.wonCount} won)
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

