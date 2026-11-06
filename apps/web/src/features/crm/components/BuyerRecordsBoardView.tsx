import React from 'react';
import {
  RealEstateBuyerRecord,
  RealEstateBuyerStage,
  BuyerPropertyConfiguration,
} from '@corviin-hub/shared';
import {
  BUYER_STAGE_ORDER,
  BUYER_ALTERNATIVE_STAGES,
  BUYER_STAGE_LABELS,
  BUYER_STAGE_BADGE_CLASSES,
  BUYER_CONFIGURATION_LABELS,
  formatInrBudgetRange,
} from './buyer-crm-constants';

interface BuyerRecordsBoardViewProps {
  records: RealEstateBuyerRecord[];
  onSelectRecord: (record: RealEstateBuyerRecord) => void;
  isLoading?: boolean;
}

export const BuyerRecordsBoardView: React.FC<BuyerRecordsBoardViewProps> = ({
  records,
  onSelectRecord,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="min-w-[280px] w-[280px] bg-surface border border-ch-border rounded-lg p-3 h-80" />
        ))}
      </div>
    );
  }

  const allStages = [...BUYER_STAGE_ORDER, ...BUYER_ALTERNATIVE_STAGES];

  const isOverdue = (dateStr?: string) => {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date();
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 items-start select-none">
      {allStages.map((stage) => {
        const stageRecords = records.filter((r) => r.stage === stage);

        return (
          <div
            key={stage}
            className="min-w-[280px] w-[280px] bg-surface border border-ch-border rounded-lg flex flex-col max-h-[750px] shadow-sm flex-shrink-0"
          >
            {/* Column Header */}
            <div className="p-3 border-b border-ch-border bg-ch-bg rounded-t-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    stage === RealEstateBuyerStage.BOOKING_CONVERTED
                      ? 'bg-emerald-600'
                      : stage === RealEstateBuyerStage.SITE_VISIT_PLANNED || stage === RealEstateBuyerStage.SITE_VISIT_COMPLETED
                      ? 'bg-amber-500'
                      : stage === RealEstateBuyerStage.LOST || stage === RealEstateBuyerStage.NOT_INTERESTED
                      ? 'bg-rose-500'
                      : 'bg-accent'
                  }`}
                />
                <h3 className="font-bold text-xs text-ch-text-primary">
                  {BUYER_STAGE_LABELS[stage]}
                </h3>
              </div>
              <span className="text-xs bg-surface border border-ch-border font-semibold px-2 py-0.5 rounded-full text-ch-text-secondary">
                {stageRecords.length}
              </span>
            </div>

            {/* Column Cards */}
            <div className="p-2 space-y-2 overflow-y-auto flex-1">
              {stageRecords.length === 0 ? (
                <div className="p-4 text-center text-xs text-ch-text-tertiary border border-dashed border-ch-border rounded-md">
                  No buyers in this stage
                </div>
              ) : (
                stageRecords.map((record) => {
                  const b = record as any;
                  const overdue = isOverdue(b.nextFollowUpDate);
                  const siteVisitsCount = b.siteVisits?.length || b.siteVisitIds?.length || 0;

                  return (
                    <div
                      key={b.id}
                      onClick={() => onSelectRecord(b)}
                      className="bg-ch-bg hover:bg-surface border border-ch-border rounded-md p-3 space-y-2 cursor-pointer shadow-sm"
                    >
                      {/* Name & Budget */}
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-semibold text-xs text-ch-text-primary line-clamp-1">
                            {b.customerName || b.fullName}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          {b.configuration && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium border bg-surface text-ch-text-secondary border-ch-border">
                              {BUYER_CONFIGURATION_LABELS[b.configuration as BuyerPropertyConfiguration] || b.configuration}
                            </span>
                          )}
                          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            {formatInrBudgetRange(
                              b.minBudget ?? b.minBudgetINR,
                              b.maxBudget ?? b.maxBudgetINR
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Locality & Preferred Project */}
                      <div className="text-[11px] text-ch-text-tertiary">
                        <div>Loc: {b.locality || b.preferredLocality || 'Any'}</div>
                        {b.preferredProject && (
                          <div className="truncate text-ch-text-secondary">Proj: {b.preferredProject}</div>
                        )}
                      </div>

                      {/* Site Visits summary badge if any */}
                      {siteVisitsCount > 0 && (
                        <div className="flex items-center gap-1 text-[10px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                          <span>
                            📍 {siteVisitsCount} Site Visit{siteVisitsCount > 1 ? 's' : ''}
                          </span>
                        </div>
                      )}

                      {/* Footer: Follow-up & Assignee */}
                      <div className="flex items-center justify-between text-[10px] pt-1 border-t border-ch-border/60">
                        <span className="text-ch-text-secondary truncate max-w-[120px]">
                          👤 {b.assignedMemberName}
                        </span>
                        {b.nextFollowUpDate && (
                          <span
                            className={`font-medium ${
                              overdue ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-ch-text-tertiary'
                            }`}
                          >
                            {overdue ? '⚠️ ' : '📅 '}
                            {new Date(b.nextFollowUpDate).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
