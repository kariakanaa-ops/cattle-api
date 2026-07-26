import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AlertsService {
  constructor(private readonly prisma: PrismaService) {}

  async inventoryAlerts() {
    const items = await this.prisma.inventory.findMany();
    const alerts: any[] = [];

    for (const item of items) {
      if (item.quantity <= 0) {
        alerts.push({
          severity: 'Critical',
          category: 'Inventory',
          title: 'Out of Stock',
          item: item.itemName,
          quantity: item.quantity,
        });
      } else if (item.quantity <= item.reorderLevel) {
        alerts.push({
          severity: 'Warning',
          category: 'Inventory',
          title: 'Low Stock',
          item: item.itemName,
          quantity: item.quantity,
          reorderLevel: item.reorderLevel,
        });
      }
    }

    return alerts;
  }

  async healthAlerts() {
    const today = new Date();
    const vaccinations = await this.prisma.healthRecord.findMany({
      where: {
        nextVisit: {
          lte: today,
        },
      },
      include: {
        cattle: true,
      },
    });

    return vaccinations.map((record) => ({
      severity: 'Warning',
      category: 'Health',
      title: 'Vaccination / Treatment Due',
      cattle: record.cattle.tagNumber,
      date: record.nextVisit,
    }));
  }

 async breedingAlerts() {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const calving = await this.prisma.breedingRecord.findMany({
      where: {
        expectedCalving: {
          gte: today,
          lte: nextWeek,
        },
      },
      include: {
        cattle: true, // <--- Reverted to 'cattle'
      },
    });

    return calving.map((record: any) => ({
      severity: 'Warning',
      category: 'Breeding',
      title: 'Expected Calving',
      cattle: record.cattle?.tagNumber ?? record.cattleId,
      expected: record.expectedCalving,
    }));
  }
  
  async milkAlerts() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const records = await this.prisma.milkProduction.findMany({
      where: {
        date: today,
      },
      include: {
        cattle: true,
      },
    });

    return records
      .filter((r) => r.quantityLiters < 5)
      .map((r) => ({
        severity: 'Warning',
        category: 'Milk',
        title: 'Low Milk Production',
        cattle: r.cattle.tagNumber,
        litres: r.quantityLiters,
      }));
  }

  async financeAlerts() {
    const expenses = await this.prisma.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        type: 'Expense',
      },
    });

    const income = await this.prisma.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        type: 'Income',
      },
    });

    const totalIncome = income._sum.amount ?? 0;
    const totalExpense = expenses._sum.amount ?? 0;

    if (totalExpense > totalIncome) {
      return [
        {
          severity: 'Critical',
          category: 'Finance',
          title: 'Expenses exceed income',
          income: totalIncome,
          expenses: totalExpense,
        },
      ];
    }

    return [];
  }

  async today() {
    const [inventory, health, breeding, milk, finance] = await Promise.all([
      this.inventoryAlerts(),
      this.healthAlerts(),
      this.breedingAlerts(),
      this.milkAlerts(),
      this.financeAlerts(),
    ]);

    return [...inventory, ...health, ...breeding, ...milk, ...finance];
  }

  async critical() {
    const alerts = await this.today();
    return alerts.filter((a) => a.severity === 'Critical');
  }

  async executiveSummary() {
    const alerts = await this.today();

    return {
      generatedAt: new Date(),
      totalAlerts: alerts.length,
      critical: alerts.filter((a) => a.severity === 'Critical').length,
      warning: alerts.filter((a) => a.severity === 'Warning').length,
      alerts,
    };
  }

  async getAllAlerts() {
    return this.today();
  }
}