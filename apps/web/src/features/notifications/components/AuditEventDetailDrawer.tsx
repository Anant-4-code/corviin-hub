import React from 'react';
import { ShieldCheck, FileText } from 'lucide-react';
import type { AuditEventItem } from '@corviin-hub/shared';
import { Drawer } from '@/components/ui/Drawer';

interface AuditEventDetailDrawerProps {
  event: AuditEventItem | null;
  onClose: () => void;
}

export const AuditEventDetailDrawer: React.FC<AuditEventDetailDrawerProps> = ({
  event,
  onClose,
}) => {
  if (!event) return null;

  return (
    <Drawer
      open={Boolean(event)}
      onClose={onClose}
      title={event.entityTitle}
      subtitle={`Audit Record • ${event.entityType} • ${event.action}`}
      size="lg"
    >
      <div className="space-y-6 text-xs">
        {/* Header Badges */}
        <div className="flex items-center gap-2 flex-wrap pb-2 border-b border-border">
          <span className="px-2.5 py-1 rounded text-xs font-bold uppercase bg-brand-teal/10 text-brand-teal border border-brand-teal/20">
            {event.entityType}
          </span>
          <span className="px-2.5 py-1 rounded text-xs font-semibold bg-surface-muted text-secondary border border-border">
            {event.action}
          </span>
        </div>

        {/* Audit Meta Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="p-3.5 rounded bg-surface-muted border border-border">
            <div className="text-[11px] text-tertiary font-medium">Recorded Actor</div>
            <div className="font-semibold text-primary mt-1 text-sm">{event.actorName}</div>
            <div className="text-[10px] text-tertiary truncate mt-0.5">ID: {event.actorId}</div>
          </div>

          <div className="p-3.5 rounded bg-surface-muted border border-border">
            <div className="text-[11px] text-tertiary font-medium">Event Timestamp</div>
            <div className="font-semibold text-primary mt-1 text-sm">
              {new Date(event.timestamp).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
            <div className="text-[10px] text-tertiary mt-0.5">
              {new Date(event.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </div>
          </div>

          <div className="p-3.5 rounded bg-surface-muted border border-border">
            <div className="text-[11px] text-tertiary font-medium">Correlation ID</div>
            <div className="font-mono text-[11px] text-primary mt-1 truncate">
              {event.correlationId || 'N/A'}
            </div>
          </div>

          <div className="p-3.5 rounded bg-surface-muted border border-border">
            <div className="text-[11px] text-tertiary font-medium">Audit Record ID</div>
            <div className="font-mono text-[11px] text-primary mt-1 truncate">{event.id}</div>
          </div>
        </div>

        {/* Change Summary & Reason */}
        <div className="space-y-2">
          <div className="font-semibold text-primary text-sm">Operational Change Summary</div>
          <p className="p-3.5 rounded bg-surface-muted border border-border text-secondary leading-relaxed">
            {event.changeSummary}
          </p>
          {event.reason && (
            <div className="p-3.5 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200">
              <span className="font-semibold">Recorded Justification:</span> {event.reason}
            </div>
          )}
        </div>

        {/* State Diff Inspection (Previous vs New Values) */}
        {(event.previousValues || event.newValues) && (
          <div className="space-y-3 pt-2 border-t border-border">
            <div className="flex items-center gap-1.5 font-semibold text-primary">
              <FileText size={15} className="text-brand-teal" />
              <span>State Audit Diff (Before / After)</span>
            </div>

            <div className="space-y-3">
              {event.previousValues && (
                <div>
                  <div className="text-[11px] font-semibold text-secondary mb-1">
                    Previous State
                  </div>
                  <pre className="p-3.5 rounded bg-surface-muted border border-border font-mono text-[11px] text-secondary overflow-x-auto">
                    {JSON.stringify(event.previousValues, null, 2)}
                  </pre>
                </div>
              )}

              {event.newValues && (
                <div>
                  <div className="text-[11px] font-semibold text-primary mb-1">
                    Committed New State
                  </div>
                  <pre className="p-3.5 rounded bg-surface-muted border border-border font-mono text-[11px] text-primary overflow-x-auto">
                    {JSON.stringify(event.newValues, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Immutability Guarantee Notice */}
        <div className="p-3.5 rounded bg-surface-muted border border-border text-[11px] text-tertiary flex items-start gap-2">
          <ShieldCheck size={16} className="text-emerald-500 mt-0.5 shrink-0" />
          <span>
            This audit record is immutable and cryptographically indexed. Operational changes cannot alter
            or delete past events.
          </span>
        </div>
      </div>
    </Drawer>
  );
};
