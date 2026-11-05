import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

export function Breadcrumbs({ items, showHome = true, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumbs" className={cn('flex items-center text-xs text-ch-text-secondary', className)}>
      <ol className="flex items-center flex-wrap gap-1.5 list-none p-0 m-0">
        {showHome && (
          <li className="flex items-center gap-1.5">
            <Link
              to="/app/dashboard"
              className="flex items-center gap-1 text-ch-text-muted hover:text-ch-text-primary p-0.5 rounded focus-visible:outline-accent"
              aria-label="Dashboard home"
            >
              <Home size={13} className="shrink-0" />
            </Link>
            <ChevronRight size={12} className="text-ch-text-muted shrink-0" aria-hidden="true" />
          </li>
        )}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className="hover:text-ch-text-primary text-ch-text-secondary truncate max-w-[150px] sm:max-w-xs focus-visible:outline-accent"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    'truncate max-w-[180px] sm:max-w-sm',
                    isLast ? 'font-medium text-ch-text-primary' : 'text-ch-text-secondary'
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <ChevronRight size={12} className="text-ch-text-muted shrink-0" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
