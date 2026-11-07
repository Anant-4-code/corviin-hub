import React, { useState } from 'react';
import { RealEstatePartnerRecord } from '@corviin-hub/shared';
import { Button } from '@/components/ui/Button';

interface PartnerFollowUpsOverviewProps {
  records: RealEstatePartnerRecord[];
  onSelectPartner: (partnerId: string) => void;
  onOpenCreateTask?: (partner: RealEstatePartnerRecord) => void;
}

type FollowUpGroup = 'overdue' | 'today' | 'upcoming' | 'all';

export const PartnerFollowUpsOverview: React.FC<PartnerFollowUpsOverviewProps> = ({
  records,
  onSelectPartner,
  onOpenCreateTask,
}) => {
  const [activeGroup, setActiveGroup] = useState<FollowUpGroup>('all');
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const partnersWithFollowUps = records.filter((r) => Boolean(r.nextFollowUpDate));

  const categorized = partnersWithFollowUps.filter((p) => {
    if (!p.nextFollowUpDate) return false;
    const dateOnly = p.nextFollowUpDate.split('T')[0];
    const followUpTime = new Date(p.nextFollowUpDate).getTime();
    const nowTime = now.getTime();

    if (activeGroup === 'overdue') {
      return followUpTime < nowTime && dateOnly !== todayStr;
    }
    if (activeGroup === 'today') {
      return dateOnly === todayStr;
    }
    if (activeGroup === 'upcoming') {
      return followUpTime > nowTime && dateOnly !== todayStr;
    }
    return true;
  });

  const overdueCount = partnersWithFollowUps.filter((p) => {
    const fTime = new Date(p.nextFollowUpDate!).getTime();
    const dateOnly = p.nextFollowUpDate!.split('T')[0];
    return fTime < now.getTime() && dateOnly !== todayStr;
  }).length;

  const todayCount = partnersWithFollowUps.filter((p) => {
    return p.nextFollowUpDate!.split('T')[0] === todayStr;
  }).length;

  return (
    <div className="bg-surface border border-ch-border rounded-lg p-4 space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-ch-text-primary">
            Partner Follow-up Operations
          </h3>
          <p className="text-[11px] text-ch-text-secondary mt-0.5">
            Active relationship reminders and pending promoter check-ins.
          </p>
        </div>

        {/* Group Tabs */}
        <div className="flex rounded-md border border-ch-border bg-ch-bg p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setActiveGroup('all')}
            className={`px-2.5 py-1 rounded transition-none ${
              activeGroup === 'all'
                ? 'bg-surface text-ch-text-primary font-bold shadow-sm'
                : 'text-ch-text-secondary hover:text-ch-text-primary'
            }`}
          >
            All ({partnersWithFollowUps.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveGroup('overdue')}
            className={`px-2.5 py-1 rounded transition-none ${
              activeGroup === 'overdue'
                ? 'bg-surface text-rose-600 dark:text-rose-400 font-bold shadow-sm'
                : 'text-ch-text-secondary hover:text-ch-text-primary'
            }`}
          >
            Overdue ({overdueCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveGroup('today')}
            className={`px-2.5 py-1 rounded transition-none ${
              activeGroup === 'today'
                ? 'bg-surface text-amber-600 dark:text-amber-400 font-bold shadow-sm'
                : 'text-ch-text-secondary hover:text-ch-text-primary'
            }`}
          >
            Today ({todayCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveGroup('upcoming')}
            className={`px-2.5 py-1 rounded transition-none ${
              activeGroup === 'upcoming'
                ? 'bg-surface text-ch-text-primary font-bold shadow-sm'
                : 'text-ch-text-secondary hover:text-ch-text-primary'
            }`}
          >
            Upcoming
          </button>
        </div>
      </div>

      {/* Follow-up Cards List */}
      {categorized.length === 0 ? (
        <div className="p-4 text-center text-xs text-ch-text-tertiary border border-dashed border-ch-border rounded-md">
          No follow-ups in this queue.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {categorized.map((partner) => {
            const isOverdue = new Date(partner.nextFollowUpDate!).getTime() < now.getTime();
            return (
              <div
                key={partner.id}
                className="bg-ch-bg border border-ch-border rounded-lg p-3 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="font-bold text-xs text-ch-text-primary truncate">
                      {partner.companyName}
                    </h4>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isOverdue
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                          : 'bg-surface text-ch-text-secondary border border-ch-border'
                      }`}
                    >
                      {new Date(partner.nextFollowUpDate!).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>

                  {partner.nextFollowUpTitle && (
                    <p className="text-xs text-ch-text-secondary mt-1 line-clamp-2">
                      {partner.nextFollowUpTitle}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-ch-border flex items-center justify-between text-[11px]">
                  <span className="text-ch-text-tertiary">
                    👤 {partner.assignedMemberName}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSelectPartner(partner.id)}
                    className="text-xs h-6 px-2"
                  >
                    Open Record
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

