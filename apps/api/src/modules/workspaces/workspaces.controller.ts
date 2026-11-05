import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { WorkspacesService } from './workspaces.service';
import { ApiSuccessResponse } from '../../common';

@ApiTags('Workspaces')
@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Get()
  @ApiOperation({ summary: 'List available workspaces' })
  findAll() {
    const workspaces = this.workspacesService.findAll();
    return new ApiSuccessResponse(workspaces);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get workspace by ID' })
  @ApiParam({ name: 'id', description: 'Workspace UUID' })
  findOne(@Param('id') id: string) {
    const workspace = this.workspacesService.findById(id);
    if (!workspace) {
      throw new NotFoundException(`Workspace ${id} not found`);
    }
    return new ApiSuccessResponse(workspace);
  }
}
