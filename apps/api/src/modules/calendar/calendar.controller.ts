import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Calendar')
@Controller('calendar')
export class CalendarController {
  @Get()
  @ApiOperation({ summary: 'Calendar overview — placeholder' })
  getOverview() {
    return {
      data: null,
      message: 'Calendar module — not yet implemented. Planned for Phase 3.',
      module: 'calendar',
      status: 'placeholder',
    };
  }
}
