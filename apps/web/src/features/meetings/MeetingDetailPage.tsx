import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '@/lib/store';
import {
  fetchMeetingById,
  updateMeeting,
  rescheduleMeeting,
  convertMeetingActionItem,
} from '@/services/meetings';
import { MeetingStatus, TaskPriority } from '@corviin-hub/shared';
import type {
  MeetingItem,
  MeetingAgendaTopic,
  MeetingActionItem,
  MeetingDecisionRecord,
  MeetingDetailedNotes,
  MeetingOutcome,
  RescheduleMeetingDto,
} from '@corviin-hub/shared';
import {
  MEETING_CATEGORY_CONFIG,
  MEETING_STATUS_CONFIG,
  PRIORITY_CONFIG,
  formatMeetingDate,
  formatMeetingTimeRange,
  getMemberName,
  TEAM_MEMBERS,
} from './components/meeting-constants';
import { RescheduleMeetingModal } from './components/RescheduleMeetingModal';
import { AddActionItemDialog } from './components/AddActionItemDialog';
import { AddDecisionDialog } from './components/AddDecisionDialog';
import { AddAgendaTopicDialog } from './components/AddAgendaTopicDialog';

type DetailTab =
  | 'overview'
  | 'agenda'
  | 'preparation'
  | 'notes'
  | 'decisions'
  | 'action_items'
  | 'attachments'
  | 'outcome'
  | 'history';

export const MeetingDetailPage: React.FC = () => {
  const { meetingId } = useParams<{ meetingId: string }>();
  const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId) || 'ws-tech-0001-0000-000000000001';
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isAddActionOpen, setIsAddActionOpen] = useState(false);
  const [isAddDecisionOpen, setIsAddDecisionOpen] = useState(false);
  const [isAddAgendaOpen, setIsAddAgendaOpen] = useState(false);

  // Editable Notes State
  const [notesSummary, setNotesSummary] = useState('');
  const [notesInfoReceived, setNotesInfoReceived] = useState('');
  const [notesQuestions, setNotesQuestions] = useState('');
  const [notesBlockers, setNotesBlockers] = useState('');
  const [notesCommitments, setNotesCommitments] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  // Outcome State
  const [outcomeSummary, setOutcomeSummary] = useState('');
  const [outcomeNextSteps, setOutcomeNextSteps] = useState('');
  const [outcomeFollowUpDate, setOutcomeFollowUpDate] = useState('');
  const [outcomeNextMeetingDate, setOutcomeNextMeetingDate] = useState('');
  const [outcomeCrmNote, setOutcomeCrmNote] = useState('');
  const [isEditingOutcome, setIsEditingOutcome] = useState(false);

  // New Attachment input
  const [newAttachmentName, setNewAttachmentName] = useState('');
  const [newAttachmentUrl, setNewAttachmentUrl] = useState('');
  const [isAddAttachmentOpen, setIsAddAttachmentOpen] = useState(false);

  const {
    data: meeting,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['meeting', selectedWorkspaceId, meetingId],
    queryFn: async () => {
      if (!selectedWorkspaceId || !meetingId) throw new Error('Missing workspace or meeting ID');
      const data = await fetchMeetingById(selectedWorkspaceId, meetingId);
      // Synchronize edit buffers
      if (data.detailedNotes) {
        setNotesSummary(data.detailedNotes.summary || '');
        setNotesInfoReceived(data.detailedNotes.infoReceived || '');
        setNotesQuestions(data.detailedNotes.questions?.join('\n') || '');
        setNotesBlockers(data.detailedNotes.blockers?.join('\n') || '');
        setNotesCommitments(data.detailedNotes.commitments?.join('\n') || '');
      }
      if (data.outcome) {
        setOutcomeSummary(data.outcome.outcomeSummary || '');
        setOutcomeNextSteps(data.outcome.nextSteps || '');
        setOutcomeFollowUpDate(data.outcome.nextFollowUpDate || '');
        setOutcomeNextMeetingDate(data.outcome.nextMeetingDate || '');
        setOutcomeCrmNote(data.outcome.crmUpdateNote || '');
      }
      return data;
    },
    enabled: Boolean(selectedWorkspaceId && meetingId),
  });

  // Mutations
  const updateMutation = useMutation({
    mutationFn: async (updatedFields: Partial<MeetingItem>) => {
      if (!selectedWorkspaceId || !meetingId) return;
      return updateMeeting(selectedWorkspaceId, meetingId, updatedFields);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meeting', selectedWorkspaceId, meetingId] });
      queryClient.invalidateQueries({ queryKey: ['meetings', selectedWorkspaceId] });
    },
  });

  const rescheduleMutation = useMutation({
    mutationFn: async (dto: RescheduleMeetingDto) => {
      if (!selectedWorkspaceId || !meetingId) return;
      return rescheduleMeeting(selectedWorkspaceId, meetingId, dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meeting', selectedWorkspaceId, meetingId] });
      queryClient.invalidateQueries({ queryKey: ['meetings', selectedWorkspaceId] });
    },
  });

  const convertActionMutation = useMutation({
    mutationFn: async ({ actionItemId }: { actionItemId: string }) => {
      if (!selectedWorkspaceId || !meetingId) return;
      return convertMeetingActionItem(selectedWorkspaceId, meetingId, { actionItemId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meeting', selectedWorkspaceId, meetingId] });
      queryClient.invalidateQueries({ queryKey: ['meetings', selectedWorkspaceId] });
      queryClient.invalidateQueries({ queryKey: ['tasks', selectedWorkspaceId] });
    },
  });

  if (isLoading) {
    return (
      <div className="p-8 text-center text-sm text-secondary">
        Loading operational meeting record...
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-base font-semibold text-primary">Meeting not found</h2>
        <p className="text-xs text-secondary mt-1">
          The requested meeting could not be loaded or is in a different workspace.
        </p>
        <Link
          to="/app/meetings"
          className="inline-block mt-4 px-4 py-2 text-xs font-semibold rounded bg-brand-teal text-white"
        >
          Return to Meetings List
        </Link>
      </div>
    );
  }

  const categoryConfig = MEETING_CATEGORY_CONFIG[meeting.category] || {
    label: meeting.category,
    badgeClass: 'bg-surface-muted text-secondary',
    dotClass: 'bg-stone-400',
  };
  const statusConfig = MEETING_STATUS_CONFIG[meeting.status] || {
    label: meeting.status,
    badgeClass: 'bg-surface-muted text-secondary',
    dotClass: 'bg-stone-400',
  };

  // Status transition handler
  const handleStatusChange = (newStatus: MeetingStatus) => {
    updateMutation.mutate({ status: newStatus });
  };

  // Agenda toggle
  const handleToggleAgendaTopic = (topicId: string, currentVal?: boolean) => {
    const updated = (meeting.agendaTopics || []).map((t) =>
      t.id === topicId ? { ...t, completed: !currentVal } : t,
    );
    updateMutation.mutate({ agendaTopics: updated });
  };

  // Add agenda topic
  const handleAddAgendaTopic = (topic: Omit<MeetingAgendaTopic, 'id'>) => {
    const newTopic: MeetingAgendaTopic = {
      ...topic,
      id: `top-${Date.now()}`,
    };
    const updated = [...(meeting.agendaTopics || []), newTopic];
    updateMutation.mutate({ agendaTopics: updated });
  };

  // Add action item
  const handleAddActionItem = (item: Omit<MeetingActionItem, 'id' | 'status'>) => {
    const newItem: MeetingActionItem = {
      ...item,
      id: `act-${Date.now()}`,
      status: 'PENDING',
    };
    const updated = [...(meeting.actionItems || []), newItem];
    updateMutation.mutate({ actionItems: updated });
  };

  // Add formal decision
  const handleAddDecision = (decision: Omit<MeetingDecisionRecord, 'id' | 'createdAt'>) => {
    const newDec: MeetingDecisionRecord = {
      ...decision,
      id: `dec-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [...(meeting.formalDecisions || []), newDec];
    updateMutation.mutate({ formalDecisions: updated });
  };

  // Save detailed notes
  const handleSaveNotes = () => {
    const updatedDetailedNotes: MeetingDetailedNotes = {
      summary: notesSummary.trim() || undefined,
      infoReceived: notesInfoReceived.trim() || undefined,
      questions: notesQuestions
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      blockers: notesBlockers
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      commitments: notesCommitments
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    };
    updateMutation.mutate({ detailedNotes: updatedDetailedNotes });
    setIsEditingNotes(false);
  };

  // Save outcome
  const handleSaveOutcome = () => {
    const updatedOutcome: MeetingOutcome = {
      outcomeSummary: outcomeSummary.trim() || undefined,
      nextSteps: outcomeNextSteps.trim() || undefined,
      nextFollowUpDate: outcomeFollowUpDate || undefined,
      nextMeetingDate: outcomeNextMeetingDate || undefined,
      crmUpdateNote: outcomeCrmNote.trim() || undefined,
    };
    updateMutation.mutate({ outcome: updatedOutcome });
    setIsEditingOutcome(false);
  };

  // Add attachment
  const handleAddAttachment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAttachmentName.trim()) return;
    const newAtt = {
      id: `att-${Date.now()}`,
      name: newAttachmentName.trim(),
      url: newAttachmentUrl.trim() || `/api/v1/assets/att-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
      size: 'Document',
    };
    const updated = [...(meeting.attachments || []), newAtt];
    updateMutation.mutate({ attachments: updated });
    setNewAttachmentName('');
    setNewAttachmentUrl('');
    setIsAddAttachmentOpen(false);
  };

  const tabs: Array<{ id: DetailTab; label: string; count?: number }> = [
    { id: 'overview', label: 'Overview' },
    { id: 'agenda', label: 'Agenda', count: meeting.agendaTopics?.length || 0 },
    { id: 'preparation', label: 'Preparation' },
    { id: 'notes', label: 'Discussion Notes' },
    { id: 'decisions', label: 'Decisions', count: meeting.formalDecisions?.length || 0 },
    {
      id: 'action_items',
      label: 'Action Items',
      count: meeting.actionItems?.length || 0,
    },
    { id: 'attachments', label: 'Attachments', count: meeting.attachments?.length || 0 },
    { id: 'outcome', label: 'Outcome & Follow-up' },
    { id: 'history', label: 'Audit History', count: meeting.rescheduleHistory?.length || 0 },
  ];

  return (
    <div className="space-y-4">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center text-xs text-secondary gap-1.5">
        <Link to="/app/meetings" className="hover:text-primary">
          Meetings
        </Link>
        <span>/</span>
        <span className="text-primary font-medium truncate max-w-[260px]">{meeting.title}</span>
      </nav>

      {/* Main Header Banner */}
      <div className="bg-surface border border-border rounded-lg p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${categoryConfig.badgeClass}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${categoryConfig.dotClass}`} />
                {categoryConfig.label}
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${statusConfig.badgeClass}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusConfig.dotClass}`} />
                {statusConfig.label}
              </span>
              {meeting.linkedRecord && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-surface-muted text-secondary border border-border">
                  <span className="uppercase text-[10px] mr-1 text-tertiary">
                    {meeting.linkedRecord.type}:
                  </span>
                  {meeting.linkedRecord.title}
                </span>
              )}
            </div>

            <h1 className="text-xl font-bold text-primary">{meeting.title}</h1>

            <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-secondary mt-2">
              <div className="flex items-center gap-1.5 font-medium text-primary">
                <svg className="w-4 h-4 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>{formatMeetingDate(meeting.date)}</span>
                <span>•</span>
                <span>{formatMeetingTimeRange(meeting.startTime, meeting.endTime)}</span>
              </div>
              <div className="flex items-center gap-1 text-tertiary">
                Organiser: <span className="text-primary font-medium">{getMemberName(meeting.organiserId)}</span>
              </div>
            </div>
          </div>

          {/* Direct Action Buttons: min-h-[44px] on mobile */}
          <div className="flex items-center flex-wrap gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-border">
            {meeting.meetingUrl && (
              <a
                href={meeting.meetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[40px] px-3.5 py-2 text-xs font-semibold rounded bg-brand-teal text-white hover:bg-brand-teal/90 inline-flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Join Online Call
              </a>
            )}

            {meeting.phoneNumber && (
              <a
                href={`tel:${meeting.phoneNumber}`}
                className="min-h-[40px] px-3.5 py-2 text-xs font-semibold rounded bg-emerald-600 text-white hover:bg-emerald-700 inline-flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                Call Phone
              </a>
            )}

            {meeting.location && (
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(meeting.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[40px] px-3.5 py-2 text-xs font-semibold rounded bg-surface-muted text-primary border border-border hover:bg-surface-hover inline-flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                </svg>
                Map
              </a>
            )}

            <button
              type="button"
              onClick={() => setIsRescheduleOpen(true)}
              className="min-h-[40px] px-3.5 py-2 text-xs font-semibold rounded bg-surface-muted text-secondary hover:text-primary border border-border hover:bg-surface-hover"
            >
              Reschedule
            </button>

            {/* Status change actions */}
            <div className="relative inline-block">
              <select
                value={meeting.status}
                onChange={(e) => handleStatusChange(e.target.value as MeetingStatus)}
                className="min-h-[40px] text-xs font-semibold bg-surface border border-border rounded px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
              >
                {Object.values(MeetingStatus).map((st) => (
                  <option key={st} value={st}>
                    Mark {MEETING_STATUS_CONFIG[st]?.label || st}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation (Horizontal bar) */}
      <div className="border-b border-border flex items-center gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2.5 text-xs font-medium border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-brand-teal text-brand-teal'
                : 'border-transparent text-secondary hover:text-primary'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-surface-muted text-secondary border border-border">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ======================================================== */}
      {/* TAB CONTENT SECTIONS (Section 4 Compliance)              */}
      {/* ======================================================== */}

      {/* 1. OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface border border-border rounded-lg p-5 space-y-4">
            <h3 className="text-sm font-semibold text-primary border-b border-border pb-2">
              Scheduling & Session Details
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-tertiary block text-[11px]">Title</span>
                <span className="font-semibold text-primary">{meeting.title}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-tertiary block text-[11px]">Meeting Category</span>
                  <span className="font-medium text-primary">{categoryConfig.label}</span>
                </div>
                <div>
                  <span className="text-tertiary block text-[11px]">Operational Status</span>
                  <span className="font-medium text-primary">{statusConfig.label}</span>
                </div>
              </div>
              <div>
                <span className="text-tertiary block text-[11px]">Date & Time</span>
                <span className="font-medium text-primary">
                  {formatMeetingDate(meeting.date)} • {formatMeetingTimeRange(meeting.startTime, meeting.endTime)}
                </span>
              </div>
              {meeting.location && (
                <div>
                  <span className="text-tertiary block text-[11px]">Location</span>
                  <span className="font-medium text-primary">{meeting.location}</span>
                </div>
              )}
              {meeting.meetingUrl && (
                <div>
                  <span className="text-tertiary block text-[11px]">Meeting URL</span>
                  <a
                    href={meeting.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-brand-teal underline truncate block"
                  >
                    {meeting.meetingUrl}
                  </a>
                </div>
              )}
              {meeting.phoneNumber && (
                <div>
                  <span className="text-tertiary block text-[11px]">Phone Number</span>
                  <span className="font-medium text-primary">{meeting.phoneNumber}</span>
                </div>
              )}
              {meeting.agenda && (
                <div>
                  <span className="text-tertiary block text-[11px]">Core Objective</span>
                  <p className="text-secondary mt-0.5 leading-relaxed">{meeting.agenda}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-surface border border-border rounded-lg p-5 space-y-4">
            <h3 className="text-sm font-semibold text-primary border-b border-border pb-2">
              Participants & Linkages
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-tertiary block text-[11px] mb-1">Organiser</span>
                <div className="flex items-center gap-2 p-2 rounded bg-surface-muted border border-border">
                  <div className="w-6 h-6 rounded-full bg-brand-teal/20 text-brand-teal font-bold flex items-center justify-center text-xs">
                    {getMemberName(meeting.organiserId).slice(0, 1)}
                  </div>
                  <div>
                    <div className="font-semibold text-primary">{getMemberName(meeting.organiserId)}</div>
                    <div className="text-[10px] text-tertiary">Organiser & Coordinator</div>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-tertiary block text-[11px] mb-1">Internal Team Participants</span>
                <div className="space-y-1.5">
                  {(meeting.participantIds || []).map((pId) => (
                    <div key={pId} className="flex items-center gap-2 text-primary font-medium">
                      <span className="w-2 h-2 rounded-full bg-brand-teal" />
                      <span>{getMemberName(pId)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {meeting.externalParticipants && meeting.externalParticipants.length > 0 && (
                <div>
                  <span className="text-tertiary block text-[11px] mb-1">External Participants</span>
                  <div className="space-y-1">
                    {meeting.externalParticipants.map((att, idx) => (
                      <div key={idx} className="p-1.5 rounded bg-surface-muted text-secondary text-xs">
                        {att}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {meeting.linkedRecord && (
                <div>
                  <span className="text-tertiary block text-[11px] mb-1">Linked Operational Record</span>
                  <div className="p-2.5 rounded bg-surface-muted border border-border">
                    <span className="text-[10px] font-bold uppercase text-brand-teal tracking-wider">
                      {meeting.linkedRecord.type}
                    </span>
                    <div className="font-semibold text-primary mt-0.5">{meeting.linkedRecord.title}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. AGENDA */}
      {activeTab === 'agenda' && (
        <div className="bg-surface border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
            <div>
              <h3 className="text-sm font-semibold text-primary">Meeting Agenda & Time Allocations</h3>
              <p className="text-xs text-secondary mt-0.5">
                Track agenda topics, owners, time allocations, and check off completed items.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddAgendaOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold rounded bg-brand-teal text-white hover:bg-brand-teal/90"
            >
              + Add Agenda Topic
            </button>
          </div>

          {(!meeting.agendaTopics || meeting.agendaTopics.length === 0) ? (
            <div className="text-center py-8 text-xs text-secondary">
              No specific agenda topics structured yet. Click "+ Add Agenda Topic" to build the session flow.
            </div>
          ) : (
            <div className="space-y-2">
              {meeting.agendaTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="flex items-center justify-between p-3 rounded-md bg-surface-muted border border-border hover:bg-surface-hover"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={Boolean(topic.completed)}
                      onChange={() => handleToggleAgendaTopic(topic.id, topic.completed)}
                      className="w-4 h-4 rounded text-brand-teal focus:ring-brand-teal"
                    />
                    <div>
                      <span
                        className={`text-sm font-medium ${
                          topic.completed ? 'line-through text-tertiary' : 'text-primary'
                        }`}
                      >
                        {topic.topic}
                      </span>
                      <div className="text-[11px] text-tertiary mt-0.5">
                        Lead: {getMemberName(topic.ownerId)} {topic.timeMinutes ? `• ${topic.timeMinutes} mins` : ''}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                      topic.completed
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300'
                    }`}
                  >
                    {topic.completed ? 'Covered' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. PREPARATION */}
      {activeTab === 'preparation' && (
        <div className="bg-surface border border-border rounded-lg p-5 space-y-4">
          <h3 className="text-sm font-semibold text-primary border-b border-border pb-2">
            Preparation, Background & Questions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Background */}
            <div className="p-4 rounded-md bg-surface-muted border border-border">
              <span className="font-semibold text-primary block text-xs mb-1">Background Context</span>
              <p className="text-secondary leading-relaxed">
                {meeting.preparation?.background ||
                  meeting.notes ||
                  'No background notes provided for this session.'}
              </p>
            </div>

            {/* Questions to address */}
            <div className="p-4 rounded-md bg-surface-muted border border-border">
              <span className="font-semibold text-primary block text-xs mb-1">Questions to Address</span>
              {meeting.preparation?.questions && meeting.preparation.questions.length > 0 ? (
                <ul className="list-disc pl-4 space-y-1 text-secondary">
                  {meeting.preparation.questions.map((q, idx) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ul>
              ) : (
                <span className="text-tertiary">No pre-meeting questions recorded.</span>
              )}
            </div>

            {/* Required Decisions */}
            <div className="p-4 rounded-md bg-surface-muted border border-border">
              <span className="font-semibold text-primary block text-xs mb-1">Required Decisions to Reach</span>
              {meeting.preparation?.requiredDecisions && meeting.preparation.requiredDecisions.length > 0 ? (
                <ul className="list-disc pl-4 space-y-1 text-secondary">
                  {meeting.preparation.requiredDecisions.map((d, idx) => (
                    <li key={idx}>{d}</li>
                  ))}
                </ul>
              ) : (
                <span className="text-tertiary">No predefined mandatory decisions logged.</span>
              )}
            </div>

            {/* Reference Links & Documents */}
            <div className="p-4 rounded-md bg-surface-muted border border-border">
              <span className="font-semibold text-primary block text-xs mb-1">Reference Links & Documents</span>
              {meeting.preparation?.links && meeting.preparation.links.length > 0 ? (
                <div className="space-y-1">
                  {meeting.preparation.links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-teal underline truncate block"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              ) : (
                <span className="text-tertiary">No reference links attached.</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. DETAILED DISCUSSION NOTES */}
      {activeTab === 'notes' && (
        <div className="bg-surface border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
            <div>
              <h3 className="text-sm font-semibold text-primary">Topic-by-Topic Discussion Notes</h3>
              <p className="text-xs text-secondary mt-0.5">
                Structured minutes: summary, key info received, concerns/blockers, and commitments.
              </p>
            </div>
            {!isEditingNotes ? (
              <button
                type="button"
                onClick={() => setIsEditingNotes(true)}
                className="px-3 py-1.5 text-xs font-semibold rounded bg-surface-muted text-secondary hover:text-primary border border-border"
              >
                Edit Discussion Notes
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingNotes(false)}
                  className="px-3 py-1.5 text-xs font-medium text-secondary hover:text-primary bg-surface border border-border rounded"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="px-3 py-1.5 text-xs font-semibold rounded bg-brand-teal text-white hover:bg-brand-teal/90"
                >
                  Save Notes
                </button>
              </div>
            )}
          </div>

          {!isEditingNotes ? (
            <div className="space-y-4 text-xs">
              <div>
                <span className="font-semibold text-primary block text-xs mb-1">Executive Summary</span>
                <div className="p-3 rounded-md bg-surface-muted border border-border text-secondary leading-relaxed">
                  {meeting.detailedNotes?.summary ||
                    meeting.notes ||
                    'No summary notes recorded yet.'}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold text-primary block text-xs mb-1">Information Received</span>
                  <div className="p-3 rounded-md bg-surface-muted border border-border text-secondary leading-relaxed">
                    {meeting.detailedNotes?.infoReceived || 'None recorded.'}
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-primary block text-xs mb-1">Concerns & Blockers</span>
                  {meeting.detailedNotes?.blockers && meeting.detailedNotes.blockers.length > 0 ? (
                    <ul className="p-3 rounded-md bg-surface-muted border border-border list-disc pl-5 space-y-1 text-secondary">
                      {meeting.detailedNotes.blockers.map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-3 rounded-md bg-surface-muted border border-border text-tertiary">
                      No blockers noted.
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <span className="font-semibold text-primary block text-xs mb-1">Commitments Made</span>
                  {meeting.detailedNotes?.commitments && meeting.detailedNotes.commitments.length > 0 ? (
                    <ul className="p-3 rounded-md bg-surface-muted border border-border list-disc pl-5 space-y-1 text-secondary">
                      {meeting.detailedNotes.commitments.map((c, idx) => (
                        <li key={idx}>{c}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-3 rounded-md bg-surface-muted border border-border text-tertiary">
                      No commitments recorded.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-primary mb-1">Summary</label>
                <textarea
                  rows={3}
                  value={notesSummary}
                  onChange={(e) => setNotesSummary(e.target.value)}
                  className="w-full text-xs bg-surface border border-border rounded-md p-2.5 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-primary mb-1">Information Received</label>
                <textarea
                  rows={2}
                  value={notesInfoReceived}
                  onChange={(e) => setNotesInfoReceived(e.target.value)}
                  className="w-full text-xs bg-surface border border-border rounded-md p-2.5 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">
                    Concerns / Blockers (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={notesBlockers}
                    onChange={(e) => setNotesBlockers(e.target.value)}
                    className="w-full text-xs bg-surface border border-border rounded-md p-2.5 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">
                    Commitments (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={notesCommitments}
                    onChange={(e) => setNotesCommitments(e.target.value)}
                    className="w-full text-xs bg-surface border border-border rounded-md p-2.5 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. DECISIONS */}
      {activeTab === 'decisions' && (
        <div className="bg-surface border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
            <div>
              <h3 className="text-sm font-semibold text-primary">Formal Decision Log</h3>
              <p className="text-xs text-secondary mt-0.5">
                Record accountable decisions reached during the meeting.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddDecisionOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold rounded bg-brand-teal text-white hover:bg-brand-teal/90"
            >
              + Document Decision
            </button>
          </div>

          {(!meeting.formalDecisions || meeting.formalDecisions.length === 0) ? (
            <div className="text-center py-8 text-xs text-secondary">
              No formal decisions documented yet. Click "+ Document Decision" to log formal conclusions.
            </div>
          ) : (
            <div className="space-y-2.5">
              {meeting.formalDecisions.map((dec) => (
                <div key={dec.id} className="p-3.5 rounded-md bg-surface-muted border border-border">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-primary leading-snug">{dec.decisionText}</p>
                    <span className="text-[10px] uppercase font-bold text-brand-teal tracking-wider bg-brand-teal/10 px-2 py-0.5 rounded">
                      Decision
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-tertiary mt-2">
                    {dec.responsiblePersonId && (
                      <span>Accountable: {getMemberName(dec.responsiblePersonId)}</span>
                    )}
                    {dec.dueDate && <span>Effective: {formatMeetingDate(dec.dueDate)}</span>}
                    <span>Recorded: {formatMeetingDate(dec.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. ACTION ITEMS (Convertible to Tasks) */}
      {activeTab === 'action_items' && (
        <div className="bg-surface border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
            <div>
              <h3 className="text-sm font-semibold text-primary">Convertible Action Items</h3>
              <p className="text-xs text-secondary mt-0.5">
                Each action item can be converted into a real tracked Task via TasksService with one click.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddActionOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold rounded bg-brand-teal text-white hover:bg-brand-teal/90"
            >
              + Add Action Item
            </button>
          </div>

          {(!meeting.actionItems || meeting.actionItems.length === 0) ? (
            <div className="text-center py-8 text-xs text-secondary">
              No action items captured yet. Click "+ Add Action Item" to assign follow-up tasks.
            </div>
          ) : (
            <div className="space-y-3">
              {meeting.actionItems.map((item) => {
                const isConverted = item.status === 'CONVERTED';
                const priorityConfig = PRIORITY_CONFIG[item.priority || TaskPriority.MEDIUM];

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-md bg-surface-muted border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-primary">{item.description}</span>
                        {item.priority && (
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${priorityConfig.badgeClass}`}
                          >
                            {priorityConfig.label}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-tertiary">
                        <span>Assignee: {getMemberName(item.assignedMemberId)}</span>
                        {item.dueDate && <span>Due: {formatMeetingDate(item.dueDate)}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {isConverted ? (
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 text-xs font-semibold rounded bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                            Converted to Task
                          </span>
                          <Link
                            to="/app/tasks"
                            className="px-2.5 py-1 text-xs font-medium text-brand-teal underline"
                          >
                            View in Tasks
                          </Link>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => convertActionMutation.mutate({ actionItemId: item.id })}
                          disabled={convertActionMutation.isPending}
                          className="px-3 py-1.5 text-xs font-semibold rounded bg-brand-teal text-white hover:bg-brand-teal/90 disabled:opacity-50"
                        >
                          {convertActionMutation.isPending ? 'Converting...' : 'Convert to Task'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 7. ATTACHMENTS */}
      {activeTab === 'attachments' && (
        <div className="bg-surface border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
            <div>
              <h3 className="text-sm font-semibold text-primary">Meeting Documents & Attachments</h3>
              <p className="text-xs text-secondary mt-0.5">
                Slide decks, review files, contracts, and supporting operational materials.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddAttachmentOpen(!isAddAttachmentOpen)}
              className="px-3 py-1.5 text-xs font-semibold rounded bg-brand-teal text-white hover:bg-brand-teal/90"
            >
              + Attach Document
            </button>
          </div>

          {isAddAttachmentOpen && (
            <form onSubmit={handleAddAttachment} className="p-3 mb-4 rounded bg-surface-muted border border-border flex gap-2">
              <input
                type="text"
                required
                placeholder="Document Name (e.g. Q4_Agreement.pdf)"
                value={newAttachmentName}
                onChange={(e) => setNewAttachmentName(e.target.value)}
                className="flex-1 text-xs bg-surface border border-border rounded px-3 py-1.5 text-primary"
              />
              <input
                type="text"
                placeholder="URL or asset path (optional)"
                value={newAttachmentUrl}
                onChange={(e) => setNewAttachmentUrl(e.target.value)}
                className="flex-1 text-xs bg-surface border border-border rounded px-3 py-1.5 text-primary"
              />
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-semibold rounded bg-brand-teal text-white"
              >
                Save
              </button>
            </form>
          )}

          {(!meeting.attachments || meeting.attachments.length === 0) ? (
            <div className="text-center py-8 text-xs text-secondary">
              No files attached to this meeting.
            </div>
          ) : (
            <div className="space-y-2">
              {meeting.attachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center justify-between p-3 rounded-md bg-surface-muted border border-border"
                >
                  <div className="flex items-center gap-2.5">
                    <svg className="w-5 h-5 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <div>
                      <span className="text-xs font-semibold text-primary">{att.name}</span>
                      <div className="text-[10px] text-tertiary">
                        {att.size || 'File'} • Uploaded {formatMeetingDate(att.uploadedAt || '')}
                      </div>
                    </div>
                  </div>
                  <a
                    href={att.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 text-xs font-medium text-brand-teal hover:underline"
                  >
                    Download / View
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 8. OUTCOME & FOLLOW-UP */}
      {activeTab === 'outcome' && (
        <div className="bg-surface border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
            <div>
              <h3 className="text-sm font-semibold text-primary">Meeting Outcome & Next Steps</h3>
              <p className="text-xs text-secondary mt-0.5">
                Session closure summary, agreed follow-up dates, and CRM pipeline sync.
              </p>
            </div>
            {!isEditingOutcome ? (
              <button
                type="button"
                onClick={() => setIsEditingOutcome(true)}
                className="px-3 py-1.5 text-xs font-semibold rounded bg-surface-muted text-secondary hover:text-primary border border-border"
              >
                Edit Outcome
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingOutcome(false)}
                  className="px-3 py-1.5 text-xs font-medium text-secondary hover:text-primary bg-surface border border-border rounded"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveOutcome}
                  className="px-3 py-1.5 text-xs font-semibold rounded bg-brand-teal text-white hover:bg-brand-teal/90"
                >
                  Save Outcome
                </button>
              </div>
            )}
          </div>

          {!isEditingOutcome ? (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-md bg-surface-muted border border-border">
                <span className="font-semibold text-primary block text-xs mb-1">Outcome Summary</span>
                <p className="text-secondary leading-relaxed">
                  {meeting.outcome?.outcomeSummary || 'No formal outcome summary logged yet.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-md bg-surface-muted border border-border">
                  <span className="font-semibold text-primary block text-xs mb-1">Next Immediate Steps</span>
                  <p className="text-secondary leading-relaxed">
                    {meeting.outcome?.nextSteps || 'None documented.'}
                  </p>
                </div>
                <div className="p-3.5 rounded-md bg-surface-muted border border-border">
                  <span className="font-semibold text-primary block text-xs mb-1">CRM Pipeline Note</span>
                  <p className="text-secondary leading-relaxed">
                    {meeting.outcome?.crmUpdateNote || 'No CRM update note provided.'}
                  </p>
                </div>
                <div className="p-3.5 rounded-md bg-surface-muted border border-border">
                  <span className="font-semibold text-primary block text-xs mb-1">Next Follow-up Date</span>
                  <p className="text-secondary font-medium">
                    {meeting.outcome?.nextFollowUpDate
                      ? formatMeetingDate(meeting.outcome.nextFollowUpDate)
                      : 'Not scheduled'}
                  </p>
                </div>
                <div className="p-3.5 rounded-md bg-surface-muted border border-border">
                  <span className="font-semibold text-primary block text-xs mb-1">Next Meeting Date</span>
                  <p className="text-secondary font-medium">
                    {meeting.outcome?.nextMeetingDate
                      ? formatMeetingDate(meeting.outcome.nextMeetingDate)
                      : 'Not scheduled'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-primary mb-1">Outcome Summary</label>
                <textarea
                  rows={2}
                  value={outcomeSummary}
                  onChange={(e) => setOutcomeSummary(e.target.value)}
                  className="w-full text-xs bg-surface border border-border rounded-md p-2.5 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-primary mb-1">Next Immediate Steps</label>
                <textarea
                  rows={2}
                  value={outcomeNextSteps}
                  onChange={(e) => setOutcomeNextSteps(e.target.value)}
                  className="w-full text-xs bg-surface border border-border rounded-md p-2.5 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">Next Follow-up Date</label>
                  <input
                    type="date"
                    value={outcomeFollowUpDate}
                    onChange={(e) => setOutcomeFollowUpDate(e.target.value)}
                    className="w-full text-xs bg-surface border border-border rounded-md p-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">Next Meeting Date</label>
                  <input
                    type="date"
                    value={outcomeNextMeetingDate}
                    onChange={(e) => setOutcomeNextMeetingDate(e.target.value)}
                    className="w-full text-xs bg-surface border border-border rounded-md p-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-primary mb-1">CRM Update Note</label>
                <input
                  type="text"
                  value={outcomeCrmNote}
                  onChange={(e) => setOutcomeCrmNote(e.target.value)}
                  className="w-full text-xs bg-surface border border-border rounded-md p-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* 9. AUDIT HISTORY */}
      {activeTab === 'history' && (
        <div className="bg-surface border border-border rounded-lg p-5 space-y-4">
          <h3 className="text-sm font-semibold text-primary border-b border-border pb-2">
            Schedule Changes & Audit Activity
          </h3>

          {/* Reschedule History */}
          <div>
            <h4 className="text-xs font-semibold text-primary mb-2">Reschedule Events</h4>
            {meeting.rescheduleHistory.length === 0 ? (
              <div className="p-3 text-xs text-secondary bg-surface-muted rounded-md border border-border">
                No reschedule events recorded. Meeting has remained on original schedule.
              </div>
            ) : (
              <div className="space-y-2">
                {meeting.rescheduleHistory.map((rh) => (
                  <div key={rh.id} className="p-3 rounded-md bg-surface-muted border border-border text-xs">
                    <div className="flex items-center justify-between text-secondary">
                      <span className="font-semibold text-primary">Shifted Schedule</span>
                      <span>{formatMeetingDate(rh.timestamp)}</span>
                    </div>
                    <div className="text-tertiary mt-1">
                      From: {rh.oldPlannedStart ? rh.oldPlannedStart.slice(0, 16) : '—'} → To: {rh.newPlannedStart ? rh.newPlannedStart.slice(0, 16) : '—'}
                    </div>
                    <div className="text-primary mt-1 font-medium">Reason: {rh.reason}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity Log */}
          <div>
            <h4 className="text-xs font-semibold text-primary mb-2">Operational Activity</h4>
            <div className="space-y-2">
              {(meeting.activity || []).map((act) => (
                <div key={act.id} className="p-2.5 rounded-md bg-surface-muted border border-border text-xs flex justify-between">
                  <div>
                    <span className="font-semibold text-primary">{act.action}</span>
                    {act.details && <div className="text-secondary text-[11px] mt-0.5">{act.details}</div>}
                  </div>
                  <span className="text-[10px] text-tertiary">{formatMeetingDate(act.timestamp)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <RescheduleMeetingModal
        isOpen={isRescheduleOpen}
        meeting={meeting}
        onClose={() => setIsRescheduleOpen(false)}
        onSubmit={async (_, dto) => {
          await rescheduleMutation.mutateAsync(dto);
        }}
      />

      <AddActionItemDialog
        isOpen={isAddActionOpen}
        onClose={() => setIsAddActionOpen(false)}
        onSubmit={handleAddActionItem}
      />

      <AddDecisionDialog
        isOpen={isAddDecisionOpen}
        onClose={() => setIsAddDecisionOpen(false)}
        onSubmit={handleAddDecision}
      />

      <AddAgendaTopicDialog
        isOpen={isAddAgendaOpen}
        onClose={() => setIsAddAgendaOpen(false)}
        onSubmit={handleAddAgendaTopic}
      />
    </div>
  );
};
export default MeetingDetailPage;
