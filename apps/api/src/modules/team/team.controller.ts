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
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiHeader } from '@nestjs/swagger';
import {
  CreateTeamMemberDto,
  UpdateTeamMemberDto,
  MemberStatus,
} from '@corviin-hub/shared';
import { TeamService } from './team.service';

@ApiTags('Team')
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get('members')
  @ApiOperation({
    summary: 'List dynamic team members for active workspace with calculated workload',
  })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  @ApiQuery({ name: 'workspaceId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'search', required: false })
  getMembers(
    @Headers('x-workspace-id') headerWorkspaceId?: string,
    @Query('workspaceId') queryWorkspaceId?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    const wsId = queryWorkspaceId || headerWorkspaceId;
    if (!wsId) {
      throw new BadRequestException('Workspace ID is required (header x-workspace-id or query param).');
    }
    const data = this.teamService.findAllMembers(wsId, { status, search });
    return {
      data,
      message: 'Team members retrieved successfully',
      status: 'success',
    };
  }

  @Get('members/:id')
  @ApiOperation({
    summary: 'Get member detail and aggregated workspace operational records',
  })
  @ApiParam({ name: 'id', description: 'Member UUID' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  @ApiQuery({ name: 'workspaceId', required: false })
  getMemberDetail(
    @Param('id') id: string,
    @Headers('x-workspace-id') headerWorkspaceId?: string,
    @Query('workspaceId') queryWorkspaceId?: string,
  ) {
    const wsId = queryWorkspaceId || headerWorkspaceId;
    if (!wsId) {
      throw new BadRequestException('Workspace ID is required.');
    }
    const data = this.teamService.findMemberDetail(wsId, id);
    return {
      data,
      message: 'Member detail retrieved successfully',
      status: 'success',
    };
  }

  @Post('members')
  @ApiOperation({ summary: 'Add a new dynamic team member' })
  createMember(@Body() dto: CreateTeamMemberDto) {
    const created = this.teamService.createMember(dto);
    return {
      data: created,
      message: 'Team member added successfully',
      status: 'success',
    };
  }

  @Patch('members/:id')
  @ApiOperation({ summary: 'Update member profile or workspace assignments' })
  @ApiParam({ name: 'id', description: 'Member UUID' })
  updateMember(@Param('id') id: string, @Body() dto: UpdateTeamMemberDto) {
    const updated = this.teamService.updateMember(id, dto);
    return {
      data: updated,
      message: 'Team member updated successfully',
      status: 'success',
    };
  }

  @Post('members/:id/status')
  @ApiOperation({
    summary: 'Toggle member active status without erasing historical attribution',
  })
  @ApiParam({ name: 'id', description: 'Member UUID' })
  toggleStatus(@Param('id') id: string, @Body('status') status: MemberStatus) {
    if (!status) {
      throw new BadRequestException('New status is required.');
    }
    const updated = this.teamService.toggleMemberStatus(id, status);
    return {
      data: updated,
      message: `Member status updated to ${status}`,
      status: 'success',
    };
  }

  @Get('workload')
  @ApiOperation({ summary: 'Get concise workspace workload summary' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  @ApiQuery({ name: 'workspaceId', required: false })
  getWorkspaceWorkload(
    @Headers('x-workspace-id') headerWorkspaceId?: string,
    @Query('workspaceId') queryWorkspaceId?: string,
  ) {
    const wsId = queryWorkspaceId || headerWorkspaceId;
    if (!wsId) {
      throw new BadRequestException('Workspace ID is required.');
    }
    const data = this.teamService.getWorkspaceWorkload(wsId);
    return {
      data,
      message: 'Workspace workload summary retrieved successfully',
      status: 'success',
    };
  }
}
