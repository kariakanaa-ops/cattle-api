import { ApiProperty } from '@nestjs/swagger';
import { FeedType } from '../../types';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateFeedInventoryDto {

  @ApiProperty()
  @IsString()
  categoryId!: string;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty({ enum: FeedType })
  @IsEnum(FeedType)
  type!: FeedType;

  @ApiProperty()
  @IsNumber()
  quantity!: number;

  @ApiProperty()
  @IsString()
  unit!: string;

  @ApiProperty()
  @IsNumber()
  minimumStock!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  unitCost?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  supplier?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  batchNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  manufactureDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  storageLocation?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  notes?: string;
}