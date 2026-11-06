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
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiQuery } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import {
  CreateTaskDto,
  UpdateTaskDto,
  RescheduleTaskDto,
  BlockTaskDto,
  CompleteTaskDto,
  TaskStatus,
  TaskPriority,
  AttachmentItem,
  BulkTaskActionDto,
} from '@corviin-hub/shared';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

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

  @Get()
  @ApiOperation({ summary: 'List tasks with optional personal filtering' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  @ApiHeader({ name: 'x-profile-id', required: false })
  @ApiQuery({ name: 'mine', required: false, type: Boolean })
  @ApiQuery({ name: 'tab', required: false, enum: ['today', 'upcoming', 'overdue', 'in_progress', 'completed', 'all'] })
  @ApiQuery({ name: 'status', required: false, enum: TaskStatus })
  @ApiQuery({ name: 'priority', required: false, enum: TaskPriority })
  @ApiQuery({ name: 'assigneeId', required: false, type: String })
  @ApiQuery({ name: 'creatorId', required: false, type: String })
  @ApiQuery({ name: 'linkedRecordType', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sort', required: false, enum: ['due_soonest', 'priority', 'recently_updated', 'planned_start'] })
  findAll(
    @Headers('x-workspace-id') headerWs?: string,
    @Headers('x-profile-id') headerProf?: string,
    @Query('mine') mine?: string,
    @Query('tab') tab?: any,
    @Query('status') status?: TaskStatus,
    @Query('priority') priority?: TaskPriority,
    @Query('assigneeId') assigneeId?: string,
    @Query('creatorId') creatorId?: string,
    @Query('linkedRecordType') linkedRecordType?: string,
    @Query('search') search?: string,
    @Query('sort') sort?: any,
  ) {
    const { workspaceId, profileId } = this.getContext(headerWs, headerProf);
    const isMine = mine === 'true' || mine === '1';

    const tasks = this.tasksService.findAll(workspaceId, profileId, {
      mine: isMine,
      tab,
      status,
      priority,
      assigneeId,
      creatorId,
      linkedRecordType,
      search,
      sort,
    });

    return { data: tasks, meta: { total: tasks.length } };
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Perform bulk action on tasks (reassign, set_priority, complete)' })
  bulkAction(
    @Body() dto: BulkTaskActionDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Headers('x-profile-id') headerProf?: string,
  ) {
    const { workspaceId, actorName } = this.getContext(headerWs, headerProf);
    const result = this.tasksService.bulkAction(workspaceId, actorName, dto);
    return { data: result, message: `Bulk ${dto.action} completed for ${result.updatedCount} task(s).` };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single task detail by ID' })
  findOne(
    @Param('id') id: string,
    @Headers('x-workspace-id') headerWs?: string,
    @Headers('x-profile-id') headerProf?: string,
  ) {
    const { workspaceId } = this.getContext(headerWs, headerProf);
    const task = this.tasksService.findById(id, workspaceId);
    return { data: task };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new operational task' })
  create(
    @Body() dto: CreateTaskDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Headers('x-profile-id') headerProf?: string,
  ) {
    const { workspaceId, profileId, actorName } = this.getContext(headerWs, headerProf);

    if (!dto.title || !dto.title.trim()) {
      throw new BadRequestException('Task title is required.');
    }
    if (!dto.deadline) {
      throw new BadRequestException('Task deadline date/time is required.');
    }

    const task = this.tasksService.create(
      {
        ...dto,
        workspaceId: dto.workspaceId || workspaceId,
        assigneeId: dto.assigneeId || profileId,
      },
      profileId,
      actorName,
    );

    return { data: task, message: 'Task created successfully.' };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing task' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Headers('x-profile-id') headerProf?: string,
  ) {
    const { workspaceId, actorName } = this.getContext(headerWs, headerProf);
    const task = this.tasksService.update(id, workspaceId, dto, actorName);
    return { data: task, message: 'Task updated successfully.' };
  }

  @Post(':id/work-sessions/start')
  @ApiOperation({ summary: 'Start a work session on a task' })
  startWorkSession(
    @Param('id') id: string,
    @Headers('x-workspace-id') headerWs?: string,
    @Headers('x-profile-id') headerProf?: string,
  ) {
    const { workspaceId, profileId, actorName } = this.getContext(headerWs, headerProf);
    const task = this.tasksService.startWorkSession(id, workspaceId, profileId, actorName);
    return { data: task, message: 'Work session started.' };
  }

  @Post(':id/work-sessions/pause')
  @ApiOperation({ summary: 'Pause an active work session (sets task to On Hold)' })
  pauseWorkSession(
    @Param('id') id: string,
    @Headers('x-workspace-id') headerWs?: string,
    @Headers('x-profile-id') headerProf?: string,
  ) {
    const { workspaceId, actorName } = this.getContext(headerWs, headerProf);
    const task = this.tasksService.pauseWorkSession(id, workspaceId, actorName);
    return { data: task, message: 'Work session paused.' };
  }

  @Post(':id/work-sessions/resume')
  @ApiOperation({ summary: 'Resume a work session on a task' })
  resumeWorkSession(
    @Param('id') id: string,
    @Headers('x-workspace-id') headerWs?: string,
    @Headers('x-profile-id') headerProf?: string,
  ) {
    const { workspaceId, profileId, actorName } = this.getContext(headerWs, headerProf);
    const task = this.tasksService.resumeWorkSession(id, workspaceId, profileId, actorName);
    return { data: task, message: 'Work session resumed.' };
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete a task with optional completion note' })
  completeTask(
    @Param('id') id: string,
    @Body() dto: CompleteTaskDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Headers('x-profile-id') headerProf?: string,
  ) {
    const { workspaceId, actorName } = this.getContext(headerWs, headerProf);
    const task = this.tasksService.completeTask(id, workspaceId, actorName, dto);
    return { data: task, message: 'Task marked as completed.' };
  }

  @Post(':id/block')
  @ApiOperation({ summary: 'Block a task with blocker reason' })
  blockTask(
    @Param('id') id: string,
    @Body() dto: BlockTaskDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Headers('x-profile-id') headerProf?: string,
  ) {
    const { workspaceId, actorName } = this.getContext(headerWs, headerProf);
    const task = this.tasksService.blockTask(id, workspaceId, actorName, dto);
    return { data: task, message: 'Task marked as blocked.' };
  }

  @Post(':id/reschedule')
  @ApiOperation({ summary: 'Reschedule task deadline and append to reschedule history' })
  reschedule(
    @Param('id') id: string,
    @Body() dto: RescheduleTaskDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Headers('x-profile-id') headerProf?: string,
  ) {
    const { workspaceId, profileId, actorName } = this.getContext(headerWs, headerProf);
    const task = this.tasksService.reschedule(id, workspaceId, profileId, actorName, dto);
    return { data: task, message: 'Task rescheduled successfully.' };
  }

  @Post(':id/checklist')
  @ApiOperation({ summary: 'Add a checklist item to a task' })
  addChecklistItem(
    @Param('id') id: string,
    @Body('title') title: string,
    @Headers('x-workspace-id') headerWs?: string,
  ) {
    const { workspaceId } = this.getContext(headerWs);
    if (!title || !title.trim()) {
      throw new BadRequestException('Checklist item title is required.');
    }
    const task = this.tasksService.addChecklistItem(id, workspaceId, title);
    return { data: task, message: 'Checklist item added.' };
  }

  @Patch(':id/checklist/:checklistId/toggle')
  @ApiOperation({ summary: 'Toggle completion state of a checklist item' })
  toggleChecklistItem(
    @Param('id') id: string,
    @Param('checklistId') checklistId: string,
    @Headers('x-workspace-id') headerWs?: string,
  ) {
    const { workspaceId } = this.getContext(headerWs);
    const task = this.tasksService.toggleChecklistItem(id, workspaceId, checklistId);
    return { data: task, message: 'Checklist item updated.' };
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Add an operational comment to a task' })
  addComment(
    @Param('id') id: string,
    @Body('content') content: string,
    @Headers('x-workspace-id') headerWs?: string,
    @Headers('x-profile-id') headerProf?: string,
  ) {
    const { workspaceId, profileId, actorName } = this.getContext(headerWs, headerProf);
    if (!content || !content.trim()) {
      throw new BadRequestException('Comment content cannot be empty.');
    }
    const task = this.tasksService.addComment(id, workspaceId, profileId, actorName, content);
    return { data: task, message: 'Comment posted.' };
  }

  @Post(':id/attachments')
  @ApiOperation({ summary: 'Link an attachment to a task' })
  addAttachment(
    @Param('id') id: string,
    @Body() attachment: AttachmentItem,
    @Headers('x-workspace-id') headerWs?: string,
  ) {
    const { workspaceId } = this.getContext(headerWs);
    const task = this.tasksService.addAttachment(id, workspaceId, attachment);
    return { data: task, message: 'Attachment linked to task.' };
  }
}
