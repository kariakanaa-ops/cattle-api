import { Module } from '@nestjs/common';

import { FeedInventoryController } from './feed-inventory.controller';
import { FeedInventoryService } from './feed-inventory.service';

@Module({
  controllers: [FeedInventoryController],
  providers: [FeedInventoryService],
})
export class FeedInventoryModule {}