import { cn } from '@/lib/cn';

type StatusType = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface StatusBadgeProps { type: StatusType; label: string; className?: string; }

const styles: Record<StatusType, string> = {
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  danger:  'bg-danger/10 text-danger border-danger/20',
  info:    'bg-info/10 text-info border-info/20',
  neutral: 'bg-surface-muted text-ch-text-secondary border-ch-border',
};

export function StatusBadge({ type, label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border',
        styles[type],
        className,
      )}
    >
      {label}
    </span>
  );
}

