import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CampaignsService } from './campaigns.service';
import {
  CreateCampaignDto,
  UpdateCampaignDto,
  AdvanceCampaignStageDto,
  CreateScriptVersionDto,
  UpdateScriptStatusDto,
  UpdateFootageChecklistDto,
  LinkCampaignAssetDto,
  CreateCampaignTaskDto,
  CreateContentEventDto,
  RescheduleContentEventDto,
  MarkContentPublishedDto,
} from '@corviin-hub/shared';

@ApiTags('Campaigns')
@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Get()
  @ApiOperation({ summary: 'List all campaigns in workspace with optional filters' })
  @ApiQuery({ name: 'workspaceId', required: false })
  findAll(
    @Headers('x-workspace-id') headerWorkspaceId?: string,
    @Query('workspaceId') queryWorkspaceId?: string,
    @Query('stage') stage?: string,
    @Query('status') status?: string,
    @Query('ownerId') ownerId?: string,
    @Query('priority') priority?: string,
    @Query('platform') platform?: string,
    @Query('search') search?: string,
  ) {
    const wsId = queryWorkspaceId || headerWorkspaceId;
    if (!wsId) {
      throw new BadRequestException('workspaceId is required');
    }
    return this.campaignsService.findAll(wsId, {
      stage,
      status,
      ownerId,
      priority,
      platform,
      search,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get campaign details by ID' })
  findOne(
    @Param('id') id: string,
    @Headers('x-workspace-id') headerWorkspaceId?: string,
    @Query('workspaceId') queryWorkspaceId?: string,
  ) {
    const wsId = queryWorkspaceId || headerWorkspaceId;
    if (!wsId) {
      throw new BadRequestException('workspaceId is required');
    }
    return this.campaignsService.findOne(wsId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new operational campaign in Initial Idea stage' })
  create(
    @Body() dto: CreateCampaignDto,
    @Headers('x-workspace-id') headerWorkspaceId?: string,
  ) {
    const wsId = dto.workspaceId || headerWorkspaceId;
    if (!wsId || !dto.title) {
      throw new BadRequestException('workspaceId and title are required');
    }
    return this.campaignsService.create({ ...dto, workspaceId: wsId });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update campaign metadata' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCampaignDto,
    @Headers('x-workspace-id') headerWorkspaceId?: string,
    @Query('workspaceId') queryWorkspaceId?: string,
  ) {
    const wsId = queryWorkspaceId || headerWorkspaceId;
    if (!wsId) {
      throw new BadRequestException('workspaceId is required');
    }
    return this.campaignsService.update(wsId, id, dto);
  }

  @Post(':id/advance-stage')
  @ApiOperation({ summary: 'Advance or transition campaign stage with prerequisite validation' })
  advanceStage(
    @Param('id') id: string,
    @Body() dto: AdvanceCampaignStageDto,
    @Headers('x-workspace-id') headerWorkspaceId?: string,
    @Query('workspaceId') queryWorkspaceId?: string,
  ) {
    const wsId = queryWorkspaceId || headerWorkspaceId;
    if (!wsId || !dto.toStage) {
      throw new BadRequestException('workspaceId and toStage are required');
    }
    return this.campaignsService.advanceStage(wsId, id, dto);
  }

  // ==========================================
  // SCRIPT VERSIONING (Stage 2)
  // ==========================================

  @Post(':id/scripts')
  @ApiOperation({ summary: 'Add a new script version/revision to campaign' })
  addScriptVersion(
    @Param('id') id: string,
    @Body() dto: CreateScriptVersionDto,
    @Headers('x-workspace-id') headerWorkspaceId?: string,
    @Query('workspaceId') queryWorkspaceId?: string,
  ) {
    const wsId = queryWorkspaceId || headerWorkspaceId;
    if (!wsId || !dto.content) {
      throw new BadRequestException('workspaceId and content are required');
    }
    return this.campaignsService.addScriptVersion(wsId, id, dto);
  }

  @Patch(':id/scripts/:scriptId/status')
  @ApiOperation({ summary: 'Update script review status (Approved or Changes Requested)' })
  updateScriptStatus(
    @Param('id') id: string,
    @Param('scriptId') scriptId: string,
    @Body() dto: UpdateScriptStatusDto,
    @Headers('x-workspace-id') headerWorkspaceId?: string,
    @Query('workspaceId') queryWorkspaceId?: string,
  ) {
    const wsId = queryWorkspaceId || headerWorkspaceId;
    if (!wsId || !dto.status) {
      throw new BadRequestException('workspaceId and status are required');
    }
    return this.campaignsService.updateScriptStatus(wsId, id, scriptId, dto);
  }

  // ==========================================
  // FOOTAGE CHECKLIST (Stage 3)
  // ==========================================

  @Patch(':id/footage-checklist')
  @ApiOperation({ summary: 'Update footage shot list status items' })
  updateFootageChecklist(
    @Param('id') id: string,
    @Body() dto: UpdateFootageChecklistDto,
    @Headers('x-workspace-id') headerWorkspaceId?: string,
    @Query('workspaceId') queryWorkspaceId?: string,
  ) {
    const wsId = queryWorkspaceId || headerWorkspaceId;
    if (!wsId || !dto.items) {
      throw new BadRequestException('workspaceId and items are required');
    }
    return this.campaignsService.updateFootageChecklist(wsId, id, dto);
  }

  // ==========================================
  // CAMPAIGN ASSETS (Section 10)
  // ==========================================

  @Get(':id/assets')
  @ApiOperation({ summary: 'Get assets linked to this campaign' })
  getCampaignAssets(
    @Param('id') id: string,
    @Headers('x-workspace-id') headerWorkspaceId?: string,
    @Query('workspaceId') queryWorkspaceId?: string,
  ) {
    const wsId = queryWorkspaceId || headerWorkspaceId;
    if (!wsId) {
      throw new BadRequestException('workspaceId is required');
    }
    return this.campaignsService.getCampaignAssets(wsId, id);
  }

  @Post(':id/assets')
  @ApiOperation({ summary: 'Upload and link a new asset to this campaign' })
  linkAsset(
    @Param('id') id: string,
    @Body() dto: LinkCampaignAssetDto,
    @Headers('x-workspace-id') headerWorkspaceId?: string,
    @Query('workspaceId') queryWorkspaceId?: string,
  ) {
    const wsId = queryWorkspaceId || headerWorkspaceId;
    if (!wsId || !dto.title || !dto.url) {
      throw new BadRequestException('workspaceId, title, and url are required');
    }
    return this.campaignsService.linkAsset(wsId, id, dto);
  }

  @Delete(':id/assets/:linkId')
  @ApiOperation({ summary: 'Unlink an asset from campaign (preserves underlying file in global storage)' })
  unlinkAsset(
    @Param('id') id: string,
    @Param('linkId') linkId: string,
    @Headers('x-workspace-id') headerWorkspaceId?: string,
    @Query('workspaceId') queryWorkspaceId?: string,
  ) {
    const wsId = queryWorkspaceId || headerWorkspaceId;
    if (!wsId) {
      throw new BadRequestException('workspaceId is required');
    }
    this.campaignsService.unlinkAsset(wsId, id, linkId);
    return { success: true, message: 'Asset unlinked from campaign' };
  }

  // ==========================================
  // SHARED TASK ENGINE INTEGRATION (Section 9)
  // ==========================================

  @Post(':id/tasks')
  @ApiOperation({ summary: 'Create a campaign task in the shared task engine' })
  createCampaignTask(
    @Param('id') id: string,
    @Body() dto: CreateCampaignTaskDto,
    @Headers('x-workspace-id') headerWorkspaceId?: string,
    @Query('workspaceId') queryWorkspaceId?: string,
  ) {
    const wsId = queryWorkspaceId || headerWorkspaceId;
    if (!wsId || !dto.title) {
      throw new BadRequestException('workspaceId and title are required');
    }
    return this.campaignsService.createCampaignTask(wsId, id, dto);
  }

  @Get(':id/tasks')
  @ApiOperation({ summary: 'Get all shared tasks linked to this campaign' })
  getCampaignTasks(
    @Param('id') id: string,
    @Headers('x-workspace-id') headerWorkspaceId?: string,
    @Query('workspaceId') queryWorkspaceId?: string,
  ) {
    const wsId = queryWorkspaceId || headerWorkspaceId;
    if (!wsId) {
      throw new BadRequestException('workspaceId is required');
    }
    return this.campaignsService.getCampaignTasks(wsId, id);
  }

  @Patch(':id/archive')
  @ApiOperation({ summary: 'Archive and close a campaign' })
  archiveCampaign(
    @Param('id') id: string,
    @Headers('x-workspace-id') headerWorkspaceId?: string,
    @Query('workspaceId') queryWorkspaceId?: string,
  ) {
    const wsId = queryWorkspaceId || headerWorkspaceId;
    if (!wsId) {
      throw new BadRequestException('workspaceId is required');
    }
    return this.campaignsService.archiveCampaign(wsId, id);
  }

  // ==========================================
  // CONTENT EVENTS (Milestones & Calendar)
  // ==========================================

  @Post(':id/content')
  @ApiOperation({ summary: 'Add a content event/milestone to a campaign' })
  createContentEvent(
    @Param('id') campaignId: string,
    @Body() dto: Omit<CreateContentEventDto, 'campaignId'>,
  ) {
    if (!dto.workspaceId || !dto.title || !dto.eventType || !dto.plannedDate) {
      throw new BadRequestException('workspaceId, title, eventType, and plannedDate are required');
    }
    return this.campaignsService.createContentEvent({
      ...dto,
      campaignId,
    });
  }

  @Patch('content/:eventId/reschedule')
  @ApiOperation({ summary: 'Reschedule content event and append reschedule history' })
  @ApiQuery({ name: 'workspaceId', required: true })
  rescheduleContentEvent(
    @Param('eventId') eventId: string,
    @Query('workspaceId') workspaceId: string,
    @Body() dto: RescheduleContentEventDto,
  ) {
    if (!workspaceId || !dto.newDate || !dto.reason) {
      throw new BadRequestException('workspaceId, newDate, and reason are required');
    }
    return this.campaignsService.rescheduleContentEvent(workspaceId, eventId, dto);
  }

  @Patch('content/:eventId/publish')
  @ApiOperation({ summary: 'Mark content item as published with actual date and live URL' })
  @ApiQuery({ name: 'workspaceId', required: true })
  markContentPublished(
    @Param('eventId') eventId: string,
    @Query('workspaceId') workspaceId: string,
    @Body() dto: MarkContentPublishedDto,
  ) {
    if (!workspaceId || !dto.publicUrl) {
      throw new BadRequestException('workspaceId and publicUrl are required');
    }
    return this.campaignsService.markContentPublished(workspaceId, eventId, dto);
  }
}
