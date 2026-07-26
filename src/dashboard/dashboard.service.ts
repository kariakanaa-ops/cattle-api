import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { AlertsService } from '../alerts/alerts.service';
@Injectable()
export class DashboardService {
 constructor(
  private readonly prisma: PrismaService,
  private readonly analytics: AnalyticsService,
  private readonly alertsService: AlertsService,
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

  const deworming =
    await this.prisma.healthRecord.count({

      where: {
        type: 'Deworming',
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

    deworming,

    upcomingVisits,

  };

}

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

  const calved =
    await this.prisma.breedingRecord.count({

      where: {

        actualCalving: {

          not: null,

        },

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

    calved,

    expectedCalving,

  };

}

async tasks() {

  const pending =
    await this.prisma.task.count({

      where: {
        status: 'Pending',
      },

    });

  const inProgress =
    await this.prisma.task.count({

      where: {
        status: 'InProgress',
      },

    });

  const completed =
    await this.prisma.task.count({

      where: {
        status: 'Completed',
      },

    });

  const overdue =
    await this.prisma.task.count({

      where: {
        status: 'Overdue',
      },

    });

  return {

    pending,

    inProgress,

    completed,

    overdue,

  };

}
async notifications() {
    const unread = await this.prisma.notification.count({
      where: {
        status: 'Unread',
      },
    });

    const read = await this.prisma.notification.count({
      where: {
        status: 'Read',
      },
    });

    const total = await this.prisma.notification.count();

    return {
      total,
      unread,
      read,
    };
  }

  async overview() {
    const [
      summary,
      finance,
      milk,
      herd,
      inventory,
      health,
      breeding,
      tasks,
      notifications,
    ] = await Promise.all([
      this.summary(),
      this.finance(),
      this.milk(),
      this.herd(),
      this.inventory(),
      this.health(),
      this.breeding(),
      this.tasks(),
      this.notifications(),
    ]);

    return {
      generatedAt: new Date(),
      summary,
      finance,
      milk,
      herd,
      inventory,
      health,
      breeding,
      tasks,
      notifications,
    };
  }
  async charts() {
    return {
      milkTrend: await this.analytics.milk(),
      financeTrend: await this.analytics.finance(),
      herdDistribution: await this.analytics.herd(),
      breeding: await this.analytics.breeding(),
      inventory: await this.analytics.inventory(),
    };
  }

async kpis() {

  const [
    summary,
    finance,
    milk,
    health,
    breeding,
    inventory,
    alerts,
  ] = await Promise.all([

    this.summary(),

    this.finance(),

    this.milk(),

    this.health(),

    this.breeding(),

    this.inventory(),

    this.alertsService.today(),

  ]);

  return {

    totalCattle: summary.totalCattle,

    activeCattle: summary.activeCattle,

    todayMilk: milk.todayMilk,

    totalMilk: milk.totalMilk,

    revenue: finance.totalIncome,

    expenses: finance.totalExpense,

    profit: finance.netProfit,

    inventoryValue: inventory.totalInventoryValue,

    healthyAnimals: health.healthy,

    sickAnimals: health.sick,

    pregnantAnimals: breeding.pregnant,

    expectedCalving: breeding.expectedCalving,

    activeAlerts: alerts.length,

  };

}

async recent() {

  const transactions =
    await this.prisma.transaction.findMany({

      take: 5,

      orderBy: {

        createdAt: 'desc',

      },

    });

  const milk =
    await this.prisma.milkProduction.findMany({

      take: 5,

      include: {

        cattle: true,

      },

      orderBy: {

        createdAt: 'desc',

      },

    });

  const health =
    await this.prisma.healthRecord.findMany({

      take: 5,

      include: {

        cattle: true,

      },

      orderBy: {

        createdAt: 'desc',

      },

    });

  return {

    transactions,

    milk,

    health,

  };

}
async dashboard() {
    const [kpis, charts, recent, topCows, alerts, overview] =
      await Promise.all([
        this.kpis(),
        this.charts(),
        this.recent(),
        this.topCows(),
        this.alerts(),
        this.overview(),
      ]);

    return {
      generatedAt: new Date(),
      system: {
        name: 'Cattle Management System',
        version: '1.0.0',
      },
      kpis,
      charts,
      topCows,
      recent,
      alerts,
      overview,
    };
  }
  
async topCows() {
    const milk = await this.prisma.milkProduction.groupBy({
      by: ['cattleId'],
      _sum: {
        quantityLiters: true,
      },
      orderBy: {
        _sum: {
          quantityLiters: 'desc',
        },
      },
      take: 10,
    });

    const result: any[] = []; // <--- Type added here to fix TS2345

    for (const row of milk) {
      const cattle = await this.prisma.cattle.findUnique({
        where: {
          id: row.cattleId,
        },
      });

      result.push({
        tagNumber: cattle?.tagNumber,
        name: cattle?.name,
        totalMilk: row._sum.quantityLiters,
      });
    }

    return result;
  }

async alerts() {
    return this.alertsService.today();
}
} // Final closing brace of DashboardService class