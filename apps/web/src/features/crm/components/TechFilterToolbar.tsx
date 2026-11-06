import { Search, Plus, Filter, RotateCcw, LayoutList, Kanban } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import {
  TechRecordCategory,
  TechPipelineStage,
  TechCrmFilterDto,
} from '@corviin-hub/shared';
import {
  TECH_CATEGORY_LABELS,
  TECH_STAGE_LABELS,
  TECH_SERVICE_TYPES,
  TECH_PIPELINE_STAGES_ORDER,
} from './tech-crm-constants';

interface MemberOption {
  id: string;
  name: string;
}

interface TechFilterToolbarProps {
  viewMode: 'table' | 'board';
  onViewModeChange: (mode: 'table' | 'board') => void;
  filters: TechCrmFilterDto;
  onFilterChange: (filters: TechCrmFilterDto) => void;
  onResetFilters: () => void;
  onOpenCreateDialog: () => void;
  members: MemberOption[];
  totalCount: number;
}

export function TechFilterToolbar({
  viewMode,
  onViewModeChange,
  filters,
  onFilterChange,
  onResetFilters,
  onOpenCreateDialog,
  members,
  totalCount,
}: TechFilterToolbarProps) {
  const hasActiveFilters = Boolean(
    filters.category ||
      filters.stage ||
      filters.assignedMemberId ||
      filters.serviceType ||
      (filters.followUpFilter && filters.followUpFilter !== 'ALL') ||
      filters.search,
  );

  return (
    <div className="space-y-2.5">
      {/* Top Action Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ch-text-muted" />
          <Input
            value={filters.search || ''}
            onChange={(e) =>
              onFilterChange({ ...filters, search: e.target.value, page: 1 })
            }
            placeholder="Search company, contact, phone, requirements..."
            className="pl-9 h-9 text-xs bg-surface"
          />
        </div>

        {/* Right Controls: View mode switcher + Create record */}
        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center border border-ch-border bg-surface p-0.5">
            <button
              onClick={() => onViewModeChange('table')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium ${
                viewMode === 'table'
                  ? 'bg-ch-accent text-white'
                  : 'text-ch-text-secondary hover:text-ch-text-primary'
              }`}
              title="Table view"
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => onViewModeChange('board')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium ${
                viewMode === 'board'
                  ? 'bg-ch-accent text-white'
                  : 'text-ch-text-secondary hover:text-ch-text-primary'
              }`}
              title="Kanban pipeline board"
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>
          </div>

          {/* New Record Button */}
          <Button
            onClick={onOpenCreateDialog}
            className="h-9 px-3 gap-1.5 text-xs font-semibold bg-ch-accent text-white hover:bg-ch-accent/90"
          >
            <Plus className="w-4 h-4" />
            <span>Add Tech Record</span>
          </Button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
        {/* Category Filter */}
        <Select
          value={filters.category || ''}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              category: (e.target.value as TechRecordCategory) || undefined,
              page: 1,
            })
          }
          className="h-8 text-xs bg-surface min-w-[150px]"
        >
          <option value="">All Categories</option>
          {Object.entries(TECH_CATEGORY_LABELS).map(([cat, label]) => (
            <option key={cat} value={cat}>
              {label}
            </option>
          ))}
        </Select>

        {/* Stage Filter */}
        <Select
          value={filters.stage || ''}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              stage: (e.target.value as TechPipelineStage) || undefined,
              page: 1,
            })
          }
          className="h-8 text-xs bg-surface min-w-[140px]"
        >
          <option value="">All Stages</option>
          {TECH_PIPELINE_STAGES_ORDER.map((stage) => (
            <option key={stage} value={stage}>
              {TECH_STAGE_LABELS[stage]}
            </option>
          ))}
        </Select>

        {/* Assigned Member Filter */}
        <Select
          value={filters.assignedMemberId || ''}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              assignedMemberId: e.target.value || undefined,
              page: 1,
            })
          }
          className="h-8 text-xs bg-surface min-w-[130px]"
        >
          <option value="">All Team Leads</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </Select>

        {/* Service Type Filter */}
        <Select
          value={filters.serviceType || ''}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              serviceType: e.target.value || undefined,
              page: 1,
            })
          }
          className="h-8 text-xs bg-surface min-w-[140px]"
        >
          <option value="">All Service Types</option>
          {TECH_SERVICE_TYPES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </Select>

        {/* Follow-up filter */}
        <Select
          value={filters.followUpFilter || 'ALL'}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              followUpFilter: e.target.value as any,
              page: 1,
            })
          }
          className="h-8 text-xs bg-surface min-w-[130px]"
        >
          <option value="ALL">All Follow-ups</option>
          <option value="TODAY">Due Today</option>
          <option value="OVERDUE">Overdue Only</option>
          <option value="THIS_WEEK">Due This Week</option>
        </Select>

        {/* Reset Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={onResetFilters}
            className="h-8 px-2 text-xs text-ch-text-secondary hover:text-ch-text-primary gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </Button>
        )}

        {/* Total records count */}
        <div className="ml-auto text-xs text-ch-text-muted">
          Showing <span className="font-semibold text-ch-text-primary">{totalCount}</span> records
        </div>
      </div>
    </div>
  );
}

