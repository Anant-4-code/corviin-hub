import React from 'react';
import {
  RealEstatePartnerRecord,
  RealEstatePartnerStage,
} from '@corviin-hub/shared';
import {
  PARTNER_STAGE_ORDER,
  PARTNER_ALTERNATIVE_STAGES,
  PARTNER_STAGE_LABELS,
  PARTNER_TYPE_LABELS,
  PARTNER_TYPE_BADGE_CLASSES,
} from './partner-crm-constants';

interface PartnerRecordsBoardViewProps {
  records: RealEstatePartnerRecord[];
  onSelectRecord: (record: RealEstatePartnerRecord) => void;
  onQuickAdvanceStage?: (recordId: string, targetStage: RealEstatePartnerStage) => void;
  isLoading?: boolean;
}

export const PartnerRecordsBoardView: React.FC<PartnerRecordsBoardViewProps> = ({
  records,
  onSelectRecord,
  onQuickAdvanceStage,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="min-w-[280px] w-[280px] bg-surface border border-ch-border rounded-lg p-3 h-80 animate-pulse"
          />
        ))}
      </div>
    );
  }

  const allStages = [...PARTNER_STAGE_ORDER, ...PARTNER_ALTERNATIVE_STAGES];

  const isOverdue = (dateStr?: string) => {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date();
  };

  const getNextStage = (currentStage: RealEstatePartnerStage): RealEstatePartnerStage | null => {
    const idx = PARTNER_STAGE_ORDER.indexOf(currentStage);
    if (idx !== -1 && idx < PARTNER_STAGE_ORDER.length - 1) {
      return PARTNER_STAGE_ORDER[idx + 1];
    }
    return null;
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 items-start select-none">
      {allStages.map((stage) => {
        const stageRecords = records.filter((r) => r.stage === stage);
        const isTerminalStage =
          stage === RealEstatePartnerStage.ACTIVE_PARTNER ||
          stage === RealEstatePartnerStage.LOST ||
          stage === RealEstatePartnerStage.NOT_INTERESTED;

        return (
          <div
            key={stage}
            className="min-w-[280px] w-[280px] bg-surface border border-ch-border rounded-lg flex flex-col max-h-[780px] shadow-sm flex-shrink-0"
          >
            {/* Column Header */}
            <div className="p-3 border-b border-ch-border bg-ch-bg rounded-t-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    stage === RealEstatePartnerStage.ACTIVE_PARTNER
                      ? 'bg-emerald-600'
                      : stage === RealEstatePartnerStage.PARTNERSHIP_CONFIRMED
                      ? 'bg-blue-600'
                      : stage === RealEstatePartnerStage.LOST ||
                        stage === RealEstatePartnerStage.NOT_INTERESTED
                      ? 'bg-rose-500'
                      : stage === RealEstatePartnerStage.FOLLOW_UP_LATER
                      ? 'bg-purple-500'
                      : 'bg-accent'
                  }`}
                />
                <h3 className="font-bold text-xs text-ch-text-primary">
                  {PARTNER_STAGE_LABELS[stage]}
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
                  No partners in this stage
                </div>
              ) : (
                stageRecords.map((record) => {
                  const overdue = isOverdue(record.nextFollowUpDate);
                  const nextStage = getNextStage(record.stage);
                  const cleanPhone = record.phone.replace(/\D/g, '');

                  return (
                    <div
                      key={record.id}
                      onClick={() => onSelectRecord(record)}
                      className="bg-ch-bg hover:bg-surface border border-ch-border rounded-md p-3 space-y-2.5 cursor-pointer shadow-sm transition-none"
                    >
                      {/* Header: Company & Category Badge */}
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-semibold text-xs text-ch-text-primary line-clamp-1 hover:text-accent">
                            {record.companyName}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                              PARTNER_TYPE_BADGE_CLASSES[record.partnerType]
                            }`}
                          >
                            {PARTNER_TYPE_LABELS[record.partnerType]}
                          </span>
                          {record.location && (
                            <span className="text-[10px] text-ch-text-secondary truncate">
                              📍 {record.location}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Contact person & quick call */}
                      <div className="flex items-center justify-between text-[11px] text-ch-text-secondary">
                        <span className="truncate">👤 {record.contactPerson || '—'}</span>
                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <a
                            href={`tel:${record.phone}`}
                            className="text-ch-text-tertiary hover:text-accent text-[11px]"
                            title="Call"
                          >
                            📞
                          </a>
                          {cleanPhone && (
                            <a
                              href={`https://wa.me/${cleanPhone}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-600 hover:text-emerald-700 font-bold text-[10px]"
                              title="WhatsApp"
                            >
                              WA
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Projects Preview */}
                      {record.projects && record.projects.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {record.projects.slice(0, 2).map((proj) => (
                            <span
                              key={proj.id}
                              className="bg-surface border border-ch-border text-ch-text-secondary px-1 py-0.5 rounded text-[9px] truncate max-w-[120px]"
                            >
                              🏢 {proj.name}
                            </span>
                          ))}
                          {record.projects.length > 2 && (
                            <span className="text-[9px] text-ch-text-tertiary">
                              +{record.projects.length - 2}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Next Follow-up Reminder */}
                      {record.nextFollowUpDate && (
                        <div
                          className={`p-1.5 rounded border text-[10px] ${
                            overdue
                              ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300'
                              : 'bg-surface border-ch-border text-ch-text-secondary'
                          }`}
                        >
                          <div className="flex items-center justify-between font-medium">
                            <span>Reminder:</span>
                            <span className="font-semibold">
                              {new Date(record.nextFollowUpDate).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                              })}
                              {overdue && ' [OVERDUE]'}
                            </span>
                          </div>
                          {record.nextFollowUpTitle && (
                            <p className="truncate text-ch-text-tertiary mt-0.5">
                              {record.nextFollowUpTitle}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Footer: Assignee & Quick Advance */}
                      <div className="pt-2 border-t border-ch-border flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1.5 truncate max-w-[120px]">
                          <div className="w-4 h-4 rounded-full bg-accent/20 text-accent text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                            {record.assignedMemberName.charAt(0)}
                          </div>
                          <span className="text-ch-text-secondary font-medium truncate">
                            {record.assignedMemberName}
                          </span>
                        </div>

                        {/* Quick Advance Button */}
                        {nextStage && onQuickAdvanceStage && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onQuickAdvanceStage(record.id, nextStage);
                            }}
                            className="text-[10px] text-accent hover:text-accent-hover font-semibold px-1.5 py-0.5 rounded bg-surface border border-ch-border hover:bg-ch-bg flex items-center gap-0.5"
                            title={`Advance to ${PARTNER_STAGE_LABELS[nextStage]}`}
                          >
                            <span>Advance</span> →
                          </button>
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
