import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotificationsPage } from '@/features/notifications/NotificationsPage';
import {
  NotificationCard,
  NotificationFilters,
  AuditTimelineFeed,
  AuditEventDetailDrawer,
} from '@/features/notifications/components';
import { NotificationPopover } from '@/components/navigation/NotificationPopover';
import * as notifApi from '@/services/notifications';
import { useAppStore } from '@/lib/store';
import {
  NotificationType,
  AuditEntityType,
  AuditAction,
} from '@corviin-hub/shared';
import type {
  InAppNotificationItem,
  AuditEventItem,
} from '@corviin-hub/shared';

const mockNotifications: InAppNotificationItem[] = [
  {
    id: 'notif-1',
    workspaceId: 'ws-tech-0001-0000-000000000001',
    recipientId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    actorId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    actorName: 'Rohit',
    type: NotificationType.TASK_ASSIGNED,
    title: 'New Task Assignment',
    message: 'Rohit assigned you "Full Stack Architecture Review".',
    entityType: AuditEntityType.TASK,
    entityId: 'tsk-001',
    actionDestination: '/app/my-tasks',
    isRead: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'notif-2',
    workspaceId: 'ws-tech-0001-0000-000000000001',
    recipientId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    actorId: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
    actorName: 'Utkarsh',
    type: NotificationType.CAMPAIGN_REVIEW_PENDING,
    title: 'Script Review Requested',
    message: 'Utkarsh uploaded Script v2 for review.',
    entityType: AuditEntityType.CAMPAIGN,
    entityId: 'cmp-001',
    actionDestination: '/app/campaigns/cmp-001',
    isRead: true,
    readAt: '2026-11-05T12:00:00.000Z',
    createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
  },
];

const mockAuditEvents: AuditEventItem[] = [
  {
    id: 'evt-1',
    workspaceId: 'ws-tech-0001-0000-000000000001',
    entityType: AuditEntityType.TASK,
    entityId: 'tsk-001',
    entityTitle: 'Full Stack Architecture Review',
    action: AuditAction.CREATED,
    actorId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    actorName: 'Rohit',
    timestamp: new Date().toISOString(),
    changeSummary: 'Created task and assigned to Anant with High priority.',
    newValues: { priority: 'HIGH', status: 'TODO' },
    correlationId: 'req-corr-001',
  },
  {
    id: 'evt-2',
    workspaceId: 'ws-tech-0001-0000-000000000001',
    entityType: AuditEntityType.CAMPAIGN,
    entityId: 'cmp-001',
    entityTitle: 'Corviin Tech OS Architecture Brief',
    action: AuditAction.STAGE_CHANGED,
    actorId: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
    actorName: 'Utkarsh',
    timestamp: new Date(Date.now() - 7200 * 1000).toISOString(),
    changeSummary: 'Advanced campaign from Stage 1 to Stage 2.',
    previousValues: { stage: 'INITIAL_IDEA' },
    newValues: { stage: 'SCRIPTING_PLANNING' },
    reason: 'Concept verified and reference benchmark assets uploaded.',
    correlationId: 'req-corr-002',
  },
];

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>,
  );
}

describe('Feature 17: Notifications, Activity & Audit Slice', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    useAppStore.setState({
      selectedWorkspaceId: 'ws-tech-0001-0000-000000000001',
      selectedProfileId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    });
  });

  describe('NotificationCard Component', () => {
    it('renders notification title, message, actor, and action destination', () => {
      const onToggleRead = vi.fn();

      render(
        <BrowserRouter>
          <NotificationCard
            notification={mockNotifications[0]}
            onToggleRead={onToggleRead}
          />
        </BrowserRouter>,
      );

      expect(screen.getByText('New Task Assignment')).toBeInTheDocument();
      expect(screen.getByText(/assigned you "Full Stack Architecture Review"/i)).toBeInTheDocument();
      expect(screen.getByText('Rohit')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Mark read/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Open/i })).toHaveAttribute('href', '/app/my-tasks');

      fireEvent.click(screen.getByRole('button', { name: /Mark read/i }));
      expect(onToggleRead).toHaveBeenCalledWith('notif-1', true);
    });
  });

  describe('NotificationFilters Component', () => {
    it('switches between unread filter, category selection, and mark all read', () => {
      const onUnreadOnlyChange = vi.fn();
      const onTypeFilterChange = vi.fn();
      const onMarkAllRead = vi.fn();

      render(
        <NotificationFilters
          unreadOnly={false}
          onUnreadOnlyChange={onUnreadOnlyChange}
          typeFilter="ALL"
          onTypeFilterChange={onTypeFilterChange}
          onMarkAllRead={onMarkAllRead}
          unreadCount={3}
        />,
      );

      expect(screen.getByRole('button', { name: /^All$/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Unread/i })).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Mark all read/i })).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: /Unread/i }));
      expect(onUnreadOnlyChange).toHaveBeenCalledWith(true);

      fireEvent.click(screen.getByRole('button', { name: /Mark all read/i }));
      expect(onMarkAllRead).toHaveBeenCalled();
    });
  });

  describe('AuditTimelineFeed & AuditEventDetailDrawer Components', () => {
    it('renders chronological audit entries and opens detail drawer with before/after state diff', () => {
      const onFilterChange = vi.fn();

      render(
        <AuditTimelineFeed
          events={mockAuditEvents}
          entityTypeFilter="ALL"
          onEntityTypeFilterChange={onFilterChange}
        />,
      );

      expect(screen.getByText('Full Stack Architecture Review')).toBeInTheDocument();
      expect(screen.getByText('Corviin Tech OS Architecture Brief')).toBeInTheDocument();
      expect(screen.getByText('CREATED')).toBeInTheDocument();
      expect(screen.getByText('STAGE_CHANGED')).toBeInTheDocument();

      // Click Inspect Diff button
      const inspectButtons = screen.getAllByRole('button', { name: /Inspect Diff/i });
      fireEvent.click(inspectButtons[1]); // inspect evt-2

      // Drawer opens
      expect(screen.getByText('State Audit Diff (Before / After)')).toBeInTheDocument();
      expect(screen.getAllByText(/Concept verified and reference benchmark/i).length).toBe(2);
      expect(screen.getByText(/req-corr-002/i)).toBeInTheDocument();
    });
  });

  describe('NotificationPopover in TopBar', () => {
    it('renders bell button with unread count badge and toggles popover preview', async () => {
      vi.spyOn(notifApi, 'fetchUnreadCount').mockResolvedValue({ count: 2 });
      vi.spyOn(notifApi, 'fetchNotifications').mockResolvedValue(mockNotifications);

      renderWithClient(<NotificationPopover />);

      // Bell button should render
      const bellButton = screen.getByRole('button', { name: /Notifications/i });
      expect(bellButton).toBeInTheDocument();

      // Open popover
      fireEvent.click(bellButton);

      await waitFor(() => {
        expect(screen.getByText('New Task Assignment')).toBeInTheDocument();
        expect(screen.getByText(/View all notifications & audit timeline/i)).toBeInTheDocument();
      });
    });
  });

  describe('NotificationsPage Full Integration', () => {
    it('loads notifications and audit timeline, enabling tab switching and action execution', async () => {
      vi.spyOn(notifApi, 'fetchNotifications').mockResolvedValue(mockNotifications);
      vi.spyOn(notifApi, 'fetchUnreadCount').mockResolvedValue({ count: 1 });
      vi.spyOn(notifApi, 'fetchAuditEvents').mockResolvedValue(mockAuditEvents);

      renderWithClient(<NotificationsPage />);

      await waitFor(() => {
        expect(screen.getByText('Notifications & Operational Activity')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /My Notifications/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Workspace Activity & Audit Timeline/i })).toBeInTheDocument();
      });

      // Switch to Audit Timeline tab
      fireEvent.click(screen.getByRole('button', { name: /Workspace Activity & Audit Timeline/i }));

      await waitFor(() => {
        expect(screen.getByText('Full Stack Architecture Review')).toBeInTheDocument();
        expect(screen.getByText('Corviin Tech OS Architecture Brief')).toBeInTheDocument();
      });
    });
  });
});
