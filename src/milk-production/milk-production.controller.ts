import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { MilkProductionService } from './milk-production.service';
import { CreateMilkProductionDto } from './dto/create-milk-production.dto';
import { UpdateMilkProductionDto } from './dto/update-milk-production.dto';

@Controller('milk-production')
export class MilkProductionController {

  constructor(
    private readonly service: MilkProductionService,
  ) {}

  @Post()
  create(@Body() dto: CreateMilkProductionDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateMilkProductionDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}