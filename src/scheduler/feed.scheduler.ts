import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { AuditService } from '../audit/audit.service';

import {
  AuditAction,
  NotificationStatus,
  NotificationType,
  TaskCategory,
  TaskPriority,
  TaskStatus,
} from '@prisma/client';

@Injectable()
export class FeedScheduler {
  private readonly logger = new Logger(FeedScheduler.name);

  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
    private audit: AuditService,
  ) {}

  /*
  ============================================================
  FEED SCHEDULER
  ============================================================
  */
  @Cron('0 6 * * *')
  async morningFeedSchedule() {
    this.logger.log('Running morning feed scheduler...');
    await this.generateFeedTasks('06:00');
  }

  @Cron('0 12 * * *')
  async afternoonFeedSchedule() {
    this.logger.log('Running afternoon feed scheduler...');
    await this.generateFeedTasks('12:00');
  }

  @Cron('0 16 * * *')
  async eveningFeedSchedule() {
    this.logger.log('Running evening feed scheduler...');
    await this.generateFeedTasks('16:00');
  }

  private async generateFeedTasks(time: string): Promise<void> {
    // TODO: implement feed generation logic
  }

  /*
  ============================================================
  VERIFY FEED SCHEDULES
  ============================================================
  */
  @Cron(CronExpression.EVERY_HOUR)
  async verifyFeedSchedules() {
    this.logger.log('Verifying feed schedules...');

    const totalSchedules = await this.prisma.scheduledFeedRatio.count({
      where: {
        active: true,
      },
    });

    if (totalSchedules === 0) {
      await this.notifications.create({
        title: 'Feed Scheduler',
        message: 'No active feed schedules found.',
        type: NotificationType.Warning,
        status: NotificationStatus.Unread,
      });

      return;
    }

    const currentHour = new Date().getHours();
    let expectedTime = '';

    if (currentHour >= 5 && currentHour < 10) {
      expectedTime = '06:00';
    } else if (currentHour >= 10 && currentHour < 15) {
      expectedTime = '12:00';
    } else if (currentHour >= 15 && currentHour < 20) {
      expectedTime = '16:00';
    }

    if (!expectedTime) {
      return;
    }

    const schedules = await this.prisma.scheduledFeedRatio.findMany({
      where: {
        active: true,
        scheduledTime: expectedTime,
      },
    });

    if (schedules.length === 0) {
      await this.notifications.create({
        title: 'Feed Schedule Warning',
        message: `No feed schedules configured for ${expectedTime}.`,
        type: NotificationType.Warning,
        status: NotificationStatus.Unread,
      });
    }
  }
}