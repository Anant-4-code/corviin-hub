import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { WorkspacesModule } from '../workspaces/workspaces.module';
import { ProfilesModule } from '../profiles/profiles.module';

@Module({
  imports: [WorkspacesModule, ProfilesModule],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
