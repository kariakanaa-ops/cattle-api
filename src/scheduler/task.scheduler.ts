import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { AuditService } from '../audit/audit.service';

import {
  AuditAction,
  NotificationStatus,
  NotificationType,
  TaskStatus,
} from '@prisma/client';

@Injectable()
export class TaskScheduler {

  private readonly logger =
    new Logger(TaskScheduler.name);

  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
    private audit: AuditService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async checkOverdueTasks() {

    this.logger.log('Checking overdue tasks...');

    const overdue =
      await this.prisma.task.findMany({

        where: {

          dueDate: {
            lt: new Date(),
          },

          status: {
            not: TaskStatus.Completed,
          },

        },

      });

    for (const task of overdue) {

      await this.prisma.task.update({

        where: {
          id: task.id,
        },

        data: {
          status: TaskStatus.Overdue,
        },

      });

      await this.notifications.create({

        title: 'Task Overdue',

        message:
          `${task.title} is overdue.`,

        type: NotificationType.Warning,

        status:
          NotificationStatus.Unread,

        entityType: 'Task',

        entityId: task.id,

        userId:
          task.assignedTo ?? undefined,

      });

      await this.audit.log({

        entity: 'Task',

        entityId: task.id,

        action: AuditAction.UPDATE,

        description:
          'Task automatically marked overdue.',

      });

    }

  }

}