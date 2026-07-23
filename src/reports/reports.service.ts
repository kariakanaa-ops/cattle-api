import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {

  constructor(
    private prisma: PrismaService,
  ) {}

  async dailyMilk() {

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.prisma.milkProduction.findMany({
      where: {
        date: {
          gte: today,
        },
      },
      include: {
        cattle: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

  }

  async monthlyMilk() {

    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    const total = await this.prisma.milkProduction.aggregate({
      _sum: {
        quantityLiters: true,
      },
      where: {
        date: {
          gte: start,
        },
      },
    });

    return {
      totalMilk: total._sum.quantityLiters ?? 0,
    };

  }

  async milkByCattle() {

    return this.prisma.milkProduction.findMany({
      include: {
        cattle: true,
      },
      orderBy: {
        cattleId: 'asc',
      },
    });

  }

  async financeSummary() {

    const income = await this.prisma.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        type: 'Income',
      },
    });

    const expense = await this.prisma.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        type: 'Expense',
      },
    });

    return {
      income: income._sum.amount ?? 0,
      expense: expense._sum.amount ?? 0,
      profit:
        (income._sum.amount ?? 0) -
        (expense._sum.amount ?? 0),
    };

  }

  async herdReport() {

    return {
      total: await this.prisma.cattle.count(),

      active: await this.prisma.cattle.count({
        where: {
          active: true,
        },
      }),

      females: await this.prisma.cattle.count({
        where: {
          gender: 'Female',
        },
      }),

      males: await this.prisma.cattle.count({
        where: {
          gender: 'Male',
        },
      }),
    };

  }

  async inventoryReport() {

    const inventory = await this.prisma.inventory.findMany({
      include: {
        vendor: true,
      },
      orderBy: {
        itemName: 'asc',
      },
    });

    const totalValue = inventory.reduce(
      (sum, item) => sum + item.quantity * item.unitCost,
      0,
    );

    return {
      totalItems: inventory.length,
      totalInventoryValue: totalValue,
      inventory,
    };

  }

  async feedConsumption() {

    return this.prisma.consumptionRecord.findMany({
      include: {
        inventory: true,
        group: true,
      },
      orderBy: {
        feedingDate: 'desc',
      },
    });

  }

  async breedingReport() {

    return this.prisma.breedingRecord.findMany({
      include: {
        cattle: true,
      },
      orderBy: {
        breedingDate: 'desc',
      },
    });

  }

  async healthReport() {

    return this.prisma.healthRecord.findMany({
      include: {
        cattle: true,
      },
      orderBy: {
        visitDate: 'desc',
      },
    });

  }

}