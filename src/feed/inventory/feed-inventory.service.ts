import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

import { CreateFeedInventoryDto } from './dto/create-feed-inventory.dto';
import { UpdateFeedInventoryDto } from './dto/update-feed-inventory.dto';

@Injectable()
export class FeedInventoryService {

  constructor(
    private prisma: PrismaService,
  ) {}

  create(dto: CreateFeedInventoryDto) {
    return this.prisma.feedInventory.create({
      data: dto,
      include: {
        category: true,
      },
    });
  }

  findAll() {
    return this.prisma.feedInventory.findMany({
      include: {
        category: true,
        stockTransactions: true,
        consumptions: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  findOne(id: string) {
    return this.prisma.feedInventory.findUnique({
      where: { id },
      include: {
        category: true,
        stockTransactions: true,
        consumptions: true,
      },
    });
  }

  update(id: string, dto: UpdateFeedInventoryDto) {
    return this.prisma.feedInventory.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: string) {
    return this.prisma.feedInventory.delete({
      where: { id },
    });
  }

  async lowStock() {
    const feeds = await this.prisma.feedInventory.findMany({
      include: {
        category: true,
      },
    });

    return feeds.filter(feed => feed.quantity <= feed.minimumStock);
  }
}