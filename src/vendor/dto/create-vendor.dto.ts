import { ApiProperty } from '@nestjs/swagger';
import { VendorCategory, PaymentTerms } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateVendorDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  contactPerson?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ enum: VendorCategory })
  @IsEnum(VendorCategory)
  category: VendorCategory;

  @ApiProperty({ enum: PaymentTerms })
  @IsEnum(PaymentTerms)
  paymentTerms: PaymentTerms;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}