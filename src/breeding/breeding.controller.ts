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