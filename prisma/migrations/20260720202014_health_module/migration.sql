-- CreateTable
CREATE TABLE "HealthRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cattleId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Healthy',
    "diagnosis" TEXT,
    "treatment" TEXT,
    "medicine" TEXT,
    "dosage" TEXT,
    "veterinarian" TEXT,
    "cost" REAL,
    "visitDate" DATETIME NOT NULL,
    "nextVisit" DATETIME,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "HealthRecord_cattleId_fkey" FOREIGN KEY ("cattleId") REFERENCES "Cattle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
