import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Campaigns')
@Controller('campaigns')
export class CampaignsController {
  @Get()
  @ApiOperation({ summary: 'Campaigns overview — placeholder' })
  getOverview() {
    return {
      data: null,
      message: 'Campaigns module — not yet implemented. Planned for Phase 3.',
      module: 'campaigns',
      status: 'placeholder',
    };
  }
}
