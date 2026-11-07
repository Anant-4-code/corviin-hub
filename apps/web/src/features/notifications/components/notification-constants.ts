import type { AuditEntityType, NotificationType } from '@corviin-hub/shared';

export interface CategoryOption {
  id: string;
  label: string;
  entityType?: AuditEntityType;
}

export const NOTIFICATION_CATEGORIES: CategoryOption[] = [
  { id: 'ALL', label: 'All Categories' },
  { id: 'TASK', label: 'Tasks', entityType: 'TASK' as AuditEntityType },
  { id: 'MEETING', label: 'Meetings & Visits', entityType: 'MEETING' as AuditEntityType },
  { id: 'CRM', label: 'CRM Leads & Follow-ups', entityType: 'CRM' as AuditEntityType },
  { id: 'CAMPAIGN', label: 'Campaigns', entityType: 'CAMPAIGN' as AuditEntityType },
  { id: 'ASSET', label: 'Assets & Storage', entityType: 'ASSET' as AuditEntityType },
  { id: 'GOAL', label: 'Plans & Goals', entityType: 'GOAL' as AuditEntityType },
  { id: 'SETTINGS', label: 'System & Workspace', entityType: 'SETTINGS' as AuditEntityType },
];

export const ACTIVITY_MODULES: { id: string; label: string; entityType?: AuditEntityType }[] = [
  { id: 'ALL', label: 'All Modules' },
  { id: 'TASK', label: 'Tasks', entityType: 'TASK' as AuditEntityType },
  { id: 'CAMPAIGN', label: 'Campaigns', entityType: 'CAMPAIGN' as AuditEntityType },
  { id: 'CRM', label: 'CRM', entityType: 'CRM' as AuditEntityType },
  { id: 'MEETING', label: 'Meetings', entityType: 'MEETING' as AuditEntityType },
  { id: 'ASSET', label: 'Assets', entityType: 'ASSET' as AuditEntityType },
  { id: 'GOAL', label: 'Plans & Goals', entityType: 'GOAL' as AuditEntityType },
  { id: 'SETTINGS', label: 'Settings', entityType: 'SETTINGS' as AuditEntityType },
  { id: 'TEAM', label: 'Team', entityType: 'TEAM' as AuditEntityType },
];

export const ACTIVITY_ACTIONS: { id: string; label: string }[] = [
  { id: 'ALL', label: 'All Actions' },
  { id: 'CREATED', label: 'Created' },
  { id: 'UPDATED', label: 'Updated' },
  { id: 'STATUS_CHANGED', label: 'Status Changed' },
  { id: 'STAGE_CHANGED', label: 'Stage Changed' },
  { id: 'ASSIGNED', label: 'Assigned' },
  { id: 'RESCHEDULED', label: 'Rescheduled' },
  { id: 'CONVERTED', label: 'Converted' },
  { id: 'COMPLETED', label: 'Completed' },
  { id: 'BLOCKED', label: 'Blocked' },
  { id: 'ASSET_UPLOADED', label: 'Asset Uploaded' },
];

export function formatRelativeTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return isoString;
  }
}

export function formatExactDateTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return `${d.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })} at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } catch {
    return isoString;
  }
}

