import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  @Get()
  @ApiOperation({ summary: 'Notifications overview — placeholder' })
  getOverview() {
    return {
      data: null,
      message: 'Notifications module — not yet implemented. Planned for Phase 3.',
      module: 'notifications',
      status: 'placeholder',
    };
  }
}
