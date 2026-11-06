import { useState } from 'react';
import {
  X,
  Phone,
  MessageSquare,
  Mail,
  Calendar,
  CheckSquare,
  FileText,
  Clock,
  User,
  Building2,
  Globe,
  MapPin,
  Briefcase,
  AlertTriangle,
  ArrowRight,
  Plus,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import {
  TechCrmRecord,
  TechRecordCategory,
  TechPipelineStage,
  CrmFollowUpItem,
  CrmInteractionItem,
  CrmInteractionType,
} from '@corviin-hub/shared';
import {
  TECH_CATEGORY_LABELS,
  TECH_CATEGORY_COLORS,
  TECH_STAGE_LABELS,
  TECH_STAGE_COLORS,
  TECH_PIPELINE_STAGES_ORDER,
} from './tech-crm-constants';

interface MemberOption {
  id: string;
  name: string;
}

interface TechRecordDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  record: TechCrmRecord | null;
  linkedTasks: any[];
  linkedMeetings: any[];
  followUps: CrmFollowUpItem[];
  interactions: CrmInteractionItem[];
  members: MemberOption[];
  onOpenChangeStage: () => void;
  onOpenConvertClient: () => void;
  onOpenAddProposal: () => void;
  onOpenCreateTask: () => void;
  onOpenScheduleFollowUp: () => void;
  onOpenLogInteraction: () => void;
  onAddNote: (note: string) => Promise<void>;
  onCompleteFollowUp: (followUpId: string) => Promise<void>;
}

export function TechRecordDetailDrawer({
  isOpen,
  onClose,
  record,
  linkedTasks,
  linkedMeetings,
  followUps,
  interactions,
  members,
  onOpenChangeStage,
  onOpenConvertClient,
  onOpenAddProposal,
  onOpenCreateTask,
  onOpenScheduleFollowUp,
  onOpenLogInteraction,
  onAddNote,
  onCompleteFollowUp,
}: TechRecordDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'interactions' | 'tasks' | 'proposals' | 'history'>('overview');
  const [quickNote, setQuickNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  if (!isOpen || !record) return null;

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  const cleanPhone = (p: string) => p.replace(/[^0-9]/g, '');

  const handleNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickNote.trim()) return;
    try {
      setIsAddingNote(true);
      await onAddNote(quickNote.trim());
      setQuickNote('');
    } finally {
      setIsAddingNote(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/40">
      <div className="w-full max-w-2xl bg-surface border-l border-ch-border flex flex-col h-full shadow-2xl">
        {/* ======================================================== */}
        {/* HEADER: Title, Category, Stage & Close                  */}
        {/* ======================================================== */}
        <div className="p-4 border-b border-ch-border bg-surface-raised space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold border ${
                    TECH_CATEGORY_COLORS[record.category] || 'bg-surface border-ch-border'
                  }`}
                >
                  {TECH_CATEGORY_LABELS[record.category]}
                </span>
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold border ${
                    TECH_STAGE_COLORS[record.stage] || 'bg-surface border-ch-border'
                  }`}
                >
                  {TECH_STAGE_LABELS[record.stage]}
                </span>
              </div>
              <h2 className="text-base font-bold text-ch-text-primary mt-1">
                {record.company}
              </h2>
              <div className="text-xs text-ch-text-secondary flex items-center gap-1.5 mt-0.5">
                <User className="w-3.5 h-3.5 text-ch-text-muted" />
                <span>{record.name}</span>
                {record.businessType && <span>• {record.businessType}</span>}
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 text-ch-text-muted hover:text-ch-text-primary border border-transparent hover:border-ch-border"
              title="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Action Bar (Section 7) */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {record.phone && (
              <a
                href={`tel:${record.phone}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-surface border border-ch-border text-ch-text-primary hover:bg-surface-raised"
                title="Call phone"
              >
                <Phone className="w-3.5 h-3.5 text-ch-accent" />
                <span>Call</span>
              </a>
            )}

            {record.phone && (
              <a
                href={`https://wa.me/${cleanPhone(record.phone)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-surface border border-ch-border text-emerald-700 dark:text-emerald-400 hover:bg-surface-raised"
                title="WhatsApp message"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp</span>
              </a>
            )}

            {record.email && (
              <a
                href={`mailto:${record.email}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-surface border border-ch-border text-ch-text-primary hover:bg-surface-raised"
                title="Send email"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email</span>
              </a>
            )}

            <Button
              size="sm"
              variant="outline"
              onClick={onOpenChangeStage}
              className="h-7 text-xs gap-1 font-semibold"
            >
              <ArrowRight className="w-3 h-3 text-ch-accent" />
              <span>Change Stage</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={onOpenScheduleFollowUp}
              className="h-7 text-xs gap-1"
            >
              <Clock className="w-3 h-3 text-ch-accent" />
              <span>Follow-up</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={onOpenLogInteraction}
              className="h-7 text-xs gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Log Activity</span>
            </Button>

            {/* Convert to Client Button (when Won) */}
            {(record.stage === TechPipelineStage.WON_CLIENT ||
              record.category === TechRecordCategory.EXISTING_CLIENT) && (
              <Button
                size="sm"
                onClick={onOpenConvertClient}
                className="h-7 text-xs gap-1 font-bold bg-emerald-600 text-white hover:bg-emerald-700"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Convert to Client</span>
              </Button>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* PIPELINE PROGRESSION STEPPER (Section 5)                */}
        {/* ======================================================== */}
        <div className="px-4 py-2 bg-surface-raised/40 border-b border-ch-border overflow-x-auto">
          <div className="flex items-center gap-1 min-w-[500px]">
            {TECH_PIPELINE_STAGES_ORDER.slice(0, 8).map((stage, idx) => {
              const currentIdx = TECH_PIPELINE_STAGES_ORDER.indexOf(record.stage);
              const isCurrent = record.stage === stage;
              const isPast = currentIdx > idx;

              return (
                <div
                  key={stage}
                  className={`flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold border ${
                    isCurrent
                      ? 'bg-ch-accent text-white border-ch-accent'
                      : isPast
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                        : 'bg-surface text-ch-text-muted border-ch-border'
                  }`}
                  title={TECH_STAGE_LABELS[stage]}
                >
                  <span>{idx + 1}.</span>
                  <span className="truncate max-w-[80px]">{TECH_STAGE_LABELS[stage]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* TABS NAVIGATION                                          */}
        {/* ======================================================== */}
        <div className="flex items-center border-b border-ch-border bg-surface px-4 text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2.5 px-3 font-semibold border-b-2 ${
              activeTab === 'overview'
                ? 'border-ch-accent text-ch-accent'
                : 'border-transparent text-ch-text-secondary hover:text-ch-text-primary'
            }`}
          >
            Overview & Requirements
          </button>
          <button
            onClick={() => setActiveTab('interactions')}
            className={`py-2.5 px-3 font-semibold border-b-2 ${
              activeTab === 'interactions'
                ? 'border-ch-accent text-ch-accent'
                : 'border-transparent text-ch-text-secondary hover:text-ch-text-primary'
            }`}
          >
            Interactions ({interactions.length})
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`py-2.5 px-3 font-semibold border-b-2 ${
              activeTab === 'tasks'
                ? 'border-ch-accent text-ch-accent'
                : 'border-transparent text-ch-text-secondary hover:text-ch-text-primary'
            }`}
          >
            Tasks & Meetings ({linkedTasks.length + linkedMeetings.length})
          </button>
          <button
            onClick={() => setActiveTab('proposals')}
            className={`py-2.5 px-3 font-semibold border-b-2 ${
              activeTab === 'proposals'
                ? 'border-ch-accent text-ch-accent'
                : 'border-transparent text-ch-text-secondary hover:text-ch-text-primary'
            }`}
          >
            Proposals & Retainers ({(record.proposals?.length || 0) + (record.projects?.length || 0)})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2.5 px-3 font-semibold border-b-2 ${
              activeTab === 'history'
                ? 'border-ch-accent text-ch-accent'
                : 'border-transparent text-ch-text-secondary hover:text-ch-text-primary'
            }`}
          >
            Stage History ({record.stageHistory?.length || 0})
          </button>
        </div>

        {/* ======================================================== */}
        {/* BODY CONTENT BY TAB                                      */}
        {/* ======================================================== */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* TAB 1: OVERVIEW & REQUIREMENTS */}
          {activeTab === 'overview' && (
            <div className="space-y-4 text-xs">
              {/* Lost Reason Alert (if lost) */}
              {record.stage === TechPipelineStage.LOST && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-800 dark:text-rose-200">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Opportunity Lost</span>
                  </div>
                  <p className="mt-1 text-xs">
                    {record.lostReason || 'No specific lost reason recorded.'}
                  </p>
                </div>
              )}

              {/* Follow Up Later Alert */}
              {record.stage === TechPipelineStage.FOLLOW_UP_LATER && (
                <div className="p-3 bg-stone-500/10 border border-stone-500/30 text-stone-800 dark:text-stone-200">
                  <div className="font-bold flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-stone-600" />
                    <span>Follow Up Later Scheduled</span>
                  </div>
                  <p className="mt-1 text-xs">
                    Target date: {record.followUpLaterDate ? new Date(record.followUpLaterDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              )}

              {/* Key Summary Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                <div className="p-2.5 bg-surface-raised border border-ch-border">
                  <span className="text-[11px] text-ch-text-muted">Estimated Budget</span>
                  <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {record.estimatedBudget ? `₹${record.estimatedBudget.toLocaleString('en-IN')}` : 'Not specified'}
                  </div>
                </div>

                <div className="p-2.5 bg-surface-raised border border-ch-border">
                  <span className="text-[11px] text-ch-text-muted">Assigned Lead</span>
                  <div className="text-sm font-bold text-ch-text-primary mt-0.5">
                    {record.assignedMemberName}
                  </div>
                </div>

                <div className="p-2.5 bg-surface-raised border border-ch-border">
                  <span className="text-[11px] text-ch-text-muted">Lead Source</span>
                  <div className="text-sm font-bold text-ch-text-primary mt-0.5">
                    {record.source}
                  </div>
                </div>

                <div className="p-2.5 bg-surface-raised border border-ch-border">
                  <span className="text-[11px] text-ch-text-muted">Next Follow-up</span>
                  <div className="text-sm font-bold text-ch-text-primary mt-0.5">
                    {record.nextFollowUpDate
                      ? new Date(record.nextFollowUpDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                      : 'None'}
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="p-3 bg-surface border border-ch-border space-y-2">
                <h4 className="font-bold text-xs text-ch-text-primary uppercase tracking-wider border-b border-ch-border pb-1">
                  Contact & Business Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-ch-text-muted">Phone:</span>{' '}
                    <span className="font-semibold text-ch-text-primary">{record.phone}</span>
                  </div>
                  <div>
                    <span className="text-ch-text-muted">Email:</span>{' '}
                    <span className="font-semibold text-ch-text-primary">{record.email || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-ch-text-muted">Website:</span>{' '}
                    {record.website ? (
                      <a
                        href={record.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-ch-accent underline inline-flex items-center gap-0.5"
                      >
                        <span>{record.website}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </div>
                  <div>
                    <span className="text-ch-text-muted">Location:</span>{' '}
                    <span className="text-ch-text-primary">{record.location || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Requirement & Service Scope */}
              <div className="p-3 bg-surface border border-ch-border space-y-2">
                <h4 className="font-bold text-xs text-ch-text-primary uppercase tracking-wider border-b border-ch-border pb-1">
                  Requirement & Technical Scope
                </h4>
                <div>
                  <span className="text-ch-text-muted">Service Scope:</span>{' '}
                  <span className="font-semibold text-ch-text-primary">
                    {record.serviceType ? record.serviceType.replace('_', ' ') : 'General Tech Consulting'}
                  </span>
                </div>
                <div>
                  <span className="text-ch-text-muted">Summary:</span>
                  <p className="mt-1 text-ch-text-primary font-medium">
                    {record.requirementSummary}
                  </p>
                </div>
                {record.detailedRequirements && (
                  <div>
                    <span className="text-ch-text-muted">Detailed Specifications:</span>
                    <p className="mt-1 text-ch-text-secondary whitespace-pre-wrap leading-relaxed">
                      {record.detailedRequirements}
                    </p>
                  </div>
                )}
                {record.notes && (
                  <div>
                    <span className="text-ch-text-muted">Internal Notes:</span>
                    <p className="mt-1 text-ch-text-secondary italic">
                      {record.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Pending Follow-ups Queue for this record */}
              <div className="p-3 bg-surface border border-ch-border space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-ch-text-primary uppercase tracking-wider">
                    Scheduled Follow-ups ({followUps.length})
                  </h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onOpenScheduleFollowUp}
                    className="h-6 text-xs text-ch-accent"
                  >
                    + Schedule
                  </Button>
                </div>

                {followUps.length === 0 ? (
                  <p className="text-xs text-ch-text-muted py-2">
                    No follow-ups currently scheduled.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {followUps.map((f) => {
                      const isPast = new Date(f.dueDate) < now && !f.dueDate.startsWith(todayStr);

                      return (
                        <div
                          key={f.id}
                          className="p-2 bg-surface-raised border border-ch-border flex items-center justify-between gap-2"
                        >
                          <div className="space-y-0.5">
                            <div className="font-semibold text-ch-text-primary">
                              {f.title}
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-ch-text-secondary">
                              <Clock className="w-3 h-3" />
                              <span>{new Date(f.dueDate).toLocaleDateString()}</span>
                              {isPast && (
                                <span className="font-bold text-rose-600">[Overdue]</span>
                              )}
                              <span>• {f.assignedMemberName}</span>
                            </div>
                          </div>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onCompleteFollowUp(f.id)}
                            className="h-7 text-xs font-semibold text-emerald-700 border-emerald-300 dark:text-emerald-400"
                          >
                            Mark Done
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Quick Requirement Note Composer */}
              <form onSubmit={handleNoteSubmit} className="p-3 bg-surface border border-ch-border space-y-2">
                <h4 className="font-bold text-xs text-ch-text-primary uppercase tracking-wider">
                  Add Requirement or Consultation Note
                </h4>
                <textarea
                  value={quickNote}
                  onChange={(e) => setQuickNote(e.target.value)}
                  placeholder="Record call discussion notes, architectural clarifications, or decision points..."
                  rows={2}
                  className="w-full p-2 bg-surface border border-ch-border text-xs focus:outline-none focus:border-ch-accent"
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isAddingNote || !quickNote.trim()}
                    className="h-7 text-xs font-semibold bg-ch-accent text-white"
                  >
                    {isAddingNote ? 'Saving...' : 'Add Note'}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: INTERACTIONS TIMELINE */}
          {activeTab === 'interactions' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-semibold text-ch-text-secondary">
                  Chronological Communication & Stage Audit
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onOpenLogInteraction}
                  className="h-7 text-xs"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Log Activity
                </Button>
              </div>

              {interactions.length === 0 ? (
                <div className="p-8 text-center text-xs text-ch-text-muted border border-ch-border">
                  No interactions recorded yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {interactions.map((i) => (
                    <div
                      key={i.id}
                      className="p-3 bg-surface border border-ch-border space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-surface-raised border border-ch-border text-ch-text-primary">
                            {i.type}
                          </span>
                          <span className="font-bold text-ch-text-primary">
                            {i.title}
                          </span>
                        </div>
                        <span className="text-[11px] text-ch-text-muted">
                          {new Date(i.timestamp).toLocaleString()}
                        </span>
                      </div>
                      {i.description && (
                        <p className="text-ch-text-secondary mt-1 whitespace-pre-wrap">
                          {i.description}
                        </p>
                      )}
                      <div className="text-[11px] text-ch-text-muted pt-1">
                        Logged by <span className="font-medium text-ch-text-secondary">{i.actorName}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LINKED TASKS & MEETINGS */}
          {activeTab === 'tasks' && (
            <div className="space-y-4 text-xs">
              {/* Linked Tasks */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-ch-text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <CheckSquare className="w-4 h-4 text-ch-accent" />
                    <span>Linked Tasks ({linkedTasks.length})</span>
                  </h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onOpenCreateTask}
                    className="h-7 text-xs"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    New Task
                  </Button>
                </div>

                {linkedTasks.length === 0 ? (
                  <p className="text-ch-text-muted p-3 bg-surface border border-ch-border">
                    No linked tasks. Create an action item to assign follow-ups or scope preparations.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {linkedTasks.map((t) => (
                      <div
                        key={t.id}
                        className="p-2.5 bg-surface border border-ch-border flex items-center justify-between gap-2"
                      >
                        <div>
                          <div className="font-semibold text-ch-text-primary">
                            {t.title}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-ch-text-secondary mt-0.5">
                            <span className="font-medium">{t.status}</span>
                            <span>• Due: {t.deadline ? new Date(t.deadline).toLocaleDateString() : 'N/A'}</span>
                            <span>• Assignee: {t.assigneeName}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Linked Meetings */}
              <div className="space-y-2 pt-2 border-t border-ch-border">
                <h4 className="font-bold text-xs text-ch-text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-ch-accent" />
                  <span>Linked Meetings ({linkedMeetings.length})</span>
                </h4>

                {linkedMeetings.length === 0 ? (
                  <p className="text-ch-text-muted p-3 bg-surface border border-ch-border">
                    No scheduled meetings linked to this enquiry.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {linkedMeetings.map((m) => (
                      <div
                        key={m.id}
                        className="p-2.5 bg-surface border border-ch-border flex items-center justify-between gap-2"
                      >
                        <div>
                          <div className="font-semibold text-ch-text-primary">
                            {m.title}
                          </div>
                          <div className="text-[11px] text-ch-text-secondary mt-0.5">
                            {new Date(m.startTime).toLocaleString()} • {m.category}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: PROPOSALS & RETAINERS */}
          {activeTab === 'proposals' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-ch-text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-ch-accent" />
                  <span>Proposals & Quotations ({record.proposals?.length || 0})</span>
                </h4>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onOpenAddProposal}
                  className="h-7 text-xs"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Proposal
                </Button>
              </div>

              {(!record.proposals || record.proposals.length === 0) ? (
                <p className="text-ch-text-muted p-3 bg-surface border border-ch-border">
                  No proposal references recorded yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {record.proposals.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 bg-surface border border-ch-border space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-ch-text-primary">
                          {p.title}
                        </span>
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-surface-raised border border-ch-border">
                          {p.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-ch-text-secondary pt-1">
                        {p.amount && (
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            ₹{p.amount.toLocaleString('en-IN')}
                          </span>
                        )}
                        {p.referenceUrl && (
                          <a
                            href={p.referenceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-ch-accent underline inline-flex items-center gap-0.5"
                          >
                            <span>View Document</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Delivery Projects (for Won / Existing Clients) */}
              {record.projects && record.projects.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-ch-border">
                  <h4 className="font-bold text-xs text-ch-text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-sky-600" />
                    <span>Active Delivery Projects ({record.projects.length})</span>
                  </h4>
                  <div className="space-y-1.5">
                    {record.projects.map((proj) => (
                      <div
                        key={proj.id}
                        className="p-2.5 bg-surface border border-ch-border flex items-center justify-between"
                      >
                        <span className="font-bold text-ch-text-primary">
                          {proj.name}
                        </span>
                        <span className="text-[11px] font-medium text-ch-text-secondary">
                          {proj.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: STAGE TRANSITION AUDIT HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-xs text-ch-text-primary uppercase tracking-wider mb-2">
                Stage Transition Audit Log
              </h4>
              <div className="border border-ch-border bg-surface">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-surface-raised border-b border-ch-border text-ch-text-secondary font-semibold">
                      <th className="p-2">Stage</th>
                      <th className="p-2">Timestamp</th>
                      <th className="p-2">Actor</th>
                      <th className="p-2">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ch-border">
                    {record.stageHistory?.map((h, i) => (
                      <tr key={i} className="hover:bg-surface-raised/40">
                        <td className="p-2 font-bold text-ch-text-primary">
                          {TECH_STAGE_LABELS[h.stage] || h.stage}
                        </td>
                        <td className="p-2 text-ch-text-secondary text-[11px]">
                          {new Date(h.timestamp).toLocaleString()}
                        </td>
                        <td className="p-2 text-ch-text-primary">
                          {h.actorName}
                        </td>
                        <td className="p-2 text-ch-text-secondary">
                          {h.notes || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
