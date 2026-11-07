import { type ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg' };

export function Dialog({ open, onClose, title, description, children, className, size = 'md' }: DialogProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal aria-label={title}>
      <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div className={cn('relative z-10 w-full max-h-[calc(100vh-2rem)] flex flex-col bg-surface rounded-lg border border-ch-border shadow-lg', sizeClasses[size], className)}>
        <div className="flex items-start justify-between p-4 border-b border-ch-border shrink-0">
          <div>
            <h2 className="text-base font-semibold text-ch-text-primary">{title}</h2>
            {description && <p className="mt-0.5 text-sm text-ch-text-secondary">{description}</p>}
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-surface-muted text-ch-text-muted" aria-label="Close dialog">
            <X size={16} />
          </button>
        </div>
        <div className="p-4 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open, onClose, onConfirm, title, description, confirmLabel = 'Confirm', danger = false,
}: {
  open: boolean; onClose: () => void; onConfirm: () => void;
  title: string; description: string; confirmLabel?: string; danger?: boolean;
}) {
  return (
    <Dialog open={open} onClose={onClose} title={title} size="sm">
      <p className="text-sm text-ch-text-secondary mb-4">{description}</p>
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="px-3 py-1.5 text-sm border border-ch-border rounded-control hover:bg-surface-muted text-ch-text-primary">
          Cancel
        </button>
        <button
          onClick={() => { onConfirm(); onClose(); }}
          className={cn('px-3 py-1.5 text-sm rounded-control font-medium',
            danger ? 'bg-danger text-white hover:opacity-90' : 'bg-accent text-accent-foreground hover:opacity-90'
          )}
        >
          {confirmLabel}
        </button>
      </div>
    </Dialog>
  );
}

