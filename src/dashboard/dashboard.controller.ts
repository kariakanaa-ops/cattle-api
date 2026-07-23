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

}