import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateScheduledFeedRatioDto } from './dto/create-scheduled-feed-ratio.dto';
import { UpdateScheduledFeedRatioDto } from './dto/update-scheduled-feed-ratio.dto';

@Injectable()
export class ScheduledFeedRatioService {

  constructor(
    private prisma: PrismaService,
  ) {}

  async create(dto: CreateScheduledFeedRatioDto) {

    const ratio = await this.prisma.feedRatio.findUnique({
      where:{
        id:dto.feedRatioId,
      },
    });

    if(!ratio){
      throw new NotFoundException('Feed ratio not found');
    }

    return this.prisma.scheduledFeedRatio.create({
      data:dto,
    });

  }

  findAll() {
    return this.prisma.scheduledFeedRatio.findMany({
      include:{
        feedRatio:{
          include:{
            group:true,
            components:{
              include:{
                inventory:true,
              },
            },
          },
        },
      },
      orderBy:{
        scheduledTime:'asc',
      },
    });
  }

  findOne(id:string){
    return this.prisma.scheduledFeedRatio.findUnique({
      where:{id},
      include:{
        feedRatio:true,
      },
    });
  }

  update(id:string,dto:UpdateScheduledFeedRatioDto){
    return this.prisma.scheduledFeedRatio.update({
      where:{id},
      data:dto,
    });
  }

  remove(id:string){
    return this.prisma.scheduledFeedRatio.delete({
      where:{id},
    });
  }

}