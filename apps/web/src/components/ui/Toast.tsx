import { create } from 'zustand';
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  description?: string;
}

interface ToastStore {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4500);
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      aria-live="polite"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => {
        const Icon =
          toast.type === 'success'
            ? CheckCircle2
            : toast.type === 'warning'
            ? AlertTriangle
            : toast.type === 'error'
            ? AlertCircle
            : Info;

        const colorClasses =
          toast.type === 'success'
            ? 'text-success border-success/30'
            : toast.type === 'warning'
            ? 'text-warning border-warning/30'
            : toast.type === 'error'
            ? 'text-danger border-danger/30'
            : 'text-info border-info/30';

        return (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto flex items-start justify-between p-3.5 bg-surface border rounded-card shadow-lg text-sm text-ch-text-primary',
              colorClasses,
            )}
          >
            <div className="flex items-start gap-2.5">
              <Icon size={18} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-ch-text-primary leading-tight">{toast.message}</p>
                {toast.description && (
                  <p className="mt-1 text-xs text-ch-text-secondary leading-snug">{toast.description}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-ch-text-muted hover:text-ch-text-primary rounded focus-visible:outline-accent shrink-0 ml-2"
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
