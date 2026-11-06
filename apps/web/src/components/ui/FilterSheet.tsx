import { type ReactNode } from 'react';
import { BottomSheet } from './Drawer';
import { Button } from './Button';

interface FilterSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  onApply: () => void;
  onReset?: () => void;
  activeCount?: number;
}

export function FilterSheet({
  open,
  onClose,
  title = 'Filters',
  children,
  onApply,
  onReset,
  activeCount = 0,
}: FilterSheetProps) {
  return (
    <BottomSheet open={open} onClose={onClose} title={title}>
      <div className="space-y-4">
        {/* Filter input controls */}
        <div className="space-y-4">{children}</div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-ch-border flex items-center justify-between gap-3">
          {onReset ? (
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => {
                onReset();
                onClose();
              }}
              disabled={activeCount === 0}
              className="text-ch-text-secondary"
            >
              Reset all
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <Button type="button" variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={() => {
                onApply();
                onClose();
              }}
            >
              Apply filters {activeCount > 0 && `(${activeCount})`}
            </Button>
          </div>
        </div>
      </div>
    </BottomSheet>
  );
}

