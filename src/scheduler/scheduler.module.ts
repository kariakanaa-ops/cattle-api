import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { NotificationModule } from '../notifications/notifications.module';import { AuditModule } from '../audit/audit.module';

import { SchedulerService } from './scheduler.service';

import { TaskScheduler } from './task.scheduler';
import { InventoryScheduler } from './inventory.scheduler';
import { FeedScheduler } from './feed.scheduler';
import { HealthScheduler } from './health.scheduler';
import { BreedingScheduler } from './breeding.scheduler';
import { MilkScheduler } from './milk.scheduler';
@Module({
  imports: [
    PrismaModule,
    NotificationModule,
    AuditModule,
  ],
  providers: [
    SchedulerService,
    TaskScheduler,
    InventoryScheduler,
    FeedScheduler,
    HealthScheduler,
    BreedingScheduler,
    MilkScheduler,
  ],
})
export class SchedulerModule {}