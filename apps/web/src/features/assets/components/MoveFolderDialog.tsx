import React, { useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { Folder, FolderInput, AlertCircle } from 'lucide-react';
import { AssetFolderItem } from '@corviin-hub/shared';

interface MoveFolderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  folder: AssetFolderItem | null;
  folders: AssetFolderItem[];
  onMove: (folderId: string, targetParentId: string | null) => Promise<void>;
}

export const MoveFolderDialog: React.FC<MoveFolderDialogProps> = ({
  isOpen,
  onClose,
  folder,
  folders,
  onMove,
}) => {
  const [targetParentId, setTargetParentId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to find all descendant IDs of a folder to disable them in picker
  const getDescendantIds = (rootId: string): string[] => {
    const descendants: string[] = [];
    const queue = [rootId];
    while (queue.length > 0) {
      const current = queue.shift()!;
      const children = folders.filter((f) => f.parentFolderId === current);
      for (const child of children) {
        descendants.push(child.id);
        queue.push(child.id);
      }
    }
    return descendants;
  };

  const disallowedIds = React.useMemo(() => {
    if (!folder) return [];
    return [folder.id, ...getDescendantIds(folder.id)];
  }, [folder, folders]);

  React.useEffect(() => {
    if (folder) {
      setTargetParentId(folder.parentFolderId || null);
      setError(null);
    }
  }, [folder, isOpen]);

  if (!folder) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (targetParentId === folder.id) {
      setError('Cannot move a folder into itself.');
      return;
    }
    if (targetParentId && disallowedIds.includes(targetParentId)) {
      setError('Cannot move a folder into one of its subfolders.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onMove(folder.id, targetParentId);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to move folder.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} title={`Move Folder: "${folder.name}"`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs bg-danger/10 border border-danger/20 text-danger rounded-lg flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="p-3 bg-surface-muted rounded-lg border border-ch-border text-xs text-ch-text-secondary">
          Select a new parent destination for <span className="font-semibold text-ch-text-primary">{folder.name}</span>.
          All contained subfolders and assets will move alongside it.
        </div>

        <FormField label="Destination Parent Folder">
          <select
            value={targetParentId || ''}
            onChange={(e) => setTargetParentId(e.target.value || null)}
            className="w-full h-10 px-3 rounded-control border border-ch-border bg-surface text-sm text-ch-text-primary focus:outline-none focus:border-accent font-medium"
          >
            <option value="">[Root Storage] — Top Level</option>
            {folders.map((f) => {
              const isDisallowed = disallowedIds.includes(f.id);
              return (
                <option
                  key={f.id}
                  value={f.id}
                  disabled={isDisallowed}
                  className={isDisallowed ? 'text-ch-text-muted bg-surface-muted' : ''}
                >
                  {f.parentFolderId ? '  ↳ ' : '📁 '}
                  {f.name}
                  {f.id === folder.id ? ' (current folder)' : isDisallowed ? ' (subfolder)' : ''}
                </option>
              );
            })}
          </select>
        </FormField>

        <div className="flex justify-end gap-2 pt-2 border-t border-ch-border">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting || targetParentId === folder.parentFolderId}>
            <FolderInput size={14} className="mr-1.5" />
            {isSubmitting ? 'Moving…' : 'Move Folder'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
