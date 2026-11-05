import { NavLink } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { mobileBottomNav, mobileMoreItems } from './navigation-config';
import { BottomSheet } from '@/components/ui/Drawer';
import { cn } from '@/lib/cn';

export function MobileBottomNavigation() {
  const [moreOpen, setMoreOpen] = useState(false);

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
      </BottomSheet>
    </>
  );
}

