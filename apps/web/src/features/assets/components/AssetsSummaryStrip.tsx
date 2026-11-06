import { AssetItem, AssetStorageSummary, AssetTypeGroup } from '@corviin-hub/shared';
import { Card } from '@/components/ui/Card';
import { FolderGit2, HardDrive, Image as ImageIcon, FileText, Megaphone } from 'lucide-react';

interface AssetsSummaryStripProps {
  summary?: AssetStorageSummary;
  assets?: AssetItem[];
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function AssetsSummaryStrip({ summary, assets = [] }: AssetsSummaryStripProps) {
  const totalCount = summary?.totalCount ?? assets.length;
  const totalSize = summary?.totalSizeBytes ?? assets.reduce((acc, a) => acc + a.sizeBytes, 0);

  const mediaCount = summary
    ? summary.byType.images + summary.byType.videos + summary.byType.audio
    : assets.filter((a) => [AssetTypeGroup.IMAGE, AssetTypeGroup.VIDEO, AssetTypeGroup.AUDIO].includes(a.typeGroup)).length;

  const docCount = summary
    ? summary.byType.documents
    : assets.filter((a) => a.typeGroup === AssetTypeGroup.DOCUMENT).length;

  const linkedCount = assets.filter((a) => a.relationships && a.relationships.length > 0).length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      <Card className="p-3 border border-ch-border bg-surface">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-ch-text-secondary">Total Assets</span>
          <HardDrive size={14} className="text-primary" />
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-xl font-bold text-ch-text-primary">{totalCount}</span>
          <span className="text-[11px] text-ch-text-muted">files</span>
        </div>
      </Card>

      <Card className="p-3 border border-ch-border bg-surface">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-ch-text-secondary">Storage Used</span>
          <FolderGit2 size={14} className="text-info" />
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-xl font-bold text-info">{formatBytes(totalSize)}</span>
          <span className="text-[11px] text-ch-text-muted">in S3/R2</span>
        </div>
      </Card>

      <Card className="p-3 border border-ch-border bg-surface">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-ch-text-secondary">Media & Rushes</span>
          <ImageIcon size={14} className="text-purple-500" />
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-xl font-bold text-purple-500">{mediaCount}</span>
          <span className="text-[11px] text-ch-text-muted">photos/videos</span>
        </div>
      </Card>

      <Card className="p-3 border border-ch-border bg-surface">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-ch-text-secondary">Docs & Scripts</span>
          <FileText size={14} className="text-warning" />
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-xl font-bold text-warning">{docCount}</span>
          <span className="text-[11px] text-ch-text-muted">documents</span>
        </div>
      </Card>

      <Card className="p-3 border border-ch-border bg-surface col-span-2 sm:col-span-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-ch-text-secondary">Campaign Linked</span>
          <Megaphone size={14} className="text-success" />
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-xl font-bold text-success">{linkedCount}</span>
          <span className="text-[11px] text-ch-text-muted">active links</span>
        </div>
      </Card>
    </div>
  );
}

