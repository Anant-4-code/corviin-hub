import { NotificationType, AuditEntityType, AuditAction } from '../enums';

export interface InAppNotificationItem {
  id: string;
  workspaceId: string;
  recipientId: string;
  actorId: string;
  actorName: string;
  type: NotificationType;
  title: string;
  message: string;
  entityType: AuditEntityType;
  entityId: string;
  actionDestination: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface AuditEventItem {
  id: string;
  workspaceId: string;
  entityType: AuditEntityType;
  entityId: string;
  entityTitle: string;
  action: AuditAction;
  actorId: string;
  actorName: string;
  timestamp: string;
  changeSummary: string;
  previousValues?: Record<string, any>;
  newValues?: Record<string, any>;
  reason?: string;
  correlationId?: string;
}

export interface EmitEventDto {
  workspaceId: string;
  entityType: AuditEntityType;
  entityId: string;
  entityTitle: string;
  action: AuditAction;
  actorId: string;
  actorName: string;
  changeSummary: string;
  previousValues?: Record<string, any>;
  newValues?: Record<string, any>;
  reason?: string;
  notification?: {
    recipientId: string;
    type: NotificationType;
    title: string;
    message: string;
    actionDestination: string;
  };
}

export interface NotificationFilterQuery {
  workspaceId: string;
  profileId?: string;
  unreadOnly?: boolean;
  type?: NotificationType;
}

export interface AuditEventFilterQuery {
  workspaceId: string;
  entityType?: AuditEntityType;
  entityId?: string;
  actorId?: string;
  action?: AuditAction;
}

