import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  /* ============================================================
     HERD ANALYTICS
  ============================================================ */

  async herd() {
    const totalCattle = await this.prisma.cattle.count();

    const activeCattle = await this.prisma.cattle.count({
      where: {
        active: true,
      },
    });

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
      totalCattle,
      activeCattle,
      calves,
      heifers,
      cows,
      bulls,
    };
  }

  /* ============================================================
     MILK ANALYTICS
  ============================================================ */

  async milk() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - 7);

    const monthStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      1,
    );

    const [
      todayMilk,
      yesterdayMilk,
      weeklyMilk,
      monthlyMilk,
      activeCows,
    ] = await Promise.all([
      this.prisma.milkProduction.aggregate({
        _sum: {
          quantityLiters: true,
        },
        where: {
          date: {
            gte: today,
          },
        },
      }),

      this.prisma.milkProduction.aggregate({
        _sum: {
          quantityLiters: true,
        },
        where: {
          date: {
            gte: yesterday,
            lt: today,
          },
        },
      }),

      this.prisma.milkProduction.aggregate({
        _sum: {
          quantityLiters: true,
        },
        where: {
          date: {
            gte: weekStart,
          },
        },
      }),

      this.prisma.milkProduction.aggregate({
        _sum: {
          quantityLiters: true,
        },
        where: {
          date: {
            gte: monthStart,
          },
        },
      }),

      this.prisma.cattle.count({
        where: {
          active: true,
          stage: 'Mature_Cow',
        },
      }),
    ]);

    const todayTotal = todayMilk._sum.quantityLiters ?? 0;
    const yesterdayTotal =
      yesterdayMilk._sum.quantityLiters ?? 0;
    const weeklyTotal =
      weeklyMilk._sum.quantityLiters ?? 0;
    const monthlyTotal =
      monthlyMilk._sum.quantityLiters ?? 0;

    return {
      today: todayTotal,
      yesterday: yesterdayTotal,
      thisWeek: weeklyTotal,
      thisMonth: monthlyTotal,

      averagePerDay: Number(
        (weeklyTotal / 7).toFixed(2),
      ),

      averagePerCow:
        activeCows > 0
          ? Number(
              (todayTotal / activeCows).toFixed(2),
            )
          : 0,

      activeMilkingCows: activeCows,
    };
  }

  /* ============================================================
     FINANCE ANALYTICS
  ============================================================ */

  async finance() {
    const income =
      await this.prisma.transaction.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          type: 'Income',
        },
      });

    const expense =
      await this.prisma.transaction.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          type: 'Expense',
        },
      });

    const totalIncome =
      income._sum.amount ?? 0;

    const totalExpense =
      expense._sum.amount ?? 0;

    return {
      revenue: totalIncome,
      expenses: totalExpense,
      netProfit:
        totalIncome - totalExpense,

      profitMargin:
        totalIncome > 0
          ? Number(
              (
                ((totalIncome -
                  totalExpense) /
                  totalIncome) *
                100
              ).toFixed(2),
            )
          : 0,
    };
  }

  /* ============================================================
     INVENTORY ANALYTICS
  ============================================================ */

  async inventory() {
    const inventory =
      await this.prisma.inventory.findMany({
        include: {
          vendor: true,
        },
      });

    const lowStock = inventory.filter(
      (item) =>
        item.quantity <=
        item.reorderLevel,
    );

    const inventoryValue =
      inventory.reduce(
        (sum, item) =>
          sum +
          item.quantity * item.unitCost,
        0,
      );

    return {
      totalItems: inventory.length,
      lowStockCount: lowStock.length,
      inventoryValue,
      lowStock,
    };
  }

    /* ============================================================
     HEALTH ANALYTICS
  ============================================================ */

  async health() {
    const healthy =
      await this.prisma.healthRecord.count({
        where: {
          status: 'Healthy',
        },
      });

    const sick =
      await this.prisma.healthRecord.count({
        where: {
          status: 'Sick',
        },
      });

    const recovering =
      await this.prisma.healthRecord.count({
        where: {
          status: 'Recovering',
        },
      });

    const vaccinations =
      await this.prisma.healthRecord.count({
        where: {
          type: 'Vaccination',
        },
      });

    const treatments =
      await this.prisma.healthRecord.count({
        where: {
          type: 'Treatment',
        },
      });

    const upcomingVisits =
      await this.prisma.healthRecord.count({
        where: {
          nextVisit: {
            gte: new Date(),
          },
        },
      });

    return {
      healthy,
      sick,
      recovering,
      vaccinations,
      treatments,
      upcomingVisits,
    };
  }

  /* ============================================================
     BREEDING ANALYTICS
  ============================================================ */

  async breeding() {
    const total =
      await this.prisma.breedingRecord.count();

    const pregnant =
      await this.prisma.breedingRecord.count({
        where: {
          pregnancyStatus: 'Pregnant',
        },
      });

    const open =
      await this.prisma.breedingRecord.count({
        where: {
          pregnancyStatus: 'Open',
        },
      });

    const failed =
      await this.prisma.breedingRecord.count({
        where: {
          pregnancyStatus: 'Failed',
        },
      });

    const calved =
      await this.prisma.breedingRecord.count({
        where: {
          pregnancyStatus: 'Calved',
        },
      });

    const expectedCalving =
      await this.prisma.breedingRecord.count({
        where: {
          expectedCalving: {
            gte: new Date(),
          },
        },
      });

    return {
      total,
      pregnant,
      open,
      failed,
      calved,
      expectedCalving,

      pregnancyRate:
        total > 0
          ? Number(
              (
                (pregnant / total) *
                100
              ).toFixed(2),
            )
          : 0,
    };
  }

  /* ============================================================
     REVENUE TREND
  ============================================================ */

  async revenueTrend() {
    const transactions =
      await this.prisma.transaction.findMany({
        where: {
          type: 'Income',
        },
        orderBy: {
          transactionDate: 'asc',
        },
      });

    const monthly = new Map<
      string,
      number
    >();

    for (const tx of transactions) {
      const d = new Date(
        tx.transactionDate,
      );

      const key = `${d.getFullYear()}-${String(
        d.getMonth() + 1,
      ).padStart(2, '0')}`;

      monthly.set(
        key,
        (monthly.get(key) ?? 0) +
          tx.amount,
      );
    }

    return Array.from(
      monthly.entries(),
    ).map(([month, revenue]) => ({
      month,
      revenue,
    }));
  }

  /* ============================================================
     EXECUTIVE DASHBOARD
  ============================================================ */

  async dashboard() {
    const [
      herd,
      milk,
      finance,
      inventory,
      health,
      breeding,
      revenueTrend,
    ] = await Promise.all([
      this.herd(),
      this.milk(),
      this.finance(),
      this.inventory(),
      this.health(),
      this.breeding(),
      this.revenueTrend(),
    ]);

    return {
      generatedAt: new Date(),

      herd,

      milk,

      finance,

      inventory,

      health,

      breeding,

      revenueTrend,
    };
  }
}