import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
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
@Controller('dashboard')
export class DashboardController {
@Get()
dashboard() {
  return this.service.dashboard();
}
  constructor(
    private readonly service: DashboardService,
  ) {}

  @Get('summary')
  summary() {
    return this.service.summary();
  }

  @Get('finance')
  finance() {
    return this.service.finance();
  }

  @Get('milk')
  milk() {
    return this.service.milk();
  }

  @Get('inventory')
  inventory() {
    return this.service.inventory();
  }

  @Get('herd')
  herd() {
    return this.service.herd();
  }
  @Get('health')
health() {
  return this.service.health();
}

@Get('breeding')
breeding() {
  return this.service.breeding();
}

@Get('tasks')
tasks() {
  return this.service.tasks();
}

@Get('notifications')
notifications() {
  return this.service.notifications();
}

@Get('overview')
overview() {
  return this.service.overview();
}
@Get('charts')
charts() {
  return this.service.charts();
}

@Get('kpis')
kpis() {
  return this.service.kpis();
}

@Get('recent')
recent() {
  return this.service.recent();
}

@Get('top-cows')
topCows() {
  return this.service.topCows();
}

@Get('alerts')
alerts() {
  return this.service.alerts();
}
}