import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { CreateMilkProductionDto } from './dto/create-milk-production.dto';
import { UpdateMilkProductionDto } from './dto/update-milk-production.dto';

@Injectable()
export class MilkProductionService {

  constructor(private prisma: PrismaService) {}

  create(dto: CreateMilkProductionDto) {
    return this.prisma.milkProduction.create({
      data: dto,
      include: {
        cattle: {
          select: {
            id: true,
            tagNumber: true,
            name: true,
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.milkProduction.findMany({
      include: {
        cattle: {
          select: {
            id: true,
            tagNumber: true,
            name: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  findOne(id: string) {
    return this.prisma.milkProduction.findUnique({
      where: { id },
      include: {
        cattle: {
          select: {
            id: true,
            tagNumber: true,
            name: true,
          },
        },
      },
    });
  }

  update(id: string, dto: UpdateMilkProductionDto) {
    return this.prisma.milkProduction.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: string) {
    return this.prisma.milkProduction.delete({
      where: { id },
    });
  }
}