import { PartialType } from '@nestjs/swagger';
import { CreateFeedCategoryDto } from './create-feed-category.dto';

export class UpdateFeedCategoryDto extends PartialType(
  CreateFeedCategoryDto,
) {}