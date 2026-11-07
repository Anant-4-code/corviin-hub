import { type ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

export type DialogSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  size?: DialogSize;
  closeOnBackdropClick?: boolean;
}

const sizeClasses: Record<DialogSize, string> = {
  xs: 'sm:max-w-md',             // 448px (confirmations, small prompts)
  sm: 'sm:max-w-lg',             // 512px–576px (compact forms)
  md: 'sm:max-w-2xl',            // 672px (standard forms)
  lg: 'sm:max-w-3xl',            // 768px (multi-column forms)
  xl: 'sm:max-w-4xl',            // 896px (large workspaces)
  '2xl': 'sm:max-w-5xl',         // 1024px (content-heavy)
  full: 'sm:max-w-[96vw] sm:max-h-[94vh]', // full viewport preview
};

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
  size = 'md',
  closeOnBackdropClick = true,
}: DialogProps) {
  // Handle escape key and body scroll locking
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
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label={typeof title === 'string' ? title : 'Dialog'}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-none"
        onClick={closeOnBackdropClick ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Dialog Surface */}
      <div
        className={cn(
          'relative z-10 w-full max-h-[calc(100dvh-1.5rem)] flex flex-col bg-surface rounded-lg border border-ch-border shadow-2xl overflow-hidden transition-none',
          sizeClasses[size] || sizeClasses.md,
          className,
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-4 sm:px-6 py-4 border-b border-ch-border shrink-0 bg-surface">
          <div className="flex-1 min-w-0 pr-3">
            <h2 className="text-base sm:text-lg font-bold text-ch-text-primary leading-snug">
              {title}
            </h2>
            {description && (
              <div className="mt-1 text-xs text-ch-text-secondary leading-normal">
                {description}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-control hover:bg-surface-muted text-ch-text-muted hover:text-ch-text-primary min-h-[36px] min-w-[36px] flex items-center justify-center shrink-0"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {children}
        </div>

        {/* Optional Sticky Footer */}
        {footer && (
          <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-t border-ch-border bg-surface-muted/40 flex flex-wrap items-center justify-end gap-2.5 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  loading = false,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  loading?: boolean;
}) {
  return (
    <Dialog open={open} onClose={onClose} title={title} size="xs">
      <div className="space-y-4">
        <p className="text-sm text-ch-text-secondary leading-relaxed">{description}</p>
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-3.5 py-2 text-sm border border-ch-border rounded-control hover:bg-surface-muted text-ch-text-primary min-h-[40px] font-medium"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={async () => {
              await onConfirm();
              onClose();
            }}
            disabled={loading}
            className={cn(
              'px-4 py-2 text-sm rounded-control font-semibold min-h-[40px]',
              danger
                ? 'bg-danger text-white hover:bg-danger/90'
                : 'bg-accent text-accent-foreground hover:bg-accent/90',
            )}
          >
            {loading ? 'Processing…' : confirmLabel}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
