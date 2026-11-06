import { Controller, Get, Optional } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';
import { Public } from '../../common';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  private readonly startTime = Date.now();

  constructor(@Optional() private readonly prisma?: PrismaService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'API health check' })
  check() {
    const isConnected = this.prisma?.getConnectionStatus() ?? false;
    const isMockStorage =
      !process.env.R2_ACCESS_KEY_ID ||
      process.env.R2_ACCESS_KEY_ID.startsWith('mock-');

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION || '0.1.0',
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      services: {
        database: isConnected ? 'connected' : 'disconnected',
        storage: isMockStorage ? 'mock' : 'r2',
      },
    };
  }
}
