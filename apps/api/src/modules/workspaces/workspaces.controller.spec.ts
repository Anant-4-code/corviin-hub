import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { WorkspacesController } from './workspaces.controller';
import { WorkspacesService } from './workspaces.service';

describe('WorkspacesController', () => {
  let controller: WorkspacesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkspacesController],
      providers: [WorkspacesService],
    }).compile();

    controller = module.get<WorkspacesController>(WorkspacesController);
  });

  it('should return all workspaces', () => {
    const result = controller.findAll();
    expect(result.data).toHaveLength(2);
    expect(result.data[0].name).toBe('Corviin Tech');
    expect(result.data[1].name).toBe('Corviin Real Estate');
  });

  it('should return a workspace by ID', () => {
    const result = controller.findOne('ws-tech-0001-0000-000000000001');
    expect(result.data.name).toBe('Corviin Tech');
  });

  it('should throw NotFoundException for invalid ID', () => {
    expect(() => controller.findOne('nonexistent-id')).toThrow(NotFoundException);
  });
});
