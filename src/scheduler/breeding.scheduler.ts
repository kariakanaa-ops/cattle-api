import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { AuditService } from '../audit/audit.service';

import {
  AuditAction,
  NotificationStatus,
  NotificationType,
  PregnancyStatus,
  TaskCategory,
  TaskPriority,
  TaskStatus,
} from '@prisma/client';

@Injectable()
export class BreedingScheduler {

  private readonly logger =
    new Logger(BreedingScheduler.name);

  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
    private audit: AuditService,
  ) {}

  @Cron('0 8 * * *')
  async checkBreedingActivities() {

    this.logger.log('Checking breeding activities...');

    await this.checkPregnancyDiagnosis();

    await this.checkExpectedCalving();

    await this.checkDryOff();

  }

  private async checkPregnancyDiagnosis() {

    const today = new Date();

    const start = new Date(today);

    start.setDate(start.getDate() - 45);

    const end = new Date(today);

    end.setDate(end.getDate() - 30);

    const records =
      await this.prisma.breedingRecord.findMany({

        where: {

          breedingDate: {

            gte: start,

            lte: end,

          },

          pregnancyStatus:
            PregnancyStatus.Open,

        },

        include: {

          cattle: true,

        },

      });

    for (const record of records) {

      await this.createBreedingTask(

        record.cattleId,

        'Pregnancy Diagnosis',

        `Pregnancy diagnosis for ${record.cattle.tagNumber}`,

      );

    }

  }

  private async checkExpectedCalving() {

    const today = new Date();

    const nextWeek = new Date(today);

    nextWeek.setDate(nextWeek.getDate() + 7);

    const records =
      await this.prisma.breedingRecord.findMany({

        where: {

          pregnancyStatus:
            PregnancyStatus.Pregnant,

          actualCalving: null,

          expectedCalving: {

            gte: today,

            lte: nextWeek,

          },

        },

        include: {

          cattle: true,

        },

      });

    for (const record of records) {

      await this.createBreedingTask(

        record.cattleId,

        'Prepare for Calving',

        `${record.cattle.tagNumber} expected to calve soon.`,

      );

    }

  }

  private async checkDryOff() {

    const today = new Date();

    const target = new Date(today);

    target.setDate(target.getDate() + 60);

    const start = new Date(target);

    start.setHours(0,0,0,0);

    const end = new Date(target);

    end.setHours(23,59,59,999);

    const records =
      await this.prisma.breedingRecord.findMany({

        where: {

          pregnancyStatus:
            PregnancyStatus.Pregnant,

          actualCalving: null,

          expectedCalving: {

            gte: start,

            lte: end,

          },

        },

        include: {

          cattle: true,

        },

      });

    for (const record of records) {

      await this.createBreedingTask(

        record.cattleId,

        'Dry Off Cow',

        `${record.cattle.tagNumber} should be dried off.`,

      );

    }

  }

  private async createBreedingTask(

    cattleId: string,

    title: string,

    description: string,

  ) {

    const exists =
      await this.prisma.task.findFirst({

        where: {

          cattleId,

          title,

          status: {

            not: TaskStatus.Completed,

          },

        },

      });

    if (exists) {

      return;

    }

    const task =
      await this.prisma.task.create({

        data: {

          cattleId,

          title,

          description,

          category: TaskCategory.Breeding,

          priority: TaskPriority.High,

          status: TaskStatus.Pending,

          dueDate: new Date(),

          createdBy: 'SYSTEM',

        },

      });

    await this.notifications.create({

      title,

      message: description,

      type: NotificationType.Warning,

      status: NotificationStatus.Unread,

      entityType: 'Task',

      entityId: task.id,

    });

    await this.audit.log({

      entity: 'Task',

      entityId: task.id,

      action: AuditAction.CREATE,

      description,

      newValues: task,

    });

  }

}