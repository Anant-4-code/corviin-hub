import { FileText, Image, Video, Archive, Download, Trash2, Paperclip } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Button } from './Button';

export interface AttachmentItem {
  id: string;
  name: string;
  size: number;
  type: 'image' | 'video' | 'document' | 'archive' | 'other';
  uploadedAt: string;
  uploaderName?: string;
  url?: string;
}

interface AttachmentListProps {
  attachments: AttachmentItem[];
  onDownload?: (item: AttachmentItem) => void;
  onRemove?: (item: AttachmentItem) => void;
  readOnly?: boolean;
  className?: string;
  emptyMessage?: string;
}

export function AttachmentList({
  attachments,
  onDownload,
  onRemove,
  readOnly = false,
  className,
  emptyMessage = 'No attachments yet',
}: AttachmentListProps) {
  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getIcon = (type: AttachmentItem['type']) => {
    switch (type) {
      case 'image':
        return <Image size={16} className="text-info shrink-0" />;
      case 'video':
        return <Video size={16} className="text-warning shrink-0" />;
      case 'archive':
        return <Archive size={16} className="text-ch-text-secondary shrink-0" />;
      default:
        return <FileText size={16} className="text-accent shrink-0" />;
    }
  };

  if (attachments.length === 0) {
    return (
      <div className={cn('p-6 bg-surface border border-ch-border rounded-card text-center text-xs text-ch-text-muted', className)}>
        <Paperclip size={20} className="mx-auto mb-1.5 opacity-60" />
        <p className="font-medium text-ch-text-secondary">No attachments linked to this record</p>
        <p className="mt-0.5">Uploaded files and documents will appear here.</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {attachments.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between gap-3 p-3 bg-surface border border-ch-border rounded-control hover:bg-surface-muted/50"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded bg-surface-muted border border-ch-border">
              {getIcon(item.type)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-ch-text-primary truncate" title={item.name}>
                {item.name}
              </p>
              <p className="text-[11px] text-ch-text-secondary">
                {formatSize(item.size)} • {item.uploadedAt}
                {item.uploaderName && ` by ${item.uploaderName}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {onDownload && (
              <button
                type="button"
                onClick={() => onDownload(item)}
                className="p-1.5 rounded-control text-ch-text-secondary hover:text-ch-text-primary hover:bg-surface-muted focus-visible:outline-accent"
                title="Download attachment"
                aria-label={`Download ${item.name}`}
              >
                <Download size={15} />
              </button>
            )}
            {!readOnly && onRemove && (
              <button
                type="button"
                onClick={() => onRemove(item)}
                className="p-1.5 rounded-control text-danger hover:bg-danger/10 focus-visible:outline-danger"
                title="Remove attachment link"
                aria-label={`Remove ${item.name}`}
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

