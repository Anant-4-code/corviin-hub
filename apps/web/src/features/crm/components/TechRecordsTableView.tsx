import {
  Phone,
  MessageSquare,
  Clock,
  ArrowRight,
  AlertCircle,
  Building2,
  User,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TechCrmRecord } from '@corviin-hub/shared';
import {
  TECH_CATEGORY_LABELS,
  TECH_CATEGORY_COLORS,
  TECH_STAGE_LABELS,
  TECH_STAGE_COLORS,
} from './tech-crm-constants';

interface TechRecordsTableViewProps {
  records: TechCrmRecord[];
  onSelectRecord: (record: TechCrmRecord) => void;
  onScheduleFollowUp?: (record: TechCrmRecord) => void;
}

export function TechRecordsTableView({
  records,
  onSelectRecord,
  onScheduleFollowUp,
}: TechRecordsTableViewProps) {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  const cleanPhoneForWhatsApp = (phone: string) => {
    return phone.replace(/[^0-9]/g, '');
  };

  const formatFollowUp = (isoDate?: string) => {
    if (!isoDate) return null;
    const isToday = isoDate.startsWith(todayStr);
    const isPast = new Date(isoDate) < now && !isToday;
    const formatted = new Date(isoDate).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });

    return {
      text: isToday ? `Today (${new Date(isoDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})` : formatted,
      isToday,
      isPast,
    };
  };

  const formatLastActivity = (isoDate: string) => {
    const d = new Date(isoDate);
    const diffHours = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-3">
      {/* ======================================================== */}
      {/* DESKTOP TABLE VIEW (md and up)                           */}
      {/* ======================================================== */}
      <div className="hidden md:block border border-ch-border bg-surface overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-surface-raised border-b border-ch-border text-ch-text-secondary font-semibold">
              <th className="py-2.5 px-3">Contact & Company</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3">Enquiry / Service</th>
              <th className="py-2.5 px-3">Stage</th>
              <th className="py-2.5 px-3">Assigned Lead</th>
              <th className="py-2.5 px-3">Source</th>
              <th className="py-2.5 px-3">Next Follow-up</th>
              <th className="py-2.5 px-3">Last Activity</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ch-border">
            {records.map((r) => {
              const followUp = formatFollowUp(r.nextFollowUpDate);

              return (
                <tr
                  key={r.id}
                  onClick={() => onSelectRecord(r)}
                  className="hover:bg-surface-raised/60 cursor-pointer transition-none"
                >
                  {/* Contact / Person & Company */}
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-ch-text-primary">
                      {r.company}
                    </div>
                    <div className="flex items-center gap-1.5 text-ch-text-secondary text-[11px] mt-0.5">
                      <User className="w-3 h-3 text-ch-text-muted" />
                      <span>{r.name}</span>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-semibold border ${
                        TECH_CATEGORY_COLORS[r.category] || 'bg-surface border-ch-border'
                      }`}
                    >
                      {TECH_CATEGORY_LABELS[r.category] || r.category}
                    </span>
                  </td>

                  {/* Enquiry / Service */}
                  <td className="py-2.5 px-3 max-w-[220px]">
                    <div className="truncate text-ch-text-primary font-medium" title={r.requirementSummary}>
                      {r.requirementSummary}
                    </div>
                    {r.estimatedBudget && (
                      <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                        ₹{r.estimatedBudget.toLocaleString('en-IN')}
                      </div>
                    )}
                  </td>

                  {/* Stage */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-bold border ${
                        TECH_STAGE_COLORS[r.stage] || 'bg-surface border-ch-border text-ch-text-primary'
                      }`}
                    >
                      {TECH_STAGE_LABELS[r.stage] || r.stage}
                    </span>
                  </td>

                  {/* Assigned Lead */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="font-medium text-ch-text-primary">
                      {r.assignedMemberName}
                    </span>
                  </td>

                  {/* Source */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="text-ch-text-secondary">
                      {r.source}
                    </span>
                  </td>

                  {/* Next Follow-up */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    {followUp ? (
                      <div
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 font-medium text-[11px] border ${
                          followUp.isPast
                            ? 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
                            : followUp.isToday
                              ? 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                              : 'bg-surface text-ch-text-secondary border-ch-border'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        <span>{followUp.text}</span>
                        {followUp.isPast && <span className="font-bold text-[9px] uppercase ml-0.5">[Overdue]</span>}
                      </div>
                    ) : (
                      <span className="text-ch-text-muted text-[11px]">None scheduled</span>
                    )}
                  </td>

                  {/* Last Activity */}
                  <td className="py-2.5 px-3 whitespace-nowrap text-ch-text-secondary text-[11px]">
                    {formatLastActivity(r.lastActivityDate)}
                  </td>

                  {/* Actions */}
                  <td
                    className="py-2.5 px-3 text-right whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1">
                      {r.phone && (
                        <a
                          href={`tel:${r.phone}`}
                          title={`Call ${r.phone}`}
                          className="p-1 text-ch-text-secondary hover:text-ch-accent hover:bg-surface-raised border border-transparent hover:border-ch-border"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {r.phone && (
                        <a
                          href={`https://wa.me/${cleanPhoneForWhatsApp(r.phone)}`}
                          target="_blank"
                          rel="noreferrer"
                          title={`WhatsApp ${r.phone}`}
                          className="p-1 text-ch-text-secondary hover:text-emerald-600 hover:bg-surface-raised border border-transparent hover:border-ch-border"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onSelectRecord(r)}
                        className="h-7 px-2 text-xs text-ch-text-primary"
                      >
                        <span>Open</span>
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ======================================================== */}
      {/* MOBILE CARDS VIEW (below md)                             */}
      {/* ======================================================== */}
      <div className="md:hidden space-y-2.5">
        {records.map((r) => {
          const followUp = formatFollowUp(r.nextFollowUpDate);

          return (
            <div
              key={r.id}
              onClick={() => onSelectRecord(r)}
              className="p-3 bg-surface border border-ch-border hover:border-ch-accent/50 cursor-pointer space-y-2"
            >
              {/* Header: Company & Stage */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-ch-text-primary leading-tight">
                    {r.company}
                  </h4>
                  <div className="text-xs text-ch-text-secondary mt-0.5">
                    {r.name}
                  </div>
                </div>
                <span
                  className={`inline-block px-1.5 py-0.5 text-[10px] font-bold border shrink-0 ${
                    TECH_STAGE_COLORS[r.stage] || 'bg-surface border-ch-border text-ch-text-primary'
                  }`}
                >
                  {TECH_STAGE_LABELS[r.stage] || r.stage}
                </span>
              </div>

              {/* Requirement Summary */}
              <p className="text-xs text-ch-text-secondary line-clamp-2">
                {r.requirementSummary}
              </p>

              {/* Metadata tags */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <span
                  className={`px-1.5 py-0.5 font-semibold border ${
                    TECH_CATEGORY_COLORS[r.category] || 'bg-surface border-ch-border'
                  }`}
                >
                  {TECH_CATEGORY_LABELS[r.category]}
                </span>
                {r.estimatedBudget && (
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{r.estimatedBudget.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-ch-text-muted">• {r.assignedMemberName}</span>
              </div>

              {/* Follow-up info & Mobile quick actions */}
              <div
                className="pt-2 border-t border-ch-border flex items-center justify-between gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                {followUp ? (
                  <div
                    className={`inline-flex items-center gap-1 text-[11px] ${
                      followUp.isPast
                        ? 'text-rose-600 font-bold'
                        : followUp.isToday
                          ? 'text-amber-600 font-semibold'
                          : 'text-ch-text-secondary'
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    <span>Follow-up: {followUp.text}</span>
                  </div>
                ) : (
                  <span className="text-[11px] text-ch-text-muted">No follow-up</span>
                )}

                <div className="flex items-center gap-1">
                  {r.phone && (
                    <a
                      href={`tel:${r.phone}`}
                      className="inline-flex items-center justify-center w-8 h-8 bg-surface-raised border border-ch-border text-ch-text-primary"
                      title="Call"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {r.phone && (
                    <a
                      href={`https://wa.me/${cleanPhoneForWhatsApp(r.phone)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center w-8 h-8 bg-surface-raised border border-ch-border text-emerald-600"
                      title="WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSelectRecord(r)}
                    className="h-8 px-2 text-xs"
                  >
                    Open
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

