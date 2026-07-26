import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';

import { AnalyticsModule } from '../analytics/analytics.module';
import { AlertsModule } from '../alerts/alerts.module';

import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [
    PrismaModule,
    AnalyticsModule,
    AlertsModule,
  ],
  controllers: [
    DashboardController,
  ],
  providers: [
    DashboardService,
  ],
})
export class DashboardModule {}