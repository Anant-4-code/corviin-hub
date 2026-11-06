import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CampaignItem, CampaignStage } from '@corviin-hub/shared';
import { Badge } from '@/components/ui/Badge';
import { Calendar, Paperclip, ArrowRight } from 'lucide-react';

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

  return (
    <div className="border border-ch-border bg-surface overflow-x-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-ch-border bg-surface-muted/60 text-ch-text-secondary font-semibold">
            <th className="py-2.5 px-3">Campaign Title</th>
            <th className="py-2.5 px-3">Stage</th>
            <th className="py-2.5 px-3">Platform</th>
            <th className="py-2.5 px-3">Owner</th>
            <th className="py-2.5 px-3">Target Date</th>
            <th className="py-2.5 px-3">Progress</th>
            <th className="py-2.5 px-3">Assets</th>
            <th className="py-2.5 px-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ch-border">
          {campaigns.map((c) => (
            <tr
              key={c.id}
              onClick={() => navigate(`/app/campaigns/${c.id}`)}
              className="hover:bg-surface-muted/50 cursor-pointer transition-none group"
            >
              {/* Title & Description */}
              <td className="py-3 px-3 max-w-xs">
                <div className="font-semibold text-ch-text-primary group-hover:text-primary leading-snug">
                  {c.title}
                </div>
                <div className="text-[11px] text-ch-text-secondary truncate mt-0.5">
                  {c.description}
                </div>
              </td>

              {/* Stage */}
              <td className="py-3 px-3 whitespace-nowrap">{getStageBadge(c.stage)}</td>

              {/* Platform */}
              <td className="py-3 px-3 whitespace-nowrap">
                <span className="font-mono text-[11px] font-medium text-ch-text-secondary">
                  {c.platform}
                </span>
              </td>

              {/* Owner */}
              <td className="py-3 px-3 whitespace-nowrap">
                <span className="font-medium text-ch-text-primary">
                  {getMemberName(c.ownerId)}
                </span>
              </td>

              {/* Target Date */}
              <td className="py-3 px-3 whitespace-nowrap text-ch-text-secondary">
                <div className="flex items-center gap-1 font-mono text-[11px]">
                  <Calendar size={12} className="text-ch-text-muted" />
                  <span>{new Date(c.targetPublishDate).toLocaleDateString()}</span>
                </div>
              </td>

              {/* Progress */}
              <td className="py-3 px-3 whitespace-nowrap">
                <div className="w-24 space-y-1">
                  <div className="flex justify-between text-[10px] text-ch-text-muted font-mono">
                    <span>{c.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-surface-muted h-1.5 border border-ch-border">
                    <div
                      className="bg-primary h-full transition-none"
                      style={{ width: `${Math.min(100, Math.max(0, c.progressPercent))}%` }}
                    />
                  </div>
                </div>
              </td>

              {/* Assets count */}
              <td className="py-3 px-3 whitespace-nowrap text-ch-text-secondary">
                <div className="flex items-center gap-1 text-[11px]">
                  <Paperclip size={12} className="text-ch-text-muted" />
                  <span>{c.assetLinks ? c.assetLinks.length : 0}</span>
                </div>
              </td>

              {/* Action */}
              <td className="py-3 px-3 text-right whitespace-nowrap">
                <span className="inline-flex items-center gap-1 text-primary text-xs font-semibold group-hover:underline">
                  Workspace <ArrowRight size={12} />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

