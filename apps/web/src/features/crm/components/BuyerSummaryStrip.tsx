import React from 'react';
import { BuyerCrmSummaryDto, BuyerPropertyConfiguration } from '@corviin-hub/shared';
import { BUYER_CONFIGURATION_LABELS } from './buyer-crm-constants';

interface BuyerSummaryStripProps {
  summary?: BuyerCrmSummaryDto;
  isLoading?: boolean;
}

export const BuyerSummaryStrip: React.FC<BuyerSummaryStripProps> = ({ summary, isLoading }) => {
  if (isLoading || !summary) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-surface border border-ch-border rounded-lg p-3 h-20" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3 mb-6">
      {/* Primary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-surface border border-ch-border rounded-lg p-3">
          <p className="text-xs text-ch-text-secondary uppercase tracking-wider font-semibold">Total Buyers</p>
          <p className="text-2xl font-bold text-ch-text-primary mt-1">{summary.totalBuyers}</p>
          <p className="text-xs text-ch-text-tertiary mt-0.5">Enquiry pool</p>
        </div>

        <div className="bg-surface border border-ch-border rounded-lg p-3">
          <p className="text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wider font-semibold">In Pipeline</p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300 mt-1">{summary.activePipelineCount}</p>
          <p className="text-xs text-ch-text-tertiary mt-0.5">Active prospects</p>
        </div>

        <div className="bg-surface border border-ch-border rounded-lg p-3">
          <p className="text-xs text-amber-600 dark:text-amber-400 uppercase tracking-wider font-semibold">Visits Planned</p>
          <p className="text-2xl font-bold text-amber-700 dark:text-amber-300 mt-1">{summary.siteVisitsPlannedCount}</p>
          <p className="text-xs text-ch-text-tertiary mt-0.5">Scheduled walkthroughs</p>
        </div>

        <div className="bg-surface border border-ch-border rounded-lg p-3">
          <p className="text-xs text-teal-600 dark:text-teal-400 uppercase tracking-wider font-semibold">Visits Done</p>
          <p className="text-2xl font-bold text-teal-700 dark:text-teal-300 mt-1">{summary.siteVisitsCompletedCount}</p>
          <p className="text-xs text-ch-text-tertiary mt-0.5">Completed tours</p>
        </div>

        <div className="bg-surface border border-ch-border rounded-lg p-3">
          <p className="text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-semibold">Bookings</p>
          <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">{summary.bookingsConvertedCount}</p>
          <p className="text-xs text-ch-text-tertiary mt-0.5">Converted customers</p>
        </div>

        <div className="bg-surface border border-ch-border rounded-lg p-3">
          <p className="text-xs text-rose-600 dark:text-rose-400 uppercase tracking-wider font-semibold">Overdue Follow-ups</p>
          <p className="text-2xl font-bold text-rose-700 dark:text-rose-300 mt-1">{summary.overdueFollowUpsCount}</p>
          <p className="text-xs text-ch-text-tertiary mt-0.5">Urgent outreach</p>
        </div>
      </div>

      {/* Configuration Distribution & Team Member Workload */}
      <div className="bg-surface border border-ch-border rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-ch-text-secondary">Demand By Configuration:</span>
          {Object.entries(summary.byConfiguration).map(([config, count]) => {
            const label = BUYER_CONFIGURATION_LABELS[config as BuyerPropertyConfiguration] || config;
            return (
              <span
                key={config}
                className="px-2 py-0.5 rounded-full border border-ch-border bg-ch-bg text-ch-text-primary text-xs font-medium"
              >
                {label}: {count}
              </span>
            );
          })}
        </div>

        {summary.byMember && summary.byMember.length > 0 && (
          <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-ch-border pt-2 md:pt-0 md:pl-3">
            <span className="font-medium text-ch-text-secondary">Sales Desk:</span>
            {summary.byMember.map((m) => (
              <span key={m.memberId} className="text-ch-text-secondary">
                <strong className="text-ch-text-primary">{m.memberName}</strong>: {m.totalAssigned} ({m.activeCount} active)
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

