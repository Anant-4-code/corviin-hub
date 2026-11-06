import React from 'react';
import { PartnerCrmSummaryDto, RealEstatePartnerType } from '@corviin-hub/shared';
import { PARTNER_TYPE_LABELS, PARTNER_TYPE_BADGE_CLASSES } from './partner-crm-constants';

interface PartnerSummaryStripProps {
  summary?: PartnerCrmSummaryDto;
  isLoading?: boolean;
}

export const PartnerSummaryStrip: React.FC<PartnerSummaryStripProps> = ({ summary, isLoading }) => {
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
          <p className="text-xs text-ch-text-secondary uppercase tracking-wider font-semibold">Total Partners</p>
          <p className="text-2xl font-bold text-ch-text-primary mt-1">{summary.totalPartners}</p>
          <p className="text-xs text-ch-text-tertiary mt-0.5">Directory count</p>
        </div>

        <div className="bg-surface border border-ch-border rounded-lg p-3">
          <p className="text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-semibold">Active Partners</p>
          <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">{summary.activePartners}</p>
          <p className="text-xs text-ch-text-tertiary mt-0.5">Operational mandates</p>
        </div>

        <div className="bg-surface border border-ch-border rounded-lg p-3">
          <p className="text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wider font-semibold">Confirmed</p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300 mt-1">{summary.confirmedPartners}</p>
          <p className="text-xs text-ch-text-tertiary mt-0.5">Mandates finalized</p>
        </div>

        <div className="bg-surface border border-ch-border rounded-lg p-3">
          <p className="text-xs text-amber-600 dark:text-amber-400 uppercase tracking-wider font-semibold">In Pipeline</p>
          <p className="text-2xl font-bold text-amber-700 dark:text-amber-300 mt-1">{summary.leadsInPipeline}</p>
          <p className="text-xs text-ch-text-tertiary mt-0.5">Prospects & negotiation</p>
        </div>

        <div className="bg-surface border border-ch-border rounded-lg p-3">
          <p className="text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-wider font-semibold">Total Projects</p>
          <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mt-1">{summary.totalProjectsCount}</p>
          <p className="text-xs text-ch-text-tertiary mt-0.5">Represented properties</p>
        </div>

        <div className="bg-surface border border-ch-border rounded-lg p-3">
          <p className="text-xs text-rose-600 dark:text-rose-400 uppercase tracking-wider font-semibold">Overdue Follow-ups</p>
          <p className="text-2xl font-bold text-rose-700 dark:text-rose-300 mt-1">{summary.overdueFollowUpsCount}</p>
          <p className="text-xs text-ch-text-tertiary mt-0.5">Action required</p>
        </div>
      </div>

      {/* Partner Type Pills & Member Workload */}
      <div className="bg-surface border border-ch-border rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-ch-text-secondary">Partner Breakdown:</span>
          {Object.entries(summary.byType).map(([type, count]) => {
            if (count === 0) return null;
            return (
              <span
                key={type}
                className={`px-2 py-0.5 rounded-full border text-xs font-medium ${
                  PARTNER_TYPE_BADGE_CLASSES[type as RealEstatePartnerType] || ''
                }`}
              >
                {PARTNER_TYPE_LABELS[type as RealEstatePartnerType]}: {count}
              </span>
            );
          })}
        </div>

        {summary.byMember && summary.byMember.length > 0 && (
          <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-ch-border pt-2 md:pt-0 md:pl-3">
            <span className="font-medium text-ch-text-secondary">Team Workload:</span>
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
