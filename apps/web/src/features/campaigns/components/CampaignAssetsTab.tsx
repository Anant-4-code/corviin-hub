import React, { useState } from 'react';
import {
  CampaignAssetLink,
  CampaignAssetCategory,
  CampaignStage,
} from '@corviin-hub/shared';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import {
  Paperclip,
  Upload,
  Link2,
  Trash2,
  FileText,
  Video,
  Image,
  Music,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

interface CampaignAssetsTabProps {
  assets: CampaignAssetLink[];
  campaignStage: CampaignStage;
  onLinkAsset: (dto: {
    title: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    category: CampaignAssetCategory;
    stage: CampaignStage;
    url: string;
    isFinalApproved?: boolean;
  }) => Promise<void>;
  onUnlinkAsset: (linkId: string) => Promise<void>;
}

export function CampaignAssetsTab({
  assets,
  campaignStage,
  onLinkAsset,
  onUnlinkAsset,
}: CampaignAssetsTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isLinkExistingOpen, setIsLinkExistingOpen] = useState(false);

  // Form states
  const [assetTitle, setAssetTitle] = useState('');
  const [assetFileName, setAssetFileName] = useState('');
  const [assetCategory, setAssetCategory] = useState<CampaignAssetCategory>('RAW_FOOTAGE');
  const [assetUrl, setAssetUrl] = useState('');
  const [isFinalApproved, setIsFinalApproved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredAssets = selectedCategory
    ? assets.filter((a) => a.category === selectedCategory)
    : assets;

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetTitle.trim() || !assetUrl.trim()) return;

    try {
      setIsSubmitting(true);
      await onLinkAsset({
        title: assetTitle.trim(),
        fileName: assetFileName.trim() || `${assetTitle.toLowerCase().replace(/\s+/g, '_')}.mp4`,
        fileSize: 104857600, // 100MB placeholder
        mimeType: assetCategory === 'RAW_FOOTAGE' || assetCategory === 'DRAFT_EDITS' || assetCategory === 'FINAL_APPROVED' ? 'video/mp4' : 'text/plain',
        category: assetCategory,
        stage: campaignStage,
        url: assetUrl.trim(),
        isFinalApproved,
      });
      setIsUploadOpen(false);
      setAssetTitle('');
      setAssetFileName('');
      setAssetUrl('');
      setIsFinalApproved(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryIcon = (cat: CampaignAssetCategory) => {
    switch (cat) {
      case 'RAW_FOOTAGE':
      case 'DRAFT_EDITS':
      case 'FINAL_APPROVED':
        return <Video size={14} className="text-purple-500 shrink-0" />;
      case 'IMAGES':
      case 'PUBLISHED_PROOF':
        return <Image size={14} className="text-info shrink-0" />;
      case 'AUDIO_VO':
        return <Music size={14} className="text-amber-500 shrink-0" />;
      default:
        return <FileText size={14} className="text-ch-text-muted shrink-0" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-ch-border">
        <div>
          <h3 className="text-sm font-bold text-ch-text-primary flex items-center gap-1.5">
            <Paperclip size={16} className="text-primary" />
            Campaign Assets ({assets.length})
          </h3>
          <p className="text-xs text-ch-text-secondary mt-0.5">
            Default view shows only assets linked to this campaign. Unlinking preserves the underlying file in global storage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsUploadOpen(true)}
            className="text-xs h-8 gap-1.5"
          >
            <Upload size={14} />
            <span>Upload & Link Asset</span>
          </Button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-2.5 py-1 text-xs font-medium border transition-none ${
            selectedCategory === ''
              ? 'border-primary bg-primary text-white font-bold'
              : 'border-ch-border bg-surface text-ch-text-secondary hover:bg-surface-muted'
          }`}
        >
          All ({assets.length})
        </button>
        {[
          'RAW_FOOTAGE',
          'SCRIPTS',
          'DRAFT_EDITS',
          'FINAL_APPROVED',
          'REFERENCES',
          'IMAGES',
          'AUDIO_VO',
          'PUBLISHED_PROOF',
        ].map((cat) => {
          const count = assets.filter((a) => a.category === cat).length;
          if (count === 0) return null;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-xs font-medium border transition-none ${
                selectedCategory === cat
                  ? 'border-primary bg-primary text-white font-bold'
                  : 'border-ch-border bg-surface text-ch-text-secondary hover:bg-surface-muted'
              }`}
            >
              {cat.replace('_', ' ')} ({count})
            </button>
          );
        })}
      </div>

      {/* Assets Grid */}
      {filteredAssets.length === 0 ? (
        <div className="text-center py-12 border border-ch-border bg-surface text-xs text-ch-text-secondary">
          No assets linked in this category. Upload raw clips, scripts, or final edits.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredAssets.map((link) => (
            <div
              key={link.id}
              className="p-3 border border-ch-border bg-surface flex flex-col justify-between space-y-3 text-xs"
            >
              <div className="space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {getCategoryIcon(link.category)}
                    <span className="font-bold text-ch-text-primary truncate">{link.title}</span>
                  </div>
                  {link.isFinalApproved && (
                    <Badge variant="success">Final Master</Badge>
                  )}
                </div>

                <div className="text-[11px] text-ch-text-secondary font-mono truncate">
                  {link.fileName}
                </div>

                <div className="flex items-center gap-2 text-[10px] text-ch-text-muted">
                  <span className="bg-surface-muted px-1.5 py-0.5 border border-ch-border">
                    {link.category.replace('_', ' ')}
                  </span>
                  <span>{(link.fileSize / 1048576).toFixed(1)} MB</span>
                  <span>Stage: {link.stage}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 border-t border-ch-border flex items-center justify-between text-xs">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1 font-semibold text-[11px]"
                >
                  <ExternalLink size={12} />
                  <span>Open File</span>
                </a>

                <button
                  type="button"
                  onClick={() => onUnlinkAsset(link.id)}
                  title="Unlink from campaign (does not delete file)"
                  className="text-danger hover:text-danger/80 flex items-center gap-1 text-[11px]"
                >
                  <Trash2 size={12} />
                  <span>Unlink</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload & Link Modal */}
      <Dialog
        open={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Upload & Link Campaign Asset"
        description="Stores asset in the global library and establishes an explicit campaign relationship."
        size="md"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
          <FormField label="Asset Title *" required>
            <Input
              value={assetTitle}
              onChange={(e) => setAssetTitle(e.target.value)}
              placeholder="e.g. Master 4K Drone Sunrise Flyover"
              required
              className="text-xs"
            />
          </FormField>

          <FormField label="File Name">
            <Input
              value={assetFileName}
              onChange={(e) => setAssetFileName(e.target.value)}
              placeholder="e.g. drone_sunrise_4k.mp4"
              className="text-xs font-mono"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Category *">
              <Select
                value={assetCategory}
                onChange={(e) => setAssetCategory(e.target.value as CampaignAssetCategory)}
                className="text-xs"
              >
                <option value="RAW_FOOTAGE">Raw Footage</option>
                <option value="SCRIPTS">Scripts / Copy</option>
                <option value="DRAFT_EDITS">Draft Edits</option>
                <option value="FINAL_APPROVED">Final Approved Master</option>
                <option value="REFERENCES">References & Research</option>
                <option value="IMAGES">Images / Banners</option>
                <option value="AUDIO_VO">Audio / Voiceover</option>
                <option value="PUBLISHED_PROOF">Published Proof</option>
                <option value="OTHER">Other Documents</option>
              </Select>
            </FormField>

            <FormField label="Storage URL / S3 Path *" required>
              <Input
                value={assetUrl}
                onChange={(e) => setAssetUrl(e.target.value)}
                placeholder="https://storage.corviin.internal/..."
                required
                className="text-xs font-mono"
              />
            </FormField>
          </div>

          <label className="flex items-center gap-2 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={isFinalApproved}
              onChange={(e) => setIsFinalApproved(e.target.checked)}
              className="w-4 h-4 rounded-none accent-primary"
            />
            <span className="text-xs font-semibold text-ch-text-primary">
              Mark as officially approved final master asset
            </span>
          </label>

          <div className="pt-3 border-t border-ch-border flex items-center justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsUploadOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={isSubmitting}>
              {isSubmitting ? 'Linking...' : 'Confirm & Link Asset'}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

