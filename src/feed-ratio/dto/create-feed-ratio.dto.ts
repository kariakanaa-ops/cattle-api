import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class FeedRatioComponentDto {

  @ApiProperty()
  @IsString()
  inventoryId: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsString()
  unit: string;
}

export class CreateFeedRatioDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  groupId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ type: [FeedRatioComponentDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeedRatioComponentDto)
  components: FeedRatioComponentDto[];
}