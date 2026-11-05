import { cn } from '@/lib/cn';

type Priority = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';

const config: Record<Priority, { label: string; className: string }> = {
  URGENT: { label: 'Urgent', className: 'text-danger' },
  HIGH:   { label: 'High',   className: 'text-warning' },
  MEDIUM: { label: 'Medium', className: 'text-info' },
  LOW:    { label: 'Low',    className: 'text-ch-text-muted' },
};

export function PriorityIndicator({ priority, showLabel = true }: { priority: Priority; showLabel?: boolean }) {
  const { label, className } = config[priority];
  return (
    <span className={cn('inline-flex items-center gap-1 text-xs font-medium', className)}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden />
      {showLabel && label}
    </span>
  );
}

