import { Controller, Get } from '@nestjs/common';
import { ReportsService } from './reports.service';
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
    UserRole.Manager,
    UserRole.Accountant,
)
@Controller('reports')
export class ReportsController {

  constructor(
    private readonly reportsService: ReportsService,
  ) {}

  @Get('milk/daily')
  dailyMilk() {
    return this.reportsService.dailyMilk();
  }

  @Get('milk/monthly')
  monthlyMilk() {
    return this.reportsService.monthlyMilk();
  }

  @Get('milk/by-cattle')
  milkByCattle() {
    return this.reportsService.milkByCattle();
  }

  @Get('finance/summary')
  financeSummary() {
    return this.reportsService.financeSummary();
  }

  @Get('herd')
  herdReport() {
    return this.reportsService.herdReport();
  }

  @Get('inventory')
  inventoryReport() {
    return this.reportsService.inventoryReport();
  }

  @Get('feed-consumption')
  feedConsumption() {
    return this.reportsService.feedConsumption();
  }

  @Get('breeding')
  breedingReport() {
    return this.reportsService.breedingReport();
  }

  @Get('health')
  healthReport() {
    return this.reportsService.healthReport();
  }

}