import { ApiProperty } from '@nestjs/swagger';
import { StockAdjustmentType } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateStockAdjustmentDto {

  @ApiProperty()
  @IsString()
  inventoryId: string;

  @ApiProperty({ enum: StockAdjustmentType })
  @IsEnum(StockAdjustmentType)
  adjustmentType: StockAdjustmentType;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsDateString()
  adjustmentDate: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  referenceNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  createdBy?: string;
}