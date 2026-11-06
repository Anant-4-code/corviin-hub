import React from 'react';
import { CalendarOverviewMetrics } from '@corviin-hub/shared';
import { Calendar, Clock, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface CalendarSummaryStripProps {
  metrics: CalendarOverviewMetrics;
}

export function CalendarSummaryStrip({ metrics }: CalendarSummaryStripProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Card className="p-3 border border-ch-border bg-surface">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-ch-text-secondary">Calendar Items</span>
          <Calendar size={14} className="text-ch-text-muted" />
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-xl font-bold text-ch-text-primary">{metrics.totalItems}</span>
          <span className="text-[11px] text-ch-text-muted">
            in {metrics.activeCampaigns} campaigns
          </span>
        </div>
      </Card>

      <Card className="p-3 border border-ch-border bg-surface">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-ch-text-secondary">Scheduled Posts</span>
          <Clock size={14} className="text-info" />
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-xl font-bold text-info">{metrics.scheduledPosts}</span>
          <span className="text-[11px] text-ch-text-muted">ready to publish</span>
        </div>
      </Card>

      <Card className="p-3 border border-ch-border bg-surface">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-ch-text-secondary">Published Live</span>
          <CheckCircle2 size={14} className="text-success" />
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-xl font-bold text-success">{metrics.publishedPosts}</span>
          <span className="text-[11px] text-ch-text-muted">live on social/web</span>
        </div>
      </Card>

      <Card
        className={`p-3 border ${
          metrics.overdueItems > 0
            ? 'border-danger/30 bg-danger/5'
            : 'border-ch-border bg-surface'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-ch-text-secondary">Overdue / Delayed</span>
          <AlertTriangle
            size={14}
            className={metrics.overdueItems > 0 ? 'text-danger' : 'text-ch-text-muted'}
          />
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span
            className={`text-xl font-bold ${
              metrics.overdueItems > 0 ? 'text-danger' : 'text-ch-text-primary'
            }`}
          >
            {metrics.overdueItems}
          </span>
          <span className="text-[11px] text-ch-text-muted">action required</span>
        </div>
      </Card>
    </div>
  );
}

