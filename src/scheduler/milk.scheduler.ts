import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class MilkScheduler {

  private readonly logger =
    new Logger(MilkScheduler.name);

  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
    private audit: AuditService,
  ) {}

  @Cron('0 8 * * *')
  async verifyMilkRecords() {

    this.logger.log(
      'Checking missing milk production records...',
    );

    // Tomorrow:
    // check Morning
    // check Afternoon
    // check Evening

  }

  @Cron('30 23 * * *')
  async dailyMilkAnalysis() {

    this.logger.log(
      'Running daily milk production intelligence...',
    );

    // Tomorrow:
    // Rolling average
    // Production drop
    // Daily summary

  }

}