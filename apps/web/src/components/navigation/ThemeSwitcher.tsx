import { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, ChevronDown } from 'lucide-react';
import { useTheme } from '@/app/providers/ThemeProvider';
import { cn } from '@/lib/cn';

const options = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
] as const;

export function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const ref = useRef<HTMLDivElement>(null);

  const current = options.find((o) => o.value === theme) ?? options[0];
  const Icon = current.icon;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center justify-center p-1.5 sm:p-2 rounded-control hover:bg-surface-muted text-ch-text-secondary min-h-[32px] min-w-[32px] sm:min-h-[36px] sm:min-w-[36px] shrink-0"
        aria-label={`Theme: ${current.label}`}
        title="Change theme"
      >
        <Icon size={16} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-36 bg-surface-elevated border border-ch-border rounded-lg shadow-lg z-50 py-1">
          {options.map((opt) => {
            const OptIcon = opt.icon;
            return (
              <button
                key={opt.value}
                onClick={() => { setTheme(opt.value); setOpen(false); }}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-surface-muted',
                  theme === opt.value ? 'text-accent font-medium' : 'text-ch-text-primary',
                )}
              >
                <OptIcon size={14} />
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

