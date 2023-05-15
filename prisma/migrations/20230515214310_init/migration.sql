-- CreateTable
CREATE TABLE "Error" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "flow" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "stackStr" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Stack" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "file" TEXT NOT NULL,
    "function" TEXT NOT NULL,
    "line" INTEGER NOT NULL,
    "column" INTEGER NOT NULL,
    "errorId" INTEGER NOT NULL,
    CONSTRAINT "Stack_errorId_fkey" FOREIGN KEY ("errorId") REFERENCES "Error" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CodeLine" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "line" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "isErrorLine" BOOLEAN NOT NULL,
    "stackId" INTEGER NOT NULL,
    CONSTRAINT "CodeLine_stackId_fkey" FOREIGN KEY ("stackId") REFERENCES "Stack" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SystemDetails" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "arch" TEXT NOT NULL,
    "processor" TEXT NOT NULL,
    "hostname" TEXT,
    "platform" TEXT NOT NULL,
    "platformRelease" TEXT,
    "platformVersion" TEXT,
    "user" TEXT,
    "errorId" INTEGER NOT NULL,
    CONSTRAINT "SystemDetails_errorId_fkey" FOREIGN KEY ("errorId") REFERENCES "Error" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExecutionDetails" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "language" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "executionFinishTime" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ExecutionArgument" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "argument" TEXT NOT NULL,
    "executionDetailsId" INTEGER NOT NULL,
    CONSTRAINT "ExecutionArgument_executionDetailsId_fkey" FOREIGN KEY ("executionDetailsId") REFERENCES "ExecutionDetails" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EnvironmentDetails" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "errorId" INTEGER NOT NULL,
    CONSTRAINT "EnvironmentDetails_errorId_fkey" FOREIGN KEY ("errorId") REFERENCES "Error" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExtraDetails" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "errorId" INTEGER NOT NULL,
    CONSTRAINT "ExtraDetails_errorId_fkey" FOREIGN KEY ("errorId") REFERENCES "Error" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "SystemDetails_errorId_key" ON "SystemDetails"("errorId");
