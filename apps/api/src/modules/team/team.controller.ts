import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Team')
@Controller('team')
export class TeamController {
  @Get()
  @ApiOperation({ summary: 'Team overview — placeholder' })
  getOverview() {
    return {
      data: null,
      message: 'Team module — not yet implemented. Planned for Phase 3.',
      module: 'team',
      status: 'placeholder',
    };
  }
}
