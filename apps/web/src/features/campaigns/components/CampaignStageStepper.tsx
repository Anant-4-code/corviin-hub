import React from 'react';
import { CampaignStage } from '@corviin-hub/shared';
import { Check, Lightbulb, FileEdit, Video, Clapperboard, Send } from 'lucide-react';
import { cn } from '@/lib/cn';

interface CampaignStageStepperProps {
  currentStage: CampaignStage;
  activeViewStage?: CampaignStage;
  onSelectStage?: (stage: CampaignStage) => void;
}

const STAGES = [
  {
    stage: CampaignStage.INITIAL_IDEA,
    number: 1,
    label: 'Initial Idea',
    shortLabel: 'Ideation',
    icon: Lightbulb,
  },
  {
    stage: CampaignStage.SCRIPTING_PLANNING,
    number: 2,
    label: 'Scripting & Planning',
    shortLabel: 'Scripting',
    icon: FileEdit,
  },
  {
    stage: CampaignStage.RECORDING_UPLOAD,
    number: 3,
    label: 'Recording & Asset Upload',
    shortLabel: 'Recording',
    icon: Video,
  },
  {
    stage: CampaignStage.EDITING_FINAL,
    number: 4,
    label: 'Editing & Final Asset',
    shortLabel: 'Editing',
    icon: Clapperboard,
  },
  {
    stage: CampaignStage.POSTING_COMPLETION,
    number: 5,
    label: 'Posting & Completion',
    shortLabel: 'Posting',
    icon: Send,
  },
];

const STAGE_ORDER: Record<CampaignStage, number> = {
  [CampaignStage.INITIAL_IDEA]: 1,
  [CampaignStage.SCRIPTING_PLANNING]: 2,
  [CampaignStage.RECORDING_UPLOAD]: 3,
  [CampaignStage.EDITING_FINAL]: 4,
  [CampaignStage.POSTING_COMPLETION]: 5,
};

export function CampaignStageStepper({
  currentStage,
  activeViewStage,
  onSelectStage,
}: CampaignStageStepperProps) {
  const currentNum = STAGE_ORDER[currentStage] || 1;
  const viewingStage = activeViewStage || currentStage;

  return (
    <div className="w-full bg-surface border border-ch-border rounded-lg p-3 sm:p-4 shadow-xs">
      <div className="flex items-center justify-between mb-2.5 px-0.5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-ch-text-secondary flex items-center gap-1.5">
          <span>Campaign Stage Lifecycle</span>
          <span className="text-[10px] font-normal text-ch-text-muted lowercase">
            (click any stage to view workspace)
          </span>
        </h2>
        <span className="text-xs font-semibold text-accent">
          Stage {currentNum} of 5 Active
        </span>
      </div>

      {/* Responsive Stages: 5-column grid on desktop, scrollable track on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 sm:gap-2.5">
        {STAGES.map((s) => {
          const isCompleted = s.number < currentNum;
          const isCurrent = s.stage === currentStage;
          const isSelected = s.stage === viewingStage;
          const Icon = s.icon;

          return (
            <button
              key={s.stage}
              type="button"
              onClick={() => onSelectStage && onSelectStage(s.stage)}
              className={cn(
                'relative flex flex-col justify-between p-3 rounded-control text-left transition-none border cursor-pointer min-h-[82px] select-none',
                isSelected
                  ? 'border-accent bg-accent/5 ring-1 ring-accent shadow-xs'
                  : 'border-ch-border bg-surface hover:bg-surface-muted/60 hover:border-ch-border-strong',
              )}
            >
              {/* Top row: Stage number badge + Status pill */}
              <div className="flex items-center justify-between gap-2 mb-2 w-full">
                <div
                  className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border transition-none',
                    isCompleted
                      ? 'bg-success text-white border-success'
                      : isCurrent
                      ? 'bg-accent text-accent-foreground border-accent'
                      : 'bg-surface-muted text-ch-text-muted border-ch-border',
                  )}
                >
                  {isCompleted ? <Check size={13} className="stroke-[2.5]" /> : s.number}
                </div>

                {isCurrent ? (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-accent/15 text-accent border border-accent/30 leading-tight">
                    Current
                  </span>
                ) : isCompleted ? (
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-success/15 text-success leading-tight">
                    Done ✓
                  </span>
                ) : (
                  <span className="text-[10px] text-ch-text-muted font-medium">
                    Upcoming
                  </span>
                )}
              </div>

              {/* Middle row: Stage Number & Full Label */}
              <div className="flex flex-col flex-1 justify-center">
                <span
                  className={cn(
                    'text-[10px] font-semibold uppercase tracking-wider',
                    isCurrent
                      ? 'text-accent font-bold'
                      : isCompleted
                      ? 'text-ch-text-primary'
                      : 'text-ch-text-muted',
                  )}
                >
                  Stage {s.number}
                </span>
                <span
                  className={cn(
                    'text-xs font-semibold leading-snug mt-0.5 line-clamp-2',
                    isSelected || isCurrent
                      ? 'text-ch-text-primary font-bold'
                      : 'text-ch-text-secondary',
                  )}
                >
                  {s.label}
                </span>
              </div>

              {/* Bottom indicator strip */}
              <div className="mt-2.5 pt-1.5 border-t border-ch-border/60 flex items-center justify-between text-[10px]">
                <span
                  className={cn(
                    'flex items-center gap-1 font-medium',
                    isSelected ? 'text-accent' : 'text-ch-text-muted',
                  )}
                >
                  <Icon size={11} />
                  <span>{isSelected ? 'Viewing' : 'Inspect'}</span>
                </span>
                <span className="font-mono text-ch-text-muted">
                  {s.number < currentNum ? '100%' : s.stage === currentStage ? 'In Progress' : '0%'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
