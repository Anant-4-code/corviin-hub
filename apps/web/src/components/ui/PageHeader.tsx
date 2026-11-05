import { type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Breadcrumbs, type BreadcrumbItem } from './Breadcrumbs';

export type { BreadcrumbItem };

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  action?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, breadcrumbs, action, className }: PageHeaderProps) {
  return (
    <div className={cn('pb-4 border-b border-ch-border', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs items={breadcrumbs} className="mb-2" />
      )}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-ch-text-primary leading-tight">{title}</h1>
          {description && (
            <p className="mt-0.5 text-sm text-ch-text-secondary">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
