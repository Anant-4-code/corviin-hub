import React, { useState } from 'react';
import {
  Folder,
  FolderOpen,
  FolderPlus,
  ChevronRight,
  ChevronDown,
  HardDrive,
  Clock,
  Link2,
  MoreVertical,
  Edit2,
  FolderInput,
  Trash2,
  Search,
} from 'lucide-react';
import { AssetFolderItem } from '@corviin-hub/shared';

interface FolderTreeViewProps {
  folders: AssetFolderItem[];
  selectedFolderId: string | null;
  selectedViewMode: 'all' | 'folders' | 'recent' | 'linked';
  onSelectFolder: (folderId: string | null) => void;
  onSelectViewMode: (mode: 'all' | 'folders' | 'recent' | 'linked') => void;
  onCreateFolder: (parentFolderId?: string | null) => void;
  onRenameFolder: (folder: AssetFolderItem) => void;
  onMoveFolder: (folder: AssetFolderItem) => void;
  onDeleteFolder: (folder: AssetFolderItem) => void;
  totalAssetsCount?: number;
}

export const FolderTreeView: React.FC<FolderTreeViewProps> = ({
  folders,
  selectedFolderId,
  selectedViewMode,
  onSelectFolder,
  onSelectViewMode,
  onCreateFolder,
  onRenameFolder,
  onMoveFolder,
  onDeleteFolder,
  totalAssetsCount,
}) => {
  const [expandedFolderIds, setExpandedFolderIds] = useState<Set<string>>(
    new Set(['fld-tch-meetings', 'fld-tch-campaigns', 'fld-tch-media---creative']),
  );
  const [folderQuery, setFolderQuery] = useState('');
  const [activeMenuFolderId, setActiveMenuFolderId] = useState<string | null>(null);

  const toggleExpand = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolderIds((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const rootFolders = folders.filter((f) => !f.parentFolderId);

  const renderFolderItem = (folder: AssetFolderItem, depth = 0) => {
    const isExpanded = expandedFolderIds.has(folder.id);
    const isSelected = selectedViewMode === 'folders' && selectedFolderId === folder.id;
    const subfolders = folders.filter((f) => f.parentFolderId === folder.id);
    const hasChildren = subfolders.length > 0;

    // Filter check
    if (
      folderQuery.trim() &&
      !folder.name.toLowerCase().includes(folderQuery.toLowerCase()) &&
      !subfolders.some((s) => s.name.toLowerCase().includes(folderQuery.toLowerCase()))
    ) {
      return null;
    }

    return (
      <div key={folder.id} className="select-none">
        <div
          onClick={() => {
            onSelectViewMode('folders');
            onSelectFolder(folder.id);
          }}
          className={`group flex items-center justify-between px-2 py-1.5 rounded-lg text-xs cursor-pointer transition-none ${
            isSelected
              ? 'bg-surface-selected text-accent font-semibold border-l-2 border-accent'
              : 'hover:bg-surface-muted text-ch-text-primary'
          }`}
          style={{ paddingLeft: `${depth * 14 + 8}px` }}
        >
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => toggleExpand(folder.id, e)}
                className="p-0.5 hover:bg-surface rounded text-ch-text-muted hover:text-ch-text-primary transition-none"
              >
                {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
              </button>
            ) : (
              <span className="w-4 shrink-0" />
            )}

            {isExpanded ? (
              <FolderOpen size={14} className="shrink-0" style={{ color: folder.color || '#0d9488' }} />
            ) : (
              <Folder size={14} className="shrink-0" style={{ color: folder.color || '#0d9488' }} />
            )}

            <span className="truncate">{folder.name}</span>
          </div>

          <div className="flex items-center gap-1 shrink-0 ml-1">
            {hasChildren && (
              <span className="text-[10px] text-ch-text-muted font-mono px-1 py-0.2 rounded bg-surface-muted">
                {subfolders.length}
              </span>
            )}

            {/* Folder Context Menu Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenuFolderId(activeMenuFolderId === folder.id ? null : folder.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-surface rounded text-ch-text-muted hover:text-ch-text-primary transition-none"
                title="Folder Actions"
              >
                <MoreVertical size={12} />
              </button>

              {activeMenuFolderId === folder.id && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuFolderId(null);
                    }}
                  />
                  <div className="absolute right-0 top-full mt-1 w-40 bg-surface border border-ch-border rounded-lg shadow-lg py-1 z-40 text-xs font-normal">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuFolderId(null);
                        onCreateFolder(folder.id);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-surface-muted text-ch-text-primary text-left"
                    >
                      <FolderPlus size={13} className="text-accent" />
                      <span>New Subfolder</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuFolderId(null);
                        onRenameFolder(folder);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-surface-muted text-ch-text-primary text-left"
                    >
                      <Edit2 size={13} className="text-ch-text-secondary" />
                      <span>Rename</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuFolderId(null);
                        onMoveFolder(folder);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-surface-muted text-ch-text-primary text-left"
                    >
                      <FolderInput size={13} className="text-ch-text-secondary" />
                      <span>Move Folder</span>
                    </button>
                    <div className="my-1 border-t border-ch-border" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuFolderId(null);
                        onDeleteFolder(folder);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-danger/10 text-danger text-left"
                    >
                      <Trash2 size={13} />
                      <span>Delete Folder</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Nested Subfolders */}
        {hasChildren && isExpanded && (
          <div className="flex flex-col">
            {subfolders.map((child) => renderFolderItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-full lg:w-64 bg-surface border-r border-ch-border flex flex-col shrink-0 h-full overflow-hidden select-none">
      {/* Overview Switchers */}
      <div className="p-3 border-b border-ch-border space-y-1">
        <button
          onClick={() => {
            onSelectViewMode('all');
            onSelectFolder(null);
          }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-none ${
            selectedViewMode === 'all'
              ? 'bg-surface-selected text-accent font-semibold'
              : 'hover:bg-surface-muted text-ch-text-primary'
          }`}
        >
          <div className="flex items-center gap-2">
            <HardDrive size={15} className="text-accent" />
            <span>All Assets</span>
          </div>
          {totalAssetsCount !== undefined && (
            <span className="text-[11px] font-mono text-ch-text-muted">
              {totalAssetsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            onSelectViewMode('recent');
            onSelectFolder(null);
          }}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-none ${
            selectedViewMode === 'recent'
              ? 'bg-surface-selected text-accent font-semibold'
              : 'hover:bg-surface-muted text-ch-text-primary'
          }`}
        >
          <Clock size={15} className="text-ch-text-secondary" />
          <span>Recent Files</span>
        </button>

        <button
          onClick={() => {
            onSelectViewMode('linked');
            onSelectFolder(null);
          }}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-none ${
            selectedViewMode === 'linked'
              ? 'bg-surface-selected text-accent font-semibold'
              : 'hover:bg-surface-muted text-ch-text-primary'
          }`}
        >
          <Link2 size={15} className="text-ch-text-secondary" />
          <span>Linked Assets</span>
        </button>
      </div>

      {/* Folders Header & Action */}
      <div className="p-3 pb-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-ch-text-secondary uppercase tracking-wider">
          Folders
        </span>
        <button
          onClick={() => onCreateFolder(null)}
          className="flex items-center gap-1 text-xs text-accent hover:underline font-medium p-1 hover:bg-surface-muted rounded transition-none"
          title="Create New Top-Level Folder"
        >
          <FolderPlus size={14} />
          <span>New</span>
        </button>
      </div>

      {/* Quick Search */}
      <div className="px-3 pb-2">
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ch-text-muted" />
          <input
            type="text"
            value={folderQuery}
            onChange={(e) => setFolderQuery(e.target.value)}
            placeholder="Search folders..."
            className="w-full h-7 pl-7 pr-2 text-xs rounded border border-ch-border bg-surface text-ch-text-primary focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Folder Tree List */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5">
        {rootFolders.map((rf) => renderFolderItem(rf, 0))}
      </div>
    </aside>
  );
};

