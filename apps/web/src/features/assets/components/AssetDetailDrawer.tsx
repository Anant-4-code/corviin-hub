import { useState } from 'react';
import {
  AssetItem,
  AssetCategory,
  AssetTypeGroup,
  CreateAssetVersionDto,
  AddAssetRelationshipDto,
  UpdateAssetMetadataDto,
} from '@corviin-hub/shared';
import { Drawer } from '@/components/ui/Drawer';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Tabs } from '@/components/ui/Tabs';
import {
  Download,
  Trash2,
  Upload,
  Link2,
  Unlink,
  History,
  Info,
  Edit2,
  Check,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  File,
  HardDrive,
  Eye,
} from 'lucide-react';

interface AssetDetailDrawerProps {
  asset: AssetItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (asset: AssetItem, versionId?: string) => void;
  onUpdateMetadata: (id: string, dto: UpdateAssetMetadataDto) => Promise<void>;
  onAddVersion: (id: string, dto: CreateAssetVersionDto) => Promise<void>;
  onAddRelationship: (id: string, dto: AddAssetRelationshipDto) => Promise<void>;
  onUnlinkRelationship: (id: string, relationshipId: string) => Promise<void>;
  onDeleteAsset: (id: string) => Promise<void>;
  onOpenPreview: (asset: AssetItem) => void;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function AssetDetailDrawer({
  asset,
  isOpen,
  onClose,
  onDownload,
  onUpdateMetadata,
  onAddVersion,
  onAddRelationship,
  onUnlinkRelationship,
  onDeleteAsset,
  onOpenPreview,
}: AssetDetailDrawerProps) {
  if (!asset) return null;

  const [activeTab, setActiveTab] = useState<'info' | 'versions' | 'relations' | 'edit'>('info');

  // New Version state
  const [showVersionForm, setShowVersionForm] = useState(false);
  const [verFileName, setVerFileName] = useState('');
  const [verFileSize, setVerFileSize] = useState('');
  const [verChangeNote, setVerChangeNote] = useState('');
  const [isSubmittingVersion, setIsSubmittingVersion] = useState(false);

  // New Relationship state
  const [showRelationForm, setShowRelationForm] = useState(false);
  const [relType, setRelType] = useState<any>('campaign');
  const [relId, setRelId] = useState('');
  const [relTitle, setRelTitle] = useState('');
  const [isSubmittingRel, setIsSubmittingRel] = useState(false);

  // Edit metadata state
  const [editTitle, setEditTitle] = useState(asset.title);
  const [editCategory, setEditCategory] = useState<AssetCategory>(asset.category);
  const [editDescription, setEditDescription] = useState(asset.description || '');
  const [editTags, setEditTags] = useState(asset.tags ? asset.tags.join(', ') : '');
  const [isSavingMetadata, setIsSavingMetadata] = useState(false);
  const [metadataSuccess, setMetadataSuccess] = useState(false);

  // Deletion confirm state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle version submit
  const handleCreateVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verFileName.trim()) return;

    try {
      setIsSubmittingVersion(true);
      await onAddVersion(asset.id, {
        fileName: verFileName.trim(),
        mimeType: asset.mimeType,
        sizeBytes: parseInt(verFileSize, 10) || asset.sizeBytes,
        changeNote: verChangeNote.trim() || undefined,
      });
      setShowVersionForm(false);
      setVerFileName('');
      setVerFileSize('');
      setVerChangeNote('');
    } finally {
      setIsSubmittingVersion(false);
    }
  };

  // Handle relation submit
  const handleCreateRelation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!relId.trim() || !relTitle.trim()) return;

    try {
      setIsSubmittingRel(true);
      await onAddRelationship(asset.id, {
        relatedType: relType,
        relatedId: relId.trim(),
        relatedTitle: relTitle.trim(),
      });
      setShowRelationForm(false);
      setRelId('');
      setRelTitle('');
    } finally {
      setIsSubmittingRel(false);
    }
  };

  // Handle metadata submit
  const handleSaveMetadata = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingMetadata(true);
      await onUpdateMetadata(asset.id, {
        title: editTitle.trim(),
        category: editCategory,
        description: editDescription.trim(),
        tags: editTags.split(',').map((t) => t.trim()).filter(Boolean),
      });
      setMetadataSuccess(true);
      setTimeout(() => setMetadataSuccess(false), 2000);
    } finally {
      setIsSavingMetadata(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDeleteAsset(asset.id);
      setShowDeleteConfirm(false);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  const isImage = asset.typeGroup === AssetTypeGroup.IMAGE;
  const isVideo = asset.typeGroup === AssetTypeGroup.VIDEO;
  const isAudio = asset.typeGroup === AssetTypeGroup.AUDIO;

  return (
    <Drawer open={isOpen} onClose={onClose} title="Asset Details" subtitle={asset.title} size="xl">
      <div className="space-y-4">
        {/* Header Preview & Quick Action Bar */}
        <div className="p-4 bg-surface-hover/40 border border-ch-border space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="primary" size="sm">{asset.category.replace(/_/g, ' ')}</Badge>
                <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-surface border border-ch-border text-ch-text-secondary">
                  v{asset.currentVersionNumber}
                </span>
                <span className="text-xs text-ch-text-muted">{asset.storageProvider.toUpperCase()} Storage</span>
              </div>
              <h2 className="text-base font-bold text-ch-text-primary leading-snug">{asset.title}</h2>
              <p className="font-mono text-xs text-ch-text-muted">{asset.originalFileName}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              {isImage && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenPreview(asset)}
                  className="gap-1.5 flex-1 sm:flex-none text-xs"
                >
                  <Eye size={13} />
                  <span>View Full</span>
                </Button>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={() => onDownload(asset)}
                className="gap-1.5 flex-1 sm:flex-none text-xs"
              >
                <Download size={13} />
                <span>Download</span>
              </Button>
            </div>
          </div>

          {/* Visual Preview Banner if Image or Audio/Video Player */}
          {isImage && asset.previewUrl && (
            <div className="rounded border border-ch-border overflow-hidden bg-surface max-h-56 flex items-center justify-center">
              <img
                src={asset.previewUrl}
                alt={asset.title}
                className="w-full h-full object-contain max-h-56"
              />
            </div>
          )}

          {isVideo && (
            <div className="p-3 rounded border border-ch-border bg-surface flex items-center gap-3">
              <Video size={24} className="text-info shrink-0" />
              <div className="text-xs space-y-0.5">
                <p className="font-medium text-ch-text-primary">Video Asset ({asset.mimeType})</p>
                <p className="text-ch-text-muted text-[11px]">Direct presigned streaming available via download authorization.</p>
              </div>
            </div>
          )}

          {isAudio && (
            <div className="p-3 rounded border border-ch-border bg-surface flex items-center gap-3">
              <Music size={24} className="text-emerald-500 shrink-0" />
              <div className="text-xs space-y-0.5">
                <p className="font-medium text-ch-text-primary">Audio / Voice-over Recording ({asset.mimeType})</p>
                <p className="text-ch-text-muted text-[11px]">High-fidelity audio stem stored in private storage.</p>
              </div>
            </div>
          )}
        </div>

        {/* Tab Switcher */}
        <Tabs
          activeTab={activeTab}
          onTabChange={(id) => setActiveTab(id as any)}
          tabs={[
            { id: 'info', label: 'Overview & Metadata' },
            { id: 'versions', label: `Versions (${asset.versions.length})` },
            { id: 'relations', label: `Linked Records (${asset.relationships.length})` },
            { id: 'edit', label: 'Edit Metadata' },
          ]}
        />

        {/* Tab 1: Info / Metadata */}
        {activeTab === 'info' && (
          <div className="space-y-4 text-xs">
            {/* Description */}
            {asset.description && (
              <div className="p-3 bg-surface border border-ch-border space-y-1">
                <h4 className="font-semibold text-ch-text-secondary uppercase tracking-wider text-[11px]">Description</h4>
                <p className="text-ch-text-primary leading-relaxed">{asset.description}</p>
              </div>
            )}

            {/* Technical Metadata Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-surface border border-ch-border space-y-1">
                <span className="text-[11px] text-ch-text-muted uppercase tracking-wider">File Size</span>
                <p className="font-mono font-medium text-ch-text-primary">{formatBytes(asset.sizeBytes)}</p>
              </div>
              <div className="p-3 bg-surface border border-ch-border space-y-1">
                <span className="text-[11px] text-ch-text-muted uppercase tracking-wider">MIME Type</span>
                <p className="font-mono font-medium text-ch-text-primary">{asset.mimeType}</p>
              </div>
              <div className="p-3 bg-surface border border-ch-border space-y-1">
                <span className="text-[11px] text-ch-text-muted uppercase tracking-wider">Uploaded By</span>
                <p className="font-medium text-ch-text-primary">{asset.uploaderName}</p>
              </div>
              <div className="p-3 bg-surface border border-ch-border space-y-1">
                <span className="text-[11px] text-ch-text-muted uppercase tracking-wider">Uploaded On</span>
                <p className="font-medium text-ch-text-primary">
                  {new Date(asset.createdAt).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            {/* Storage Key */}
            <div className="p-3 bg-surface border border-ch-border space-y-1">
              <div className="flex items-center gap-1.5 text-ch-text-secondary font-medium">
                <HardDrive size={13} />
                <span>Object Storage Key</span>
              </div>
              <p className="font-mono text-[11px] text-ch-text-muted break-all bg-surface-hover/60 p-2 rounded border border-ch-border">
                {asset.storageKey}
              </p>
            </div>

            {/* Tags */}
            {asset.tags && asset.tags.length > 0 && (
              <div className="p-3 bg-surface border border-ch-border space-y-2">
                <h4 className="font-semibold text-ch-text-secondary uppercase tracking-wider text-[11px]">Tags</h4>
                <div className="flex flex-wrap gap-1.5">
                  {asset.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-[11px] bg-surface-hover text-ch-text-secondary border border-ch-border"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Versions */}
        {activeTab === 'versions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-ch-text-secondary">
                All uploaded revisions are preserved with audit notes and authorized download access.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowVersionForm(!showVersionForm)}
                className="gap-1 text-xs shrink-0"
              >
                <Upload size={13} />
                <span>New Version</span>
              </Button>
            </div>

            {/* Add Version Form */}
            {showVersionForm && (
              <form onSubmit={handleCreateVersion} className="p-3 bg-surface border border-ch-border space-y-3">
                <h4 className="font-semibold text-xs text-ch-text-primary">Upload Replacement / New Version</h4>
                <div className="space-y-2">
                  <div>
                    <label className="text-[11px] text-ch-text-secondary block mb-1">New Filename *</label>
                    <Input
                      required
                      placeholder="e.g. raw_footage_4k_take2.mp4"
                      value={verFileName}
                      onChange={(e) => setVerFileName(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-ch-text-secondary block mb-1">File Size (bytes)</label>
                      <Input
                        type="number"
                        placeholder="e.g. 150000000"
                        value={verFileSize}
                        onChange={(e) => setVerFileSize(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-ch-text-secondary block mb-1">Change Note</label>
                      <Input
                        placeholder="e.g. Adjusted audio level"
                        value={verChangeNote}
                        onChange={(e) => setVerChangeNote(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowVersionForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={isSubmittingVersion || !verFileName.trim()}
                  >
                    {isSubmittingVersion ? 'Saving...' : 'Register Version'}
                  </Button>
                </div>
              </form>
            )}

            {/* Versions List */}
            <div className="space-y-2">
              {asset.versions.map((ver) => {
                const isCurrent = ver.versionNumber === asset.currentVersionNumber;
                return (
                  <div
                    key={ver.id}
                    className={`p-3 rounded-card border ${
                      isCurrent
                        ? 'border-primary/40 bg-primary/5'
                        : 'border-ch-border bg-surface'
                    } flex items-center justify-between gap-3 text-xs`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-mono text-ch-text-primary">
                          v{ver.versionNumber}
                        </span>
                        {isCurrent && (
                          <Badge variant="primary" size="sm" className="text-[9px]">
                            CURRENT
                          </Badge>
                        )}
                        <span className="font-mono text-ch-text-secondary text-[11px] truncate">
                          {ver.fileName}
                        </span>
                      </div>
                      <p className="text-ch-text-muted text-[11px]">
                        {ver.changeNote || 'No change note provided.'}
                      </p>
                      <div className="flex items-center gap-3 text-[10px] text-ch-text-muted">
                        <span>{formatBytes(ver.sizeBytes)}</span>
                        <span>•</span>
                        <span>By {ver.uploaderName}</span>
                        <span>•</span>
                        <span>{new Date(ver.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDownload(asset, ver.id)}
                      title={`Download version ${ver.versionNumber}`}
                      className="shrink-0 gap-1 text-xs"
                    >
                      <Download size={13} />
                      <span className="hidden sm:inline">Download</span>
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Linked Records & Non-Destructive Unlinking */}
        {activeTab === 'relations' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-ch-text-secondary">
                Relationships connect this asset to campaigns, tasks, or CRM records.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRelationForm(!showRelationForm)}
                className="gap-1 text-xs shrink-0"
              >
                <Link2 size={13} />
                <span>Link Record</span>
              </Button>
            </div>

            {/* Explanatory Banner regarding non-destructive unlinking */}
            <div className="p-2.5 rounded bg-surface-hover/60 border border-ch-border text-[11px] text-ch-text-secondary flex items-start gap-2">
              <Info size={14} className="text-info shrink-0 mt-0.5" />
              <span>
                <strong>Non-destructive unlinking:</strong> Disassociating an asset removes only the reference link. The file and its versions remain safe in your workspace library.
              </span>
            </div>

            {/* Add Relation Form */}
            {showRelationForm && (
              <form onSubmit={handleCreateRelation} className="p-3 bg-surface border border-ch-border space-y-3">
                <h4 className="font-semibold text-xs text-ch-text-primary">Link Asset to Record</h4>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-ch-text-secondary block mb-1">Record Type</label>
                      <Select
                        value={relType}
                        onChange={(e) => setRelType(e.target.value as any)}
                        options={[
                          { value: 'campaign', label: 'Campaign' },
                          { value: 'task', label: 'Task' },
                          { value: 'meeting', label: 'Meeting' },
                          { value: 'plan', label: 'Plan & Goal' },
                          { value: 'crm_lead', label: 'CRM Lead / Client' },
                          { value: 'other', label: 'Other Record' },
                        ]}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-ch-text-secondary block mb-1">Record ID *</label>
                      <Input
                        required
                        placeholder="e.g. cmp-tech-001"
                        value={relId}
                        onChange={(e) => setRelId(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-ch-text-secondary block mb-1">Record Title / Display Name *</label>
                    <Input
                      required
                      placeholder="e.g. Q4 Growth Video Campaign"
                      value={relTitle}
                      onChange={(e) => setRelTitle(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowRelationForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={isSubmittingRel || !relId.trim() || !relTitle.trim()}
                  >
                    {isSubmittingRel ? 'Linking...' : 'Add Link'}
                  </Button>
                </div>
              </form>
            )}

            {/* Relationships List */}
            {asset.relationships.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-ch-border rounded-card text-ch-text-muted text-xs">
                No active record links. This asset is currently unlinked from campaigns and tasks.
              </div>
            ) : (
              <div className="space-y-2">
                {asset.relationships.map((rel) => (
                  <div
                    key={rel.id}
                    className="p-3 rounded-card border border-ch-border bg-surface flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" size="sm" className="uppercase text-[9px]">
                          {rel.relatedType}
                        </Badge>
                        <span className="font-semibold text-ch-text-primary truncate">
                          {rel.relatedTitle}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-ch-text-muted">
                        <span>ID: {rel.relatedId}</span>
                        {rel.stage && <span>• Stage: {rel.stage}</span>}
                        <span>• Linked on {new Date(rel.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onUnlinkRelationship(asset.id, rel.id)}
                      title="Unlink relationship"
                      className="text-ch-text-muted hover:text-danger text-xs gap-1 shrink-0"
                    >
                      <Unlink size={13} />
                      <span className="hidden sm:inline">Unlink</span>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Edit Metadata & Danger Zone */}
        {activeTab === 'edit' && (
          <div className="space-y-6">
            <form onSubmit={handleSaveMetadata} className="p-3 bg-surface border border-ch-border space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-xs text-ch-text-primary">Update Asset Details</h4>
                {metadataSuccess && (
                  <span className="flex items-center gap-1 text-xs text-success font-medium">
                    <Check size={13} />
                    <span>Saved successfully</span>
                  </span>
                )}
              </div>

              <div>
                <label className="text-[11px] text-ch-text-secondary block mb-1">Display Title *</label>
                <Input
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[11px] text-ch-text-secondary block mb-1">Category</label>
                <Select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as any)}
                  options={[
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

              <div>
                <label className="text-[11px] text-ch-text-secondary block mb-1">Description</label>
                <Textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[11px] text-ch-text-secondary block mb-1">Tags (comma-separated)</label>
                <Input
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  placeholder="e.g. video, 4k, launch"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isSavingMetadata || !editTitle.trim()}
                >
                  {isSavingMetadata ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>

            {/* Danger Zone */}
            <div className="p-3 border border-danger/30 rounded-card bg-danger/5 space-y-2">
              <h4 className="font-semibold text-xs text-danger flex items-center gap-1.5">
                <AlertCircle size={14} />
                <span>Permanent Deletion</span>
              </h4>
              <p className="text-[11px] text-ch-text-secondary">
                Permanently deleting this asset removes the database record and schedules the storage binary for deletion. If you only want to remove it from a campaign, use the Unlink action in Linked Records instead.
              </p>

              {showDeleteConfirm ? (
                <div className="p-2.5 rounded bg-surface border border-danger/40 space-y-2 pt-2">
                  <p className="text-xs text-danger font-medium">
                    Are you sure? This action cannot be undone.
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="text-xs"
                    >
                      {isDeleting ? 'Deleting...' : 'Confirm Delete Asset'}
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-xs gap-1.5"
                >
                  <Trash2 size={13} />
                  <span>Delete Asset Permanently</span>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}
