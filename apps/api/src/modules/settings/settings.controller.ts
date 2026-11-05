import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  @Get()
  @ApiOperation({ summary: 'Settings overview — placeholder' })
  getOverview() {
    return {
      data: null,
      message: 'Settings module — not yet implemented. Planned for Phase 3.',
      module: 'settings',
      status: 'placeholder',
    };
  }
}
