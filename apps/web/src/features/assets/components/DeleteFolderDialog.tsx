import React, { useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { AssetFolderItem, DeleteFolderStrategy } from '@corviin-hub/shared';

interface DeleteFolderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  folder: AssetFolderItem | null;
  onConfirm: (folderId: string, strategy: DeleteFolderStrategy) => Promise<void>;
}

export const DeleteFolderDialog: React.FC<DeleteFolderDialogProps> = ({
  isOpen,
  onClose,
  folder,
  onConfirm,
}) => {
  const [strategy, setStrategy] = useState<DeleteFolderStrategy>('move_to_parent');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!folder) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await onConfirm(folder.id, strategy);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to delete folder.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} title={`Delete Folder: "${folder.name}"`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs bg-danger/10 border border-danger/20 text-danger rounded-lg">
            {error}
          </div>
        )}

        <div className="flex items-start gap-3 p-3 bg-warning/10 border border-warning/20 rounded-lg text-xs text-ch-text-secondary leading-relaxed">
          <AlertTriangle size={16} className="text-warning shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-ch-text-primary mb-1">
              File Retention Guarantee
            </p>
            <p>
              Deleting a folder does <span className="font-medium">not</span> delete the underlying files from Cloudflare R2 storage or sever relationships to campaigns, tasks, or meetings.
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ch-text-primary mb-2">
            What should happen to the files inside this folder?
          </label>

          <div className="space-y-2 text-xs">
            <label className="flex items-start gap-2.5 p-3 rounded-lg border border-ch-border hover:bg-surface-muted cursor-pointer">
              <input
                type="radio"
                name="strategy"
                value="move_to_parent"
                checked={strategy === 'move_to_parent'}
                onChange={() => setStrategy('move_to_parent')}
                className="mt-0.5"
              />
              <div>
                <p className="font-semibold text-ch-text-primary">
                  Move files to parent folder (Recommended)
                </p>
                <p className="text-ch-text-muted mt-0.5">
                  Reassigns contained assets to {folder.parentFolderId ? 'the parent folder' : 'Root Storage'}.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-3 rounded-lg border border-ch-border hover:bg-surface-muted cursor-pointer">
              <input
                type="radio"
                name="strategy"
                value="move_to_general"
                checked={strategy === 'move_to_general'}
                onChange={() => setStrategy('move_to_general')}
                className="mt-0.5"
              />
              <div>
                <p className="font-semibold text-ch-text-primary">
                  Move files to "General / Unsorted" folder
                </p>
                <p className="text-ch-text-muted mt-0.5">
                  Keeps the files in the dedicated workspace fallback directory.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-3 rounded-lg border border-ch-border hover:bg-surface-muted cursor-pointer">
              <input
                type="radio"
                name="strategy"
                value="archive"
                checked={strategy === 'archive'}
                onChange={() => setStrategy('archive')}
                className="mt-0.5"
              />
              <div>
                <p className="font-semibold text-ch-text-primary">
                  Archive folder and contained files
                </p>
                <p className="text-ch-text-muted mt-0.5">
                  Hides the folder from active navigation while keeping contents recoverable.
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-ch-border">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="danger" disabled={isSubmitting}>
            <Trash2 size={14} className="mr-1.5" />
            {isSubmitting ? 'Deleting…' : 'Delete Folder'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
