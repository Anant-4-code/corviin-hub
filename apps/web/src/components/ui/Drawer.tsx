import { type ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  side?: 'left' | 'right';
  width?: string;
}

export function Drawer({ open, onClose, title, children, side = 'right', width = 'w-80' }: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal aria-label={title}>
      <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div
        className={cn(
          'fixed top-0 bottom-0 z-10 flex flex-col bg-surface border-ch-border shadow-lg max-w-full',
          side === 'right' ? 'right-0 border-l' : 'left-0 border-r',
          width,
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-ch-border shrink-0">
          <h2 className="text-base font-semibold text-ch-text-primary">{title}</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-surface-muted text-ch-text-muted" aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
}

/** Mobile bottom sheet variant */
export function BottomSheet({ open, onClose, title, children }: Omit<DrawerProps, 'side' | 'width'>) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" role="dialog" aria-modal aria-label={title}>
      <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div className="relative z-10 bg-surface border-t border-ch-border rounded-t-xl max-h-[85dvh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-ch-border shrink-0">
          <h2 className="text-base font-semibold text-ch-text-primary">{title}</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-surface-muted text-ch-text-muted" aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4" style={{ paddingBottom: 'env(safe-area-inset-bottom, 1rem)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

