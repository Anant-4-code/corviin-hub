import React from 'react';
import {
  PartnerCrmSummaryDto,
  RealEstatePartnerType,
  RealEstatePartnerStage,
  PartnerCrmFilterDto,
} from '@corviin-hub/shared';
import {
  PARTNER_TYPE_LABELS,
  PARTNER_TYPE_BADGE_CLASSES,
} from './partner-crm-constants';

interface PartnerSummaryStripProps {
  summary?: PartnerCrmSummaryDto;
  isLoading?: boolean;
  activeFilter?: PartnerCrmFilterDto;
  onFilterSelect?: (filter: Partial<PartnerCrmFilterDto>) => void;
}

export const PartnerSummaryStrip: React.FC<PartnerSummaryStripProps> = ({
  summary,
  isLoading,
  activeFilter,
  onFilterSelect,
}) => {
  if (isLoading || !summary) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-surface border border-ch-border rounded-lg p-3 h-20 animate-pulse" />
        ))}
      </div>
    );
  }

  const newLeadsCount = summary.byStage?.[RealEstatePartnerStage.NEW_PARTNER_LEAD] ?? 0;
  const meetingsPlannedCount = summary.byStage?.[RealEstatePartnerStage.MEETING_PLANNED] ?? 0;
  const inNegotiationCount = summary.byStage?.[RealEstatePartnerStage.FOLLOWUP_NEGOTIATION] ?? 0;
  const confirmedCount = summary.confirmedPartners ?? 0;
  const activePartnersCount = summary.activePartners ?? 0;
  const inPipelineCount = summary.leadsInPipeline ?? 0;
  const totalProjectsCount = summary.totalProjectsCount ?? 0;
  const overdueFollowUpsCount = summary.overdueFollowUpsCount ?? 0;

  const kpis = [
    {
      id: 'total',
      label: 'Total Partners',
      sublabel: 'Directory count',
      count: summary.totalPartners,
      color: 'text-ch-text-primary',
      isActive:
        !activeFilter?.stage &&
        !activeFilter?.partnerType &&
        (!activeFilter?.followUpDue || activeFilter.followUpDue === 'ALL'),
      filter: { stage: undefined, partnerType: undefined, followUpDue: 'ALL' as const },
    },
    {
      id: 'active',
      label: 'Active Partners',
      sublabel: 'Operational mandates',
      count: activePartnersCount,
      color: 'text-emerald-600 dark:text-emerald-400',
      isActive: activeFilter?.stage === RealEstatePartnerStage.ACTIVE_PARTNER,
      filter: { stage: RealEstatePartnerStage.ACTIVE_PARTNER },
    },
    {
      id: 'confirmed',
      label: 'Confirmed',
      sublabel: 'Mandates finalized',
      count: confirmedCount,
      color: 'text-blue-600 dark:text-blue-400',
      isActive: activeFilter?.stage === RealEstatePartnerStage.PARTNERSHIP_CONFIRMED,
      filter: { stage: RealEstatePartnerStage.PARTNERSHIP_CONFIRMED },
    },
    {
      id: 'in_pipeline',
      label: 'In Pipeline',
      sublabel: 'Prospects & negotiation',
      count: inPipelineCount,
      color: 'text-amber-600 dark:text-amber-400',
      isActive: Boolean(activeFilter?.stage && activeFilter.stage !== RealEstatePartnerStage.ACTIVE_PARTNER),
      filter: { stage: RealEstatePartnerStage.FOLLOWUP_NEGOTIATION },
    },
    {
      id: 'total_projects',
      label: 'Total Projects',
      sublabel: 'Represented properties',
      count: totalProjectsCount,
      color: 'text-indigo-600 dark:text-indigo-400',
      isActive: false,
      filter: {},
    },
    {
      id: 'overdue_followups',
      label: 'Overdue Follow-ups',
      sublabel: 'Action required',
      count: overdueFollowUpsCount,
      color: 'text-rose-600 dark:text-rose-400',
      isActive: activeFilter?.followUpDue === 'OVERDUE' || activeFilter?.followUpDue === 'TODAY',
      filter: { followUpDue: 'OVERDUE' as const },
    },
  ];

  return (
    <div className="space-y-3 mb-6">
      {/* Primary KPI Grid (Clickable) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((kpi) => {
          const isSelected = kpi.isActive;
          return (
            <button
              key={kpi.id}
              type="button"
              onClick={() => onFilterSelect && onFilterSelect(kpi.filter)}
              className={`bg-surface border rounded-lg p-3 text-left transition-none select-none cursor-pointer hover:bg-ch-bg/40 ${
                isSelected
                  ? 'border-accent ring-1 ring-accent bg-accent/5'
                  : 'border-ch-border hover:border-ch-border-hover'
              }`}
            >
              <p className={`text-xs font-semibold uppercase tracking-wider ${kpi.color}`}>
                {kpi.label}
              </p>
              <p className={`text-2xl font-bold mt-1 ${kpi.color}`}>{kpi.count}</p>
              <p className="text-[11px] text-ch-text-tertiary mt-0.5 truncate">{kpi.sublabel}</p>
            </button>
          );
        })}
      </div>

      {/* Secondary Metrics Bar: Partner Category Pills & Team Workload */}
      <div className="bg-surface border border-ch-border rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-ch-text-secondary">Partner Breakdown:</span>
          {Object.entries(summary.byType).map(([type, count]) => {
            const isSelected = activeFilter?.partnerType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() =>
                  onFilterSelect &&
                  onFilterSelect({
                    partnerType: isSelected ? undefined : (type as RealEstatePartnerType),
                  })
                }
                className={`px-2.5 py-0.5 rounded-full border text-xs font-medium cursor-pointer transition-none ${
                  isSelected
                    ? 'ring-2 ring-accent border-accent font-bold'
                    : ''
                } ${PARTNER_TYPE_BADGE_CLASSES[type as RealEstatePartnerType] || 'border-ch-border'}`}
                title={`Filter by ${PARTNER_TYPE_LABELS[type as RealEstatePartnerType]}`}
              >
                {PARTNER_TYPE_LABELS[type as RealEstatePartnerType]}: {count}
              </button>
            );
          })}
        </div>

        {/* Team Workload */}
        {summary.byMember && summary.byMember.length > 0 && (
          <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-ch-border pt-2 md:pt-0 md:pl-3">
            <span className="font-semibold text-ch-text-secondary">Team Workload:</span>
            {summary.byMember.map((m) => {
              const isSelected = activeFilter?.assignedMemberId === m.memberId;
              return (
                <button
                  key={m.memberId}
                  type="button"
                  onClick={() =>
                    onFilterSelect &&
                    onFilterSelect({
                      assignedMemberId: isSelected ? undefined : m.memberId,
                    })
                  }
                  className={`text-ch-text-secondary hover:text-ch-text-primary px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-ch-bg text-ch-text-primary font-bold' : ''
                  }`}
                  title={`Filter assignments for ${m.memberName}`}
                >
                  <strong className="text-ch-text-primary">{m.memberName}</strong>: {m.totalAssigned} ({m.activeCount} active)
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Pipeline Stage Quick Filters (New Leads, Meetings Planned, In Negotiation, Follow-ups Due) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <button
          type="button"
          onClick={() =>
            onFilterSelect && onFilterSelect({ stage: RealEstatePartnerStage.NEW_PARTNER_LEAD })
          }
          className={`bg-surface border rounded-lg p-2.5 flex items-center justify-between text-left transition-none hover:bg-ch-bg/40 ${
            activeFilter?.stage === RealEstatePartnerStage.NEW_PARTNER_LEAD
              ? 'border-accent ring-1 ring-accent'
              : 'border-ch-border'
          }`}
        >
          <span className="text-ch-text-secondary font-medium">New Partner Leads</span>
          <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">{newLeadsCount}</span>
        </button>

        <button
          type="button"
          onClick={() =>
            onFilterSelect && onFilterSelect({ stage: RealEstatePartnerStage.MEETING_PLANNED })
          }
          className={`bg-surface border rounded-lg p-2.5 flex items-center justify-between text-left transition-none hover:bg-ch-bg/40 ${
            activeFilter?.stage === RealEstatePartnerStage.MEETING_PLANNED
              ? 'border-accent ring-1 ring-accent'
              : 'border-ch-border'
          }`}
        >
          <span className="text-ch-text-secondary font-medium">Meetings Planned</span>
          <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">{meetingsPlannedCount}</span>
        </button>

        <button
          type="button"
          onClick={() =>
            onFilterSelect && onFilterSelect({ stage: RealEstatePartnerStage.FOLLOWUP_NEGOTIATION })
          }
          className={`bg-surface border rounded-lg p-2.5 flex items-center justify-between text-left transition-none hover:bg-ch-bg/40 ${
            activeFilter?.stage === RealEstatePartnerStage.FOLLOWUP_NEGOTIATION
              ? 'border-accent ring-1 ring-accent'
              : 'border-ch-border'
          }`}
        >
          <span className="text-ch-text-secondary font-medium">In Negotiation</span>
          <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">{inNegotiationCount}</span>
        </button>

        <button
          type="button"
          onClick={() =>
            onFilterSelect && onFilterSelect({ followUpDue: 'OVERDUE' })
          }
          className={`bg-surface border rounded-lg p-2.5 flex items-center justify-between text-left transition-none hover:bg-ch-bg/40 ${
            activeFilter?.followUpDue === 'OVERDUE'
              ? 'border-accent ring-1 ring-accent'
              : 'border-ch-border'
          }`}
        >
          <span className="text-ch-text-secondary font-medium">Follow-ups Due</span>
          <span className="font-bold text-rose-600 dark:text-rose-400 text-sm">{overdueFollowUpsCount}</span>
        </button>
      </div>
    </div>
  );
};
