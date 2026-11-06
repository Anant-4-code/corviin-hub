import React from 'react';
import { RealEstateBuyerRecord, BuyerPropertyConfiguration } from '@corviin-hub/shared';
import { Button } from '@/components/ui/Button';
import {
  BUYER_STAGE_LABELS,
  BUYER_STAGE_BADGE_CLASSES,
  BUYER_CONFIGURATION_LABELS,
  formatBudgetRange,
} from './buyer-crm-constants';

interface BuyerRecordsTableViewProps {
  records: RealEstateBuyerRecord[];
  onSelectRecord: (record: RealEstateBuyerRecord) => void;
  isLoading?: boolean;
}

export const BuyerRecordsTableView: React.FC<BuyerRecordsTableViewProps> = ({
  records,
  onSelectRecord,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="bg-surface border border-ch-border rounded-lg p-6 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-14 bg-ch-bg rounded border border-ch-border" />
        ))}
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="bg-surface border border-ch-border rounded-lg p-8 text-center">
        <p className="text-base font-medium text-ch-text-primary">No buyers found</p>
        <p className="text-sm text-ch-text-secondary mt-1">
          Try adjusting your search criteria or filter selections, or register a new property customer enquiry.
        </p>
      </div>
    );
  }

  const isOverdue = (dateStr?: string) => {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date();
  };

  const formatDate = (isoStr?: string) => {
    if (!isoStr) return '—';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="space-y-4">
      {/* ============================================================
          1. DESKTOP / TABLET TABLE VIEW (Hidden on Mobile)
         ============================================================ */}
      <div className="hidden md:block overflow-x-auto bg-surface border border-ch-border rounded-lg shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-ch-border bg-ch-bg text-ch-text-secondary font-semibold uppercase tracking-wider">
              <th className="py-3 px-4">Buyer Name</th>
              <th className="py-3 px-4">Phone / Contact</th>
              <th className="py-3 px-4">Requirement</th>
              <th className="py-3 px-4">Locality</th>
              <th className="py-3 px-4">Budget Range</th>
              <th className="py-3 px-4">Preferred Project</th>
              <th className="py-3 px-4">Stage</th>
              <th className="py-3 px-4">Assigned</th>
              <th className="py-3 px-4">Next Follow-up</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ch-border">
            {records.map((record) => {
              const overdue = isOverdue(record.nextFollowUpDate);
              const cleanPhone = record.phone.replace(/\D/g, '');

              return (
                <tr
                  key={record.id}
                  onClick={() => onSelectRecord(record)}
                  className="hover:bg-ch-bg/50 cursor-pointer text-ch-text-primary"
                >
                  {/* Buyer Name */}
                  <td className="py-3 px-4">
                    <p className="font-semibold text-ch-text-primary">{record.customerName}</p>
                    {record.email && (
                      <p className="text-[11px] text-ch-text-tertiary truncate max-w-[140px]">
                        {record.email}
                      </p>
                    )}
                  </td>

                  {/* Phone / Contact */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <a
                        href={`tel:${record.phone}`}
                        className="text-[11px] text-accent hover:underline flex items-center gap-1 font-medium"
                        title="Click to call"
                      >
                        <span>📞</span> {record.phone}
                      </a>
                      {cleanPhone && (
                        <a
                          href={`https://wa.me/${cleanPhone}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                          title="Message on WhatsApp"
                        >
                          WA
                        </a>
                      )}
                    </div>
                  </td>

                  {/* Requirement (Config & Property Type) */}
                  <td className="py-3 px-4">
                    <span className="font-medium text-ch-text-primary">
                      {record.configuration
                        ? BUYER_CONFIGURATION_LABELS[record.configuration]
                        : record.propertyType || 'Property'}
                    </span>
                    {record.purpose && (
                      <span className="block text-[10px] text-ch-text-tertiary">
                        {record.purpose.replace(/_/g, ' ')}
                      </span>
                    )}
                  </td>

                  {/* Locality */}
                  <td className="py-3 px-4 text-ch-text-secondary">
                    {record.locality || '—'}
                  </td>

                  {/* Budget */}
                  <td className="py-3 px-4 font-semibold text-ch-text-primary">
                    {formatBudgetRange(record.minBudget, record.maxBudget)}
                  </td>

                  {/* Preferred Project */}
                  <td className="py-3 px-4">
                    {record.preferredProject ? (
                      <span className="bg-ch-bg border border-ch-border text-ch-text-secondary px-1.5 py-0.5 rounded text-[11px] truncate max-w-[150px] inline-block">
                        🏢 {record.preferredProject}
                      </span>
                    ) : (
                      <span className="text-ch-text-tertiary">—</span>
                    )}
                  </td>

                  {/* Stage */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border ${
                        BUYER_STAGE_BADGE_CLASSES[record.stage]
                      }`}
                    >
                      {BUYER_STAGE_LABELS[record.stage]}
                    </span>
                  </td>

                  {/* Assigned Member */}
                  <td className="py-3 px-4 font-medium text-ch-text-secondary">
                    {record.assignedMemberName}
                  </td>

                  {/* Next Follow-up */}
                  <td className="py-3 px-4">
                    {record.nextFollowUpDate ? (
                      <div>
                        <p
                          className={`font-semibold ${
                            overdue
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-ch-text-primary'
                          }`}
                        >
                          {formatDate(record.nextFollowUpDate)}
                          {overdue && <span className="ml-1 text-[10px] font-bold">[OVERDUE]</span>}
                        </p>
                        {record.nextFollowUpTitle && (
                          <p className="text-[11px] text-ch-text-tertiary truncate max-w-[150px]">
                            {record.nextFollowUpTitle}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-ch-text-tertiary">—</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onSelectRecord(record)}
                      className="text-xs h-7 px-2"
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ============================================================
          2. MOBILE CARD VIEW (Visible only on Mobile)
         ============================================================ */}
      <div className="block md:hidden space-y-3">
        {records.map((record) => {
          const overdue = isOverdue(record.nextFollowUpDate);
          const cleanPhone = record.phone.replace(/\D/g, '');

          return (
            <div
              key={record.id}
              onClick={() => onSelectRecord(record)}
              className="bg-surface border border-ch-border rounded-lg p-4 space-y-3 shadow-sm cursor-pointer"
            >
              {/* Header: Name, Budget, Stage */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-sm text-ch-text-primary">{record.customerName}</h3>
                  <p className="text-xs font-semibold text-accent mt-0.5">
                    {formatBudgetRange(record.minBudget, record.maxBudget)}
                  </p>
                </div>

                <span
                  className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium border whitespace-nowrap ${
                    BUYER_STAGE_BADGE_CLASSES[record.stage]
                  }`}
                >
                  {BUYER_STAGE_LABELS[record.stage]}
                </span>
              </div>

              {/* Requirement & Project */}
              <div className="text-xs text-ch-text-secondary space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-ch-text-primary">
                    {record.configuration
                      ? BUYER_CONFIGURATION_LABELS[record.configuration]
                      : record.propertyType || 'Property'}
                  </span>
                  {record.locality && <span>📍 {record.locality}</span>}
                </div>
                {record.preferredProject && (
                  <p className="text-[11px] text-ch-text-tertiary">
                    Target: <strong className="text-ch-text-secondary">{record.preferredProject}</strong>
                  </p>
                )}
              </div>

              {/* Assigned Member */}
              <div className="flex items-center justify-between text-xs text-ch-text-secondary pt-1 border-t border-ch-border">
                <span>Assigned: <strong className="text-ch-text-primary">{record.assignedMemberName}</strong></span>
                {record.buyingTimeline && (
                  <span className="text-[10px] bg-ch-bg border border-ch-border px-1.5 py-0.5 rounded">
                    {record.buyingTimeline.replace(/_/g, ' ')}
                  </span>
                )}
              </div>

              {/* Next Action Box */}
              {record.nextFollowUpDate && (
                <div className="bg-ch-bg p-2 rounded border border-ch-border text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-ch-text-secondary font-medium">Follow-up:</span>
                    <span
                      className={`font-semibold ${
                        overdue ? 'text-rose-600 dark:text-rose-400' : 'text-ch-text-primary'
                      }`}
                    >
                      {formatDate(record.nextFollowUpDate)}
                      {overdue && ' [OVERDUE]'}
                    </span>
                  </div>
                  {record.nextFollowUpTitle && (
                    <p className="text-[11px] text-ch-text-tertiary mt-0.5">{record.nextFollowUpTitle}</p>
                  )}
                </div>
              )}

              {/* Mobile Touch Targets (~44px) */}
              <div
                className="grid grid-cols-3 gap-2 pt-2 border-t border-ch-border"
                onClick={(e) => e.stopPropagation()}
              >
                <a
                  href={`tel:${record.phone}`}
                  className="flex items-center justify-center gap-1 min-h-[44px] bg-ch-bg border border-ch-border rounded text-xs font-semibold text-ch-text-primary hover:bg-ch-border"
                >
                  📞 Call
                </a>

                {cleanPhone ? (
                  <a
                    href={`https://wa.me/${cleanPhone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1 min-h-[44px] bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 rounded text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100"
                  >
                    💬 WhatsApp
                  </a>
                ) : (
                  <button
                    disabled
                    className="flex items-center justify-center min-h-[44px] bg-ch-bg border border-ch-border rounded text-xs text-ch-text-tertiary cursor-not-allowed"
                  >
                    No WA
                  </button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectRecord(record)}
                  className="min-h-[44px] text-xs font-semibold"
                >
                  Open
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

