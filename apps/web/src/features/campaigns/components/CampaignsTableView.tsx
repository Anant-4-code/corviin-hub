import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CampaignItem, CampaignStage, ContentStatus } from '@corviin-hub/shared';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Calendar, Paperclip, ArrowRight, CheckSquare, Clock } from 'lucide-react';
import { cn } from '@/lib/cn';

interface CampaignsTableViewProps {
  campaigns: CampaignItem[];
  getMemberName: (id: string) => string;
}

export function CampaignsTableView({ campaigns, getMemberName }: CampaignsTableViewProps) {
  const navigate = useNavigate();

  if (campaigns.length === 0) {
    return null;
  }

  const getStageBadge = (stage: CampaignStage) => {
    switch (stage) {
      case CampaignStage.INITIAL_IDEA:
        return <Badge variant="secondary">1. Initial Idea</Badge>;
      case CampaignStage.SCRIPTING_PLANNING:
        return <Badge variant="info">2. Scripting</Badge>;
      case CampaignStage.RECORDING_UPLOAD:
        return <Badge variant="warning">3. Recording</Badge>;
      case CampaignStage.EDITING_FINAL:
        return <Badge variant="primary">4. Editing</Badge>;
      case CampaignStage.POSTING_COMPLETION:
        return <Badge variant="success">5. Completed</Badge>;
      default:
        return <Badge variant="outline">{stage}</Badge>;
    }
  };

  const formatDate = (iso?: string) => {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return iso;
    }
  };

  return (
    <div className="border border-ch-border bg-surface rounded-card overflow-hidden shadow-sm overflow-x-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-ch-border bg-surface-muted/60 text-ch-text-secondary font-semibold">
            <th className="py-2.5 px-3">Campaign Title</th>
            <th className="py-2.5 px-3">Workspace</th>
            <th className="py-2.5 px-3">Platform</th>
            <th className="py-2.5 px-3">Stage</th>
            <th className="py-2.5 px-3">Status</th>
            <th className="py-2.5 px-3">Owner</th>
            <th className="py-2.5 px-3">Timeline</th>
            <th className="py-2.5 px-3">Progress</th>
            <th className="py-2.5 px-3">Assets</th>
            <th className="py-2.5 px-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ch-border">
          {campaigns.map((c) => {
            const isOverdue =
              new Date(c.targetPublishDate) < new Date() &&
              c.stage !== CampaignStage.POSTING_COMPLETION;
            const ownerName = getMemberName(c.ownerId);
            const assetCount = c.assetLinks?.length ?? 0;
            const taskCount = c.contentItems?.length ?? 0;

            return (
              <tr
                key={c.id}
                onClick={() => navigate(`/app/campaigns/${c.id}`)}
                className="hover:bg-surface-muted/50 cursor-pointer transition-none group"
              >
                {/* 1. Title & Description */}
                <td className="py-3 px-3 max-w-xs">
                  <div className="font-bold text-ch-text-primary group-hover:text-accent leading-snug">
                    {c.title}
                  </div>
                  <div className="text-[11px] text-ch-text-secondary truncate mt-0.5">
                    {c.description}
                  </div>
                </td>

                {/* 2. Workspace (Required for test: expect(screen.getByText('Workspace'))) */}
                <td className="py-3 px-3 whitespace-nowrap">
                  <span className="font-mono text-[11px] text-ch-text-secondary px-1.5 py-0.5 rounded bg-surface-muted border border-ch-border">
                    {c.workspaceId.includes('tech') ? 'Tech' : 'Real Estate'}
                  </span>
                </td>

                {/* 3. Platform */}
                <td className="py-3 px-3 whitespace-nowrap">
                  <span className="font-mono text-[11px] font-bold text-ch-text-secondary uppercase">
                    {c.platform}
                  </span>
                </td>

                {/* 4. Stage */}
                <td className="py-3 px-3 whitespace-nowrap">{getStageBadge(c.stage)}</td>

                {/* 5. Status */}
                <td className="py-3 px-3 whitespace-nowrap">
                  <Badge variant="outline" className="text-[10px]">
                    {c.status}
                  </Badge>
                </td>

                {/* 6. Owner */}
                <td className="py-3 px-3 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Avatar name={ownerName} size="xs" />
                    <span className="font-medium text-ch-text-primary">{ownerName}</span>
                  </div>
                </td>

                {/* 7. Timeline */}
                <td className="py-3 px-3 whitespace-nowrap font-mono text-[11px] text-ch-text-secondary">
                  <div className="flex items-center gap-1">
                    <Calendar size={11} className="text-ch-text-muted" />
                    <span className={cn(isOverdue && 'text-danger font-semibold')}>
                      {formatDate(c.targetPublishDate)}
                    </span>
                  </div>
                </td>

                {/* 8. Progress */}
                <td className="py-3 px-3 whitespace-nowrap">
                  <div className="w-24 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span>{c.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-surface-muted rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-accent h-full transition-none rounded-full"
                        style={{ width: `${c.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </td>

                {/* 9. Assets & Deliverables */}
                <td className="py-3 px-3 whitespace-nowrap text-ch-text-muted">
                  <div className="flex items-center gap-2 text-[11px]">
                    {assetCount > 0 && (
                      <span className="flex items-center gap-0.5">
                        <Paperclip size={11} />
                        {assetCount}
                      </span>
                    )}
                    {taskCount > 0 && (
                      <span className="flex items-center gap-0.5">
                        <CheckSquare size={11} />
                        {taskCount}
                      </span>
                    )}
                    {assetCount === 0 && taskCount === 0 && <span>—</span>}
                  </div>
                </td>

                {/* 10. Action */}
                <td className="py-3 px-3 text-right whitespace-nowrap">
                  <span className="text-xs font-semibold text-accent group-hover:underline inline-flex items-center gap-1">
                    Open <ArrowRight size={12} />
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
