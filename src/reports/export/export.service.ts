import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ExportService {

  async exportExcel(
    sheetName: string,
    columns: Partial<ExcelJS.Column>[],
    rows: any[],
  ): Promise<Buffer> {

    const workbook = new ExcelJS.Workbook();

    workbook.creator = 'Cattle Management System';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet(sheetName);

    worksheet.columns = columns;

    worksheet.addRows(rows);

    worksheet.getRow(1).font = {
      bold: true,
      size: 12,
    };

    worksheet.getRow(1).alignment = {
      horizontal: 'center',
    };

    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9EAD3' },
    };

    worksheet.columns.forEach((column) => {
      if (!column.width) {
        column.width = 22;
      }
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return Buffer.from(buffer);
  }

  async exportExecutiveWorkbook(data: {
    summary: any;
    finance: any;
    milk: any;
    inventory: any;
    health: any;
    breeding: any;
  }): Promise<Buffer> {

    const workbook = new ExcelJS.Workbook();

    workbook.creator = 'Cattle Management System';
    workbook.created = new Date();

    //
    // Sheet 1
    //

    const summary = workbook.addWorksheet('Executive Summary');

    summary.columns = [
      { header: 'Metric', key: 'metric', width: 40 },
      { header: 'Value', key: 'value', width: 25 },
    ];

    Object.entries(data.summary).forEach(([key, value]) => {

      summary.addRow({
        metric: key,
        value,
      });

    });

    //
    // Sheet 2
    //

    const finance = workbook.addWorksheet('Finance');

    finance.columns = [
      { header: 'Metric', key: 'metric', width: 40 },
      { header: 'Value', key: 'value', width: 25 },
    ];

    Object.entries(data.finance).forEach(([key, value]) => {

      finance.addRow({
        metric: key,
        value,
      });

    });

    //
    // Sheet 3
    //

    const milk = workbook.addWorksheet('Milk');

    milk.columns = [
      { header: 'Field', key: 'field', width: 40 },
      { header: 'Value', key: 'value', width: 30 },
    ];

    Object.entries(data.milk).forEach(([key, value]) => {

      milk.addRow({
        field: key,
        value:
          typeof value === 'object'
            ? JSON.stringify(value)
            : value,
      });

    });

    //
    // Sheet 4
    //

    const inventory = workbook.addWorksheet('Inventory');

    inventory.columns = [
      { header: 'Field', key: 'field', width: 40 },
      { header: 'Value', key: 'value', width: 30 },
    ];

    Object.entries(data.inventory).forEach(([key, value]) => {

      inventory.addRow({
        field: key,
        value:
          typeof value === 'object'
            ? JSON.stringify(value)
            : value,
      });

    });

    //
    // Sheet 5
    //

    const health = workbook.addWorksheet('Health');

    health.columns = [
      { header: 'Field', key: 'field', width: 40 },
      { header: 'Value', key: 'value', width: 30 },
    ];

    Object.entries(data.health).forEach(([key, value]) => {

      health.addRow({
        field: key,
        value:
          typeof value === 'object'
            ? JSON.stringify(value)
            : value,
      });

    });

    //
    // Sheet 6
    //

    const breeding = workbook.addWorksheet('Breeding');

    breeding.columns = [
      { header: 'Field', key: 'field', width: 40 },
      { header: 'Value', key: 'value', width: 30 },
    ];

    Object.entries(data.breeding).forEach(([key, value]) => {

      breeding.addRow({
        field: key,
        value:
          typeof value === 'object'
            ? JSON.stringify(value)
            : value,
      });

    });

    workbook.eachSheet((sheet) => {

      sheet.getRow(1).font = {
        bold: true,
      };

    });

    const buffer = await workbook.xlsx.writeBuffer();

    return Buffer.from(buffer);

  }

}