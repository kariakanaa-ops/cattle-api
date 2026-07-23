import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { StockAdjustmentService } from './stock-adjustment.service';
import { CreateStockAdjustmentDto } from './dto/create-stock-adjustment.dto';
import { UpdateStockAdjustmentDto } from './dto/update-stock-adjustment.dto';

@Controller('stock-adjustments')
export class StockAdjustmentController {
  constructor(
    private readonly stockAdjustmentService: StockAdjustmentService,
  ) {}

  @Post()
  create(@Body() dto: CreateStockAdjustmentDto) {
    return this.stockAdjustmentService.create(dto);
  }

  @Get()
  findAll() {
    return this.stockAdjustmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockAdjustmentService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateStockAdjustmentDto,
  ) {
    return this.stockAdjustmentService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stockAdjustmentService.remove(id);
  }
}