import { MeetingCategory, MeetingStatus, TaskPriority } from '@corviin-hub/shared';

export interface MeetingCategoryMeta {
  label: string;
  badgeClass: string;
  dotClass: string;
}

export const MEETING_CATEGORY_CONFIG: Record<MeetingCategory, MeetingCategoryMeta> = {
  [MeetingCategory.INTERNAL]: {
    label: 'Internal Team',
    badgeClass: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    dotClass: 'bg-indigo-500',
  },
  [MeetingCategory.CLIENT]: {
    label: 'Client Consultation',
    badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    dotClass: 'bg-blue-500',
  },
  [MeetingCategory.PARTNER]: {
    label: 'Developer / Partner',
    badgeClass: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    dotClass: 'bg-purple-500',
  },
  [MeetingCategory.BUYER]: {
    label: 'Buyer Consultation',
    badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    dotClass: 'bg-amber-500',
  },
  [MeetingCategory.SITE_VISIT]: {
    label: 'Site Visit Walkthrough',
    badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    dotClass: 'bg-emerald-500',
  },
  [MeetingCategory.ONLINE]: {
    label: 'Online Conference',
    badgeClass: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    dotClass: 'bg-cyan-500',
  },
  [MeetingCategory.OTHER]: {
    label: 'General Meeting',
    badgeClass: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border-stone-200 dark:border-stone-700',
    dotClass: 'bg-stone-400',
  },
};

export interface MeetingStatusMeta {
  label: string;
  badgeClass: string;
  dotClass: string;
}

export const MEETING_STATUS_CONFIG: Record<MeetingStatus, MeetingStatusMeta> = {
  [MeetingStatus.SCHEDULED]: {
    label: 'Scheduled',
    badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    dotClass: 'bg-blue-500',
  },
  [MeetingStatus.CONFIRMED]: {
    label: 'Confirmed',
    badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    dotClass: 'bg-emerald-500',
  },
  [MeetingStatus.COMPLETED]: {
    label: 'Completed',
    badgeClass: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border-stone-300 dark:border-stone-700',
    dotClass: 'bg-stone-500',
  },
  [MeetingStatus.RESCHEDULED]: {
    label: 'Rescheduled',
    badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    dotClass: 'bg-amber-500',
  },
  [MeetingStatus.CANCELLED]: {
    label: 'Cancelled',
    badgeClass: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    dotClass: 'bg-rose-500',
  },
  [MeetingStatus.NO_SHOW]: {
    label: 'No Show',
    badgeClass: 'bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300 border-red-300 dark:border-red-800',
    dotClass: 'bg-red-600',
  },
};

export const TEAM_MEMBERS = [
  { id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Anant', role: 'Full Stack & Tech Lead' },
  { id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901', name: 'Rohit', role: 'Partner & Real Estate Lead' },
  { id: 'c3d4e5f6-a7b8-9012-cdef-123456789012', name: 'Utkarsh', role: 'Buyer Relations & Growth' },
];

export function getMemberName(memberId?: string): string {
  if (!memberId) return 'Unassigned';
  const member = TEAM_MEMBERS.find((m) => m.id === memberId);
  return member ? member.name : 'Team Member';
}

export function formatMeetingTimeRange(startTime: string, endTime: string): string {
  try {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    return `${start.toLocaleTimeString([], timeOptions)} – ${end.toLocaleTimeString([], timeOptions)}`;
  } catch {
    return `${startTime.slice(11, 16)} - ${endTime.slice(11, 16)}`;
  }
}

export function formatMeetingDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export const PRIORITY_CONFIG: Record<TaskPriority, { label: string; badgeClass: string }> = {
  [TaskPriority.URGENT]: {
    label: 'Urgent',
    badgeClass: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  },
  [TaskPriority.HIGH]: {
    label: 'High',
    badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  },
  [TaskPriority.MEDIUM]: {
    label: 'Medium',
    badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  },
  [TaskPriority.LOW]: {
    label: 'Low',
    badgeClass: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border-stone-200 dark:border-stone-700',
  },
};

