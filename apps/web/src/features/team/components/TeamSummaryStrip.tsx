import React from 'react';
import type { TeamMemberSummaryDto } from '@corviin-hub/shared';
import { MemberStatus } from '@corviin-hub/shared';

interface TeamSummaryStripProps {
  members: TeamMemberSummaryDto[];
}

export const TeamSummaryStrip: React.FC<TeamSummaryStripProps> = ({ members }) => {
  const activeMembers = members.filter((m) => m.status === MemberStatus.ACTIVE).length;
  let totalOpen = 0;
  let totalOverdue = 0;
  let totalDueWeek = 0;
  let totalCampaigns = 0;
  let totalCompleted = 0;

  members.forEach((m) => {
    totalOpen += m.workload.openTasksCount;
    totalOverdue += m.workload.overdueTasksCount;
    totalDueWeek += m.workload.tasksDueThisWeekCount;
    totalCampaigns += m.workload.activeCampaignsCount;
    totalCompleted += m.workload.completedTasksCount;
  });

  const cards = [
    {
      label: 'Workspace Team',
      value: members.length,
      desc: `${activeMembers} active member${activeMembers !== 1 ? 's' : ''}`,
      accent: 'border-l-brand-teal text-primary',
    },
    {
      label: 'Open Tasks',
      value: totalOpen,
      desc: 'Active workload backlog',
      accent: 'border-l-blue-500 text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Overdue Tasks',
      value: totalOverdue,
      desc: totalOverdue > 0 ? 'Requires redistribution' : 'All deadlines on track',
      accent: totalOverdue > 0 ? 'border-l-rose-500 text-rose-600 dark:text-rose-400' : 'border-l-emerald-500 text-emerald-600 dark:text-emerald-400',
    },
    {
      label: 'Due This Week',
      value: totalDueWeek,
      desc: 'Upcoming target deliveries',
      accent: 'border-l-amber-500 text-amber-600 dark:text-amber-400',
    },
    {
      label: 'Active Campaigns',
      value: totalCampaigns,
      desc: 'Owned by team members',
      accent: 'border-l-purple-500 text-purple-600 dark:text-purple-400',
    },
    {
      label: 'Completed Tasks',
      value: totalCompleted,
      desc: 'Historical operational delivery',
      accent: 'border-l-emerald-500 text-emerald-600 dark:text-emerald-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`bg-surface border border-border rounded-md p-3.5 border-l-4 ${card.accent} shadow-none`}
        >
          <div className="text-xs font-medium text-secondary truncate">{card.label}</div>
          <div className="text-2xl font-bold tracking-tight mt-1">{card.value}</div>
          <div className="text-[11px] text-tertiary truncate mt-0.5">{card.desc}</div>
        </div>
      ))}
    </div>
  );
};

