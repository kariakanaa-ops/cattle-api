import { ApiProperty } from '@nestjs/swagger';
import {
IsDateString,
IsNumber,
IsOptional,
IsString,
} from 'class-validator';

export class CreateConsumptionDto {

@ApiProperty()
@IsString()
inventoryId:string;

@ApiProperty()
@IsString()
groupId:string;

@ApiProperty()
@IsNumber()
quantity:number;

@ApiProperty()
@IsDateString()
feedingDate:string;

@ApiProperty({required:false})
@IsOptional()
@IsString()
notes?:string;

@ApiProperty({required:false})
@IsOptional()
@IsString()
recordedBy?:string;

}