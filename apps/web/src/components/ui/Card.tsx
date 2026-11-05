import { type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface CardProps { children: ReactNode; className?: string; muted?: boolean; }

export function Card({ children, className, muted = false }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-ch-border',
        muted ? 'bg-surface-muted' : 'bg-surface',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('px-4 py-3 border-b border-ch-border', className)}>{children}</div>
  );
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('p-4', className)}>{children}</div>;
}

