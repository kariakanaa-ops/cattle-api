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
import { FeedCategoryModule } from './feed/category/feed-category.module';
import { FeedInventoryModule } from './feed/inventory/feed-inventory.module';
@Module({
  imports: [
    PrismaModule,
    HealthModule,
    AuthModule,
    CattleModule,
    CattleGroupModule,
    HealthRecordModule,
    BreedingModule,
    MilkProductionModule,
    FeedCategoryModule,
    FeedInventoryModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
  ],
})
export class AppModule {}