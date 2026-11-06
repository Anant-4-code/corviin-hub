import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import {
  MeetingVisitCalendarItemDto,
  MeetingItem,
  SiteVisitItem,
  MeetingCategory,
  MeetingStatus,
  TaskPriority,
} from '@corviin-hub/shared';
import { MeetingsSummaryStrip } from '../features/calendar/components/MeetingsSummaryStrip';
import { MeetingsAgendaView } from '../features/calendar/components/MeetingsAgendaView';
import { MeetingVisitDetailDrawer } from '../features/calendar/components/MeetingVisitDetailDrawer';
import { ScheduleMeetingDialog } from '../features/calendar/components/ScheduleMeetingDialog';
import { ScheduleSiteVisitDialog } from '../features/calendar/components/ScheduleSiteVisitDialog';
import { CalendarMeetingsPage } from '../features/calendar/CalendarMeetingsPage';
import * as calendarService from '../services/calendar';
import * as meetingsService from '../services/meetings';

const mockMeetingItem: MeetingVisitCalendarItemDto = {
  id: 'cal-mtg-tech-001',
  sourceType: 'MEETING',
  sourceId: 'mtg-tech-001',
  title: 'Weekly Tech Architecture & Zero-Animation Review',
  category: MeetingCategory.INTERNAL,
  status: MeetingStatus.SCHEDULED,
  date: '2026-11-05',
  startTime: '2026-11-05T10:00:00.000Z',
  endTime: '2026-11-05T11:00:00.000Z',
  responsibleMemberId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  participantIds: ['a1b2c3d4-e5f6-7890-abcd-ef1234567890'],
  meetingUrl: 'https://meet.google.com/crv-tech-arch',
  location: 'Main Engineering Room',
  phoneNumber: '+91-98450-11111',
  hasRescheduleHistory: true,
  rescheduleCount: 1,
  isOverdue: false,
};

const mockSiteVisitItem: MeetingVisitCalendarItemDto = {
  id: 'cal-vis-real-001',
  sourceType: 'SITE_VISIT',
  sourceId: 'vis-re-001',
  title: 'Sobha Dream Acres — Vikram & Sunita Sharma',
  category: MeetingCategory.SITE_VISIT,
  status: MeetingStatus.CONFIRMED,
  date: '2026-11-05',
  startTime: '2026-11-05T14:00:00.000Z',
  endTime: '2026-11-05T15:30:00.000Z',
  responsibleMemberId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  participantIds: ['b2c3d4e5-f6a7-8901-bcde-f12345678901'],
  buyerName: 'Vikram & Sunita Sharma',
  phoneNumber: '+91-98450-12345',
  projectName: 'Sobha Dream Acres',
  projectLocation: 'Panathur Main Road, Balagere, Bangalore',
  location: 'Sobha Dream Acres, Panathur Main Road, Balagere, Bangalore',
  propertyUnit: 'Villa #14 (4BHK East-facing)',
  hasRescheduleHistory: false,
  rescheduleCount: 0,
  isOverdue: false,
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
}

describe('Feature 07 — Calendar: Meetings & Visits', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('MeetingsSummaryStrip', () => {
    it('renders all 5 overview metrics correctly', () => {
      const metrics = {
        totalScheduled: 5,
        onlineMeetingsCount: 3,
        siteVisitsCount: 2,
        completedCount: 4,
        cancelledOrNoShowCount: 1,
      };

      render(<MeetingsSummaryStrip metrics={metrics} />);

      expect(screen.getByText('Scheduled')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('Online Calls')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('Site Visits')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('Cancelled / No-Show')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  describe('MeetingsAgendaView', () => {
    it('renders meeting cards and distinct real estate site visits', () => {
      const onSelect = vi.fn();
      const onReschedule = vi.fn();

      render(
        <MeetingsAgendaView
          items={[mockMeetingItem, mockSiteVisitItem]}
          onSelectItem={onSelect}
          onRescheduleItem={onReschedule}
        />,
      );

      // Verify titles
      expect(screen.getByText('Weekly Tech Architecture & Zero-Animation Review')).toBeInTheDocument();
      expect(screen.getByText('Sobha Dream Acres — Vikram & Sunita Sharma')).toBeInTheDocument();

      // Verify badges
      expect(screen.getByText('Site Visit')).toBeInTheDocument();
      expect(screen.getByText('Internal Team')).toBeInTheDocument();
      expect(screen.getByText('Rescheduled (1x)')).toBeInTheDocument();

      // Verify quick action links
      const joinLink = screen.getByLabelText('Join meeting Weekly Tech Architecture & Zero-Animation Review');
      expect(joinLink).toBeInTheDocument();
      expect(joinLink).toHaveAttribute('href', 'https://meet.google.com/crv-tech-arch');

      const callLink = screen.getByLabelText('Call +91-98450-12345');
      expect(callLink).toBeInTheDocument();
      expect(callLink).toHaveAttribute('href', 'tel:+91-98450-12345');

      const mapLink = screen.getByLabelText(
        'View map for Sobha Dream Acres, Panathur Main Road, Balagere, Bangalore',
      );
      expect(mapLink).toBeInTheDocument();
      expect(mapLink.getAttribute('href')).toContain('maps.google.com');

      // Click card triggers onSelect
      fireEvent.click(screen.getByText('Weekly Tech Architecture & Zero-Animation Review'));
      expect(onSelect).toHaveBeenCalledWith(mockMeetingItem);
    });

    it('renders empty state when no events exist', () => {
      render(
        <MeetingsAgendaView
          items={[]}
          onSelectItem={vi.fn()}
          onRescheduleItem={vi.fn()}
        />,
      );

      expect(screen.getByText('No Meetings or Site Visits Found')).toBeInTheDocument();
    });
  });

  describe('MeetingVisitDetailDrawer', () => {
    it('renders detail drawer and handles action item conversion to task', async () => {
      const convertSpy = vi.spyOn(meetingsService, 'convertMeetingActionItem').mockResolvedValue({
        actionItem: { id: 'act-1', status: 'CONVERTED' },
        task: { id: 'tsk-new-1', title: 'Document design tokens' } as any,
      });

      const mockMeetingDetail: MeetingItem = {
        id: 'mtg-tech-001',
        workspaceId: 'ws-tech-0001-0000-000000000001',
        title: 'Weekly Tech Architecture & Zero-Animation Review',
        category: MeetingCategory.INTERNAL,
        status: MeetingStatus.SCHEDULED,
        date: '2026-11-05',
        startTime: '2026-11-05T10:00:00.000Z',
        endTime: '2026-11-05T11:00:00.000Z',
        organiserId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        participantIds: ['a1b2c3d4-e5f6-7890-abcd-ef1234567890'],
        agenda: 'Review CSS zero-animation and light/dark theme contrast',
        notes: 'Monorepo build verified under 6s',
        decisions: ['Static dialog backdrop without transition delays'],
        actionItems: [
          {
            id: 'act-1',
            description: 'Document design tokens in architecture TRD',
            assignedMemberId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
            dueDate: '2026-11-06T17:00:00.000Z',
            status: 'PENDING',
          },
        ],
        rescheduleHistory: [],
        activity: [],
        createdAt: '2026-11-01T09:00:00.000Z',
        updatedAt: '2026-11-04T12:00:00.000Z',
      };

      const onActionConverted = vi.fn();

      render(
        <MeetingVisitDetailDrawer
          open={true}
          onClose={vi.fn()}
          item={mockMeetingItem}
          meetingDetails={mockMeetingDetail}
          workspaceId="ws-tech-0001-0000-000000000001"
          onReschedule={vi.fn()}
          onStatusUpdate={vi.fn()}
          onActionItemConverted={onActionConverted}
        />,
      );

      expect(screen.getByText('Meeting Details')).toBeInTheDocument();
      expect(screen.getByText('Review CSS zero-animation and light/dark theme contrast')).toBeInTheDocument();
      expect(screen.getByText('Static dialog backdrop without transition delays')).toBeInTheDocument();
      expect(screen.getByText('Document design tokens in architecture TRD')).toBeInTheDocument();

      const convertBtn = screen.getByText('Convert to Task');
      fireEvent.click(convertBtn);

      await waitFor(() => {
        expect(convertSpy).toHaveBeenCalledWith(
          'ws-tech-0001-0000-000000000001',
          'mtg-tech-001',
          expect.objectContaining({
            actionItemId: 'act-1',
            taskTitle: 'Document design tokens in architecture TRD',
          }),
        );
        expect(onActionConverted).toHaveBeenCalled();
      });
    });
  });

  describe('ScheduleSiteVisitDialog', () => {
    it('validates required fields and submits site visit DTO', async () => {
      const onSchedule = vi.fn().mockResolvedValue(undefined);
      const members = [{ id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', displayName: 'Anant' }];

      render(
        <ScheduleSiteVisitDialog
          open={true}
          onClose={vi.fn()}
          workspaceId="ws-real-0002-0000-000000000002"
          members={members}
          onSchedule={onSchedule}
        />,
      );

      expect(screen.getByText('Schedule Property Site Visit')).toBeInTheDocument();

      // Enter buyer and project details
      fireEvent.change(screen.getByPlaceholderText('e.g. Vikram & Sunita Sharma'), {
        target: { value: 'Dr. Alok Verma' },
      });
      fireEvent.change(screen.getByPlaceholderText('e.g. Sobha Dream Acres'), {
        target: { value: 'Prestige Lakeside Habitat' },
      });
      fireEvent.change(screen.getByPlaceholderText('e.g. Villa #14 (4BHK East-facing)'), {
        target: { value: 'Penthouse 1204' },
      });

      // Submit form
      fireEvent.click(screen.getByText('Confirm Site Visit'));

      await waitFor(() => {
        expect(onSchedule).toHaveBeenCalledWith(
          expect.objectContaining({
            buyerName: 'Dr. Alok Verma',
            projectName: 'Prestige Lakeside Habitat',
            propertyUnit: 'Penthouse 1204',
          }),
        );
      });
    });
  });

  describe('CalendarMeetingsPage', () => {
    it('renders summary strip, controls, and agenda view with data from API', async () => {
      vi.spyOn(calendarService, 'fetchMeetingsCalendar').mockResolvedValue({
        items: [mockMeetingItem, mockSiteVisitItem],
        metrics: {
          totalScheduled: 2,
          onlineMeetingsCount: 1,
          siteVisitsCount: 1,
          completedCount: 0,
          cancelledOrNoShowCount: 0,
        },
      });

      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <CalendarMeetingsPage />
        </Wrapper>,
      );

      // Check metrics strip
      await waitFor(() => {
        expect(screen.getByText('Weekly Tech Architecture & Zero-Animation Review')).toBeInTheDocument();
        expect(screen.getByText('Sobha Dream Acres — Vikram & Sunita Sharma')).toBeInTheDocument();
      });

      // Check view buttons
      expect(screen.getByText('Month')).toBeInTheDocument();
      expect(screen.getByText('Week')).toBeInTheDocument();
      expect(screen.getByText('Agenda')).toBeInTheDocument();

      // Switch to Month view
      fireEvent.click(screen.getByText('Month'));
      expect(screen.getByText('Mon')).toBeInTheDocument();
      expect(screen.getByText('Sun')).toBeInTheDocument();
    });
  });
});
