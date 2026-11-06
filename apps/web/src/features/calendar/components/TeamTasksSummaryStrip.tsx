import React from 'react';
import { Card } from '@/components/ui/Card';
import { Calendar, Play, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface TeamTasksSummaryStripProps {
  metrics: {
    totalScheduled: number;
    totalOverdue: number;
    totalInProgress: number;
    totalCompleted: number;
  };
}

export function TeamTasksSummaryStrip({ metrics }: TeamTasksSummaryStripProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Card className="p-3 border border-ch-border bg-surface">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-ch-text-secondary">Scheduled for Date</span>
          <Calendar size={14} className="text-ch-text-muted" />
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-xl font-bold text-ch-text-primary">{metrics.totalScheduled}</span>
          <span className="text-[11px] text-ch-text-muted">team tasks</span>
        </div>
      </Card>

      <Card className="p-3 border border-ch-border bg-surface">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-ch-text-secondary">Active Work Sessions</span>
          <Play size={14} className="text-info fill-info/20" />
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-xl font-bold text-info">{metrics.totalInProgress}</span>
          <span className="text-[11px] text-ch-text-muted">in progress</span>
        </div>
      </Card>

      <Card
        className={`p-3 border ${
          metrics.totalOverdue > 0
            ? 'border-danger/30 bg-danger/5'
            : 'border-ch-border bg-surface'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-ch-text-secondary">Urgent / Overdue</span>
          <AlertTriangle
            size={14}
            className={metrics.totalOverdue > 0 ? 'text-danger' : 'text-ch-text-muted'}
          />
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span
            className={`text-xl font-bold ${
              metrics.totalOverdue > 0 ? 'text-danger' : 'text-ch-text-primary'
            }`}
          >
            {metrics.totalOverdue}
          </span>
          <span className="text-[11px] text-ch-text-muted">needs attention</span>
        </div>
      </Card>

      <Card className="p-3 border border-ch-border bg-surface">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-ch-text-secondary">Completed</span>
          <CheckCircle2 size={14} className="text-success" />
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-xl font-bold text-success">{metrics.totalCompleted}</span>
          <span className="text-[11px] text-ch-text-muted">delivered</span>
        </div>
      </Card>
    </div>
  );
}

