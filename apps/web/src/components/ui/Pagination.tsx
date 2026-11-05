import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ page, pageSize, total, onPageChange, className }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize) || 1;
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className={cn('flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ch-text-secondary py-3', className)}>
      <span>
        Showing <span className="font-medium text-ch-text-primary">{start}</span>–
        <span className="font-medium text-ch-text-primary">{end}</span> of{' '}
        <span className="font-medium text-ch-text-primary">{total}</span> records
      </span>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="min-h-[36px] min-w-[36px] p-1.5 rounded-control border border-ch-border bg-surface hover:bg-surface-muted text-ch-text-primary flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-accent"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="px-3 py-1 font-medium text-ch-text-primary select-none">
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="min-h-[36px] min-w-[36px] p-1.5 rounded-control border border-ch-border bg-surface hover:bg-surface-muted text-ch-text-primary flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-accent"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
