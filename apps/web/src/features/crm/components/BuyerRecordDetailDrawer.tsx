import React, { useState } from 'react';
import {
  RealEstateBuyerRecord,
  RealEstateBuyerStage,
  BuyerPropertyConfiguration,
  BuyerPropertyType,
  BuyerBuyingTimeline,
  BuyerPurchasePurpose,
} from '@corviin-hub/shared';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import {
  BUYER_STAGE_ORDER,
  BUYER_STAGE_LABELS,
  BUYER_STAGE_BADGE_CLASSES,
  BUYER_CONFIGURATION_LABELS,
  BUYER_PROPERTY_TYPE_LABELS,
  BUYER_TIMELINE_LABELS,
  BUYER_PURPOSE_LABELS,
  formatInrBudgetRange,
} from './buyer-crm-constants';

interface BuyerRecordDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  buyer: RealEstateBuyerRecord | null;
  onOpenChangeStage: () => void;
  onOpenScheduleSiteVisit: () => void;
  onOpenShareProperty: () => void;
  onOpenCreateTask: () => void;
  onQuickAdvanceStage?: (stage: RealEstateBuyerStage) => void;
  onAddNote?: (noteText: string) => Promise<void>;
}

export const BuyerRecordDetailDrawer: React.FC<BuyerRecordDetailDrawerProps> = ({
  isOpen,
  onClose,
  buyer,
  onOpenChangeStage,
  onOpenScheduleSiteVisit,
  onOpenShareProperty,
  onOpenCreateTask,
  onQuickAdvanceStage,
  onAddNote,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'shared-properties' | 'site-visits' | 'tasks' | 'history'>('overview');
  const [noteText, setNoteText] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  if (!buyer) return null;

  const b = buyer as any;
  const displayName = b.customerName || b.fullName || 'Unnamed Buyer';
  const displayLocality = b.locality || b.preferredLocality;
  const minBudget = b.minBudget ?? b.minBudgetINR;
  const maxBudget = b.maxBudget ?? b.maxBudgetINR;
  const displaySource = b.enquirySource || b.source;
  const displayTimeline = b.buyingTimeline || b.timeline;
  const siteVisits = (b.siteVisits || []) as any[];
  const siteVisitsCount = siteVisits.length || b.siteVisitIds?.length || 0;
  const sharedProps = (b.sharedProperties || []) as any[];
  const linkedTasks = (b.linkedTasks || []) as any[];
  const stageHistory = (b.stageHistory || []) as any[];

  const cleanPhone = b.phone ? b.phone.replace(/\D/g, '') : '';

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

  // Find current stage index in linear flow
  const currentStageIndex = BUYER_STAGE_ORDER.indexOf(b.stage);
  const nextStage = currentStageIndex >= 0 && currentStageIndex < BUYER_STAGE_ORDER.length - 1
    ? BUYER_STAGE_ORDER[currentStageIndex + 1]
    : null;

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      title={displayName}
      subtitle={b.phone ? `Phone: ${b.phone}` : undefined}
      size="xl"
    >
      <div className="space-y-5 pb-8 text-xs text-ch-text-primary">
        {/* ============================================================
            SECTION 1: HEADER & KEY SUMMARY STRIP
           ============================================================ */}
        <div className="bg-ch-bg p-3.5 rounded-lg border border-ch-border space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold border ${
                    BUYER_STAGE_BADGE_CLASSES[b.stage as RealEstateBuyerStage] || ''
                  }`}
                >
                  {BUYER_STAGE_LABELS[b.stage as RealEstateBuyerStage] || b.stage}
                </span>
                {b.configuration && (
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-medium border bg-surface border-ch-border text-ch-text-secondary">
                    {BUYER_CONFIGURATION_LABELS[b.configuration as BuyerPropertyConfiguration] || b.configuration}
                  </span>
                )}
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {formatInrBudgetRange(minBudget, maxBudget)}
                </span>
              </div>
              {displayLocality && (
                <p className="text-xs text-ch-text-secondary mt-1">📍 {displayLocality}</p>
              )}
            </div>

            {/* Quick Contact Touch Targets */}
            <div className="flex items-center gap-2">
              <a
                href={`tel:${b.phone}`}
                className="px-3 py-1.5 bg-surface border border-ch-border rounded hover:bg-ch-bg text-ch-text-primary font-semibold flex items-center gap-1 min-h-[36px]"
                title="Call Buyer"
              >
                <span>📞</span>
                <span>Call</span>
              </a>
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold flex items-center gap-1 min-h-[36px]"
                title="Chat on WhatsApp"
              >
                <span>💬</span>
                <span>WhatsApp</span>
              </a>
              {b.email && (
                <a
                  href={`mailto:${b.email}`}
                  className="px-3 py-1.5 bg-surface border border-ch-border rounded hover:bg-ch-bg text-ch-text-primary font-semibold flex items-center gap-1 min-h-[36px]"
                  title="Send Email"
                >
                  <span>✉️</span>
                </a>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-ch-border/60 text-[11px]">
            <div>
              <span className="text-ch-text-tertiary block">Assignee:</span>
              <span className="font-semibold text-ch-text-primary truncate block">{b.assignedMemberName}</span>
            </div>
            <div>
              <span className="text-ch-text-tertiary block">Lead Source:</span>
              <span className="font-semibold text-ch-text-primary truncate block">{displaySource || 'Direct'}</span>
            </div>
            <div>
              <span className="text-ch-text-tertiary block">Site Visits:</span>
              <span className="font-semibold text-amber-600 dark:text-amber-400 block">
                {siteVisitsCount} Visit{siteVisitsCount === 1 ? '' : 's'}
              </span>
            </div>
            <div>
              <span className="text-ch-text-tertiary block">Follow Up:</span>
              <span className="font-semibold text-ch-text-primary block">
                {b.nextFollowUpDate ? new Date(b.nextFollowUpDate).toLocaleDateString('en-IN') : 'None scheduled'}
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================
            SECTION 2: PIPELINE STAGE STEPPER
           ============================================================ */}
        <div className="bg-surface p-3 rounded-lg border border-ch-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-ch-text-secondary uppercase tracking-wider">
              Sales Journey
            </span>
            <div className="flex items-center gap-2">
              {nextStage && onQuickAdvanceStage && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7 py-0"
                  onClick={() => onQuickAdvanceStage(nextStage)}
                >
                  Advance to {BUYER_STAGE_LABELS[nextStage]} →
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-7 py-0"
                onClick={onOpenChangeStage}
              >
                Change Stage...
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto pb-1 pt-1">
            <div className="flex items-center gap-1 min-w-[540px]">
              {BUYER_STAGE_ORDER.map((stage, idx) => {
                const isPassed = currentStageIndex > idx;
                const isCurrent = currentStageIndex === idx;
                return (
                  <div
                    key={stage}
                    className={`flex-1 text-center py-1.5 px-1 rounded text-[10px] font-semibold border ${
                      isCurrent
                        ? 'bg-accent text-white border-accent'
                        : isPassed
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                        : 'bg-ch-bg text-ch-text-tertiary border-ch-border'
                    }`}
                  >
                    {idx + 1}. {BUYER_STAGE_LABELS[stage].replace(' / ', '/')}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ============================================================
            SECTION 3: ACTION LAUNCHER
           ============================================================ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenScheduleSiteVisit}
            className="text-xs h-9 justify-center bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20"
          >
            📍 Site Visit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenShareProperty}
            className="text-xs h-9 justify-center bg-purple-500/10 border-purple-500/30 text-purple-700 dark:text-purple-300 hover:bg-purple-500/20"
          >
            🏠 Share Property
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenCreateTask}
            className="text-xs h-9 justify-center hover:bg-ch-bg"
          >
            ✓ Create Task
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenChangeStage}
            className="text-xs h-9 justify-center hover:bg-ch-bg"
          >
            ⇄ Update Stage
          </Button>
        </div>

        {/* ============================================================
            SECTION 4: TABS HEADER
           ============================================================ */}
        <div className="border-b border-ch-border flex gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2 border-b-2 ${
              activeTab === 'overview'
                ? 'border-accent text-accent'
                : 'border-transparent text-ch-text-secondary hover:text-ch-text-primary'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('shared-properties')}
            className={`pb-2 border-b-2 flex items-center gap-1.5 ${
              activeTab === 'shared-properties'
                ? 'border-accent text-accent'
                : 'border-transparent text-ch-text-secondary hover:text-ch-text-primary'
            }`}
          >
            <span>Shared Properties</span>
            {sharedProps.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-ch-bg border border-ch-border">
                {sharedProps.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('site-visits')}
            className={`pb-2 border-b-2 flex items-center gap-1.5 ${
              activeTab === 'site-visits'
                ? 'border-accent text-accent'
                : 'border-transparent text-ch-text-secondary hover:text-ch-text-primary'
            }`}
          >
            <span>Site Visits</span>
            {siteVisits.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-600 dark:text-amber-400">
                {siteVisits.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`pb-2 border-b-2 flex items-center gap-1.5 ${
              activeTab === 'tasks'
                ? 'border-accent text-accent'
                : 'border-transparent text-ch-text-secondary hover:text-ch-text-primary'
            }`}
          >
            <span>Tasks</span>
            {linkedTasks.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-ch-bg border border-ch-border">
                {linkedTasks.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2 border-b-2 flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-accent text-accent'
                : 'border-transparent text-ch-text-secondary hover:text-ch-text-primary'
            }`}
          >
            <span>History</span>
            {stageHistory.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-ch-bg border border-ch-border">
                {stageHistory.length}
              </span>
            )}
          </button>
        </div>

        {/* ============================================================
            TAB CONTENT 1: OVERVIEW & BUYER REQUIREMENTS
           ============================================================ */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="bg-surface p-3.5 rounded-lg border border-ch-border space-y-3">
              <h4 className="font-bold text-xs text-ch-text-primary uppercase tracking-wide">
                Buyer Profile & Property Preferences
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-ch-text-tertiary block">Full Name:</span>
                  <span className="font-semibold text-ch-text-primary">{displayName}</span>
                </div>
                <div>
                  <span className="text-ch-text-tertiary block">Phone:</span>
                  <span className="font-semibold text-ch-text-primary">{b.phone}</span>
                </div>
                <div>
                  <span className="text-ch-text-tertiary block">Email:</span>
                  <span className="font-semibold text-ch-text-primary">{b.email || '—'}</span>
                </div>
                <div>
                  <span className="text-ch-text-tertiary block">Contact Preference:</span>
                  <span className="font-semibold text-ch-text-primary">{b.preferredContactMethod || 'WhatsApp'}</span>
                </div>
                <div>
                  <span className="text-ch-text-tertiary block">Property Type:</span>
                  <span className="font-semibold text-ch-text-primary">
                    {b.propertyType ? (BUYER_PROPERTY_TYPE_LABELS[b.propertyType as BuyerPropertyType] || b.propertyType) : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-ch-text-tertiary block">Configuration:</span>
                  <span className="font-semibold text-ch-text-primary">
                    {b.configuration ? (BUYER_CONFIGURATION_LABELS[b.configuration as BuyerPropertyConfiguration] || b.configuration) : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-ch-text-tertiary block">Budget Range:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {formatInrBudgetRange(minBudget, maxBudget)}
                  </span>
                </div>
                <div>
                  <span className="text-ch-text-tertiary block">Timeline:</span>
                  <span className="font-semibold text-ch-text-primary">
                    {displayTimeline ? (BUYER_TIMELINE_LABELS[displayTimeline as BuyerBuyingTimeline] || displayTimeline) : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-ch-text-tertiary block">Purchase Purpose:</span>
                  <span className="font-semibold text-ch-text-primary">
                    {b.purpose ? (BUYER_PURPOSE_LABELS[b.purpose as BuyerPurchasePurpose] || b.purpose) : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-ch-text-tertiary block">Preferred Project:</span>
                  <span className="font-semibold text-ch-text-primary">
                    {b.preferredProject || 'None specified'}
                  </span>
                </div>
              </div>
            </div>

            {b.notes && (
              <div className="bg-surface p-3.5 rounded-lg border border-ch-border space-y-1.5">
                <h4 className="font-bold text-xs text-ch-text-primary uppercase tracking-wide">
                  Requirements & Notes
                </h4>
                <p className="text-xs text-ch-text-secondary whitespace-pre-wrap">{b.notes}</p>
              </div>
            )}

            {/* Quick Log Note Form */}
            <form onSubmit={handleNoteSubmit} className="bg-ch-bg p-3 rounded-lg border border-ch-border space-y-2">
              <span className="font-bold text-xs text-ch-text-secondary">Quick Note / Interaction Log</span>
              <Textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Log a client conversation note or follow up update..."
                rows={2}
                className="w-full text-xs"
              />
              <div className="flex justify-end">
                <Button type="submit" size="sm" disabled={isSubmittingNote || !noteText.trim()}>
                  {isSubmittingNote ? 'Saving...' : 'Add Note'}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================
            TAB CONTENT 2: SHARED PROPERTIES
           ============================================================ */}
        {activeTab === 'shared-properties' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ch-text-secondary">
                Properties & Proposals Shared ({sharedProps.length})
              </span>
              <Button size="sm" variant="outline" className="text-xs h-7" onClick={onOpenShareProperty}>
                + Share Property
              </Button>
            </div>

            {sharedProps.length === 0 ? (
              <div className="p-6 text-center text-xs text-ch-text-tertiary border border-dashed border-ch-border rounded-lg">
                No properties recorded as shared with this buyer yet.
              </div>
            ) : (
              <div className="space-y-2.5">
                {sharedProps.map((prop: any) => (
                  <div key={prop.id} className="bg-surface border border-ch-border rounded-lg p-3 space-y-1.5 shadow-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-xs text-ch-text-primary">{prop.name || prop.propertyName}</h4>
                        {(prop.location || prop.projectLocation) && (
                          <span className="text-[11px] text-ch-text-tertiary">📍 {prop.location || prop.projectLocation}</span>
                        )}
                      </div>
                      {(prop.priceEstimate || prop.estimatedPriceINR) && (
                        <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400">
                          ₹{((prop.priceEstimate || prop.estimatedPriceINR) / 10000000).toFixed(2)} Cr
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-ch-text-secondary">
                      {prop.propertyType && (
                        <span>{BUYER_PROPERTY_TYPE_LABELS[prop.propertyType as BuyerPropertyType] || prop.propertyType}</span>
                      )}
                      {prop.configuration && (
                        <span>• {BUYER_CONFIGURATION_LABELS[prop.configuration as BuyerPropertyConfiguration] || prop.configuration}</span>
                      )}
                    </div>

                    {prop.brochureUrl && (
                      <div className="pt-1">
                        <a
                          href={prop.brochureUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-accent underline flex items-center gap-1"
                        >
                          🔗 View Shared Brochure / Deck
                        </a>
                      </div>
                    )}

                    {(prop.feedback || prop.notes) && (
                      <p className="text-[11px] text-ch-text-tertiary italic pt-1 border-t border-ch-border/50">
                        {prop.feedback || prop.notes}
                      </p>
                    )}

                    <div className="text-[10px] text-ch-text-tertiary pt-1">
                      Shared on {formatDate(prop.sharedAt)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================
            TAB CONTENT 3: SITE VISITS
           ============================================================ */}
        {activeTab === 'site-visits' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ch-text-secondary">
                Scheduled & Completed Site Visits ({siteVisits.length})
              </span>
              <Button size="sm" variant="outline" className="text-xs h-7" onClick={onOpenScheduleSiteVisit}>
                + Schedule Site Visit
              </Button>
            </div>

            {siteVisits.length === 0 ? (
              <div className="p-6 text-center text-xs text-ch-text-tertiary border border-dashed border-ch-border rounded-lg">
                No site visits planned yet. Click '+ Schedule Site Visit' to arrange an on-site property tour.
              </div>
            ) : (
              <div className="space-y-2.5">
                {siteVisits.map((visit: any) => (
                  <div key={visit.id} className="bg-surface border border-ch-border rounded-lg p-3 space-y-2 shadow-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-xs text-ch-text-primary">📍 {visit.propertyName}</h4>
                        {visit.location && (
                          <span className="text-[11px] text-ch-text-tertiary block">{visit.location}</span>
                        )}
                        {visit.unitNumber && (
                          <span className="text-[11px] text-ch-text-secondary block">Unit/Tower: {visit.unitNumber}</span>
                        )}
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          visit.status === 'COMPLETED'
                            ? 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300 border-teal-300'
                            : visit.status === 'CANCELLED'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300'
                        }`}
                      >
                        {visit.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-ch-border/50">
                      <div>
                        <span className="text-ch-text-tertiary block">Date & Time:</span>
                        <span className="font-semibold text-ch-text-primary">
                          📅 {visit.visitDate} ({visit.startTime}{visit.endTime ? ` - ${visit.endTime}` : ''})
                        </span>
                      </div>
                      <div>
                        <span className="text-ch-text-tertiary block">Escort Member:</span>
                        <span className="font-semibold text-ch-text-primary">👤 {visit.responsibleMemberName}</span>
                      </div>
                    </div>

                    {visit.feedbackNotes && (
                      <p className="text-[11px] text-ch-text-secondary bg-ch-bg p-2 rounded border border-ch-border">
                        💬 <span className="font-semibold">Notes:</span> {visit.feedbackNotes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================
            TAB CONTENT 4: TASKS
           ============================================================ */}
        {activeTab === 'tasks' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ch-text-secondary">
                Linked Tasks & Follow-ups ({linkedTasks.length})
              </span>
              <Button size="sm" variant="outline" className="text-xs h-7" onClick={onOpenCreateTask}>
                + Add Task
              </Button>
            </div>

            {linkedTasks.length === 0 ? (
              <div className="p-6 text-center text-xs text-ch-text-tertiary border border-dashed border-ch-border rounded-lg">
                No linked tasks found for this buyer.
              </div>
            ) : (
              <div className="space-y-2">
                {linkedTasks.map((t: any) => (
                  <div key={t.id} className="bg-surface border border-ch-border rounded-lg p-2.5 flex items-center justify-between gap-2 shadow-sm">
                    <div>
                      <h4 className="font-semibold text-xs text-ch-text-primary">{t.title}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-ch-text-tertiary mt-0.5">
                        <span>Status: <strong className="text-ch-text-secondary">{t.status}</strong></span>
                        <span>• Priority: <strong className="text-ch-text-secondary">{t.priority}</strong></span>
                        {t.deadline && <span>• Due: {new Date(t.deadline).toLocaleDateString('en-IN')}</span>}
                      </div>
                    </div>
                    {t.assigneeName && (
                      <span className="text-[10px] bg-ch-bg border border-ch-border px-2 py-0.5 rounded text-ch-text-secondary">
                        👤 {t.assigneeName}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================
            TAB CONTENT 5: STAGE HISTORY
           ============================================================ */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            <span className="text-xs font-bold text-ch-text-secondary block">
              Stage Transition Audit Trail ({stageHistory.length})
            </span>

            {stageHistory.length === 0 ? (
              <div className="p-6 text-center text-xs text-ch-text-tertiary border border-dashed border-ch-border rounded-lg">
                No stage transitions recorded yet.
              </div>
            ) : (
              <div className="relative pl-4 border-l-2 border-ch-border space-y-4">
                {stageHistory.map((item: any, idx: number) => (
                  <div key={item.id || idx} className="space-y-1 relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-accent border-2 border-surface" />
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-ch-text-primary">
                        {BUYER_STAGE_LABELS[item.toStage as RealEstateBuyerStage] || item.toStage}
                      </span>
                      {item.fromStage && (
                        <span className="text-[10px] text-ch-text-tertiary">
                          (from {BUYER_STAGE_LABELS[item.fromStage as RealEstateBuyerStage] || item.fromStage})
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-ch-text-tertiary">
                      {formatDate(item.changedAt)} by <span className="font-semibold text-ch-text-secondary">{item.changedByName || item.actorName}</span>
                    </div>
                    {item.notes && (
                      <p className="text-xs text-ch-text-secondary bg-ch-bg p-2 rounded border border-ch-border mt-1">
                        {item.notes}
                      </p>
                    )}
                    {item.lostReason && (
                      <p className="text-xs text-rose-600 dark:text-rose-400 bg-rose-500/10 p-2 rounded border border-rose-500/20 mt-1">
                        Lost Reason: {item.lostReason}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Drawer>
  );
};
