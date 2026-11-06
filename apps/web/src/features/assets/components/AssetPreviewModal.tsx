import { AssetItem, AssetTypeGroup } from '@corviin-hub/shared';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Download, ExternalLink, Image as ImageIcon, Video, Music, FileText, File } from 'lucide-react';

interface AssetPreviewModalProps {
  asset: AssetItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (asset: AssetItem) => void;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function AssetPreviewModal({
  asset,
  isOpen,
  onClose,
  onDownload,
}: AssetPreviewModalProps) {
  if (!asset) return null;

  const isImage = asset.typeGroup === AssetTypeGroup.IMAGE;
  const isVideo = asset.typeGroup === AssetTypeGroup.VIDEO;
  const isAudio = asset.typeGroup === AssetTypeGroup.AUDIO;

  return (
    <Dialog open={isOpen} onClose={onClose} title={asset.title} size="lg">
      <div className="space-y-4">
        {/* Preview Container */}
        <div className="bg-surface-hover/60 border border-ch-border rounded overflow-hidden min-h-[220px] max-h-[70vh] flex items-center justify-center p-2">
          {isImage && asset.previewUrl ? (
            <img
              src={asset.previewUrl}
              alt={asset.title}
              className="max-h-[60vh] max-w-full object-contain mx-auto"
            />
          ) : isVideo ? (
            <div className="flex flex-col items-center justify-center p-8 text-center space-y-2">
              <Video size={48} className="text-info mx-auto" />
              <p className="font-semibold text-xs text-ch-text-primary">Video Preview ({asset.mimeType})</p>
              <p className="text-[11px] text-ch-text-muted max-w-xs">
                To stream or edit this high-definition master binary, request an authorized download link.
              </p>
            </div>
          ) : isAudio ? (
            <div className="flex flex-col items-center justify-center p-8 text-center space-y-2">
              <Music size={48} className="text-emerald-500 mx-auto" />
              <p className="font-semibold text-xs text-ch-text-primary">Audio Stem Recording</p>
              <p className="text-[11px] text-ch-text-muted">{asset.originalFileName}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center space-y-2">
              <FileText size={48} className="text-warning mx-auto" />
              <p className="font-semibold text-xs text-ch-text-primary">Document File</p>
              <p className="text-[11px] text-ch-text-muted">{asset.originalFileName}</p>
            </div>
          )}
        </div>

        {/* Metadata Footer */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-ch-border text-xs">
          <div className="space-y-0.5">
            <p className="font-mono text-ch-text-secondary">{asset.originalFileName}</p>
            <p className="text-ch-text-muted text-[11px]">
              {formatBytes(asset.sizeBytes)} • Version {asset.currentVersionNumber} • Uploaded by {asset.uploaderName}
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="flex-1 sm:flex-none text-xs"
            >
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onDownload(asset)}
              className="gap-1.5 flex-1 sm:flex-none text-xs"
            >
              <Download size={13} />
              <span>Download File</span>
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
