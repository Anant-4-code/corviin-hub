import { AssetCategory, AssetTypeGroup } from '@corviin-hub/shared';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { Select } from '@/components/ui/Select';
import { LayoutGrid, List, Upload, X } from 'lucide-react';

interface AssetsFilterToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  typeGroup: string;
  onTypeGroupChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  viewMode: 'table' | 'grid';
  onViewModeChange: (mode: 'table' | 'grid') => void;
  onOpenUpload: () => void;
  onClearFilters: () => void;
}

export function AssetsFilterToolbar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  typeGroup,
  onTypeGroupChange,
  sortBy,
  onSortByChange,
  viewMode,
  onViewModeChange,
  onOpenUpload,
  onClearFilters,
}: AssetsFilterToolbarProps) {
  const isFiltered = Boolean(search || category || typeGroup || sortBy !== 'date_desc');

  return (
    <div className="flex flex-col gap-3 p-3 bg-surface border border-ch-border">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="w-full md:w-72">
          <SearchInput
            placeholder="Search by title, filename, tag..."
            value={search}
            onChange={onSearchChange}
            className="w-full"
          />
        </div>

        {/* Action Controls & View Switcher */}
        <div className="flex items-center gap-2 justify-between md:justify-end">
          {/* View Mode Toggle */}
          <div className="flex items-center border border-ch-border p-0.5 rounded-card bg-surface-hover">
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 rounded text-xs font-medium ${
                viewMode === 'table'
                  ? 'bg-surface text-ch-text-primary shadow-xs'
                  : 'text-ch-text-muted hover:text-ch-text-primary'
              }`}
              title="Table view"
              aria-label="Table view"
            >
              <List size={16} />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded text-xs font-medium ${
                viewMode === 'grid'
                  ? 'bg-surface text-ch-text-primary shadow-xs'
                  : 'text-ch-text-muted hover:text-ch-text-primary'
              }`}
              title="Thumbnail grid view"
              aria-label="Thumbnail grid view"
            >
              <LayoutGrid size={16} />
            </button>
          </div>

          {/* Upload Button */}
          <Button variant="primary" size="sm" onClick={onOpenUpload} className="shrink-0 gap-1.5">
            <Upload size={14} />
            <span>Upload Asset</span>
          </Button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-ch-border/50">
        {/* Category Dropdown */}
        <div className="w-40 sm:w-48">
          <Select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            options={[
              { value: '', label: 'All Categories' },
              { value: AssetCategory.RAW_FOOTAGE, label: 'Raw Footage' },
              { value: AssetCategory.SCRIPTS, label: 'Scripts & Copy' },
              { value: AssetCategory.IMAGES, label: 'Images & Posters' },
              { value: AssetCategory.REFERENCES, label: 'References & Research' },
              { value: AssetCategory.AUDIO_VO, label: 'Audio & Voice-over' },
              { value: AssetCategory.DRAFT_EDITS, label: 'Draft Edits' },
              { value: AssetCategory.FINAL_APPROVED, label: 'Final Approved' },
              { value: AssetCategory.PUBLISHED_PROOF, label: 'Published Proof' },
              { value: AssetCategory.CONTRACTS_DOCS, label: 'Contracts & Docs' },
              { value: AssetCategory.OTHER, label: 'Other Assets' },
            ]}
          />
        </div>

        {/* File Type Dropdown */}
        <div className="w-36 sm:w-40">
          <Select
            value={typeGroup}
            onChange={(e) => onTypeGroupChange(e.target.value)}
            options={[
              { value: '', label: 'All File Types' },
              { value: AssetTypeGroup.IMAGE, label: 'Images' },
              { value: AssetTypeGroup.VIDEO, label: 'Videos' },
              { value: AssetTypeGroup.AUDIO, label: 'Audio' },
              { value: AssetTypeGroup.DOCUMENT, label: 'Documents & PDFs' },
              { value: AssetTypeGroup.OTHER, label: 'Other Types' },
            ]}
          />
        </div>

        {/* Sort Dropdown */}
        <div className="w-40 sm:w-44">
          <Select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            options={[
              { value: 'date_desc', label: 'Date: Newest First' },
              { value: 'date_asc', label: 'Date: Oldest First' },
              { value: 'name_asc', label: 'Name: A → Z' },
              { value: 'name_desc', label: 'Name: Z → A' },
              { value: 'size_desc', label: 'Size: Largest First' },
              { value: 'size_asc', label: 'Size: Smallest First' },
            ]}
          />
        </div>

        {/* Clear Filters */}
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-xs text-ch-text-secondary hover:text-ch-text-primary gap-1 ml-auto"
          >
            <X size={12} />
            <span>Reset Filters</span>
          </Button>
        )}
      </div>
    </div>
  );
}
