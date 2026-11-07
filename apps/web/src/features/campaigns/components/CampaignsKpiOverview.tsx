import React from 'react';
import { Card } from '@/components/ui/Card';
import { CampaignItem, CampaignStage, ContentStatus } from '@corviin-hub/shared';
import {
  Megaphone,
  Play,
  FileEdit,
  CheckCircle2,
  PauseCircle,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/cn';

interface CampaignsKpiOverviewProps {
  campaigns: CampaignItem[];
  activeFilter?: string | null;
  onSelectKpi?: (filterKey: string) => void;
}

export function CampaignsKpiOverview({
  campaigns,
  activeFilter,
  onSelectKpi,
}: CampaignsKpiOverviewProps) {
  const total = campaigns.length;

  // Active: status is IN_PROGRESS or stage is 2, 3, 4 and not completed
  const activeCount = campaigns.filter(
    (c) =>
      c.status === ContentStatus.IN_PROGRESS ||
      (c.stage !== CampaignStage.INITIAL_IDEA &&
        c.stage !== CampaignStage.POSTING_COMPLETION &&
        c.status !== ContentStatus.PUBLISHED &&
        c.status !== ContentStatus.ARCHIVED),
  ).length;

  // Planning: Stage 1 (Initial Idea) or Stage 2 (Scripting & Planning)
  const planningCount = campaigns.filter(
    (c) =>
      c.stage === CampaignStage.INITIAL_IDEA ||
      c.stage === CampaignStage.SCRIPTING_PLANNING,
  ).length;

  // Completed: Stage 5 or status PUBLISHED
  const completedCount = campaigns.filter(
    (c) =>
      c.stage === CampaignStage.POSTING_COMPLETION ||
      c.status === ContentStatus.PUBLISHED,
  ).length;

  // On Hold: status is ARCHIVED or PLANNED with paused flag
  const onHoldCount = campaigns.filter(
    (c) => c.status === ContentStatus.ARCHIVED,
  ).length;

  // Upcoming: start date is in the future
  const now = new Date();
  const upcomingCount = campaigns.filter((c) => {
    try {
      return new Date(c.startDate) > now;
    } catch {
      return false;
    }
  }).length;

  const cards = [
    {
      id: 'ALL',
      title: 'Total Campaigns',
      subtitle: 'Workspace pipeline',
      value: total,
      unit: 'sprints',
      icon: Megaphone,
      color: 'text-ch-text-primary',
      activeBg: 'border-accent bg-accent/5 ring-1 ring-accent/30',
    },
    {
      id: 'ACTIVE',
      title: 'Active Campaigns',
      subtitle: 'In production',
      value: activeCount,
      unit: 'running',
      icon: Play,
      color: 'text-blue-500 dark:text-blue-400',
      activeBg: 'border-blue-500 bg-blue-500/10 ring-1 ring-blue-500/30',
    },
    {
      id: 'PLANNING',
      title: 'Planning',
      subtitle: 'Idea & Scripting',
      value: planningCount,
      unit: 'in prep',
      icon: FileEdit,
      color: 'text-amber-500 dark:text-amber-400',
      activeBg: 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500/30',
    },
    {
      id: 'COMPLETED',
      title: 'Completed',
      subtitle: 'Published & closed',
      value: completedCount,
      unit: 'delivered',
      icon: CheckCircle2,
      color: 'text-emerald-500 dark:text-emerald-400',
      activeBg: 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500/30',
    },
    {
      id: 'ON_HOLD',
      title: 'On Hold',
      subtitle: 'Paused / Archived',
      value: onHoldCount,
      unit: 'paused',
      icon: PauseCircle,
      color: 'text-ch-text-muted',
      activeBg: 'border-ch-border-strong bg-surface-muted ring-1 ring-ch-border-strong',
    },
    {
      id: 'UPCOMING',
      title: 'Upcoming',
      subtitle: 'Future schedule',
      value: upcomingCount,
      unit: 'scheduled',
      icon: Calendar,
      color: 'text-purple-500 dark:text-purple-400',
      activeBg: 'border-purple-500 bg-purple-500/10 ring-1 ring-purple-500/30',
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

