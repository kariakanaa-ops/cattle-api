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
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
  ],
})
export class AppModule {}