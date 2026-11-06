import { AssetItem, AssetTypeGroup } from '@corviin-hub/shared';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/States';
import {
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  File,
  Eye,
  Download,
  Link2,
} from 'lucide-react';

interface AssetsGridViewProps {
  assets: AssetItem[];
  onSelectAsset: (asset: AssetItem) => void;
  onPreviewAsset: (asset: AssetItem) => void;
  onDownloadAsset: (asset: AssetItem) => void;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function getAssetIcon(typeGroup: AssetTypeGroup) {
  switch (typeGroup) {
    case AssetTypeGroup.IMAGE:
      return <ImageIcon size={28} className="text-purple-500" />;
    case AssetTypeGroup.VIDEO:
      return <Video size={28} className="text-info" />;
    case AssetTypeGroup.AUDIO:
      return <Music size={28} className="text-emerald-500" />;
    case AssetTypeGroup.DOCUMENT:
      return <FileText size={28} className="text-warning" />;
    default:
      return <File size={28} className="text-ch-text-muted" />;
  }
}

export function AssetsGridView({
  assets,
  onSelectAsset,
  onPreviewAsset,
  onDownloadAsset,
}: AssetsGridViewProps) {
  if (assets.length === 0) {
    return (
      <EmptyState
        title="No assets found"
        description="Try adjusting your search criteria, clearing filters, or upload a new asset to this workspace."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {assets.map((asset) => {
        const isImage = asset.typeGroup === AssetTypeGroup.IMAGE;
        const hasPreview = isImage && Boolean(asset.previewUrl);

        return (
          <div
            key={asset.id}
            onClick={() => onSelectAsset(asset)}
            className="flex flex-col rounded-card border border-ch-border bg-surface hover:border-ch-text-muted cursor-pointer transition-none group overflow-hidden"
          >
            {/* Thumbnail / Header Preview Area */}
            <div className="h-32 bg-surface-hover/50 border-b border-ch-border flex items-center justify-center relative overflow-hidden">
              {hasPreview ? (
                <img
                  src={asset.previewUrl}
                  alt={asset.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-1.5 p-4 text-center">
                  {getAssetIcon(asset.typeGroup)}
                  <span className="text-[10px] font-mono uppercase tracking-wider text-ch-text-muted">
                    {asset.mimeType.split('/')[1] || asset.typeGroup}
                  </span>
                </div>
              )}

              {/* Version & Category Pill floating in corner */}
              <div className="absolute top-2 left-2 flex items-center gap-1">
                <Badge variant="secondary" size="sm" className="text-[10px] bg-surface/90 backdrop-blur-none border-ch-border">
                  {asset.category.replace(/_/g, ' ')}
                </Badge>
              </div>
              <div className="absolute top-2 right-2">
                <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-surface/90 text-ch-text-secondary border border-ch-border">
                  v{asset.currentVersionNumber}
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <h4 className="font-semibold text-xs text-ch-text-primary line-clamp-1 title" title={asset.title}>
                  {asset.title}
                </h4>
                <p className="text-[11px] font-mono text-ch-text-muted truncate mt-0.5" title={asset.originalFileName}>
                  {asset.originalFileName}
                </p>
              </div>

              {/* Linked Record Chip */}
              {asset.relationships && asset.relationships.length > 0 && (
                <div className="pt-0.5">
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] rounded bg-primary/10 text-primary border border-primary/20 truncate max-w-full">
                    <Link2 size={10} className="shrink-0" />
                    <span className="truncate">{asset.relationships[0].relatedTitle}</span>
                  </span>
                </div>
              )}

              {/* Footer Meta & Actions */}
              <div className="pt-2 border-t border-ch-border/50 flex items-center justify-between text-[11px] text-ch-text-muted">
                <div className="flex flex-col">
                  <span className="font-mono text-ch-text-secondary">{formatBytes(asset.sizeBytes)}</span>
                  <span className="text-[10px] truncate max-w-[100px]">{asset.uploaderName}</span>
                </div>

                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onPreviewAsset(asset)}
                    title="Quick Preview"
                    aria-label={`Preview ${asset.title}`}
                    className="p-1 h-7 w-7 text-ch-text-muted hover:text-ch-text-primary"
                  >
                    <Eye size={13} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDownloadAsset(asset)}
                    title="Authorized Download"
                    aria-label={`Download ${asset.title}`}
                    className="p-1 h-7 w-7 text-ch-text-muted hover:text-ch-text-primary"
                  >
                    <Download size={13} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
