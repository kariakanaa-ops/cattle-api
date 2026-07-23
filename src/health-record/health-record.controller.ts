import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { HealthRecordService } from './health-record.service';
import { CreateHealthRecordDto } from './dto/create-health-record.dto';
import { UpdateHealthRecordDto } from './dto/update-health-record.dto';
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
    UserRole.Veterinarian,
)
@Controller('health-records')
export class HealthRecordController {
  constructor(
    private readonly healthRecordService: HealthRecordService,
  ) {}

  @Post()
  create(@Body() dto: CreateHealthRecordDto) {
    return this.healthRecordService.create(dto);
  }

  @Get()
  findAll() {
    return this.healthRecordService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.healthRecordService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateHealthRecordDto,
  ) {
    return this.healthRecordService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.healthRecordService.remove(id);
  }
}