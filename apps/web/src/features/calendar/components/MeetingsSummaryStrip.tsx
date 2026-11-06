import React from 'react';
import { Card } from '@/components/ui/Card';
import { Calendar, Video, Building2, CheckCircle2, XCircle } from 'lucide-react';
import { MeetingsOverviewMetrics } from '@corviin-hub/shared';

interface MeetingsSummaryStripProps {
  metrics: MeetingsOverviewMetrics;
}

export function MeetingsSummaryStrip({ metrics }: MeetingsSummaryStripProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      <Card className="p-3 border border-ch-border bg-surface">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-ch-text-secondary">Scheduled</span>
          <Calendar size={14} className="text-primary" />
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-xl font-bold text-ch-text-primary">{metrics.totalScheduled}</span>
          <span className="text-[11px] text-ch-text-muted">upcoming</span>
        </div>
      </Card>

      <Card className="p-3 border border-ch-border bg-surface">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-ch-text-secondary">Online Calls</span>
          <Video size={14} className="text-info" />
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-xl font-bold text-info">{metrics.onlineMeetingsCount}</span>
          <span className="text-[11px] text-ch-text-muted">video meet</span>
        </div>
      </Card>

      <Card className="p-3 border border-ch-border bg-surface">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-ch-text-secondary">Site Visits</span>
          <Building2 size={14} className="text-warning" />
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-xl font-bold text-warning">{metrics.siteVisitsCount}</span>
          <span className="text-[11px] text-ch-text-muted">properties</span>
        </div>
      </Card>

      <Card className="p-3 border border-ch-border bg-surface">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-ch-text-secondary">Completed</span>
          <CheckCircle2 size={14} className="text-success" />
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-xl font-bold text-success">{metrics.completedCount}</span>
          <span className="text-[11px] text-ch-text-muted">conducted</span>
        </div>
      </Card>

      <Card className="p-3 border border-ch-border bg-surface col-span-2 sm:col-span-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-ch-text-secondary">Cancelled / No-Show</span>
          <XCircle size={14} className="text-ch-text-muted" />
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-xl font-bold text-ch-text-muted">{metrics.cancelledOrNoShowCount}</span>
          <span className="text-[11px] text-ch-text-muted">archived</span>
        </div>
      </Card>
    </div>
  );
}

