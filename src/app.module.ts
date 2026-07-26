import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { CattleModule } from './cattle/cattle.module';
import { CattleGroupModule } from './group/cattle-group.module';
import { HealthRecordModule } from './health-record/health-record.module';
import { BreedingModule } from './breeding/breeding.module';
import { MilkProductionModule } from './milk-production/milk-production.module';
import { VendorModule } from './vendor/vendor.module';
import { InventoryModule } from './inventory/inventory.module';
import { StockAdjustmentModule } from './stock-adjustment/stock-adjustment.module';
import { ConsumptionModule } from './consumption/consumption.module';
import { FeedRatioModule } from './feed-ratio/feed-ratio.module';
import { ScheduledFeedRatioModule } from './scheduled-feed-ratio/scheduled-feed-ratio.module';
import { TransactionModule } from './transaction/transaction.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ReportsModule } from './reports/reports.module';
import { DocumentsModule } from './documents/documents.module';
import { AuditModule } from './audit/audit.module';
import { NotificationModule } from './notifications/notifications.module';
import { TaskModule } from './task/task.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ExportModule } from './export/export.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AlertsModule } from './alerts/alerts.module';
@Module({
  imports: [
    PrismaModule,
    HealthModule,
    AuthModule,
    StockAdjustmentModule,
    ConsumptionModule,
    VendorModule,
    CattleModule,
    CattleGroupModule,
    HealthRecordModule,
    BreedingModule,
    MilkProductionModule,
    InventoryModule,
    FeedRatioModule,
    ScheduledFeedRatioModule,
    TransactionModule,
    DashboardModule,
    ReportsModule,
    DocumentsModule,
    AuditModule,
    NotificationModule,
    TaskModule,
    ScheduleModule.forRoot(),
    ExportModule,
    AnalyticsModule,
    AlertsModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
  ],
})
export class AppModule {}