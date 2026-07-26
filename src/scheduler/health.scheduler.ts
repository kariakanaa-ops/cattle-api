import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { AuditService } from '../audit/audit.service';

import {
  AuditAction,
  HealthRecordType,
  NotificationStatus,
  NotificationType,
  TaskCategory,
  TaskPriority,
  TaskStatus,
} from '@prisma/client';

@Injectable()
export class HealthScheduler {

  private readonly logger =
    new Logger(HealthScheduler.name);

  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
    private audit: AuditService,
  ) {}
/*
============================================================
PREVENTIVE HEALTH AUTOMATION
============================================================
*/

@Cron('0 7 * * *')
async checkPreventiveHealth() {

  this.logger.log('Running preventive health automation...');

  const today = new Date();

  const nextWeek = new Date();

  nextWeek.setDate(today.getDate() + 7);

  const records =
    await this.prisma.healthRecord.findMany({

      where: {

        nextVisit: {

          gte: today,

          lte: nextWeek,

        },

      },

      include: {

        cattle: true,

      },

    });

  for (const record of records) {

    await this.createHealthReminder(record);

  }

}
private async createHealthReminder(
  record: any,
) {

  let title = '';

  switch (record.type) {

    case 'Vaccination':
      title = 'Vaccination Reminder';
      break;

    case 'Deworming':
      title = 'Deworming Reminder';
      break;

    case 'PregnancyCheck':
      title = 'Pregnancy Check';
      break;

    case 'Treatment':
      title = 'Treatment Follow-up';
      break;

    case 'Disease':
      title = 'Veterinary Review';
      break;

    case 'Injury':
      title = 'Injury Review';
      break;

    case 'Surgery':
      title = 'Surgery Follow-up';
      break;

    default:
      title = 'Health Review';

  }

  const existing =
    await this.prisma.task.findFirst({

      where: {

        cattleId: record.cattleId,

        title,

        status: {

          not: TaskStatus.Completed,

        },

      },

    });

  if (existing) {

    return;

  }

  const task =
    await this.prisma.task.create({

      data: {

        title,

        description:
          `${title} for ${record.cattle.tagNumber}`,

        category:
          TaskCategory.Health,

        priority:
          TaskPriority.High,

        status:
          TaskStatus.Pending,

        dueDate:
          record.nextVisit,

        cattleId:
          record.cattleId,

        createdBy:
          'SYSTEM',

        notes:
          record.notes,

      },

    });

  await this.notifications.create({

    title,

    message:
      `${record.cattle.tagNumber} requires ${record.type}.`,

    type:
      NotificationType.Warning,

    status:
      NotificationStatus.Unread,

    entityType:
      'HealthRecord',

    entityId:
      record.id,

  });

  await this.audit.log({

    entity:
      'HealthRecord',

    entityId:
      record.id,

    action:
      AuditAction.CREATE,

    description:
      'Automatic preventive health reminder created.',

    newValues:
      task,

  });
}
}