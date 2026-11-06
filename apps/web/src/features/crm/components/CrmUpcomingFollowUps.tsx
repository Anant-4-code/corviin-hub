import { CrmFollowUpItem, CrmFollowUpStatus, CrmType } from '@corviin-hub/shared';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Clock,
  CheckCircle2,
  Phone,
  MessageSquare,
  AlertCircle,
  Plus,
} from 'lucide-react';

interface CrmUpcomingFollowUpsProps {
  followUps: CrmFollowUpItem[];
  onCompleteFollowUp: (followUp: CrmFollowUpItem) => void;
  onOpenSchedule: () => void;
}

export function CrmUpcomingFollowUps({
  followUps,
  onCompleteFollowUp,
  onOpenSchedule,
}: CrmUpcomingFollowUpsProps) {
  const getRecordBadge = (type: CrmType) => {
    switch (type) {
      case CrmType.TECH_LEAD:
        return <Badge variant="primary" size="sm" className="text-[9px]">TECH</Badge>;
      case CrmType.TECH_CLIENT:
        return <Badge variant="success" size="sm" className="text-[9px]">CLIENT</Badge>;
      case CrmType.TECH_PARTNER:
        return <Badge variant="info" size="sm" className="text-[9px]">PARTNER</Badge>;
      case CrmType.RE_PARTNER:
        return <Badge variant="primary" size="sm" className="text-[9px]">RE PARTNER</Badge>;
      case CrmType.RE_BUYER:
        return <Badge variant="info" size="sm" className="text-[9px]">RE BUYER</Badge>;
    }
  };

  return (
    <Card className="p-4 border border-ch-border bg-surface space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-primary" />
          <h3 className="font-bold text-sm text-ch-text-primary">Upcoming Follow-ups Queue</h3>
          <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-primary/10 text-primary border border-primary/20">
            {followUps.length}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onOpenSchedule}
          className="text-xs gap-1"
        >
          <Plus size={13} />
          <span>New Follow-up</span>
        </Button>
      </div>

      {followUps.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-ch-border rounded-card text-ch-text-muted text-xs">
          No pending follow-ups scheduled. All CRM relationships are up to date.
        </div>
      ) : (
        <div className="space-y-2">
          {followUps.map((fup) => {
            const dueDate = new Date(fup.dueDate);
            const isOverdue = dueDate < new Date() && fup.status === CrmFollowUpStatus.PENDING;

            return (
              <div
                key={fup.id}
                className={`p-3 rounded-card border ${
                  isOverdue
                    ? 'border-danger/40 bg-danger/5'
                    : 'border-ch-border bg-surface-hover/30'
                } flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {getRecordBadge(fup.recordType)}
                    <span className="font-semibold text-ch-text-primary truncate">
                      {fup.recordTitle}
                    </span>
                    {isOverdue && (
                      <Badge variant="danger" size="sm" className="text-[9px] gap-1">
                        <AlertCircle size={10} />
                        <span>OVERDUE</span>
                      </Badge>
                    )}
                  </div>

                  <p className="text-ch-text-secondary font-medium line-clamp-1">
                    {fup.title}
                  </p>

                  <div className="flex items-center gap-3 text-[10px] text-ch-text-muted">
                    <span>Assigned: {fup.assignedMemberName}</span>
                    <span>•</span>
                    <span className={isOverdue ? 'text-danger font-semibold' : ''}>
                      Due: {dueDate.toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {/* Quick Action Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCompleteFollowUp(fup)}
                  className="shrink-0 gap-1.5 text-xs text-success hover:bg-success/10 hover:border-success/30 self-end sm:self-center"
                >
                  <CheckCircle2 size={13} />
                  <span>Mark Complete</span>
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

