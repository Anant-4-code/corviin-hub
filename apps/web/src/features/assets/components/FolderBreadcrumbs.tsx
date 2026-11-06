import React from 'react';
import { ChevronRight, Folder, FolderOpen, HardDrive } from 'lucide-react';
import { FolderBreadcrumbItem } from '@corviin-hub/shared';

interface FolderBreadcrumbsProps {
  breadcrumbs: FolderBreadcrumbItem[];
  currentFolderName?: string;
  onNavigate: (folderId: string | null) => void;
  directFileCount?: number;
}

export const FolderBreadcrumbs: React.FC<FolderBreadcrumbsProps> = ({
  breadcrumbs,
  currentFolderName,
  onNavigate,
  directFileCount,
}) => {
  return (
    <nav className="flex items-center flex-wrap gap-1 text-xs text-ch-text-secondary py-1 px-1">
      <button
        onClick={() => onNavigate(null)}
        className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-surface-muted text-ch-text-primary font-medium hover:text-accent transition-none"
        title="Root Storage"
      >
        <HardDrive size={13} className="text-accent" />
        <span>Assets</span>
      </button>

      {breadcrumbs.map((crumb, idx) => {
        const isLast = idx === breadcrumbs.length - 1;
        return (
          <React.Fragment key={crumb.id}>
            <ChevronRight size={12} className="text-ch-text-muted shrink-0" />
            <button
              onClick={() => onNavigate(crumb.id)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded transition-none ${
                isLast
                  ? 'bg-surface-selected font-semibold text-ch-text-primary'
                  : 'hover:bg-surface-muted text-ch-text-secondary hover:text-ch-text-primary'
              }`}
            >
              <Folder size={12} className={isLast ? 'text-accent' : 'text-ch-text-muted'} />
              <span className="truncate max-w-[140px] sm:max-w-[200px]">{crumb.name}</span>
            </button>
          </React.Fragment>
        );
      })}

      {currentFolderName && breadcrumbs.length === 0 && (
        <>
          <ChevronRight size={12} className="text-ch-text-muted shrink-0" />
          <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-surface-selected font-semibold text-ch-text-primary">
            <FolderOpen size={12} className="text-accent" />
            <span>{currentFolderName}</span>
          </span>
        </>
      )}

      {directFileCount !== undefined && (
        <span className="ml-2 px-1.5 py-0.5 text-[11px] font-mono rounded bg-surface-muted border border-ch-border text-ch-text-muted">
          {directFileCount} {directFileCount === 1 ? 'file' : 'files'}
        </span>
      )}
    </nav>
  );
};

