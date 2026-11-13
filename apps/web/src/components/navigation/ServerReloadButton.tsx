import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, AlertCircle, Server } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/cn';

export function ServerReloadButton() {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showOptions, setShowOptions] = useState(false);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setStatus('idle');

    try {
      // 1. Ping health check to wake up Render container
      const apiBase = import.meta.env.VITE_API_BASE_URL || '/api/v1';
      try {
        await fetch(`${apiBase}/health`, { method: 'GET', cache: 'no-store' });
      } catch {
        // Continue even if health check is booting
      }

      // 2. Invalidate and refetch all queries in active views
      await queryClient.invalidateQueries();
      await queryClient.refetchQueries();

      setStatus('success');
      setTimeout(() => setStatus('idle'), 2500);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3500);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleHardReload = () => {
    // Full webview/browser reload
    window.location.reload();
  };

  return (
    <div className="relative shrink-0">
      <div className="flex items-center">
        <button
          type="button"
          onClick={handleRefresh}
          onContextMenu={(e) => {
            e.preventDefault();
            setShowOptions((prev) => !prev);
          }}
          className={cn(
            'p-1.5 sm:px-2 sm:py-1.5 rounded-control text-xs font-medium flex items-center gap-1 shrink-0 transition-none border min-h-[32px] min-w-[32px] sm:min-h-[36px]',
            isRefreshing
              ? 'bg-accent/15 text-accent border-accent/40'
              : status === 'success'
              ? 'bg-success/15 text-success border-success/40'
              : status === 'error'
              ? 'bg-danger/15 text-danger border-danger/40'
              : 'bg-surface-muted text-ch-text-secondary border-ch-border hover:bg-surface hover:text-ch-text-primary',
          )}
          aria-label="Reload and reconnect with server"
          title="Tap to sync with server. Long press / right click for full app reload."
        >
          <RefreshCw
            size={15}
            className={cn('shrink-0', isRefreshing && 'animate-spin text-accent')}
          />
          <span className="hidden xl:inline text-xs">
            {isRefreshing ? 'Reconnecting…' : status === 'success' ? 'Connected' : 'Sync'}
          </span>
        </button>

        {/* Small dropdown arrow trigger for hard reload on mobile/tablet */}
        <button
          type="button"
          onClick={() => setShowOptions((prev) => !prev)}
          className="p-1 text-ch-text-muted hover:text-ch-text-primary rounded-control -ml-1 text-[10px]"
          title="More reload options"
          aria-label="More reload options"
        >
          <span className="sr-only">Reload options</span>
          ▾
        </button>
      </div>

      {/* Popover Menu for Hard Reload */}
      {showOptions && (
        <div className="absolute right-0 top-full mt-1 w-56 bg-surface-elevated border border-ch-border rounded-lg shadow-xl z-50 p-1.5 space-y-1 text-xs">
          <div className="px-2 py-1 border-b border-ch-border text-[11px] font-semibold text-ch-text-secondary flex items-center gap-1.5">
            <Server size={12} className="text-accent" />
            <span>Server Connection</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowOptions(false);
              handleRefresh();
            }}
            className="w-full text-left px-2.5 py-1.5 rounded hover:bg-surface-muted flex items-center gap-2 text-ch-text-primary"
          >
            <RefreshCw size={13} className="text-accent shrink-0" />
            <div>
              <div className="font-medium">Sync Data & Wake Server</div>
              <div className="text-[10px] text-ch-text-muted">Pings API and refetches all records</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setShowOptions(false);
              handleHardReload();
            }}
            className="w-full text-left px-2.5 py-1.5 rounded hover:bg-surface-muted flex items-center gap-2 text-ch-text-primary border-t border-ch-border/50"
          >
            <CheckCircle2 size={13} className="text-success shrink-0" />
            <div>
              <div className="font-medium">Hard Reload Entire App</div>
              <div className="text-[10px] text-ch-text-muted">Restarts webview and reconnects freshly</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
