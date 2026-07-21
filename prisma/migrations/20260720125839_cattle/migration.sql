-- CreateTable
CREATE TABLE "Cattle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tagNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "breed" TEXT NOT NULL,
    "dateOfBirth" DATETIME NOT NULL,
    "gender" TEXT NOT NULL DEFAULT 'Female',
    "status" TEXT NOT NULL DEFAULT 'Active',
    "stage" TEXT NOT NULL,
    "lactationNumber" INTEGER NOT NULL DEFAULT 0,
    "weightKg" REAL,
    "acquisitionDate" DATETIME,
    "acquisitionType" TEXT NOT NULL DEFAULT 'Born_on_Farm',
    "groupId" TEXT,
    "groupName" TEXT,
    "photo" TEXT,
    "notes" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Cattle_tagNumber_key" ON "Cattle"("tagNumber");
