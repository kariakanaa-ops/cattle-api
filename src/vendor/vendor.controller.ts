import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { VendorService } from './vendor.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@Controller('vendors')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Post()
  create(@Body() dto: CreateVendorDto) {
    return this.vendorService.create(dto);
  }

  @Get()
  findAll() {
    return this.vendorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vendorService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateVendorDto,
  ) {
    return this.vendorService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vendorService.remove(id);
  }
}