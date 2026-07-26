import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  getDashboard() {
    return this.analyticsService.dashboard();
  }

  @Get('herd')
  getHerdAnalytics() {
    return this.analyticsService.herd();
  }

  @Get('milk')
  getMilkAnalytics() {
    return this.analyticsService.milk();
  }

  @Get('finance')
  getFinanceAnalytics() {
    return this.analyticsService.finance();
  }

  @Get('revenue')
  getRevenueTrend() {
    return this.analyticsService.revenueTrend();
  }

  @Get('inventory')
  getInventoryAnalytics() {
    return this.analyticsService.inventory();
  }

  @Get('health')
  getHealthAnalytics() {
    return this.analyticsService.health();
  }

  @Get('breeding')
  getBreedingAnalytics() {
    return this.analyticsService.breeding();
  }
}