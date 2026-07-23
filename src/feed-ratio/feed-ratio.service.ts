import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

import { CreateFeedRatioDto } from './dto/create-feed-ratio.dto';
import { UpdateFeedRatioDto } from './dto/update-feed-ratio.dto';

@Injectable()
export class FeedRatioService {

  constructor(private prisma: PrismaService) {}

  async create(dto: CreateFeedRatioDto) {

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {

      const group = await tx.cattleGroup.findUnique({
        where: { id: dto.groupId },
      });

      if (!group) {
        throw new NotFoundException('Cattle group not found');
      }

      const ratio = await tx.feedRatio.create({
        data: {
          name: dto.name,
          groupId: dto.groupId,
          notes: dto.notes,
        },
      });

      for (const component of dto.components) {

        await tx.feedRatioComponent.create({
          data: {
            feedRatioId: ratio.id,
            inventoryId: component.inventoryId,
            quantity: component.quantity,
            unit: component.unit,
          },
        });

      }

      return tx.feedRatio.findUnique({
        where: { id: ratio.id },
        include: {
          group: true,
          components: {
            include: {
              inventory: true,
            },
          },
        },
      });

    });

  }

  findAll() {
    return this.prisma.feedRatio.findMany({
      include: {
        group: true,
        components: {
          include: {
            inventory: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  findOne(id: string) {
    return this.prisma.feedRatio.findUnique({
      where: { id },
      include: {
        group: true,
        components: {
          include: {
            inventory: true,
          },
        },
      },
    });
  }

  update(id: string, dto: UpdateFeedRatioDto) {
    return this.prisma.feedRatio.update({
      where: { id },
      data: {
        name: dto.name,
        notes: dto.notes,
        groupId: dto.groupId,
      },
    });
  }

  remove(id: string) {
    return this.prisma.feedRatio.delete({
      where: { id },
    });
  }
}