import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-accent text-accent-foreground hover:opacity-90 border border-accent',
  secondary:
    'bg-surface text-ch-text-primary border border-ch-border hover:bg-surface-muted',
  outline:
    'bg-transparent text-ch-text-primary border border-ch-border hover:bg-surface-muted',
  ghost:
    'bg-transparent text-ch-text-primary border border-transparent hover:bg-surface-muted',
  danger:
    'bg-danger text-white border border-danger hover:opacity-90',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs font-medium rounded-control gap-1.5',
  md: 'h-9 px-4 text-sm font-medium rounded-control gap-2',
  lg: 'h-10 px-5 text-sm font-semibold rounded-control gap-2',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <button
      {...props}
      disabled={isDisabled}
      className={cn(
        'inline-flex items-center justify-center select-none',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {loading ? 'Loading…' : children}
    </button>
  );
}

