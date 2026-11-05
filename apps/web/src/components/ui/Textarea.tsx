import { type TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helper?: string;
  required?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
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
        <textarea
          ref={ref}
          id={inputId}
          rows={3}
          className={cn(
            'w-full rounded-control border border-ch-border bg-surface px-3 py-2 text-sm text-ch-text-primary',
            'placeholder:text-ch-text-muted resize-y',
            'focus:outline-none focus:border-accent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-danger',
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
Textarea.displayName = 'Textarea';

