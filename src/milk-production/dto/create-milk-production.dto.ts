import { ApiProperty } from '@nestjs/swagger';
import { MilkingSession, MilkQualityGrade } from '../types';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMilkProductionDto {

  @ApiProperty()
  @IsString()
  cattleId!: string;

  @ApiProperty()
  @IsDateString()
  date!: string;

  @ApiProperty({ enum: MilkingSession })
  @IsEnum(MilkingSession)
  session!: MilkingSession;

  @ApiProperty()
  @IsNumber()
  quantityLiters!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  milkUsedByCalves?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  fatPercentage?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  proteinPercentage?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  somaticCellCount?: number;

  @ApiProperty({ enum: MilkQualityGrade, required: false })
  @IsOptional()
  @IsEnum(MilkQualityGrade)
  qualityGrade?: MilkQualityGrade;

  @ApiProperty({ required: false })
  @IsOptional()
  notes?: string;
}