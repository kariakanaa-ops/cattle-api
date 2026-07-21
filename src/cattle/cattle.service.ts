import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { CreateCattleDto } from './dto/create-cattle.dto';
import { UpdateCattleDto } from './dto/update-cattle.dto';

@Injectable()
export class CattleService {

  constructor(
    private prisma: PrismaService,
  ) {}

  create(dto: CreateCattleDto) {
    return this.prisma.cattle.create({
      data: dto,
    });
  }

  findAll() {
  return this.prisma.cattle.findMany({
    include: {
      group: true,
      healthRecords: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

  findOne(id: string) {
  return this.prisma.cattle.findUnique({
    where: {
      id,
    },
    include: {
      group: true,
      healthRecords: true,
    },
  });
}

  update(id: string, dto: UpdateCattleDto) {
    return this.prisma.cattle.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  remove(id: string) {
    return this.prisma.cattle.delete({
      where: {
        id,
      },
    });
  }

}