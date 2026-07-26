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
export class InventoryScheduler {

  private readonly logger =
    new Logger(InventoryScheduler.name);

  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
    private audit: AuditService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_11PM)
  async checkInventory() {

    this.logger.log('Checking inventory...');

    const items =
      await this.prisma.inventory.findMany();

    for (const item of items) {

      if (item.quantity > item.reorderLevel) {
        continue;
      }

      const existing =
        await this.prisma.task.findFirst({

          where: {

            title: `Reorder ${item.itemName}`,

            status: {
              not: TaskStatus.Completed,
            },

          },

        });

      if (existing) {
        continue;
      }

      const task =
        await this.prisma.task.create({

          data: {

            title: `Reorder ${item.itemName}`,

            description:
              'Inventory below reorder level.',

            category: TaskCategory.Inventory,

            priority: TaskPriority.High,

            status: TaskStatus.Pending,

            dueDate: new Date(),

            createdBy: 'SYSTEM',

          },

        });

      await this.notifications.create({

        title: 'Low Inventory',

        message:
          `${item.itemName} requires replenishment.`,

        type: NotificationType.Warning,

        status: NotificationStatus.Unread,

        entityType: 'Inventory',

        entityId: item.id,

      });

      await this.audit.log({

        entity: 'Inventory',

        entityId: item.id,

        action: AuditAction.UPDATE,

        description:
          'Automatic reorder task created.',

        newValues: task,

      });

    }

  }

}