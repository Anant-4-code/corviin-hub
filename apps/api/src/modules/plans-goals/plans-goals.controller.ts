import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Plans & Goals')
@Controller('plans-goals')
export class PlansGoalsController {
  @Get()
  @ApiOperation({ summary: 'Plans & Goals overview — placeholder' })
  getOverview() {
    return {
      data: null,
      message: 'Plans & Goals module — not yet implemented. Planned for Phase 3.',
      module: 'plans-goals',
      status: 'placeholder',
    };
  }
}
