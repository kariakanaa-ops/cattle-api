import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { ConsumptionService } from './consumption.service';
import { CreateConsumptionDto } from './dto/create-consumption.dto';
import { UpdateConsumptionDto } from './dto/update-consumption.dto';

@Controller('consumption')
export class ConsumptionController {
  constructor(
    private readonly consumptionService: ConsumptionService,
  ) {}

  @Post()
  create(@Body() dto: CreateConsumptionDto) {
    return this.consumptionService.create(dto);
  }

  @Get()
  findAll() {
    return this.consumptionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.consumptionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateConsumptionDto,
  ) {
    return this.consumptionService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.consumptionService.remove(id);
  }
}