-- CreateTable
CREATE TABLE "StockAdjustment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "inventoryId" TEXT NOT NULL,
    "adjustmentType" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "adjustmentDate" DATETIME NOT NULL,
    "reason" TEXT,
    "referenceNumber" TEXT,
    "createdBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StockAdjustment_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
