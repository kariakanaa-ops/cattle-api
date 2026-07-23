import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateScheduledFeedRatioDto {

  @ApiProperty()
  @IsString()
  feedRatioId: string;

  @ApiProperty({
    example: '06:00',
  })
  @IsString()
  scheduledTime: string;

  @ApiProperty()
  @IsBoolean()
  monday: boolean;

  @ApiProperty()
  @IsBoolean()
  tuesday: boolean;

  @ApiProperty()
  @IsBoolean()
  wednesday: boolean;

  @ApiProperty()
  @IsBoolean()
  thursday: boolean;

  @ApiProperty()
  @IsBoolean()
  friday: boolean;

  @ApiProperty()
  @IsBoolean()
  saturday: boolean;

  @ApiProperty()
  @IsBoolean()
  sunday: boolean;

  @ApiProperty({ required:false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}