import { ApiProperty } from '@nestjs/swagger';
import {
  BreedingMethod,
  PregnancyStatus,
} from '../types';
import { Gender } from '@prisma/client';

import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBreedingDto {

  @ApiProperty()
  @IsString()
  cattleId!: string;

  @ApiProperty()
  @IsDateString()
  breedingDate!: string;

  @ApiProperty({ enum: BreedingMethod })
  @IsEnum(BreedingMethod)
  method!: BreedingMethod;

  @ApiProperty({ required: false })
  @IsOptional()
  bullName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  semenBatch?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  technician?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  expectedCalving?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  actualCalving?: string;

  @ApiProperty({ enum: PregnancyStatus })
  @IsEnum(PregnancyStatus)
  pregnancyStatus!: PregnancyStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  calfTag?: string;

  @ApiProperty({ enum: Gender, required: false })
  @IsOptional()
  @IsEnum(Gender)
  calfGender?: Gender;

  @ApiProperty({ required: false })
  @IsOptional()
  notes?: string;
}