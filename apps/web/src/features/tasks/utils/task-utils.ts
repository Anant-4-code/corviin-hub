import type { TaskItem, TaskPriority, TaskStatus } from '@corviin-hub/shared';

export function formatDateTime(isoString?: string | null): string {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
}

export function formatDate(isoString?: string | null): string {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
}

export function formatDuration(seconds?: number): string {
  if (!seconds || seconds <= 0) return '0m';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hrs > 0) {
    return `${hrs}h ${mins}m`;
  }
  return `${mins}m`;
}

export function isTaskOverdue(task: TaskItem): boolean {
  if (task.status === 'COMPLETED' || task.status === 'CANCELLED') return false;
  try {
    const deadline = new Date(task.deadline).getTime();
    return deadline < Date.now();
  } catch {
    return false;
  }
}

export function getTaskDateBucket(task: TaskItem): 'Overdue' | 'Today' | 'Tomorrow' | 'Upcoming' | 'No Deadline' {
  if (!task.deadline) return 'No Deadline';
  const now = new Date();
  const d = new Date(task.deadline);
  if (isNaN(d.getTime())) return 'No Deadline';

  // Compare dates normalized to midnight
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const taskMidnight = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round((taskMidnight - todayMidnight) / (24 * 3600 * 1000));

  if (diffDays < 0 && task.status !== 'COMPLETED' && task.status !== 'CANCELLED') {
    return 'Overdue';
  }
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  return 'Upcoming';
}

export function getStatusBadgeType(status: TaskStatus): 'success' | 'warning' | 'danger' | 'info' | 'neutral' {
  switch (status) {
    case 'COMPLETED':
      return 'success';
    case 'IN_PROGRESS':
      return 'info';
    case 'BLOCKED':
      return 'danger';
    case 'ON_HOLD':
      return 'warning';
    case 'TODO':
    case 'CANCELLED':
    default:
      return 'neutral';
  }
}

export function getStatusLabel(status: TaskStatus): string {
  switch (status) {
    case 'TODO':
      return 'To Do';
    case 'IN_PROGRESS':
      return 'In Progress';
    case 'ON_HOLD':
      return 'On Hold';
    case 'BLOCKED':
      return 'Blocked';
    case 'COMPLETED':
      return 'Completed';
    case 'CANCELLED':
      return 'Cancelled';
    default:
      return status;
  }
}

