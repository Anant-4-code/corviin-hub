import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  @Get()
  @ApiOperation({ summary: 'Dashboard overview — placeholder' })
  getOverview() {
    return {
      data: null,
      message: 'Dashboard module — not yet implemented. Planned for Phase 3.',
      module: 'dashboard',
      status: 'placeholder',
    };
  }
}
