import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiQuery } from '@nestjs/swagger';
import {
  AssetFilterDto,
  UploadIntentDto,
  ConfirmUploadDto,
  DirectUploadDto,
  CreateAssetVersionDto,
  AddAssetRelationshipDto,
  UpdateAssetMetadataDto,
  MoveAssetDto,
  BulkMoveAssetsDto,
  AssetCategory,
  AssetTypeGroup,
} from '@corviin-hub/shared';
import { AssetsService } from './assets.service';

@ApiTags('Assets')
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  private resolveWorkspaceId(headerWs?: string, queryWs?: string): string {
    const ws = headerWs || queryWs;
    if (!ws) {
      throw new BadRequestException('Workspace context is required via x-workspace-id header or workspaceId query parameter.');
    }
    return ws;
  }

  @Get()
  @ApiOperation({ summary: 'List and filter workspace assets with summary statistics and pagination' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  @ApiQuery({ name: 'workspaceId', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'category', required: false, enum: AssetCategory })
  @ApiQuery({ name: 'typeGroup', required: false, enum: AssetTypeGroup })
  @ApiQuery({ name: 'folderId', required: false })
  @ApiQuery({ name: 'includeSubfolders', required: false, type: Boolean })
  @ApiQuery({ name: 'viewModeFilter', required: false, enum: ['all', 'folders', 'recent', 'linked'] })
  @ApiQuery({ name: 'campaignId', required: false })
  @ApiQuery({ name: 'meetingId', required: false })
  @ApiQuery({ name: 'planId', required: false })
  @ApiQuery({ name: 'taskId', required: false })
  @ApiQuery({ name: 'crmRecordId', required: false })
  @ApiQuery({ name: 'uploaderId', required: false })
  @ApiQuery({ name: 'tag', required: false })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['date', 'name', 'size'] })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  findAll(
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
    @Query('search') search?: string,
    @Query('category') category?: AssetCategory,
    @Query('typeGroup') typeGroup?: AssetTypeGroup,
    @Query('folderId') folderId?: string,
    @Query('includeSubfolders') includeSubfolders?: string,
    @Query('viewModeFilter') viewModeFilter?: 'all' | 'folders' | 'recent' | 'linked',
    @Query('campaignId') campaignId?: string,
    @Query('meetingId') meetingId?: string,
    @Query('planId') planId?: string,
    @Query('taskId') taskId?: string,
    @Query('crmRecordId') crmRecordId?: string,
    @Query('uploaderId') uploaderId?: string,
    @Query('tag') tag?: string,
    @Query('sortBy') sortBy?: 'date' | 'name' | 'size',
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    const filterDto: AssetFilterDto = {
      search,
      category,
      typeGroup,
      folderId,
      includeSubfolders: includeSubfolders === 'true',
      viewModeFilter,
      campaignId,
      meetingId,
      planId,
      taskId,
      crmRecordId,
      uploaderId,
      tag,
      sortBy,
      sortOrder,
      page: page ? parseInt(page, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
    };
    return this.assetsService.findAll(workspaceId, filterDto);
  }

  @Post('bulk-move')
  @ApiOperation({ summary: 'Move multiple assets to a destination folder' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  bulkMove(
    @Body() dto: BulkMoveAssetsDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.assetsService.bulkMoveAssets(workspaceId, dto);
  }

  @Post(':id/move')
  @ApiOperation({ summary: 'Move an asset to a target folder (or root if null)' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  move(
    @Param('id') id: string,
    @Body() dto: MoveAssetDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.assetsService.moveAsset(workspaceId, id, dto.targetFolderId);
  }

  @Post('upload-intent')
  @ApiOperation({ summary: 'Request presigned upload intent and authorization token' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  getUploadIntent(
    @Body() dto: UploadIntentDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.assetsService.getUploadIntent(workspaceId, dto);
  }

  @Post('confirm-upload')
  @ApiOperation({ summary: 'Confirm completed upload and register asset and initial version' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  confirmUpload(
    @Body() dto: ConfirmUploadDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.assetsService.confirmUpload(workspaceId, dto);
  }

  @Post('direct-upload')
  @ApiOperation({ summary: 'Direct asset upload / registration (development & testing helper)' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  directUpload(
    @Body() dto: DirectUploadDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.assetsService.directUpload(workspaceId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get asset details including versions and linked relationships' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  findOne(
    @Param('id') id: string,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.assetsService.findOne(workspaceId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update asset title, category, description or tags' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  updateMetadata(
    @Param('id') id: string,
    @Body() dto: UpdateAssetMetadataDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.assetsService.updateMetadata(workspaceId, id, dto);
  }

  @Post(':id/versions')
  @ApiOperation({ summary: 'Upload and register a new version of an existing asset' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  addVersion(
    @Param('id') id: string,
    @Body() dto: CreateAssetVersionDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.assetsService.addVersion(workspaceId, id, dto);
  }

  @Post(':id/relationships')
  @ApiOperation({ summary: 'Link asset to a campaign, task, meeting or CRM record' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  addRelationship(
    @Param('id') id: string,
    @Body() dto: AddAssetRelationshipDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.assetsService.addRelationship(workspaceId, id, dto);
  }

  @Delete(':id/relationships/:relationshipId')
  @ApiOperation({ summary: 'Unlink asset from a record (non-destructive: preserves asset file)' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  removeRelationship(
    @Param('id') id: string,
    @Param('relationshipId') relationshipId: string,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    this.assetsService.removeRelationship(workspaceId, id, relationshipId);
    return { success: true, message: 'Relationship unlinked successfully. Asset preserved.' };
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Get short-lived authorized download link for current or specified version' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  @ApiQuery({ name: 'versionId', required: false })
  getAuthorizedDownload(
    @Param('id') id: string,
    @Query('versionId') versionId?: string,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.assetsService.getAuthorizedDownload(workspaceId, id, versionId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Permanently delete an asset record and storage binary' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  delete(
    @Param('id') id: string,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.assetsService.delete(workspaceId, id);
  }
}
