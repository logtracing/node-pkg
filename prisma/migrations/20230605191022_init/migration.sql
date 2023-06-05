-- CreateTable
CREATE TABLE `Error` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `flow` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `stackStr` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Stack` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `file` VARCHAR(191) NOT NULL,
    `function` VARCHAR(191) NOT NULL,
    `line` INTEGER NOT NULL,
    `column` INTEGER NOT NULL,
    `errorId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CodeLine` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `line` INTEGER NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `isErrorLine` BOOLEAN NOT NULL,
    `stackId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SystemDetails` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `arch` VARCHAR(191) NOT NULL,
    `processor` VARCHAR(191) NOT NULL,
    `hostname` VARCHAR(191) NULL,
    `platform` VARCHAR(191) NOT NULL,
    `platformRelease` VARCHAR(191) NULL,
    `platformVersion` VARCHAR(191) NULL,
    `user` VARCHAR(191) NULL,
    `errorId` INTEGER NOT NULL,

    UNIQUE INDEX `SystemDetails_errorId_key`(`errorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExecutionDetails` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `language` VARCHAR(191) NOT NULL,
    `version` VARCHAR(191) NOT NULL,
    `executionFinishTime` DATETIME(3) NOT NULL,
    `errorId` INTEGER NOT NULL,

    UNIQUE INDEX `ExecutionDetails_errorId_key`(`errorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExecutionArgument` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `argument` VARCHAR(191) NOT NULL,
    `executionDetailsId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EnvironmentDetails` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `value` TEXT NOT NULL,
    `errorId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExtraDetails` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `errorId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Stack` ADD CONSTRAINT `Stack_errorId_fkey` FOREIGN KEY (`errorId`) REFERENCES `Error`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CodeLine` ADD CONSTRAINT `CodeLine_stackId_fkey` FOREIGN KEY (`stackId`) REFERENCES `Stack`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SystemDetails` ADD CONSTRAINT `SystemDetails_errorId_fkey` FOREIGN KEY (`errorId`) REFERENCES `Error`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExecutionDetails` ADD CONSTRAINT `ExecutionDetails_errorId_fkey` FOREIGN KEY (`errorId`) REFERENCES `Error`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExecutionArgument` ADD CONSTRAINT `ExecutionArgument_executionDetailsId_fkey` FOREIGN KEY (`executionDetailsId`) REFERENCES `ExecutionDetails`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EnvironmentDetails` ADD CONSTRAINT `EnvironmentDetails_errorId_fkey` FOREIGN KEY (`errorId`) REFERENCES `Error`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExtraDetails` ADD CONSTRAINT `ExtraDetails_errorId_fkey` FOREIGN KEY (`errorId`) REFERENCES `Error`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
