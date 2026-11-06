import { useState, useRef, useEffect } from 'react';
import { AssetCategory, RelatedRecordType, AssetFolderItem } from '@corviin-hub/shared';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Upload, X, AlertCircle, FileUp, CheckCircle, FolderInput } from 'lucide-react';
import { requestUploadIntent, confirmUpload } from '@/services/assets';

interface UploadAssetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  onUploadSuccess: () => void;
  folders?: AssetFolderItem[];
  defaultFolderId?: string | null;
  defaultRelatedType?: RelatedRecordType;
  defaultRelatedId?: string;
  defaultRelatedTitle?: string;
}

const BLOCKED_EXTENSIONS = ['.exe', '.bat', '.cmd', '.sh', '.php', '.dll', '.com', '.vbs', '.msi'];
const MAX_BYTES = 500 * 1024 * 1024; // 500MB

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function UploadAssetDialog({
  isOpen,
  onClose,
  workspaceId,
  onUploadSuccess,
  folders = [],
  defaultFolderId,
  defaultRelatedType,
  defaultRelatedId,
  defaultRelatedTitle,
}: UploadAssetDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<AssetCategory>(AssetCategory.RAW_FOOTAGE);
  const [folderId, setFolderId] = useState<string | null>(defaultFolderId ?? null);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFolderId(defaultFolderId ?? null);
    }
  }, [isOpen, defaultFolderId]);

  // Relationships
  const [relatedType, setRelatedType] = useState<string>(defaultRelatedType || '');
  const [relatedId, setRelatedId] = useState(defaultRelatedId || '');
  const [relatedTitle, setRelatedTitle] = useState(defaultRelatedTitle || '');

  // Upload States
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'confirming' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setSelectedFile(null);
    setTitle('');
    setCategory(AssetCategory.RAW_FOOTAGE);
    setFolderId(defaultFolderId ?? null);
    setDescription('');
    setTags('');
    setRelatedType(defaultRelatedType || '');
    setRelatedId(defaultRelatedId || '');
    setRelatedTitle(defaultRelatedTitle || '');
    setUploadStatus('idle');
    setErrorMessage(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check extension
    const dot = file.name.lastIndexOf('.');
    const ext = dot !== -1 ? file.name.substring(dot).toLowerCase() : '';
    if (BLOCKED_EXTENSIONS.includes(ext)) {
      setErrorMessage(`Executable files (${ext}) are strictly blocked for security.`);
      return;
    }

    if (file.size > MAX_BYTES) {
      setErrorMessage(`File exceeds 500MB limit (${formatBytes(file.size)}).`);
      return;
    }

    setSelectedFile(file);
    if (!title.trim()) {
      setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
    }
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMessage('Please select a file to upload.');
      return;
    }

    setUploadStatus('uploading');
    setErrorMessage(null);

    try {
      // Step 1: Request Upload Intent from Backend
      const intentRes = await requestUploadIntent(workspaceId, {
        fileName: selectedFile.name,
        mimeType: selectedFile.type || 'application/octet-stream',
        sizeBytes: selectedFile.size,
        category,
        folderId: folderId || undefined,
        title: title.trim() || selectedFile.name,
        description: description.trim() || undefined,
        tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
        relatedType: relatedType ? (relatedType as RelatedRecordType) : undefined,
        relatedId: relatedId.trim() || undefined,
        relatedTitle: relatedTitle.trim() || undefined,
      });

      // Step 2: Confirm upload with API
      setUploadStatus('confirming');
      await confirmUpload(workspaceId, {
        uploadIntentId: intentRes.uploadIntentId,
        storageKey: intentRes.storageKey,
        fileName: selectedFile.name,
        mimeType: selectedFile.type || 'application/octet-stream',
        sizeBytes: selectedFile.size,
        category,
        folderId: folderId || undefined,
        title: title.trim() || selectedFile.name,
        description: description.trim() || undefined,
        tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
        relatedType: relatedType ? (relatedType as RelatedRecordType) : undefined,
        relatedId: relatedId.trim() || undefined,
        relatedTitle: relatedTitle.trim() || undefined,
      });

      setUploadStatus('success');
      setTimeout(() => {
        onUploadSuccess();
        resetForm();
        onClose();
      }, 500);
    } catch (err: any) {
      setUploadStatus('error');
      setErrorMessage(err?.response?.data?.message || err?.message || 'Failed to complete upload. Please retry.');
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} title="Upload New Asset" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Error notification if any */}
        {errorMessage && (
          <div className="p-3 rounded bg-danger/10 border border-danger/30 text-danger flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-xs">Upload Error</p>
              <p className="text-[11px]">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* File Dropzone */}
        {!selectedFile ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-ch-border hover:border-ch-text-secondary rounded-card p-6 text-center cursor-pointer bg-surface-hover/30 flex flex-col items-center justify-center gap-2"
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="p-2.5 rounded-full bg-surface border border-ch-border text-primary">
              <FileUp size={22} />
            </div>
            <div>
              <p className="font-semibold text-ch-text-primary text-xs">Click to browse or drop file</p>
              <p className="text-[11px] text-ch-text-muted mt-0.5">
                Up to 500MB (Videos, Images, Audio, PDF, Documents)
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded border border-ch-border bg-surface-hover/50 flex items-center justify-between">
            <div className="min-w-0 space-y-0.5">
              <p className="font-semibold text-ch-text-primary text-xs truncate">{selectedFile.name}</p>
              <p className="text-ch-text-muted text-[11px]">
                {formatBytes(selectedFile.size)} • {selectedFile.type || 'Unknown MIME'}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedFile(null);
                setErrorMessage(null);
              }}
              className="p-1 h-7 w-7 text-ch-text-muted hover:text-danger"
              title="Remove selected file"
            >
              <X size={14} />
            </Button>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="text-[11px] text-ch-text-secondary block mb-1">Display Title *</label>
          <Input
            required
            placeholder="e.g. Master Raw Footage 4K"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Category & Folder */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-ch-text-secondary block mb-1">Asset Category *</label>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              options={[
                { value: AssetCategory.RAW_FOOTAGE, label: 'Raw Footage' },
                { value: AssetCategory.SCRIPTS, label: 'Scripts & Copy' },
                { value: AssetCategory.IMAGES, label: 'Images & Posters' },
                { value: AssetCategory.REFERENCES, label: 'References & Research' },
                { value: AssetCategory.AUDIO_VO, label: 'Audio & Voice-over' },
                { value: AssetCategory.DRAFT_EDITS, label: 'Draft Edits' },
                { value: AssetCategory.FINAL_APPROVED, label: 'Final Approved Asset' },
                { value: AssetCategory.PUBLISHED_PROOF, label: 'Published Proof' },
                { value: AssetCategory.CONTRACTS_DOCS, label: 'Contracts & Business Documents' },
                { value: AssetCategory.OTHER, label: 'Other Asset' },
              ]}
            />
          </div>

          <div>
            <label className="text-[11px] text-ch-text-secondary block mb-1">Destination Folder</label>
            <select
              value={folderId || ''}
              onChange={(e) => setFolderId(e.target.value || null)}
              className="w-full h-8 px-2.5 rounded border border-ch-border bg-surface text-xs text-ch-text-primary focus:outline-none focus:border-accent"
            >
              <option value="">[Root Storage] — Top Level</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.parentFolderId ? '↳ ' : '📁 '}
                  {f.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-[11px] text-ch-text-secondary block mb-1">Description (Optional)</label>
          <Textarea
            rows={2}
            placeholder="Brief notes on resolution, scene, or legal approval..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Tags */}
        <div>
          <label className="text-[11px] text-ch-text-secondary block mb-1">Tags (Optional, comma-separated)</label>
          <Input
            placeholder="e.g. video, 4k, marketing"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        {/* Optional Relationship Link */}
        <div className="p-2.5 rounded bg-surface border border-ch-border space-y-2">
          <span className="font-semibold text-ch-text-secondary text-[11px] uppercase tracking-wider block">
            Link to Campaign or Record (Optional)
          </span>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Select
                value={relatedType}
                onChange={(e) => setRelatedType(e.target.value)}
                options={[
                  { value: '', label: 'No Relationship' },
                  { value: 'campaign', label: 'Campaign' },
                  { value: 'task', label: 'Task' },
                  { value: 'meeting', label: 'Meeting' },
                  { value: 'plan', label: 'Plan / Goal' },
                ]}
              />
            </div>
            <div>
              <Input
                placeholder="Record ID (e.g. cmp-tech-001)"
                value={relatedId}
                onChange={(e) => setRelatedId(e.target.value)}
                disabled={!relatedType}
              />
            </div>
          </div>
          {relatedType && (
            <Input
              placeholder="Record Title (e.g. Q4 Launch Blitz)"
              value={relatedTitle}
              onChange={(e) => setRelatedTitle(e.target.value)}
            />
          )}
        </div>

        {/* Static Upload Progress Indicator (Zero Animation) */}
        {(uploadStatus === 'uploading' || uploadStatus === 'confirming') && (
          <div className="p-3 rounded bg-primary/10 border border-primary/30 space-y-2">
            <div className="flex items-center justify-between text-xs text-primary font-medium">
              <span>
                {uploadStatus === 'uploading' ? 'Uploading to private storage...' : 'Registering asset record...'}
              </span>
              <span>{uploadStatus === 'uploading' ? '50%' : '90%'}</span>
            </div>
            {/* Static non-animated progress bar */}
            <div className="w-full h-1.5 bg-ch-border rounded overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{ width: uploadStatus === 'uploading' ? '50%' : '90%' }}
              />
            </div>
          </div>
        )}

        {uploadStatus === 'success' && (
          <div className="p-2.5 rounded bg-success/10 border border-success/30 text-success text-xs flex items-center gap-2">
            <CheckCircle size={16} />
            <span>Upload and registration complete!</span>
          </div>
        )}

        {/* Dialog Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-ch-border">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              resetForm();
              onClose();
            }}
            disabled={uploadStatus === 'uploading' || uploadStatus === 'confirming'}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!selectedFile || uploadStatus === 'uploading' || uploadStatus === 'confirming'}
            className="gap-1.5"
          >
            <Upload size={13} />
            <span>{uploadStatus === 'error' ? 'Retry Upload' : 'Upload to Storage'}</span>
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
