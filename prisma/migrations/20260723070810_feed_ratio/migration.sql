-- CreateTable
CREATE TABLE "FeedRatio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FeedRatio_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "CattleGroup" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FeedRatioComponent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "feedRatioId" TEXT NOT NULL,
    "inventoryId" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "unit" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FeedRatioComponent_feedRatioId_fkey" FOREIGN KEY ("feedRatioId") REFERENCES "FeedRatio" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FeedRatioComponent_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ScheduledFeedRatio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "feedRatioId" TEXT NOT NULL,
    "scheduledTime" TEXT NOT NULL,
    "monday" BOOLEAN NOT NULL DEFAULT true,
    "tuesday" BOOLEAN NOT NULL DEFAULT true,
    "wednesday" BOOLEAN NOT NULL DEFAULT true,
    "thursday" BOOLEAN NOT NULL DEFAULT true,
    "friday" BOOLEAN NOT NULL DEFAULT true,
    "saturday" BOOLEAN NOT NULL DEFAULT true,
    "sunday" BOOLEAN NOT NULL DEFAULT true,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ScheduledFeedRatio_feedRatioId_fkey" FOREIGN KEY ("feedRatioId") REFERENCES "FeedRatio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
