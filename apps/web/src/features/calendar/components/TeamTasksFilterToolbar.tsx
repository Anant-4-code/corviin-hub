import React from 'react';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useProfiles } from '@/hooks/useProfiles';
import { Filter, X, AlertTriangle } from 'lucide-react';
import { TaskStatus, TaskPriority } from '@corviin-hub/shared';

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
}: TeamTasksFilterToolbarProps) {
  const { data: profiles = [] } = useProfiles();

  const isAnyFilterActive =
    Boolean(selectedMemberId) ||
    Boolean(selectedStatus) ||
    Boolean(selectedPriority) ||
    Boolean(selectedLinkedType) ||
    overdueOnly;

  return (
    <div className="flex items-center gap-2 flex-wrap py-1 text-xs">
      <div className="flex items-center gap-1.5 text-ch-text-secondary font-medium mr-1">
        <Filter size={13} />
        <span>Filters:</span>
      </div>

      {/* Member Filter */}
      <Select
        value={selectedMemberId}
        onChange={(e) => onMemberChange(e.target.value)}
        aria-label="Filter by Member"
        className="text-xs h-8 py-0 min-w-[130px]"
      >
        <option value="">All Members</option>
        {profiles.map((p) => (
          <option key={p.id} value={p.id}>
            {p.displayName}
          </option>
        ))}
      </Select>

      {/* Status Filter */}
      <Select
        value={selectedStatus}
        onChange={(e) => onStatusChange(e.target.value)}
        aria-label="Filter by Status"
        className="text-xs h-8 py-0 min-w-[120px]"
      >
        <option value="">All Statuses</option>
        <option value={TaskStatus.TODO}>To Do</option>
        <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
        <option value={TaskStatus.BLOCKED}>Blocked</option>
        <option value={TaskStatus.COMPLETED}>Completed</option>
        <option value={TaskStatus.ON_HOLD}>On Hold</option>
      </Select>

      {/* Priority Filter */}
      <Select
        value={selectedPriority}
        onChange={(e) => onPriorityChange(e.target.value)}
        aria-label="Filter by Priority"
        className="text-xs h-8 py-0 min-w-[110px]"
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
        className="text-xs h-8 py-0 min-w-[130px]"
      >
        <option value="">All Modules</option>
        <option value="goal">Linked Goals</option>
        <option value="plan">Linked Plans</option>
        <option value="campaign">Linked Campaigns</option>
        <option value="crm">Linked CRM</option>
      </Select>

      {/* Overdue Only Toggle */}
      <button
        type="button"
        onClick={() => onOverdueOnlyChange(!overdueOnly)}
        className={`px-2.5 py-1 rounded border text-xs font-medium flex items-center gap-1 transition-none h-8 ${
          overdueOnly
            ? 'border-danger/40 bg-danger/10 text-danger font-semibold'
            : 'border-ch-border bg-surface text-ch-text-secondary hover:text-ch-text-primary'
        }`}
      >
        <AlertTriangle size={12} className={overdueOnly ? 'text-danger' : 'text-ch-text-muted'} />
        <span>Overdue Only</span>
      </button>

      {/* Clear Filters Button */}
      {isAnyFilterActive && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          className="text-xs h-8 px-2 text-ch-text-secondary hover:text-ch-text-primary gap-1"
        >
          <X size={12} />
          <span>Clear Filters</span>
        </Button>
      )}
    </div>
  );
}

