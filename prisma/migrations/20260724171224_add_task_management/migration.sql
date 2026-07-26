-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'Medium',
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "dueDate" DATETIME NOT NULL,
    "completedAt" DATETIME,
    "assignedTo" TEXT,
    "createdBy" TEXT,
    "cattleId" TEXT,
    "groupId" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Task_cattleId_fkey" FOREIGN KEY ("cattleId") REFERENCES "Cattle" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Task_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "CattleGroup" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
