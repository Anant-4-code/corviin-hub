import { CrmInteractionItem, CrmInteractionType } from '@corviin-hub/shared';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Phone,
  MessageSquare,
  Mail,
  FileText,
  Activity,
  Calendar,
  Building,
  CheckCircle,
  Plus,
} from 'lucide-react';

interface CrmRecentInteractionsTimelineProps {
  interactions: CrmInteractionItem[];
  onOpenLogInteraction: () => void;
}

function getInteractionIcon(type: CrmInteractionType) {
  switch (type) {
    case CrmInteractionType.CALL:
      return <Phone size={14} className="text-primary" />;
    case CrmInteractionType.MESSAGE:
      return <MessageSquare size={14} className="text-emerald-500" />;
    case CrmInteractionType.EMAIL:
      return <Mail size={14} className="text-info" />;
    case CrmInteractionType.NOTE:
      return <FileText size={14} className="text-amber-500" />;
    case CrmInteractionType.STAGE_CHANGE:
      return <Activity size={14} className="text-purple-500" />;
    case CrmInteractionType.SITE_VISIT:
      return <Building size={14} className="text-warning" />;
    case CrmInteractionType.MEETING:
      return <Calendar size={14} className="text-primary" />;
    default:
      return <CheckCircle size={14} className="text-ch-text-muted" />;
  }
}

export function CrmRecentInteractionsTimeline({
  interactions,
  onOpenLogInteraction,
}: CrmRecentInteractionsTimelineProps) {
  return (
    <Card className="p-4 border border-ch-border bg-surface space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-primary" />
          <h3 className="font-bold text-sm text-ch-text-primary">Recent Interactions Timeline</h3>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onOpenLogInteraction}
          className="text-xs gap-1"
        >
          <Plus size={13} />
          <span>Log Interaction</span>
        </Button>
      </div>

      {interactions.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-ch-border rounded-card text-ch-text-muted text-xs">
          No recent CRM interactions logged.
        </div>
      ) : (
        <div className="space-y-3">
          {interactions.map((item) => (
            <div key={item.id} className="flex items-start gap-3 text-xs">
              <div className="p-1.5 rounded-full bg-surface-hover border border-ch-border shrink-0 mt-0.5">
                {getInteractionIcon(item.type)}
              </div>

              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-semibold text-ch-text-primary text-xs truncate">
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-ch-text-muted shrink-0">
                    {new Date(item.timestamp).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                {item.description && (
                  <p className="text-ch-text-secondary text-[11px] leading-relaxed">
                    {item.description}
                  </p>
                )}

                <div className="text-[10px] text-ch-text-muted">
                  <span>Logged by {item.actorName}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

