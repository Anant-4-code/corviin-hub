import React from 'react';
import { Link } from 'react-router-dom';
import type { TeamMemberSummaryDto } from '@corviin-hub/shared';
import { MEMBER_STATUS_CONFIG } from './team-constants';

interface MemberTableViewProps {
  members: TeamMemberSummaryDto[];
  actingProfileId?: string | null;
  onSelectActingProfile?: (id: string) => void;
}

export const MemberTableView: React.FC<MemberTableViewProps> = ({
  members,
  actingProfileId,
  onSelectActingProfile,
}) => {
  return (
    <div className="overflow-x-auto bg-surface border border-border rounded-md">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="border-b border-border bg-surface-muted/50 text-xs text-secondary font-medium uppercase tracking-wider">
            <th className="py-3 px-4">Member</th>
            <th className="py-3 px-3">Role / Responsibilities</th>
            <th className="py-3 px-3">Status</th>
            <th className="py-3 px-3">Workspaces</th>
            <th className="py-3 px-3 text-center">Open Tasks</th>
            <th className="py-3 px-3 text-center">Overdue</th>
            <th className="py-3 px-3 text-center">Due Week</th>
            <th className="py-3 px-3 text-center">Campaigns</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {members.map((member) => {
            const statusConfig = MEMBER_STATUS_CONFIG[member.status] || {
              label: member.status,
              badgeClass: 'bg-surface-muted text-secondary',
              dotClass: 'bg-stone-400',
            };
            const isActing = actingProfileId === member.id;

            return (
              <tr key={member.id} className="hover:bg-surface-hover/50">
                {/* 1. Member */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-teal/20 text-brand-teal font-bold flex items-center justify-center text-xs border border-brand-teal/30">
                      {member.initials || member.displayName.slice(0, 1)}
                    </div>
                    <div>
                      <Link
                        to={`/app/team/${member.id}`}
                        className="font-semibold text-primary hover:text-brand-teal block"
                      >
                        {member.displayName}
                      </Link>
                      {member.email && (
                        <div className="text-[11px] text-tertiary">{member.email}</div>
                      )}
                    </div>
                  </div>
                </td>

                {/* 2. Role */}
                <td className="py-3.5 px-3">
                  <div className="text-xs font-medium text-primary max-w-[200px] truncate" title={member.role}>
                    {member.role}
                  </div>
                </td>

                {/* 3. Status */}
                <td className="py-3.5 px-3 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${statusConfig.badgeClass}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusConfig.dotClass}`} />
                    {statusConfig.label}
                  </span>
                </td>

                {/* 4. Workspaces */}
                <td className="py-3.5 px-3">
                  <div className="flex gap-1 flex-wrap">
                    {member.workspaceIds.map((wsId) => (
                      <span
                        key={wsId}
                        className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-surface-muted text-secondary border border-border"
                      >
                        {wsId.includes('tech') ? 'Tech' : 'Real Estate'}
                      </span>
                    ))}
                  </div>
                </td>

                {/* 5. Open Tasks */}
                <td className="py-3.5 px-3 text-center whitespace-nowrap font-medium text-primary">
                  {member.workload.openTasksCount}
                </td>

                {/* 6. Overdue */}
                <td className="py-3.5 px-3 text-center whitespace-nowrap">
                  <span
                    className={`font-semibold text-xs ${
                      member.workload.overdueTasksCount > 0
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-tertiary'
                    }`}
                  >
                    {member.workload.overdueTasksCount}
                  </span>
                </td>

                {/* 7. Due Week */}
                <td className="py-3.5 px-3 text-center whitespace-nowrap font-medium text-primary">
                  {member.workload.tasksDueThisWeekCount}
                </td>

                {/* 8. Active Campaigns */}
                <td className="py-3.5 px-3 text-center whitespace-nowrap font-medium text-primary">
                  {member.workload.activeCampaignsCount}
                </td>

                {/* 9. Actions */}
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/app/team/${member.id}`}
                      className="px-2.5 py-1 text-xs font-medium bg-surface-muted text-primary rounded border border-border hover:bg-surface-hover"
                    >
                      Detail
                    </Link>
                    {onSelectActingProfile && !isActing && (
                      <button
                        type="button"
                        onClick={() => onSelectActingProfile(member.id)}
                        className="px-2.5 py-1 text-xs font-medium border border-border rounded bg-surface text-secondary hover:text-brand-teal"
                        title="Switch acting profile"
                      >
                        Act
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

