import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';
import { NotificationModule } from '../notifications/notifications.module';

import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  imports: [
    PrismaModule,
    AuditModule,
    NotificationModule,
  ],
  controllers: [
    TaskController,
  ],
  providers: [
    TaskService,
  ],
  exports: [
    TaskService,
  ],
})
export class TaskModule {}