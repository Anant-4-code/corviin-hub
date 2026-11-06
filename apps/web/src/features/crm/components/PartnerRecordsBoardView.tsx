import React from 'react';
import { RealEstatePartnerRecord, RealEstatePartnerStage } from '@corviin-hub/shared';
import {
  PARTNER_STAGE_ORDER,
  PARTNER_ALTERNATIVE_STAGES,
  PARTNER_STAGE_LABELS,
  PARTNER_STAGE_BADGE_CLASSES,
  PARTNER_TYPE_LABELS,
  PARTNER_TYPE_BADGE_CLASSES,
} from './partner-crm-constants';

interface PartnerRecordsBoardViewProps {
  records: RealEstatePartnerRecord[];
  onSelectRecord: (record: RealEstatePartnerRecord) => void;
  isLoading?: boolean;
}

export const PartnerRecordsBoardView: React.FC<PartnerRecordsBoardViewProps> = ({
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

  const allStages = [...PARTNER_STAGE_ORDER, ...PARTNER_ALTERNATIVE_STAGES];

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
                    stage === RealEstatePartnerStage.ACTIVE_PARTNER
                      ? 'bg-green-600'
                      : stage === RealEstatePartnerStage.PARTNERSHIP_CONFIRMED
                      ? 'bg-emerald-500'
                      : stage === RealEstatePartnerStage.LOST || stage === RealEstatePartnerStage.NOT_INTERESTED
                      ? 'bg-rose-500'
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

                  return (
                    <div
                      key={record.id}
                      onClick={() => onSelectRecord(record)}
                      className="bg-ch-bg hover:bg-surface border border-ch-border rounded-md p-3 space-y-2 cursor-pointer shadow-sm"
                    >
                      {/* Company & Type */}
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-semibold text-xs text-ch-text-primary line-clamp-1">
                            {record.companyName}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-medium border ${
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

                      {/* Contact person */}
                      {record.contactPerson && (
                        <p className="text-[11px] text-ch-text-secondary">
                          👤 {record.contactPerson}
                        </p>
                      )}

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

                      {/* Footer: Follow-up & Assignee */}
                      <div className="pt-2 border-t border-ch-border flex items-center justify-between text-[11px]">
                        <span className="text-ch-text-secondary font-medium truncate max-w-[100px]">
                          {record.assignedMemberName}
                        </span>

                        {record.nextFollowUpDate && (
                          <span
                            className={`text-[10px] font-semibold ${
                              overdue
                                ? 'text-rose-600 dark:text-rose-400'
                                : 'text-ch-text-secondary'
                            }`}
                            title={record.nextFollowUpTitle}
                          >
                            {new Date(record.nextFollowUpDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                            })}
                            {overdue && ' ⚠️'}
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
