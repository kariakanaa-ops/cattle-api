import { Module } from '@nestjs/common';

import { FeedCategoryController } from './feed-category.controller';
import { FeedCategoryService } from './feed-category.service';

@Module({
  controllers: [FeedCategoryController],
  providers: [FeedCategoryService],
})
export class FeedCategoryModule {}