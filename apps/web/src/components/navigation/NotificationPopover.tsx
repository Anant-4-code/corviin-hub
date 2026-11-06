import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, ArrowRight, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '@/lib/store';
import {
  fetchNotifications,
  fetchUnreadCount,
  markAllNotificationsRead,
} from '@/services/notifications';

export const NotificationPopover: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);
  const selectedProfileId = useAppStore((s) => s.selectedProfileId);

  const activeWorkspaceId = selectedWorkspaceId || 'ws-tech-0001-0000-000000000001';
  const activeProfileId = selectedProfileId || 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

  // Unread count
  const { data: unreadData } = useQuery({
    queryKey: ['notifications', 'unread-count', activeWorkspaceId, activeProfileId],
    queryFn: () => fetchUnreadCount(activeWorkspaceId, activeProfileId),
    refetchInterval: (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') || import.meta.env.MODE === 'test' ? false : 30000,
  });

  // Recent 5 notifications
  const { data: recentNotifications = [] } = useQuery({
    queryKey: ['notifications', 'recent', activeWorkspaceId, activeProfileId],
    queryFn: () => fetchNotifications(activeWorkspaceId, activeProfileId),
    enabled: isOpen,
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => markAllNotificationsRead(activeWorkspaceId, activeProfileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const unreadCount = unreadData?.count || 0;

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-2 rounded-control hover:bg-surface-muted text-ch-text-secondary relative min-h-[38px] min-w-[38px] flex items-center justify-center"
        aria-label="Notifications"
        title="Notifications"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-brand-teal text-white leading-tight">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown (Strictly Zero Animation) */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-lg bg-surface border border-border shadow-2xl z-50 overflow-hidden">
          <div className="p-3 border-b border-border flex items-center justify-between bg-surface-muted">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-primary">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-brand-teal text-white">
                  {unreadCount} unread
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => markAllReadMutation.mutate()}
                  className="p-1 rounded text-secondary hover:text-primary text-[11px] flex items-center gap-1"
                  title="Mark all as read"
                >
                  <CheckCheck size={13} className="text-brand-teal" />
                  <span>Mark all read</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded text-secondary hover:text-primary"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-border">
            {recentNotifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-secondary">
                No recent notifications.
              </div>
            ) : (
              recentNotifications.slice(0, 5).map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    setIsOpen(false);
                    navigate(n.actionDestination);
                  }}
                  className={`p-3 text-xs cursor-pointer hover:bg-surface-muted flex items-start gap-2.5 ${
                    !n.isRead ? 'bg-brand-teal/5 font-medium' : ''
                  }`}
                >
                  {!n.isRead && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-teal mt-1.5 shrink-0" />
                  )}
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="text-xs font-semibold text-primary truncate">{n.title}</div>
                    <div className="text-[11px] text-secondary line-clamp-2">{n.message}</div>
                    <div className="text-[10px] text-tertiary">
                      {new Date(n.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2 border-t border-border bg-surface-muted text-center">
            <Link
              to="/app/notifications"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-teal hover:underline py-1"
            >
              <span>View all notifications & audit timeline</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

