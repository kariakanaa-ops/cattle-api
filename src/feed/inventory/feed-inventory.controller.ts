import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { FeedInventoryService } from './feed-inventory.service';

import { CreateFeedInventoryDto } from './dto/create-feed-inventory.dto';
import { UpdateFeedInventoryDto } from './dto/update-feed-inventory.dto';

@Controller('feed-inventory')
export class FeedInventoryController {

  constructor(
    private readonly service: FeedInventoryService,
  ) {}

  @Post()
  create(@Body() dto: CreateFeedInventoryDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('low-stock')
  lowStock() {
    return this.service.lowStock();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateFeedInventoryDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}