import { Module } from '@nestjs/common';

import { HealthRecordController } from './health-record.controller';
import { HealthRecordService } from './health-record.service';

@Module({
  controllers: [HealthRecordController],
  providers: [HealthRecordService],
})
export class HealthRecordModule {}