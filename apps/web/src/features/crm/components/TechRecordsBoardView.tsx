import { Clock, Phone, MessageSquare, ArrowRight, User } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TechCrmRecord, TechPipelineStage } from '@corviin-hub/shared';
import {
  TECH_STAGE_LABELS,
  TECH_STAGE_COLORS,
  TECH_PIPELINE_STAGES_ORDER,
  TECH_CATEGORY_LABELS,
  TECH_CATEGORY_COLORS,
} from './tech-crm-constants';

interface TechRecordsBoardViewProps {
  records: TechCrmRecord[];
  onSelectRecord: (record: TechCrmRecord) => void;
  onChangeStage?: (record: TechCrmRecord, targetStage: TechPipelineStage) => void;
}

export function TechRecordsBoardView({
  records,
  onSelectRecord,
}: TechRecordsBoardViewProps) {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  // Group records by stage
  const recordsByStage = TECH_PIPELINE_STAGES_ORDER.reduce(
    (acc, stage) => {
      acc[stage] = records.filter((r) => r.stage === stage);
      return acc;
    },
    {} as Record<TechPipelineStage, TechCrmRecord[]>,
  );

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 pt-1 min-h-[500px]">
      {TECH_PIPELINE_STAGES_ORDER.map((stage) => {
        const stageRecords = recordsByStage[stage] || [];
        const totalBudget = stageRecords.reduce(
          (sum, r) => sum + (r.estimatedBudget || 0),
          0,
        );

        return (
          <div
            key={stage}
            className="w-72 shrink-0 flex flex-col bg-surface border border-ch-border"
          >
            {/* Column Header */}
            <div className="p-2.5 border-b border-ch-border bg-surface-raised flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-ch-text-primary">
                    {TECH_STAGE_LABELS[stage]}
                  </span>
                  <span className="px-1.5 py-0.2 text-[10px] font-bold bg-surface border border-ch-border text-ch-text-secondary">
                    {stageRecords.length}
                  </span>
                </div>
                {totalBudget > 0 && (
                  <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    ₹{totalBudget.toLocaleString('en-IN')}
                  </div>
                )}
              </div>
            </div>

            {/* Column Body: Cards List */}
            <div className="p-2 space-y-2 flex-1 overflow-y-auto max-h-[680px]">
              {stageRecords.length === 0 ? (
                <div className="py-8 text-center text-xs text-ch-text-muted">
                  No records in this stage
                </div>
              ) : (
                stageRecords.map((r) => {
                  const isFollowUpDue =
                    r.nextFollowUpDate &&
                    (r.nextFollowUpDate.startsWith(todayStr) ||
                      new Date(r.nextFollowUpDate) < now);

                  return (
                    <div
                      key={r.id}
                      onClick={() => onSelectRecord(r)}
                      className="p-2.5 bg-surface border border-ch-border hover:border-ch-accent/60 cursor-pointer space-y-2"
                    >
                      {/* Top: Category + Budget */}
                      <div className="flex items-center justify-between gap-1 text-[10px]">
                        <span
                          className={`px-1.5 py-0.5 font-semibold border ${
                            TECH_CATEGORY_COLORS[r.category] || 'bg-surface border-ch-border'
                          }`}
                        >
                          {TECH_CATEGORY_LABELS[r.category]}
                        </span>
                        {r.estimatedBudget && (
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            ₹{r.estimatedBudget.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      {/* Company & Contact */}
                      <div>
                        <h4 className="font-bold text-xs text-ch-text-primary line-clamp-1">
                          {r.company}
                        </h4>
                        <div className="text-[11px] text-ch-text-secondary flex items-center gap-1 mt-0.5">
                          <User className="w-3 h-3 text-ch-text-muted" />
                          <span className="truncate">{r.name}</span>
                        </div>
                      </div>

                      {/* Requirement Summary */}
                      <p className="text-[11px] text-ch-text-secondary line-clamp-2 leading-relaxed">
                        {r.requirementSummary}
                      </p>

                      {/* Footer: Lead + Follow-up alert */}
                      <div className="pt-1.5 border-t border-ch-border flex items-center justify-between text-[10px]">
                        <span className="font-medium text-ch-text-muted truncate max-w-[120px]">
                          {r.assignedMemberName}
                        </span>

                        {r.nextFollowUpDate && (
                          <div
                            className={`inline-flex items-center gap-1 font-semibold ${
                              isFollowUpDue
                                ? 'text-rose-600 dark:text-rose-400'
                                : 'text-ch-text-secondary'
                            }`}
                          >
                            <Clock className="w-3 h-3" />
                            <span>
                              {new Date(r.nextFollowUpDate).toLocaleDateString(
                                undefined,
                                { month: 'short', day: 'numeric' },
                              )}
                            </span>
                          </div>
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
}

