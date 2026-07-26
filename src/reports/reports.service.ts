import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReportFilterDto } from './dto/report-filter.dto';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async milkProductionReport(filter: ReportFilterDto) {
    const start = filter.startDate
      ? new Date(filter.startDate)
      : new Date(new Date().setHours(0, 0, 0, 0));

    const end = filter.endDate ? new Date(filter.endDate) : new Date();

    const records = await this.prisma.milkProduction.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
      include: {
        cattle: {
          include: {
            group: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    const totalMilk = records.reduce(
      (sum, r) => sum + r.quantityLiters,
      0,
    );

    const averageMilk =
      records.length > 0 ? totalMilk / records.length : 0;

    const byCow = new Map<
      string,
      {
        tagNumber: string;
        name: string;
        total: number;
      }
    >();

    const byGroup = new Map<string, number>();

    for (const record of records) {
      const cowKey = record.cattle.id;

      if (!byCow.has(cowKey)) {
        byCow.set(cowKey, {
          tagNumber: record.cattle.tagNumber,
          name: record.cattle.name,
          total: 0,
        });
      }

      byCow.get(cowKey)!.total += record.quantityLiters;

      const group = record.cattle.group?.name ?? 'Ungrouped';

      byGroup.set(
        group,
        (byGroup.get(group) ?? 0) + record.quantityLiters,
      );
    }

    const cows = [...byCow.values()].sort((a, b) => b.total - a.total);

    return {
      period: {
        start,
        end,
      },
      totalMilk,
      averageMilk,
      totalRecords: records.length,
      highestProducer: cows.length > 0 ? cows[0] : null,
      lowestProducer: cows.length > 0 ? cows[cows.length - 1] : null,
      productionByCow: cows,
      productionByGroup: Object.fromEntries(byGroup),
    };
  }
  async inventoryReport() {

  const inventory =
    await this.prisma.inventory.findMany({

      include: {

        vendor: true,

      },

      orderBy: {

        itemName: 'asc',

      },

    });

  const totalItems = inventory.length;

  const totalQuantity =
    inventory.reduce(

      (sum, item) =>

        sum + item.quantity,

      0,

    );

  const totalValue =
    inventory.reduce(

      (sum, item) =>

        sum + (item.quantity * item.unitCost),

      0,

    );

  const lowStock =
    inventory.filter(

      item =>

        item.quantity <= item.reorderLevel,

    );

  return {

    totalItems,

    totalQuantity,

    totalValue,

    lowStockCount:

      lowStock.length,

    lowStock,

    inventory,

  };

}
async financeReport() {

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

  const transactions =
    await this.prisma.transaction.findMany({

      orderBy: {

        transactionDate: 'desc',

      },

    });

  return {

    income:

      income._sum.amount ?? 0,

    expense:

      expense._sum.amount ?? 0,

    profit:

      (income._sum.amount ?? 0)

      -

      (expense._sum.amount ?? 0),

    transactions,

  };

}
async healthReport() {

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

  const records =
    await this.prisma.healthRecord.findMany({

      include: {

        cattle: true,

      },

      orderBy: {

        visitDate: 'desc',

      },

    });

  return {

    healthy,

    sick,

    recovering,

    records,

  };

}
async breedingReport() {

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

        pregnancyStatus: 'Calved',

      },

    });

  const failed =
    await this.prisma.breedingRecord.count({

      where: {

        pregnancyStatus: 'Failed',

      },

    });

  const records =
    await this.prisma.breedingRecord.findMany({

      include: {

        cattle: true,

      },

      orderBy: {

        breedingDate: 'desc',

      },

    });

  return {

    total,

    pregnant,

    open,

    calved,

    failed,

    records,

  };

}
async executiveReport() {

  const [

    summary,

    finance,

    inventory,

    milk,

    health,

    breeding,

  ] = await Promise.all([

    this.prisma.cattle.count(),

    this.financeReport(),

    this.inventoryReport(),

    this.milkProductionReport({}),

    this.healthReport(),

    this.breedingReport(),

  ]);

  return {

    generatedAt: new Date(),

    totalCattle: summary,

    finance,

    inventory,

    milk,

    health,

    breeding,

  };

}
async milkTrend(days = 30) {

  const start = new Date();
  start.setDate(start.getDate() - days);

  const records =
    await this.prisma.milkProduction.findMany({

      where: {
        date: {
          gte: start,
        },
      },

      orderBy: {
        date: 'asc',
      },

    });

  const trend = new Map<string, number>();

  for (const record of records) {

    const key =
      record.date.toISOString().substring(0, 10);

    trend.set(
      key,
      (trend.get(key) ?? 0) +
        record.quantityLiters,
    );

  }

  return Object.entries(
    Object.fromEntries(trend),
  ).map(([date, liters]) => ({
    date,
    liters,
  }));

}
async revenueTrend() {

  const transactions =
    await this.prisma.transaction.findMany();

  const months =
    new Map<string, number>();

  for (const tx of transactions) {

    const key =
      tx.transactionDate
        .toISOString()
        .substring(0, 7);

    months.set(
      key,
      (months.get(key) ?? 0) +
        tx.amount,
    );

  }

  return Object.entries(
    Object.fromEntries(months),
  ).map(([month, amount]) => ({
    month,
    amount,
  }));

}
async inventorySummary() {

  const inventory =
    await this.prisma.inventory.findMany();

  return {

    items: inventory.length,

    quantity:
      inventory.reduce(
        (s, i) => s + i.quantity,
        0,
      ),

    value:
      inventory.reduce(
        (s, i) =>
          s +
          i.quantity *
            i.unitCost,
        0,
      ),

  };

}
async herdDistribution() {

  const herd =
    await this.prisma.cattle.groupBy({

      by: ['stage'],

      _count: true,

    });

  return herd;

}
}