import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

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
  MilkingSession,
} from '@prisma/client';
@Injectable()
export class MilkScheduler {
  private readonly logger = new Logger(MilkScheduler.name);

  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
    private audit: AuditService,
  ) {}

  @Cron('0 8 * * *')
  async verifyMilkRecords() {
    this.logger.log('Checking missing milk records...');
    await this.checkMissingMilkRecords();
  }

  @Cron('30 23 * * *')
  async dailyMilkAnalysis() {
    this.logger.log('Running milk intelligence...');
    await this.checkProductionDrop();
  }

  private async checkMissingMilkRecords() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cattle = await this.prisma.cattle.findMany({
      where: {
        active: true,
      },
      include: {
        group: true,
      },
    });

    const sessions = ['Morning', 'Afternoon', 'Evening'];

    for (const cow of cattle) {
      for (const session of sessions) {
        const record = await this.prisma.milkProduction.findFirst({
          where: {
            cattleId: cow.id,
            session: session as any,
            date: {
              gte: today,
            },
          },
        });

        if (record) {
          continue;
        }

        const exists = await this.prisma.task.findFirst({
          where: {
            cattleId: cow.id,
            title: `${session} Milk Recording`,
            status: {
              not: 'Completed',
            },
          },
        });

        if (exists) {
          continue;
        }

        const task = await this.prisma.task.create({
          data: {
            cattleId: cow.id,
            groupId: cow.groupId,
            title: `${session} Milk Recording`,
            description: `Milk production has not been recorded for ${session}.`,
            category: 'Milking',
            priority: 'High',
            status: 'Pending',
            dueDate: new Date(),
            createdBy: 'SYSTEM',
          },
        });

        await this.notifications.create({
          title: 'Missing Milk Record',
          message: `${cow.tagNumber} has no ${session} milk record.`,
          type: 'Warning',
          status: 'Unread',
          entityType: 'Task',
          entityId: task.id,
        });

        await this.audit.log({
          entity: 'Task',
          entityId: task.id,
          action: 'CREATE',
          description: 'Automatic milk recording reminder',
          newValues: task,
        });
      }
    }
  }

  private async checkProductionDrop() {
    const cattle = await this.prisma.cattle.findMany({
      where: {
        active: true,
      },
    });

    for (const cow of cattle) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayRecords = await this.prisma.milkProduction.findMany({
        where: {
          cattleId: cow.id,
          date: {
            gte: today,
          },
        },
      });

      if (!todayRecords.length) {
        continue;
      }

      const todayTotal = todayRecords.reduce(
        (sum, r) => sum + r.quantityLiters,
        0,
      );

      const previous = new Date(today);
      previous.setDate(previous.getDate() - 7);

      const history = await this.prisma.milkProduction.findMany({
        where: {
          cattleId: cow.id,
          date: {
            gte: previous,
            lt: today,
          },
        },
      });

      if (!history.length) {
        continue;
      }

      const grouped = new Map<string, number>();
      for (const r of history) {
        const key = r.date.toISOString().substring(0, 10);
        grouped.set(key, (grouped.get(key) || 0) + r.quantityLiters);
      }

      const totals = [...grouped.values()];
      const average =
        totals.reduce((a, b) => a + b, 0) / totals.length;

      if (todayTotal >= average * 0.9) {
        continue;
      }

      await this.createMilkInvestigation(
        cow.id,
        cow.groupId,
        cow.tagNumber,
        average,
        todayTotal,
      );
    }
  }

  private async createMilkInvestigation(
    cattleId: string,
    groupId: string | null,
    tagNumber: string,
    average: number,
    today: number,
  ) {
    const existing = await this.prisma.task.findFirst({
      where: {
        cattleId,
        title: 'Investigate Low Milk Yield',
        status: {
          not: 'Completed',
        },
      },
    });

    if (existing) {
      return;
    }

    const task = await this.prisma.task.create({
      data: {
        cattleId,
        groupId: groupId ?? undefined,
        title: 'Investigate Low Milk Yield',
        description: `Production dropped from ${average.toFixed(1)} L to ${today.toFixed(1)} L.`,
        category: 'Health',
        priority: 'High',
        status: 'Pending',
        dueDate: new Date(),
        createdBy: 'SYSTEM',
      },
    });

    await this.notifications.create({
      title: 'Low Milk Production',
      message: `${tagNumber} production dropped by more than 10%.`,
      type: 'Warning',
      status: 'Unread',
      entityType: 'Task',
      entityId: task.id,
    });

    await this.audit.log({
      entity: 'Task',
      entityId: task.id,
      action: 'CREATE',
      description: 'Automatic milk production investigation',
      newValues: task,
    });
  }
}