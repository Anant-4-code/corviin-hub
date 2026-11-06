import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CampaignItem, CampaignStage, TaskPriority } from '@corviin-hub/shared';
import { Calendar, Paperclip, User, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface CampaignsBoardViewProps {
  campaigns: CampaignItem[];
  getMemberName: (id: string) => string;
}

const BOARD_COLUMNS = [
  { stage: CampaignStage.INITIAL_IDEA, title: '1. Initial Idea', badgeColor: 'secondary' },
  { stage: CampaignStage.SCRIPTING_PLANNING, title: '2. Scripting & Planning', badgeColor: 'info' },
  { stage: CampaignStage.RECORDING_UPLOAD, title: '3. Recording & Upload', badgeColor: 'warning' },
  { stage: CampaignStage.EDITING_FINAL, title: '4. Editing & Final Asset', badgeColor: 'primary' },
  { stage: CampaignStage.POSTING_COMPLETION, title: '5. Posting & Completion', badgeColor: 'success' },
];

export function CampaignsBoardView({ campaigns, getMemberName }: CampaignsBoardViewProps) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 items-start overflow-x-auto pb-4">
      {BOARD_COLUMNS.map((col) => {
        const columnCampaigns = campaigns.filter((c) => c.stage === col.stage);

        return (
          <div
            key={col.stage}
            className="bg-surface-muted/30 border border-ch-border flex flex-col min-w-[240px]"
          >
            {/* Column Header */}
            <div className="p-2.5 border-b border-ch-border bg-surface flex items-center justify-between">
              <h3 className="text-xs font-bold text-ch-text-primary tracking-wide truncate">
                {col.title}
              </h3>
              <span className="text-[11px] font-mono px-1.5 py-0.2 bg-surface-muted border border-ch-border text-ch-text-secondary">
                {columnCampaigns.length}
              </span>
            </div>

            {/* Campaign Cards in Column */}
            <div className="p-2 space-y-2 min-h-[300px]">
              {columnCampaigns.map((c) => {
                const isUrgent = c.priority === TaskPriority.URGENT;
                const isOverdue = new Date(c.targetPublishDate) < new Date() && c.stage !== CampaignStage.POSTING_COMPLETION;

                return (
                  <div
                    key={c.id}
                    onClick={() => navigate(`/app/campaigns/${c.id}`)}
                    className={`p-3 bg-surface border transition-none cursor-pointer hover:border-ch-border-hover space-y-2 text-xs group ${
                      isOverdue
                        ? 'border-danger/40'
                        : isUrgent
                        ? 'border-warning/40'
                        : 'border-ch-border'
                    }`}
                  >
                    {/* Platform & Priority Row */}
                    <div className="flex items-center justify-between gap-1 text-[10px]">
                      <span className="font-mono font-medium text-ch-text-muted uppercase">
                        {c.platform}
                      </span>
                      {isOverdue ? (
                        <span className="inline-flex items-center gap-0.5 text-danger font-semibold">
                          <AlertTriangle size={10} /> Overdue
                        </span>
                      ) : (
                        <span className="text-ch-text-muted capitalize">{c.priority?.toLowerCase()}</span>
                      )}
                    </div>

                    {/* Title */}
                    <h4 className="font-bold text-ch-text-primary group-hover:text-primary leading-snug line-clamp-2">
                      {c.title}
                    </h4>

                    {/* Short Description */}
                    <p className="text-[11px] text-ch-text-secondary line-clamp-2 leading-relaxed">
                      {c.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="w-full bg-surface-muted h-1 border border-ch-border">
                        <div
                          className="bg-primary h-full transition-none"
                          style={{ width: `${Math.min(100, Math.max(0, c.progressPercent))}%` }}
                        />
                      </div>
                    </div>

                    {/* Footer: Owner, Target Date, Assets */}
                    <div className="flex items-center justify-between text-[10px] text-ch-text-muted pt-1 border-t border-ch-border">
                      <div className="flex items-center gap-1 font-medium truncate max-w-[90px]">
                        <User size={11} className="shrink-0" />
                        <span className="truncate">{getMemberName(c.ownerId)}</span>
                      </div>

                      <div className="flex items-center gap-2 font-mono">
                        <span className="flex items-center gap-0.5">
                          <Paperclip size={10} />
                          {c.assetLinks ? c.assetLinks.length : 0}
                        </span>
                        <span>{new Date(c.targetPublishDate).toLocaleDateString([], { month: 'numeric', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {columnCampaigns.length === 0 && (
                <div className="text-center py-8 text-ch-text-muted text-[11px]">
                  No campaigns
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

