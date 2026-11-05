import { Search, X } from 'lucide-react';
import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/cn';

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onChange, placeholder = 'Search…', className, ...props }, ref) => (
    <div className={cn('relative flex items-center', className)}>
      <Search size={15} className="absolute left-2.5 text-ch-text-muted pointer-events-none" />
      <input
        ref={ref}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'h-8 w-full rounded-control border border-ch-border bg-surface pl-8 pr-8 text-sm text-ch-text-primary',
          'placeholder:text-ch-text-muted focus:outline-none focus:border-accent',
        )}
        {...props}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2 text-ch-text-muted hover:text-ch-text-primary"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  ),
);
SearchInput.displayName = 'SearchInput';

