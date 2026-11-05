import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-accent-foreground hover:opacity-90 border border-accent active:opacity-100',
  secondary:
    'bg-surface text-ch-text-primary border border-ch-border hover:bg-surface-muted active:bg-surface-selected',
  outline:
    'bg-transparent text-ch-text-primary border border-ch-border hover:bg-surface-muted active:bg-surface-selected',
  ghost:
    'bg-transparent text-ch-text-primary border border-transparent hover:bg-surface-muted active:bg-surface-selected',
  danger:
    'bg-danger text-white border border-danger hover:opacity-90 active:opacity-100',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-[34px] px-3 py-1.5 text-xs font-medium rounded-control gap-1.5',
  md: 'min-h-[40px] px-4 py-2 text-sm font-medium rounded-control gap-2',
  lg: 'min-h-[44px] px-5 py-2.5 text-sm font-semibold rounded-control gap-2.5',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <button
      type={type}
      {...props}
      disabled={isDisabled}
      className={cn(
        'inline-flex items-center justify-center select-none text-center cursor-pointer',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        'focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {loading ? (
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent inline-block" />
          <span>Processing…</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
