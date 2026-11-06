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
  MoreVertical,
  Link2,
} from 'lucide-react';

interface AssetsTableViewProps {
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
      return <ImageIcon size={16} className="text-purple-500" />;
    case AssetTypeGroup.VIDEO:
      return <Video size={16} className="text-info" />;
    case AssetTypeGroup.AUDIO:
      return <Music size={16} className="text-emerald-500" />;
    case AssetTypeGroup.DOCUMENT:
      return <FileText size={16} className="text-warning" />;
    default:
      return <File size={16} className="text-ch-text-muted" />;
  }
}

export function AssetsTableView({
  assets,
  onSelectAsset,
  onPreviewAsset,
  onDownloadAsset,
}: AssetsTableViewProps) {
  if (assets.length === 0) {
    return (
      <EmptyState
        title="No assets found"
        description="Try adjusting your search criteria, clearing filters, or upload a new asset to this workspace."
      />
    );
  }

  return (
    <div className="overflow-x-auto border border-ch-border bg-surface">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-ch-border bg-surface-hover/60 text-ch-text-secondary font-medium uppercase tracking-wider text-[11px]">
            <th className="py-2.5 px-3 w-10 text-center">Type</th>
            <th className="py-2.5 px-3 min-w-[220px]">Asset Name & Filename</th>
            <th className="py-2.5 px-3">Category</th>
            <th className="py-2.5 px-3">Size & Version</th>
            <th className="py-2.5 px-3">Linked Records</th>
            <th className="py-2.5 px-3">Uploader</th>
            <th className="py-2.5 px-3">Uploaded</th>
            <th className="py-2.5 px-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ch-border">
          {assets.map((asset) => {
            const hasPreview = asset.typeGroup === AssetTypeGroup.IMAGE && asset.previewUrl;
            return (
              <tr
                key={asset.id}
                onClick={() => onSelectAsset(asset)}
                className="hover:bg-surface-hover/70 cursor-pointer transition-none group"
              >
                {/* Type Icon / Thumbnail */}
                <td className="py-2.5 px-3 text-center align-middle">
                  {hasPreview ? (
                    <div className="w-8 h-8 rounded border border-ch-border overflow-hidden mx-auto bg-surface flex items-center justify-center">
                      <img
                        src={asset.previewUrl}
                        alt={asset.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded border border-ch-border bg-surface-hover/40 flex items-center justify-center mx-auto">
                      {getAssetIcon(asset.typeGroup)}
                    </div>
                  )}
                </td>

                {/* Title & Filename */}
                <td className="py-2.5 px-3 align-middle">
                  <div className="font-semibold text-ch-text-primary text-xs truncate max-w-xs sm:max-w-sm">
                    {asset.title}
                  </div>
                  <div className="text-[11px] text-ch-text-muted font-mono truncate max-w-xs">
                    {asset.originalFileName}
                  </div>
                </td>

                {/* Category Badge */}
                <td className="py-2.5 px-3 align-middle">
                  <Badge variant="secondary" size="sm" className="text-[10px]">
                    {asset.category.replace(/_/g, ' ')}
                  </Badge>
                </td>

                {/* Size & Version */}
                <td className="py-2.5 px-3 align-middle whitespace-nowrap">
                  <span className="font-mono text-ch-text-secondary">{formatBytes(asset.sizeBytes)}</span>
                  <span className="ml-1.5 px-1 py-0.5 text-[10px] font-mono rounded bg-surface-hover text-ch-text-muted border border-ch-border">
                    v{asset.currentVersionNumber}
                  </span>
                </td>

                {/* Linked Records */}
                <td className="py-2.5 px-3 align-middle">
                  {asset.relationships && asset.relationships.length > 0 ? (
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                      {asset.relationships.map((rel) => (
                        <span
                          key={rel.id}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] rounded bg-primary/10 text-primary border border-primary/20 truncate"
                          title={`${rel.relatedType}: ${rel.relatedTitle}`}
                        >
                          <Link2 size={10} className="shrink-0" />
                          <span className="truncate max-w-[120px]">{rel.relatedTitle}</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-ch-text-muted text-[11px]">—</span>
                  )}
                </td>

                {/* Uploader */}
                <td className="py-2.5 px-3 align-middle whitespace-nowrap">
                  <span className="text-ch-text-secondary font-medium">{asset.uploaderName}</span>
                </td>

                {/* Upload Date */}
                <td className="py-2.5 px-3 align-middle whitespace-nowrap text-ch-text-muted text-[11px]">
                  {new Date(asset.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>

                {/* Actions */}
                <td className="py-2.5 px-3 align-middle text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPreviewAsset(asset)}
                      title="Preview Asset"
                      aria-label={`Preview ${asset.title}`}
                      className="p-1 text-ch-text-muted hover:text-ch-text-primary"
                    >
                      <Eye size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDownloadAsset(asset)}
                      title="Authorized Download"
                      aria-label={`Download ${asset.title}`}
                      className="p-1 text-ch-text-muted hover:text-ch-text-primary"
                    >
                      <Download size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSelectAsset(asset)}
                      title="View Details"
                      aria-label={`View details for ${asset.title}`}
                      className="p-1 text-ch-text-muted hover:text-ch-text-primary"
                    >
                      <MoreVertical size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
