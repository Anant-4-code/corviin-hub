import { useState, useRef, type ChangeEvent, type DragEvent } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Button } from './Button';

export interface UploadedFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  errorMessage?: string;
}

interface FileUploaderProps {
  accept?: string;
  maxSizeMb?: number;
  multiple?: boolean;
  destinationLabel?: string;
  onFilesSelected?: (files: File[]) => void;
  className?: string;
}

export function FileUploader({
  accept = 'image/*,application/pdf,video/mp4',
  maxSizeMb = 25,
  multiple = false,
  destinationLabel = 'Uploaded files will be saved to the active workspace asset library.',
  onFilesSelected,
  className,
}: FileUploaderProps) {
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFiles = (incomingFiles: FileList | null) => {
    if (!incomingFiles || incomingFiles.length === 0) return;

    const fileList = Array.from(incomingFiles);
    const maxSizeBytes = maxSizeMb * 1024 * 1024;

    const newItems: UploadedFileItem[] = fileList.map((file) => {
      const isOversized = file.size > maxSizeBytes;
      return {
        id: Math.random().toString(36).substring(2, 9),
        file,
        name: file.name,
        size: file.size,
        progress: isOversized ? 0 : 100,
        status: isOversized ? 'error' : 'completed',
        errorMessage: isOversized
          ? `File exceeds the maximum size limit of ${maxSizeMb} MB.`
          : undefined,
      };
    });

    setFiles((prev) => (multiple ? [...prev, ...newItems] : newItems));
    if (onFilesSelected) {
      onFilesSelected(fileList);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    if (inputRef.current) inputRef.current.value = '';
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const retryFile = (id: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, status: 'completed', progress: 100, errorMessage: undefined } : f,
      ),
    );
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Drop area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'p-6 border-2 border-dashed rounded-card text-center cursor-pointer select-none',
          'bg-surface hover:bg-surface-muted',
          isDragOver ? 'border-accent bg-accent/5' : 'border-ch-border-strong',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
          aria-label="Upload file"
        />

        <div className="flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-surface-muted border border-ch-border flex items-center justify-center mb-2 text-ch-text-secondary">
            <UploadCloud size={20} />
          </div>
          <p className="text-sm font-medium text-ch-text-primary">
            Click to upload or drag and drop files here
          </p>
          <p className="text-xs text-ch-text-secondary mt-1">
            Accepted formats: {accept.replace(/[*.]/g, '')} • Maximum size: {maxSizeMb} MB
          </p>
        </div>
      </div>

      {destinationLabel && (
        <p className="text-xs text-ch-text-muted">{destinationLabel}</p>
      )}

      {/* Selected file list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-surface border border-ch-border rounded-control flex flex-col gap-2"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText size={18} className="text-ch-text-secondary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ch-text-primary truncate">{item.name}</p>
                    <p className="text-xs text-ch-text-secondary">{formatFileSize(item.size)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.status === 'completed' && (
                    <span className="inline-flex items-center gap-1 text-xs text-success font-medium">
                      <CheckCircle2 size={14} /> Ready
                    </span>
                  )}
                  {item.status === 'error' && (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-xs text-danger font-medium">
                        <AlertCircle size={14} /> Failed
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          retryFile(item.id);
                        }}
                        className="h-7 px-2 text-xs"
                      >
                        <RotateCcw size={12} /> Retry
                      </Button>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(item.id);
                    }}
                    className="p-1 text-ch-text-muted hover:text-ch-text-primary rounded focus-visible:outline-accent"
                    aria-label={`Remove file ${item.name}`}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Static Progress Indicator (No Animation) */}
              <div className="w-full bg-surface-muted h-1.5 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full',
                    item.status === 'error' ? 'bg-danger' : 'bg-accent',
                  )}
                  style={{ width: `${item.progress}%` }}
                />
              </div>

              {item.errorMessage && (
                <p className="text-xs text-danger">{item.errorMessage}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

