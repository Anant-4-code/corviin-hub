import React, { useState } from 'react';
import {
  CampaignItem,
  CampaignStage,
  ScriptVersion,
  FootageChecklistItem,
} from '@corviin-hub/shared';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  Lightbulb,
  FileEdit,
  Video,
  Clapperboard,
  Send,
  Plus,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Check,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';

interface StageWorkspaceProps {
  campaign: CampaignItem;
  viewingStage: CampaignStage;
  workspaceId: string;
  onUpdateCampaign: (data: Partial<CampaignItem>) => Promise<void>;
  onAddScriptVersion: (data: { content: string; hook?: string; shotBreakdown?: string; cta?: string; revisionNote?: string }) => Promise<void>;
  onUpdateScriptStatus: (scriptId: string, status: 'APPROVED' | 'CHANGES_REQUESTED', feedback?: string) => Promise<void>;
  onUpdateFootageChecklist: (items: FootageChecklistItem[]) => Promise<void>;
}

export function StageWorkspace({
  campaign,
  viewingStage,
  workspaceId,
  onUpdateCampaign,
  onAddScriptVersion,
  onUpdateScriptStatus,
  onUpdateFootageChecklist,
}: StageWorkspaceProps) {
  // Stage 1 Local State
  const [objective, setObjective] = useState(campaign.objective || '');
  const [targetAudience, setTargetAudience] = useState(campaign.targetAudience || '');
  const [conceptNotes, setConceptNotes] = useState(campaign.conceptNotes || '');
  const [newRefLink, setNewRefLink] = useState('');
  const [isSavingStage1, setIsSavingStage1] = useState(false);

  // Stage 2 Local State (Scripting)
  const [finalTopic, setFinalTopic] = useState(campaign.finalTopic || '');
  const [showAddScript, setShowAddScript] = useState(false);
  const [scriptContent, setScriptContent] = useState('');
  const [scriptHook, setScriptHook] = useState('');
  const [scriptCta, setScriptCta] = useState('');
  const [revisionNote, setRevisionNote] = useState('');
  const [selectedScriptId, setSelectedScriptId] = useState<string | null>(
    campaign.scripts && campaign.scripts.length > 0
      ? campaign.scripts[campaign.scripts.length - 1].id
      : null,
  );
  const [feedbackInput, setFeedbackInput] = useState('');
  const [isSavingScript, setIsSavingScript] = useState(false);

  // Stage 3 Local State (Recording)
  const [recordingLocation, setRecordingLocation] = useState(campaign.recordingLocation || '');
  const [retakeNotes, setRetakeNotes] = useState(campaign.retakeNotes || '');
  const [newFootageLabel, setNewFootageLabel] = useState('');
  const [newFootageCategory, setNewFootageCategory] = useState<FootageChecklistItem['category']>('SCENE');

  // Stage 4 Local State (Editing)
  const [editingInstructions, setEditingInstructions] = useState(campaign.editingInstructions || '');
  const [aspectRatio, setAspectRatio] = useState(campaign.aspectRatio || '16:9');
  const [finalAssetApproved, setFinalAssetApproved] = useState(campaign.finalAssetApproved || false);

  // Stage 5 Local State (Posting)
  const [publicUrl, setPublicUrl] = useState(campaign.publicUrl || '');
  const [performanceNotes, setPerformanceNotes] = useState(campaign.performanceNotes || '');
  const [isSavingPosting, setIsSavingPosting] = useState(false);

  // -------------------------------------------------------------
  // STAGE 1: INITIAL IDEA WORKSPACE
  // -------------------------------------------------------------
  if (viewingStage === CampaignStage.INITIAL_IDEA) {
    const handleSaveStage1 = async () => {
      try {
        setIsSavingStage1(true);
        await onUpdateCampaign({
          objective: objective.trim() || undefined,
          targetAudience: targetAudience.trim() || undefined,
          conceptNotes: conceptNotes.trim() || undefined,
        });
      } finally {
        setIsSavingStage1(false);
      }
    };

    const handleAddRefLink = async () => {
      if (!newRefLink.trim()) return;
      const links = [...(campaign.referenceLinks || []), newRefLink.trim()];
      await onUpdateCampaign({ referenceLinks: links });
      setNewRefLink('');
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-ch-border">
          <div>
            <h3 className="text-sm font-bold text-ch-text-primary flex items-center gap-1.5">
              <Lightbulb size={16} className="text-amber-500" />
              Stage 1: Initial Idea & Creative Brief
            </h3>
            <p className="text-xs text-ch-text-secondary mt-0.5">
              Capture the core concept, target audience, and reference links before moving into full production.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveStage1}
            disabled={isSavingStage1}
            className="text-xs h-8"
          >
            {isSavingStage1 ? 'Saving...' : 'Save Ideation Brief'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Campaign Objective">
            <textarea
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              rows={3}
              placeholder="What is the key business goal or conversion target of this campaign?"
              className="w-full p-2.5 bg-surface border border-ch-border text-xs text-ch-text-primary placeholder:text-ch-text-muted focus:outline-none focus:border-primary resize-none"
            />
          </FormField>

          <FormField label="Target Audience Profile">
            <textarea
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              rows={3}
              placeholder="Who are we addressing? e.g. CTOs, luxury villa buyers, engineering leads..."
              className="w-full p-2.5 bg-surface border border-ch-border text-xs text-ch-text-primary placeholder:text-ch-text-muted focus:outline-none focus:border-primary resize-none"
            />
          </FormField>
        </div>

        <FormField label="Concept Notes & Narrative Hook">
          <textarea
            value={conceptNotes}
            onChange={(e) => setConceptNotes(e.target.value)}
            rows={4}
            placeholder="Detailed pitch, narrative arc, or key creative angles..."
            className="w-full p-2.5 bg-surface border border-ch-border text-xs text-ch-text-primary placeholder:text-ch-text-muted focus:outline-none focus:border-primary"
          />
        </FormField>

        {/* Reference Links Section */}
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-ch-text-muted">
            Reference Links & Benchmarks
          </h4>
          <div className="flex gap-2">
            <Input
              value={newRefLink}
              onChange={(e) => setNewRefLink(e.target.value)}
              placeholder="https://example.com/reference-post"
              className="text-xs flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddRefLink}
              className="text-xs h-8 gap-1"
            >
              <Plus size={13} />
              <span>Add Link</span>
            </Button>
          </div>

          <div className="space-y-1 mt-2">
            {(campaign.referenceLinks || []).map((link, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 border border-ch-border bg-surface text-xs"
              >
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline truncate flex items-center gap-1.5"
                >
                  <ExternalLink size={12} className="shrink-0" />
                  <span className="truncate">{link}</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STAGE 2: SCRIPTING & PLANNING WORKSPACE
  // -------------------------------------------------------------
  if (viewingStage === CampaignStage.SCRIPTING_PLANNING) {
    const scripts = campaign.scripts || [];
    const activeScript = scripts.find((s) => s.id === selectedScriptId) || scripts[scripts.length - 1];

    const handleCreateScript = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!scriptContent.trim()) return;
      try {
        setIsSavingScript(true);
        await onAddScriptVersion({
          content: scriptContent.trim(),
          hook: scriptHook.trim() || undefined,
          cta: scriptCta.trim() || undefined,
          revisionNote: revisionNote.trim() || undefined,
        });
        setShowAddScript(false);
        setScriptContent('');
        setScriptHook('');
        setScriptCta('');
        setRevisionNote('');
      } finally {
        setIsSavingScript(false);
      }
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-ch-border">
          <div>
            <h3 className="text-sm font-bold text-ch-text-primary flex items-center gap-1.5">
              <FileEdit size={16} className="text-info" />
              Stage 2: Scripting & Planning Workspace
            </h3>
            <p className="text-xs text-ch-text-secondary mt-0.5">
              Draft, version, and approve the complete production script and shot breakdown.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddScript(!showAddScript)}
            className="text-xs h-8 gap-1.5"
          >
            <Plus size={14} />
            <span>{showAddScript ? 'Close Form' : 'New Script Version'}</span>
          </Button>
        </div>

        {/* Final Topic Input */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-surface p-3 border border-ch-border">
          <FormField label="Official Final Topic">
            <Input
              value={finalTopic}
              onChange={(e) => setFinalTopic(e.target.value)}
              onBlur={() => onUpdateCampaign({ finalTopic: finalTopic.trim() })}
              placeholder="e.g. Why Zero Animation is the Future of Business Software"
              className="text-xs font-semibold"
            />
          </FormField>

          <div className="flex items-center justify-between p-2 border border-ch-border bg-surface-muted/30">
            <div>
              <span className="text-[11px] text-ch-text-muted block font-semibold uppercase">
                Script Approval Status
              </span>
              <span className="text-xs font-bold text-ch-text-primary">
                {campaign.scriptApproved ? 'APPROVED FOR PRODUCTION' : 'PENDING APPROVAL'}
              </span>
            </div>
            {campaign.scriptApproved ? (
              <Badge variant="success">Approved</Badge>
            ) : (
              <Badge variant="warning">In Review</Badge>
            )}
          </div>
        </div>

        {/* Add Script Revision Form */}
        {showAddScript && (
          <form onSubmit={handleCreateScript} className="p-4 border border-info/40 bg-info/5 space-y-3">
            <h4 className="text-xs font-bold text-info uppercase tracking-wider">
              Draft New Script Revision (Version {scripts.length + 1})
            </h4>

            <FormField label="Hook / Opening 10 Seconds *" required>
              <Input
                value={scriptHook}
                onChange={(e) => setScriptHook(e.target.value)}
                placeholder="Attention-grabbing opening sentence..."
                className="text-xs"
                required
              />
            </FormField>

            <FormField label="Full Script Content *" required>
              <textarea
                value={scriptContent}
                onChange={(e) => setScriptContent(e.target.value)}
                rows={6}
                placeholder="Scene breakdown, dialogues, screen recordings, voiceover copy..."
                className="w-full p-2.5 bg-surface border border-ch-border text-xs text-ch-text-primary font-mono placeholder:text-ch-text-muted focus:outline-none focus:border-primary"
                required
              />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Call to Action (CTA)">
                <Input
                  value={scriptCta}
                  onChange={(e) => setScriptCta(e.target.value)}
                  placeholder="e.g. Visit corviin.dev/preview"
                  className="text-xs"
                />
              </FormField>

              <FormField label="Revision Notes">
                <Input
                  value={revisionNote}
                  onChange={(e) => setRevisionNote(e.target.value)}
                  placeholder="What was updated in this revision?"
                  className="text-xs"
                />
              </FormField>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddScript(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" disabled={isSavingScript}>
                {isSavingScript ? 'Saving...' : `Save Script v${scripts.length + 1}`}
              </Button>
            </div>
          </form>
        )}

        {/* Version History Selector */}
        {scripts.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-xs font-semibold text-ch-text-secondary mr-2">Versions:</span>
              {scripts.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedScriptId(s.id)}
                  className={`px-3 py-1 text-xs font-medium border transition-none ${
                    (activeScript?.id === s.id)
                      ? 'border-primary bg-primary text-white font-bold'
                      : 'border-ch-border bg-surface text-ch-text-primary hover:bg-surface-muted'
                  }`}
                >
                  v{s.versionNumber} ({s.status})
                </button>
              ))}
            </div>

            {/* Active Script Content Inspection */}
            {activeScript && (
              <div className="p-4 border border-ch-border bg-surface space-y-4">
                <div className="flex items-start justify-between border-b border-ch-border pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-ch-text-primary">
                      Script Version {activeScript.versionNumber}
                    </h4>
                    <span className="text-[11px] text-ch-text-muted">
                      Authored by {activeScript.authorName} on {new Date(activeScript.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <Badge
                    variant={
                      activeScript.status === 'APPROVED'
                        ? 'success'
                        : activeScript.status === 'CHANGES_REQUESTED'
                        ? 'danger'
                        : 'warning'
                    }
                  >
                    {activeScript.status}
                  </Badge>
                </div>

                {activeScript.hook && (
                  <div className="p-2.5 bg-surface-muted/40 border border-ch-border">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">
                      Opening Hook
                    </span>
                    <p className="text-xs font-semibold text-ch-text-primary mt-0.5">
                      "{activeScript.hook}"
                    </p>
                  </div>
                )}

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ch-text-muted block mb-1">
                    Script Body & Dialogue
                  </span>
                  <div className="p-3 bg-canvas border border-ch-border font-mono text-xs whitespace-pre-wrap leading-relaxed text-ch-text-primary">
                    {activeScript.content}
                  </div>
                </div>

                {activeScript.cta && (
                  <div className="text-xs">
                    <span className="text-ch-text-muted font-bold mr-2">CTA:</span>
                    <span className="text-ch-text-primary font-medium">{activeScript.cta}</span>
                  </div>
                )}

                {/* Script Approval Review Actions */}
                <div className="pt-3 border-t border-ch-border space-y-2">
                  <span className="text-[11px] font-bold text-ch-text-secondary uppercase">
                    Reviewer Sign-off
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <Input
                      value={feedbackInput}
                      onChange={(e) => setFeedbackInput(e.target.value)}
                      placeholder="Add feedback or approval notes..."
                      className="text-xs flex-1 min-w-[200px]"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        onUpdateScriptStatus(activeScript.id, 'CHANGES_REQUESTED', feedbackInput)
                      }
                      className="text-xs text-danger border-danger/40 hover:bg-danger/10"
                    >
                      Request Changes
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onUpdateScriptStatus(activeScript.id, 'APPROVED', feedbackInput)}
                      className="text-xs bg-success hover:bg-success/90 text-white gap-1"
                    >
                      <Check size={13} />
                      <span>Approve Script</span>
                    </Button>
                  </div>
                  {activeScript.feedback && (
                    <p className="text-[11px] text-ch-text-secondary italic">
                      Reviewer Note: "{activeScript.feedback}"
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // STAGE 3: RECORDING & ASSET UPLOAD WORKSPACE
  // -------------------------------------------------------------
  if (viewingStage === CampaignStage.RECORDING_UPLOAD) {
    const checklist = campaign.footageChecklist || [];

    const handleToggleChecklistStatus = async (itemId: string) => {
      const updated = checklist.map((item) => {
        if (item.id === itemId) {
          const nextStatus: FootageChecklistItem['status'] =
            item.status === 'DONE' ? 'RETAKE' : item.status === 'RETAKE' ? 'MISSING' : 'DONE';
          return { ...item, status: nextStatus };
        }
        return item;
      });
      await onUpdateFootageChecklist(updated);
    };

    const handleAddFootageItem = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newFootageLabel.trim()) return;
      const newItem: FootageChecklistItem = {
        id: `ftg-${Date.now()}`,
        label: newFootageLabel.trim(),
        category: newFootageCategory,
        status: 'DONE',
      };
      await onUpdateFootageChecklist([...checklist, newItem]);
      setNewFootageLabel('');
    };

    const handleSaveRecordingMetadata = async () => {
      await onUpdateCampaign({
        recordingLocation: recordingLocation.trim() || undefined,
        retakeNotes: retakeNotes.trim() || undefined,
      });
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-ch-border">
          <div>
            <h3 className="text-sm font-bold text-ch-text-primary flex items-center gap-1.5">
              <Video size={16} className="text-warning" />
              Stage 3: Recording & Shot List Execution
            </h3>
            <p className="text-xs text-ch-text-secondary mt-0.5">
              Track shot footage completion, retakes, and verify uploaded raw assets.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleSaveRecordingMetadata} className="text-xs h-8">
            Save Recording Notes
          </Button>
        </div>

        {/* Location & Retake Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField label="Filming / Studio Location">
            <Input
              value={recordingLocation}
              onChange={(e) => setRecordingLocation(e.target.value)}
              placeholder="e.g. Corviin Tech Studio 1 or Property Site"
              className="text-xs"
            />
          </FormField>

          <FormField label="Retake & Missing Footage Directives">
            <Input
              value={retakeNotes}
              onChange={(e) => setRetakeNotes(e.target.value)}
              placeholder="e.g. Re-film drone flyover at sunset; retake screencast at 4K"
              className="text-xs"
            />
          </FormField>
        </div>

        {/* Interactive Footage Checklist */}
        <div className="p-4 border border-ch-border bg-surface space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ch-text-primary">
              Shot List & Footage Checklist ({checklist.filter((i) => i.status === 'DONE').length}/{checklist.length} Complete)
            </h4>
            <span className="text-[11px] text-ch-text-muted">
              Click status to cycle: DONE → RETAKE → MISSING
            </span>
          </div>

          {/* Add Item Row */}
          <form onSubmit={handleAddFootageItem} className="flex gap-2">
            <Input
              value={newFootageLabel}
              onChange={(e) => setNewFootageLabel(e.target.value)}
              placeholder="Add shot description (e.g. Screen recording of Task Kanban)..."
              className="text-xs flex-1"
            />
            <select
              value={newFootageCategory}
              onChange={(e) => setNewFootageCategory(e.target.value as any)}
              className="py-1 px-2 text-xs bg-surface border border-ch-border text-ch-text-primary"
            >
              <option value="SCENE">Scene</option>
              <option value="B_ROLL">B-Roll</option>
              <option value="VOICEOVER">Voiceover</option>
              <option value="SCREEN_RECORDING">Screen Recording</option>
            </select>
            <Button type="submit" variant="primary" size="sm" className="text-xs h-8">
              Add Shot
            </Button>
          </form>

          {/* Checklist Items */}
          <div className="space-y-1.5 pt-2">
            {checklist.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 border border-ch-border bg-surface hover:bg-surface-muted/30 transition-none"
              >
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 border border-ch-border bg-surface-muted text-ch-text-secondary">
                    {item.category}
                  </span>
                  <span className="text-xs font-medium text-ch-text-primary">{item.label}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleChecklistStatus(item.id)}
                  className="px-2 py-0.5 text-xs font-bold transition-none focus:outline-none"
                >
                  {item.status === 'DONE' ? (
                    <span className="inline-flex items-center gap-1 text-success bg-success/10 px-2 py-0.5 border border-success/30">
                      <Check size={11} /> DONE
                    </span>
                  ) : item.status === 'RETAKE' ? (
                    <span className="inline-flex items-center gap-1 text-warning bg-warning/10 px-2 py-0.5 border border-warning/30">
                      <RotateCcw size={11} /> RETAKE
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-danger bg-danger/10 px-2 py-0.5 border border-danger/30">
                      <AlertTriangle size={11} /> MISSING
                    </span>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STAGE 4: EDITING & FINAL ASSET WORKSPACE
  // -------------------------------------------------------------
  if (viewingStage === CampaignStage.EDITING_FINAL) {
    const handleSaveEditing = async () => {
      await onUpdateCampaign({
        editingInstructions: editingInstructions.trim() || undefined,
        aspectRatio,
        finalAssetApproved,
      });
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-ch-border">
          <div>
            <h3 className="text-sm font-bold text-ch-text-primary flex items-center gap-1.5">
              <Clapperboard size={16} className="text-purple-500" />
              Stage 4: Post-Production & Final Master Approval
            </h3>
            <p className="text-xs text-ch-text-secondary mt-0.5">
              Review draft edits, request revisions, and officially approve the master asset before posting.
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={handleSaveEditing} className="text-xs h-8">
            Save Editing Specifications
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Aspect Ratio / Output Standard">
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="w-full py-2 px-2.5 bg-surface border border-ch-border text-xs text-ch-text-primary focus:outline-none focus:border-primary"
            >
              <option value="16:9">16:9 (Landscape YouTube / Web)</option>
              <option value="9:16">9:16 (Vertical Reels / Shorts)</option>
              <option value="1:1">1:1 (Square LinkedIn / Instagram)</option>
              <option value="4:5">4:5 (Portrait Feed)</option>
            </select>
          </FormField>

          <div className="p-3 border border-ch-border bg-surface flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-ch-text-muted block uppercase">
                Final Cut Master Approval
              </span>
              <span className="text-xs font-semibold text-ch-text-primary">
                {finalAssetApproved ? 'APPROVED FOR PUBLISHING' : 'PENDING MASTER SIGN-OFF'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setFinalAssetApproved(!finalAssetApproved)}
              className={`px-3 py-1.5 text-xs font-bold border transition-none ${
                finalAssetApproved
                  ? 'bg-success text-white border-success'
                  : 'bg-surface text-ch-text-secondary border-ch-border hover:bg-surface-muted'
              }`}
            >
              {finalAssetApproved ? 'Approved ✓' : 'Click to Approve'}
            </button>
          </div>
        </div>

        <FormField label="Editing Instructions & Directives">
          <textarea
            value={editingInstructions}
            onChange={(e) => setEditingInstructions(e.target.value)}
            rows={4}
            placeholder="Color grading notes, typography styling, background music volume, b-roll placement..."
            className="w-full p-2.5 bg-surface border border-ch-border text-xs text-ch-text-primary placeholder:text-ch-text-muted focus:outline-none focus:border-primary"
          />
        </FormField>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STAGE 5: POSTING & COMPLETION WORKSPACE
  // -------------------------------------------------------------
  const handleSavePosting = async () => {
    try {
      setIsSavingPosting(true);
      await onUpdateCampaign({
        publicUrl: publicUrl.trim() || undefined,
        performanceNotes: performanceNotes.trim() || undefined,
      });
    } finally {
      setIsSavingPosting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-ch-border">
        <div>
          <h3 className="text-sm font-bold text-ch-text-primary flex items-center gap-1.5">
            <Send size={16} className="text-success" />
            Stage 5: Publishing, Live Verification & Completion
          </h3>
          <p className="text-xs text-ch-text-secondary mt-0.5">
            Record public post URL, publish timestamps, and operational performance baseline.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={handleSavePosting}
          disabled={isSavingPosting}
          className="text-xs h-8"
        >
          {isSavingPosting ? 'Saving...' : 'Save Publishing Details'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Public Live Post URL *" required>
          <Input
            value={publicUrl}
            onChange={(e) => setPublicUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=... or https://linkedin.com/posts/..."
            className="text-xs font-mono"
            required
          />
        </FormField>

        <div className="p-3 border border-ch-border bg-surface-muted/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-ch-text-muted block uppercase">
              Target vs Actual Publish
            </span>
            <span className="text-xs font-mono text-ch-text-primary">
              Target: {new Date(campaign.targetPublishDate).toLocaleDateString()}
            </span>
          </div>
          {campaign.actualPublishDate && (
            <span className="text-xs font-mono text-success font-semibold">
              Actual: {new Date(campaign.actualPublishDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <FormField label="Performance Notes & Initial Metrics">
        <textarea
          value={performanceNotes}
          onChange={(e) => setPerformanceNotes(e.target.value)}
          rows={3}
          placeholder="First 24-hour reach, viewer feedback, inbound lead inquiries..."
          className="w-full p-2.5 bg-surface border border-ch-border text-xs text-ch-text-primary placeholder:text-ch-text-muted focus:outline-none focus:border-primary"
        />
      </FormField>
    </div>
  );
}

