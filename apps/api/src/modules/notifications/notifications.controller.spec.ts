import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import {
  NotificationType,
  AuditEntityType,
  AuditAction,
} from '@corviin-hub/shared';

describe('NotificationsController', () => {
  let controller: NotificationsController;
  let service: NotificationsService;

  const TECH_WS = 'ws-tech-0001-0000-000000000001';
  const REAL_WS = 'ws-real-0002-0000-000000000002';
  const ANANT_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
  const ROHIT_ID = 'b2c3d4e5-f6a7-8901-bcde-f12345678901';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [NotificationsService],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
    service = module.get<NotificationsService>(NotificationsService);
  });

  describe('User Notifications & Recipient Rules', () => {
    it('returns notifications scoped to workspace and recipient profile', () => {
      const items = controller.getNotifications(TECH_WS, ANANT_ID);
      expect(items.length).toBeGreaterThanOrEqual(2);
      expect(items.every((n) => n.workspaceId === TECH_WS)).toBe(true);
      expect(items.every((n) => n.recipientId === ANANT_ID)).toBe(true);
      expect(items[0].title).toBeDefined();
      expect(items[0].actionDestination).toBeDefined();
    });

    it('returns unread count accurately', () => {
      const res = controller.getUnreadCount(TECH_WS, ANANT_ID);
      expect(res.count).toBeGreaterThanOrEqual(1);
    });

    it('marks a notification as read and sets readAt timestamp', () => {
      const updated = controller.markAsRead('notif-tech-001', true);
      expect(updated.isRead).toBe(true);
      expect(updated.readAt).toBeDefined();

      // Toggle back to unread
      const unread = controller.markAsRead('notif-tech-001', false);
      expect(unread.isRead).toBe(false);
      expect(unread.readAt).toBeUndefined();
    });

    it('marks all notifications as read for recipient in workspace', () => {
      const res = controller.markAllAsRead(TECH_WS, ANANT_ID);
      expect(res.updatedCount).toBeGreaterThanOrEqual(1);

      const countAfter = controller.getUnreadCount(TECH_WS, ANANT_ID);
      expect(countAfter.count).toBe(0);
    });

    it('throws NotFoundException when marking a non-existent notification', () => {
      expect(() => {
        controller.markAsRead('notif-nonexistent-999', true);
      }).toThrow(NotFoundException);
    });

    it('enforces workspace isolation between Corviin Tech and Corviin Real Estate', () => {
      const techItems = controller.getNotifications(TECH_WS, ANANT_ID);
      const realItems = controller.getNotifications(REAL_WS, ROHIT_ID);

      expect(techItems.some((n) => n.workspaceId === REAL_WS)).toBe(false);
      expect(realItems.some((n) => n.workspaceId === TECH_WS)).toBe(false);
    });
  });

  describe('Audit Activity Timeline & Event Emission', () => {
    it('returns chronological workspace audit activity timeline', () => {
      const events = controller.getAuditEvents(TECH_WS);
      expect(events.length).toBeGreaterThanOrEqual(2);
      expect(events.every((e) => e.workspaceId === TECH_WS)).toBe(true);
      // Chronological descending
      const t1 = new Date(events[0].timestamp).getTime();
      const t2 = new Date(events[1].timestamp).getTime();
      expect(t1).toBeGreaterThanOrEqual(t2);
    });

    it('filters audit events by entityType', () => {
      const taskEvents = controller.getAuditEvents(TECH_WS, AuditEntityType.TASK);
      expect(taskEvents.every((e) => e.entityType === AuditEntityType.TASK)).toBe(true);
    });

    it('returns single audit event detail with before/after state diff', () => {
      const event = controller.getAuditEventById('evt-tech-002');
      expect(event).toBeDefined();
      expect(event.entityType).toBe(AuditEntityType.CAMPAIGN);
      expect(event.previousValues).toEqual({ stage: 'INITIAL_IDEA' });
      expect(event.newValues).toEqual({ stage: 'SCRIPTING_PLANNING' });
      expect(event.reason).toContain('Concept verified');
    });

    it('emits a new domain event and triggers recipient notification', () => {
      const emitRes = controller.emitEvent({
        workspaceId: TECH_WS,
        entityType: AuditEntityType.TASK,
        entityId: 'tsk-tech-999',
        entityTitle: 'New Operational Task',
        action: AuditAction.CREATED,
        actorId: ROHIT_ID,
        actorName: 'Rohit',
        changeSummary: 'Created task for Anant',
        notification: {
          recipientId: ANANT_ID,
          type: NotificationType.TASK_ASSIGNED,
          title: 'Immediate Deliverable',
          message: 'Review system audit specifications.',
          actionDestination: '/app/my-tasks',
        },
      });

      expect(emitRes.eventId).toBeDefined();
      expect(emitRes.notificationId).toBeDefined();

      // Check notification is in recipient inbox
      const notifications = controller.getNotifications(TECH_WS, ANANT_ID);
      const found = notifications.find((n) => n.id === emitRes.notificationId);
      expect(found).toBeDefined();
      expect(found?.title).toBe('Immediate Deliverable');
    });

    it('deduplicates rapid repeat notifications for identical entity and recipient', () => {
      const res1 = controller.emitEvent({
        workspaceId: TECH_WS,
        entityType: AuditEntityType.CRM,
        entityId: 'rec-test-111',
        entityTitle: 'Test Lead',
        action: AuditAction.UPDATED,
        actorId: ROHIT_ID,
        actorName: 'Rohit',
        changeSummary: 'Lead updated',
        notification: {
          recipientId: ANANT_ID,
          type: NotificationType.CRM_FOLLOW_UP_DUE,
          title: 'Follow-Up Pending',
          message: 'Lead follow up due today',
          actionDestination: '/app/crm',
        },
      });

      // Immediate duplicate emission for same entity, recipient, and type
      const res2 = controller.emitEvent({
        workspaceId: TECH_WS,
        entityType: AuditEntityType.CRM,
        entityId: 'rec-test-111',
        entityTitle: 'Test Lead',
        action: AuditAction.UPDATED,
        actorId: ROHIT_ID,
        actorName: 'Rohit',
        changeSummary: 'Lead updated again',
        notification: {
          recipientId: ANANT_ID,
          type: NotificationType.CRM_FOLLOW_UP_DUE,
          title: 'Follow-Up Pending',
          message: 'Lead follow up due today',
          actionDestination: '/app/crm',
        },
      });

      // Returns the existing notification ID instead of creating duplicate
      expect(res2.notificationId).toBe(res1.notificationId);
    });
  });
});

