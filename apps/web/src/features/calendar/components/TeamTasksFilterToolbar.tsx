import React from 'react';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useProfiles } from '@/hooks/useProfiles';
import { Filter, X, AlertTriangle, Ban, CheckCircle2, UserX } from 'lucide-react';
import { TaskStatus, TaskPriority } from '@corviin-hub/shared';
import { cn } from '@/lib/cn';

interface TeamTasksFilterToolbarProps {
  selectedMemberId: string;
  onMemberChange: (val: string) => void;
  selectedStatus: string;
  onStatusChange: (val: string) => void;
  selectedPriority: string;
  onPriorityChange: (val: string) => void;
  selectedLinkedType: string;
  onLinkedTypeChange: (val: string) => void;
  overdueOnly: boolean;
  onOverdueOnlyChange: (val: boolean) => void;
  onClearFilters: () => void;
  blockedOnly?: boolean;
  onBlockedOnlyChange?: (val: boolean) => void;
  completedOnly?: boolean;
  onCompletedOnlyChange?: (val: boolean) => void;
  unassignedOnly?: boolean;
  onUnassignedOnlyChange?: (val: boolean) => void;
  totalCount?: number;
  filteredCount?: number;
}

export function TeamTasksFilterToolbar({
  selectedMemberId,
  onMemberChange,
  selectedStatus,
  onStatusChange,
  selectedPriority,
  onPriorityChange,
  selectedLinkedType,
  onLinkedTypeChange,
  overdueOnly,
  onOverdueOnlyChange,
  onClearFilters,
  blockedOnly = false,
  onBlockedOnlyChange,
  completedOnly = false,
  onCompletedOnlyChange,
  unassignedOnly = false,
  onUnassignedOnlyChange,
  totalCount,
  filteredCount,
}: TeamTasksFilterToolbarProps) {
  const { data: profiles = [] } = useProfiles();

  const isAnyFilterActive =
    Boolean(selectedMemberId) ||
    Boolean(selectedStatus) ||
    Boolean(selectedPriority) ||
    Boolean(selectedLinkedType) ||
    overdueOnly ||
    blockedOnly ||
    completedOnly ||
    unassignedOnly;

  return (
    <div className="bg-surface border border-ch-border rounded-card p-3 space-y-3">
      {/* Controls Row */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <div className="flex items-center gap-1.5 text-ch-text-secondary font-semibold mr-1">
          <Filter size={13} className="text-accent" />
          <span>Filters:</span>
        </div>

        {/* Member Filter */}
        <Select
          value={selectedMemberId}
          onChange={(e) => onMemberChange(e.target.value)}
          aria-label="Filter by Member"
          className="text-xs h-8 py-0 min-w-[140px]"
        >
          <option value="">All Members</option>
          {profiles.map((p) => (
            <option key={p.id} value={p.id}>
              {p.displayName}
            </option>
          ))}
          <option value="unassigned">Unassigned Only</option>
        </Select>

        {/* Status Filter */}
        <Select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          aria-label="Filter by Status"
          className="text-xs h-8 py-0 min-w-[130px]"
        >
          <option value="">All Statuses</option>
          <option value={TaskStatus.TODO}>To Do</option>
          <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
          <option value={TaskStatus.BLOCKED}>Blocked</option>
          <option value={TaskStatus.COMPLETED}>Completed</option>
          <option value={TaskStatus.ON_HOLD}>On Hold</option>
          <option value={TaskStatus.CANCELLED}>Cancelled</option>
        </Select>

        {/* Priority Filter */}
        <Select
          value={selectedPriority}
          onChange={(e) => onPriorityChange(e.target.value)}
          aria-label="Filter by Priority"
          className="text-xs h-8 py-0 min-w-[120px]"
        >
          <option value="">All Priorities</option>
          <option value={TaskPriority.URGENT}>Urgent</option>
          <option value={TaskPriority.HIGH}>High</option>
          <option value={TaskPriority.MEDIUM}>Medium</option>
          <option value={TaskPriority.LOW}>Low</option>
        </Select>

        {/* Linked Record Filter */}
        <Select
          value={selectedLinkedType}
          onChange={(e) => onLinkedTypeChange(e.target.value)}
          aria-label="Filter by Linked Record"
          className="text-xs h-8 py-0 min-w-[140px]"
        >
          <option value="">All Linked Entities</option>
          <option value="project">Project</option>
          <option value="campaign">Campaign</option>
          <option value="goal">Goal</option>
          <option value="milestone">Milestone</option>
          <option value="crm">CRM Lead / Buyer</option>
        </Select>

        {/* Quick Overdue Toggle Button */}
        <button
          type="button"
          onClick={() => onOverdueOnlyChange(!overdueOnly)}
          className={cn(
            'h-8 px-2.5 rounded border text-xs font-semibold flex items-center gap-1.5 transition-none',
            overdueOnly
              ? 'bg-danger text-white border-danger shadow-sm'
              : 'border-ch-border bg-canvas text-ch-text-secondary hover:text-danger hover:border-danger/40',
          )}
        >
          <AlertTriangle size={12} />
          <span>Overdue</span>
        </button>

        {/* Quick Blocked Toggle Button */}
        {onBlockedOnlyChange && (
          <button
            type="button"
            onClick={() => onBlockedOnlyChange(!blockedOnly)}
            className={cn(
              'h-8 px-2.5 rounded border text-xs font-semibold flex items-center gap-1.5 transition-none',
              blockedOnly
                ? 'bg-red-600 text-white border-red-600 shadow-sm'
                : 'border-ch-border bg-canvas text-ch-text-secondary hover:text-red-500 hover:border-red-500/40',
            )}
          >
            <Ban size={12} />
            <span>Blocked</span>
          </button>
        )}

        {/* Quick Completed Toggle Button */}
        {onCompletedOnlyChange && (
          <button
            type="button"
            onClick={() => onCompletedOnlyChange(!completedOnly)}
            className={cn(
              'h-8 px-2.5 rounded border text-xs font-semibold flex items-center gap-1.5 transition-none',
              completedOnly
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'border-ch-border bg-canvas text-ch-text-secondary hover:text-emerald-500 hover:border-emerald-500/40',
            )}
          >
            <CheckCircle2 size={12} />
            <span>Completed</span>
          </button>
        )}

        {/* Quick Unassigned Toggle Button */}
        {onUnassignedOnlyChange && (
          <button
            type="button"
            onClick={() => onUnassignedOnlyChange(!unassignedOnly)}
            className={cn(
              'h-8 px-2.5 rounded border text-xs font-semibold flex items-center gap-1.5 transition-none',
              unassignedOnly
                ? 'bg-accent text-accent-foreground border-accent shadow-sm'
                : 'border-ch-border bg-canvas text-ch-text-secondary hover:text-ch-text-primary hover:border-ch-border-strong',
            )}
          >
            <UserX size={12} />
            <span>Unassigned</span>
          </button>
        )}

        {/* Clear Filters Button */}
        {isAnyFilterActive && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-xs h-8 px-2.5 text-ch-text-muted hover:text-ch-text-primary ml-auto"
          >
            <X size={13} className="mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filter Chips and Result Count */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-ch-border text-xs flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-ch-text-muted font-medium">Active:</span>

          {!isAnyFilterActive && (
            <span className="text-[11px] text-ch-text-muted italic">Showing all scheduled work</span>
          )}

          {selectedMemberId && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20 font-medium text-[11px]">
              Member: {profiles.find((p) => p.id === selectedMemberId)?.displayName || selectedMemberId}
              <button
                type="button"
                onClick={() => onMemberChange('')}
                className="hover:text-accent-foreground rounded-full p-0.2"
              >
                <X size={10} />
              </button>
            </span>
          )}

          {selectedStatus && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-muted text-ch-text-primary border border-ch-border font-medium text-[11px]">
              Status: {selectedStatus}
              <button
                type="button"
                onClick={() => onStatusChange('')}
                className="hover:text-danger rounded-full p-0.2"
              >
                <X size={10} />
              </button>
            </span>
          )}

          {selectedPriority && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-muted text-ch-text-primary border border-ch-border font-medium text-[11px]">
              Priority: {selectedPriority}
              <button
                type="button"
                onClick={() => onPriorityChange('')}
                className="hover:text-danger rounded-full p-0.2"
              >
                <X size={10} />
              </button>
            </span>
          )}

          {selectedLinkedType && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-muted text-ch-text-primary border border-ch-border font-medium text-[11px]">
              Entity: {selectedLinkedType}
              <button
                type="button"
                onClick={() => onLinkedTypeChange('')}
                className="hover:text-danger rounded-full p-0.2"
              >
                <X size={10} />
              </button>
            </span>
          )}

          {overdueOnly && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-danger/10 text-danger border border-danger/20 font-medium text-[11px]">
              Overdue Only
              <button
                type="button"
                onClick={() => onOverdueOnlyChange(false)}
                className="hover:text-danger rounded-full p-0.2"
              >
                <X size={10} />
              </button>
            </span>
          )}

          {blockedOnly && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 font-medium text-[11px]">
              Blocked Only
              <button
                type="button"
                onClick={() => onBlockedOnlyChange?.(false)}
                className="hover:text-red-500 rounded-full p-0.2"
              >
                <X size={10} />
              </button>
            </span>
          )}

          {completedOnly && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium text-[11px]">
              Completed Only
              <button
                type="button"
                onClick={() => onCompletedOnlyChange?.(false)}
                className="hover:text-emerald-500 rounded-full p-0.2"
              >
                <X size={10} />
              </button>
            </span>
          )}

          {unassignedOnly && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-muted text-ch-text-secondary border border-ch-border font-medium text-[11px]">
              Unassigned Only
              <button
                type="button"
                onClick={() => onUnassignedOnlyChange?.(false)}
                className="hover:text-ch-text-primary rounded-full p-0.2"
              >
                <X size={10} />
              </button>
            </span>
          )}
        </div>

        {totalCount !== undefined && filteredCount !== undefined && (
          <div className="text-[11px] font-mono font-medium text-ch-text-muted ml-auto">
            Showing <strong className="text-ch-text-primary">{filteredCount}</strong> of {totalCount} tasks
          </div>
        )}
      </div>
    </div>
  );
}
