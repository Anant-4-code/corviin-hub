import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('CRM')
@Controller('crm')
export class CrmController {
  @Get()
  @ApiOperation({ summary: 'CRM overview — placeholder' })
  getOverview() {
    return {
      data: null,
      message: 'CRM module — not yet implemented. Planned for Phase 3.',
      module: 'crm',
      status: 'placeholder',
    };
  }
}
