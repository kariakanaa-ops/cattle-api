import { Controller, Get } from '@nestjs/common';
import { AlertsService } from './alerts.service';

@Controller('alerts')
export class AlertsController {
  constructor(
    private readonly alertsService: AlertsService,
  ) {}

  @Get()
  getAllAlerts() {
    return this.alertsService.getAllAlerts();
  }

  @Get('today')
  today() {
    return this.alertsService.today();
  }

  @Get('critical')
  critical() {
    return this.alertsService.critical();
  }

  @Get('health')
  health() {
    return this.alertsService.healthAlerts();
  }

  @Get('breeding')
  breeding() {
    return this.alertsService.breedingAlerts();
  }

  @Get('inventory')
  inventory() {
    return this.alertsService.inventoryAlerts();
  }

  @Get('milk')
  milk() {
    return this.alertsService.milkAlerts();
  }

  @Get('finance')
  finance() {
    return this.alertsService.financeAlerts();
  }

  @Get('executive')
  executive() {
    return this.alertsService.executiveSummary();
  }
}