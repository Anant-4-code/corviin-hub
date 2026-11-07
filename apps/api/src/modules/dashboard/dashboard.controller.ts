import { Controller, Get, Headers, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiQuery } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get workspace dashboard metrics and aggregated KPIs' })
  @ApiHeader({ name: 'x-workspace-id', required: false, description: 'Active workspace ID' })
  @ApiQuery({ name: 'workspaceId', required: false, description: 'Active workspace ID' })
  async getSummary(
    @Headers('x-workspace-id') headerWsId?: string,
    @Query('workspaceId') queryWsId?: string,
  ) {
    const wsId = headerWsId || queryWsId || 'ws-tech-0001-0000-000000000001';
    const summary = await this.dashboardService.getSummary(wsId);
    return {
      data: summary,
      status: 'ok',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Dashboard overview route' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  @ApiQuery({ name: 'workspaceId', required: false })
  async getOverview(
    @Headers('x-workspace-id') headerWsId?: string,
    @Query('workspaceId') queryWsId?: string,
  ) {
    const wsId = headerWsId || queryWsId || 'ws-tech-0001-0000-000000000001';
    const summary = await this.dashboardService.getSummary(wsId);
    return {
      data: summary,
      status: 'ok',
    };
  }
}
