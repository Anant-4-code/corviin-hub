import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import {
  CalendarItemDto,
  CalendarOverviewMetrics,
  ContentEventType,
  ContentPlatform,
  ContentStatus,
  TaskPriority,
} from '@corviin-hub/shared';
import { CalendarSummaryStrip } from '../features/calendar/components/CalendarSummaryStrip';
import { CalendarItemBadge } from '../features/calendar/components/CalendarItemBadge';
import { CalendarHeaderControls } from '../features/calendar/components/CalendarHeaderControls';
import { CalendarMonthGrid } from '../features/calendar/components/CalendarMonthGrid';
import { CalendarAgendaView } from '../features/calendar/components/CalendarAgendaView';
import { CalendarEventDrawer } from '../features/calendar/components/CalendarEventDrawer';
import { RescheduleEventDialog } from '../features/calendar/components/RescheduleEventDialog';
import { MarkPublishedDialog } from '../features/calendar/components/MarkPublishedDialog';
import { CalendarContentPage } from '../features/calendar/CalendarContentPage';
import * as calendarService from '../services/calendar';
import * as campaignsService from '../services/campaigns';

const mockMetrics: CalendarOverviewMetrics = {
  totalItems: 8,
  scheduledPosts: 3,
  publishedPosts: 2,
  overdueItems: 1,
  activeCampaigns: 2,
};

const mockCalendarItems: CalendarItemDto[] = [
  {
    id: 'cal-cmp-1',
    sourceType: 'CAMPAIGN',
    sourceId: 'cmp-tech-001',
    campaignId: 'cmp-tech-001',
    campaignTitle: 'Corviin CRM v2.0 Launch Video',
    title: 'Campaign Target: Corviin CRM v2.0 Launch Video',
    eventType: ContentEventType.CAMPAIGN_MILESTONE,
    plannedDate: '2026-11-20T17:00:00.000Z',
    ownerId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    status: ContentStatus.IN_PROGRESS,
    platform: ContentPlatform.YOUTUBE,
    isOverdue: false,
    hasRescheduleHistory: false,
    rescheduleCount: 0,
  },
  {
    id: 'cal-ev-101',
    sourceType: 'CONTENT_MILESTONE',
    sourceId: 'ev-tech-101',
    campaignId: 'cmp-tech-001',
    campaignTitle: 'Corviin CRM v2.0 Launch Video',
    title: 'Studio Screen Recording & Voiceover',
    eventType: ContentEventType.RECORDING,
    plannedDate: '2026-11-05T10:00:00.000Z',
    ownerId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    status: ContentStatus.IN_PROGRESS,
    platform: ContentPlatform.YOUTUBE,
    isOverdue: false,
    hasRescheduleHistory: true,
    rescheduleCount: 1,
  },
  {
    id: 'cal-ev-102',
    sourceType: 'CONTENT_MILESTONE',
    sourceId: 'ev-tech-102',
    campaignId: 'cmp-tech-001',
    campaignTitle: 'Corviin CRM v2.0 Launch Video',
    title: 'Script Review & Sign-off',
    eventType: ContentEventType.SCRIPT_REVIEW,
    plannedDate: '2026-11-04T14:00:00.000Z',
    actualDate: '2026-11-04T15:30:00.000Z',
    ownerId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    status: ContentStatus.APPROVED,
    platform: ContentPlatform.YOUTUBE,
    isOverdue: false,
    hasRescheduleHistory: false,
    rescheduleCount: 0,
  },
  {
    id: 'cal-tsk-1',
    sourceType: 'TASK',
    sourceId: 'tsk-001',
    campaignId: 'cmp-tech-001',
    campaignTitle: 'Corviin CRM v2.0 Launch Video',
    title: 'Export 4K UI Mockups for Video B-Roll',
    eventType: 'CAMPAIGN_TASK',
    plannedDate: '2026-11-05T15:00:00.000Z',
    ownerId: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
    status: 'TODO',
    isOverdue: true,
    hasRescheduleHistory: false,
    rescheduleCount: 0,
  },
];

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
}

describe('Calendar Content & Campaigns Components', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('CalendarSummaryStrip renders all 4 key metric cards', () => {
    render(<CalendarSummaryStrip metrics={mockMetrics} />);

    expect(screen.getByText('Calendar Items')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('Scheduled Posts')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Published Live')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Overdue / Delayed')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('CalendarItemBadge distinguishes source types and planned vs actual timestamps without color alone', () => {
    const plannedItem = mockCalendarItems[1]; // RECORDING
    const actualItem = mockCalendarItems[2]; // SCRIPT_REVIEW with actualDate

    const { rerender } = render(<CalendarItemBadge item={plannedItem} />);
    expect(screen.getByText('Recording')).toBeInTheDocument();
    expect(screen.getByText(/Planned:/i)).toBeInTheDocument();

    rerender(<CalendarItemBadge item={actualItem} />);
    expect(screen.getByText('Script Review')).toBeInTheDocument();
    expect(screen.getByText(/Actual:/i)).toBeInTheDocument();
  });

  it('CalendarHeaderControls renders view switchers and period navigation', () => {
    const onViewModeChange = vi.fn();
    const onPrev = vi.fn();
    const onNext = vi.fn();
    const onToday = vi.fn();

    render(
      <CalendarHeaderControls
        viewMode="MONTH"
        onViewModeChange={onViewModeChange}
        currentDate={new Date('2026-11-05T09:00:00.000Z')}
        onPrev={onPrev}
        onNext={onNext}
        onToday={onToday}
        onOpenCreateEvent={vi.fn()}
        onOpenCreateCampaign={vi.fn()}
      />,
    );

    expect(screen.getByText('November 2026')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Agenda' }));
    expect(onViewModeChange).toHaveBeenCalledWith('AGENDA');

    fireEvent.click(screen.getByRole('button', { name: 'Today' }));
    expect(onToday).toHaveBeenCalled();

    fireEvent.click(screen.getByLabelText('Previous period'));
    expect(onPrev).toHaveBeenCalled();

    fireEvent.click(screen.getByLabelText('Next period'));
    expect(onNext).toHaveBeenCalled();
  });

  it('CalendarMonthGrid renders day cells and triggers onSelectItem', () => {
    const onSelectItem = vi.fn();
    render(
      <CalendarMonthGrid
        currentDate={new Date('2026-11-05T09:00:00.000Z')}
        items={mockCalendarItems}
        onSelectItem={onSelectItem}
      />,
    );

    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Sun')).toBeInTheDocument();

    const recordingChip = screen.getByText('Studio Screen Recording & Voiceover');
    expect(recordingChip).toBeInTheDocument();

    fireEvent.click(recordingChip);
    expect(onSelectItem).toHaveBeenCalledWith(mockCalendarItems[1]);
  });

  it('CalendarAgendaView groups items by date and provides quick actions', () => {
    const onSelectItem = vi.fn();
    const onReschedule = vi.fn();
    const onMarkPublished = vi.fn();

    render(
      <CalendarAgendaView
        items={mockCalendarItems}
        onSelectItem={onSelectItem}
        onReschedule={onReschedule}
        onMarkPublished={onMarkPublished}
      />,
      { wrapper: createWrapper() },
    );

    expect(screen.getByText('Studio Screen Recording & Voiceover')).toBeInTheDocument();
    expect(screen.getByText('Export 4K UI Mockups for Video B-Roll')).toBeInTheDocument();

    const rescheduleButtons = screen.getAllByRole('button', { name: /reschedule/i });
    expect(rescheduleButtons.length).toBeGreaterThan(0);
    fireEvent.click(rescheduleButtons[0]);
    expect(onReschedule).toHaveBeenCalled();
  });

  it('CalendarEventDrawer displays planned vs actual dates separately', () => {
    const onOpenReschedule = vi.fn();
    const onOpenMarkPublished = vi.fn();

    render(
      <CalendarEventDrawer
        item={mockCalendarItems[2]} // SCRIPT_REVIEW with actualDate
        open={true}
        onClose={vi.fn()}
        onOpenReschedule={onOpenReschedule}
        onOpenMarkPublished={onOpenMarkPublished}
        onOpenCreateTask={vi.fn()}
      />,
      { wrapper: createWrapper() },
    );

    expect(screen.getByText('Production Event Details')).toBeInTheDocument();
    expect(screen.getByText('Script Review & Sign-off')).toBeInTheDocument();
    expect(screen.getByText('Planned Production Date:')).toBeInTheDocument();
    expect(screen.getByText('Actual Execution / Publication:')).toBeInTheDocument();
  });

  it('RescheduleEventDialog enforces mandatory reason and calls onReschedule', async () => {
    const onReschedule = vi.fn().mockResolvedValue(undefined);
    render(
      <RescheduleEventDialog
        item={mockCalendarItems[1]}
        open={true}
        onClose={vi.fn()}
        onReschedule={onReschedule}
      />,
    );

    expect(screen.getByText('Reschedule Production Milestone')).toBeInTheDocument();

    const reasonInput = screen.getByPlaceholderText(/Studio audio equipment delay/i);
    fireEvent.change(reasonInput, {
      target: { value: 'Guest presenter delayed by flight' },
    });

    const submitBtn = screen.getByRole('button', { name: /confirm reschedule/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(onReschedule).toHaveBeenCalledWith(
        'ev-tech-101',
        expect.any(String),
        'Guest presenter delayed by flight',
      );
    });
  });

  it('MarkPublishedDialog enforces live public URL and calls onMarkPublished', async () => {
    const onMarkPublished = vi.fn().mockResolvedValue(undefined);
    render(
      <MarkPublishedDialog
        item={mockCalendarItems[1]}
        open={true}
        onClose={vi.fn()}
        onMarkPublished={onMarkPublished}
      />,
    );

    expect(screen.getByText('Mark Content as Published')).toBeInTheDocument();

    const urlInput = screen.getByPlaceholderText(/https:\/\/youtube\.com/i);
    fireEvent.change(urlInput, {
      target: { value: 'https://youtube.com/watch?v=launch-demo-2026' },
    });

    const submitBtn = screen.getByRole('button', { name: /record publication/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(onMarkPublished).toHaveBeenCalledWith(
        'ev-tech-101',
        expect.any(String),
        'https://youtube.com/watch?v=launch-demo-2026',
      );
    });
  });

  it('CalendarContentPage renders full page with queries and interactions', async () => {
    vi.spyOn(calendarService, 'fetchContentCalendar').mockResolvedValue({
      items: mockCalendarItems,
      metrics: mockMetrics,
    });
    vi.spyOn(campaignsService, 'fetchCampaigns').mockResolvedValue([]);

    render(<CalendarContentPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Calendar Items')).toBeInTheDocument();
      expect(screen.getByText('Scheduled Posts')).toBeInTheDocument();
    });
  });
});

