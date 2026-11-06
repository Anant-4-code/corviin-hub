import { type SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helper?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helper, required, options, placeholder, children, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-ch-text-primary">
            {label}
            {required && <span className="ml-1 text-danger" aria-label="required">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={cn(
            'h-9 w-full rounded-control border border-ch-border bg-surface px-3 text-sm text-ch-text-primary',
            'focus:outline-none focus:border-accent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-danger',
            className,
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options ? options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          )) : children}
        </select>
        {error && <p className="text-xs text-danger">{error}</p>}
        {helper && !error && <p className="text-xs text-ch-text-muted">{helper}</p>}
      </div>
    );
  },
);
Select.displayName = 'Select';

