import React, { useState } from 'react';
import type { TaskItem } from '@corviin-hub/shared';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityIndicator } from '@/components/ui/PriorityIndicator';
import { CommentComposer } from '@/components/ui/CommentComposer';
import { AttachmentList } from '@/components/ui/AttachmentList';
import { formatDateTime, formatDate, formatDuration, getStatusBadgeType, getStatusLabel } from '../utils/task-utils';
import {
  Play,
  Pause,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Clock,
  User,
  Plus,
  Paperclip,
  Activity,
  Layers,
  CalendarClock,
} from 'lucide-react';

interface TaskDetailDrawerProps {
  task: TaskItem | null;
  open: boolean;
  onClose: () => void;
  onStartSession: (id: string) => Promise<void>;
  onPauseSession: (id: string) => Promise<void>;
  onResumeSession: (id: string) => Promise<void>;
  onOpenCompleteModal: (task: TaskItem) => void;
  onOpenBlockModal: (task: TaskItem) => void;
  onOpenRescheduleModal: (task: TaskItem) => void;
  onToggleChecklist: (taskId: string, checklistId: string) => Promise<void>;
  onAddChecklist: (taskId: string, title: string) => Promise<void>;
  onAddComment: (taskId: string, content: string) => Promise<void>;
  onAddAttachment: (taskId: string, file: { id: string; name: string; url: string; size: number; type: 'image' | 'video' | 'document' | 'archive' | 'other'; uploadedAt: string }) => Promise<void>;
}

export function TaskDetailDrawer({
  task,
  open,
  onClose,
  onStartSession,
  onPauseSession,
  onResumeSession,
  onOpenCompleteModal,
  onOpenBlockModal,
  onOpenRescheduleModal,
  onToggleChecklist,
  onAddChecklist,
  onAddComment,
  onAddAttachment,
}: TaskDetailDrawerProps) {
  const [newChecklistText, setNewChecklistText] = useState('');
  const [addingChecklist, setAddingChecklist] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'checklist' | 'activity' | 'comments'>('overview');

  if (!task) return null;

  const completedChecklistCount = (task.checklist || []).filter((c) => c.completed).length;
  const totalChecklistCount = (task.checklist || []).length;
  const checklistPercent = totalChecklistCount > 0 ? Math.round((completedChecklistCount / totalChecklistCount) * 100) : 0;

  const totalDurationSeconds = (task.workSessions || []).reduce((acc, s) => acc + (s.durationSeconds || 0), 0);

  const handleAddChecklistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;
    try {
      setAddingChecklist(true);
      await onAddChecklist(task.id, newChecklistText.trim());
      setNewChecklistText('');
    } finally {
      setAddingChecklist(false);
    }
  };

  const handleUploadSimulated = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        await onAddAttachment(task.id, {
          id: `att-${Math.random().toString(36).substring(2, 8)}`,
          name: file.name,
          url: URL.createObjectURL(file),
          size: file.size,
          type: 'document',
          uploadedAt: new Date().toISOString(),
        });
      }
    };
    input.click();
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={task.title}
      width="w-full sm:max-w-xl md:max-w-2xl"
    >
      <div className="space-y-6 pb-12">
        {/* SECTION 1: HEADER & PRIMARY WORK ACTIONS */}
        <div className="space-y-3 pb-4 border-b border-ch-border">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <StatusBadge type={getStatusBadgeType(task.status)} label={getStatusLabel(task.status)} />
              <PriorityIndicator priority={task.priority} />
            </div>
            <div className="text-xs text-ch-text-secondary">
              ID: <span className="font-mono">{task.id.slice(0, 8)}</span>
            </div>
          </div>

          <h1 className="text-xl font-bold text-ch-text-primary tracking-tight">
            {task.title}
          </h1>

          {/* Context-Sensitive Primary Work Controls */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {task.status === 'TODO' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onStartSession(task.id)}
              >
                <Play size={14} className="mr-1.5 fill-current" />
                Start Work
              </Button>
            )}

            {task.status === 'IN_PROGRESS' && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onPauseSession(task.id)}
                >
                  <Pause size={14} className="mr-1.5" />
                  Pause (Hold)
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onOpenCompleteModal(task)}
                >
                  <CheckCircle2 size={14} className="mr-1.5" />
                  Complete Task
                </Button>
              </>
            )}

            {task.status === 'ON_HOLD' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onResumeSession(task.id)}
              >
                <Play size={14} className="mr-1.5 fill-current" />
                Resume Work
              </Button>
            )}

            {task.status === 'BLOCKED' && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onResumeSession(task.id)}
              >
                <Play size={14} className="mr-1.5 fill-current" />
                Unblock & Resume
              </Button>
            )}

            {task.status !== 'COMPLETED' && task.status !== 'CANCELLED' && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenRescheduleModal(task)}
                >
                  <CalendarClock size={14} className="mr-1.5" />
                  Reschedule
                </Button>
                {task.status !== 'BLOCKED' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-danger hover:bg-danger/10"
                    onClick={() => onOpenBlockModal(task)}
                  >
                    <AlertTriangle size={14} className="mr-1.5" />
                    Block
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {/* BLOCKER ALERT (IF BLOCKED) */}
        {task.status === 'BLOCKED' && task.blockerReason && (
          <div className="p-3 bg-danger/10 border border-danger/30 rounded text-xs text-danger space-y-1">
            <div className="font-semibold flex items-center gap-1.5">
              <AlertTriangle size={15} /> Blocker Details:
            </div>
            <p className="text-ch-text-primary pl-5">{task.blockerReason}</p>
            {task.expectedResolutionDate && (
              <p className="text-ch-text-secondary pl-5 text-[11px]">
                Expected resolution by: {formatDate(task.expectedResolutionDate)}
              </p>
            )}
          </div>
        )}

        {/* SECTION 12: COMPLETION NOTE (IF COMPLETED) */}
        {task.status === 'COMPLETED' && (
          <div className="p-3 bg-success/10 border border-success/30 rounded text-xs text-success space-y-1">
            <div className="font-semibold flex items-center gap-1.5">
              <CheckCircle2 size={15} /> Completed on {formatDateTime(task.completedAt)} by {task.completedBy || 'Assignee'}
            </div>
            {task.completionNote && (
              <p className="text-ch-text-primary pl-5 mt-1 text-xs">
                <span className="font-medium text-ch-text-secondary">Note: </span>
                {task.completionNote}
              </p>
            )}
          </div>
        )}

        {/* NAVIGATION TABS WITHIN DRAWER */}
        <div className="flex border-b border-ch-border text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2 border-b-2 -mb-px ${
              activeTab === 'overview'
                ? 'border-accent text-accent font-semibold'
                : 'border-transparent text-ch-text-secondary hover:text-ch-text-primary'
            }`}
          >
            Overview & Schedule
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('checklist')}
            className={`px-3 py-2 border-b-2 -mb-px flex items-center gap-1.5 ${
              activeTab === 'checklist'
                ? 'border-accent text-accent font-semibold'
                : 'border-transparent text-ch-text-secondary hover:text-ch-text-primary'
            }`}
          >
            Checklist ({completedChecklistCount}/{totalChecklistCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('activity')}
            className={`px-3 py-2 border-b-2 -mb-px flex items-center gap-1.5 ${
              activeTab === 'activity'
                ? 'border-accent text-accent font-semibold'
                : 'border-transparent text-ch-text-secondary hover:text-ch-text-primary'
            }`}
          >
            History & Sessions ({task.workSessions?.length || 0})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('comments')}
            className={`px-3 py-2 border-b-2 -mb-px flex items-center gap-1.5 ${
              activeTab === 'comments'
                ? 'border-accent text-accent font-semibold'
                : 'border-transparent text-ch-text-secondary hover:text-ch-text-primary'
            }`}
          >
            Comments ({task.comments?.length || 0})
          </button>
        </div>

        {/* TAB: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* SECTION 2: DESCRIPTION */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-semibold text-ch-text-secondary uppercase tracking-wider">
                Description
              </h2>
              <div className="text-sm text-ch-text-primary whitespace-pre-wrap leading-relaxed bg-surface-muted/30 p-3 rounded border border-ch-border">
                {task.description || 'No description provided.'}
              </div>
            </div>

            {/* SECTION 3: SCHEDULE */}
            <div className="space-y-2">
              <h2 className="text-xs font-semibold text-ch-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <Calendar size={13} /> Schedule Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-surface-muted/20 p-3 rounded border border-ch-border">
                <div>
                  <div className="text-ch-text-secondary">Planned Start:</div>
                  <div className="font-medium text-ch-text-primary mt-0.5">
                    {formatDateTime(task.plannedStart)}
                  </div>
                </div>
                <div>
                  <div className="text-ch-text-secondary">Deadline:</div>
                  <div className="font-semibold text-ch-text-primary mt-0.5">
                    {formatDateTime(task.deadline)}
                  </div>
                </div>
                <div>
                  <div className="text-ch-text-secondary">Actual Start:</div>
                  <div className="font-medium text-ch-text-primary mt-0.5">
                    {formatDateTime(task.actualStart)}
                  </div>
                </div>
                <div>
                  <div className="text-ch-text-secondary">Total Time Logged:</div>
                  <div className="font-medium text-ch-text-primary mt-0.5">
                    {formatDuration(totalDurationSeconds)}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 4: PEOPLE */}
            <div className="space-y-2">
              <h2 className="text-xs font-semibold text-ch-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <User size={13} /> People & Ownership
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-surface-muted/20 p-3 rounded border border-ch-border">
                <div>
                  <div className="text-ch-text-secondary">Assignee:</div>
                  <div className="font-semibold text-ch-text-primary mt-0.5">
                    {task.assigneeName || 'Assigned Member'}
                  </div>
                </div>
                <div>
                  <div className="text-ch-text-secondary">Creator:</div>
                  <div className="font-medium text-ch-text-primary mt-0.5">
                    {task.creatorName || 'Creator'}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 6: LINKED RECORDS */}
            <div className="space-y-2">
              <h2 className="text-xs font-semibold text-ch-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <Layers size={13} /> Linked Operations Record
              </h2>
              <div className="text-xs p-3 bg-surface-muted/20 rounded border border-ch-border flex items-center justify-between">
                <div>
                  <div className="text-ch-text-secondary uppercase text-[10px] tracking-wider font-semibold">
                    {task.linkedRecord ? task.linkedRecord.type.toUpperCase() : 'NO LINKED RECORD'}
                  </div>
                  <div className="font-medium text-ch-text-primary mt-0.5">
                    {task.linkedRecord ? task.linkedRecord.title : 'Standalone Task'}
                  </div>
                </div>
                {task.linkedRecord && (
                  <span className="text-[11px] font-mono text-ch-text-secondary bg-surface px-2 py-0.5 rounded border border-ch-border">
                    {task.linkedRecord.id.slice(0, 8)}
                  </span>
                )}
              </div>
            </div>

            {/* SECTION 8: ATTACHMENTS */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold text-ch-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                  <Paperclip size={13} /> Attachments ({(task.attachments || []).length})
                </h2>
                <Button size="sm" variant="ghost" onClick={handleUploadSimulated} className="text-xs h-7">
                  <Plus size={13} className="mr-1" /> Add File
                </Button>
              </div>
              <AttachmentList
                attachments={task.attachments || []}
                onDownload={(att) => att.url && window.open(att.url, '_blank')}
              />
            </div>
          </div>
        )}

        {/* TAB: CHECKLIST */}
        {activeTab === 'checklist' && (
          <div className="space-y-4">
            {/* SECTION 5: CHECKLIST WITH LIVE TOGGLES */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs font-semibold text-ch-text-secondary uppercase tracking-wider">
                  Subtask Checklist
                </h2>
                <div className="text-xs text-ch-text-secondary mt-0.5">
                  {completedChecklistCount} of {totalChecklistCount} items completed ({checklistPercent}%)
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-surface-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-accent"
                style={{ width: `${checklistPercent}%` }}
              />
            </div>

            {/* Checklist items */}
            <div className="space-y-2">
              {(task.checklist || []).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onToggleChecklist(task.id, item.id)}
                  className={`flex items-start gap-2.5 p-2.5 rounded border text-xs cursor-pointer select-none ${
                    item.completed
                      ? 'bg-surface-muted/30 border-ch-border text-ch-text-secondary line-through'
                      : 'bg-surface border-ch-border text-ch-text-primary hover:border-accent'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => {}}
                    className="mt-0.5 rounded border-ch-border text-accent focus:ring-accent"
                  />
                  <div className="flex-1">
                    <span>{item.title}</span>
                  </div>
                </div>
              ))}

              {(!task.checklist || task.checklist.length === 0) && (
                <div className="text-center py-6 text-xs text-ch-text-secondary border border-dashed border-ch-border rounded">
                  No checklist items defined. Add actionable steps below.
                </div>
              )}
            </div>

            {/* Add item form */}
            <form onSubmit={handleAddChecklistSubmit} className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Add new subtask item..."
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                className="flex-1 text-xs px-3 py-1.5 rounded bg-surface border border-ch-border text-ch-text-primary placeholder:text-ch-text-muted focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <Button type="submit" size="sm" variant="secondary" disabled={!newChecklistText.trim() || addingChecklist}>
                <Plus size={14} className="mr-1" /> Add
              </Button>
            </form>
          </div>
        )}

        {/* TAB: ACTIVITY & SESSIONS */}
        {activeTab === 'activity' && (
          <div className="space-y-6">
            {/* SECTION 9: WORK SESSIONS */}
            <div className="space-y-2">
              <h2 className="text-xs font-semibold text-ch-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={13} /> Work Sessions ({task.workSessions?.length || 0})
              </h2>
              <div className="space-y-2">
                {(task.workSessions || []).map((session) => (
                  <div
                    key={session.id}
                    className="p-2.5 text-xs bg-surface-muted/30 border border-ch-border rounded flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-ch-text-primary">{session.actorName}</div>
                      <div className="text-ch-text-secondary text-[11px] mt-0.5">
                        Started: {formatDateTime(session.startedAt)}
                      </div>
                      {session.endedAt ? (
                        <div className="text-ch-text-secondary text-[11px]">
                          Ended: {formatDateTime(session.endedAt)}
                        </div>
                      ) : (
                        <div className="text-info font-medium text-[11px] flex items-center gap-1 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-info" />
                          Active Session In Progress
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-xs font-bold text-ch-text-primary">
                        {formatDuration(session.durationSeconds)}
                      </div>
                    </div>
                  </div>
                ))}

                {(!task.workSessions || task.workSessions.length === 0) && (
                  <div className="text-center py-4 text-xs text-ch-text-secondary border border-dashed border-ch-border rounded">
                    No work sessions recorded yet. Start work to begin tracking session time.
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 10: RESCHEDULE HISTORY */}
            <div className="space-y-2">
              <h2 className="text-xs font-semibold text-ch-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <CalendarClock size={13} /> Reschedule History ({(task.rescheduleHistory || []).length})
              </h2>
              <div className="space-y-2">
                {(task.rescheduleHistory || []).map((event) => (
                  <div
                    key={event.id}
                    className="p-2.5 text-xs bg-surface-muted/20 border border-ch-border rounded space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-ch-text-primary">{event.actorName}</span>
                      <span className="text-ch-text-secondary">{formatDateTime(event.timestamp)}</span>
                    </div>
                    <div className="text-ch-text-secondary text-[11px]">
                      Changed deadline from <span className="line-through">{formatDateTime(event.oldDeadline)}</span> to{' '}
                      <span className="font-medium text-ch-text-primary">{formatDateTime(event.newDeadline)}</span>
                    </div>
                    <div className="text-xs text-ch-text-primary bg-surface p-1.5 rounded border border-ch-border">
                      <span className="font-medium text-ch-text-secondary">Reason: </span>
                      {event.reason}
                    </div>
                  </div>
                ))}

                {(!task.rescheduleHistory || task.rescheduleHistory.length === 0) && (
                  <div className="text-center py-4 text-xs text-ch-text-secondary border border-dashed border-ch-border rounded">
                    No rescheduling recorded. Original deadline is active.
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 11: ACTIVITY TIMELINE */}
            <div className="space-y-2">
              <h2 className="text-xs font-semibold text-ch-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <Activity size={13} /> Chronological Audit Log
              </h2>
              <div className="space-y-2">
                {(task.activity || []).map((act) => (
                  <div
                    key={act.id}
                    className="p-2 text-xs bg-surface-muted/20 border border-ch-border rounded flex items-start gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <div className="text-ch-text-primary font-medium">{act.action}</div>
                      <div className="text-[10px] text-ch-text-secondary mt-0.5">
                        {act.actorName} • {formatDateTime(act.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: COMMENTS */}
        {activeTab === 'comments' && (
          <div className="space-y-4">
            {/* SECTION 7: COMMENTS */}
            <div className="space-y-3">
              {(task.comments || []).map((comment) => (
                <div key={comment.id} className="p-3 bg-surface-muted/20 border border-ch-border rounded text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-ch-text-primary">{comment.authorName}</span>
                    <span className="text-ch-text-secondary">{formatDateTime(comment.createdAt)}</span>
                  </div>
                  <div className="text-ch-text-primary whitespace-pre-wrap">{comment.content}</div>
                </div>
              ))}

              {(!task.comments || task.comments.length === 0) && (
                <div className="text-center py-6 text-xs text-ch-text-secondary border border-dashed border-ch-border rounded">
                  No comments posted yet.
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-ch-border">
              <CommentComposer
                placeholder="Post an operational update or comment on this task..."
                onSubmit={async (content) => {
                  await onAddComment(task.id, content);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}
