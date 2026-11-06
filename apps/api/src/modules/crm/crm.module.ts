import { Module } from '@nestjs/common';
import { CrmController } from './crm.controller';
import { CrmService } from './crm.service';
import { TasksModule } from '../tasks/tasks.module';
import { MeetingsModule } from '../meetings/meetings.module';
import { WorkspacesModule } from '../workspaces/workspaces.module';

@Module({
  imports: [TasksModule, MeetingsModule, WorkspacesModule],
  controllers: [CrmController],
  providers: [CrmService],
  exports: [CrmService],
})
export class CrmModule {}
