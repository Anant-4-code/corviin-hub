import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  @Get()
  @ApiOperation({ summary: 'Tasks overview — placeholder' })
  getOverview() {
    return {
      data: null,
      message: 'Tasks module — not yet implemented. Planned for Phase 3.',
      module: 'tasks',
      status: 'placeholder',
    };
  }
}
