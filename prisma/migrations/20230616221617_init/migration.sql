-- CreateTable
CREATE TABLE `errors_groups` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `errors` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `package` VARCHAR(191) NOT NULL,
    `flow` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `stack_str` TEXT NOT NULL,
    `error_group_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stack` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `file` VARCHAR(191) NOT NULL,
    `function` VARCHAR(191) NOT NULL,
    `line` INTEGER NOT NULL,
    `column` INTEGER NOT NULL,
    `error_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stack_code_lines` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `line` INTEGER NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `is_error_line` BOOLEAN NOT NULL,
    `stack_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `system_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `arch` VARCHAR(191) NOT NULL,
    `processor` VARCHAR(191) NOT NULL,
    `hostname` VARCHAR(191) NULL,
    `platform` VARCHAR(191) NOT NULL,
    `platform_release` VARCHAR(191) NULL,
    `platform_version` VARCHAR(191) NULL,
    `user` VARCHAR(191) NULL,
    `error_id` INTEGER NOT NULL,

    UNIQUE INDEX `system_details_error_id_key`(`error_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `execution_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `language` VARCHAR(191) NOT NULL,
    `version` VARCHAR(191) NOT NULL,
    `execution_finish_time` DATETIME(3) NOT NULL,
    `error_id` INTEGER NOT NULL,

    UNIQUE INDEX `execution_details_error_id_key`(`error_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `execution_arguments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `argument` VARCHAR(191) NOT NULL,
    `execution_details_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `envirnment_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `value` TEXT NOT NULL,
    `error_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `extra_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `value` TEXT NOT NULL,
    `error_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `errors` ADD CONSTRAINT `errors_error_group_id_fkey` FOREIGN KEY (`error_group_id`) REFERENCES `errors_groups`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stack` ADD CONSTRAINT `stack_error_id_fkey` FOREIGN KEY (`error_id`) REFERENCES `errors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stack_code_lines` ADD CONSTRAINT `stack_code_lines_stack_id_fkey` FOREIGN KEY (`stack_id`) REFERENCES `stack`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `system_details` ADD CONSTRAINT `system_details_error_id_fkey` FOREIGN KEY (`error_id`) REFERENCES `errors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `execution_details` ADD CONSTRAINT `execution_details_error_id_fkey` FOREIGN KEY (`error_id`) REFERENCES `errors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `execution_arguments` ADD CONSTRAINT `execution_arguments_execution_details_id_fkey` FOREIGN KEY (`execution_details_id`) REFERENCES `execution_details`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `envirnment_details` ADD CONSTRAINT `envirnment_details_error_id_fkey` FOREIGN KEY (`error_id`) REFERENCES `errors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `extra_details` ADD CONSTRAINT `extra_details_error_id_fkey` FOREIGN KEY (`error_id`) REFERENCES `errors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
