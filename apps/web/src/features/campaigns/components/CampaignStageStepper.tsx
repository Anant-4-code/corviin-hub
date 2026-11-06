import React from 'react';
import { CampaignStage } from '@corviin-hub/shared';
import { Check, Lightbulb, FileEdit, Video, Clapperboard, Send } from 'lucide-react';

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
    <div className="w-full bg-surface border border-ch-border p-3 overflow-x-auto">
      <div className="flex items-center justify-between min-w-[620px]">
        {STAGES.map((s, index) => {
          const isCompleted = s.number < currentNum;
          const isCurrent = s.stage === currentStage;
          const isSelected = s.stage === viewingStage;
          const Icon = s.icon;

          return (
            <React.Fragment key={s.stage}>
              {/* Stage Step Item */}
              <button
                type="button"
                onClick={() => onSelectStage && onSelectStage(s.stage)}
                className={`flex items-center gap-2.5 p-1.5 text-left transition-none rounded-none focus:outline-none ${
                  isSelected
                    ? 'ring-1 ring-primary bg-primary/[0.04]'
                    : 'hover:bg-surface-muted/50'
                }`}
              >
                {/* Step Circle / Badge */}
                <div
                  className={`w-7 h-7 flex items-center justify-center text-xs font-bold shrink-0 border ${
                    isCompleted
                      ? 'bg-success text-white border-success'
                      : isCurrent
                      ? 'bg-primary text-white border-primary'
                      : 'bg-surface text-ch-text-muted border-ch-border'
                  }`}
                >
                  {isCompleted ? <Check size={14} /> : s.number}
                </div>

                {/* Step Label */}
                <div className="flex flex-col">
                  <span
                    className={`text-[11px] font-semibold uppercase tracking-wider ${
                      isCurrent
                        ? 'text-primary'
                        : isCompleted
                        ? 'text-ch-text-primary'
                        : 'text-ch-text-muted'
                    }`}
                  >
                    Stage {s.number}
                  </span>
                  <span
                    className={`text-xs font-medium truncate max-w-[120px] ${
                      isCurrent || isSelected
                        ? 'text-ch-text-primary font-bold'
                        : 'text-ch-text-secondary'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              </button>

              {/* Connecting Divider between steps */}
              {index < STAGES.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 ${
                    s.number < currentNum ? 'bg-success' : 'bg-ch-border'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

