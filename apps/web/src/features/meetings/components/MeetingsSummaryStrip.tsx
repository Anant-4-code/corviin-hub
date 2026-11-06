import React from 'react';
import type { MeetingItem } from '@corviin-hub/shared';
import { MeetingStatus } from '@corviin-hub/shared';

interface MeetingsSummaryStripProps {
  meetings: MeetingItem[];
}

export const MeetingsSummaryStrip: React.FC<MeetingsSummaryStripProps> = ({ meetings }) => {
  const totalMeetings = meetings.length;
  const scheduledCount = meetings.filter(
    (m) => m.status === MeetingStatus.SCHEDULED || m.status === MeetingStatus.CONFIRMED,
  ).length;
  const completedCount = meetings.filter((m) => m.status === MeetingStatus.COMPLETED).length;
  const rescheduledCancelledCount = meetings.filter(
    (m) =>
      m.status === MeetingStatus.RESCHEDULED ||
      m.status === MeetingStatus.CANCELLED ||
      m.status === MeetingStatus.NO_SHOW,
  ).length;

  let pendingActionItems = 0;
  let convertedActionItems = 0;

  meetings.forEach((m) => {
    if (m.actionItems) {
      m.actionItems.forEach((ai) => {
        if (ai.status === 'CONVERTED') {
          convertedActionItems++;
        } else {
          pendingActionItems++;
        }
      });
    }
  });

  const cards = [
    {
      label: 'Total Meetings',
      value: totalMeetings,
      accent: 'border-l-brand-teal text-primary',
      desc: 'All logged workspace sessions',
    },
    {
      label: 'Scheduled / Confirmed',
      value: scheduledCount,
      accent: 'border-l-blue-500 text-blue-600 dark:text-blue-400',
      desc: 'Upcoming pipeline sessions',
    },
    {
      label: 'Completed',
      value: completedCount,
      accent: 'border-l-emerald-500 text-emerald-600 dark:text-emerald-400',
      desc: 'Conducted meetings with minutes',
    },
    {
      label: 'Rescheduled / Off-track',
      value: rescheduledCancelledCount,
      accent: 'border-l-amber-500 text-amber-600 dark:text-amber-400',
      desc: 'Shifted, cancelled, or no-show',
    },
    {
      label: 'Action Items Pending',
      value: pendingActionItems,
      accent: 'border-l-rose-500 text-rose-600 dark:text-rose-400',
      desc: 'Awaiting task conversion',
    },
    {
      label: 'Tasks Converted',
      value: convertedActionItems,
      accent: 'border-l-purple-500 text-purple-600 dark:text-purple-400',
      desc: 'Tracked in shared task engine',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
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

