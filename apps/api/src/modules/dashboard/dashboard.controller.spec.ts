import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

describe('DashboardController', () => {
  let controller: DashboardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [DashboardService],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return workspace dashboard summary with real aggregated metrics', async () => {
    const result = await controller.getSummary('ws-tech-0001-0000-000000000001');
    expect(result.status).toBe('ok');
    expect(result.data).toBeDefined();
    expect(result.data.metrics).toBeDefined();
    expect(typeof result.data.metrics.openTasksCount).toBe('number');
    expect(typeof result.data.metrics.crmLeadsCount).toBe('number');
  });
});

