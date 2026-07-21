import { ApiProperty } from '@nestjs/swagger';
import {
  HealthRecordType,
  HealthStatus,
} from '@prisma/client';

import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateHealthRecordDto {

  @ApiProperty()
  @IsString()
  cattleId!: string;

  @ApiProperty({ enum: HealthRecordType })
  @IsEnum(HealthRecordType)
  type!: HealthRecordType;

  @ApiProperty({ enum: HealthStatus })
  @IsEnum(HealthStatus)
  status!: HealthStatus;

  @ApiProperty()
  @IsOptional()
  diagnosis?: string;

  @ApiProperty()
  @IsOptional()
  treatment?: string;

  @ApiProperty()
  @IsOptional()
  medicine?: string;

  @ApiProperty()
  @IsOptional()
  dosage?: string;

  @ApiProperty()
  @IsOptional()
  veterinarian?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  cost?: number;

  @ApiProperty()
  @IsDateString()
  visitDate!: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  nextVisit?: string;

  @ApiProperty()
  @IsOptional()
  notes?: string;
}