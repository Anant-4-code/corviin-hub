import { type ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = 'No records found.',
  className,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-ch-text-secondary border border-ch-border rounded-lg bg-surface">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn('overflow-x-auto border border-ch-border rounded-lg bg-surface', className)}>
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="border-b border-ch-border bg-surface-muted text-xs font-semibold text-ch-text-secondary uppercase">
            {columns.map((col) => (
              <th key={col.key} className={cn('py-2.5 px-4', col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ch-border">
          {data.map((item) => (
            <tr
              key={keyExtractor(item)}
              onClick={() => onRowClick?.(item)}
              className={cn(
                'text-ch-text-primary hover:bg-surface-muted/50',
                onRowClick && 'cursor-pointer',
              )}
            >
              {columns.map((col) => (
                <td key={col.key} className={cn('py-3 px-4', col.className)}>
                  {col.render ? col.render(item) : (item as any)[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

