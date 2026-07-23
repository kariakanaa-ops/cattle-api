import { PartialType } from '@nestjs/swagger';
import { CreateFeedRatioDto } from './create-feed-ratio.dto';

export class UpdateFeedRatioDto extends PartialType(
  CreateFeedRatioDto,
) {}