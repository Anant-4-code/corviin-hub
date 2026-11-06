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
import { ApiTags, ApiOperation, ApiHeader, ApiQuery } from '@nestjs/swagger';
import {
  CreateFolderDto,
  UpdateFolderDto,
  MoveFolderDto,
  DeleteFolderDto,
} from '@corviin-hub/shared';
import { FoldersService } from './folders.service';

@ApiTags('Folders')
@Controller('folders')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  private resolveWorkspaceId(headerWs?: string, queryWs?: string): string {
    const ws = headerWs || queryWs;
    if (!ws) {
      throw new BadRequestException('Workspace context is required via x-workspace-id header or workspaceId query parameter.');
    }
    return ws;
  }

  @Get()
  @ApiOperation({ summary: 'List all folders for active workspace' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  @ApiQuery({ name: 'workspaceId', required: false })
  @ApiQuery({ name: 'tree', required: false, type: Boolean })
  @ApiQuery({ name: 'includeArchived', required: false, type: Boolean })
  findAll(
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
    @Query('tree') tree?: string,
    @Query('includeArchived') includeArchived?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    const isTree = tree === 'true';
    const withArchived = includeArchived === 'true';

    if (isTree) {
      return this.foldersService.getFolderTree(workspaceId, withArchived);
    }
    return this.foldersService.findAll(workspaceId, withArchived);
  }

  @Get('tree')
  @ApiOperation({ summary: 'Get hierarchical nested folder tree' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  @ApiQuery({ name: 'workspaceId', required: false })
  getTree(
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.foldersService.getFolderTree(workspaceId);
  }

  @Get('suggestion')
  @ApiOperation({ summary: 'Suggest destination folder based on source and file type' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  @ApiQuery({ name: 'workspaceId', required: false })
  @ApiQuery({ name: 'source', required: false })
  @ApiQuery({ name: 'mimeType', required: false })
  getSuggestion(
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
    @Query('source') source?: string,
    @Query('mimeType') mimeType?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.foldersService.getFolderSuggestion(workspaceId, source, mimeType);
  }

  @Post('seed-defaults')
  @ApiOperation({ summary: 'Deterministically provision default workspace folders' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  @ApiQuery({ name: 'workspaceId', required: false })
  seedDefaults(
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    const created = this.foldersService.provisionWorkspaceDefaults(workspaceId);
    return { success: true, count: created.length, folders: created };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get folder details, subfolders, and breadcrumb path' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  @ApiQuery({ name: 'workspaceId', required: false })
  findOne(
    @Param('id') id: string,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.foldersService.findOne(workspaceId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create root folder or nested subfolder' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  @ApiQuery({ name: 'workspaceId', required: false })
  create(
    @Body() dto: CreateFolderDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.foldersService.create(workspaceId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update folder name, description, color or icon' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  @ApiQuery({ name: 'workspaceId', required: false })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateFolderDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.foldersService.update(workspaceId, id, dto);
  }

  @Post(':id/move')
  @ApiOperation({ summary: 'Move folder to new parent (circular movement protected)' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  @ApiQuery({ name: 'workspaceId', required: false })
  move(
    @Param('id') id: string,
    @Body() dto: MoveFolderDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.foldersService.move(workspaceId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Safely delete folder with asset relocation strategy' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  @ApiQuery({ name: 'workspaceId', required: false })
  delete(
    @Param('id') id: string,
    @Body() dto: DeleteFolderDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.foldersService.delete(workspaceId, id, dto?.strategy || 'move_to_parent');
  }
}

