import { Module } from '@nestjs/common';
import { PlansGoalsController } from './plans-goals.controller';

@Module({
  controllers: [PlansGoalsController],
})
export class PlansGoalsModule {}
