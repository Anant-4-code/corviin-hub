import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CalendarViewMode,
  CalendarItemDto,
  CreateCampaignDto,
  CreateContentEventDto,
} from '@corviin-hub/shared';
import { useAppStore } from '@/lib/store';
import {
  fetchContentCalendar,
  rescheduleCalendarEvent,
  markCalendarEventPublished,
} from '@/services/calendar';
import {
  fetchCampaigns,
  createCampaign,
  createCampaignContentEvent,
} from '@/services/campaigns';
import { CalendarSummaryStrip } from './components/CalendarSummaryStrip';
import { CalendarHeaderControls } from './components/CalendarHeaderControls';
import { CalendarFilterToolbar } from './components/CalendarFilterToolbar';
import { CalendarMonthGrid } from './components/CalendarMonthGrid';
import { CalendarWeekGrid } from './components/CalendarWeekGrid';
import { CalendarDayGrid } from './components/CalendarDayGrid';
import { CalendarAgendaView } from './components/CalendarAgendaView';
import { CalendarEventDrawer } from './components/CalendarEventDrawer';
import { RescheduleEventDialog } from './components/RescheduleEventDialog';
import { MarkPublishedDialog } from './components/MarkPublishedDialog';
import { CreateContentEventDialog } from './components/CreateContentEventDialog';
import { CreateCampaignDialog } from './components/CreateCampaignDialog';
import { CreateLinkedTaskModal } from './components/CreateLinkedTaskModal';
import { LoadingState, ErrorState } from '@/components/ui/States';

export function CalendarContentPage() {
  const queryClient = useQueryClient();
  const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId) || 'ws-tech-0001-0000-000000000001';

  // Responsive default: Mobile (< 768px) defaults to AGENDA; desktop defaults to MONTH
  const [viewMode, setViewMode] = useState<CalendarViewMode>(() =>
    typeof window !== 'undefined' && window.innerWidth < 768 ? 'AGENDA' : 'MONTH',
  );

  const [currentDate, setCurrentDate] = useState<Date>(new Date('2026-11-05T09:00:00.000Z'));

  // Filters
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const [selectedOwnerId, setSelectedOwnerId] = useState('');
  const [selectedEventType, setSelectedEventType] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Selected item and dialogs
  const [selectedItem, setSelectedItem] = useState<CalendarItemDto | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [rescheduleTargetItem, setRescheduleTargetItem] = useState<CalendarItemDto | null>(null);
  const [publishTargetItem, setPublishTargetItem] = useState<CalendarItemDto | null>(null);
  const [linkedTaskTargetItem, setLinkedTaskTargetItem] = useState<CalendarItemDto | null>(null);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false);

  // Queries
  const {
    data: calendarData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      'calendar-content',
      selectedWorkspaceId,
      selectedCampaignId,
      selectedOwnerId,
      selectedEventType,
      selectedPlatform,
      selectedStatus,
    ],
    queryFn: () =>
      fetchContentCalendar({
        workspaceId: selectedWorkspaceId,
        campaignId: selectedCampaignId || undefined,
        ownerId: selectedOwnerId || undefined,
        eventType: selectedEventType || undefined,
        platform: selectedPlatform || undefined,
        status: selectedStatus || undefined,
      }),
  });

  const { data: campaigns = [] } = useQuery({
    queryKey: ['campaigns', selectedWorkspaceId],
    queryFn: () => fetchCampaigns(selectedWorkspaceId),
  });

  // Navigation handlers
  const handlePrev = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (viewMode === 'MONTH') d.setMonth(d.getMonth() - 1);
      else if (viewMode === 'WEEK') d.setDate(d.getDate() - 7);
      else if (viewMode === 'DAY') d.setDate(d.getDate() - 1);
      else d.setMonth(d.getMonth() - 1);
      return d;
    });
  };

  const handleNext = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (viewMode === 'MONTH') d.setMonth(d.getMonth() + 1);
      else if (viewMode === 'WEEK') d.setDate(d.getDate() + 7);
      else if (viewMode === 'DAY') d.setDate(d.getDate() + 1);
      else d.setMonth(d.getMonth() + 1);
      return d;
    });
  };

  const handleToday = () => {
    setCurrentDate(new Date('2026-11-05T09:00:00.000Z'));
  };

  const handleClearFilters = () => {
    setSelectedCampaignId('');
    setSelectedOwnerId('');
    setSelectedEventType('');
    setSelectedPlatform('');
    setSelectedStatus('');
  };

  // Item selection & Drawer
  const handleSelectItem = (item: CalendarItemDto) => {
    setSelectedItem(item);
    setIsDrawerOpen(true);
  };

  // Reschedule mutation
  const rescheduleMutation = useMutation({
    mutationFn: async ({ eventId, newDate, reason }: { eventId: string; newDate: string; reason: string }) => {
      await rescheduleCalendarEvent(selectedWorkspaceId, eventId, { newDate, reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-content'] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });

  // Mark published mutation
  const markPublishedMutation = useMutation({
    mutationFn: async ({ eventId, actualDate, publicUrl }: { eventId: string; actualDate: string; publicUrl: string }) => {
      await markCalendarEventPublished(selectedWorkspaceId, eventId, {
        actualPublishDate: actualDate,
        publicUrl,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-content'] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });

  // Create campaign mutation
  const createCampaignMutation = useMutation({
    mutationFn: (dto: CreateCampaignDto) => createCampaign(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-content'] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });

  // Create content event mutation
  const createContentEventMutation = useMutation({
    mutationFn: ({ campaignId, dto }: { campaignId: string; dto: Omit<CreateContentEventDto, 'campaignId'> }) =>
      createCampaignContentEvent(campaignId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-content'] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });

  if (isLoading) {
    return (
      <div className="py-12">
        <LoadingState message="Loading production schedule & calendar items..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-12">
        <ErrorState
          title="Failed to Load Production Calendar"
          message={error instanceof Error ? error.message : 'An unexpected network error occurred.'}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const items = calendarData?.items || [];
  const metrics = calendarData?.metrics || {
    totalItems: 0,
    scheduledPosts: 0,
    publishedPosts: 0,
    overdueItems: 0,
    activeCampaigns: 0,
  };

  return (
    <div className="space-y-4">
      {/* 1. Metrics Strip */}
      <CalendarSummaryStrip metrics={metrics} />

      {/* 2. Calendar Header Controls */}
      <CalendarHeaderControls
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        currentDate={currentDate}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onOpenCreateEvent={() => setIsCreateEventOpen(true)}
        onOpenCreateCampaign={() => setIsCreateCampaignOpen(true)}
      />

      {/* 3. Filters Toolbar */}
      <CalendarFilterToolbar
        campaigns={campaigns}
        selectedCampaignId={selectedCampaignId}
        onCampaignChange={setSelectedCampaignId}
        selectedOwnerId={selectedOwnerId}
        onOwnerChange={setSelectedOwnerId}
        selectedEventType={selectedEventType}
        onEventTypeChange={setSelectedEventType}
        selectedPlatform={selectedPlatform}
        onPlatformChange={setSelectedPlatform}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        onClearFilters={handleClearFilters}
      />

      {/* 4. Active Calendar View */}
      {viewMode === 'MONTH' && (
        <CalendarMonthGrid
          currentDate={currentDate}
          items={items}
          onSelectItem={handleSelectItem}
        />
      )}

      {viewMode === 'WEEK' && (
        <CalendarWeekGrid
          currentDate={currentDate}
          items={items}
          onSelectItem={handleSelectItem}
        />
      )}

      {viewMode === 'DAY' && (
        <CalendarDayGrid
          currentDate={currentDate}
          items={items}
          onSelectItem={handleSelectItem}
          onReschedule={(item) => setRescheduleTargetItem(item)}
          onMarkPublished={(item) => setPublishTargetItem(item)}
        />
      )}

      {viewMode === 'AGENDA' && (
        <CalendarAgendaView
          items={items}
          onSelectItem={handleSelectItem}
          onReschedule={(item) => setRescheduleTargetItem(item)}
          onMarkPublished={(item) => setPublishTargetItem(item)}
        />
      )}

      {/* 5. Detail Slide-over Drawer */}
      <CalendarEventDrawer
        item={selectedItem}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenReschedule={(item) => {
          setIsDrawerOpen(false);
          setRescheduleTargetItem(item);
        }}
        onOpenMarkPublished={(item) => {
          setIsDrawerOpen(false);
          setPublishTargetItem(item);
        }}
        onOpenCreateTask={(item) => {
          setIsDrawerOpen(false);
          setLinkedTaskTargetItem(item);
        }}
      />

      {/* 6. Reschedule Modal */}
      <RescheduleEventDialog
        item={rescheduleTargetItem}
        open={Boolean(rescheduleTargetItem)}
        onClose={() => setRescheduleTargetItem(null)}
        onReschedule={async (eventId, newDate, reason) => {
          await rescheduleMutation.mutateAsync({ eventId, newDate, reason });
        }}
      />

      {/* 7. Mark Published Modal */}
      <MarkPublishedDialog
        item={publishTargetItem}
        open={Boolean(publishTargetItem)}
        onClose={() => setPublishTargetItem(null)}
        onMarkPublished={async (eventId, actualDate, publicUrl) => {
          await markPublishedMutation.mutateAsync({ eventId, actualDate, publicUrl });
        }}
      />

      {/* 8. Add Milestone Modal */}
      <CreateContentEventDialog
        campaigns={campaigns}
        open={isCreateEventOpen}
        onClose={() => setIsCreateEventOpen(false)}
        onCreate={async (campaignId, dto) => {
          await createContentEventMutation.mutateAsync({ campaignId, dto });
        }}
      />

      {/* 9. Create Campaign Modal */}
      <CreateCampaignDialog
        open={isCreateCampaignOpen}
        onClose={() => setIsCreateCampaignOpen(false)}
        onCreate={async (dto) => {
          await createCampaignMutation.mutateAsync(dto);
        }}
      />

      {/* 10. Create Linked Task Modal */}
      <CreateLinkedTaskModal
        item={linkedTaskTargetItem}
        open={Boolean(linkedTaskTargetItem)}
        onClose={() => setLinkedTaskTargetItem(null)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['calendar-content'] });
          queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }}
      />
    </div>
  );
}
