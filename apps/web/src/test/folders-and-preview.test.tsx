import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FolderTreeView } from '../features/assets/components/FolderTreeView';
import { FolderBreadcrumbs } from '../features/assets/components/FolderBreadcrumbs';
import { UniversalAssetPreview } from '../features/assets/components/UniversalAssetPreview';
import { CreateFolderDialog } from '../features/assets/components/CreateFolderDialog';
import { MoveAssetDialog } from '../features/assets/components/MoveAssetDialog';
import { AssetItem, AssetFolderItem, AssetCategory, AssetTypeGroup } from '@corviin-hub/shared';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const mockFolders: AssetFolderItem[] = [
  {
    id: 'fld-meetings',
    workspaceId: 'ws-tech-0001-0000-000000000001',
    name: 'Meetings',
    description: 'Meeting notes',
    parentFolderId: null,
    subfolderCount: 1,
    createdBy: 'usr-1',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'fld-meeting-docs',
    workspaceId: 'ws-tech-0001-0000-000000000001',
    name: 'Meeting Documents',
    description: 'Decks and briefs',
    parentFolderId: 'fld-meetings',
    subfolderCount: 0,
    createdBy: 'usr-1',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

const mockAsset: AssetItem = {
  id: 'ast-img-001',
  workspaceId: 'ws-tech-0001-0000-000000000001',
  title: 'Corviin Brand Hero',
  originalFileName: 'brand-hero.png',
  sizeBytes: 1048576,
  mimeType: 'image/png',
  storageProvider: 'r2',
  category: AssetCategory.IMAGES,
  typeGroup: AssetTypeGroup.IMAGE,
  folderId: 'fld-meetings',
  folderName: 'Meetings',
  storageKey: 'assets/ws-tech/brand-hero.png',
  currentVersionNumber: 1,
  uploaderId: 'usr-1',
  uploaderName: 'Anant',
  tags: [],
  versions: [],
  relationships: [],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('Enhanced Assets: Folder Management & Universal File Preview', () => {
  it('FolderTreeView renders folders and allows selecting folder', () => {
    const onSelect = vi.fn();
    render(
      <FolderTreeView
        folders={mockFolders}
        selectedFolderId={null}
        selectedViewMode="all"
        onSelectFolder={onSelect}
        onSelectViewMode={vi.fn()}
        onCreateFolder={vi.fn()}
        onRenameFolder={vi.fn()}
        onMoveFolder={vi.fn()}
        onDeleteFolder={vi.fn()}
      />
    );

    expect(screen.getByText('Meetings')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Meetings'));
    expect(onSelect).toHaveBeenCalledWith('fld-meetings');
  });

  it('FolderBreadcrumbs renders path and allows navigation', () => {
    const onNavigate = vi.fn();
    render(
      <FolderBreadcrumbs
        breadcrumbs={[
          { id: 'fld-meetings', name: 'Meetings' },
          { id: 'fld-meeting-docs', name: 'Meeting Documents' },
        ]}
        onNavigate={onNavigate}
        directFileCount={5}
      />
    );

    expect(screen.getByText('Assets')).toBeInTheDocument();
    expect(screen.getByText('Meetings')).toBeInTheDocument();
    expect(screen.getByText('Meeting Documents')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Assets'));
    expect(onNavigate).toHaveBeenCalledWith(null);
  });

  it('CreateFolderDialog validates folder name and submits', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <CreateFolderDialog
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={onSubmit}
        folders={mockFolders}
      />
    );

    const input = screen.getByPlaceholderText(/e\.g\. Q4 Campaigns/i);
    fireEvent.change(input, { target: { value: 'New Test Folder' } });

    const submitBtn = screen.getByRole('button', { name: /Create Folder/i });
    fireEvent.click(submitBtn);

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'New Test Folder' })
    );
  });

  it('MoveAssetDialog allows moving asset to destination folder', async () => {
    const onMove = vi.fn().mockResolvedValue(undefined);
    render(
      <MoveAssetDialog
        isOpen={true}
        onClose={vi.fn()}
        assets={[mockAsset]}
        folders={mockFolders}
        onMove={onMove}
      />
    );

    expect(screen.getByText(/Move File: "Corviin Brand Hero"/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Confirm Move/i })).toBeInTheDocument();
  });

  it('UniversalAssetPreview renders image viewer controls and file metadata', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <UniversalAssetPreview
            isOpen={true}
            onClose={vi.fn()}
            asset={mockAsset}
            workspaceId="ws-tech-0001-0000-000000000001"
          />
        </BrowserRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText('Corviin Brand Hero')).toBeInTheDocument();
    expect(screen.getByText(/image\/png/i)).toBeInTheDocument();
    expect(screen.getByText(/Anant/i)).toBeInTheDocument();
  });
});
