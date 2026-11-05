import { type ReactNode } from 'react';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      {Icon && (
        <div className="w-10 h-10 rounded-lg bg-surface-muted border border-ch-border flex items-center justify-center mb-4">
          <Icon size={20} className="text-ch-text-muted" />
        </div>
      )}
      <h3 className="text-sm font-semibold text-ch-text-primary mb-1">{title}</h3>
      <p className="text-sm text-ch-text-secondary max-w-xs">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-4 py-2 bg-accent text-accent-foreground text-sm font-medium rounded-control hover:opacity-90"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export function LoadingState({ message = 'Loading…' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center py-12 px-4">
      <span className="text-sm text-ch-text-secondary">{message}</span>
    </div>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-10 h-10 rounded-lg bg-danger/10 border border-danger/20 flex items-center justify-center mb-4">
        <span className="text-danger text-lg font-bold">!</span>
      </div>
      <h3 className="text-sm font-semibold text-ch-text-primary mb-1">{title}</h3>
      <p className="text-sm text-ch-text-secondary max-w-xs">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-surface text-ch-text-primary text-sm font-medium rounded-control border border-ch-border hover:bg-surface-muted"
        >
          Try again
        </button>
      )}
    </div>
  );
}

