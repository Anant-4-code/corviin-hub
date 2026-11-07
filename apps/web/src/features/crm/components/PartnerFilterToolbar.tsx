import React from 'react';
import {
  RealEstatePartnerType,
  RealEstatePartnerStage,
  PartnerCrmFilterDto,
} from '@corviin-hub/shared';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import {
  PARTNER_TYPE_LABELS,
  PARTNER_STAGE_LABELS,
  PARTNER_STAGE_ORDER,
  PARTNER_ALTERNATIVE_STAGES,
} from './partner-crm-constants';

interface PartnerFilterToolbarProps {
  filter: PartnerCrmFilterDto;
  onFilterChange: (newFilter: PartnerCrmFilterDto) => void;
  viewMode: 'table' | 'board';
  onViewModeChange: (mode: 'table' | 'board') => void;
  onOpenCreate: () => void;
  members: Array<{ id: string; name: string }>;
  totalCount?: number;
  filteredCount?: number;
}

export const PartnerFilterToolbar: React.FC<PartnerFilterToolbarProps> = ({
  filter,
  onFilterChange,
  viewMode,
  onViewModeChange,
  onOpenCreate,
  members,
  totalCount,
  filteredCount,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filter, search: e.target.value, page: 1 });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filter,
      partnerType: e.target.value ? (e.target.value as RealEstatePartnerType) : undefined,
      page: 1,
    });
  };

  const handleStageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filter,
      stage: e.target.value ? (e.target.value as RealEstatePartnerStage) : undefined,
      page: 1,
    });
  };

  const handleMemberChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filter,
      assignedMemberId: e.target.value || undefined,
      page: 1,
    });
  };

  const handleFollowUpChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filter,
      followUpDue: (e.target.value as any) || undefined,
      page: 1,
    });
  };

  const handleClearFilters = () => {
    onFilterChange({
      search: '',
      partnerType: undefined,
      stage: undefined,
      assignedMemberId: undefined,
      location: undefined,
      followUpDue: 'ALL',
      page: 1,
    });
  };

  const hasActiveFilters = Boolean(
    filter.search ||
      filter.partnerType ||
      filter.stage ||
      filter.assignedMemberId ||
      filter.location ||
      (filter.followUpDue && filter.followUpDue !== 'ALL'),
  );

  return (
    <div className="bg-surface border border-ch-border rounded-lg p-3 space-y-3 mb-4">
      {/* Top Bar: Search, View Mode, Result Count, Primary Action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Input
            placeholder="Search partners by name, contact, phone, location, project..."
            value={filter.search || ''}
            onChange={handleSearchChange}
            className="w-full text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Result Count Indicator */}
          {typeof filteredCount === 'number' && (
            <span className="text-xs text-ch-text-secondary hidden md:inline-block">
              Showing <strong>{filteredCount}</strong>
              {typeof totalCount === 'number' && totalCount !== filteredCount
                ? ` of ${totalCount}`
                : ''}{' '}
              partners
            </span>
          )}

          {/* View Mode Toggle */}
          <div className="flex rounded-md border border-ch-border bg-ch-bg p-0.5" role="group">
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-none ${
                viewMode === 'table'
                  ? 'bg-surface text-ch-text-primary shadow-sm font-semibold'
                  : 'text-ch-text-secondary hover:text-ch-text-primary'
              }`}
            >
              Table View
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('board')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-none ${
                viewMode === 'board'
                  ? 'bg-surface text-ch-text-primary shadow-sm font-semibold'
                  : 'text-ch-text-secondary hover:text-ch-text-primary'
              }`}
            >
              Pipeline Board
            </button>
          </div>

          <Button onClick={onOpenCreate} variant="primary" className="whitespace-nowrap text-xs">
            + Add Partner
          </Button>
        </div>
      </div>

      {/* Filter Row: Category, Stage, Member, Follow-up */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-ch-border">
        {/* Partner Type / Category */}
        <div className="w-full sm:w-auto">
          <Select
            value={filter.partnerType || ''}
            onChange={handleTypeChange}
            className="text-xs py-1.5 min-w-[150px]"
          >
            <option value="">All Partner Types</option>
            {Object.values(RealEstatePartnerType).map((t) => (
              <option key={t} value={t}>
                {PARTNER_TYPE_LABELS[t]}
              </option>
            ))}
          </Select>
        </div>

        {/* Stage */}
        <div className="w-full sm:w-auto">
          <Select
            value={filter.stage || ''}
            onChange={handleStageChange}
            className="text-xs py-1.5 min-w-[170px]"
          >
            <option value="">All Stages</option>
            <optgroup label="Active Pipeline">
              {PARTNER_STAGE_ORDER.map((st) => (
                <option key={st} value={st}>
                  {PARTNER_STAGE_LABELS[st]}
                </option>
              ))}
            </optgroup>
            <optgroup label="Alternative / Inactive">
              {PARTNER_ALTERNATIVE_STAGES.map((st) => (
                <option key={st} value={st}>
                  {PARTNER_STAGE_LABELS[st]}
                </option>
              ))}
            </optgroup>
          </Select>
        </div>

        {/* Assigned Member */}
        <div className="w-full sm:w-auto">
          <Select
            value={filter.assignedMemberId || ''}
            onChange={handleMemberChange}
            className="text-xs py-1.5 min-w-[150px]"
          >
            <option value="">All Assignees</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </Select>
        </div>

        {/* Follow-up Due */}
        <div className="w-full sm:w-auto">
          <Select
            value={filter.followUpDue || 'ALL'}
            onChange={handleFollowUpChange}
            className="text-xs py-1.5 min-w-[140px]"
          >
            <option value="ALL">All Follow-ups</option>
            <option value="OVERDUE">Overdue Follow-ups</option>
            <option value="TODAY">Due Today</option>
            <option value="THIS_WEEK">Due This Week</option>
          </Select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            onClick={handleClearFilters}
            variant="ghost"
            size="sm"
            className="text-xs text-ch-text-secondary hover:text-ch-text-primary ml-auto"
          >
            Reset Filters
          </Button>
        )}
      </div>

      {/* Active Filter Pills Indicator */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-ch-text-tertiary font-medium">Active Filters:</span>
          {filter.search && (
            <span className="inline-flex items-center gap-1 bg-ch-bg border border-ch-border px-2 py-0.5 rounded text-ch-text-primary">
              Keyword: "{filter.search}"
              <button
                type="button"
                onClick={() => onFilterChange({ ...filter, search: '', page: 1 })}
                className="hover:text-rose-500 font-bold ml-0.5"
              >
                ×
              </button>
            </span>
          )}
          {filter.partnerType && (
            <span className="inline-flex items-center gap-1 bg-ch-bg border border-ch-border px-2 py-0.5 rounded text-ch-text-primary">
              Category: {PARTNER_TYPE_LABELS[filter.partnerType]}
              <button
                type="button"
                onClick={() => onFilterChange({ ...filter, partnerType: undefined, page: 1 })}
                className="hover:text-rose-500 font-bold ml-0.5"
              >
                ×
              </button>
            </span>
          )}
          {filter.stage && (
            <span className="inline-flex items-center gap-1 bg-ch-bg border border-ch-border px-2 py-0.5 rounded text-ch-text-primary">
              Stage: {PARTNER_STAGE_LABELS[filter.stage]}
              <button
                type="button"
                onClick={() => onFilterChange({ ...filter, stage: undefined, page: 1 })}
                className="hover:text-rose-500 font-bold ml-0.5"
              >
                ×
              </button>
            </span>
          )}
          {filter.assignedMemberId && (
            <span className="inline-flex items-center gap-1 bg-ch-bg border border-ch-border px-2 py-0.5 rounded text-ch-text-primary">
              Assignee: {members.find((m) => m.id === filter.assignedMemberId)?.name || 'Selected'}
              <button
                type="button"
                onClick={() => onFilterChange({ ...filter, assignedMemberId: undefined, page: 1 })}
                className="hover:text-rose-500 font-bold ml-0.5"
              >
                ×
              </button>
            </span>
          )}
          {filter.followUpDue && filter.followUpDue !== 'ALL' && (
            <span className="inline-flex items-center gap-1 bg-ch-bg border border-ch-border px-2 py-0.5 rounded text-ch-text-primary">
              Follow-up: {filter.followUpDue}
              <button
                type="button"
                onClick={() => onFilterChange({ ...filter, followUpDue: 'ALL', page: 1 })}
                className="hover:text-rose-500 font-bold ml-0.5"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
