import React from 'react';
import { Sun, Moon, Laptop, Palette, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/app/providers/ThemeProvider';
import type { SupportedTheme } from '@corviin-hub/shared';

interface AppearanceSectionProps {
  onThemeSaved?: (theme: SupportedTheme) => Promise<void>;
}

export const AppearanceSection: React.FC<AppearanceSectionProps> = ({ onThemeSaved }) => {
  const { theme, setTheme } = useTheme();

  const handleSelectTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    if (onThemeSaved) {
      onThemeSaved(newTheme).catch(() => {});
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-5 space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-primary">Appearance & Theme</h2>
        <p className="text-xs text-secondary mt-0.5">
          Select interface theme. Both Light and Dark modes are designed with first-class WCAG contrast parity.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => handleSelectTheme('light')}
          className={`p-4 rounded-md border text-left flex flex-col justify-between h-28 min-h-[44px] ${
            theme === 'light'
              ? 'border-brand-teal bg-brand-teal/5 ring-1 ring-brand-teal text-primary'
              : 'border-border bg-surface hover:bg-surface-muted text-secondary'
          }`}
        >
          <div className="flex items-center justify-between">
            <Sun size={20} className={theme === 'light' ? 'text-brand-teal' : 'text-secondary'} />
            {theme === 'light' && (
              <span className="text-[11px] font-bold text-brand-teal px-1.5 py-0.5 rounded bg-brand-teal/10">
                Active
              </span>
            )}
          </div>
          <div>
            <p className="text-xs font-bold text-primary">Light Theme</p>
            <p className="text-[11px] text-tertiary mt-0.5">Warm clean canvas with crisp typography</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleSelectTheme('dark')}
          className={`p-4 rounded-md border text-left flex flex-col justify-between h-28 min-h-[44px] ${
            theme === 'dark'
              ? 'border-brand-teal bg-brand-teal/5 ring-1 ring-brand-teal text-primary'
              : 'border-border bg-surface hover:bg-surface-muted text-secondary'
          }`}
        >
          <div className="flex items-center justify-between">
            <Moon size={20} className={theme === 'dark' ? 'text-brand-teal' : 'text-secondary'} />
            {theme === 'dark' && (
              <span className="text-[11px] font-bold text-brand-teal px-1.5 py-0.5 rounded bg-brand-teal/10">
                Active
              </span>
            )}
          </div>
          <div>
            <p className="text-xs font-bold text-primary">Dark Theme</p>
            <p className="text-[11px] text-tertiary mt-0.5">Deep graphite surface with high-contrast text</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleSelectTheme('system')}
          className={`p-4 rounded-md border text-left flex flex-col justify-between h-28 min-h-[44px] ${
            theme === 'system'
              ? 'border-brand-teal bg-brand-teal/5 ring-1 ring-brand-teal text-primary'
              : 'border-border bg-surface hover:bg-surface-muted text-secondary'
          }`}
        >
          <div className="flex items-center justify-between">
            <Laptop size={20} className={theme === 'system' ? 'text-brand-teal' : 'text-secondary'} />
            {theme === 'system' && (
              <span className="text-[11px] font-bold text-brand-teal px-1.5 py-0.5 rounded bg-brand-teal/10">
                Active
              </span>
            )}
          </div>
          <div>
            <p className="text-xs font-bold text-primary">System Theme</p>
            <p className="text-[11px] text-tertiary mt-0.5">Follows operating system display preference</p>
          </div>
        </button>
      </div>

      {/* Strict Zero-Animation Policy Banner */}
      <div className="p-4 bg-surface-muted border border-border rounded-md space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span>Absolute Design Rule: Zero Animation</span>
        </div>
        <p className="text-[11px] text-secondary leading-relaxed">
          CORVIIN HUB enforces strict instant static interaction feedback (`*, *::before, *::after &#123; transition: none !important; animation: none !important; &#125;`).
          Page transitions, hover transforms, floating blobs, and animated counters are permanently disabled to prioritize speed, clarity, and enterprise reliability.
        </p>
      </div>

      {/* UI/UX Design System Catalog Link */}
      <div className="pt-2 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
            <Palette size={15} className="text-brand-teal" />
            <span>Design System Catalog & Preview</span>
          </div>
          <p className="text-[11px] text-secondary mt-0.5">
            Inspect all color swatches, button states, tables, drawers, dialogs, and typography tokens.
          </p>
        </div>
        <Link
          to="/app/design-system"
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded bg-surface-muted text-primary border border-border hover:bg-surface-hover min-h-[44px]"
        >
          <span>Open Design Catalog</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

