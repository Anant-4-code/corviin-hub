import React from 'react';
import { X, ShieldCheck, Clock, FileText, ArrowRight } from 'lucide-react';
import type { AuditEventItem } from '@corviin-hub/shared';

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
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className="bg-surface border-l border-border w-full max-w-lg h-full overflow-y-auto p-5 space-y-5 shadow-2xl">
        <div className="flex items-start justify-between border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-brand-teal/10 text-brand-teal border border-brand-teal/20">
                {event.entityType}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-muted text-secondary border border-border">
                {event.action}
              </span>
            </div>
            <h2 className="text-base font-bold text-primary mt-1">{event.entityTitle}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-secondary hover:text-primary min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        {/* Audit Meta Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded bg-surface-muted border border-border">
            <div className="text-[11px] text-tertiary">Recorded Actor</div>
            <div className="font-semibold text-primary mt-0.5">{event.actorName}</div>
            <div className="text-[10px] text-tertiary truncate">ID: {event.actorId}</div>
          </div>

          <div className="p-3 rounded bg-surface-muted border border-border">
            <div className="text-[11px] text-tertiary">Timestamp</div>
            <div className="font-semibold text-primary mt-0.5">
              {new Date(event.timestamp).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
            <div className="text-[10px] text-tertiary">
              {new Date(event.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </div>
          </div>

          <div className="p-3 rounded bg-surface-muted border border-border">
            <div className="text-[11px] text-tertiary">Correlation ID</div>
            <div className="font-mono text-[11px] text-primary mt-0.5 truncate">
              {event.correlationId || 'N/A'}
            </div>
          </div>

          <div className="p-3 rounded bg-surface-muted border border-border">
            <div className="text-[11px] text-tertiary">Event ID</div>
            <div className="font-mono text-[11px] text-primary mt-0.5 truncate">{event.id}</div>
          </div>
        </div>

        {/* Change Summary & Reason */}
        <div className="space-y-2 text-xs">
          <div className="font-semibold text-primary">Operational Change Summary</div>
          <p className="p-3 rounded bg-surface-muted border border-border text-secondary leading-relaxed">
            {event.changeSummary}
          </p>
          {event.reason && (
            <div className="p-3 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200">
              <span className="font-semibold">Recorded Justification:</span> {event.reason}
            </div>
          )}
        </div>

        {/* State Diff Inspection (Previous vs New Values) */}
        {(event.previousValues || event.newValues) && (
          <div className="space-y-3 pt-2 border-t border-border">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
              <FileText size={15} className="text-brand-teal" />
              <span>State Audit Diff (Before / After)</span>
            </div>

            <div className="space-y-2 text-xs">
              {event.previousValues && (
                <div>
                  <div className="text-[11px] font-semibold text-secondary mb-1">
                    Previous State
                  </div>
                  <pre className="p-3 rounded bg-surface-muted border border-border font-mono text-[11px] text-secondary overflow-x-auto">
                    {JSON.stringify(event.previousValues, null, 2)}
                  </pre>
                </div>
              )}

              {event.newValues && (
                <div>
                  <div className="text-[11px] font-semibold text-primary mb-1">
                    Committed New State
                  </div>
                  <pre className="p-3 rounded bg-surface-muted border border-border font-mono text-[11px] text-primary overflow-x-auto">
                    {JSON.stringify(event.newValues, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Immutability Guarantee Notice */}
        <div className="p-3 rounded bg-surface-muted border border-border text-[11px] text-tertiary flex items-start gap-2">
          <ShieldCheck size={16} className="text-emerald-500 mt-0.5 shrink-0" />
          <span>
            This audit record is immutable and cryptographically indexed. Operational changes cannot alter
            or delete past events.
          </span>
        </div>
      </div>
    </div>
  );
};

