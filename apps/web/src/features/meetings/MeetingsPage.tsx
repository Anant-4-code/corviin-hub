import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '@/lib/store';
import { fetchMeetings, createMeeting, rescheduleMeeting } from '@/services/meetings';
import type { MeetingItem, CreateMeetingDto, RescheduleMeetingDto } from '@corviin-hub/shared';
import { MeetingsHeader } from './components/MeetingsHeader';
import { MeetingsSummaryStrip } from './components/MeetingsSummaryStrip';
import { MeetingsFilterToolbar } from './components/MeetingsFilterToolbar';
import { MeetingsTableView } from './components/MeetingsTableView';
import { MeetingsGroupedView } from './components/MeetingsGroupedView';
import { MeetingsAgendaView } from './components/MeetingsAgendaView';
import { UpcomingMeetingsPanel } from './components/UpcomingMeetingsPanel';
import { MeetingActionItemsRegister } from './components/MeetingActionItemsRegister';
import { MeetingRecentActivityFeed } from './components/MeetingRecentActivityFeed';
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
  const [viewMode, setViewMode] = useState<'table' | 'grouped' | 'agenda'>('table');

  // Modals state
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [reschedulingMeeting, setReschedulingMeeting] = useState<MeetingItem | null>(null);

  // Fetch meetings for current workspace
  const {
    data: meetings = [],
    isLoading,
    isFetching,
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
      setIsScheduleOpen(false);
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
      setReschedulingMeeting(null);
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

  const handleFilterSelect = (filter: { status?: string; dateFilter?: string }) => {
    if (filter.status !== undefined) setSelectedStatus(filter.status);
    if (filter.dateFilter !== undefined) setDateFilter(filter.dateFilter);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 pb-16">
      {/* 1. Page Header */}
      <MeetingsHeader
        onScheduleClick={() => setIsScheduleOpen(true)}
        onDateFilterSelect={setDateFilter}
        activeDateFilter={dateFilter}
        onRefresh={() => queryClient.invalidateQueries({ queryKey: ['meetings', selectedWorkspaceId] })}
        isRefreshing={isFetching}
      />

      {/* 2. Operational 6-KPI Summary Strip */}
      <MeetingsSummaryStrip
        meetings={meetings}
        activeStatus={selectedStatus}
        activeDateFilter={dateFilter}
        onFilterSelect={handleFilterSelect}
      />

      {/* 3. Upcoming Priority Sessions Panel */}
      <UpcomingMeetingsPanel
        meetings={filteredMeetings}
        onRescheduleClick={(m) => setReschedulingMeeting(m)}
      />

      {/* 4. Filter & Search Toolbar */}
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
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalCount={meetings.length}
        filteredCount={filteredMeetings.length}
      />

      {/* 5. Main Meetings Content (Table / Grouped / Agenda) */}
      {isLoading ? (
        <div className="p-12 text-center text-sm text-secondary bg-surface border border-border rounded-md">
          Loading workspace meetings...
        </div>
      ) : error ? (
        <div className="p-12 text-center text-sm text-rose-600 bg-surface border border-border rounded-md">
          Failed to load meetings. Please check connection.
        </div>
      ) : (
        <div>
          {viewMode === 'table' && (
            <MeetingsTableView
              meetings={filteredMeetings}
              onRescheduleClick={(m) => setReschedulingMeeting(m)}
            />
          )}

          {viewMode === 'grouped' && (
            <MeetingsGroupedView
              meetings={filteredMeetings}
              onRescheduleClick={(m) => setReschedulingMeeting(m)}
            />
          )}

          {viewMode === 'agenda' && (
            <MeetingsAgendaView
              meetings={filteredMeetings}
              onRescheduleClick={(m) => setReschedulingMeeting(m)}
            />
          )}
        </div>
      )}

      {/* 6. Operational Panels: Action Items Register & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        <MeetingActionItemsRegister
          meetings={filteredMeetings}
          workspaceId={selectedWorkspaceId}
        />
        <MeetingRecentActivityFeed
          meetings={filteredMeetings}
        />
      </div>

      {/* 7. Dialogs */}
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
