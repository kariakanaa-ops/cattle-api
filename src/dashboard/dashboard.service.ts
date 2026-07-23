import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async summary() {
    const totalCattle = await this.prisma.cattle.count();

    const activeCattle = await this.prisma.cattle.count({
      where: {
        active: true,
      },
    });

    const totalVendors = await this.prisma.vendor.count();

    const inventoryItems = await this.prisma.inventory.count();

    const feedRatios = await this.prisma.feedRatio.count();

    const transactions = await this.prisma.transaction.count();

    return {
      totalCattle,
      activeCattle,
      totalVendors,
      inventoryItems,
      feedRatios,
      transactions,
    };
  }

  async finance() {
    const income = await this.prisma.transaction.aggregate({
      _sum: {
        amount: true,
      },
      _count: true,
      where: {
        type: 'Income',
      },
    });

    const expense = await this.prisma.transaction.aggregate({
      _sum: {
        amount: true,
      },
      _count: true,
      where: {
        type: 'Expense',
      },
    });

    return {
      totalIncome: income._sum.amount ?? 0,
      totalExpense: expense._sum.amount ?? 0,
      netProfit:
        (income._sum.amount ?? 0) -
        (expense._sum.amount ?? 0),
      incomeTransactions: income._count,
      expenseTransactions: expense._count,
    };
  }

  async milk() {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const todayMilk =
      await this.prisma.milkProduction.aggregate({
        _sum: {
          quantityLiters: true,
        },
        where: {
          date: {
            gte: today,
          },
        },
      });

    const totalMilk =
      await this.prisma.milkProduction.aggregate({
        _sum: {
          quantityLiters: true,
        },
      });

    const records =
      await this.prisma.milkProduction.count();

    return {
      todayMilk:
        todayMilk._sum.quantityLiters ?? 0,

      totalMilk:
        totalMilk._sum.quantityLiters ?? 0,

      productionRecords: records,
    };
  }

  async herd() {
    const calves = await this.prisma.cattle.count({
      where: {
        stage: 'Calf',
      },
    });

    const heifers = await this.prisma.cattle.count({
      where: {
        stage: 'Growing_Heifer',
      },
    });

    const cows = await this.prisma.cattle.count({
      where: {
        stage: 'Mature_Cow',
      },
    });

    const bulls = await this.prisma.cattle.count({
      where: {
        gender: 'Male',
      },
    });

    return {
      calves,
      heifers,
      cows,
      bulls,
    };
  }

  async inventory() {
    const inventory =
      await this.prisma.inventory.findMany({
        include: {
          vendor: true,
        },
        orderBy: {
          itemName: 'asc',
        },
      });

    const lowStock = inventory.filter(
      (item) => item.quantity <= item.reorderLevel,
    );

    const totalInventoryValue = inventory.reduce(
      (total, item) =>
        total + item.quantity * item.unitCost,
      0,
    );

    return {
      totalItems: inventory.length,
      lowStockCount: lowStock.length,
      totalInventoryValue,
      lowStock,
    };
  }
}