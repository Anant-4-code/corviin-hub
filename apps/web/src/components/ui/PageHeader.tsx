import { type ReactNode } from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';

interface BreadcrumbItem { label: string; path?: string; }

export function Breadcrumbs({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1 text-xs text-ch-text-muted', className)}>
      <Link to="/app/dashboard" className="hover:text-ch-text-primary flex items-center gap-1">
        <Home size={12} />
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight size={12} />
          {item.path && i < items.length - 1 ? (
            <Link to={item.path} className="hover:text-ch-text-primary">{item.label}</Link>
          ) : (
            <span className={i === items.length - 1 ? 'text-ch-text-secondary font-medium' : ''}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

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

