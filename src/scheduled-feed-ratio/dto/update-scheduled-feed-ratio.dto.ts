import { PartialType } from '@nestjs/swagger';
import { CreateScheduledFeedRatioDto } from './create-scheduled-feed-ratio.dto';

export class UpdateScheduledFeedRatioDto extends PartialType(
  CreateScheduledFeedRatioDto,
) {}