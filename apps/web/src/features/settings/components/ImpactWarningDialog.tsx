import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ImpactWarningDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemName: string;
  impactMessage: string;
  affectedCount: number;
  safeToRemove: boolean;
}

export const ImpactWarningDialog: React.FC<ImpactWarningDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  impactMessage,
  affectedCount,
  safeToRemove,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-surface border border-border rounded-lg max-w-md w-full p-5 space-y-4 shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <AlertTriangle size={20} />
            <h3 className="text-sm font-bold text-primary">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-secondary hover:text-primary min-h-[32px] min-w-[32px] flex items-center justify-center"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-3 text-xs leading-relaxed text-secondary">
          <p>
            You are attempting to remove <strong className="text-primary font-semibold">"{itemName}"</strong> from workspace configuration.
          </p>

          <div
            className={`p-3 rounded-md border ${
              safeToRemove
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800'
                : 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200 border-rose-300 dark:border-rose-800'
            }`}
          >
            <div className="font-semibold mb-1">
              {safeToRemove ? 'No Dependency Risk' : `Consequential Impact Detected: ${affectedCount} Records`}
            </div>
            <div>{impactMessage}</div>
          </div>

          {!safeToRemove && (
            <p className="text-[11px] text-tertiary">
              Removing a category or pipeline source while active records depend on it will cause those records to show an unmapped classification in historical filters.
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-semibold rounded bg-surface-muted text-secondary hover:text-primary border border-border min-h-[44px]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold rounded bg-rose-600 text-white hover:bg-rose-700 min-h-[44px]"
          >
            Confirm Removal
          </button>
        </div>
      </div>
    </div>
  );
};

