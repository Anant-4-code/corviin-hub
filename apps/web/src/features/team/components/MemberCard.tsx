import React from 'react';
import { Link } from 'react-router-dom';
import type { TeamMemberSummaryDto } from '@corviin-hub/shared';
import { MEMBER_STATUS_CONFIG } from './team-constants';

interface MemberCardProps {
  member: TeamMemberSummaryDto;
  isActingProfile?: boolean;
  onSelectActingProfile?: (id: string) => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({
  member,
  isActingProfile = false,
  onSelectActingProfile,
}) => {
  const statusConfig = MEMBER_STATUS_CONFIG[member.status] || {
    label: member.status,
    badgeClass: 'bg-surface-muted text-secondary',
    dotClass: 'bg-stone-400',
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-5 shadow-none flex flex-col justify-between hover:border-brand-teal/40 transition-none">
      <div>
        {/* Header: Avatar, Status & Acting Profile Indicator */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-brand-teal/20 text-brand-teal flex items-center justify-center font-bold text-base border border-brand-teal/30 flex-shrink-0">
              {member.initials || member.displayName.slice(0, 1)}
            </div>
            <div>
              <Link
                to={`/app/team/${member.id}`}
                className="text-base font-bold text-primary hover:text-brand-teal leading-snug line-clamp-1"
                title={member.displayName}
              >
                {member.displayName}
              </Link>
              <div className="text-xs text-secondary font-medium mt-0.5 line-clamp-1" title={member.role}>
                {member.role}
              </div>
            </div>
          </div>

          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${statusConfig.badgeClass}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusConfig.dotClass}`} />
            {statusConfig.label}
          </span>
        </div>

        {/* Acting Profile Pill */}
        {isActingProfile && (
          <div className="mb-3 px-2.5 py-1 rounded bg-brand-teal/10 border border-brand-teal/30 text-[11px] font-semibold text-brand-teal flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-teal" />
            Current Acting Profile (Prototype Device State)
          </div>
        )}

        {/* Bio / Summary if available */}
        {member.bio && (
          <p className="text-xs text-secondary mb-3.5 line-clamp-2 leading-relaxed">
            {member.bio}
          </p>
        )}

        {/* Operational Workload Metrics (Section 3 & 5) */}
        <div className="grid grid-cols-3 gap-2 p-2.5 rounded-md bg-surface-muted border border-border text-center mb-3">
          <div>
            <span className="text-[10px] text-tertiary uppercase font-semibold block">Open Tasks</span>
            <span className="text-base font-bold text-primary">{member.workload.openTasksCount}</span>
          </div>
          <div>
            <span className="text-[10px] text-tertiary uppercase font-semibold block">Overdue</span>
            <span
              className={`text-base font-bold ${
                member.workload.overdueTasksCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-primary'
              }`}
            >
              {member.workload.overdueTasksCount}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-tertiary uppercase font-semibold block">Deadlines</span>
            <span className="text-base font-bold text-primary">{member.workload.tasksDueThisWeekCount}</span>
          </div>
        </div>

        {/* Workspace Memberships */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs mb-3">
          <span className="text-[11px] text-tertiary">Workspaces:</span>
          {member.workspaceIds.map((wsId) => (
            <span
              key={wsId}
              className="px-2 py-0.5 rounded text-[10px] font-medium bg-surface-muted text-secondary border border-border"
            >
              {wsId.includes('tech') ? 'Corviin Tech' : 'Real Estate'}
            </span>
          ))}
        </div>
      </div>

      {/* Action Footer: ~44px touch targets on mobile */}
      <div className="pt-3 border-t border-border flex items-center gap-2">
        <Link
          to={`/app/team/${member.id}`}
          className="flex-1 min-h-[44px] flex items-center justify-center px-3 py-2 text-xs font-semibold rounded bg-surface-muted text-primary border border-border hover:bg-surface-hover text-center"
        >
          View Profile & Workload
        </Link>

        {onSelectActingProfile && !isActingProfile && (
          <button
            type="button"
            onClick={() => onSelectActingProfile(member.id)}
            title="Switch acting profile for UI testing (not authentication)"
            className="min-h-[44px] px-3 py-2 text-xs font-semibold rounded border border-border bg-surface text-secondary hover:text-brand-teal hover:border-brand-teal whitespace-nowrap"
          >
            Act as {member.displayName.split(' ')[0]}
          </button>
        )}
      </div>
    </div>
  );
};

