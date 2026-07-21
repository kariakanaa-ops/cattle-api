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