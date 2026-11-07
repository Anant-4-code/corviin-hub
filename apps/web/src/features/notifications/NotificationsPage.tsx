import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Clock, RefreshCw } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  fetchAuditEvents,
} from '@/services/notifications';
import {
  NotificationsHeader,
  NotificationsSummaryCards,
  NotificationFilters,
  NotificationCard,
  ActivitySummaryCards,
  ActivityFiltersToolbar,
  AuditTimelineFeed,
} from './components';

export function NotificationsPage() {
  const queryClient = useQueryClient();
  const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);
  const selectedProfileId = useAppStore((s) => s.selectedProfileId);

  const activeWorkspaceId = selectedWorkspaceId || 'ws-tech-0001-0000-000000000001';
  const activeProfileId = selectedProfileId || 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

  // Primary Navigation Tab: 'notifications' | 'activity'
  const [activeTab, setActiveTab] = useState<'notifications' | 'activity'>('notifications');

  // Notifications Filter State
  const [notifSearch, setNotifSearch] = useState('');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [todayOnly, setTodayOnly] = useState(false);

  // Activity Filter State
  const [activitySearch, setActivitySearch] = useState('');
  const [entityTypeFilter, setEntityTypeFilter] = useState('ALL');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [actorFilter, setActorFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState('ALL');
  const [sortDirection, setSortDirection] = useState<'newest' | 'oldest'>('newest');

  // 1. Fetch user notifications
  const {
    data: rawNotifications = [],
    isLoading: isNotifsLoading,
    isFetching: isNotifsFetching,
    refetch: refetchNotifications,
  } = useQuery({
    queryKey: ['notifications', activeWorkspaceId, activeProfileId],
    queryFn: () => fetchNotifications(activeWorkspaceId, activeProfileId),
    enabled: Boolean(activeWorkspaceId),
  });

  // 2. Fetch unread count
  const { data: unreadData } = useQuery({
    queryKey: ['notifications', 'unread-count', activeWorkspaceId, activeProfileId],
    queryFn: () => fetchUnreadCount(activeWorkspaceId, activeProfileId),
    enabled: Boolean(activeWorkspaceId),
  });

  // 3. Fetch workspace audit events
  const {
    data: rawAuditEvents = [],
    isLoading: isAuditLoading,
    isFetching: isAuditFetching,
    refetch: refetchAudit,
  } = useQuery({
    queryKey: ['audit-events', activeWorkspaceId],
    queryFn: () => fetchAuditEvents(activeWorkspaceId),
    enabled: Boolean(activeWorkspaceId),
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

  const unreadCount = unreadData?.count || rawNotifications.filter((n) => !n.isRead).length;

  // Filtered Notifications
  const filteredNotifications = useMemo(() => {
    const now = new Date();
    const todayStr = now.toDateString();

    return rawNotifications.filter((n) => {
      // Unread only filter
      if (unreadOnly && n.isRead) return false;

      // Type / Category filter
      if (typeFilter !== 'ALL' && n.type !== typeFilter) return false;

      // Priority filter
      if (priorityFilter !== 'ALL') {
        if (priorityFilter === 'HIGH') {
          if (n.priority !== 'HIGH' && n.priority !== 'URGENT') return false;
        } else if (n.priority !== priorityFilter) {
          return false;
        }
      }

      // Today only filter
      if (todayOnly && new Date(n.createdAt).toDateString() !== todayStr) {
        return false;
      }

      // Search query
      if (notifSearch.trim().length > 0) {
        const q = notifSearch.toLowerCase();
        const titleMatch = n.title.toLowerCase().includes(q);
        const msgMatch = n.message.toLowerCase().includes(q);
        const actorMatch = n.actorName.toLowerCase().includes(q);
        const entityMatch = n.entityId.toLowerCase().includes(q);
        if (!titleMatch && !msgMatch && !actorMatch && !entityMatch) {
          return false;
        }
      }

      return true;
    });
  }, [rawNotifications, unreadOnly, typeFilter, priorityFilter, todayOnly, notifSearch]);

  // Group filtered notifications by date
  const now = new Date();
  const todayStr = now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  const todayNotifs = useMemo(
    () => filteredNotifications.filter((n) => new Date(n.createdAt).toDateString() === todayStr),
    [filteredNotifications, todayStr],
  );
  const yesterdayNotifs = useMemo(
    () => filteredNotifications.filter((n) => new Date(n.createdAt).toDateString() === yesterdayStr),
    [filteredNotifications, yesterdayStr],
  );
  const earlierNotifs = useMemo(
    () =>
      filteredNotifications.filter(
        (n) =>
          new Date(n.createdAt).toDateString() !== todayStr &&
          new Date(n.createdAt).toDateString() !== yesterdayStr,
      ),
    [filteredNotifications, todayStr, yesterdayStr],
  );

  // Available unique actors in audit events
  const availableActors = useMemo(() => {
    const set = new Set<string>();
    rawAuditEvents.forEach((e) => {
      if (e.actorName) set.add(e.actorName);
    });
    return Array.from(set);
  }, [rawAuditEvents]);

  // Filtered Audit Events
  const filteredAuditEvents = useMemo(() => {
    const list = rawAuditEvents.filter((e) => {
      // Module / EntityType
      if (entityTypeFilter !== 'ALL' && e.entityType !== entityTypeFilter) {
        return false;
      }

      // Action
      if (actionFilter !== 'ALL' && e.action !== actionFilter) {
        return false;
      }

      // Actor
      if (actorFilter !== 'ALL' && e.actorName !== actorFilter) {
        return false;
      }

      // Date Range
      if (dateRange !== 'ALL') {
        const eventDate = new Date(e.timestamp);
        const diffMs = now.getTime() - eventDate.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        if (dateRange === 'TODAY' && eventDate.toDateString() !== todayStr) {
          return false;
        }
        if (dateRange === '7D' && diffDays > 7) {
          return false;
        }
        if (dateRange === '30D' && diffDays > 30) {
          return false;
        }
      }

      // Search Query
      if (activitySearch.trim().length > 0) {
        const q = activitySearch.toLowerCase();
        const titleMatch = e.entityTitle.toLowerCase().includes(q);
        const summaryMatch = e.changeSummary.toLowerCase().includes(q);
        const actorMatch = e.actorName.toLowerCase().includes(q);
        const reasonMatch = e.reason ? e.reason.toLowerCase().includes(q) : false;
        if (!titleMatch && !summaryMatch && !actorMatch && !reasonMatch) {
          return false;
        }
      }

      return true;
    });

    return list.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return sortDirection === 'newest' ? timeB - timeA : timeA - timeB;
    });
  }, [
    rawAuditEvents,
    entityTypeFilter,
    actionFilter,
    actorFilter,
    dateRange,
    activitySearch,
    sortDirection,
    now,
    todayStr,
  ]);

  const handleResetNotifFilters = () => {
    setNotifSearch('');
    setUnreadOnly(false);
    setTypeFilter('ALL');
    setPriorityFilter('ALL');
    setTodayOnly(false);
  };

  const handleResetActivityFilters = () => {
    setActivitySearch('');
    setEntityTypeFilter('ALL');
    setActionFilter('ALL');
    setActorFilter('ALL');
    setDateRange('ALL');
    setSortDirection('newest');
  };

  const handleRefreshAll = () => {
    refetchNotifications();
    refetchAudit();
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
    queryClient.invalidateQueries({ queryKey: ['audit-events'] });
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-5 pb-16">
      {/* 1. Page Header */}
      <NotificationsHeader
        unreadCount={unreadCount}
        onMarkAllRead={() => markAllReadMutation.mutate()}
        onRefresh={handleRefreshAll}
        isRefreshing={isNotifsFetching || isAuditFetching}
      />

      {/* 2. Primary Navigation Tabs: Notifications vs Activity */}
      <div className="flex items-center gap-2 border-b border-border pb-px">
        <button
          type="button"
          aria-label="My Notifications"
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 -mb-px min-h-[42px] transition-none cursor-pointer ${
            activeTab === 'notifications'
              ? 'border-brand-teal text-primary font-bold'
              : 'border-transparent text-secondary hover:text-primary'
          }`}
        >
          <Bell size={15} />
          <span>Notifications</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-brand-teal text-white">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          type="button"
          aria-label="Workspace Activity & Audit Timeline"
          onClick={() => setActiveTab('activity')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 -mb-px min-h-[42px] transition-none cursor-pointer ${
            activeTab === 'activity'
              ? 'border-brand-teal text-primary font-bold'
              : 'border-transparent text-secondary hover:text-primary'
          }`}
        >
          <Clock size={15} />
          <span>Activity</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-muted text-secondary border border-border">
            {rawAuditEvents.length}
          </span>
        </button>
      </div>

      {/* 3. Tab Content Area */}
      {activeTab === 'notifications' ? (
        <div className="space-y-4">
          {/* A. Compact Notifications KPI Cards */}
          <NotificationsSummaryCards
            notifications={rawNotifications}
            onFilterSelect={({ unreadOnly: unread, priority, todayOnly: today }) => {
              if (unread !== undefined) setUnreadOnly(unread);
              if (priority !== undefined) setPriorityFilter(priority);
              if (today !== undefined) setTodayOnly(today);
            }}
          />

          {/* B. Multi-Filter & Search Toolbar */}
          <NotificationFilters
            unreadOnly={unreadOnly}
            onUnreadOnlyChange={setUnreadOnly}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            onMarkAllRead={() => markAllReadMutation.mutate()}
            unreadCount={unreadCount}
            searchQuery={notifSearch}
            onSearchChange={setNotifSearch}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={setPriorityFilter}
            onResetFilters={handleResetNotifFilters}
            totalCount={rawNotifications.length}
            filteredCount={filteredNotifications.length}
          />

          {/* C. Notifications List */}
          {isNotifsLoading ? (
            <div className="p-12 text-center text-xs text-secondary bg-surface border border-border rounded-lg">
              Loading notifications...
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-12 text-center text-xs text-secondary bg-surface border border-border rounded-lg">
              No notifications matching the selected filter.
            </div>
          ) : (
            <div className="space-y-6">
              {/* Today Section */}
              {todayNotifs.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                      Today
                    </span>
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-[11px] text-tertiary">
                      {todayNotifs.length} event{todayNotifs.length === 1 ? '' : 's'}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {todayNotifs.map((n) => (
                      <NotificationCard
                        key={n.id}
                        notification={n}
                        onToggleRead={(id, isRead) => markReadMutation.mutate({ id, isRead })}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Yesterday Section */}
              {yesterdayNotifs.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                      Yesterday
                    </span>
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-[11px] text-tertiary">
                      {yesterdayNotifs.length} event{yesterdayNotifs.length === 1 ? '' : 's'}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {yesterdayNotifs.map((n) => (
                      <NotificationCard
                        key={n.id}
                        notification={n}
                        onToggleRead={(id, isRead) => markReadMutation.mutate({ id, isRead })}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Earlier Section */}
              {earlierNotifs.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                      Earlier
                    </span>
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-[11px] text-tertiary">
                      {earlierNotifs.length} event{earlierNotifs.length === 1 ? '' : 's'}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {earlierNotifs.map((n) => (
                      <NotificationCard
                        key={n.id}
                        notification={n}
                        onToggleRead={(id, isRead) => markReadMutation.mutate({ id, isRead })}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Activity Tab */
        <div className="space-y-4">
          {/* A. Compact Activity KPI Cards */}
          <ActivitySummaryCards
            events={rawAuditEvents}
            onFilterSelect={({ dateRange: dr, entityType: et }) => {
              if (dr) setDateRange(dr);
              if (et) setEntityTypeFilter(et);
            }}
          />

          {/* B. Activity Multi-Filter & Search Toolbar */}
          <ActivityFiltersToolbar
            searchQuery={activitySearch}
            onSearchChange={setActivitySearch}
            entityTypeFilter={entityTypeFilter}
            onEntityTypeFilterChange={setEntityTypeFilter}
            actionFilter={actionFilter}
            onActionFilterChange={setActionFilter}
            actorFilter={actorFilter}
            onActorFilterChange={setActorFilter}
            availableActors={availableActors}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            sortDirection={sortDirection}
            onSortDirectionChange={setSortDirection}
            onResetFilters={handleResetActivityFilters}
            totalCount={rawAuditEvents.length}
            filteredCount={filteredAuditEvents.length}
          />

          {/* C. Chronological Audit Timeline Feed */}
          <AuditTimelineFeed
            events={filteredAuditEvents}
            isLoading={isAuditLoading}
          />
        </div>
      )}
    </div>
  );
}
export default NotificationsPage;
