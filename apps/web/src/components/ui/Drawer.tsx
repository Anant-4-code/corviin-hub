import { type ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  subtitle?: ReactNode;
  headerActions?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  side?: 'left' | 'right';
  size?: DrawerSize;
  width?: string;
  closeOnBackdropClick?: boolean;
}

const drawerSizeClasses: Record<DrawerSize, string> = {
  sm: 'md:max-w-md',        // 448px (compact drawer)
  md: 'md:max-w-2xl',       // 672px (standard detail)
  lg: 'md:max-w-3xl',       // 768px (standard record details — default)
  xl: 'md:max-w-4xl',       // 896px (large detail workspace)
  '2xl': 'md:max-w-5xl',    // 1024px (content-heavy workspace)
  full: 'md:max-w-[100vw]', // 100vw full width
};

export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  headerActions,
  footer,
  children,
  side = 'right',
  size = 'lg',
  width,
  closeOnBackdropClick = true,
}: DrawerProps) {
  // Body scroll locking and escape key handling
  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handler);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label={typeof title === 'string' ? title : 'Detail Drawer'}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-none"
        onClick={closeOnBackdropClick ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Drawer Panel
          Mobile (< md): 100% viewport width, 100dvh height, inset-0, full-screen mobile panel (no background strip visible!)
          Desktop (>= md): fixed side-docked with responsive max-width variant.
      */}
      <div
        className={cn(
          'fixed z-10 flex flex-col bg-surface border-ch-border shadow-2xl transition-none',
          // Mobile (< 768px): Full-screen takeover
          'inset-0 w-full h-full max-h-[100dvh]',
          // Desktop (>= 768px): Side-docked with size variant
          'md:inset-auto md:top-0 md:bottom-0 md:h-full md:w-full',
          side === 'right' ? 'md:right-0 md:border-l' : 'md:left-0 md:border-r',
          width || drawerSizeClasses[size] || drawerSizeClasses.lg,
        )}
      >
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-ch-border shrink-0 flex items-start justify-between gap-3 bg-surface">
          <div className="flex-1 min-w-0 pr-2">
            <h2 className="text-base sm:text-lg font-bold text-ch-text-primary leading-tight truncate">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-0.5 text-xs text-ch-text-secondary truncate">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {headerActions}
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-control hover:bg-surface-muted text-ch-text-muted hover:text-ch-text-primary min-h-[36px] min-w-[36px] sm:min-h-[40px] sm:min-w-[40px] flex items-center justify-center shrink-0"
              aria-label="Close drawer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
          {children}
        </div>

        {/* Optional Sticky Footer */}
        {footer && (
          <div
            className="px-4 sm:px-6 py-3 sm:py-4 border-t border-ch-border bg-surface-muted/50 shrink-0 flex flex-wrap items-center justify-between gap-2"
            style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 0.75rem)' }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/** Mobile bottom sheet variant */
export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handler);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="fixed inset-0 bg-black/50 transition-none" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 bg-surface border-t border-ch-border rounded-t-xl max-h-[88dvh] flex flex-col shadow-2xl transition-none">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-ch-border shrink-0 bg-surface">
          <h2 className="text-base font-semibold text-ch-text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-control hover:bg-surface-muted text-ch-text-muted hover:text-ch-text-primary min-h-[36px] min-w-[36px] flex items-center justify-center"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div
          className="flex-1 overflow-y-auto px-4 sm:px-6 py-4"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 1rem)' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
