import { type ChangeEvent } from 'react';
import { Calendar, Clock, Globe } from 'lucide-react';
import { cn } from '@/lib/cn';

interface DateTimeFieldProps {
  label: string;
  dateValue: string;
  onDateChange: (date: string) => void;
  timeValue?: string;
  onTimeChange?: (time: string) => void;
  includeTime?: boolean;
  timezone?: string;
  required?: boolean;
  error?: string;
  helper?: string;
  className?: string;
}

export function DateTimeField({
  label,
  dateValue,
  onDateChange,
  timeValue = '10:00',
  onTimeChange,
  includeTime = true,
  timezone = 'IST (UTC+05:30)',
  required = false,
  error,
  helper,
  className,
}: DateTimeFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-ch-text-primary">
          {label}
          {required && <span className="ml-1 text-danger" aria-label="required">*</span>}
        </label>
        {includeTime && (
          <span className="inline-flex items-center gap-1 text-[11px] text-ch-text-muted">
            <Globe size={11} />
            <span>{timezone}</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {/* Date Input */}
        <div className="relative">
          <input
            type="date"
            value={dateValue}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onDateChange(e.target.value)}
            className={cn(
              'h-10 w-full rounded-control border border-ch-border bg-surface px-3 text-sm text-ch-text-primary',
              'focus:outline-none focus:border-accent',
              error && 'border-danger',
            )}
            aria-label={`${label} date`}
          />
        </div>

        {/* Time Input */}
        {includeTime && (
          <div className="relative">
            <input
              type="time"
              value={timeValue}
              onChange={(e: ChangeEvent<HTMLInputElement>) => onTimeChange?.(e.target.value)}
              className={cn(
                'h-10 w-full rounded-control border border-ch-border bg-surface px-3 text-sm text-ch-text-primary',
                'focus:outline-none focus:border-accent',
                error && 'border-danger',
              )}
              aria-label={`${label} time`}
            />
          </div>
        )}
      </div>

      {error && <p className="text-xs text-danger">{error}</p>}
      {helper && !error && <p className="text-xs text-ch-text-muted">{helper}</p>}
    </div>
  );
}

