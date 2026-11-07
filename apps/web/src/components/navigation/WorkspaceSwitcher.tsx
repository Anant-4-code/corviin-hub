import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Building2, Check } from 'lucide-react';
import { useWorkspaces } from '@/hooks/useWorkspaces';
import { useAppStore } from '@/lib/store';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/cn';

export function WorkspaceSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { data: workspaces, isLoading } = useWorkspaces();
  const { selectedWorkspaceId, setSelectedWorkspaceId } = useAppStore();
  const queryClient = useQueryClient();

  const activeWorkspace = workspaces?.find((w) => w.id === selectedWorkspaceId);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function handleSelect(id: string) {
    if (id !== selectedWorkspaceId) {
      setSelectedWorkspaceId(id);
      // Invalidate all workspace-scoped queries when switching
      queryClient.invalidateQueries();
    }
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative shrink-0 min-w-0 max-w-[115px] xs:max-w-[145px] sm:max-w-[200px]">
      <button
        onClick={() => setOpen((p) => !p)}
        className={cn(
          'w-full flex items-center gap-1 sm:gap-2 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-control border border-ch-border bg-surface text-sm',
          'hover:bg-surface-muted text-ch-text-primary',
        )}
        aria-label="Switch workspace"
        aria-expanded={open}
      >
        <Building2 size={14} className="text-accent shrink-0" />
        <span className="truncate font-medium text-xs flex-1 text-left">
          {isLoading ? 'Loading…' : (activeWorkspace?.name ?? 'Select workspace')}
        </span>
        <ChevronDown size={12} className="shrink-0 text-ch-text-muted" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-surface-elevated border border-ch-border rounded-lg shadow-lg z-50 py-1">
          {isLoading ? (
            <p className="px-3 py-2 text-sm text-ch-text-muted">Loading workspaces…</p>
          ) : (
            workspaces?.map((ws) => (
              <button
                key={ws.id}
                onClick={() => handleSelect(ws.id)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ch-text-primary hover:bg-surface-muted text-left"
              >
                <Building2 size={14} className="text-accent shrink-0" />
                <span className="flex-1 truncate">{ws.name}</span>
                {ws.id === selectedWorkspaceId && <Check size={14} className="text-accent shrink-0" />}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

