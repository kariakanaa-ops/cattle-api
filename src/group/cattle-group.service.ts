import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class CattleGroupService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateGroupDto) {
    return this.prisma.cattleGroup.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.cattleGroup.findMany({
      orderBy: { name: 'asc' },
    });
  }

  findOne(id: string) {
    return this.prisma.cattleGroup.findUnique({
      where: { id },
    });
  }

  update(id: string, dto: UpdateGroupDto) {
    return this.prisma.cattleGroup.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: string) {
    return this.prisma.cattleGroup.delete({
      where: { id },
    });
  }
}