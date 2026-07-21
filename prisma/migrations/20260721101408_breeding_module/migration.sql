-- CreateTable
CREATE TABLE "BreedingRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cattleId" TEXT NOT NULL,
    "breedingDate" DATETIME NOT NULL,
    "method" TEXT NOT NULL,
    "bullName" TEXT,
    "semenBatch" TEXT,
    "technician" TEXT,
    "expectedCalving" DATETIME,
    "actualCalving" DATETIME,
    "pregnancyStatus" TEXT NOT NULL DEFAULT 'Open',
    "calfTag" TEXT,
    "calfGender" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BreedingRecord_cattleId_fkey" FOREIGN KEY ("cattleId") REFERENCES "Cattle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
