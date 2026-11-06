import { type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  helper?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({ label, required, error, helper, description, children, className }: FormFieldProps) {
  const helperText = helper || description;
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <label className="text-sm font-medium text-ch-text-primary">
        {label}
        {required && <span className="ml-1 text-danger" aria-label="required">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-danger">{error}</p>}
      {helperText && !error && <p className="text-xs text-ch-text-muted">{helperText}</p>}
    </div>
  );
}

