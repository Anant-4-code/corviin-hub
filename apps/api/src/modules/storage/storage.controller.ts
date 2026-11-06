import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { StorageService } from './storage.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Storage & Operations')
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Public()
  @Get('health')
  @ApiOperation({ summary: 'Operational storage health check' })
  async getHealth() {
    const health = await this.storageService.getStorageHealth();
    return {
      status: 'ok',
      data: health,
    };
  }
}

