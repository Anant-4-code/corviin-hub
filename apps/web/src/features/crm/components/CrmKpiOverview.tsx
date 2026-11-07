import React from 'react';
import { Card } from '@/components/ui/Card';
import {
  Users,
  UserPlus,
  TrendingUp,
  CheckCircle2,
  Clock,
  Award,
} from 'lucide-react';
import { cn } from '@/lib/cn';

export interface CrmKpiMetrics {
  totalRecords: number;
  newLeads: number;
  activeOpportunities: number;
  qualifiedLeads: number;
  followUpsDue: number;
  convertedCount: number;
}

interface CrmKpiOverviewProps {
  metrics: CrmKpiMetrics;
  activeFilter?: string | null;
  onSelectKpi?: (filterKey: string) => void;
}

export function CrmKpiOverview({
  metrics,
  activeFilter,
  onSelectKpi,
}: CrmKpiOverviewProps) {
  const cards = [
    {
      id: 'TOTAL',
      title: 'Total CRM Records',
      subtitle: 'Workspace contacts',
      value: metrics.totalRecords,
      unit: 'records',
      icon: Users,
      color: 'text-ch-text-primary',
      activeBg: 'border-accent bg-accent/5 ring-1 ring-accent/30',
    },
    {
      id: 'NEW_LEADS',
      title: 'New Leads',
      subtitle: 'Acquired in scope',
      value: metrics.newLeads,
      unit: 'enquiries',
      icon: UserPlus,
      color: 'text-blue-500 dark:text-blue-400',
      activeBg: 'border-blue-500 bg-blue-500/10 ring-1 ring-blue-500/30',
    },
    {
      id: 'ACTIVE_OPP',
      title: 'Active Opportunities',
      subtitle: 'In pipeline stages',
      value: metrics.activeOpportunities,
      unit: 'in progress',
      icon: TrendingUp,
      color: 'text-amber-500 dark:text-amber-400',
      activeBg: 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500/30',
    },
    {
      id: 'QUALIFIED',
      title: 'Qualified Leads',
      subtitle: 'Requirements verified',
      value: metrics.qualifiedLeads,
      unit: 'qualified',
      icon: CheckCircle2,
      color: 'text-indigo-500 dark:text-indigo-400',
      activeBg: 'border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500/30',
    },
    {
      id: 'FOLLOW_UPS_DUE',
      title: 'Follow-ups Due',
      subtitle: 'Action required',
      value: metrics.followUpsDue,
      unit: 'due',
      icon: Clock,
      color: metrics.followUpsDue > 0 ? 'text-danger' : 'text-ch-text-muted',
      activeBg: 'border-danger bg-danger/10 ring-1 ring-danger/30',
    },
    {
      id: 'CONVERTED',
      title: 'Converted',
      subtitle: 'Clients & Partners won',
      value: metrics.convertedCount,
      unit: 'won',
      icon: Award,
      color: 'text-emerald-500 dark:text-emerald-400',
      activeBg: 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeFilter === card.id;

        return (
          <Card
            key={card.id}
            onClick={() => onSelectKpi?.(card.id)}
            className={cn(
              'p-3 border transition-none cursor-pointer select-none text-left flex flex-col justify-between',
              isActive
                ? card.activeBg
                : 'border-ch-border bg-surface hover:border-ch-border-strong',
            )}
            role="button"
            tabIndex={0}
            aria-pressed={isActive}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectKpi?.(card.id);
              }
            }}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[11px] font-semibold text-ch-text-secondary truncate">
                {card.title}
              </span>
              <Icon size={14} className={card.color} />
            </div>

            <div className="mt-2 flex items-baseline gap-1.5">
              <span className={cn('text-xl font-bold tracking-tight', card.color)}>
                {card.value}
              </span>
              <span className="text-[10px] text-ch-text-muted truncate">
                {card.unit}
              </span>
            </div>

            <div className="mt-1 text-[10px] text-ch-text-muted truncate font-medium">
              {card.subtitle}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

