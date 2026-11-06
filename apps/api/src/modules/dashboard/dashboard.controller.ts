import { Controller, Get, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get workspace dashboard metrics and aggregated KPIs' })
  @ApiHeader({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' })
  async getSummary(@Headers('x-workspace-id') workspaceId: string) {
    const wsId = workspaceId || 'ws-tech-0001-0000-000000000001';
    const summary = await this.dashboardService.getSummary(wsId);
    return {
      data: summary,
      status: 'ok',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Dashboard overview route' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  async getOverview(@Headers('x-workspace-id') workspaceId: string) {
    const wsId = workspaceId || 'ws-tech-0001-0000-000000000001';
    const summary = await this.dashboardService.getSummary(wsId);
    return {
      data: summary,
      status: 'ok',
    };
  }
}
