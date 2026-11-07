import React from 'react';
import { RealEstatePartnerRecord } from '@corviin-hub/shared';
import { PARTNER_STAGE_LABELS } from './partner-crm-constants';

interface PartnerRecentActivityFeedProps {
  records: RealEstatePartnerRecord[];
  onSelectPartner: (partnerId: string) => void;
}

interface ActivityEvent {
  id: string;
  partnerId: string;
  partnerName: string;
  actorName: string;
  type: string;
  description: string;
  timestamp: string;
}

export const PartnerRecentActivityFeed: React.FC<PartnerRecentActivityFeedProps> = ({
  records,
  onSelectPartner,
}) => {
  // Aggregate recent stage history entries across all partners
  const events: ActivityEvent[] = [];

  records.forEach((partner) => {
    if (partner.stageHistory && partner.stageHistory.length > 0) {
      partner.stageHistory.forEach((sh, idx) => {
        events.push({
          id: sh.id || `${partner.id}-${idx}`,
          partnerId: partner.id,
          partnerName: partner.companyName,
          actorName: sh.actorName || 'Team Member',
          type: 'Stage Transition',
          description: sh.fromStage
            ? `${PARTNER_STAGE_LABELS[sh.fromStage]} → ${PARTNER_STAGE_LABELS[sh.toStage]}`
            : `Created at ${PARTNER_STAGE_LABELS[sh.toStage]}`,
          timestamp: sh.changedAt,
        });
      });
    } else {
      events.push({
        id: `${partner.id}-created`,
        partnerId: partner.id,
        partnerName: partner.companyName,
        actorName: partner.assignedMemberName,
        type: 'Created',
        description: `Partner registered under ${PARTNER_STAGE_LABELS[partner.stage]}`,
        timestamp: partner.createdAt,
      });
    }
  });

  // Sort by timestamp desc, limit to top 10
  events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const recentEvents = events.slice(0, 8);

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="bg-surface border border-ch-border rounded-lg p-4 space-y-3">
      <div>
        <h3 className="font-bold text-xs uppercase tracking-wider text-ch-text-primary">
          Recent Partnership Activity & Audit Stream
        </h3>
        <p className="text-[11px] text-ch-text-secondary mt-0.5">
          Real-time updates across developer, builder, and channel partner pipelines.
        </p>
      </div>

      {recentEvents.length === 0 ? (
        <div className="p-4 text-center text-xs text-ch-text-tertiary border border-dashed border-ch-border rounded-md">
          No partnership activity recorded yet.
        </div>
      ) : (
        <div className="divide-y divide-ch-border">
          {recentEvents.map((evt) => (
            <div
              key={evt.id}
              onClick={() => onSelectPartner(evt.partnerId)}
              className="py-2.5 flex items-center justify-between text-xs hover:bg-ch-bg/40 px-2 rounded cursor-pointer transition-none"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                <div>
                  <p className="font-medium text-ch-text-primary">
                    <strong className="text-accent">{evt.partnerName}</strong>: {evt.description}
                  </p>
                  <p className="text-[10px] text-ch-text-tertiary mt-0.5">
                    Updated by {evt.actorName}
                  </p>
                </div>
              </div>

              <span className="text-[11px] text-ch-text-secondary flex-shrink-0 ml-2">
                {formatDate(evt.timestamp)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

