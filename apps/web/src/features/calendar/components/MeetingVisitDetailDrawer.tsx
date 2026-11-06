import React, { useState } from 'react';
import {
  MeetingVisitCalendarItemDto,
  MeetingItem,
  SiteVisitItem,
  MeetingCategory,
  MeetingStatus,
  TaskPriority,
} from '@corviin-hub/shared';
import { Drawer } from '@/components/ui/Drawer';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Phone,
  User,
  Building2,
  Users,
  FileText,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  ExternalLink,
  ArrowRight,
  ListTodo,
} from 'lucide-react';
import { convertMeetingActionItem } from '@/services/meetings';

interface MeetingVisitDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  item: MeetingVisitCalendarItemDto | null;
  meetingDetails?: MeetingItem | null;
  siteVisitDetails?: SiteVisitItem | null;
  workspaceId: string;
  onReschedule: (item: MeetingVisitCalendarItemDto) => void;
  onStatusUpdate: (newStatus: MeetingStatus) => void;
  onActionItemConverted?: () => void;
}

export function MeetingVisitDetailDrawer({
  open,
  onClose,
  item,
  meetingDetails,
  siteVisitDetails,
  workspaceId,
  onReschedule,
  onStatusUpdate,
  onActionItemConverted,
}: MeetingVisitDetailDrawerProps) {
  const [convertingId, setConvertingId] = useState<string | null>(null);

  if (!item) return null;

  const isSiteVisit = item.sourceType === 'SITE_VISIT';

  const formatTimeRange = (start: string, end: string) => {
    try {
      const s = new Date(start);
      const e = new Date(end);
      return `${s.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${e.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
      return '';
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr + 'T00:00:00').toLocaleDateString([], {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const handleConvertActionItem = async (actionItemId: string, description: string) => {
    try {
      setConvertingId(actionItemId);
      await convertMeetingActionItem(workspaceId, item.sourceId, {
        actionItemId,
        taskTitle: description,
        priority: TaskPriority.HIGH,
      });
      if (onActionItemConverted) onActionItemConverted();
    } catch (err) {
      console.error('Failed to convert action item to task:', err);
    } finally {
      setConvertingId(null);
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={isSiteVisit ? 'Property Site Visit Detail' : 'Meeting Details'}
      width="w-full max-w-lg"
    >
      <div className="space-y-6 text-xs text-ch-text-primary">
        {/* Title & Badges */}
        <div className="space-y-2 pb-3 border-b border-ch-border">
          <div className="flex flex-wrap items-center gap-1.5">
            {isSiteVisit ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold bg-warning/15 text-warning border border-warning/30">
                <Building2 size={11} /> Site Visit
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
                {item.category}
              </span>
            )}
            <Badge variant="outline">{item.status}</Badge>

            {item.hasRescheduleHistory && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-warning bg-warning/10 px-1.5 py-0.5 border border-warning/20">
                <RotateCcw size={10} />
                Rescheduled ({item.rescheduleCount}x)
              </span>
            )}

            {item.isOverdue && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-danger bg-danger/10 px-1.5 py-0.5 border border-danger/20">
                <AlertCircle size={10} />
                Overdue / Past End Time
              </span>
            )}
          </div>

          <h2 className="text-base font-bold text-ch-text-primary">{item.title}</h2>
        </div>

        {/* Date & Time Section */}
        <div className="bg-surface-muted/40 p-3 border border-ch-border space-y-2">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-primary" />
            <span className="font-semibold text-ch-text-primary">{formatDate(item.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-ch-text-secondary">
            <Clock size={14} className="text-ch-text-muted" />
            <span>{formatTimeRange(item.startTime, item.endTime)}</span>
          </div>
        </div>

        {/* Location / Video / Call Action Strip */}
        <div className="space-y-2">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-ch-text-muted">
            Location & Access
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {item.meetingUrl && (
              <a
                href={item.meetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 border border-info/30 bg-info/5 hover:bg-info/10 text-info font-medium transition-none"
              >
                <div className="flex items-center gap-2 truncate">
                  <Video size={14} className="shrink-0" />
                  <span className="truncate">Join Video Call</span>
                </div>
                <ExternalLink size={12} className="shrink-0" />
              </a>
            )}

            {item.phoneNumber && (
              <a
                href={`tel:${item.phoneNumber}`}
                className="flex items-center justify-between p-2.5 border border-success/30 bg-success/5 hover:bg-success/10 text-success font-medium transition-none"
              >
                <div className="flex items-center gap-2 truncate">
                  <Phone size={14} className="shrink-0" />
                  <span className="truncate">{item.phoneNumber}</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-success/80">Call</span>
              </a>
            )}

            {item.location && (
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(item.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="col-span-1 sm:col-span-2 flex items-center justify-between p-2.5 border border-ch-border bg-surface hover:bg-surface-muted transition-none text-ch-text-primary"
              >
                <div className="flex items-center gap-2 truncate">
                  <MapPin size={14} className="text-warning shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>
                <span className="text-[10px] text-ch-text-muted shrink-0 flex items-center gap-1">
                  View Map <ExternalLink size={10} />
                </span>
              </a>
            )}
          </div>
        </div>

        {/* Real Estate Site Visit Details */}
        {isSiteVisit && (
          <div className="space-y-3 bg-warning/[0.04] p-3 border border-warning/30">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-warning flex items-center gap-1.5">
              <Building2 size={13} />
              Property & Buyer Information
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-ch-text-muted block text-[10px]">Project Name</span>
                <span className="font-semibold text-ch-text-primary">{item.projectName || siteVisitDetails?.projectName}</span>
              </div>
              <div>
                <span className="text-ch-text-muted block text-[10px]">Unit / Configuration</span>
                <span className="font-semibold text-ch-text-primary">{item.propertyUnit || siteVisitDetails?.propertyUnit}</span>
              </div>
              <div>
                <span className="text-ch-text-muted block text-[10px]">Buyer Name</span>
                <span className="font-semibold text-ch-text-primary">{item.buyerName || siteVisitDetails?.buyerName}</span>
              </div>
              <div>
                <span className="text-ch-text-muted block text-[10px]">Buyer Contact</span>
                <span className="font-semibold text-ch-text-primary">{item.phoneNumber || siteVisitDetails?.buyerPhone}</span>
              </div>
            </div>
          </div>
        )}

        {/* Meeting Organiser & Participants */}
        {!isSiteVisit && (
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-ch-text-muted">
              Participants
            </h4>
            <div className="p-2.5 border border-ch-border bg-surface space-y-2">
              <div className="flex items-center gap-2">
                <User size={13} className="text-primary" />
                <span className="text-ch-text-secondary">Organiser:</span>
                <span className="font-semibold text-ch-text-primary">
                  {item.responsibleMemberId || 'Organiser'}
                </span>
              </div>
              {meetingDetails?.externalParticipants && meetingDetails.externalParticipants.length > 0 && (
                <div className="flex items-start gap-2 pt-1 border-t border-ch-border">
                  <Users size={13} className="text-ch-text-muted mt-0.5" />
                  <span className="text-ch-text-secondary">External:</span>
                  <div className="flex flex-wrap gap-1">
                    {meetingDetails.externalParticipants.map((ext, idx) => (
                      <span key={idx} className="bg-surface-muted px-1.5 py-0.5 text-[10px] border border-ch-border">
                        {ext}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Agenda / Objective */}
        {(item.agenda || meetingDetails?.agenda) && (
          <div className="space-y-1.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-ch-text-muted">
              Agenda & Objectives
            </h4>
            <div className="p-2.5 border border-ch-border bg-surface text-ch-text-secondary whitespace-pre-wrap leading-relaxed">
              {item.agenda || meetingDetails?.agenda}
            </div>
          </div>
        )}

        {/* Notes & Key Decisions */}
        {(item.notes || meetingDetails?.notes || siteVisitDetails?.notes) && (
          <div className="space-y-1.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-ch-text-muted">
              Meeting Notes
            </h4>
            <div className="p-2.5 border border-ch-border bg-surface text-ch-text-secondary whitespace-pre-wrap leading-relaxed">
              {item.notes || meetingDetails?.notes || siteVisitDetails?.notes}
            </div>
          </div>
        )}

        {meetingDetails?.decisions && meetingDetails.decisions.length > 0 && (
          <div className="space-y-1.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-success">
              Decisions Reached
            </h4>
            <ul className="list-disc list-inside space-y-1 p-2.5 border border-success/20 bg-success/5 text-ch-text-primary">
              {meetingDetails.decisions.map((dec, idx) => (
                <li key={idx} className="leading-snug">
                  {dec}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Items with One-Click Task Conversion */}
        {meetingDetails?.actionItems && meetingDetails.actionItems.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <ListTodo size={13} />
                Action Items ({meetingDetails.actionItems.length})
              </h4>
            </div>

            <div className="space-y-2">
              {meetingDetails.actionItems.map((act) => (
                <div
                  key={act.id}
                  className="p-2.5 border border-ch-border bg-surface space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium text-ch-text-primary flex-1 leading-snug">
                      {act.description}
                    </span>
                    {act.status === 'CONVERTED' ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold bg-success/10 text-success border border-success/30">
                        <CheckCircle2 size={10} />
                        Task Linked
                      </span>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={convertingId === act.id}
                        onClick={() => handleConvertActionItem(act.id, act.description)}
                        className="h-6 px-2 text-[10px] gap-1 shrink-0 font-medium border-primary/30 text-primary hover:bg-primary/10"
                      >
                        <ArrowRight size={10} />
                        <span>{convertingId === act.id ? 'Creating...' : 'Convert to Task'}</span>
                      </Button>
                    )}
                  </div>
                  {act.dueDate && (
                    <div className="text-[10px] text-ch-text-muted flex items-center gap-1">
                      <Clock size={11} /> Due: {new Date(act.dueDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reschedule Audit History */}
        {item.hasRescheduleHistory && (
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-warning flex items-center gap-1">
              <RotateCcw size={12} />
              Reschedule History ({item.rescheduleCount})
            </h4>

            <div className="space-y-2 border border-warning/20 bg-warning/[0.02] p-2.5">
              {(meetingDetails?.rescheduleHistory || siteVisitDetails?.rescheduleHistory || []).map(
                (evt, idx) => (
                  <div key={idx} className="border-b border-ch-border last:border-0 pb-2 last:pb-0 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-ch-text-primary">
                        Shifted by {evt.actorName}
                      </span>
                      <span className="text-ch-text-muted">
                        {new Date(evt.timestamp).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="text-[11px] text-warning font-medium italic">
                      "{evt.reason}"
                    </div>
                    <div className="text-[10px] text-ch-text-muted">
                      From: {evt.oldPlannedStart ? new Date(evt.oldPlannedStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'} → To: {evt.newPlannedStart ? new Date(evt.newPlannedStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-ch-border flex flex-wrap items-center justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onReschedule(item)}
            className="text-xs gap-1.5 text-warning border-warning/40 hover:bg-warning/10"
          >
            <RotateCcw size={13} />
            <span>Reschedule</span>
          </Button>

          <div className="flex items-center gap-2">
            {item.status !== MeetingStatus.COMPLETED && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusUpdate(MeetingStatus.COMPLETED)}
                className="text-xs gap-1.5 text-success border-success/40 hover:bg-success/10"
              >
                <CheckCircle2 size={13} />
                <span>Mark Completed</span>
              </Button>
            )}

            <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
              Close
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
