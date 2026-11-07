import React from 'react';
import { RealEstatePartnerRecord } from '@corviin-hub/shared';
import { Button } from '@/components/ui/Button';

interface PartnerUpcomingMeetingsProps {
  records: RealEstatePartnerRecord[];
  onSelectPartner: (partnerId: string) => void;
  onOpenScheduleMeeting?: (partner: RealEstatePartnerRecord) => void;
}

export const PartnerUpcomingMeetings: React.FC<PartnerUpcomingMeetingsProps> = ({
  records,
  onSelectPartner,
  onOpenScheduleMeeting,
}) => {
  // Filter partners that have meetings or are in meeting stage
  const partnersWithMeetings = records.filter(
    (r) => (r.linkedMeetingIds && r.linkedMeetingIds.length > 0) || r.stage === 'MEETING_PLANNED',
  );

  return (
    <div className="bg-surface border border-ch-border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-ch-text-primary">
            Upcoming Partner Meetings & Discussions
          </h3>
          <p className="text-[11px] text-ch-text-secondary mt-0.5">
            Synchronized with Meetings & Visits Calendar and team schedules.
          </p>
        </div>
      </div>

      {partnersWithMeetings.length === 0 ? (
        <div className="p-4 text-center text-xs text-ch-text-tertiary border border-dashed border-ch-border rounded-md">
          No upcoming partner meetings scheduled. Use "Details" or "Meet" on a partner to schedule.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {partnersWithMeetings.map((partner) => (
            <div
              key={partner.id}
              className="bg-ch-bg border border-ch-border rounded-lg p-3 space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-1">
                  <h4 className="font-bold text-xs text-ch-text-primary truncate">
                    {partner.companyName}
                  </h4>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300">
                    Meeting
                  </span>
                </div>

                <p className="text-xs text-ch-text-secondary mt-1">
                  Contact: <strong className="text-ch-text-primary">{partner.contactPerson || 'Key Promoter'}</strong>
                </p>

                {partner.projects && partner.projects.length > 0 && (
                  <p className="text-[11px] text-ch-text-tertiary mt-0.5 truncate">
                    Project: {partner.projects[0].name}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-ch-border flex items-center justify-between text-[11px]">
                <span className="text-ch-text-secondary">Host: {partner.assignedMemberName}</span>
                <div className="flex items-center gap-1">
                  {onOpenScheduleMeeting && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onOpenScheduleMeeting(partner)}
                      className="text-xs h-6 px-1.5"
                    >
                      + Meet
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSelectPartner(partner.id)}
                    className="text-xs h-6 px-2"
                  >
                    Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

