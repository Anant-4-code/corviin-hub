import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CampaignItem, CampaignStage, TaskPriority } from '@corviin-hub/shared';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import {
  Calendar,
  Paperclip,
  CheckSquare,
  AlertTriangle,
  ArrowRight,
  Send,
  Video,
  FileEdit,
  Lightbulb,
  Clapperboard,
} from 'lucide-react';
import { cn } from '@/lib/cn';

interface CampaignCardProps {
  campaign: CampaignItem;
  getMemberName: (id: string) => string;
}

const STAGE_CONFIG: Record<
  CampaignStage,
  { label: string; number: number; color: string; icon: React.ElementType }
> = {
  [CampaignStage.INITIAL_IDEA]: {
    label: 'Initial Idea',
    number: 1,
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    icon: Lightbulb,
  },
  [CampaignStage.SCRIPTING_PLANNING]: {
    label: 'Scripting & Planning',
    number: 2,
    color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    icon: FileEdit,
  },
  [CampaignStage.RECORDING_UPLOAD]: {
    label: 'Recording & Upload',
    number: 3,
    color: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    icon: Video,
  },
  [CampaignStage.EDITING_FINAL]: {
    label: 'Editing & Final Asset',
    number: 4,
    color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    icon: Clapperboard,
  },
  [CampaignStage.POSTING_COMPLETION]: {
    label: 'Posting & Completed',
    number: 5,
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    icon: Send,
  },
};

export function CampaignCard({ campaign, getMemberName }: CampaignCardProps) {
  const navigate = useNavigate();

  const isUrgent = campaign.priority === TaskPriority.URGENT;
  const isOverdue =
    new Date(campaign.targetPublishDate) < new Date() &&
    campaign.stage !== CampaignStage.POSTING_COMPLETION;

  const stageInfo = STAGE_CONFIG[campaign.stage] || STAGE_CONFIG[CampaignStage.INITIAL_IDEA];
  const StageIcon = stageInfo.icon;

  const assetCount = campaign.assetLinks?.length ?? 0;
  const contentCount = campaign.contentItems?.length ?? 0;
  const ownerName = getMemberName(campaign.ownerId);

  // Dates formatting
  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return iso;
    }
  };

  const startDateFormatted = formatDate(campaign.startDate);
  const targetDateFormatted = formatDate(campaign.targetPublishDate);

  return (
    <div
      onClick={() => navigate(`/app/campaigns/${campaign.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(`/app/campaigns/${campaign.id}`);
        }
      }}
      className={cn(
        'p-4 bg-surface border rounded-card transition-none cursor-pointer select-none space-y-3.5 group flex flex-col justify-between',
        isOverdue
          ? 'border-danger/40 hover:border-danger'
          : isUrgent
          ? 'border-warning/40 hover:border-warning'
          : 'border-ch-border hover:border-ch-border-strong',
      )}
    >
      {/* Top Line: Platform, Priority, Overdue Tag */}
      <div>
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-ch-border">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-surface-muted text-ch-text-secondary border border-ch-border uppercase">
              {campaign.platform}
            </span>

            <span className="text-[11px] font-medium text-ch-text-muted capitalize">
              {campaign.priority?.toLowerCase()} priority
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {isOverdue && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-danger/15 text-danger border border-danger/30">
                <AlertTriangle size={10} /> Overdue
              </span>
            )}
            <Badge variant="outline" className="text-[10px]">
              {campaign.status}
            </Badge>
          </div>
        </div>

        {/* Title & Description */}
        <div className="mt-2.5 space-y-1">
          <h3 className="text-sm font-bold text-ch-text-primary group-hover:text-accent leading-snug line-clamp-2">
            {campaign.title}
          </h3>
          <p className="text-xs text-ch-text-secondary line-clamp-2 leading-relaxed">
            {campaign.description}
          </p>
        </div>
      </div>

      {/* Stage Progress Indicator */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                'inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-semibold',
                stageInfo.color,
              )}
            >
              <StageIcon size={12} />
              <span>
                Stage {stageInfo.number}: {stageInfo.label}
              </span>
            </span>
          </div>

          <span className="font-mono font-bold text-xs text-ch-text-primary">
            {campaign.progressPercent}%
          </span>
        </div>

        {/* Linear Stage Segmented Bar */}
        <div className="w-full bg-surface-muted rounded-full h-1.5 overflow-hidden flex gap-0.5">
          {[1, 2, 3, 4, 5].map((stg) => (
            <div
              key={stg}
              className={cn(
                'h-full flex-1 transition-none',
                stg <= stageInfo.number
                  ? 'bg-accent'
                  : 'bg-ch-border/50',
              )}
            />
          ))}
        </div>
      </div>

      {/* Dates & Deliverables Metadata */}
      <div className="space-y-2 pt-2 border-t border-ch-border text-xs">
        {/* Timeline Dates */}
        <div className="flex items-center justify-between text-ch-text-secondary text-[11px] font-mono">
          <span className="flex items-center gap-1">
            <Calendar size={11} className="text-ch-text-muted" />
            {startDateFormatted}
          </span>
          <span className="text-ch-text-muted">➔</span>
          <span className={cn('font-semibold', isOverdue ? 'text-danger' : 'text-ch-text-primary')}>
            {targetDateFormatted}
          </span>
        </div>

        {/* Footer: Owner & Linked Assets / Content Counts */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <Avatar name={ownerName} size="xs" />
            <span className="text-xs font-medium text-ch-text-secondary truncate max-w-[110px]">
              {ownerName}
            </span>
          </div>

          <div className="flex items-center gap-3 text-ch-text-muted text-[11px]">
            {assetCount > 0 && (
              <span className="flex items-center gap-1" title={`${assetCount} linked assets`}>
                <Paperclip size={12} />
                <span>{assetCount}</span>
              </span>
            )}
            {contentCount > 0 && (
              <span className="flex items-center gap-1" title={`${contentCount} scheduled content items`}>
                <CheckSquare size={12} />
                <span>{contentCount}</span>
              </span>
            )}
            <ArrowRight size={13} className="text-ch-text-muted group-hover:text-accent group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
}

