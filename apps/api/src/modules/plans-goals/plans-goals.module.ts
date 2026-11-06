import { Module } from '@nestjs/common';
import { PlansGoalsController } from './plans-goals.controller';
import { PlansGoalsService } from './plans-goals.service';
import { WorkspacesModule } from '../workspaces/workspaces.module';
import { ProfilesModule } from '../profiles/profiles.module';

@Module({
  imports: [WorkspacesModule, ProfilesModule],
  controllers: [PlansGoalsController],
  providers: [PlansGoalsService],
  exports: [PlansGoalsService],
})
export class PlansGoalsModule {}
