import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Assets')
@Controller('assets')
export class AssetsController {
  @Get()
  @ApiOperation({ summary: 'Assets overview — placeholder' })
  getOverview() {
    return {
      data: null,
      message: 'Assets module — not yet implemented. Planned for Phase 3.',
      module: 'assets',
      status: 'placeholder',
    };
  }
}
