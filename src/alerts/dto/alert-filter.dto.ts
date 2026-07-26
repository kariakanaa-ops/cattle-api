import { IsOptional, IsString } from 'class-validator';

export class AlertFilterDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  severity?: string;
}