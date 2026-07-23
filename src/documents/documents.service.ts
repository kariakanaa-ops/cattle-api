import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DocumentType } from '@prisma/client';
import * as fs from 'fs';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async findByEntity(entityType: string, entityId: string) {
  return this.prisma.document.findMany({
    where: {
      entityType,
      entityId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

async remove(id: string) {
  const document = await this.prisma.document.findUnique({
    where: { id },
  });

  if (!document) {
    throw new NotFoundException('Document not found');
  }

  if (fs.existsSync(document.path)) {
    fs.unlinkSync(document.path);
  }

  await this.prisma.document.delete({
    where: { id },
  });

  return {
    message: 'Document deleted successfully',
  };
}
  async upload(file: Express.Multer.File, dto: any) {
    const extension = file.originalname.split('.').pop()?.toLowerCase() || '';

    let type: DocumentType = DocumentType.Other;

    if (file.mimetype.startsWith('image/'))
      type = DocumentType.Image;

    if (file.mimetype === 'application/pdf')
      type = DocumentType.PDF;

    return this.prisma.document.create({
      data: {
        fileName: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        extension,
        size: file.size,
        path: file.path,
        documentType: type,
        entityType: dto.entityType,
        entityId: dto.entityId,
        uploadedBy: dto.uploadedBy,
        description: dto.description,
      },
    });
  }

  findAll() {
    return this.prisma.document.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findOne(id: string) {
    return this.prisma.document.findUnique({
      where: { id },
    });
  }
}