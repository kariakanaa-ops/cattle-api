import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { CreateHealthRecordDto } from './dto/create-health-record.dto';
import { UpdateHealthRecordDto } from './dto/update-health-record.dto';

@Injectable()
export class HealthRecordService {

  constructor(private prisma: PrismaService) {}

  create(dto: CreateHealthRecordDto) {
    return this.prisma.healthRecord.create({
      data: dto,
      include: {
        cattle: true,
      },
    });
  }

  findAll() {
    return this.prisma.healthRecord.findMany({
      include: {
        cattle: true,
      },
      orderBy: {
        visitDate: 'desc',
      },
    });
  }

  findOne(id: string) {
    return this.prisma.healthRecord.findUnique({
      where: { id },
      include: {
        cattle: true,
      },
    });
  }

  update(id: string, dto: UpdateHealthRecordDto) {
    return this.prisma.healthRecord.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: string) {
    return this.prisma.healthRecord.delete({
      where: { id },
    });
  }
}