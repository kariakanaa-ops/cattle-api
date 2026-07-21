import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsEnum,
} from 'class-validator';

import {
  Breed,
  Gender,
  CattleStatus,
  GrowthStage,
  AcquisitionType,
} from '@prisma/client';

export class CreateCattleDto {
  @ApiProperty()
  @IsString()
  tagNumber!: string;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty({ enum: Breed })
  @IsEnum(Breed)
  breed!: Breed;

  @ApiProperty()
  @IsDateString()
  dateOfBirth!: string;

  @ApiProperty({ enum: Gender })
  @IsEnum(Gender)
  gender!: Gender;

  @ApiProperty({ enum: CattleStatus })
  @IsEnum(CattleStatus)
  status!: CattleStatus;

  @ApiProperty({ enum: GrowthStage })
  @IsEnum(GrowthStage)
  stage!: GrowthStage;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  weightKg?: number;

  @ApiProperty({ enum: AcquisitionType })
  @IsEnum(AcquisitionType)
  acquisitionType!: AcquisitionType;

  @ApiProperty()
  @IsOptional()
  acquisitionDate?: string;

  @ApiProperty()
  @IsOptional()
  groupId?: string;



  @ApiProperty()
  @IsOptional()
  photo?: string;

  @ApiProperty()
  @IsOptional()
  notes?: string;
}