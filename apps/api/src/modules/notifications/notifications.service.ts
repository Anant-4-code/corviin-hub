import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  InAppNotificationItem,
  AuditEventItem,
  EmitEventDto,
  NotificationFilterQuery,
  AuditEventFilterQuery,
  NotificationType,
  AuditEntityType,
  AuditAction,
} from '@corviin-hub/shared';

@Injectable()
export class NotificationsService {
  // Deterministic in-memory In-App Notifications repository
  private notifications: InAppNotificationItem[] = [
    // Corviin Tech Notifications
    {
      id: 'notif-tech-001',
      workspaceId: 'ws-tech-0001-0000-000000000001',
      recipientId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', // Anant
      actorId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901', // Rohit
      actorName: 'Rohit',
      type: NotificationType.TASK_ASSIGNED,
      title: 'New Task Assignment',
      message: 'Rohit assigned you "Full Stack Architecture Review & API Governance".',
      entityType: AuditEntityType.TASK,
      entityId: 'tsk-tech-001',
      actionDestination: '/app/my-tasks',
      isRead: false,
      priority: 'HIGH',
      createdAt: '2026-11-05T14:30:00.000Z',
    },
    {
      id: 'notif-tech-002',
      workspaceId: 'ws-tech-0001-0000-000000000001',
      recipientId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', // Anant
      actorId: 'c3d4e5f6-a7b8-9012-cdef-123456789012', // Utkarsh
      actorName: 'Utkarsh',
      type: NotificationType.CAMPAIGN_REVIEW_PENDING,
      title: 'Script Review Requested',
      message: 'Utkarsh uploaded Script v2 for "Corviin Tech OS Architecture Brief" awaiting review.',
      entityType: AuditEntityType.CAMPAIGN,
      entityId: 'cmp-tech-001',
      actionDestination: '/app/campaigns/cmp-tech-001',
      isRead: false,
      priority: 'MEDIUM',
      createdAt: '2026-11-05T12:15:00.000Z',
    },
    {
      id: 'notif-tech-003',
      workspaceId: 'ws-tech-0001-0000-000000000001',
      recipientId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', // Anant
      actorId: 'system',
      actorName: 'System Scheduler',
      type: NotificationType.MEETING_APPROACHING,
      title: 'Meeting in 30 Minutes',
      message: 'Upcoming: "Enterprise SaaS Architecture Sync" starting at 15:30 IST.',
      entityType: AuditEntityType.MEETING,
      entityId: 'meet-tech-001',
      actionDestination: '/app/meetings/meet-tech-001',
      isRead: true,
      readAt: '2026-11-05T15:05:00.000Z',
      priority: 'HIGH',
      createdAt: '2026-11-05T15:00:00.000Z',
    },
    {
      id: 'notif-tech-004',
      workspaceId: 'ws-tech-0001-0000-000000000001',
      recipientId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', // Anant
      actorId: 'system',
      actorName: 'Automated Task Monitor',
      type: NotificationType.TASK_DUE_SOON,
      title: 'Task Due Soon',
      message: 'Your high-priority task "Document design tokens in architecture TRD" is due tomorrow.',
      entityType: AuditEntityType.TASK,
      entityId: 'tsk-tech-002',
      actionDestination: '/app/my-tasks',
      isRead: false,
      priority: 'URGENT',
      createdAt: '2026-11-05T08:00:00.000Z',
    },
    {
      id: 'notif-tech-005',
      workspaceId: 'ws-tech-0001-0000-000000000001',
      recipientId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', // Anant
      actorId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901', // Rohit
      actorName: 'Rohit',
      type: NotificationType.CRM_FOLLOW_UP_DUE,
      title: 'Tech CRM Follow-Up Due',
      message: 'Follow-up call with NexaCorp IT Leadership regarding Q4 Automation deployment.',
      entityType: AuditEntityType.CRM,
      entityId: 'crm-tech-001',
      actionDestination: '/app/crm/tech',
      isRead: true,
      readAt: '2026-11-04T16:00:00.000Z',
      priority: 'HIGH',
      createdAt: '2026-11-04T15:30:00.000Z',
    },
    {
      id: 'notif-tech-006',
      workspaceId: 'ws-tech-0001-0000-000000000001',
      recipientId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', // Anant
      actorId: 'c3d4e5f6-a7b8-9012-cdef-123456789012', // Utkarsh
      actorName: 'Utkarsh',
      type: NotificationType.APPROVAL_STATUS,
      title: 'Design System Asset Uploaded',
      message: 'New token stylesheet "corviin-tokens-v2.json" uploaded and ready for consumption.',
      entityType: AuditEntityType.ASSET,
      entityId: 'ast-tech-101',
      actionDestination: '/app/assets',
      isRead: true,
      readAt: '2026-11-03T11:00:00.000Z',
      priority: 'LOW',
      createdAt: '2026-11-03T10:45:00.000Z',
    },

    // Corviin Real Estate Notifications
    {
      id: 'notif-real-001',
      workspaceId: 'ws-real-0002-0000-000000000002',
      recipientId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', // Anant
      actorId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901', // Rohit
      actorName: 'Rohit',
      type: NotificationType.CRM_FOLLOW_UP_DUE,
      title: 'Partner Follow-Up Reminder',
      message: 'Follow-up discussion planned today with Sobha Developers mandate team.',
      entityType: AuditEntityType.CRM,
      entityId: 'rec-partner-001',
      actionDestination: '/app/crm/real-estate/partners',
      isRead: false,
      priority: 'HIGH',
      createdAt: '2026-11-05T10:00:00.000Z',
    },
    {
      id: 'notif-real-002',
      workspaceId: 'ws-real-0002-0000-000000000002',
      recipientId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', // Anant
      actorId: 'system',
      actorName: 'CRM Inbound Lead Bot',
      type: NotificationType.TASK_ASSIGNED,
      title: 'New High-Budget Buyer Assigned',
      message: 'New qualified lead "Vikram Rao (3 BHK Whitefield)" assigned to your pipeline.',
      entityType: AuditEntityType.CRM,
      entityId: 'rec-buyer-001',
      actionDestination: '/app/crm/real-estate/buyers',
      isRead: false,
      priority: 'URGENT',
      createdAt: '2026-11-05T09:45:00.000Z',
    },
    {
      id: 'notif-real-003',
      workspaceId: 'ws-real-0002-0000-000000000002',
      recipientId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', // Anant
      actorId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901', // Rohit
      actorName: 'Rohit',
      type: NotificationType.MEETING_RESCHEDULED,
      title: 'Site Visit Rescheduled',
      message: 'Devanahalli Land Parcel feasibility visit moved to 2:00 PM due to client transit.',
      entityType: AuditEntityType.MEETING,
      entityId: 'meet-real-001',
      actionDestination: '/app/meetings/meet-real-001',
      isRead: true,
      readAt: '2026-11-04T12:00:00.000Z',
      priority: 'MEDIUM',
      createdAt: '2026-11-04T11:30:00.000Z',
    },
  ];

  // Deterministic in-memory Audit Event Log repository
  private auditEvents: AuditEventItem[] = [
    // Corviin Tech Audit Events
    {
      id: 'evt-tech-001',
      workspaceId: 'ws-tech-0001-0000-000000000001',
      entityType: AuditEntityType.TASK,
      entityId: 'tsk-tech-001',
      entityTitle: 'Full Stack Architecture Review',
      action: AuditAction.CREATED,
      actorId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
      actorName: 'Rohit',
      timestamp: '2026-11-05T14:30:00.000Z',
      changeSummary: 'Created task and assigned to Anant with High priority.',
      newValues: { priority: 'HIGH', status: 'TODO', assignee: 'Anant' },
      correlationId: 'req-corr-101',
    },
    {
      id: 'evt-tech-002',
      workspaceId: 'ws-tech-0001-0000-000000000001',
      entityType: AuditEntityType.CAMPAIGN,
      entityId: 'cmp-tech-001',
      entityTitle: 'Corviin Tech OS Architecture Brief',
      action: AuditAction.STAGE_CHANGED,
      actorId: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
      actorName: 'Utkarsh',
      timestamp: '2026-11-05T12:15:00.000Z',
      changeSummary: 'Advanced campaign from Stage 1 (Initial Idea) to Stage 2 (Scripting & Planning).',
      previousValues: { stage: 'INITIAL_IDEA' },
      newValues: { stage: 'SCRIPTING_PLANNING' },
      reason: 'Concept verified and reference benchmark assets uploaded.',
      correlationId: 'req-corr-102',
    },
    {
      id: 'evt-tech-003',
      workspaceId: 'ws-tech-0001-0000-000000000001',
      entityType: AuditEntityType.SETTINGS,
      entityId: 'ws-tech-0001-0000-000000000001',
      entityTitle: 'Corviin Tech Settings',
      action: AuditAction.UPDATED,
      actorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      actorName: 'Anant',
      timestamp: '2026-11-05T11:00:00.000Z',
      changeSummary: 'Updated workspace task priority defaults and operating days.',
      previousValues: { defaultDueDays: 2 },
      newValues: { defaultDueDays: 3 },
      correlationId: 'req-corr-103',
    },
    {
      id: 'evt-tech-004',
      workspaceId: 'ws-tech-0001-0000-000000000001',
      entityType: AuditEntityType.MEETING,
      entityId: 'mtg-tech-001',
      entityTitle: 'Weekly Tech Architecture & Zero-Animation Review',
      action: AuditAction.RESCHEDULED,
      actorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      actorName: 'Anant',
      timestamp: '2026-11-05T09:15:00.000Z',
      changeSummary: 'Rescheduled meeting start time from 10:00 AM to 11:30 AM.',
      previousValues: { startTime: '10:00 AM' },
      newValues: { startTime: '11:30 AM' },
      reason: 'Team lead travelling for onsite demo',
      correlationId: 'req-corr-104',
    },
    {
      id: 'evt-tech-005',
      workspaceId: 'ws-tech-0001-0000-000000000001',
      entityType: AuditEntityType.GOAL,
      entityId: 'goal-tech-01',
      entityTitle: 'Launch Enterprise Automation Suite Q4',
      action: AuditAction.UPDATED,
      actorId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
      actorName: 'Rohit',
      timestamp: '2026-11-04T16:45:00.000Z',
      changeSummary: 'Updated goal completion milestone progress to 85%.',
      previousValues: { progress: 70 },
      newValues: { progress: 85 },
      correlationId: 'req-corr-105',
    },

    // Corviin Real Estate Audit Events
    {
      id: 'evt-real-001',
      workspaceId: 'ws-real-0002-0000-000000000002',
      entityType: AuditEntityType.CRM,
      entityId: 'rec-partner-001',
      entityTitle: 'Prestige Group Partnership Lead',
      action: AuditAction.STAGE_CHANGED,
      actorId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
      actorName: 'Rohit',
      timestamp: '2026-11-05T10:00:00.000Z',
      changeSummary: 'Advanced partner lead to "Requirement Discussion" following initial founder call.',
      previousValues: { stage: 'INITIAL_CONTACT' },
      newValues: { stage: 'REQUIREMENT_DISCUSSION' },
      correlationId: 'req-corr-201',
    },
    {
      id: 'evt-real-002',
      workspaceId: 'ws-real-0002-0000-000000000002',
      entityType: AuditEntityType.MEETING,
      entityId: 'meet-real-001',
      entityTitle: 'Site Feasibility Walkthrough — Devanahalli Land Parcel',
      action: AuditAction.CONVERTED,
      actorId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
      actorName: 'Rohit',
      timestamp: '2026-11-05T09:30:00.000Z',
      changeSummary: 'Converted action item "Prepare Title Search Mandate Document" into formal shared task.',
      newValues: { convertedTaskId: 'tsk-real-105' },
      correlationId: 'req-corr-202',
    },
    {
      id: 'evt-real-003',
      workspaceId: 'ws-real-0002-0000-000000000002',
      entityType: AuditEntityType.CRM,
      entityId: 'rec-buyer-001',
      entityTitle: 'Vikram Rao — 3 BHK Whitefield Luxury Buyer',
      action: AuditAction.ASSIGNED,
      actorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      actorName: 'Anant',
      timestamp: '2026-11-05T08:45:00.000Z',
      changeSummary: 'Assigned high-intent buyer enquiry to Utkarsh with budget ₹2.5 Cr.',
      newValues: { assignee: 'Utkarsh', priority: 'HIGH' },
      correlationId: 'req-corr-203',
    },
    {
      id: 'evt-real-004',
      workspaceId: 'ws-real-0002-0000-000000000002',
      entityType: AuditEntityType.ASSET,
      entityId: 'ast-real-002',
      entityTitle: 'Sobha_Oakshire_Brochure_v1.pdf',
      action: AuditAction.ASSET_UPLOADED,
      actorId: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
      actorName: 'Utkarsh',
      timestamp: '2026-11-04T15:20:00.000Z',
      changeSummary: 'Uploaded approved marketing collateral to R2 bucket.',
      newValues: { fileSize: '4.2 MB', category: 'CONTRACTS_DOCS' },
      correlationId: 'req-corr-204',
    },
  ];

  /**
   * Fetch user notifications filtered by workspace and recipient
   */
  getNotifications(filter: NotificationFilterQuery): InAppNotificationItem[] {
    if (!filter.workspaceId) {
      throw new BadRequestException('workspaceId is required.');
    }

    let items = this.notifications.filter((n) => n.workspaceId === filter.workspaceId);

    if (filter.profileId) {
      items = items.filter((n) => n.recipientId === filter.profileId);
    }
    if (filter.unreadOnly) {
      items = items.filter((n) => !n.isRead);
    }
    if (filter.type) {
      items = items.filter((n) => n.type === filter.type);
    }

    return items.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  /**
   * Get unread notification count
   */
  getUnreadCount(workspaceId: string, recipientId?: string): { count: number } {
    if (!workspaceId) {
      throw new BadRequestException('workspaceId is required.');
    }

    let items = this.notifications.filter(
      (n) => n.workspaceId === workspaceId && !n.isRead,
    );

    if (recipientId) {
      items = items.filter((n) => n.recipientId === recipientId);
    }

    return { count: items.length };
  }

  /**
   * Mark notification as read or unread
   */
  markAsRead(id: string, isRead: boolean = true): InAppNotificationItem {
    const notif = this.notifications.find((n) => n.id === id);
    if (!notif) {
      throw new NotFoundException(`Notification with ID ${id} not found.`);
    }

    notif.isRead = isRead;
    notif.readAt = isRead ? new Date().toISOString() : undefined;
    return notif;
  }

  /**
   * Mark all notifications as read for recipient in workspace
   */
  markAllAsRead(workspaceId: string, recipientId: string): { updatedCount: number } {
    if (!workspaceId || !recipientId) {
      throw new BadRequestException('workspaceId and recipientId are required.');
    }

    let count = 0;
    this.notifications.forEach((n) => {
      if (n.workspaceId === workspaceId && n.recipientId === recipientId && !n.isRead) {
        n.isRead = true;
        n.readAt = new Date().toISOString();
        count++;
      }
    });

    return { updatedCount: count };
  }

  /**
   * Fetch workspace audit activity timeline
   */
  getAuditEvents(filter: AuditEventFilterQuery): AuditEventItem[] {
    if (!filter.workspaceId) {
      throw new BadRequestException('workspaceId is required.');
    }

    let events = this.auditEvents.filter((e) => e.workspaceId === filter.workspaceId);

    if (filter.entityType) {
      events = events.filter((e) => e.entityType === filter.entityType);
    }
    if (filter.entityId) {
      events = events.filter((e) => e.entityId === filter.entityId);
    }
    if (filter.actorId) {
      events = events.filter((e) => e.actorId === filter.actorId);
    }
    if (filter.action) {
      events = events.filter((e) => e.action === filter.action);
    }

    return events.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  }

  /**
   * Get single audit event detail
   */
  getAuditEventById(id: string): AuditEventItem {
    const event = this.auditEvents.find((e) => e.id === id);
    if (!event) {
      throw new NotFoundException(`Audit event with ID ${id} not found.`);
    }
    return event;
  }

  /**
   * Redact sensitive credentials and tokens from audit event payloads
   */
  private sanitizeAuditValues(values: unknown): unknown {
    if (!values || typeof values !== 'object') return values;
    if (Array.isArray(values)) {
      return values.map((item) => this.sanitizeAuditValues(item));
    }
    const sanitized: Record<string, unknown> = {};
    const SENSITIVE_KEYS = /password|token|secret|accesskey|auth|presigned|credential|privatekey/i;

    for (const [key, val] of Object.entries(values as Record<string, unknown>)) {
      if (SENSITIVE_KEYS.test(key)) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof val === 'string' && (val.includes('X-Amz-Signature') || val.includes('token='))) {
        sanitized[key] = '[REDACTED_URL]';
      } else if (typeof val === 'object' && val !== null) {
        sanitized[key] = this.sanitizeAuditValues(val);
      } else {
        sanitized[key] = val;
      }
    }
    return sanitized;
  }

  /**
   * Check if recipient personal preferences allow delivering this notification type
   */
  shouldDeliverNotification(
    recipientPreferences: Record<string, boolean> | undefined,
    type: NotificationType,
  ): boolean {
    if (!recipientPreferences) return true;
    if (recipientPreferences.inAppChannel === false) return false;

    switch (type) {
      case NotificationType.TASK_ASSIGNED:
        return recipientPreferences.taskAssignments !== false;
      case NotificationType.TASK_OVERDUE:
        return recipientPreferences.overdueAlerts !== false;
      case NotificationType.TASK_DUE_SOON:
        return recipientPreferences.deadlineReminders !== false;
      case NotificationType.CAMPAIGN_DEADLINE:
      case NotificationType.CAMPAIGN_REVIEW_PENDING:
        return recipientPreferences.campaignMilestones !== false;
      case NotificationType.MEETING_APPROACHING:
      case NotificationType.MEETING_RESCHEDULED:
        return recipientPreferences.meetingReminders !== false;
      default:
        return true;
    }
  }

  /**
   * Emit domain event and trigger notification delivery rules
   */
  emitEvent(
    dto: EmitEventDto & { recipientPreferences?: Record<string, boolean> },
  ): { eventId: string; notificationId?: string; suppressedByPreferences?: boolean } {
    if (!dto.workspaceId || !dto.entityType || !dto.entityId || !dto.action || !dto.actorId) {
      throw new BadRequestException('Missing required event emission fields.');
    }

    const eventId = `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const auditEvent: AuditEventItem = {
      id: eventId,
      workspaceId: dto.workspaceId,
      entityType: dto.entityType,
      entityId: dto.entityId,
      entityTitle: dto.entityTitle || `${dto.entityType} #${dto.entityId}`,
      action: dto.action,
      actorId: dto.actorId,
      actorName: dto.actorName || 'Acting Member',
      timestamp: new Date().toISOString(),
      changeSummary: dto.changeSummary,
      previousValues: this.sanitizeAuditValues(dto.previousValues) as any,
      newValues: this.sanitizeAuditValues(dto.newValues) as any,
      reason: dto.reason,
      correlationId: `corr-${Date.now()}`,
    };

    // Immutable append to audit log
    this.auditEvents.unshift(auditEvent);

    let notificationId: string | undefined;
    let suppressedByPreferences = false;

    // Trigger user notification if recipient specified
    if (dto.notification) {
      // Preference evaluation: check if recipient has suppressed this notification category
      const prefs = dto.recipientPreferences;
      if (!this.shouldDeliverNotification(prefs, dto.notification.type)) {
        suppressedByPreferences = true;
      } else {
        // Deduplication check: do not create duplicate unread notification for same recipient, entity, and type within last 5 minutes
        const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
        const existing = this.notifications.find(
          (n) =>
            n.workspaceId === dto.workspaceId &&
            n.recipientId === dto.notification!.recipientId &&
            n.entityId === dto.entityId &&
            n.type === dto.notification!.type &&
            !n.isRead &&
            new Date(n.createdAt).getTime() > fiveMinutesAgo,
        );

        if (!existing) {
          notificationId = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
          const notif: InAppNotificationItem = {
            id: notificationId,
            workspaceId: dto.workspaceId,
            recipientId: dto.notification.recipientId,
            actorId: dto.actorId,
            actorName: dto.actorName || 'Acting Member',
            type: dto.notification.type,
            title: dto.notification.title,
            message: dto.notification.message,
            entityType: dto.entityType,
            entityId: dto.entityId,
            actionDestination: dto.notification.actionDestination,
            isRead: false,
            createdAt: new Date().toISOString(),
          };
          this.notifications.unshift(notif);
        } else {
          notificationId = existing.id;
        }
      }
    }

    return { eventId, notificationId, suppressedByPreferences };
  }
}

