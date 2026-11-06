import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '@/lib/store';
import { fetchMeetings, createMeeting, rescheduleMeeting } from '@/services/meetings';
import type { MeetingItem, CreateMeetingDto, RescheduleMeetingDto } from '@corviin-hub/shared';
import { MeetingsSummaryStrip } from './components/MeetingsSummaryStrip';
import { MeetingsFilterToolbar } from './components/MeetingsFilterToolbar';
import { MeetingsTableView } from './components/MeetingsTableView';
import { ScheduleMeetingDialog } from './components/ScheduleMeetingDialog';
import { RescheduleMeetingModal } from './components/RescheduleMeetingModal';

export const MeetingsPage: React.FC = () => {
  const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId) || 'ws-tech-0001-0000-000000000001';
  const queryClient = useQueryClient();

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedMember, setSelectedMember] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');

  // Modals state
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [reschedulingMeeting, setReschedulingMeeting] = useState<MeetingItem | null>(null);

  // Fetch meetings for current workspace
  const {
    data: meetings = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['meetings', selectedWorkspaceId],
    queryFn: async () => {
      if (!selectedWorkspaceId) return [];
      return fetchMeetings(selectedWorkspaceId);
    },
    enabled: Boolean(selectedWorkspaceId),
  });

  // Create meeting mutation
  const createMeetingMutation = useMutation({
    mutationFn: async (dto: CreateMeetingDto) => {
      return createMeeting(dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings', selectedWorkspaceId] });
    },
  });

  // Reschedule meeting mutation
  const rescheduleMutation = useMutation({
    mutationFn: async ({ meetingId, dto }: { meetingId: string; dto: RescheduleMeetingDto }) => {
      if (!selectedWorkspaceId) return;
      return rescheduleMeeting(selectedWorkspaceId, meetingId, dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings', selectedWorkspaceId] });
    },
  });

  // Filter & Search Logic
  const filteredMeetings = useMemo(() => {
    return meetings.filter((meeting) => {
      // Category / Type filter
      if (selectedCategory !== 'ALL' && meeting.category !== selectedCategory) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'ALL' && meeting.status !== selectedStatus) {
        return false;
      }

      // Member / Organiser filter
      if (selectedMember !== 'ALL') {
        const isOrganiser = meeting.organiserId === selectedMember;
        const isParticipant = (meeting.participantIds || []).includes(selectedMember);
        if (!isOrganiser && !isParticipant) return false;
      }

      // Date Horizon filter
      if (dateFilter !== 'ALL') {
        const todayStr = '2026-11-05';
        const tomorrowStr = '2026-11-06';
        if (dateFilter === 'TODAY' && meeting.date !== todayStr) return false;
        if (dateFilter === 'TOMORROW' && meeting.date !== tomorrowStr) return false;
        if (dateFilter === 'UPCOMING' && meeting.date < todayStr) return false;
        if (dateFilter === 'PAST' && meeting.date >= todayStr) return false;
      }

      // Text Search Query
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const titleMatch = meeting.title.toLowerCase().includes(q);
        const agendaMatch = Boolean(meeting.agenda && meeting.agenda.toLowerCase().includes(q));
        const notesMatch = Boolean(meeting.notes && meeting.notes.toLowerCase().includes(q));
        const extMatch = Boolean(
          meeting.externalParticipants &&
            meeting.externalParticipants.some((ext) => ext.toLowerCase().includes(q)),
        );
        const linkedMatch = Boolean(
          meeting.linkedRecord && meeting.linkedRecord.title.toLowerCase().includes(q),
        );

        if (!titleMatch && !agendaMatch && !notesMatch && !extMatch && !linkedMatch) {
          return false;
        }
      }

      return true;
    });
  }, [meetings, selectedCategory, selectedStatus, selectedMember, dateFilter, searchQuery]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedStatus('ALL');
    setSelectedMember('ALL');
    setDateFilter('ALL');
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-primary">Meetings & Sessions</h1>
          <p className="text-xs text-secondary mt-0.5">
            Operational meeting records with agendas, preparation, discussion minutes, decisions, and convertible action items.
          </p>
        </div>
      </div>

      {/* Summary Strip */}
      <MeetingsSummaryStrip meetings={meetings} />

      {/* Filter Toolbar */}
      <MeetingsFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedMember={selectedMember}
        onMemberChange={setSelectedMember}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        onResetFilters={handleResetFilters}
        onScheduleClick={() => setIsScheduleOpen(true)}
      />

      {/* Table & Mobile Cards */}
      {isLoading ? (
        <div className="p-12 text-center text-sm text-secondary bg-surface border border-border rounded-md">
          Loading workspace meetings...
        </div>
      ) : error ? (
        <div className="p-12 text-center text-sm text-rose-600 bg-surface border border-border rounded-md">
          Failed to load meetings. Please check connection.
        </div>
      ) : (
        <MeetingsTableView
          meetings={filteredMeetings}
          onRescheduleClick={(m) => setReschedulingMeeting(m)}
        />
      )}

      {/* Dialogs */}
      {selectedWorkspaceId && (
        <ScheduleMeetingDialog
          isOpen={isScheduleOpen}
          workspaceId={selectedWorkspaceId}
          onClose={() => setIsScheduleOpen(false)}
          onSubmit={async (dto) => {
            await createMeetingMutation.mutateAsync(dto);
          }}
        />
      )}

      <RescheduleMeetingModal
        isOpen={Boolean(reschedulingMeeting)}
        meeting={reschedulingMeeting}
        onClose={() => setReschedulingMeeting(null)}
        onSubmit={async (meetingId, dto) => {
          await rescheduleMutation.mutateAsync({ meetingId, dto });
        }}
      />
    </div>
  );
};
export default MeetingsPage;
