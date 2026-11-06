import React, { useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { FolderInput, Folder, File, Search } from 'lucide-react';
import { AssetItem, AssetFolderItem } from '@corviin-hub/shared';

interface MoveAssetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  assets: AssetItem[];
  folders: AssetFolderItem[];
  onMove: (assetIds: string[], targetFolderId: string | null) => Promise<void>;
}

export const MoveAssetDialog: React.FC<MoveAssetDialogProps> = ({
  isOpen,
  onClose,
  assets,
  folders,
  onMove,
}) => {
  const [targetFolderId, setTargetFolderId] = useState<string | null>(null);
  const [folderSearch, setFolderSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setTargetFolderId(assets[0]?.folderId ?? null);
      setFolderSearch('');
      setError(null);
    }
  }, [isOpen, assets]);

  if (!assets || assets.length === 0) return null;

  const filteredFolders = folders.filter((f) =>
    f.name.toLowerCase().includes(folderSearch.trim().toLowerCase()),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await onMove(
        assets.map((a) => a.id),
        targetFolderId,
      );
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to move assets.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title={
        assets.length === 1
          ? `Move File: "${assets[0].title}"`
          : `Move ${assets.length} Selected Files`
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs bg-danger/10 border border-danger/20 text-danger rounded-lg">
            {error}
          </div>
        )}

        <div className="p-2.5 bg-surface-muted rounded-lg border border-ch-border text-xs text-ch-text-secondary flex items-center gap-2">
          <File size={14} className="text-accent shrink-0" />
          <span className="truncate">
            {assets.length === 1
              ? `Current location: ${assets[0].folderName || 'Root Storage'}`
              : `Moving ${assets.length} assets between folders`}
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ch-text-primary mb-1.5">
            Select Destination Folder
          </label>

          {/* Quick search */}
          <div className="relative mb-2">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ch-text-muted" />
            <input
              type="text"
              value={folderSearch}
              onChange={(e) => setFolderSearch(e.target.value)}
              placeholder="Filter folders..."
              className="w-full h-8 pl-8 pr-3 text-xs rounded border border-ch-border bg-surface text-ch-text-primary focus:outline-none focus:border-accent"
            />
          </div>

          <div className="max-h-56 overflow-y-auto border border-ch-border rounded-lg divide-y divide-ch-border">
            {/* Root option */}
            <button
              type="button"
              onClick={() => setTargetFolderId(null)}
              className={`w-full flex items-center gap-2 p-2.5 text-xs text-left transition-none ${
                targetFolderId === null
                  ? 'bg-surface-selected font-semibold text-accent'
                  : 'hover:bg-surface-muted text-ch-text-primary'
              }`}
            >
              <Folder size={14} className={targetFolderId === null ? 'text-accent' : 'text-ch-text-muted'} />
              <span>[Root Storage] — Top Level</span>
            </button>

            {/* Folder list */}
            {filteredFolders.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setTargetFolderId(f.id)}
                className={`w-full flex items-center justify-between p-2.5 text-xs text-left transition-none ${
                  targetFolderId === f.id
                    ? 'bg-surface-selected font-semibold text-accent'
                    : 'hover:bg-surface-muted text-ch-text-primary'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span style={{ color: f.color || '#0d9488' }}>📁</span>
                  <span className="truncate">
                    {f.parentFolderId ? '↳ ' : ''}
                    {f.name}
                  </span>
                </div>
                <span className="text-[11px] text-ch-text-muted font-mono">
                  {f.subfolderCount ? `${f.subfolderCount} subs` : ''}
                </span>
              </button>
            ))}

            {filteredFolders.length === 0 && (
              <div className="p-4 text-center text-xs text-ch-text-muted">
                No matching folders found.
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-ch-border">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            <FolderInput size={14} className="mr-1.5" />
            {isSubmitting ? 'Moving…' : 'Confirm Move'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
