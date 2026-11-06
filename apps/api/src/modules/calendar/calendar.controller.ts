import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CalendarService } from './calendar.service';
import { CampaignsService } from '../campaigns/campaigns.service';
import {
  CalendarContentFilterQuery,
  TeamTasksCalendarQuery,
  MeetingsCalendarFilterQuery,
  RescheduleContentEventDto,
  MarkContentPublishedDto,
} from '@corviin-hub/shared';

@ApiTags('Calendar')
@Controller('calendar')
export class CalendarController {
  constructor(
    private readonly calendarService: CalendarService,
    private readonly campaignsService: CampaignsService,
  ) {}

  @Get('content')
  @ApiOperation({
    summary:
      'Get aggregated content & campaign calendar items, milestones, linked tasks, and overview metrics',
  })
  @ApiQuery({ name: 'workspaceId', required: true })
  @ApiQuery({ name: 'campaignId', required: false })
  @ApiQuery({ name: 'ownerId', required: false })
  @ApiQuery({ name: 'eventType', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'platform', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  getContentCalendar(@Query() query: CalendarContentFilterQuery) {
    if (!query.workspaceId) {
      throw new BadRequestException('workspaceId query parameter is required');
    }
    return this.calendarService.getContentCalendar(query);
  }

  @Get('team-tasks')
  @ApiOperation({
    summary:
      'Get date-based team task calendar organized by dynamic active workspace members',
  })
  @ApiQuery({ name: 'workspaceId', required: true })
  @ApiQuery({ name: 'date', required: true })
  @ApiQuery({ name: 'memberId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'priority', required: false })
  @ApiQuery({ name: 'linkedRecordType', required: false })
  @ApiQuery({ name: 'overdueOnly', required: false })
  getTeamTasksCalendar(@Query() query: TeamTasksCalendarQuery) {
    if (!query.workspaceId) {
      throw new BadRequestException('workspaceId query parameter is required');
    }
    if (!query.date) {
      throw new BadRequestException('date query parameter is required');
    }
    return this.calendarService.getTeamTasksCalendar(query);
  }

  @Get('meetings')
  @ApiOperation({
    summary:
      'Get combined calendar of meetings and site visits with overview metrics',
  })
  @ApiQuery({ name: 'workspaceId', required: true })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'memberId', required: false })
  @ApiQuery({ name: 'date', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  getMeetingsCalendar(@Query() query: MeetingsCalendarFilterQuery) {
    if (!query.workspaceId) {
      throw new BadRequestException('workspaceId query parameter is required');
    }
    return this.calendarService.getMeetingsCalendar(query);
  }

  @Post('content/reschedule')
  @ApiOperation({
    summary: 'Reschedule a content event milestone, recording audit reschedule history',
  })
  @ApiQuery({ name: 'workspaceId', required: true })
  @ApiQuery({ name: 'eventId', required: true })
  rescheduleContentEvent(
    @Query('workspaceId') workspaceId: string,
    @Query('eventId') eventId: string,
    @Body() dto: RescheduleContentEventDto,
  ) {
    if (!workspaceId || !eventId || !dto.newDate || !dto.reason) {
      throw new BadRequestException('workspaceId, eventId, newDate, and reason are required');
    }
    return this.campaignsService.rescheduleContentEvent(workspaceId, eventId, dto);
  }

  @Post('content/publish')
  @ApiOperation({
    summary: 'Mark a content milestone as published, recording actual timestamp and public URL',
  })
  @ApiQuery({ name: 'workspaceId', required: true })
  @ApiQuery({ name: 'eventId', required: true })
  markContentPublished(
    @Query('workspaceId') workspaceId: string,
    @Query('eventId') eventId: string,
    @Body() dto: MarkContentPublishedDto,
  ) {
    if (!workspaceId || !eventId || !dto.publicUrl) {
      throw new BadRequestException('workspaceId, eventId, and publicUrl are required');
    }
    return this.campaignsService.markContentPublished(workspaceId, eventId, dto);
  }
}
