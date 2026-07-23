import { IsOptional, IsString } from 'class-validator';

export class UploadDocumentDto {
  @IsString()
  entityType: string;

  @IsString()
  entityId: string;

  @IsOptional()
  @IsString()
  uploadedBy?: string;

  @IsOptional()
  @IsString()
  description?: string;
}