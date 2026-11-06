import { type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface ResponsiveDetailLayoutProps {
  header?: ReactNode;
  mainContent: ReactNode;
  sideContent: ReactNode;
  mobileStickyAction?: ReactNode;
  className?: string;
}

export function ResponsiveDetailLayout({
  header,
  mainContent,
  sideContent,
  mobileStickyAction,
  className,
}: ResponsiveDetailLayoutProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {header && <div className="space-y-2">{header}</div>}

      {/* Responsive 2-column grid on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Operational Area (Tabs, Records, Activities) */}
        <div className="lg:col-span-8 space-y-6 min-w-0">
          {mainContent}
        </div>

        {/* Side Metadata & Quick Action Panel */}
        <div className="lg:col-span-4 space-y-6 min-w-0">
          {sideContent}
        </div>
      </div>

      {/* Mobile Sticky Bottom Action Bar (if supplied) */}
      {mobileStickyAction && (
        <div
          className="lg:hidden fixed bottom-14 left-0 right-0 z-20 p-3 bg-surface/95 backdrop-blur-none border-t border-ch-border"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.75rem)' }}
        >
          {mobileStickyAction}
        </div>
      )}
    </div>
  );
}

