import React, { useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Folder, FolderPlus } from 'lucide-react';
import { AssetFolderItem, CreateFolderDto } from '@corviin-hub/shared';

interface CreateFolderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateFolderDto) => Promise<void>;
  folders: AssetFolderItem[];
  defaultParentFolderId?: string | null;
}

const PRESET_COLORS = [
  '#0d9488', // Teal
  '#2563eb', // Blue
  '#d97706', // Amber
  '#7c3aed', // Purple
  '#0284c7', // Sky
  '#e11d48', // Rose
  '#16a34a', // Green
  '#64748b', // Slate
];

export const CreateFolderDialog: React.FC<CreateFolderDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  folders,
  defaultParentFolderId,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [parentFolderId, setParentFolderId] = useState<string | null>(defaultParentFolderId ?? null);
  const [color, setColor] = useState('#0d9488');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync default parent when opening
  React.useEffect(() => {
    if (isOpen) {
      setParentFolderId(defaultParentFolderId ?? null);
      setName('');
      setDescription('');
      setError(null);
    }
  }, [isOpen, defaultParentFolderId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Folder name is required.');
      return;
    }

    // Check duplicate name in parent
    const duplicate = folders.find(
      (f) =>
        (f.parentFolderId || null) === (parentFolderId || null) &&
        f.name.toLowerCase() === name.trim().toLowerCase(),
    );
    if (duplicate) {
      setError(`A folder named "${name.trim()}" already exists in this destination.`);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
        parentFolderId: parentFolderId || null,
        color,
        icon: 'Folder',
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to create folder.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title={parentFolderId ? 'Create New Subfolder' : 'Create New Folder'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs bg-danger/10 border border-danger/20 text-danger rounded-lg">
            {error}
          </div>
        )}

        <FormField label="Folder Name" required error={error && !name.trim() ? error : undefined}>
          <div className="relative">
            <Folder
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 shrink-0 pointer-events-none"
              style={{ color }}
            />
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. Q4 Campaigns, Developer Contracts..."
              className="pl-9"
              autoFocus
            />
          </div>
        </FormField>

        <FormField label="Parent Folder / Destination">
          <select
            value={parentFolderId || ''}
            onChange={(e) => setParentFolderId(e.target.value || null)}
            className="w-full h-9 px-3 rounded-control border border-ch-border bg-surface text-sm text-ch-text-primary focus:outline-none focus:border-accent"
          >
            <option value="">[Root Storage] — Top Level Folder</option>
            {folders.map((f) => (
              <option key={f.id} value={f.id}>
                {f.parentFolderId ? '↳ ' : '📁 '}
                {f.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Description (Optional)">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Briefly describe what files belong in this folder..."
            rows={2}
          />
        </FormField>

        <div>
          <label className="block text-xs font-medium text-ch-text-secondary mb-2">
            Folder Color
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-6 h-6 rounded-full border-2 transition-none ${
                  color === c ? 'border-ch-text-primary scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-ch-border">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting || !name.trim()}>
            <FolderPlus size={14} className="mr-1.5" />
            {isSubmitting ? 'Creating…' : 'Create Folder'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
