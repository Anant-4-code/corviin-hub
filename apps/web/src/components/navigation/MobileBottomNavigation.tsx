import { NavLink } from 'react-router-dom';
import { MoreHorizontal, Sun, Moon, Monitor, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { mobileBottomNav, mobileMoreItems } from './navigation-config';
import { BottomSheet } from '@/components/ui/Drawer';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/cn';

export function MobileBottomNavigation() {
  const [moreOpen, setMoreOpen] = useState(false);
  const queryClient = useQueryClient();
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);

  return (
    <>
      <nav
        aria-label="Mobile navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-surface border-t border-ch-border flex"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {mobileBottomNav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-h-[4rem] text-xs font-medium',
                  isActive ? 'text-accent' : 'text-ch-text-muted hover:text-ch-text-secondary',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={22} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
        <button
          onClick={() => setMoreOpen(true)}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-h-[4rem] text-xs font-medium text-ch-text-muted hover:text-ch-text-secondary"
          aria-label="More navigation items"
        >
          <MoreHorizontal size={22} />
          <span>More</span>
        </button>
      </nav>

      <BottomSheet open={moreOpen} onClose={() => setMoreOpen(false)} title="More">
        <div className="flex flex-col gap-3">
          {/* Server Connection & App Reload action */}
          <div className="p-2.5 bg-surface-muted/60 rounded-control border border-ch-border flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-ch-text-primary">Server Connection</div>
              <div className="text-[11px] text-ch-text-muted">Wake up Render API or hard reload</div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={async () => {
                  setMoreOpen(false);
                  const apiBase = import.meta.env.VITE_API_BASE_URL || '/api/v1';
                  try {
                    await fetch(`${apiBase}/health`, { method: 'GET', cache: 'no-store' });
                  } catch {
                    // Ignore boot error
                  }
                  await queryClient.invalidateQueries();
                  await queryClient.refetchQueries();
                }}
                className="px-2.5 py-1.5 bg-accent text-accent-foreground rounded-control text-xs font-semibold flex items-center gap-1 hover:opacity-90"
              >
                <RefreshCw size={13} />
                <span>Sync</span>
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-2.5 py-1.5 bg-surface border border-ch-border text-ch-text-secondary hover:text-ch-text-primary rounded-control text-xs font-semibold"
              >
                Reload
              </button>
            </div>
          </div>

          {/* Quick theme selector */}
          <div className="p-2 bg-surface-muted/60 rounded-control border border-ch-border">
            <p className="text-[11px] font-semibold text-ch-text-secondary uppercase tracking-wider mb-2">
              Appearance
            </p>
            <div className="grid grid-cols-3 gap-1 bg-surface p-1 rounded-control border border-ch-border">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={cn(
                  'flex items-center justify-center gap-1.5 py-1.5 text-xs rounded font-medium transition-none',
                  theme === 'light'
                    ? 'bg-surface-selected text-accent font-bold'
                    : 'text-ch-text-secondary hover:text-ch-text-primary',
                )}
              >
                <Sun size={14} /> Light
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={cn(
                  'flex items-center justify-center gap-1.5 py-1.5 text-xs rounded font-medium transition-none',
                  theme === 'dark'
                    ? 'bg-surface-selected text-accent font-bold'
                    : 'text-ch-text-secondary hover:text-ch-text-primary',
                )}
              >
                <Moon size={14} /> Dark
              </button>
              <button
                type="button"
                onClick={() => setTheme('system')}
                className={cn(
                  'flex items-center justify-center gap-1.5 py-1.5 text-xs rounded font-medium transition-none',
                  theme === 'system'
                    ? 'bg-surface-selected text-accent font-bold'
                    : 'text-ch-text-secondary hover:text-ch-text-primary',
                )}
              >
                <Monitor size={14} /> Auto
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            {mobileMoreItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMoreOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-3 rounded-control text-sm font-medium',
                      isActive
                        ? 'bg-surface-selected text-accent'
                        : 'text-ch-text-primary hover:bg-surface-muted',
                    )
                  }
                >
                  <Icon size={18} />
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        </div>
      </BottomSheet>
    </>
  );
}

