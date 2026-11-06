import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Clock, CheckCheck, RefreshCw } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  fetchAuditEvents,
} from '@/services/notifications';
import {
  NotificationCard,
  NotificationFilters,
  AuditTimelineFeed,
} from './components';

export function NotificationsPage() {
  const queryClient = useQueryClient();
  const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);
  const selectedProfileId = useAppStore((s) => s.selectedProfileId);

  const activeWorkspaceId = selectedWorkspaceId || 'ws-tech-0001-0000-000000000001';
  const activeProfileId = selectedProfileId || 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

  const [activeTab, setActiveTab] = useState<'notifications' | 'audit'>('notifications');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [auditEntityTypeFilter, setAuditEntityTypeFilter] = useState('ALL');

  // 1. Fetch user notifications
  const {
    data: notifications = [],
    isLoading: isNotifsLoading,
    refetch: refetchNotifications,
  } = useQuery({
    queryKey: ['notifications', activeWorkspaceId, activeProfileId, unreadOnly, typeFilter],
    queryFn: () =>
      fetchNotifications(activeWorkspaceId, activeProfileId, {
        unreadOnly,
        type: typeFilter === 'ALL' ? undefined : typeFilter,
      }),
  });

  // 2. Fetch unread count
  const { data: unreadData } = useQuery({
    queryKey: ['notifications', 'unread-count', activeWorkspaceId, activeProfileId],
    queryFn: () => fetchUnreadCount(activeWorkspaceId, activeProfileId),
  });

  // 3. Fetch workspace audit events
  const {
    data: auditEvents = [],
    isLoading: isAuditLoading,
    refetch: refetchAudit,
  } = useQuery({
    queryKey: ['audit-events', activeWorkspaceId, auditEntityTypeFilter],
    queryFn: () =>
      fetchAuditEvents(activeWorkspaceId, {
        entityType: auditEntityTypeFilter === 'ALL' ? undefined : auditEntityTypeFilter,
      }),
  });

  // Mark single read mutation
  const markReadMutation = useMutation({
    mutationFn: ({ id, isRead }: { id: string; isRead: boolean }) =>
      markNotificationRead(id, isRead),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Mark all read mutation
  const markAllReadMutation = useMutation({
    mutationFn: () => markAllNotificationsRead(activeWorkspaceId, activeProfileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const unreadCount = unreadData?.count || 0;

  // Group notifications by date
  const now = new Date();
  const todayStr = now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  const todayNotifs = notifications.filter(
    (n) => new Date(n.createdAt).toDateString() === todayStr,
  );
  const yesterdayNotifs = notifications.filter(
    (n) => new Date(n.createdAt).toDateString() === yesterdayStr,
  );
  const earlierNotifs = notifications.filter(
    (n) =>
      new Date(n.createdAt).toDateString() !== todayStr &&
      new Date(n.createdAt).toDateString() !== yesterdayStr,
  );

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-primary">Notifications & Operational Activity</h1>
          <p className="text-xs text-secondary mt-0.5">
            Personal actionable notifications and chronological workspace audit timeline.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            refetchNotifications();
            refetchAudit();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-surface border border-border text-secondary hover:text-primary hover:bg-surface-muted min-h-[38px] self-start sm:self-center"
        >
          <RefreshCw size={13} className="text-brand-teal" />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Main Mode Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-px">
        <button
          type="button"
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 -mb-px min-h-[42px] ${
            activeTab === 'notifications'
              ? 'border-brand-teal text-primary'
              : 'border-transparent text-secondary hover:text-primary'
          }`}
        >
          <Bell size={15} />
          <span>My Notifications</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-brand-teal text-white">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 -mb-px min-h-[42px] ${
            activeTab === 'audit'
              ? 'border-brand-teal text-primary'
              : 'border-transparent text-secondary hover:text-primary'
          }`}
        >
          <Clock size={15} />
          <span>Workspace Activity & Audit Timeline</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-muted text-secondary border border-border">
            {auditEvents.length}
          </span>
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'notifications' ? (
        <div className="space-y-4">
          <NotificationFilters
            unreadOnly={unreadOnly}
            onUnreadOnlyChange={setUnreadOnly}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            onMarkAllRead={() => markAllReadMutation.mutate()}
            unreadCount={unreadCount}
          />

          {isNotifsLoading ? (
            <div className="p-8 text-center text-xs text-secondary bg-surface border border-border rounded-lg">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-secondary bg-surface border border-border rounded-lg">
              No notifications matching the selected filter.
            </div>
          ) : (
            <div className="space-y-6">
              {/* Today Section */}
              {todayNotifs.length > 0 && (
                <div className="space-y-2.5">
                  <h3 className="text-xs font-bold text-secondary uppercase tracking-wider">
                    Today
                  </h3>
                  <div className="space-y-2">
                    {todayNotifs.map((n) => (
                      <NotificationCard
                        key={n.id}
                        notification={n}
                        onToggleRead={(id, isRead) =>
                          markReadMutation.mutate({ id, isRead })
                        }
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Yesterday Section */}
              {yesterdayNotifs.length > 0 && (
                <div className="space-y-2.5">
                  <h3 className="text-xs font-bold text-secondary uppercase tracking-wider">
                    Yesterday
                  </h3>
                  <div className="space-y-2">
                    {yesterdayNotifs.map((n) => (
                      <NotificationCard
                        key={n.id}
                        notification={n}
                        onToggleRead={(id, isRead) =>
                          markReadMutation.mutate({ id, isRead })
                        }
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Earlier Section */}
              {earlierNotifs.length > 0 && (
                <div className="space-y-2.5">
                  <h3 className="text-xs font-bold text-secondary uppercase tracking-wider">
                    Earlier
                  </h3>
                  <div className="space-y-2">
                    {earlierNotifs.map((n) => (
                      <NotificationCard
                        key={n.id}
                        notification={n}
                        onToggleRead={(id, isRead) =>
                          markReadMutation.mutate({ id, isRead })
                        }
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <AuditTimelineFeed
          events={auditEvents}
          entityTypeFilter={auditEntityTypeFilter}
          onEntityTypeFilterChange={setAuditEntityTypeFilter}
          isLoading={isAuditLoading}
        />
      )}
    </div>
  );
}

