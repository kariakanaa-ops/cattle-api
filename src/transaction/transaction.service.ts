import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTransactionDto) {

    if (dto.vendorId) {
      const vendor = await this.prisma.vendor.findUnique({
        where: { id: dto.vendorId },
      });

      if (!vendor) {
        throw new NotFoundException('Vendor not found');
      }
    }

    if (dto.cattleId) {
      const cattle = await this.prisma.cattle.findUnique({
        where: { id: dto.cattleId },
      });

      if (!cattle) {
        throw new NotFoundException('Cattle not found');
      }
    }

    return this.prisma.transaction.create({
      data: {
        type: dto.type,
        category: dto.category,
        amount: dto.amount,
        transactionDate: new Date(dto.transactionDate),
        paymentMethod: dto.paymentMethod,
        vendorId: dto.vendorId,
        cattleId: dto.cattleId,
        referenceNumber: dto.referenceNumber,
        description: dto.description,
        createdBy: dto.createdBy,
      },
    });
  }

  findAll() {
    return this.prisma.transaction.findMany({
      include: {
        vendor: true,
        cattle: true,
      },
      orderBy: {
        transactionDate: 'desc',
      },
    });
  }

  findOne(id: string) {
    return this.prisma.transaction.findUnique({
      where: { id },
      include: {
        vendor: true,
        cattle: true,
      },
    });
  }

  update(id: string, dto: UpdateTransactionDto) {
    return this.prisma.transaction.update({
      where: { id },
      data: {
        ...dto,
        transactionDate: dto.transactionDate
          ? new Date(dto.transactionDate)
          : undefined,
      },
    });
  }

  remove(id: string) {
    return this.prisma.transaction.delete({
      where: { id },
    });
  }

  async summary() {

    const income = await this.prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        type: 'Income',
      },
    });

    const expense = await this.prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        type: 'Expense',
      },
    });

    return {
      totalIncome: income._sum.amount ?? 0,
      totalExpense: expense._sum.amount ?? 0,
      netIncome:
        (income._sum.amount ?? 0) -
        (expense._sum.amount ?? 0),
    };
  }
}