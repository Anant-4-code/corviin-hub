import { api } from '@/lib/api';
import type {
  ApiResponse,
  InAppNotificationItem,
  AuditEventItem,
  EmitEventDto,
  NotificationFilterQuery,
  AuditEventFilterQuery,
} from '@corviin-hub/shared';

export async function fetchNotifications(
  workspaceId: string,
  profileId?: string,
  filter?: { unreadOnly?: boolean; type?: string },
): Promise<InAppNotificationItem[]> {
  const params = new URLSearchParams();
  params.set('workspaceId', workspaceId);
  if (profileId) params.set('profileId', profileId);
  if (filter?.unreadOnly) params.set('unreadOnly', 'true');
  if (filter?.type) params.set('type', filter.type);

  const res = await api.get<ApiResponse<InAppNotificationItem[]>>(
    `/notifications?${params.toString()}`,
  );
  return res.data;
}

export async function fetchUnreadCount(
  workspaceId: string,
  profileId?: string,
): Promise<{ count: number }> {
  const params = new URLSearchParams();
  params.set('workspaceId', workspaceId);
  if (profileId) params.set('profileId', profileId);

  const res = await api.get<ApiResponse<{ count: number }>>(
    `/notifications/unread-count?${params.toString()}`,
  );
  return res.data;
}

export async function markNotificationRead(
  id: string,
  isRead: boolean = true,
): Promise<InAppNotificationItem> {
  const res = await api.patch<ApiResponse<InAppNotificationItem>>(`/notifications/${id}/read`, {
    isRead,
  });
  return res.data;
}

export async function markAllNotificationsRead(
  workspaceId: string,
  recipientId: string,
): Promise<{ updatedCount: number }> {
  const res = await api.post<ApiResponse<{ updatedCount: number }>>(
    '/notifications/mark-all-read',
    {
      workspaceId,
      recipientId,
    },
  );
  return res.data;
}

export async function fetchAuditEvents(
  workspaceId: string,
  filter?: {
    entityType?: string;
    entityId?: string;
    actorId?: string;
    action?: string;
  },
): Promise<AuditEventItem[]> {
  const params = new URLSearchParams();
  params.set('workspaceId', workspaceId);
  if (filter?.entityType) params.set('entityType', filter.entityType);
  if (filter?.entityId) params.set('entityId', filter.entityId);
  if (filter?.actorId) params.set('actorId', filter.actorId);
  if (filter?.action) params.set('action', filter.action);

  const res = await api.get<ApiResponse<AuditEventItem[]>>(
    `/notifications/audit-events?${params.toString()}`,
  );
  return res.data;
}

export async function fetchAuditEventDetail(id: string): Promise<AuditEventItem> {
  const res = await api.get<ApiResponse<AuditEventItem>>(`/notifications/audit-events/${id}`);
  return res.data;
}

export async function emitDomainEvent(
  dto: EmitEventDto,
): Promise<{ eventId: string; notificationId?: string }> {
  const res = await api.post<ApiResponse<{ eventId: string; notificationId?: string }>>(
    '/notifications/emit-event',
    dto,
  );
  return res.data;
}

