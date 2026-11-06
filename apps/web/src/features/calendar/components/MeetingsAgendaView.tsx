import React from 'react';
import {
  MeetingVisitCalendarItemDto,
  MeetingCategory,
  MeetingStatus,
} from '@corviin-hub/shared';
import {
  Video,
  Phone,
  MapPin,
  Clock,
  User,
  Building2,
  Calendar,
  AlertCircle,
  RotateCcw,
  ExternalLink,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface MeetingsAgendaViewProps {
  items: MeetingVisitCalendarItemDto[];
  onSelectItem: (item: MeetingVisitCalendarItemDto) => void;
  onRescheduleItem: (item: MeetingVisitCalendarItemDto) => void;
}

export function MeetingsAgendaView({
  items,
  onSelectItem,
  onRescheduleItem,
}: MeetingsAgendaViewProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 bg-surface border border-ch-border text-center">
        <Calendar size={32} className="text-ch-text-muted mb-3" />
        <h3 className="text-sm font-semibold text-ch-text-primary">No Meetings or Site Visits Found</h3>
        <p className="text-xs text-ch-text-secondary mt-1 max-w-sm">
          No events match the selected period or filters. Try adjusting your filters or schedule a new event.
        </p>
      </div>
    );
  }

  // Group items by date string (YYYY-MM-DD)
  const grouped = items.reduce<Record<string, MeetingVisitCalendarItemDto[]>>((acc, item) => {
    const key = item.date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const formatDateHeader = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('default', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTimeSpan = (startIso: string, endIso: string) => {
    try {
      const s = new Date(startIso);
      const e = new Date(endIso);
      const sStr = s.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const eStr = e.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return `${sStr} - ${eStr}`;
    } catch {
      return '';
    }
  };

  const getCategoryBadge = (category: MeetingCategory, isSiteVisit: boolean) => {
    if (isSiteVisit || category === MeetingCategory.SITE_VISIT) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold bg-warning/15 text-warning border border-warning/30">
          <Building2 size={11} /> Site Visit
        </span>
      );
    }

    switch (category) {
      case MeetingCategory.ONLINE:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold bg-info/15 text-info border border-info/30">
            <Video size={11} /> Online Call
          </span>
        );
      case MeetingCategory.CLIENT:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
            Client Discovery
          </span>
        );
      case MeetingCategory.PARTNER:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            Partner
          </span>
        );
      case MeetingCategory.BUYER:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            Buyer Consultation
          </span>
        );
      case MeetingCategory.INTERNAL:
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
            Internal Team
          </span>
        );
    }
  };

  const getStatusBadge = (status: MeetingStatus) => {
    switch (status) {
      case MeetingStatus.CONFIRMED:
        return <Badge variant="success">Confirmed</Badge>;
      case MeetingStatus.RESCHEDULED:
        return <Badge variant="warning">Rescheduled</Badge>;
      case MeetingStatus.COMPLETED:
        return <Badge variant="secondary">Completed</Badge>;
      case MeetingStatus.CANCELLED:
        return <Badge variant="danger">Cancelled</Badge>;
      case MeetingStatus.NO_SHOW:
        return <Badge variant="danger">No Show</Badge>;
      case MeetingStatus.SCHEDULED:
      default:
        return <Badge variant="primary">Scheduled</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([dateStr, dateItems]) => (
        <div key={dateStr} className="space-y-2.5">
          {/* Date header */}
          <div className="flex items-center gap-2 pb-1 border-b border-ch-border">
            <Calendar size={14} className="text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-ch-text-primary">
              {formatDateHeader(dateStr)}
            </h3>
            <span className="text-[11px] text-ch-text-muted">
              ({dateItems.length} {dateItems.length === 1 ? 'event' : 'events'})
            </span>
          </div>

          {/* Event cards */}
          <div className="grid grid-cols-1 gap-2.5">
            {dateItems.map((item) => {
              const isSiteVisit = item.sourceType === 'SITE_VISIT';

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  className={`group relative p-3.5 bg-surface border transition-none cursor-pointer hover:border-ch-border-hover ${
                    item.isOverdue
                      ? 'border-danger/40 bg-danger/[0.02]'
                      : isSiteVisit
                      ? 'border-warning/30 bg-surface'
                      : 'border-ch-border'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    {/* Left Column: Category, Badges, Title, Details */}
                    <div className="space-y-2 flex-1">
                      {/* Badge row */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        {getCategoryBadge(item.category, isSiteVisit)}
                        {getStatusBadge(item.status)}

                        {item.hasRescheduleHistory && (
                          <span
                            title="Rescheduled event"
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-warning bg-warning/10 px-1.5 py-0.5 border border-warning/20"
                          >
                            <RotateCcw size={10} />
                            Rescheduled ({item.rescheduleCount}x)
                          </span>
                        )}

                        {item.isOverdue && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-danger bg-danger/10 px-1.5 py-0.5 border border-danger/20">
                            <AlertCircle size={10} />
                            Past Time
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h4 className="text-sm font-semibold text-ch-text-primary group-hover:text-primary">
                        {item.title}
                      </h4>

                      {/* Time, duration, location / details */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ch-text-secondary">
                        <div className="flex items-center gap-1">
                          <Clock size={13} className="text-ch-text-muted" />
                          <span>{formatTimeSpan(item.startTime, item.endTime)}</span>
                        </div>

                        {item.responsibleMemberId && (
                          <div className="flex items-center gap-1">
                            <User size={13} className="text-ch-text-muted" />
                            <span>Lead: {item.responsibleMemberId.slice(0, 8)}</span>
                          </div>
                        )}

                        {isSiteVisit && item.propertyUnit && (
                          <div className="flex items-center gap-1">
                            <Building2 size={13} className="text-warning" />
                            <span className="font-medium text-ch-text-primary">
                              {item.propertyUnit}
                            </span>
                          </div>
                        )}

                        {item.location && (
                          <div className="flex items-center gap-1 truncate max-w-xs">
                            <MapPin size={13} className="text-ch-text-muted shrink-0" />
                            <span className="truncate">{item.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Column: Direct Quick Action Buttons */}
                    <div
                      className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-ch-border"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-1.5">
                        {/* Join Link */}
                        {item.meetingUrl && (
                          <a
                            href={item.meetingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Join meeting ${item.title}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-primary text-white hover:bg-primary-hover focus:outline-none"
                          >
                            <Video size={12} />
                            <span>Join</span>
                            <ExternalLink size={10} />
                          </a>
                        )}

                        {/* Call Phone */}
                        {item.phoneNumber && (
                          <a
                            href={`tel:${item.phoneNumber}`}
                            aria-label={`Call ${item.phoneNumber}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium border border-ch-border bg-surface text-ch-text-primary hover:bg-surface-muted focus:outline-none"
                          >
                            <Phone size={12} className="text-success" />
                            <span>Call</span>
                          </a>
                        )}

                        {/* Google Maps link */}
                        {item.location && (
                          <a
                            href={`https://maps.google.com/?q=${encodeURIComponent(item.location)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View map for ${item.location}`}
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium border border-ch-border bg-surface text-ch-text-secondary hover:text-ch-text-primary hover:bg-surface-muted focus:outline-none"
                          >
                            <MapPin size={12} className="text-warning" />
                            <span className="hidden sm:inline">Map</span>
                          </a>
                        )}
                      </div>

                      {/* Reschedule Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRescheduleItem(item)}
                        className="h-7 text-xs text-ch-text-muted hover:text-ch-text-primary gap-1"
                      >
                        <RotateCcw size={12} />
                        <span>Reschedule</span>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

