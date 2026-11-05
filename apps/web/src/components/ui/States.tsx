import { type ReactNode } from 'react';
import { type LucideIcon, AlertTriangle, ShieldAlert, WifiOff, Search, FilterX } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center bg-surface border border-ch-border rounded-card', className)}>
      {Icon && (
        <div className="w-11 h-11 rounded-full bg-surface-muted border border-ch-border flex items-center justify-center mb-3">
          <Icon size={20} className="text-ch-text-secondary" />
        </div>
      )}
      <h3 className="text-base font-semibold text-ch-text-primary mb-1">{title}</h3>
      <p className="text-sm text-ch-text-secondary max-w-sm mb-4">{description}</p>
      
      {(action || secondaryAction) && (
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {action && (
            <Button type="button" variant="primary" size="md" onClick={action.onClick}>
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button type="button" variant="secondary" size="md" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export function SearchEmptyState({
  query,
  onClear,
  className,
}: {
  query: string;
  onClear: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={Search}
      title="No matching records found"
      description={`No items matched your search query "${query}". Check for spelling errors or try broader keywords.`}
      action={{ label: 'Clear search query', onClick: onClear }}
      className={className}
    />
  );
}

export function FilterEmptyState({
  onReset,
  className,
}: {
  onReset: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={FilterX}
      title="No records match current filters"
      description="The active filter combination produced zero matching records. Reset filters to see all available data."
      action={{ label: 'Reset all filters', onClick: onReset }}
      className={className}
    />
  );
}

export function LoadingState({
  message = 'Loading data…',
  description = 'Fetching the latest workspace records.',
  className,
}: {
  message?: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      {/* Static non-animated indicator */}
      <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent mb-3" />
      <span className="text-sm font-medium text-ch-text-primary">{message}</span>
      {description && <span className="text-xs text-ch-text-secondary mt-1">{description}</span>}
    </div>
  );
}

/** Static layout placeholder skeleton (No shimmer, no animation) */
export function LoadingSkeleton({
  rows = 4,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-3 p-4 bg-surface border border-ch-border rounded-card', className)}>
      <div className="h-5 bg-surface-muted rounded-control w-1/4" />
      <div className="h-4 bg-surface-muted rounded-control w-1/2" />
      <div className="pt-2 space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-10 bg-surface-muted rounded-control w-full" />
        ))}
      </div>
    </div>
  );
}

export function ErrorState({
  title = 'Unable to complete request',
  message = 'An unexpected error occurred while communicating with the server. Your unsaved input is retained.',
  onRetry,
  onBack,
  className,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onBack?: () => void;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center bg-surface border border-ch-border rounded-card', className)}>
      <div className="w-11 h-11 rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center mb-3 text-danger">
        <AlertTriangle size={20} />
      </div>
      <h3 className="text-base font-semibold text-ch-text-primary mb-1">{title}</h3>
      <p className="text-sm text-ch-text-secondary max-w-sm mb-4">{message}</p>
      
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {onRetry && (
          <Button type="button" variant="primary" size="md" onClick={onRetry}>
            Retry request
          </Button>
        )}
        {onBack && (
          <Button type="button" variant="secondary" size="md" onClick={onBack}>
            Return to previous view
          </Button>
        )}
      </div>
    </div>
  );
}

export function PermissionDeniedState({
  workspaceName = 'Current Workspace',
  onSwitchWorkspace,
  className,
}: {
  workspaceName?: string;
  onSwitchWorkspace?: () => void;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center bg-surface border border-ch-border rounded-card', className)}>
      <div className="w-11 h-11 rounded-full bg-warning/10 border border-warning/20 flex items-center justify-center mb-3 text-warning">
        <ShieldAlert size={20} />
      </div>
      <h3 className="text-base font-semibold text-ch-text-primary mb-1">Access Restricted</h3>
      <p className="text-sm text-ch-text-secondary max-w-sm mb-4">
        This record or module is scoped to another workspace or your current acting profile lacks sufficient permissions in {workspaceName}.
      </p>
      {onSwitchWorkspace && (
        <Button type="button" variant="secondary" size="md" onClick={onSwitchWorkspace}>
          Switch active workspace
        </Button>
      )}
    </div>
  );
}

export function OfflineState({
  onRetry,
  className,
}: {
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center bg-surface border border-ch-border rounded-card', className)}>
      <div className="w-11 h-11 rounded-full bg-surface-muted border border-ch-border flex items-center justify-center mb-3 text-ch-text-muted">
        <WifiOff size={20} />
      </div>
      <h3 className="text-base font-semibold text-ch-text-primary mb-1">No Network Connection</h3>
      <p className="text-sm text-ch-text-secondary max-w-sm mb-4">
        Unable to reach the CORVIIN HUB API. Please verify your internet connection. Unsaved changes are cached locally.
      </p>
      {onRetry && (
        <Button type="button" variant="primary" size="md" onClick={onRetry}>
          Check connection & retry
        </Button>
      )}
    </div>
  );
}
