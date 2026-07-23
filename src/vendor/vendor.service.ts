import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@Injectable()
export class VendorService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateVendorDto) {
    return this.prisma.vendor.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.vendor.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  findOne(id: string) {
    return this.prisma.vendor.findUnique({
      where: { id },
    });
  }

  update(id: string, dto: UpdateVendorDto) {
    return this.prisma.vendor.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: string) {
    return this.prisma.vendor.delete({
      where: { id },
    });
  }
}