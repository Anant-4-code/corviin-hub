import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AssetItem,
  AssetFolderItem,
  AssetCategory,
  AssetTypeGroup,
  CreateFolderDto,
  DeleteFolderStrategy,
  CreateAssetVersionDto,
  AddAssetRelationshipDto,
  UpdateAssetMetadataDto,
} from '@corviin-hub/shared';
import { useAppStore } from '@/lib/store';
import {
  fetchAssets,
  fetchAuthorizedDownload,
  updateAssetMetadata,
  addAssetVersion,
  addAssetRelationship,
  unlinkAssetRelationship,
  deleteAsset,
  moveAsset,
  bulkMoveAssets,
} from '@/services/assets';
import {
  fetchFolders,
  createFolder,
  moveFolder,
  deleteFolder,
} from '@/services/folders';
import { Button } from '@/components/ui/Button';
import { LoadingState, ErrorState } from '@/components/ui/States';
import { Pagination } from '@/components/ui/Pagination';
import { AssetsSummaryStrip } from './components/AssetsSummaryStrip';
import { AssetsFilterToolbar } from './components/AssetsFilterToolbar';
import { AssetsTableView } from './components/AssetsTableView';
import { AssetsGridView } from './components/AssetsGridView';
import { AssetDetailDrawer } from './components/AssetDetailDrawer';
import { UploadAssetDialog } from './components/UploadAssetDialog';
import { UniversalAssetPreview } from './components/UniversalAssetPreview';
import { FolderTreeView } from './components/FolderTreeView';
import { FolderBreadcrumbs } from './components/FolderBreadcrumbs';
import { CreateFolderDialog } from './components/CreateFolderDialog';
import { MoveFolderDialog } from './components/MoveFolderDialog';
import { DeleteFolderDialog } from './components/DeleteFolderDialog';
import { MoveAssetDialog } from './components/MoveAssetDialog';
import {
  HardDrive,
  Upload,
  FolderPlus,
  FolderTree,
  FolderInput,
  SlidersHorizontal,
  ChevronRight,
  Layers,
} from 'lucide-react';

export function AssetsPage() {
  const queryClient = useQueryClient();
  const workspaceId =
    useAppStore((s) => s.selectedWorkspaceId) || 'ws-tech-0001-0000-000000000001';
  const profileId = useAppStore((s) => s.selectedProfileId);

  // View & Folder Navigation States
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedViewMode, setSelectedViewMode] = useState<
    'all' | 'folders' | 'recent' | 'linked'
  >('all');
  const [includeSubfolders, setIncludeSubfolders] = useState<boolean>(true);
  const [isMobileFolderDrawerOpen, setIsMobileFolderDrawerOpen] = useState(false);

  // Filters & Pagination State
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('');
  const [typeGroup, setTypeGroup] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('date_desc');
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Multi-Selection State for Bulk File Operations
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);

  // Dialog & Modal States
  const [selectedAssetForDetail, setSelectedAssetForDetail] = useState<string | null>(null);
  const [previewAsset, setPreviewAsset] = useState<AssetItem | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [createFolderParentId, setCreateFolderParentId] = useState<string | null>(null);
  const [folderToMove, setFolderToMove] = useState<AssetFolderItem | null>(null);
  const [folderToDelete, setFolderToDelete] = useState<AssetFolderItem | null>(null);
  const [assetsToMove, setAssetsToMove] = useState<AssetItem[]>([]);

  // Parse sort
  const { field: sortField, order: sortOrder } = useMemo(() => {
    const parts = sortBy.split('_');
    return {
      field: (parts[0] || 'date') as 'date' | 'name' | 'size',
      order: (parts[1] || 'desc') as 'asc' | 'desc',
    };
  }, [sortBy]);

  // Fetch Workspace Folders
  const {
    data: folders = [],
    isLoading: isFoldersLoading,
    refetch: refetchFolders,
  } = useQuery({
    queryKey: ['folders', workspaceId],
    queryFn: () => fetchFolders(workspaceId),
    enabled: Boolean(workspaceId),
  });

  // Main Assets Query
  const {
    data: assetsData,
    isLoading: isAssetsLoading,
    isError,
    refetch: refetchAssets,
  } = useQuery({
    queryKey: [
      'assets',
      workspaceId,
      selectedViewMode,
      selectedFolderId,
      includeSubfolders,
      search,
      category,
      typeGroup,
      sortField,
      sortOrder,
      page,
      pageSize,
    ],
    queryFn: () =>
      fetchAssets(workspaceId, {
        search: search.trim() || undefined,
        category: category ? (category as AssetCategory) : undefined,
        typeGroup: typeGroup ? (typeGroup as AssetTypeGroup) : undefined,
        folderId: selectedViewMode === 'folders' || selectedFolderId ? selectedFolderId ?? undefined : undefined,
        includeSubfolders: selectedFolderId ? includeSubfolders : undefined,
        sortBy: sortField,
        sortOrder: sortOrder,
        page,
        pageSize,
      }),
    enabled: Boolean(workspaceId),
  });

  const rawAssets = assetsData?.items || [];
  const total = assetsData?.total || 0;
  const totalPages = assetsData?.totalPages || 1;
  const summary = assetsData?.summary;

  // Filter client-side if recent or linked mode is active
  const assets = useMemo(() => {
    if (selectedViewMode === 'recent') {
      return [...rawAssets].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }
    if (selectedViewMode === 'linked') {
      return rawAssets.filter((a) => a.relationships && a.relationships.length > 0);
    }
    return rawAssets;
  }, [rawAssets, selectedViewMode]);

  // Selected Asset for Legacy Detail Drawer
  const selectedAsset = useMemo(() => {
    if (!selectedAssetForDetail) return null;
    return assets.find((a) => a.id === selectedAssetForDetail) || null;
  }, [assets, selectedAssetForDetail]);

  // Active folder object
  const currentFolder = useMemo(() => {
    if (!selectedFolderId) return null;
    return folders.find((f) => f.id === selectedFolderId) || null;
  }, [folders, selectedFolderId]);

  // Compute folder breadcrumb hierarchy
  const breadcrumbsList = useMemo(() => {
    if (!selectedFolderId) return [];
    const list: { id: string; name: string }[] = [];
    let curId: string | null = selectedFolderId;
    const visited = new Set<string>();

    while (curId && !visited.has(curId)) {
      visited.add(curId);
      const f = folders.find((item) => item.id === curId);
      if (f) {
        list.unshift({ id: f.id, name: f.name });
        curId = f.parentFolderId || null;
      } else {
        break;
      }
    }
    return list;
  }, [folders, selectedFolderId]);

  // Handlers
  const handleFolderSelect = (folderId: string | null) => {
    setSelectedFolderId(folderId);
    if (folderId) {
      setSelectedViewMode('folders');
    }
    setPage(1);
    setSelectedAssetIds([]);
  };

  const handleCreateFolderSubmit = async (dto: CreateFolderDto) => {
    await createFolder(workspaceId, {
      ...dto,
      createdBy: profileId || undefined,
      createdByName: 'Acting Profile',
    });
    await queryClient.invalidateQueries({ queryKey: ['folders', workspaceId] });
    setIsCreateFolderOpen(false);
  };

  const handleMoveFolderSubmit = async (folderId: string, targetParentId: string | null) => {
    await moveFolder(workspaceId, folderId, { targetParentFolderId: targetParentId });
    await queryClient.invalidateQueries({ queryKey: ['folders', workspaceId] });
    setFolderToMove(null);
  };

  const handleDeleteFolderSubmit = async (folderId: string, strategy: DeleteFolderStrategy) => {
    await deleteFolder(workspaceId, folderId, { strategy });
    if (selectedFolderId === folderId) {
      setSelectedFolderId(null);
      setSelectedViewMode('all');
    }
    await queryClient.invalidateQueries({ queryKey: ['folders', workspaceId] });
    await queryClient.invalidateQueries({ queryKey: ['assets'] });
    setFolderToDelete(null);
  };

  const handleMoveAssetsSubmit = async (assetIds: string[], targetFolderId: string | null) => {
    if (assetIds.length === 1) {
      await moveAsset(workspaceId, assetIds[0], targetFolderId);
    } else {
      await bulkMoveAssets(workspaceId, assetIds, targetFolderId);
    }
    await queryClient.invalidateQueries({ queryKey: ['assets'] });
    setAssetsToMove([]);
    setSelectedAssetIds([]);
  };

  const handleDownload = async (asset: AssetItem, versionId?: string) => {
    try {
      const res = await fetchAuthorizedDownload(workspaceId, asset.id, versionId);
      if (res.downloadUrl) {
        window.open(res.downloadUrl, '_blank');
      }
    } catch (err: any) {
      alert(`Could not generate download link: ${err.message || 'Authorization failed'}`);
    }
  };

  const handleUpdateMetadata = async (id: string, dto: UpdateAssetMetadataDto) => {
    await updateAssetMetadata(workspaceId, id, dto);
    await queryClient.invalidateQueries({ queryKey: ['assets'] });
  };

  const handleAddVersion = async (id: string, dto: CreateAssetVersionDto) => {
    await addAssetVersion(workspaceId, id, {
      ...dto,
      uploaderId: profileId || undefined,
      uploaderName: 'Acting Profile',
    });
    await queryClient.invalidateQueries({ queryKey: ['assets'] });
  };

  const handleAddRelationship = async (id: string, dto: AddAssetRelationshipDto) => {
    await addAssetRelationship(workspaceId, id, dto);
    await queryClient.invalidateQueries({ queryKey: ['assets'] });
  };

  const handleUnlinkRelationship = async (id: string, relationshipId: string) => {
    await unlinkAssetRelationship(workspaceId, id, relationshipId);
    await queryClient.invalidateQueries({ queryKey: ['assets'] });
  };

  const handleDeleteAsset = async (id: string) => {
    await deleteAsset(workspaceId, id);
    setSelectedAssetForDetail(null);
    setPreviewAsset(null);
    await queryClient.invalidateQueries({ queryKey: ['assets'] });
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 pb-16">
      {/* 1. Header Toolbar */}
      <div className="p-4 bg-surface border border-ch-border flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <HardDrive size={20} className="text-primary shrink-0" />
            <h1 className="text-lg font-bold text-ch-text-primary">Assets & File Storage</h1>
            {currentFolder && (
              <span className="hidden sm:inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-medium">
                <ChevronRight size={12} />
                {currentFolder.name}
              </span>
            )}
          </div>
          <p className="text-xs text-ch-text-secondary max-w-2xl">
            Hierarchical workspace storage with Cloudflare R2 persistence, universal file preview, non-destructive relationships, and full folder organization.
          </p>
        </div>

        {/* Global Toolbar Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Mobile Folder Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMobileFolderDrawerOpen(!isMobileFolderDrawerOpen)}
            className="md:hidden gap-1.5"
          >
            <FolderTree size={14} />
            <span>Folders</span>
          </Button>

          {/* New Folder */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCreateFolderParentId(selectedFolderId);
              setIsCreateFolderOpen(true);
            }}
            className="gap-1.5"
          >
            <FolderPlus size={14} />
            <span>New Folder</span>
          </Button>

          {/* Bulk Move (when items selected) */}
          {selectedAssetIds.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const selected = assets.filter((a) => selectedAssetIds.includes(a.id));
                setAssetsToMove(selected);
              }}
              className="gap-1.5 text-primary border-primary/30 bg-primary/5 hover:bg-primary/10"
            >
              <FolderInput size={14} />
              <span>Move ({selectedAssetIds.length})</span>
            </Button>
          )}

          {/* Upload Button */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsUploadOpen(true)}
            className="gap-1.5 shrink-0"
          >
            <Upload size={14} />
            <span>Upload Asset</span>
          </Button>
        </div>
      </div>

      {/* 2. Summary Strip */}
      <AssetsSummaryStrip summary={summary} assets={assets} />

      {/* 3. Main Two-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
        {/* Left Column: Folders Navigation Tree */}
        <div
          className={`md:col-span-3 lg:col-span-3 ${
            isMobileFolderDrawerOpen ? 'block' : 'hidden md:block'
          }`}
        >
          <FolderTreeView
            folders={folders}
            selectedFolderId={selectedFolderId}
            selectedViewMode={selectedViewMode}
            onSelectFolder={handleFolderSelect}
            onSelectViewMode={(mode) => {
              setSelectedViewMode(mode);
              if (mode !== 'folders') {
                setSelectedFolderId(null);
              }
              setPage(1);
            }}
            onCreateFolder={(parentId?: string | null) => {
              setCreateFolderParentId(parentId || null);
              setIsCreateFolderOpen(true);
            }}
            onRenameFolder={() => {}}
            onMoveFolder={(folder) => setFolderToMove(folder)}
            onDeleteFolder={(folder) => setFolderToDelete(folder)}
            totalAssetsCount={total}
          />
        </div>

        {/* Right Column: Breadcrumbs, Filter Bar, and Files Grid/Table */}
        <div className="md:col-span-9 lg:col-span-9 space-y-3">
          {/* Breadcrumbs & Recursive View Toggle Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-surface border border-ch-border rounded-lg text-xs">
            <FolderBreadcrumbs
              breadcrumbs={breadcrumbsList}
              currentFolderName={currentFolder ? currentFolder.name : undefined}
              onNavigate={handleFolderSelect}
              directFileCount={assets.length}
            />

            {selectedFolderId && (
              <label className="flex items-center gap-1.5 text-xs text-ch-text-secondary cursor-pointer select-none shrink-0">
                <input
                  type="checkbox"
                  checked={includeSubfolders}
                  onChange={(e) => setIncludeSubfolders(e.target.checked)}
                  className="rounded border-ch-border text-primary focus:ring-0"
                />
                <Layers size={13} className="text-ch-text-secondary" />
                <span>Include subfolders</span>
              </label>
            )}
          </div>

          {/* Filter & Search Toolbar */}
          <AssetsFilterToolbar
            search={search}
            onSearchChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            category={category}
            onCategoryChange={(val) => {
              setCategory(val);
              setPage(1);
            }}
            typeGroup={typeGroup}
            onTypeGroupChange={(val) => {
              setTypeGroup(val);
              setPage(1);
            }}
            sortBy={sortBy}
            onSortByChange={(val) => {
              setSortBy(val);
              setPage(1);
            }}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onOpenUpload={() => setIsUploadOpen(true)}
            onClearFilters={() => {
              setSearch('');
              setCategory('');
              setTypeGroup('');
              setSortBy('date_desc');
              setPage(1);
            }}
          />

          {/* Files Content Area */}
          {isAssetsLoading ? (
            <LoadingState message="Loading files from storage..." />
          ) : isError ? (
            <ErrorState
              message="Failed to load files from storage repository."
              onRetry={() => {
                refetchAssets();
                refetchFolders();
              }}
            />
          ) : (
            <div className="space-y-4">
              {viewMode === 'table' ? (
                <AssetsTableView
                  assets={assets}
                  onSelectAsset={(asset) => setSelectedAssetForDetail(asset.id)}
                  onPreviewAsset={(asset) => setPreviewAsset(asset)}
                  onDownloadAsset={(asset) => handleDownload(asset)}
                />
              ) : (
                <AssetsGridView
                  assets={assets}
                  onSelectAsset={(asset) => setSelectedAssetForDetail(asset.id)}
                  onPreviewAsset={(asset) => setPreviewAsset(asset)}
                  onDownloadAsset={(asset) => handleDownload(asset)}
                />
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  page={page}
                  pageSize={pageSize}
                  total={total}
                  onPageChange={(newPage) => setPage(newPage)}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* 4. Universal Asset Preview Modal */}
      <UniversalAssetPreview
        isOpen={Boolean(previewAsset)}
        onClose={() => setPreviewAsset(null)}
        asset={previewAsset}
        workspaceId={workspaceId}
        onMove={(asset) => setAssetsToMove([asset])}
        onDelete={(asset) => handleDeleteAsset(asset.id)}
      />

      {/* 5. Legacy Detail Drawer for Deep Metadata/Relationships */}
      <AssetDetailDrawer
        asset={selectedAsset}
        isOpen={Boolean(selectedAssetForDetail)}
        onClose={() => setSelectedAssetForDetail(null)}
        onDownload={handleDownload}
        onUpdateMetadata={handleUpdateMetadata}
        onAddVersion={handleAddVersion}
        onAddRelationship={handleAddRelationship}
        onUnlinkRelationship={handleUnlinkRelationship}
        onDeleteAsset={handleDeleteAsset}
        onOpenPreview={(asset) => setPreviewAsset(asset)}
      />

      {/* 6. Upload Asset Dialog */}
      <UploadAssetDialog
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        workspaceId={workspaceId}
        onUploadSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['assets'] });
          queryClient.invalidateQueries({ queryKey: ['folders', workspaceId] });
        }}
        folders={folders}
      />

      {/* 7. Create Folder Dialog */}
      <CreateFolderDialog
        isOpen={isCreateFolderOpen}
        onClose={() => setIsCreateFolderOpen(false)}
        onSubmit={handleCreateFolderSubmit}
        folders={folders}
        defaultParentFolderId={createFolderParentId}
      />

      {/* 8. Move Folder Dialog */}
      <MoveFolderDialog
        isOpen={Boolean(folderToMove)}
        onClose={() => setFolderToMove(null)}
        folder={folderToMove}
        folders={folders}
        onMove={handleMoveFolderSubmit}
      />

      {/* 9. Delete Folder Dialog */}
      <DeleteFolderDialog
        isOpen={Boolean(folderToDelete)}
        onClose={() => setFolderToDelete(null)}
        folder={folderToDelete}
        onConfirm={handleDeleteFolderSubmit}
      />

      {/* 10. Move Asset(s) Dialog */}
      <MoveAssetDialog
        isOpen={assetsToMove.length > 0}
        onClose={() => setAssetsToMove([])}
        assets={assetsToMove}
        folders={folders}
        onMove={handleMoveAssetsSubmit}
      />
    </div>
  );
}
