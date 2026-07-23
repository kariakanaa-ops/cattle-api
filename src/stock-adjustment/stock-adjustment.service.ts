import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { Prisma, StockAdjustmentType } from '@prisma/client';

import { CreateStockAdjustmentDto } from './dto/create-stock-adjustment.dto';
import { UpdateStockAdjustmentDto } from './dto/update-stock-adjustment.dto';

@Injectable()
export class StockAdjustmentService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateStockAdjustmentDto) {
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {

      const inventory = await tx.inventory.findUnique({
        where: { id: dto.inventoryId },
      });

      if (!inventory) {
        throw new NotFoundException('Inventory item not found');
      }

      let newQuantity = inventory.quantity;

      switch (dto.adjustmentType) {
        case StockAdjustmentType.Purchase:
        case StockAdjustmentType.Transfer:
        case StockAdjustmentType.Adjustment:
          newQuantity += dto.quantity;
          break;

        case StockAdjustmentType.Consumption:
        case StockAdjustmentType.Waste:
          newQuantity -= dto.quantity;

          if (newQuantity < 0) {
            throw new BadRequestException(
              'Insufficient inventory quantity',
            );
          }
          break;
      }

      const adjustment = await tx.stockAdjustment.create({
        data: {
          inventoryId: dto.inventoryId,
          adjustmentType: dto.adjustmentType,
          quantity: dto.quantity,
          adjustmentDate: new Date(dto.adjustmentDate),
          reason: dto.reason,
          referenceNumber: dto.referenceNumber,
          createdBy: dto.createdBy,
        },
      });

      await tx.inventory.update({
        where: { id: dto.inventoryId },
        data: {
          quantity: newQuantity,
        },
      });

      return adjustment;
    });
  }

  findAll() {
    return this.prisma.stockAdjustment.findMany({
      include: {
        inventory: true,
      },
      orderBy: {
        adjustmentDate: 'desc',
      },
    });
  }

  findOne(id: string) {
    return this.prisma.stockAdjustment.findUnique({
      where: { id },
      include: {
        inventory: true,
      },
    });
  }

  update(id: string, dto: UpdateStockAdjustmentDto) {
    return this.prisma.stockAdjustment.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: string) {
    return this.prisma.stockAdjustment.delete({
      where: { id },
    });
  }
}