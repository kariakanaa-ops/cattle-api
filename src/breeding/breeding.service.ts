import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { CreateBreedingDto } from './dto/create-breeding.dto';
import { UpdateBreedingDto } from './dto/update-breeding.dto';

@Injectable()
export class BreedingService {

  constructor(
    private prisma: PrismaService,
  ) {}

  create(dto: CreateBreedingDto) {
    return this.prisma.breedingRecord.create({
      data: dto,
      include: {
        cattle: true,
      },
    });
  }

  findAll() {
    return this.prisma.breedingRecord.findMany({
      include: {
        cattle: true,
      },
      orderBy: {
        breedingDate: 'desc',
      },
    });
  }

  findOne(id: string) {
    return this.prisma.breedingRecord.findUnique({
      where: { id },
      include: {
        cattle: true,
      },
    });
  }

  update(id: string, dto: UpdateBreedingDto) {
    return this.prisma.breedingRecord.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: string) {
    return this.prisma.breedingRecord.delete({
      where: { id },
    });
  }
}