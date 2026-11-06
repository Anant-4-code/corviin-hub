import React from 'react';
import { Card } from '@/components/ui/Card';
import { CampaignItem, CampaignStage, ContentStatus } from '@corviin-hub/shared';
import { Megaphone, Lightbulb, FileEdit, Clapperboard, CheckCircle2 } from 'lucide-react';

interface CampaignsSummaryStripProps {
  campaigns: CampaignItem[];
}

export function CampaignsSummaryStrip({ campaigns }: CampaignsSummaryStripProps) {
  const total = campaigns.length;
  const ideationCount = campaigns.filter((c) => c.stage === CampaignStage.INITIAL_IDEA).length;
  const scriptingCount = campaigns.filter((c) => c.stage === CampaignStage.SCRIPTING_PLANNING).length;
  const productionCount = campaigns.filter(
    (c) => c.stage === CampaignStage.RECORDING_UPLOAD || c.stage === CampaignStage.EDITING_FINAL,
  ).length;
  const completedCount = campaigns.filter(
    (c) => c.stage === CampaignStage.POSTING_COMPLETION || c.status === ContentStatus.PUBLISHED,
  ).length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      <Card className="p-3 border border-ch-border bg-surface">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-ch-text-secondary">All Campaigns</span>
          <Megaphone size={14} className="text-primary" />
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-xl font-bold text-ch-text-primary">{total}</span>
          <span className="text-[11px] text-ch-text-muted">active</span>
        </div>
      </Card>

      <Card className="p-3 border border-ch-border bg-surface">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-ch-text-secondary">1. Ideation</span>
          <Lightbulb size={14} className="text-amber-500" />
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-xl font-bold text-amber-500">{ideationCount}</span>
          <span className="text-[11px] text-ch-text-muted">concepts</span>
        </div>
      </Card>

      <Card className="p-3 border border-ch-border bg-surface">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-ch-text-secondary">2. Scripting</span>
          <FileEdit size={14} className="text-info" />
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-xl font-bold text-info">{scriptingCount}</span>
          <span className="text-[11px] text-ch-text-muted">writing</span>
        </div>
      </Card>

      <Card className="p-3 border border-ch-border bg-surface">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-ch-text-secondary">3 & 4. Production</span>
          <Clapperboard size={14} className="text-purple-500" />
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-xl font-bold text-purple-500">{productionCount}</span>
          <span className="text-[11px] text-ch-text-muted">filming/editing</span>
        </div>
      </Card>

      <Card className="p-3 border border-ch-border bg-surface col-span-2 sm:col-span-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-ch-text-secondary">5. Published</span>
          <CheckCircle2 size={14} className="text-success" />
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-xl font-bold text-success">{completedCount}</span>
          <span className="text-[11px] text-ch-text-muted">completed</span>
        </div>
      </Card>
    </div>
  );
}

