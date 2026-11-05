import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

describe('ProfilesController', () => {
  let controller: ProfilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfilesController],
      providers: [ProfilesService],
    }).compile();

    controller = module.get<ProfilesController>(ProfilesController);
  });

  it('should return all profiles', () => {
    const result = controller.findAll();
    expect(result.data).toHaveLength(3);
    expect(result.data[0].displayName).toBe('Anant');
    expect(result.data[1].displayName).toBe('Rohit');
    expect(result.data[2].displayName).toBe('Utkarsh');
  });

  it('should return a profile by ID', () => {
    const result = controller.findOne('a1b2c3d4-e5f6-7890-abcd-ef1234567890');
    expect(result.data.displayName).toBe('Anant');
  });

  it('should throw NotFoundException for invalid ID', () => {
    expect(() => controller.findOne('nonexistent-id')).toThrow(NotFoundException);
  });
});
