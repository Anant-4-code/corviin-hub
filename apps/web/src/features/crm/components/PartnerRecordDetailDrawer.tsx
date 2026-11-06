import React, { useState } from 'react';
import {
  RealEstatePartnerRecord,
  RealEstatePartnerStage,
  ChangePartnerStageDto,
} from '@corviin-hub/shared';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import {
  PARTNER_TYPE_LABELS,
  PARTNER_TYPE_BADGE_CLASSES,
  PARTNER_STAGE_ORDER,
  PARTNER_STAGE_LABELS,
  PARTNER_STAGE_BADGE_CLASSES,
} from './partner-crm-constants';

interface PartnerRecordDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  partner: RealEstatePartnerRecord | null;
  onOpenChangeStage: () => void;
  onOpenConfirmOrActivate: () => void;
  onOpenAddProject: () => void;
  onOpenCreateTask: () => void;
  onOpenScheduleMeeting: () => void;
  onQuickAdvanceStage?: (stage: RealEstatePartnerStage) => void;
  onAddNote?: (noteText: string) => Promise<void>;
}

export const PartnerRecordDetailDrawer: React.FC<PartnerRecordDetailDrawerProps> = ({
  isOpen,
  onClose,
  partner,
  onOpenChangeStage,
  onOpenConfirmOrActivate,
  onOpenAddProject,
  onOpenCreateTask,
  onOpenScheduleMeeting,
  onQuickAdvanceStage,
  onAddNote,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'meetings' | 'tasks' | 'history'>('overview');
  const [noteText, setNoteText] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  if (!partner) return null;

  const cleanPhone = partner.phone.replace(/\D/g, '');

  const formatDate = (isoStr?: string) => {
    if (!isoStr) return '—';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  const handleNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim() || !onAddNote) return;
    setIsSubmittingNote(true);
    try {
      await onAddNote(noteText.trim());
      setNoteText('');
    } finally {
      setIsSubmittingNote(false);
    }
  };

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      title={partner.companyName}
      width="w-full sm:w-[560px] md:w-[680px]"
    >
      <div className="space-y-5 pb-8 text-xs text-ch-text-primary">
        {/* ============================================================
            SECTION 1: HEADER & KEY SUMMARY STRIP
           ============================================================ */}
        <div className="bg-ch-bg p-3.5 rounded-lg border border-ch-border space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold border ${
                    PARTNER_TYPE_BADGE_CLASSES[partner.partnerType]
                  }`}
                >
                  {PARTNER_TYPE_LABELS[partner.partnerType]}
                </span>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded text-xs font-medium border ${
                    PARTNER_STAGE_BADGE_CLASSES[partner.stage]
                  }`}
                >
                  {PARTNER_STAGE_LABELS[partner.stage]}
                </span>
              </div>
              {partner.location && (
                <p className="text-xs text-ch-text-secondary mt-1">📍 {partner.location}</p>
              )}
            </div>

            {/* Quick Contact Touch Targets */}
            <div className="flex items-center gap-2">
              <a
                href={`tel:${partner.phone}`}
                className="px-3 py-1.5 bg-surface border border-ch-border rounded hover:bg-ch-bg text-ch-text-primary font-semibold flex items-center gap-1 min-h-[36px]"
              >
                📞 Call
              </a>
              {cleanPhone && (
                <a
                  href={`https://wa.me/${cleanPhone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700 font-semibold flex items-center gap-1 min-h-[36px]"
                >
                  💬 WhatsApp
                </a>
              )}
              {partner.email && (
                <a
                  href={`mailto:${partner.email}`}
                  className="px-3 py-1.5 bg-surface border border-ch-border rounded hover:bg-ch-bg text-ch-text-primary font-semibold flex items-center gap-1 min-h-[36px]"
                >
                  ✉️ Email
                </a>
              )}
            </div>
          </div>

          {/* Quick Metrics Line */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-ch-border text-[11px]">
            <div>
              <span className="text-ch-text-secondary block">Assigned Member</span>
              <strong className="text-ch-text-primary">{partner.assignedMemberName}</strong>
            </div>
            <div>
              <span className="text-ch-text-secondary block">Contact Person</span>
              <strong className="text-ch-text-primary">{partner.contactPerson || '—'}</strong>
            </div>
            <div>
              <span className="text-ch-text-secondary block">Represented Projects</span>
              <strong className="text-ch-text-primary">{partner.projects?.length || 0} Projects</strong>
            </div>
            <div>
              <span className="text-ch-text-secondary block">Portfolio Value</span>
              <strong className="text-ch-text-primary">
                {partner.estimatedPortfolioValue ? `₹${(partner.estimatedPortfolioValue / 10000000).toFixed(1)} Cr` : '—'}
              </strong>
            </div>
          </div>
        </div>

        {/* ============================================================
            SECTION 2: PIPELINE STAGE STEPPER
           ============================================================ */}
        <div className="bg-surface p-3 rounded-lg border border-ch-border space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-ch-text-secondary uppercase tracking-wider">
              Partnership Pipeline Stage
            </h4>
            <Button size="sm" variant="outline" onClick={onOpenChangeStage} className="text-xs h-6 px-2">
              Change Stage
            </Button>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 select-none">
            {PARTNER_STAGE_ORDER.map((st, idx) => {
              const currentIdx = PARTNER_STAGE_ORDER.indexOf(partner.stage);
              const isPast = currentIdx !== -1 && idx < currentIdx;
              const isCurrent = partner.stage === st;

              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => onQuickAdvanceStage && onQuickAdvanceStage(st)}
                  className={`px-2 py-1 rounded text-[10px] font-semibold flex-shrink-0 border ${
                    isCurrent
                      ? 'bg-accent text-white border-accent'
                      : isPast
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                      : 'bg-ch-bg text-ch-text-secondary border-ch-border hover:bg-surface'
                  }`}
                  title={`Stage ${idx + 1}: ${PARTNER_STAGE_LABELS[st]}`}
                >
                  {idx + 1}. {PARTNER_STAGE_LABELS[st]}
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================
            SECTION 3: ACTION TOOLBAR
           ============================================================ */}
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="primary" onClick={onOpenConfirmOrActivate} className="text-xs">
            Confirm / Activate Mandate
          </Button>
          <Button size="sm" variant="outline" onClick={onOpenAddProject} className="text-xs">
            + Add Project
          </Button>
          <Button size="sm" variant="outline" onClick={onOpenCreateTask} className="text-xs">
            + Linked Task
          </Button>
          <Button size="sm" variant="outline" onClick={onOpenScheduleMeeting} className="text-xs">
            Schedule Meeting
          </Button>
        </div>

        {/* ============================================================
            SECTION 4: TABS NAVIGATION
           ============================================================ */}
        <div className="flex border-b border-ch-border text-xs gap-4 font-semibold" role="tablist">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`pb-2 border-b-2 ${
              activeTab === 'overview'
                ? 'border-accent text-accent'
                : 'border-transparent text-ch-text-secondary hover:text-ch-text-primary'
            }`}
          >
            Overview & Scope
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className={`pb-2 border-b-2 ${
              activeTab === 'projects'
                ? 'border-accent text-accent'
                : 'border-transparent text-ch-text-secondary hover:text-ch-text-primary'
            }`}
          >
            Projects ({partner.projects?.length || 0})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('meetings')}
            className={`pb-2 border-b-2 ${
              activeTab === 'meetings'
                ? 'border-accent text-accent'
                : 'border-transparent text-ch-text-secondary hover:text-ch-text-primary'
            }`}
          >
            Meetings & Decisions
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tasks')}
            className={`pb-2 border-b-2 ${
              activeTab === 'tasks'
                ? 'border-accent text-accent'
                : 'border-transparent text-ch-text-secondary hover:text-ch-text-primary'
            }`}
          >
            Tasks & Follow-ups
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`pb-2 border-b-2 ${
              activeTab === 'history'
                ? 'border-accent text-accent'
                : 'border-transparent text-ch-text-secondary hover:text-ch-text-primary'
            }`}
          >
            Stage History ({partner.stageHistory?.length || 0})
          </button>
        </div>

        {/* ============================================================
            TAB CONTENT: OVERVIEW & SCOPE
           ============================================================ */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Commercial & Mandate Status */}
            <div className="bg-surface p-3 rounded-lg border border-ch-border space-y-2">
              <h5 className="font-bold text-xs text-ch-text-primary">Partnership Status & Mandate</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-ch-text-secondary">Partnership Model:</span>{' '}
                  <strong className="text-ch-text-primary">{partner.partnershipInterest || 'Standard Agency Mandate'}</strong>
                </div>
                <div>
                  <span className="text-ch-text-secondary">Lead Source:</span>{' '}
                  <strong className="text-ch-text-primary">{partner.source || 'Direct Outreach'}</strong>
                </div>
                <div>
                  <span className="text-ch-text-secondary">Mandate Signed:</span>{' '}
                  <strong className="text-ch-text-primary">{formatDate(partner.mandateSignedAt)}</strong>
                </div>
                <div>
                  <span className="text-ch-text-secondary">Active Since:</span>{' '}
                  <strong className="text-ch-text-primary">{formatDate(partner.activeSince)}</strong>
                </div>
              </div>
            </div>

            {/* Marketing Requirements */}
            <div className="bg-surface p-3 rounded-lg border border-ch-border space-y-2">
              <h5 className="font-bold text-xs text-ch-text-primary">Marketing & Service Requirements</h5>
              {partner.marketingRequirements && partner.marketingRequirements.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {partner.marketingRequirements.map((req) => (
                    <span
                      key={req}
                      className="bg-ch-bg border border-ch-border px-2 py-0.5 rounded text-xs text-ch-text-primary"
                    >
                      ✓ {req}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-ch-text-tertiary">No specific marketing services checked.</p>
              )}
              {partner.serviceRequirementsText && (
                <p className="text-xs text-ch-text-secondary bg-ch-bg p-2 rounded border border-ch-border mt-2">
                  {partner.serviceRequirementsText}
                </p>
              )}
            </div>

            {/* Background Notes & Log Note */}
            <div className="bg-surface p-3 rounded-lg border border-ch-border space-y-2">
              <h5 className="font-bold text-xs text-ch-text-primary">Promoter Background & Notes</h5>
              <p className="text-xs text-ch-text-secondary whitespace-pre-wrap">
                {partner.notes || 'No detailed background notes entered.'}
              </p>

              {onAddNote && (
                <form onSubmit={handleNoteSubmit} className="pt-2 border-t border-ch-border space-y-2">
                  <Textarea
                    placeholder="Log a new conversation, promoter decision, or interaction..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    rows={2}
                    className="text-xs"
                  />
                  <div className="flex justify-end">
                    <Button type="submit" size="sm" variant="outline" disabled={isSubmittingNote || !noteText.trim()}>
                      {isSubmittingNote ? 'Saving...' : 'Add Note'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ============================================================
            TAB CONTENT: PROJECTS & DEVELOPMENTS
           ============================================================ */}
        {activeTab === 'projects' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-ch-text-secondary">
                Multiple developments represented or owned by this partner.
              </p>
              <Button size="sm" variant="outline" onClick={onOpenAddProject} className="text-xs">
                + Add Project
              </Button>
            </div>

            {partner.projects && partner.projects.length > 0 ? (
              <div className="space-y-2">
                {partner.projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="bg-surface border border-ch-border rounded-lg p-3 space-y-1 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-xs text-ch-text-primary">{proj.name}</h5>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-ch-bg border border-ch-border">
                        {proj.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 text-[11px] text-ch-text-secondary pt-1">
                      <span>📍 {proj.location}</span>
                      {proj.totalUnitsOrAcres && <span>📦 {proj.totalUnitsOrAcres}</span>}
                      {proj.reraNumber && <span>🏛️ RERA: {proj.reraNumber}</span>}
                    </div>

                    {proj.projectType && (
                      <span className="inline-block mt-1 text-[10px] text-accent bg-accent/10 px-1.5 py-0.5 rounded">
                        {proj.projectType.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-surface border border-ch-border rounded-lg p-6 text-center text-xs text-ch-text-secondary">
                No projects linked yet. Click "+ Add Project" to register a development.
              </div>
            )}
          </div>
        )}

        {/* ============================================================
            TAB CONTENT: MEETINGS & DECISIONS
           ============================================================ */}
        {activeTab === 'meetings' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-ch-text-secondary">
                Official meetings, discussions, and promoter commitments.
              </p>
              <Button size="sm" variant="outline" onClick={onOpenScheduleMeeting} className="text-xs">
                Schedule Meeting
              </Button>
            </div>

            <div className="bg-surface border border-ch-border rounded-lg p-4 space-y-2">
              <h5 className="font-semibold text-xs text-ch-text-primary">Prelinked Meetings Workflow</h5>
              <p className="text-xs text-ch-text-secondary leading-relaxed">
                Meetings scheduled for <strong>{partner.companyName}</strong> automatically link this partner and relevant projects.
                Action items from meetings convert directly into tasks in the shared task register.
              </p>
              {partner.linkedMeetingIds && partner.linkedMeetingIds.length > 0 ? (
                <div className="pt-2 border-t border-ch-border space-y-1">
                  <p className="text-xs font-semibold text-ch-text-primary">
                    Linked Meeting IDs ({partner.linkedMeetingIds.length}):
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {partner.linkedMeetingIds.map((mId) => (
                      <span key={mId} className="bg-ch-bg border border-ch-border px-2 py-0.5 rounded text-[11px] font-mono">
                        {mId}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-ch-text-tertiary pt-2">No meetings scheduled yet.</p>
              )}
            </div>
          </div>
        )}

        {/* ============================================================
            TAB CONTENT: TASKS & FOLLOW-UPS
           ============================================================ */}
        {activeTab === 'tasks' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-ch-text-secondary">
                Actionable tasks and scheduled reminders via shared task engine.
              </p>
              <Button size="sm" variant="outline" onClick={onOpenCreateTask} className="text-xs">
                + Create Task
              </Button>
            </div>

            {partner.nextFollowUpDate && (
              <div className="bg-ch-bg p-3 rounded-lg border border-ch-border space-y-1">
                <span className="text-[10px] uppercase font-bold text-ch-text-secondary">Next Follow-up Reminder</span>
                <p className="font-bold text-xs text-ch-text-primary">
                  {formatDate(partner.nextFollowUpDate)}
                </p>
                {partner.nextFollowUpTitle && (
                  <p className="text-xs text-ch-text-secondary">{partner.nextFollowUpTitle}</p>
                )}
              </div>
            )}

            <div className="bg-surface border border-ch-border rounded-lg p-4 space-y-2">
              <h5 className="font-semibold text-xs text-ch-text-primary">Linked Task Engine Integration</h5>
              <p className="text-xs text-ch-text-secondary">
                Tasks created here appear in <strong>My Tasks</strong> for the assigned member, in <strong>All Tasks</strong>,
                and on the <strong>Team Task Calendar</strong>.
              </p>
              {partner.linkedTaskIds && partner.linkedTaskIds.length > 0 ? (
                <div className="pt-2 border-t border-ch-border space-y-1">
                  <p className="text-xs font-semibold text-ch-text-primary">
                    Linked Task IDs ({partner.linkedTaskIds.length}):
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {partner.linkedTaskIds.map((tId) => (
                      <span key={tId} className="bg-ch-bg border border-ch-border px-2 py-0.5 rounded text-[11px] font-mono">
                        {tId}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-ch-text-tertiary pt-2">No tasks created yet.</p>
              )}
            </div>
          </div>
        )}

        {/* ============================================================
            TAB CONTENT: STAGE HISTORY AUDIT TRAIL
           ============================================================ */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            <p className="text-xs text-ch-text-secondary">
              Chronological, immutable audit log of all stage transitions, actors, and notes.
            </p>

            <div className="border-l-2 border-ch-border ml-2 pl-4 space-y-4">
              {partner.stageHistory && partner.stageHistory.length > 0 ? (
                partner.stageHistory.map((sh, idx) => (
                  <div key={sh.id || idx} className="space-y-1 relative">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-accent border-2 border-surface" />
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-ch-text-primary">
                        {sh.fromStage ? `${PARTNER_STAGE_LABELS[sh.fromStage]} → ` : ''}
                        {PARTNER_STAGE_LABELS[sh.toStage]}
                      </span>
                      <span className="text-[11px] text-ch-text-tertiary">{formatDate(sh.changedAt)}</span>
                    </div>

                    <p className="text-[11px] text-ch-text-secondary">
                      By: <strong className="text-ch-text-primary">{sh.actorName || 'Team Member'}</strong>
                    </p>

                    {sh.notes && (
                      <p className="text-xs text-ch-text-primary bg-ch-bg p-2 rounded border border-ch-border">
                        {sh.notes}
                      </p>
                    )}

                    {sh.lostReason && (
                      <p className="text-xs text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 p-2 rounded border border-rose-200 dark:border-rose-800">
                        <strong>Reason:</strong> {sh.lostReason}
                      </p>
                    )}

                    {sh.followUpLaterDate && (
                      <p className="text-xs text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 p-2 rounded border border-purple-200 dark:border-purple-800">
                        <strong>Next Action Date:</strong> {new Date(sh.followUpLaterDate).toLocaleDateString()}
                      </p>
                    )}

                    {sh.mandateType && (
                      <p className="text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded border border-emerald-200 dark:border-emerald-800">
                        <strong>Mandate:</strong> {sh.mandateType}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-ch-text-tertiary">No stage history recorded.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};
