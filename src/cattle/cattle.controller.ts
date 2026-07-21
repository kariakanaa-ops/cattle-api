import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CattleService } from './cattle.service';

import { CreateCattleDto } from './dto/create-cattle.dto';
import { UpdateCattleDto } from './dto/update-cattle.dto';

@Controller('cattle')
export class CattleController {

  constructor(
    private readonly cattleService: CattleService,
  ) {}

  @Post()
  create(@Body() dto: CreateCattleDto) {
    return this.cattleService.create(dto);
  }

  @Get()
  findAll() {
    return this.cattleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cattleService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCattleDto,
  ) {
    return this.cattleService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cattleService.remove(id);
  }

}