import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { FeedRatioController } from './feed-ratio.controller';
import { FeedRatioService } from './feed-ratio.service';

@Module({
  imports: [PrismaModule],
  controllers: [FeedRatioController],
  providers: [FeedRatioService],
})
export class FeedRatioModule {}