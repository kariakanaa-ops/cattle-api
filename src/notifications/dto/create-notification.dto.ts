import {
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

import {
  NotificationStatus,
  NotificationType,
} from '@prisma/client';

export class CreateNotificationDto {

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @IsOptional()
  @IsEnum(NotificationStatus)
  status?: NotificationStatus;

  @IsOptional()
  @IsString()
  entityType?: string;

  @IsOptional()
  @IsString()
  entityId?: string;

  @IsOptional()
  @IsString()
  userId?: string;
}