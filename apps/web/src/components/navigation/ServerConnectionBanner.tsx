import React, { useState, useEffect } from 'react';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, RefreshCw, CheckCircle2, Wifi, Zap } from 'lucide-react';
import { useWorkspaces } from '@/hooks/useWorkspaces';
import { cn } from '@/lib/cn';

export function ServerConnectionBanner() {
  const queryClient = useQueryClient();
  const isFetchingCount = useIsFetching();
  const { isError: workspacesError, isLoading: workspacesLoading, data: workspaces } = useWorkspaces();
  const [isSlow, setIsSlow] = useState(false);
  const [manualRetrying, setManualRetrying] = useState(false);
  const [recentlyConnected, setRecentlyConnected] = useState(false);

  // Detect slow initial connection (e.g. Render cold start taking > 4.5 seconds)
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isFetchingCount > 0 && (!workspaces || workspaces.length === 0)) {
      timer = setTimeout(() => {
        setIsSlow(true);
      }, 4500);
    } else {
      if (isSlow && workspaces && workspaces.length > 0) {
        setIsSlow(false);
        setRecentlyConnected(true);
        const hideTimer = setTimeout(() => setRecentlyConnected(false), 3000);
        return () => clearTimeout(hideTimer);
      }
      setIsSlow(false);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isFetchingCount, workspaces, isSlow]);

  const handleWakeupAndRetry = async () => {
    setManualRetrying(true);
    const apiBase = import.meta.env.VITE_API_BASE_URL || '/api/v1';
    try {
      await fetch(`${apiBase}/health`, { method: 'GET', cache: 'no-store' });
    } catch {
      // Ignore initial boot fail
    }
    await queryClient.invalidateQueries();
    await queryClient.refetchQueries();
    setManualRetrying(false);
  };

  const handleHardReload = () => {
    window.location.reload();
  };

  // 1. Success confirmation after slow wake-up
  if (recentlyConnected) {
    return (
      <div className="bg-success/15 border-b border-success/30 px-3 py-1.5 flex items-center justify-between text-xs text-success shrink-0 z-30">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={14} className="shrink-0 text-success" />
          <span className="font-semibold">Connected to CORVIIN HUB Server</span>
          <span className="hidden sm:inline text-[11px] text-ch-text-secondary">
            — Backend is active and synced.
          </span>
        </div>
      </div>
    );
  }

  // 2. Slow connection / Render sleeping warning
  const shouldShowBanner = isSlow || workspacesError;
  if (!shouldShowBanner) return null;

  return (
    <div className="bg-warning/15 border-b border-warning/30 px-3 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-ch-text-primary shrink-0 z-30">
      <div className="flex items-start sm:items-center gap-2">
        <Zap size={15} className="shrink-0 text-warning mt-0.5 sm:mt-0" />
        <div>
          <span className="font-bold text-warning">Connecting to backend server…</span>{' '}
          <span className="text-ch-text-secondary text-[11px]">
            Render services sleep during inactivity and take ~30–60 seconds to cold start.
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
        <button
          type="button"
          onClick={handleWakeupAndRetry}
          disabled={manualRetrying}
          className="px-2.5 py-1 rounded-control bg-accent text-accent-foreground font-semibold text-[11px] flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50"
        >
          <RefreshCw size={12} className={cn(manualRetrying && 'animate-spin')} />
          <span>{manualRetrying ? 'Waking up…' : 'Wake Up & Retry'}</span>
        </button>

        <button
          type="button"
          onClick={handleHardReload}
          className="px-2.5 py-1 rounded-control bg-surface border border-ch-border text-ch-text-secondary hover:text-ch-text-primary text-[11px] font-medium"
        >
          Reload App
        </button>
      </div>
    </div>
  );
}
