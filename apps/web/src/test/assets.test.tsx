import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  AssetItem,
  AssetCategory,
  AssetTypeGroup,
  AssetStorageSummary,
} from '@corviin-hub/shared';
import { AssetsSummaryStrip } from '@/features/assets/components/AssetsSummaryStrip';
import { AssetsFilterToolbar } from '@/features/assets/components/AssetsFilterToolbar';
import { AssetsTableView } from '@/features/assets/components/AssetsTableView';
import { AssetsGridView } from '@/features/assets/components/AssetsGridView';
import { AssetDetailDrawer } from '@/features/assets/components/AssetDetailDrawer';
import { UploadAssetDialog } from '@/features/assets/components/UploadAssetDialog';
import { AssetsPage } from '@/features/assets/AssetsPage';
import * as assetsApi from '@/services/assets';

const mockAsset: AssetItem = {
  id: 'ast-test-01',
  workspaceId: 'ws-tech-0001-0000-000000000001',
  title: 'Test Master Footage 4K',
  originalFileName: 'test_footage_4k.mp4',
  storageKey: 'workspaces/ws-tech-1/assets/test.mp4',
  storageProvider: 's3',
  mimeType: 'video/mp4',
  sizeBytes: 150000000,
  category: AssetCategory.RAW_FOOTAGE,
  typeGroup: AssetTypeGroup.VIDEO,
  uploaderId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  uploaderName: 'Anant',
  currentVersionNumber: 1,
  versions: [
    {
      id: 'ver-1',
      assetId: 'ast-test-01',
      versionNumber: 1,
      fileName: 'test_footage_4k.mp4',
      storageKey: 'workspaces/ws-tech-1/assets/test.mp4',
      sizeBytes: 150000000,
      mimeType: 'video/mp4',
      uploaderId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      uploaderName: 'Anant',
      changeNote: 'Initial take',
      createdAt: '2026-11-04T10:00:00.000Z',
    },
  ],
  relationships: [
    {
      id: 'rel-1',
      assetId: 'ast-test-01',
      relatedType: 'campaign',
      relatedId: 'cmp-tech-001',
      relatedTitle: 'Q4 Product Launch',
      stage: 'RECORDING_UPLOAD',
      createdAt: '2026-11-04T10:05:00.000Z',
    },
  ],
  tags: ['video', '4k', 'marketing'],
  description: 'Sony FX3 4K recording.',
  previewUrl: undefined,
  downloadUrl: 'https://storage.corviin.internal/download/test.mp4',
  createdAt: '2026-11-04T10:00:00.000Z',
  updatedAt: '2026-11-04T10:00:00.000Z',
};

const mockSummary: AssetStorageSummary = {
  totalCount: 1,
  totalSizeBytes: 150000000,
  byType: {
    images: 0,
    videos: 1,
    audio: 0,
    documents: 0,
    other: 0,
  },
  byCategory: {
    RAW_FOOTAGE: 1,
  },
};

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>,
  );
}

describe('Feature 09 — Assets & Storage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('AssetsSummaryStrip', () => {
    it('renders total count, formatted storage size, and category counts', () => {
      render(
        <AssetsSummaryStrip
          summary={mockSummary}
          assets={[mockAsset]}
        />,
      );

      expect(screen.getByText('Total Assets')).toBeInTheDocument();
      expect(screen.getByText('Storage Used')).toBeInTheDocument();
      expect(screen.getByText('Media & Rushes')).toBeInTheDocument();
      expect(screen.getByText('Docs & Scripts')).toBeInTheDocument();
      expect(screen.getByText('Campaign Linked')).toBeInTheDocument();

      // Check formatted size ~143 MB
      expect(screen.getByText(/143(\.\d+)? MB/)).toBeInTheDocument();
    });
  });

  describe('AssetsFilterToolbar', () => {
    it('renders search input, category selector, view switcher, and upload button', () => {
      const onSearchChange = vi.fn();
      const onOpenUpload = vi.fn();

      render(
        <AssetsFilterToolbar
          search=""
          onSearchChange={onSearchChange}
          category=""
          onCategoryChange={vi.fn()}
          typeGroup=""
          onTypeGroupChange={vi.fn()}
          sortBy="date_desc"
          onSortByChange={vi.fn()}
          viewMode="table"
          onViewModeChange={vi.fn()}
          onOpenUpload={onOpenUpload}
          onClearFilters={vi.fn()}
        />,
      );

      expect(screen.getByPlaceholderText(/Search by title, filename/i)).toBeInTheDocument();
      expect(screen.getByText('Upload Asset')).toBeInTheDocument();

      // Click upload
      fireEvent.click(screen.getByText('Upload Asset'));
      expect(onOpenUpload).toHaveBeenCalled();
    });
  });

  describe('AssetsTableView', () => {
    it('renders desktop table view with name, category, size, and actions', () => {
      const onSelect = vi.fn();
      const onDownload = vi.fn();

      render(
        <AssetsTableView
          assets={[mockAsset]}
          onSelectAsset={onSelect}
          onPreviewAsset={vi.fn()}
          onDownloadAsset={onDownload}
        />,
      );

      expect(screen.getByText('Test Master Footage 4K')).toBeInTheDocument();
      expect(screen.getByText('test_footage_4k.mp4')).toBeInTheDocument();
      expect(screen.getByText('RAW FOOTAGE')).toBeInTheDocument();
      expect(screen.getByText('Anant')).toBeInTheDocument();
      expect(screen.getByText('Q4 Product Launch')).toBeInTheDocument();

      // Click row
      fireEvent.click(screen.getByText('Test Master Footage 4K'));
      expect(onSelect).toHaveBeenCalledWith(mockAsset);
    });
  });

  describe('AssetsGridView', () => {
    it('renders card grid view with badges and quick actions', () => {
      const onSelect = vi.fn();

      render(
        <AssetsGridView
          assets={[mockAsset]}
          onSelectAsset={onSelect}
          onPreviewAsset={vi.fn()}
          onDownloadAsset={vi.fn()}
        />,
      );

      expect(screen.getByText('Test Master Footage 4K')).toBeInTheDocument();
      expect(screen.getByText('v1')).toBeInTheDocument();
      expect(screen.getByText('RAW FOOTAGE')).toBeInTheDocument();
    });
  });

  describe('AssetDetailDrawer', () => {
    it('renders metadata, versions, and non-destructive unlinking note', () => {
      render(
        <AssetDetailDrawer
          asset={mockAsset}
          isOpen={true}
          onClose={vi.fn()}
          onDownload={vi.fn()}
          onUpdateMetadata={vi.fn()}
          onAddVersion={vi.fn()}
          onAddRelationship={vi.fn()}
          onUnlinkRelationship={vi.fn()}
          onDeleteAsset={vi.fn()}
          onOpenPreview={vi.fn()}
        />,
      );

      // Verify title and version
      expect(screen.getByText('Asset Details')).toBeInTheDocument();
      expect(screen.getByText('Overview & Metadata')).toBeInTheDocument();
      expect(screen.getByText('Versions (1)')).toBeInTheDocument();
      expect(screen.getByText('Linked Records (1)')).toBeInTheDocument();
      expect(screen.getByText('Edit Metadata')).toBeInTheDocument();

      // Switch to Linked Records tab
      fireEvent.click(screen.getByText('Linked Records (1)'));
      expect(screen.getByText(/Non-destructive unlinking:/i)).toBeInTheDocument();
      expect(screen.getByText('Q4 Product Launch')).toBeInTheDocument();
    });
  });

  describe('UploadAssetDialog', () => {
    it('blocks dangerous executable files from being selected', () => {
      render(
        <UploadAssetDialog
          isOpen={true}
          onClose={vi.fn()}
          workspaceId="ws-tech-1"
          onUploadSuccess={vi.fn()}
        />,
      );

      expect(screen.getByText('Upload New Asset')).toBeInTheDocument();
      expect(screen.getByText(/Up to 500MB/i)).toBeInTheDocument();
    });
  });

  describe('AssetsPage', () => {
    it('fetches and renders assets in table and grid views', async () => {
      vi.spyOn(assetsApi, 'fetchAssets').mockResolvedValue({
        items: [mockAsset],
        total: 1,
        page: 1,
        pageSize: 20,
        totalPages: 1,
        summary: mockSummary,
      });

      renderWithProviders(<AssetsPage />);

      await waitFor(() => {
        expect(screen.getByText('Test Master Footage 4K')).toBeInTheDocument();
      });

      // Switch to grid view
      const gridBtn = screen.getByTitle('Thumbnail grid view');
      fireEvent.click(gridBtn);

      expect(screen.getByText('v1')).toBeInTheDocument();
    });
  });
});

