import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

import { CreateFeedCategoryDto } from './dto/create-feed-category.dto';
import { UpdateFeedCategoryDto } from './dto/update-feed-category.dto';

@Injectable()
export class FeedCategoryService {

  constructor(
    private prisma: PrismaService,
  ) {}

  create(dto: CreateFeedCategoryDto) {
    return this.prisma.feedCategory.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.feedCategory.findMany({
      include: {
        feeds: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  findOne(id: string) {
    return this.prisma.feedCategory.findUnique({
      where: { id },
      include: {
        feeds: true,
      },
    });
  }

  update(id: string, dto: UpdateFeedCategoryDto) {
    return this.prisma.feedCategory.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: string) {
    return this.prisma.feedCategory.delete({
      where: { id },
    });
  }
}