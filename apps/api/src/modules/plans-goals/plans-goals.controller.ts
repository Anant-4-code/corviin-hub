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
import { ApiTags, ApiOperation, ApiHeader, ApiQuery } from '@nestjs/swagger';
import { PlansGoalsService } from './plans-goals.service';
import {
  CreateGoalDto,
  UpdateGoalDto,
  CreatePlanDto,
  UpdatePlanDto,
  CreateMilestoneDto,
  UpdateMilestoneDto,
  GoalStatus,
  PlanStatus,
} from '@corviin-hub/shared';

@ApiTags('Plans & Goals')
@Controller('plans-goals')
export class PlansGoalsController {
  constructor(private readonly service: PlansGoalsService) {}

  private getContext(headerWorkspaceId?: string, headerProfileId?: string) {
    return {
      workspaceId: headerWorkspaceId || 'ws-tech-0001-0000-000000000001',
      profileId: headerProfileId || 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      actorName:
        headerProfileId === 'b2c3d4e5-f6a7-8901-bcde-f12345678901'
          ? 'Rohit'
          : headerProfileId === 'c3d4e5f6-a7b8-9012-cdef-123456789012'
          ? 'Utkarsh'
          : 'Anant',
    };
  }

  @Get('overview')
  @ApiOperation({ summary: 'Get workspace overview of goals, plans, and milestone health' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  getOverview(
    @Headers('x-workspace-id') headerWs?: string,
  ) {
    const { workspaceId } = this.getContext(headerWs);
    const data = this.service.getOverview(workspaceId);
    return { data };
  }

  @Get('goals')
  @ApiOperation({ summary: 'List goals for active workspace' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  @ApiQuery({ name: 'ownerId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: GoalStatus })
  @ApiQuery({ name: 'search', required: false })
  findGoals(
    @Headers('x-workspace-id') headerWs?: string,
    @Query('ownerId') ownerId?: string,
    @Query('status') status?: GoalStatus,
    @Query('search') search?: string,
  ) {
    const { workspaceId } = this.getContext(headerWs);
    const data = this.service.findGoals(workspaceId, { ownerId, status, search });
    return { data, meta: { total: data.length } };
  }

  @Get('goals/:id')
  @ApiOperation({ summary: 'Get goal detail by ID' })
  findGoalById(
    @Param('id') id: string,
    @Headers('x-workspace-id') headerWs?: string,
  ) {
    const { workspaceId } = this.getContext(headerWs);
    const data = this.service.findGoalById(id, workspaceId);
    return { data };
  }

  @Post('goals')
  @ApiOperation({ summary: 'Create a new strategic goal' })
  createGoal(
    @Body() dto: CreateGoalDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Headers('x-profile-id') headerProf?: string,
  ) {
    const { workspaceId, profileId, actorName } = this.getContext(headerWs, headerProf);
    if (!dto.title || !dto.title.trim()) {
      throw new BadRequestException('Goal title is required.');
    }
    if (!dto.expectedOutcome || !dto.expectedOutcome.trim()) {
      throw new BadRequestException('Expected outcome is required.');
    }
    if (!dto.targetDate) {
      throw new BadRequestException('Target date is required.');
    }

    const data = this.service.createGoal(
      {
        ...dto,
        workspaceId: dto.workspaceId || workspaceId,
        ownerId: dto.ownerId || profileId,
      },
      actorName,
    );
    return { data, message: 'Goal created successfully.' };
  }

  @Patch('goals/:id')
  @ApiOperation({ summary: 'Update an existing goal' })
  updateGoal(
    @Param('id') id: string,
    @Body() dto: UpdateGoalDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Headers('x-profile-id') headerProf?: string,
  ) {
    const { workspaceId, actorName } = this.getContext(headerWs, headerProf);
    const data = this.service.updateGoal(id, workspaceId, dto, actorName);
    return { data, message: 'Goal updated successfully.' };
  }

  @Get('plans')
  @ApiOperation({ summary: 'List plans for active workspace' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  @ApiQuery({ name: 'ownerId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: PlanStatus })
  @ApiQuery({ name: 'goalId', required: false })
  @ApiQuery({ name: 'search', required: false })
  findPlans(
    @Headers('x-workspace-id') headerWs?: string,
    @Query('ownerId') ownerId?: string,
    @Query('status') status?: PlanStatus,
    @Query('goalId') goalId?: string,
    @Query('search') search?: string,
  ) {
    const { workspaceId } = this.getContext(headerWs);
    const data = this.service.findPlans(workspaceId, { ownerId, status, goalId, search });
    return { data, meta: { total: data.length } };
  }

  @Get('plans/:id')
  @ApiOperation({ summary: 'Get plan detail by ID' })
  findPlanById(
    @Param('id') id: string,
    @Headers('x-workspace-id') headerWs?: string,
  ) {
    const { workspaceId } = this.getContext(headerWs);
    const data = this.service.findPlanById(id, workspaceId);
    return { data };
  }

  @Post('plans')
  @ApiOperation({ summary: 'Create a new execution plan' })
  createPlan(
    @Body() dto: CreatePlanDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Headers('x-profile-id') headerProf?: string,
  ) {
    const { workspaceId, profileId, actorName } = this.getContext(headerWs, headerProf);
    if (!dto.title || !dto.title.trim()) {
      throw new BadRequestException('Plan title is required.');
    }
    if (!dto.strategySummary || !dto.strategySummary.trim()) {
      throw new BadRequestException('Strategy summary is required.');
    }
    if (!dto.startDate || !dto.targetDate) {
      throw new BadRequestException('Start and target dates are required.');
    }

    const data = this.service.createPlan(
      {
        ...dto,
        workspaceId: dto.workspaceId || workspaceId,
        ownerId: dto.ownerId || profileId,
      },
      actorName,
    );
    return { data, message: 'Plan created successfully.' };
  }

  @Patch('plans/:id')
  @ApiOperation({ summary: 'Update an existing plan' })
  updatePlan(
    @Param('id') id: string,
    @Body() dto: UpdatePlanDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Headers('x-profile-id') headerProf?: string,
  ) {
    const { workspaceId, actorName } = this.getContext(headerWs, headerProf);
    const data = this.service.updatePlan(id, workspaceId, dto, actorName);
    return { data, message: 'Plan updated successfully.' };
  }

  @Post('plans/:id/milestones')
  @ApiOperation({ summary: 'Add a milestone to a plan' })
  addMilestone(
    @Param('id') id: string,
    @Body() dto: CreateMilestoneDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Headers('x-profile-id') headerProf?: string,
  ) {
    const { workspaceId, actorName } = this.getContext(headerWs, headerProf);
    if (!dto.title || !dto.title.trim()) {
      throw new BadRequestException('Milestone title is required.');
    }
    if (!dto.dueDate) {
      throw new BadRequestException('Milestone due date is required.');
    }
    const data = this.service.addMilestone(id, workspaceId, dto, actorName);
    return { data, message: 'Milestone added successfully.' };
  }

  @Patch('plans/:id/milestones/:milestoneId')
  @ApiOperation({ summary: 'Update a milestone in a plan' })
  updateMilestone(
    @Param('id') id: string,
    @Param('milestoneId') milestoneId: string,
    @Body() dto: UpdateMilestoneDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Headers('x-profile-id') headerProf?: string,
  ) {
    const { workspaceId, actorName } = this.getContext(headerWs, headerProf);
    const data = this.service.updateMilestone(id, milestoneId, workspaceId, dto, actorName);
    return { data, message: 'Milestone updated successfully.' };
  }
}
