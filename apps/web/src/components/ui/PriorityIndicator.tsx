import { cn } from '@/lib/cn';

export type Priority = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';

const config: Record<Priority, { label: string; className: string }> = {
  URGENT: { label: 'Urgent', className: 'text-danger' },
  HIGH:   { label: 'High',   className: 'text-warning' },
  MEDIUM: { label: 'Medium', className: 'text-info' },
  LOW:    { label: 'Low',    className: 'text-ch-text-secondary' },
};

export function PriorityIndicator({
  priority,
  showLabel = true,
  className,
}: {
  priority: Priority;
  showLabel?: boolean;
  className?: string;
}) {
  const { label, className: colorClass } = config[priority];
  return (
    <span
      className={cn('inline-flex items-center gap-1.5 text-xs font-medium', colorClass, className)}
      title={`Priority: ${label}`}
      aria-label={`Priority: ${label}`}
    >
      <span className="w-2 h-2 rounded-full bg-current shrink-0" aria-hidden="true" />
      {showLabel && <span>{label}</span>}
    </span>
  );
}
