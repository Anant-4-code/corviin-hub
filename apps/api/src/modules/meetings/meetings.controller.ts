import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  CreateMeetingDto,
  UpdateMeetingDto,
  RescheduleMeetingDto,
  ConvertActionItemToTaskDto,
  CreateSiteVisitDto,
  UpdateSiteVisitDto,
  RescheduleSiteVisitDto,
} from '@corviin-hub/shared';
import { MeetingsService } from './meetings.service';

@ApiTags('Meetings')
@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) { }

  // -------------------------------------------------------------
  // SITE VISITS ENDPOINTS (declared before :id parameter routes)
  // -------------------------------------------------------------

  @Get('site-visits')
  @ApiOperation({ summary: 'List all site visits for a workspace' })
  getSiteVisits(
    @Headers('x-workspace-id') headerWorkspaceId?: string,
    @Query('workspaceId') queryWorkspaceId?: string,
    @Query('status') status?: string,
    @Query('memberId') memberId?: string,
    @Query('date') date?: string,
  ) {
    const wsId = queryWorkspaceId || headerWorkspaceId;
    if (!wsId) {
      throw new BadRequestException('Workspace ID is required (header x-workspace-id or query param).');
    }
    return {
      data: this.meetingsService.findAllSiteVisits(wsId, { status, memberId, date }),
      message: 'Site visits retrieved successfully',
      status: 'success',
    };
  }

  @Get('site-visits/:id')
  @ApiOperation({ summary: 'Get site visit detail by ID' })
  getSiteVisitById(
    @Param('id') id: string,
    @Headers('x-workspace-id') headerWorkspaceId?: string,
    @Query('workspaceId') queryWorkspaceId?: string,
  ) {
    const wsId = queryWorkspaceId || headerWorkspaceId;
    if (!wsId) {
      throw new BadRequestException('Workspace ID is required.');
    }
    return {
      data: this.meetingsService.findSiteVisitById(wsId, id),
      message: 'Site visit retrieved successfully',
      status: 'success',
    };
  }

  @Post('site-visits')
  @ApiOperation({ summary: 'Create a new Real Estate site visit' })
  createSiteVisit(
    @Body() dto: CreateSiteVisitDto,
    @Headers('x-workspace-id') headerWorkspaceId?: string,
  ) {
    const wsId = dto.workspaceId || headerWorkspaceId;
    if (!wsId) {
      throw new BadRequestException('Workspace ID is required.');
    }
    const created = this.meetingsService.createSiteVisit({ ...dto, workspaceId: wsId });
    return {
      data: created,
      message: 'Site visit created successfully',
      status: 'success',
    };
  }

  @Patch('site-visits/:id')
  @ApiOperation({ summary: 'Update site visit details' })
  updateSiteVisit(
    @Param('id') id: string,
    @Body() dto: UpdateSiteVisitDto,
    @Headers('x-workspace-id') headerWorkspaceId?: string,
    @Query('workspaceId') queryWorkspaceId?: string,
  ) {
    const wsId = queryWorkspaceId || headerWorkspaceId;
    if (!wsId) {
      throw new BadRequestException('Workspace ID is required.');
    }
    const updated = this.meetingsService.updateSiteVisit(wsId, id, dto);
    return {
      data: updated,
      message: 'Site visit updated successfully',
      status: 'success',
    };
  }

  @Post('site-visits/:id/reschedule')
  @ApiOperation({ summary: 'Reschedule site visit with audit reason' })
  rescheduleSiteVisit(
    @Param('id') id: string,
    @Body() dto: RescheduleSiteVisitDto,
    @Headers('x-workspace-id') headerWorkspaceId?: string,
    @Query('workspaceId') queryWorkspaceId?: string,
  ) {
    const wsId = queryWorkspaceId || headerWorkspaceId;
    if (!wsId) {
      throw new BadRequestException('Workspace ID is required.');
    }
    const rescheduled = this.meetingsService.rescheduleSiteVisit(wsId, id, dto);
    return {
      data: rescheduled,
      message: 'Site visit rescheduled successfully',
      status: 'success',
    };
  }

  // -------------------------------------------------------------
  // MEETINGS ENDPOINTS
  // -------------------------------------------------------------

  @Get()
  @ApiOperation({ summary: 'List all meetings for a workspace' })
  getMeetings(
    @Headers('x-workspace-id') headerWorkspaceId?: string,
    @Query('workspaceId') queryWorkspaceId?: string,
    @Query('category') category?: string,
    @Query('status') status?: string,
    @Query('memberId') memberId?: string,
    @Query('date') date?: string,
  ) {
    const wsId = queryWorkspaceId || headerWorkspaceId;
    if (!wsId) {
      throw new BadRequestException('Workspace ID is required (header x-workspace-id or query param).');
    }
    return {
      data: this.meetingsService.findAllMeetings(wsId, { category, status, memberId, date }),
      message: 'Meetings retrieved successfully',
      status: 'success',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get meeting detail by ID' })
  getMeetingById(
    @Param('id') id: string,
    @Headers('x-workspace-id') headerWorkspaceId?: string,
    @Query('workspaceId') queryWorkspaceId?: string,
  ) {
    const wsId = queryWorkspaceId || headerWorkspaceId;
    if (!wsId) {
      throw new BadRequestException('Workspace ID is required.');
    }
    return {
      data: this.meetingsService.findMeetingById(wsId, id),
      message: 'Meeting retrieved successfully',
      status: 'success',
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new meeting' })
  createMeeting(
    @Body() dto: CreateMeetingDto,
    @Headers('x-workspace-id') headerWorkspaceId?: string,
  ) {
    const wsId = dto.workspaceId || headerWorkspaceId;
    if (!wsId) {
      throw new BadRequestException('Workspace ID is required.');
    }
    const created = this.meetingsService.createMeeting({ ...dto, workspaceId: wsId });
    return {
      data: created,
      message: 'Meeting created successfully',
      status: 'success',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update meeting details' })
  updateMeeting(
    @Param('id') id: string,
    @Body() dto: UpdateMeetingDto,
    @Headers('x-workspace-id') headerWorkspaceId?: string,
    @Query('workspaceId') queryWorkspaceId?: string,
  ) {
    const wsId = queryWorkspaceId || headerWorkspaceId;
    if (!wsId) {
      throw new BadRequestException('Workspace ID is required.');
    }
    const updated = this.meetingsService.updateMeeting(wsId, id, dto);
    return {
      data: updated,
      message: 'Meeting updated successfully',
      status: 'success',
    };
  }

  @Post(':id/reschedule')
  @ApiOperation({ summary: 'Reschedule meeting with audit reason' })
  rescheduleMeeting(
    @Param('id') id: string,
    @Body() dto: RescheduleMeetingDto,
    @Headers('x-workspace-id') headerWorkspaceId?: string,
    @Query('workspaceId') queryWorkspaceId?: string,
  ) {
    const wsId = queryWorkspaceId || headerWorkspaceId;
    if (!wsId) {
      throw new BadRequestException('Workspace ID is required.');
    }
    const rescheduled = this.meetingsService.rescheduleMeeting(wsId, id, dto);
    return {
      data: rescheduled,
      message: 'Meeting rescheduled successfully',
      status: 'success',
    };
  }

  @Post(':id/convert-action-item')
  @ApiOperation({ summary: 'Convert a meeting action item into a tracked task' })
  convertActionItem(
    @Param('id') id: string,
    @Body() dto: ConvertActionItemToTaskDto,
    @Headers('x-workspace-id') headerWorkspaceId?: string,
    @Query('workspaceId') queryWorkspaceId?: string,
  ) {
    const wsId = queryWorkspaceId || headerWorkspaceId;
    if (!wsId) {
      throw new BadRequestException('Workspace ID is required.');
    }
    const result = this.meetingsService.convertActionItemToTask(wsId, id, dto);
    return {
      data: result,
      message: 'Action item converted to task successfully',
      status: 'success',
    };
  }
}
