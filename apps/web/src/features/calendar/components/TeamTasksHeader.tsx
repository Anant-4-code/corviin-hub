import React from 'react';
import { Button } from '@/components/ui/Button';
import { Calendar, Plus, Briefcase, UserCheck } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useWorkspaces } from '@/hooks/useWorkspaces';
import { useProfiles } from '@/hooks/useProfiles';

interface TeamTasksHeaderProps {
  onToday: () => void;
  onCreateTask: () => void;
}

export function TeamTasksHeader({ onToday, onCreateTask }: TeamTasksHeaderProps) {
  const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);
  const selectedProfileId = useAppStore((s) => s.selectedProfileId);

  const { data: workspaces = [] } = useWorkspaces();
  const { data: profiles = [] } = useProfiles();

  const currentWorkspace = workspaces.find((w) => w.id === selectedWorkspaceId);
  const currentProfile = profiles.find((p) => p.id === selectedProfileId);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-ch-border">
      {/* Title & Metadata */}
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-black text-ch-text-primary tracking-tight">
            Team Tasks Calendar
          </h1>

          {currentWorkspace && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-accent/10 text-accent border border-accent/20">
              <Briefcase size={11} />
              {currentWorkspace.name}
            </span>
          )}

          {currentProfile && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-surface-muted text-ch-text-secondary border border-ch-border">
              <UserCheck size={11} className="text-emerald-500" />
              Acting: {currentProfile.displayName}
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-ch-text-secondary mt-1">
          View and manage scheduled work across your workspace.
        </p>
      </div>

      {/* Primary Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={onToday}
          className="text-xs h-8 px-3 font-semibold"
        >
          Today
        </Button>

        <Button
          size="sm"
          onClick={onCreateTask}
          className="text-xs h-8 px-3 font-semibold bg-accent text-accent-foreground hover:opacity-90 flex items-center gap-1.5"
        >
          <Plus size={14} />
          <span>Create Task</span>
        </Button>
      </div>
    </div>
  );
}

