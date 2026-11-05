import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  required?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, required, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-ch-text-primary">
            {label}
            {required && <span className="ml-1 text-danger" aria-label="required">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-9 w-full rounded-control border border-ch-border bg-surface px-3 text-sm text-ch-text-primary',
            'placeholder:text-ch-text-muted',
            'focus:outline-none focus:border-accent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-danger focus:border-danger',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-danger">{error}</p>}
        {helper && !error && <p className="text-xs text-ch-text-muted">{helper}</p>}
      </div>
    );
  },
);
Input.displayName = 'Input';

