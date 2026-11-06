import React, { useState } from 'react';
import { TaskPriority } from '@corviin-hub/shared';
import { Button } from '@/components/ui/Button';
import { useProfiles } from '@/hooks/useProfiles';
import { UserCheck, AlertTriangle, CheckCircle2, X } from 'lucide-react';

interface BulkActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkReassign: (assigneeId: string) => Promise<void>;
  onBulkSetPriority: (priority: TaskPriority) => Promise<void>;
  onBulkComplete: () => Promise<void>;
}

export function BulkActionBar({
  selectedCount,
  onClearSelection,
  onBulkReassign,
  onBulkSetPriority,
  onBulkComplete,
}: BulkActionBarProps) {
  const { data: profiles } = useProfiles();
  const [showReassignMenu, setShowReassignMenu] = useState(false);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  if (selectedCount === 0) return null;

  const handleReassign = async (assigneeId: string) => {
    try {
      setLoadingAction('reassign');
      await onBulkReassign(assigneeId);
      setShowReassignMenu(false);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleSetPriority = async (priority: TaskPriority) => {
    try {
      setLoadingAction('priority');
      await onBulkSetPriority(priority);
      setShowPriorityMenu(false);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleComplete = async () => {
    try {
      setLoadingAction('complete');
      await onBulkComplete();
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div
      role="region"
      aria-label="Bulk actions toolbar"
      className="bg-surface border-2 border-accent text-ch-text-primary px-4 py-2.5 rounded-lg shadow-md flex flex-wrap items-center justify-between gap-3 text-xs"
    >
      <div className="flex items-center gap-2">
        <span className="font-bold text-accent bg-accent/10 px-2.5 py-0.5 rounded-full border border-accent/30 text-xs">
          {selectedCount} selected
        </span>
        <span className="text-ch-text-secondary hidden sm:inline">Apply bulk operation across selected tasks:</span>
      </div>

      <div className="flex items-center gap-2 relative">
        {/* Reassign Dropdown */}
        <div className="relative">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setShowReassignMenu(!showReassignMenu);
              setShowPriorityMenu(false);
            }}
            loading={loadingAction === 'reassign'}
            className="text-xs h-8"
          >
            <UserCheck size={13} className="mr-1" />
            Reassign
          </Button>

          {showReassignMenu && (
            <div className="absolute right-0 top-full mt-1 bg-surface border border-ch-border rounded-md shadow-lg p-1.5 z-50 min-w-[180px] space-y-1">
              <div className="text-[10px] font-semibold text-ch-text-secondary px-2 py-1 uppercase tracking-wider">
                Select Assignee
              </div>
              {(profiles || []).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleReassign(p.id)}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-surface-muted text-xs text-ch-text-primary flex items-center justify-between"
                >
                  <span>{p.displayName}</span>
                  <span className="text-[10px] text-ch-text-secondary font-mono">{p.initials}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Change Priority Dropdown */}
        <div className="relative">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setShowPriorityMenu(!showPriorityMenu);
              setShowReassignMenu(false);
            }}
            loading={loadingAction === 'priority'}
            className="text-xs h-8"
          >
            <AlertTriangle size={13} className="mr-1" />
            Set Priority
          </Button>

          {showPriorityMenu && (
            <div className="absolute right-0 top-full mt-1 bg-surface border border-ch-border rounded-md shadow-lg p-1.5 z-50 min-w-[150px] space-y-1">
              <div className="text-[10px] font-semibold text-ch-text-secondary px-2 py-1 uppercase tracking-wider">
                Select Priority
              </div>
              {[
                { label: 'Urgent', value: TaskPriority.URGENT, color: 'text-danger' },
                { label: 'High', value: TaskPriority.HIGH, color: 'text-warning' },
                { label: 'Medium', value: TaskPriority.MEDIUM, color: 'text-info' },
                { label: 'Low', value: TaskPriority.LOW, color: 'text-ch-text-secondary' },
              ].map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => handleSetPriority(p.value)}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-surface-muted text-xs text-ch-text-primary flex items-center gap-2"
                >
                  <span className={`w-2 h-2 rounded-full bg-current ${p.color}`} />
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Complete button */}
        <Button
          size="sm"
          variant="primary"
          onClick={handleComplete}
          loading={loadingAction === 'complete'}
          className="text-xs h-8"
        >
          <CheckCircle2 size={13} className="mr-1" />
          Mark Completed
        </Button>

        {/* Deselect button */}
        <button
          type="button"
          onClick={onClearSelection}
          className="p-1.5 rounded hover:bg-surface-muted text-ch-text-muted hover:text-ch-text-primary"
          title="Clear selection"
          aria-label="Clear selection"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}

