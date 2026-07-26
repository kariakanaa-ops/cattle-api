import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ExportService {

  async exportExcel(
    sheetName: string,
    columns: { header: string; key: string; width?: number }[],
    rows: any[],
  ): Promise<Buffer> {

    const workbook = new ExcelJS.Workbook();

    workbook.creator = 'Cattle Management System';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet(sheetName);

    worksheet.columns = columns;

    worksheet.getRow(1).font = {
      bold: true,
    };

    worksheet.getRow(1).alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    worksheet.addRows(rows);

    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    return Buffer.from(
      await workbook.xlsx.writeBuffer(),
    );
  }
  async exportExecutiveWorkbook(
  data: {
    summary: any;
    finance: any;
    milk: any;
    inventory: any;
    health: any;
    breeding: any;
  },
): Promise<Buffer> {

  const workbook = new ExcelJS.Workbook();

  workbook.creator = 'Cattle Management System';
  workbook.created = new Date();

  //
  // Executive Summary
  //

  let sheet =
    workbook.addWorksheet('Executive Summary');

  sheet.columns = [
    { header: 'Metric', key: 'metric', width: 40 },
    { header: 'Value', key: 'value', width: 25 },
  ];

  sheet.addRows([

    {
      metric: 'Generated',
      value: new Date().toLocaleString(),
    },

    {
      metric: 'Total Animals',
      value: data.summary.totalAnimals,
    },

    {
      metric: 'Active Animals',
      value: data.summary.activeAnimals,
    },

    {
      metric: 'Milk Today',
      value: data.summary.todayMilk,
    },

    {
      metric: 'Inventory Value',
      value: data.summary.inventoryValue,
    },

    {
      metric: 'Net Profit',
      value: data.summary.netProfit,
    },

  ]);

  //
  // Finance
  //

  sheet =
    workbook.addWorksheet('Finance');

  sheet.columns = [

    { header: 'Metric', key: 'metric', width: 40 },

    { header: 'Value', key: 'value', width: 20 },

  ];

  sheet.addRows([

    {
      metric: 'Income',
      value: data.finance.totalIncome,
    },

    {
      metric: 'Expenses',
      value: data.finance.totalExpense,
    },

    {
      metric: 'Net Profit',
      value: data.finance.netProfit,
    },

  ]);

  //
  // Milk
  //

  sheet =
    workbook.addWorksheet('Milk');

  sheet.columns = [

    { header: 'Animal', key: 'animal', width: 25 },

    { header: 'Litres', key: 'litres', width: 20 },

  ];

  sheet.addRows(
    data.milk.productionByCow.map((x: any) => ({
      animal: x.tagNumber,
      litres: x.total,
    })),
  );

  //
  // Inventory
  //

  sheet =
    workbook.addWorksheet('Inventory');

  sheet.columns = [

    { header: 'Item', key: 'item', width: 30 },

    { header: 'Quantity', key: 'qty', width: 15 },

    { header: 'Unit Cost', key: 'cost', width: 15 },

  ];

  sheet.addRows(
    data.inventory.items.map((x: any) => ({
      item: x.itemName,
      qty: x.quantity,
      cost: x.unitCost,
    })),
  );

  //
  // Health
  //

  sheet =
    workbook.addWorksheet('Health');

  sheet.columns = [

    { header: 'Animal', key: 'animal', width: 20 },

    { header: 'Diagnosis', key: 'diagnosis', width: 35 },

    { header: 'Status', key: 'status', width: 20 },

  ];

  sheet.addRows(
    data.health.records.map((x: any) => ({
      animal: x.tagNumber,
      diagnosis: x.diagnosis,
      status: x.status,
    })),
  );

  //
  // Breeding
  //

  sheet =
    workbook.addWorksheet('Breeding');

  sheet.columns = [

    { header: 'Animal', key: 'animal', width: 20 },

    { header: 'Method', key: 'method', width: 20 },

    {
      header: 'Pregnancy',
      key: 'pregnancy',
      width: 20,
    },

  ];

  sheet.addRows(
    data.breeding.records.map((x: any) => ({
      animal: x.tagNumber,
      method: x.method,
      pregnancy: x.pregnancyStatus,
    })),
  );

  //
  // Formatting
  //

  workbook.eachSheet((ws) => {

    ws.getRow(1).font = {
      bold: true,
    };

    ws.getRow(1).alignment = {
      horizontal: 'center',
    };

  });

  return Buffer.from(
    await workbook.xlsx.writeBuffer(),
  );

}
}