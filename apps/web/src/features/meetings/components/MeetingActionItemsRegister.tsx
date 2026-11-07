import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MeetingItem } from '@corviin-hub/shared';
import { TaskPriority } from '@corviin-hub/shared';
import { convertMeetingActionItem } from '@/services/meetings';
import { getMemberName, formatMeetingDate } from './meeting-constants';

interface MeetingActionItemsRegisterProps {
  meetings: MeetingItem[];
  workspaceId: string;
}

interface FlattenedActionItem {
  id: string;
  meetingId: string;
  meetingTitle: string;
  meetingDate: string;
  description: string;
  assignedMemberId: string;
  dueDate?: string;
  priority?: TaskPriority;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CONVERTED';
  convertedTaskId?: string;
}

export const MeetingActionItemsRegister: React.FC<MeetingActionItemsRegisterProps> = ({
  meetings,
  workspaceId,
}) => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'CONVERTED'>('ALL');
  const [convertingId, setConvertingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Flatten action items across all meetings
  const allActionItems: FlattenedActionItem[] = useMemo(() => {
    const items: FlattenedActionItem[] = [];
    meetings.forEach((m) => {
      if (m.actionItems && m.actionItems.length > 0) {
        m.actionItems.forEach((ai) => {
          items.push({
            id: ai.id,
            meetingId: m.id,
            meetingTitle: m.title,
            meetingDate: m.date,
            description: ai.description,
            assignedMemberId: ai.assignedMemberId,
            dueDate: ai.dueDate,
            priority: ai.priority,
            status: ai.status,
            convertedTaskId: ai.convertedTaskId,
          });
        });
      }
    });
    return items;
  }, [meetings]);

  // Convert mutation
  const convertMutation = useMutation({
    mutationFn: async ({ meetingId, actionItemId }: { meetingId: string; actionItemId: string }) => {
      setConvertingId(actionItemId);
      return convertMeetingActionItem(workspaceId, meetingId, { actionItemId });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['meetings', workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['tasks', workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['meeting', workspaceId, variables.meetingId] });
      setSuccessMessage('Action item successfully converted into an actionable workspace task!');
      setTimeout(() => setSuccessMessage(null), 4000);
    },
    onSettled: () => {
      setConvertingId(null);
    },
  });

  const filteredItems = useMemo(() => {
    if (statusFilter === 'ALL') return allActionItems;
    if (statusFilter === 'PENDING') return allActionItems.filter((i) => i.status !== 'CONVERTED');
    return allActionItems.filter((i) => i.status === 'CONVERTED');
  }, [allActionItems, statusFilter]);

  const pendingCount = allActionItems.filter((i) => i.status !== 'CONVERTED').length;
  const convertedCount = allActionItems.filter((i) => i.status === 'CONVERTED').length;

  const getPriorityBadge = (priority?: TaskPriority) => {
    switch (priority) {
      case TaskPriority.URGENT:
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800';
      case TaskPriority.HIGH:
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case TaskPriority.MEDIUM:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-800';
      case TaskPriority.LOW:
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700';
    }
  };

  return (
    <div className="bg-surface border border-border rounded-md p-4 space-y-3">
      {/* Header and Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-primary">
              Workspace Action Items Register
            </h3>
            <span className="text-[11px] font-semibold px-2 py-0.5 bg-brand-teal/10 text-brand-teal rounded">
              {allActionItems.length} Total Commitments
            </span>
          </div>
          <p className="text-[11px] text-secondary mt-0.5">
            Operational deliverables extracted from meetings. Convert unassigned commitments to tracked tasks.
          </p>
        </div>

        {/* Status filter toggle */}
        <div className="flex rounded-md border border-border bg-surface-muted p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            className={`px-2.5 py-1 rounded transition-none font-medium ${
              statusFilter === 'ALL'
                ? 'bg-surface text-primary shadow-sm font-semibold'
                : 'text-secondary hover:text-primary'
            }`}
          >
            All ({allActionItems.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('PENDING')}
            className={`px-2.5 py-1 rounded transition-none font-medium ${
              statusFilter === 'PENDING'
                ? 'bg-surface text-primary shadow-sm font-semibold'
                : 'text-secondary hover:text-primary'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('CONVERTED')}
            className={`px-2.5 py-1 rounded transition-none font-medium ${
              statusFilter === 'CONVERTED'
                ? 'bg-surface text-primary shadow-sm font-semibold'
                : 'text-secondary hover:text-primary'
            }`}
          >
            Converted ({convertedCount})
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-3 text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-md flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span>✅</span>
            <span>{successMessage}</span>
          </span>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Content */}
      {filteredItems.length === 0 ? (
        <div className="p-8 text-center text-xs text-secondary border border-dashed border-border rounded-md">
          {allActionItems.length === 0
            ? 'No action items logged across workspace meetings yet.'
            : 'No action items match the selected status filter.'}
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto border border-border rounded-md">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface-muted border-b border-border text-secondary font-semibold">
                  <th className="py-2.5 px-3">Deliverable / Action Item</th>
                  <th className="py-2.5 px-3">Meeting Source</th>
                  <th className="py-2.5 px-3">Assignee</th>
                  <th className="py-2.5 px-3">Due Date</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Task Conversion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredItems.map((item) => {
                  const isConverted = item.status === 'CONVERTED';
                  const isConverting = convertingId === item.id;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-surface-muted/40 transition-none"
                    >
                      <td className="py-2.5 px-3 font-medium text-primary max-w-xs">
                        <span className="line-clamp-2">{item.description}</span>
                      </td>
                      <td className="py-2.5 px-3 text-secondary">
                        <Link
                          to={`/app/meetings/${item.meetingId}`}
                          className="text-brand-teal hover:underline font-medium line-clamp-1"
                          title={item.meetingTitle}
                        >
                          {item.meetingTitle}
                        </Link>
                        <span className="text-[10px] text-tertiary block">
                          {formatMeetingDate(item.meetingDate)}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-primary whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-surface-muted border border-border flex items-center justify-center text-[10px] font-bold text-secondary">
                            {getMemberName(item.assignedMemberId).charAt(0)}
                          </span>
                          <span>{getMemberName(item.assignedMemberId)}</span>
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-secondary whitespace-nowrap">
                        {item.dueDate ? formatMeetingDate(item.dueDate) : '—'}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${getPriorityBadge(
                            item.priority,
                          )}`}
                        >
                          {item.priority || 'MEDIUM'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        {isConverted ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                            ✓ Converted
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                            ● Pending
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        {isConverted ? (
                          <span className="text-secondary text-[11px] font-medium">
                            Tracked in Tasks
                          </span>
                        ) : (
                          <button
                            type="button"
                            disabled={isConverting}
                            onClick={() =>
                              convertMutation.mutate({
                                meetingId: item.meetingId,
                                actionItemId: item.id,
                              })
                            }
                            className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded bg-brand-teal text-white hover:bg-brand-teal/90 disabled:opacity-50 min-h-[32px] transition-none"
                          >
                            {isConverting ? 'Converting...' : 'Convert to Task'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-2.5">
            {filteredItems.map((item) => {
              const isConverted = item.status === 'CONVERTED';
              const isConverting = convertingId === item.id;

              return (
                <div
                  key={item.id}
                  className="bg-surface-muted/40 border border-border rounded-md p-3 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-xs text-primary">{item.description}</p>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold border shrink-0 ${getPriorityBadge(
                        item.priority,
                      )}`}
                    >
                      {item.priority || 'MEDIUM'}
                    </span>
                  </div>

                  <div className="text-[11px] text-secondary flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span>
                      From:{' '}
                      <Link
                        to={`/app/meetings/${item.meetingId}`}
                        className="text-brand-teal font-medium hover:underline"
                      >
                        {item.meetingTitle}
                      </Link>
                    </span>
                    <span>Assignee: <strong>{getMemberName(item.assignedMemberId)}</strong></span>
                    {item.dueDate && <span>Due: {formatMeetingDate(item.dueDate)}</span>}
                  </div>

                  <div className="pt-2 border-t border-border flex items-center justify-between">
                    <div>
                      {isConverted ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                          ✓ Converted
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                          ● Pending Action
                        </span>
                      )}
                    </div>

                    {!isConverted && (
                      <button
                        type="button"
                        disabled={isConverting}
                        onClick={() =>
                          convertMutation.mutate({
                            meetingId: item.meetingId,
                            actionItemId: item.id,
                          })
                        }
                        className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold rounded bg-brand-teal text-white hover:bg-brand-teal/90 disabled:opacity-50 min-h-[44px] transition-none"
                      >
                        {isConverting ? 'Converting...' : 'Convert to Task'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
export default MeetingActionItemsRegister;

