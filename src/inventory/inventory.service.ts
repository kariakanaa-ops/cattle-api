import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoryService {

  constructor(
    private prisma: PrismaService,
  ) {}

  create(dto: CreateInventoryDto) {
    return this.prisma.inventory.create({
      data: dto,
      include: {
        vendor: true,
      },
    });
  }

  findAll() {
    return this.prisma.inventory.findMany({
      include: {
        vendor: true,
      },
      orderBy: {
        itemName: 'asc',
      },
    });
  }

  findOne(id: string) {
    return this.prisma.inventory.findUnique({
      where: { id },
      include: {
        vendor: true,
      },
    });
  }

  update(id: string, dto: UpdateInventoryDto) {
    return this.prisma.inventory.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: string) {
    return this.prisma.inventory.delete({
      where: { id },
    });
  }

  lowStock() {
    return this.prisma.inventory.findMany({
      where: {
        quantity: {
          lte: 10,
        },
      },
      include: {
        vendor: true,
      },
    });
  }
}