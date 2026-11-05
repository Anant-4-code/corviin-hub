import { type ReactNode } from 'react';
import { DataTable, type Column } from './DataTable';
import { Card, CardBody } from './Card';
import { cn } from '@/lib/cn';

interface ResponsiveRecordListProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  renderCard: (item: T) => ReactNode;
  onItemClick?: (item: T) => void;
  emptyMessage?: string;
  className?: string;
}

export function ResponsiveRecordList<T>({
  columns,
  data,
  keyExtractor,
  renderCard,
  onItemClick,
  emptyMessage = 'No records available.',
  className,
}: ResponsiveRecordListProps<T>) {
  if (data.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-ch-text-secondary border border-ch-border rounded-lg bg-surface">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Mobile Card Stack */}
      <div className="block md:hidden space-y-3">
        {data.map((item) => (
          <div
            key={keyExtractor(item)}
            onClick={() => onItemClick?.(item)}
            className={cn(onItemClick && 'cursor-pointer')}
          >
            <Card className="hover:border-accent">
              <CardBody>{renderCard(item)}</CardBody>
            </Card>
          </div>
        ))}
      </div>

      {/* Desktop Data Table */}
      <div className="hidden md:block">
        <DataTable
          columns={columns}
          data={data}
          keyExtractor={keyExtractor}
          onRowClick={onItemClick}
          emptyMessage={emptyMessage}
        />
      </div>
    </div>
  );
}
