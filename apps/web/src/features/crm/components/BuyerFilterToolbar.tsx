import React from 'react';
import {
  RealEstateBuyerStage,
  BuyerPropertyConfiguration,
  BuyerCrmFilterDto,
} from '@corviin-hub/shared';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import {
  BUYER_STAGE_LABELS,
  BUYER_STAGE_ORDER,
  BUYER_ALTERNATIVE_STAGES,
  BUYER_CONFIGURATION_LABELS,
} from './buyer-crm-constants';

interface BuyerFilterToolbarProps {
  filters: BuyerCrmFilterDto;
  onFilterChange: (newFilters: BuyerCrmFilterDto) => void;
  viewMode: 'table' | 'board';
  onViewModeChange: (mode: 'table' | 'board') => void;
  onOpenCreate: () => void;
  members: Array<{ id: string; name: string }>;
}

export const BuyerFilterToolbar: React.FC<BuyerFilterToolbarProps> = ({
  filters,
  onFilterChange,
  viewMode,
  onViewModeChange,
  onOpenCreate,
  members,
}) => {
  const currentFilters = filters || { page: 1, pageSize: 20 };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...currentFilters, search: e.target.value, page: 1 });
  };

  const handleStageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...currentFilters,
      stage: e.target.value ? (e.target.value as RealEstateBuyerStage) : undefined,
      page: 1,
    });
  };

  const handleConfigurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...currentFilters,
      configuration: e.target.value ? (e.target.value as BuyerPropertyConfiguration) : undefined,
      page: 1,
    });
  };

  const handleMemberChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...currentFilters,
      assignedMemberId: e.target.value || undefined,
      page: 1,
    });
  };

  const handleFollowUpChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...currentFilters,
      followUpDue: (e.target.value as any) || undefined,
      page: 1,
    });
  };

  const handleClearFilters = () => {
    onFilterChange({
      search: '',
      stage: undefined,
      configuration: undefined,
      assignedMemberId: undefined,
      followUpDue: 'ALL',
      page: 1,
    });
  };

  const hasActiveFilters = Boolean(
    currentFilters.search ||
    currentFilters.stage ||
    currentFilters.configuration ||
    currentFilters.assignedMemberId ||
    (currentFilters.followUpDue && currentFilters.followUpDue !== 'ALL'),
  );

  return (
    <div className="bg-surface border border-ch-border rounded-lg p-3 space-y-3 mb-4">
      {/* Top Row: Search, View Mode, Action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Input
            placeholder="Search buyers by name, phone, locality, preferred project..."
            value={currentFilters.search || ''}
            onChange={handleSearchChange}
            className="w-full text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Switcher */}
          <div className="flex rounded-md border border-ch-border bg-ch-bg p-0.5" role="group">
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              title="Table View"
              className={`px-3 py-1.5 text-xs font-medium rounded ${viewMode === 'table'
                  ? 'bg-surface text-ch-text-primary shadow-sm'
                  : 'text-ch-text-secondary hover:text-ch-text-primary'
                }`}
            >
              Table View
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('board')}
              title="Board View"
              className={`px-3 py-1.5 text-xs font-medium rounded ${viewMode === 'board'
                  ? 'bg-surface text-ch-text-primary shadow-sm'
                  : 'text-ch-text-secondary hover:text-ch-text-primary'
                }`}
            >
              Pipeline Board
            </button>
          </div>

          <Button onClick={onOpenCreate} variant="primary" className="whitespace-nowrap">
            + Add Buyer
          </Button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-ch-border">
        {/* Stage */}
        <div className="w-full sm:w-auto">
          <Select
            value={currentFilters.stage || ''}
            onChange={handleStageChange}
            className="text-xs py-1.5 min-w-[160px]"
          >
            <option value="">All Pipeline Stages</option>
            <optgroup label="Active Progression">
              {BUYER_STAGE_ORDER.map((st) => (
                <option key={st} value={st}>
                  {BUYER_STAGE_LABELS[st]}
                </option>
              ))}
            </optgroup>
            <optgroup label="Alternative / Inactive">
              {BUYER_ALTERNATIVE_STAGES.map((st) => (
                <option key={st} value={st}>
                  {BUYER_STAGE_LABELS[st]}
                </option>
              ))}
            </optgroup>
          </Select>
        </div>

        {/* Configuration */}
        <div className="w-full sm:w-auto">
          <Select
            value={currentFilters.configuration || ''}
            onChange={handleConfigurationChange}
            className="text-xs py-1.5 min-w-[150px]"
          >
            <option value="">All Configurations</option>
            {Object.values(BuyerPropertyConfiguration).map((cfg) => (
              <option key={cfg} value={cfg}>
                {BUYER_CONFIGURATION_LABELS[cfg]}
              </option>
            ))}
          </Select>
        </div>

        {/* Assigned Member */}
        <div className="w-full sm:w-auto">
          <Select
            value={currentFilters.assignedMemberId || ''}
            onChange={handleMemberChange}
            className="text-xs py-1.5 min-w-[150px]"
          >
            <option value="">All Sales Members</option>
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
            value={currentFilters.followUpDue || 'ALL'}
            onChange={handleFollowUpChange}
            className="text-xs py-1.5 min-w-[140px]"
          >
            <option value="ALL">All Follow-ups</option>
            <option value="OVERDUE">Overdue Follow-ups</option>
            <option value="TODAY">Due Today</option>
            <option value="THIS_WEEK">Due This Week</option>
          </Select>
        </div>

        {/* Reset Filters */}
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
