import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { ScheduledFeedRatioService } from './scheduled-feed-ratio.service';
import { CreateScheduledFeedRatioDto } from './dto/create-scheduled-feed-ratio.dto';
import { UpdateScheduledFeedRatioDto } from './dto/update-scheduled-feed-ratio.dto';
import { UseGuards } from '@nestjs/common';

import { ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { RolesGuard } from '../auth/guards/roles.guard';

import { Roles } from '../auth/decorators/roles.decorator';

import { UserRole } from '@prisma/client';
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(
    UserRole.Admin,
    UserRole.Manager,
    UserRole.FarmWorker,
)
@Controller('scheduled-feed-ratios')
export class ScheduledFeedRatioController {

  constructor(
    private readonly service:ScheduledFeedRatioService,
  ){}

  @Post()
  create(@Body() dto:CreateScheduledFeedRatioDto){
    return this.service.create(dto);
  }

  @Get()
  findAll(){
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id:string){
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id:string,
    @Body() dto:UpdateScheduledFeedRatioDto,
  ){
    return this.service.update(id,dto);
  }

  @Delete(':id')
  remove(@Param('id') id:string){
    return this.service.remove(id);
  }

}