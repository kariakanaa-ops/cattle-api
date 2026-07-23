import { ApiProperty } from '@nestjs/swagger';
import { InventoryCategory } from '@prisma/client';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';

export class CreateInventoryDto {

  @ApiProperty()
  @IsString()
  itemName: string;

  @ApiProperty({ enum: InventoryCategory })
  @IsEnum(InventoryCategory)
  category: InventoryCategory;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsString()
  unit: string;

  @ApiProperty()
  @IsNumber()
  reorderLevel: number;

  @ApiProperty()
  @IsNumber()
  unitCost: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  vendorId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  lastRestocked?: string;
}