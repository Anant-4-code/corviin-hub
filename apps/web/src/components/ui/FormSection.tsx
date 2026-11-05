import { type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
  columns?: 1 | 2 | 3;
  className?: string;
}

export function FormSection({
  title,
  description,
  children,
  action,
  columns = 2,
  className,
}: FormSectionProps) {
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  };

  return (
    <section className={cn('p-4 sm:p-5 bg-surface border border-ch-border rounded-card', className)}>
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-ch-border">
        <div>
          <h3 className="text-sm font-semibold text-ch-text-primary">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-ch-text-secondary">{description}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className={cn('pt-4 grid gap-4', columnClasses[columns])}>
        {children}
      </div>
    </section>
  );
}
