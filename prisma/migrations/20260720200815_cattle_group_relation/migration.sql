/*
  Warnings:

  - You are about to drop the column `groupName` on the `Cattle` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cattle" (
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
    "photo" TEXT,
    "notes" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Cattle_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "CattleGroup" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Cattle" ("acquisitionDate", "acquisitionType", "active", "breed", "createdAt", "dateOfBirth", "gender", "groupId", "id", "lactationNumber", "name", "notes", "photo", "stage", "status", "tagNumber", "updatedAt", "weightKg") SELECT "acquisitionDate", "acquisitionType", "active", "breed", "createdAt", "dateOfBirth", "gender", "groupId", "id", "lactationNumber", "name", "notes", "photo", "stage", "status", "tagNumber", "updatedAt", "weightKg" FROM "Cattle";
DROP TABLE "Cattle";
ALTER TABLE "new_Cattle" RENAME TO "Cattle";
CREATE UNIQUE INDEX "Cattle_tagNumber_key" ON "Cattle"("tagNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
