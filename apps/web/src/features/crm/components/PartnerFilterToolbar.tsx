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
}

export const PartnerFilterToolbar: React.FC<PartnerFilterToolbarProps> = ({
  filter,
  onFilterChange,
  viewMode,
  onViewModeChange,
  onOpenCreate,
  members,
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
      followUpDue: 'ALL',
      page: 1,
    });
  };

  const hasActiveFilters = Boolean(
    filter.search ||
    filter.partnerType ||
    filter.stage ||
    filter.assignedMemberId ||
    (filter.followUpDue && filter.followUpDue !== 'ALL'),
  );

  return (
    <div className="bg-surface border border-ch-border rounded-lg p-3 space-y-3 mb-4">
      {/* Top Bar: Search, View Mode, Primary Action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Input
            placeholder="Search partners by company, contact, phone, location, project..."
            value={filter.search || ''}
            onChange={handleSearchChange}
            className="w-full text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex rounded-md border border-ch-border bg-ch-bg p-0.5" role="group">
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={`px-3 py-1.5 text-xs font-medium rounded ${
                viewMode === 'table'
                  ? 'bg-surface text-ch-text-primary shadow-sm'
                  : 'text-ch-text-secondary hover:text-ch-text-primary'
              }`}
            >
              Table View
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('board')}
              className={`px-3 py-1.5 text-xs font-medium rounded ${
                viewMode === 'board'
                  ? 'bg-surface text-ch-text-primary shadow-sm'
                  : 'text-ch-text-secondary hover:text-ch-text-primary'
              }`}
            >
              Pipeline Board
            </button>
          </div>

          <Button onClick={onOpenCreate} variant="primary" className="whitespace-nowrap">
            + Add Partner
          </Button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-ch-border">
        {/* Partner Type */}
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
    </div>
  );
};
