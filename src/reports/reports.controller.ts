import {
  Controller,
  Get,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ReportsService } from './reports.service';
import { ExportService } from '../export/export.service';
import { ReportFilterDto } from './dto/report-filter.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

import { UserRole } from '@prisma/client';

@ApiTags('Reports')
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
    private readonly exportService: ExportService,
  ) {}

  //====================================================
  // REPORTS
  //====================================================

  @Get('milk')
  milkReport(
    @Query() filter: ReportFilterDto,
  ) {
    return this.reportsService.milkProductionReport(filter);
  }

  @Get('inventory')
  inventoryReport() {
    return this.reportsService.inventoryReport();
  }

  @Get('finance')
  financeReport() {
    return this.reportsService.financeReport();
  }

  @Get('health')
  healthReport() {
    return this.reportsService.healthReport();
  }

  @Get('breeding')
  breedingReport() {
    return this.reportsService.breedingReport();
  }

  @Get('executive')
  executiveReport() {
    return this.reportsService.executiveReport();
  }

  //====================================================
  // ANALYTICS
  //====================================================

  @Get('analytics/revenue')
  revenueTrend() {
    return this.reportsService.revenueTrend();
  }

  @Get('analytics/inventory')
  inventoryAnalytics() {
    return this.reportsService.inventorySummary();
  }

  @Get('analytics/herd')
  herdDistribution() {
    return this.reportsService.herdDistribution();
  }

  //====================================================
  // EXPORTS
  //====================================================

  @Get('milk/export/excel')
  async exportMilkExcel(
    @Query() filter: ReportFilterDto,
    @Res() res: Response,
  ) {

    const report =
      await this.reportsService.milkProductionReport(filter);

    const rows =
      report.productionByCow.map((cow) => ({

        Tag: cow.tagNumber,

        Name: cow.name,

        TotalMilk: cow.total,

      }));

    const file =
      await this.exportService.exportExcel(

        'Milk Production',

        [

          {
            header: 'Tag Number',
            key: 'Tag',
            width: 20,
          },

          {
            header: 'Animal Name',
            key: 'Name',
            width: 25,
          },

          {
            header: 'Total Milk (L)',
            key: 'TotalMilk',
            width: 20,
          },

        ],

        rows,

      );

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );

    res.setHeader(
      'Content-Disposition',
      'attachment; filename=milk-report.xlsx',
    );

    return res.end(file);

  }
  @Get('executive/export/excel')
async exportExecutiveExcel(
  @Res() res: Response,
) {

  const summary =
    await this.reportsService.executiveReport();

  const finance =
    await this.reportsService.financeReport();

  const milk =
    await this.reportsService.milkProductionReport({});

  const inventory =
    await this.reportsService.inventoryReport();

  const health =
    await this.reportsService.healthReport();

  const breeding =
    await this.reportsService.breedingReport();

  const file =
    await this.exportService.exportExecutiveWorkbook({

      summary,

      finance,

      milk,

      inventory,

      health,

      breeding,

    });

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );

  res.setHeader(
    'Content-Disposition',
    'attachment; filename=Executive-Report.xlsx',
  );

  return res.end(file);

}

}