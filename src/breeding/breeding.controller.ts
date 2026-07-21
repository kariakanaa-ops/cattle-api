import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { BreedingService } from './breeding.service';
import { CreateBreedingDto } from './dto/create-breeding.dto';
import { UpdateBreedingDto } from './dto/update-breeding.dto';

@Controller('breeding')
export class BreedingController {

  constructor(
    private readonly breedingService: BreedingService,
  ) {}

  @Post()
  create(@Body() dto: CreateBreedingDto) {
    return this.breedingService.create(dto);
  }

  @Get()
  findAll() {
    return this.breedingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.breedingService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBreedingDto,
  ) {
    return this.breedingService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.breedingService.remove(id);
  }
}