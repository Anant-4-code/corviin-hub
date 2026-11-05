import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Meetings')
@Controller('meetings')
export class MeetingsController {
  @Get()
  @ApiOperation({ summary: 'Meetings overview — placeholder' })
  getOverview() {
    return {
      data: null,
      message: 'Meetings module — not yet implemented. Planned for Phase 3.',
      module: 'meetings',
      status: 'placeholder',
    };
  }
}
