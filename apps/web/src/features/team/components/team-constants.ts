import { MemberStatus } from '@corviin-hub/shared';

export interface MemberStatusMeta {
  label: string;
  badgeClass: string;
  dotClass: string;
}

export const MEMBER_STATUS_CONFIG: Record<MemberStatus, MemberStatusMeta> = {
  [MemberStatus.ACTIVE]: {
    label: 'Active',
    badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    dotClass: 'bg-emerald-500',
  },
  [MemberStatus.INACTIVE]: {
    label: 'Inactive / Former',
    badgeClass: 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300 border-stone-200 dark:border-stone-700',
    dotClass: 'bg-stone-400',
  },
  [MemberStatus.ON_LEAVE]: {
    label: 'On Leave',
    badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    dotClass: 'bg-amber-500',
  },
  [MemberStatus.AWAY]: {
    label: 'Away',
    badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    dotClass: 'bg-blue-500',
  },
};

export function formatTeamDate(dateStr?: string): string {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

