import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { Prisma, StockAdjustmentType } from '@prisma/client';

import { CreateConsumptionDto } from './dto/create-consumption.dto';
import { UpdateConsumptionDto } from './dto/update-consumption.dto';

@Injectable()
export class ConsumptionService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateConsumptionDto) {
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {

      const inventory = await tx.inventory.findUnique({
        where: { id: dto.inventoryId },
      });

      if (!inventory) {
        throw new NotFoundException('Inventory item not found');
      }

      const group = await tx.cattleGroup.findUnique({
        where: { id: dto.groupId },
      });

      if (!group) {
        throw new NotFoundException('Cattle group not found');
      }

      if (inventory.quantity < dto.quantity) {
        throw new BadRequestException(
          'Insufficient inventory quantity',
        );
      }

      const consumption = await tx.consumptionRecord.create({
        data: {
          inventoryId: dto.inventoryId,
          groupId: dto.groupId,
          quantity: dto.quantity,
          feedingDate: new Date(dto.feedingDate),
          notes: dto.notes,
          recordedBy: dto.recordedBy,
        },
      });

      await tx.stockAdjustment.create({
        data: {
          inventoryId: dto.inventoryId,
          adjustmentType: StockAdjustmentType.Consumption,
          quantity: dto.quantity,
          adjustmentDate: new Date(dto.feedingDate),
          reason: `Feed issued to group ${group.name}`,
          createdBy: dto.recordedBy,
        },
      });

      await tx.inventory.update({
        where: { id: dto.inventoryId },
        data: {
          quantity: {
            decrement: dto.quantity,
          },
        },
      });

      return consumption;
    });
  }

  findAll() {
    return this.prisma.consumptionRecord.findMany({
      include: {
        inventory: true,
        group: true,
      },
      orderBy: {
        feedingDate: 'desc',
      },
    });
  }

  findOne(id: string) {
    return this.prisma.consumptionRecord.findUnique({
      where: { id },
      include: {
        inventory: true,
        group: true,
      },
    });
  }

  update(id: string, dto: UpdateConsumptionDto) {
    return this.prisma.consumptionRecord.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: string) {
    return this.prisma.consumptionRecord.delete({
      where: { id },
    });
  }
}