import React from 'react';
import { cn } from '@/lib/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  size?: 'sm' | 'md';
}

const variantStyles: Record<string, string> = {
  primary: 'bg-primary/10 text-primary border-primary/20',
  secondary: 'bg-surface-muted text-ch-text-secondary border-ch-border',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  danger: 'bg-danger/10 text-danger border-danger/20',
  info: 'bg-info/10 text-info border-info/20',
  outline: 'bg-transparent text-ch-text-secondary border-ch-border',
};

export function Badge({
  children,
  variant = 'secondary',
  size = 'md',
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium border transition-none',
        size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs',
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

