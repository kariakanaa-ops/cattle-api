import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { CattleModule } from './cattle/cattle.module';
import { CattleGroupModule } from './group/cattle-group.module';
import { HealthRecordModule } from './health-record/health-record.module';
@Module({
  imports: [
    PrismaModule,
    HealthModule,
    AuthModule,
    CattleModule,
    CattleGroupModule,
    HealthRecordModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
  ],
})
export class AppModule {}