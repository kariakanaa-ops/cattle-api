-- CreateTable
CREATE TABLE "MilkProduction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cattleId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "session" TEXT NOT NULL,
    "quantityLiters" REAL NOT NULL,
    "milkUsedByCalves" REAL DEFAULT 0,
    "fatPercentage" REAL,
    "proteinPercentage" REAL,
    "somaticCellCount" INTEGER,
    "qualityGrade" TEXT NOT NULL DEFAULT 'A',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MilkProduction_cattleId_fkey" FOREIGN KEY ("cattleId") REFERENCES "Cattle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
