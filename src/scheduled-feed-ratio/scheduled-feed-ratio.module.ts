import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';

import { ScheduledFeedRatioController } from './scheduled-feed-ratio.controller';
import { ScheduledFeedRatioService } from './scheduled-feed-ratio.service';

@Module({
  imports:[PrismaModule],
  controllers:[ScheduledFeedRatioController],
  providers:[ScheduledFeedRatioService],
})
export class ScheduledFeedRatioModule {}