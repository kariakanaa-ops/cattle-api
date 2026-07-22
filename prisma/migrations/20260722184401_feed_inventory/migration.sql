-- CreateTable
CREATE TABLE "FeedCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "FeedInventory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "unit" TEXT NOT NULL,
    "minimumStock" REAL NOT NULL,
    "unitCost" REAL,
    "supplier" TEXT,
    "batchNumber" TEXT,
    "manufactureDate" DATETIME,
    "expiryDate" DATETIME,
    "storageLocation" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FeedInventory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "FeedCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FeedStockTransaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "feedId" TEXT NOT NULL,
    "transactionType" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "transactionDate" DATETIME NOT NULL,
    "reference" TEXT,
    "remarks" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FeedStockTransaction_feedId_fkey" FOREIGN KEY ("feedId") REFERENCES "FeedInventory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FeedConsumption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cattleId" TEXT NOT NULL,
    "feedId" TEXT NOT NULL,
    "feedingDate" DATETIME NOT NULL,
    "quantity" REAL NOT NULL,
    "session" TEXT NOT NULL,
    "remarks" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FeedConsumption_cattleId_fkey" FOREIGN KEY ("cattleId") REFERENCES "Cattle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FeedConsumption_feedId_fkey" FOREIGN KEY ("feedId") REFERENCES "FeedInventory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "FeedCategory_name_key" ON "FeedCategory"("name");
