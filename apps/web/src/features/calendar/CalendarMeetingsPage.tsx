import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CalendarViewMode,
  MeetingVisitCalendarItemDto,
  MeetingItem,
  SiteVisitItem,
  CreateMeetingDto,
  CreateSiteVisitDto,
  MeetingStatus,
  MeetingCategory,
} from '@corviin-hub/shared';
import { useAppStore } from '@/lib/store';
import { useProfiles } from '@/hooks/useProfiles';
import { fetchMeetingsCalendar } from '@/services/calendar';
import {
  createMeeting,
  updateMeeting,
  rescheduleMeeting,
  createSiteVisit,
  updateSiteVisit,
  rescheduleSiteVisit,
  fetchMeetingById,
  fetchSiteVisitById,
} from '@/services/meetings';
import { MeetingsSummaryStrip } from './components/MeetingsSummaryStrip';
import { MeetingsDateControls } from './components/MeetingsDateControls';
import { MeetingsFilterToolbar } from './components/MeetingsFilterToolbar';
import { MeetingsAgendaView } from './components/MeetingsAgendaView';
import { MeetingsMonthGrid } from './components/MeetingsMonthGrid';
import { MeetingsWeekGrid } from './components/MeetingsWeekGrid';
import { MeetingVisitDetailDrawer } from './components/MeetingVisitDetailDrawer';
import { ScheduleMeetingDialog } from './components/ScheduleMeetingDialog';
import { ScheduleSiteVisitDialog } from './components/ScheduleSiteVisitDialog';
import { RescheduleMeetingDialog } from './components/RescheduleMeetingDialog';
import { LoadingState, ErrorState } from '@/components/ui/States';

export function CalendarMeetingsPage() {
  const queryClient = useQueryClient();
  const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId) || 'ws-tech-0001-0000-000000000001';
  const selectedProfileId = useAppStore((s) => s.selectedProfileId);
  const { data: profiles = [] } = useProfiles();

  // Navigation State
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date('2026-11-05T00:00:00'));
  const [viewMode, setViewMode] = useState<CalendarViewMode>('AGENDA');

  // Filters State
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [memberFilter, setMemberFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Dialog & Drawer States
  const [selectedItem, setSelectedItem] = useState<MeetingVisitCalendarItemDto | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState<MeetingVisitCalendarItemDto | null>(null);
  const [isScheduleMeetingOpen, setIsScheduleMeetingOpen] = useState(false);
  const [isScheduleSiteVisitOpen, setIsScheduleSiteVisitOpen] = useState(false);

  // Fetch Calendar Data
  const {
    data: calendarData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      'calendar-meetings',
      selectedWorkspaceId,
      categoryFilter,
      statusFilter,
      memberFilter,
    ],
    queryFn: () =>
      fetchMeetingsCalendar({
        workspaceId: selectedWorkspaceId,
        category: categoryFilter || undefined,
        status: statusFilter || undefined,
        memberId: memberFilter || undefined,
      }),
  });

  // Fetch Full Details when an item is selected
  const { data: fullMeetingDetails, refetch: refetchMeetingDetails } = useQuery({
    queryKey: ['meeting-detail', selectedWorkspaceId, selectedItem?.sourceId],
    queryFn: () =>
      selectedItem && selectedItem.sourceType === 'MEETING'
        ? fetchMeetingById(selectedWorkspaceId, selectedItem.sourceId)
        : null,
    enabled: Boolean(selectedItem && selectedItem.sourceType === 'MEETING'),
  });

  const { data: fullSiteVisitDetails, refetch: refetchSiteVisitDetails } = useQuery({
    queryKey: ['site-visit-detail', selectedWorkspaceId, selectedItem?.sourceId],
    queryFn: () =>
      selectedItem && selectedItem.sourceType === 'SITE_VISIT'
        ? fetchSiteVisitById(selectedWorkspaceId, selectedItem.sourceId)
        : null,
    enabled: Boolean(selectedItem && selectedItem.sourceType === 'SITE_VISIT'),
  });

  // Navigation handlers
  const handlePrev = () => {
    const next = new Date(currentDate);
    if (viewMode === 'MONTH') {
      next.setMonth(next.getMonth() - 1);
    } else if (viewMode === 'WEEK') {
      next.setDate(next.getDate() - 7);
    } else {
      next.setDate(next.getDate() - 1);
    }
    setCurrentDate(next);
  };

  const handleNext = () => {
    const next = new Date(currentDate);
    if (viewMode === 'MONTH') {
      next.setMonth(next.getMonth() + 1);
    } else if (viewMode === 'WEEK') {
      next.setDate(next.getDate() + 7);
    } else {
      next.setDate(next.getDate() + 1);
    }
    setCurrentDate(next);
  };

  const handleToday = () => {
    setCurrentDate(new Date('2026-11-05T00:00:00'));
  };

  // Actions
  const handleSelectItem = (item: MeetingVisitCalendarItemDto) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  const handleOpenReschedule = (item: MeetingVisitCalendarItemDto) => {
    setRescheduleTarget(item);
  };

  const handleConfirmReschedule = async (
    newStartTime: string,
    newEndTime: string,
    reason: string,
  ) => {
    if (!rescheduleTarget) return;

    if (rescheduleTarget.sourceType === 'MEETING') {
      await rescheduleMeeting(selectedWorkspaceId, rescheduleTarget.sourceId, {
        newStartTime,
        newEndTime,
        reason,
        actorId: selectedProfileId || 'acting-profile',
      });
    } else {
      await rescheduleSiteVisit(selectedWorkspaceId, rescheduleTarget.sourceId, {
        newStartTime,
        newEndTime,
        reason,
        actorId: selectedProfileId || 'acting-profile',
      });
    }

    await queryClient.invalidateQueries({ queryKey: ['calendar-meetings'] });
    if (selectedItem?.sourceId === rescheduleTarget.sourceId) {
      if (rescheduleTarget.sourceType === 'MEETING') refetchMeetingDetails();
      else refetchSiteVisitDetails();
    }
  };

  const handleScheduleMeeting = async (dto: CreateMeetingDto) => {
    await createMeeting(dto);
    await queryClient.invalidateQueries({ queryKey: ['calendar-meetings'] });
  };

  const handleScheduleSiteVisit = async (dto: CreateSiteVisitDto) => {
    await createSiteVisit(dto);
    await queryClient.invalidateQueries({ queryKey: ['calendar-meetings'] });
  };

  const handleStatusUpdate = async (newStatus: MeetingStatus) => {
    if (!selectedItem) return;

    if (selectedItem.sourceType === 'MEETING') {
      await updateMeeting(selectedWorkspaceId, selectedItem.sourceId, {
        status: newStatus,
      });
      refetchMeetingDetails();
    } else {
      await updateSiteVisit(selectedWorkspaceId, selectedItem.sourceId, {
        status: newStatus,
      });
      refetchSiteVisitDetails();
    }

    await queryClient.invalidateQueries({ queryKey: ['calendar-meetings'] });
    setIsDetailOpen(false);
  };

  const handleActionItemConverted = async () => {
    refetchMeetingDetails();
    await queryClient.invalidateQueries({ queryKey: ['calendar-meetings'] });
  };

  // Filter items by client-side search query
  const rawItems = calendarData?.items || [];
  const filteredItems = searchQuery
    ? rawItems.filter((i) => {
        const q = searchQuery.toLowerCase();
        return (
          i.title.toLowerCase().includes(q) ||
          (i.buyerName && i.buyerName.toLowerCase().includes(q)) ||
          (i.projectName && i.projectName.toLowerCase().includes(q)) ||
          (i.location && i.location.toLowerCase().includes(q))
        );
      })
    : rawItems;

  const defaultMetrics = {
    totalScheduled: 0,
    onlineMeetingsCount: 0,
    siteVisitsCount: 0,
    completedCount: 0,
    cancelledOrNoShowCount: 0,
  };

  return (
    <div className="space-y-4">
      {/* 1. Metrics Strip */}
      <MeetingsSummaryStrip metrics={calendarData?.metrics || defaultMetrics} />

      {/* 2. Date Navigation & Actions Controls */}
      <MeetingsDateControls
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        currentDate={currentDate}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onOpenScheduleMeeting={() => setIsScheduleMeetingOpen(true)}
        onOpenScheduleSiteVisit={() => setIsScheduleSiteVisitOpen(true)}
      />

      {/* 3. Filter Toolbar */}
      <MeetingsFilterToolbar
        category={categoryFilter}
        onCategoryChange={setCategoryFilter}
        status={statusFilter}
        onStatusChange={setStatusFilter}
        memberId={memberFilter}
        onMemberIdChange={setMemberFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        members={profiles}
        onReset={() => {
          setCategoryFilter('');
          setStatusFilter('');
          setMemberFilter('');
          setSearchQuery('');
        }}
      />

      {/* 4. Calendar Views */}
      {isLoading ? (
        <LoadingState message="Loading meetings and site visits schedule..." />
      ) : isError ? (
        <ErrorState
          title="Failed to load meetings calendar"
          message="Could not load calendar schedule for this workspace."
          onRetry={() => refetch()}
        />
      ) : viewMode === 'AGENDA' || viewMode === 'DAY' ? (
        <MeetingsAgendaView
          items={filteredItems}
          onSelectItem={handleSelectItem}
          onRescheduleItem={handleOpenReschedule}
        />
      ) : viewMode === 'WEEK' ? (
        <MeetingsWeekGrid
          currentDate={currentDate}
          items={filteredItems}
          onSelectItem={handleSelectItem}
        />
      ) : (
        <MeetingsMonthGrid
          currentDate={currentDate}
          items={filteredItems}
          onSelectItem={handleSelectItem}
        />
      )}

      {/* 5. Detail Drawer */}
      <MeetingVisitDetailDrawer
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        item={selectedItem}
        meetingDetails={fullMeetingDetails}
        siteVisitDetails={fullSiteVisitDetails}
        workspaceId={selectedWorkspaceId}
        onReschedule={handleOpenReschedule}
        onStatusUpdate={handleStatusUpdate}
        onActionItemConverted={handleActionItemConverted}
      />

      {/* 6. Schedule Meeting Dialog */}
      <ScheduleMeetingDialog
        open={isScheduleMeetingOpen}
        onClose={() => setIsScheduleMeetingOpen(false)}
        workspaceId={selectedWorkspaceId}
        members={profiles}
        onSchedule={handleScheduleMeeting}
      />

      {/* 7. Schedule Site Visit Dialog */}
      <ScheduleSiteVisitDialog
        open={isScheduleSiteVisitOpen}
        onClose={() => setIsScheduleSiteVisitOpen(false)}
        workspaceId={selectedWorkspaceId}
        members={profiles}
        onSchedule={handleScheduleSiteVisit}
      />

      {/* 8. Reschedule Meeting or Site Visit Dialog */}
      <RescheduleMeetingDialog
        open={Boolean(rescheduleTarget)}
        onClose={() => setRescheduleTarget(null)}
        item={rescheduleTarget}
        onConfirm={handleConfirmReschedule}
      />
    </div>
  );
}
