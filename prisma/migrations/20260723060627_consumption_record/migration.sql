-- CreateTable
CREATE TABLE "ConsumptionRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "inventoryId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "feedingDate" DATETIME NOT NULL,
    "notes" TEXT,
    "recordedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ConsumptionRecord_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ConsumptionRecord_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "CattleGroup" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
