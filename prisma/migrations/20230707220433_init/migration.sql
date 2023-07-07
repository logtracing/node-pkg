-- CreateTable
CREATE TABLE `log_groups` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `log_groups_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `level` ENUM('TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL') NOT NULL DEFAULT 'INFO',
    `flow` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `log_group_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `error_exceptions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `package` VARCHAR(191) NOT NULL,
    `flow` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `stack_str` TEXT NOT NULL,
    `log_group_id` INTEGER NULL,
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
    `error_exception_id` INTEGER NOT NULL,

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
    `error_exception_id` INTEGER NOT NULL,

    UNIQUE INDEX `system_details_error_exception_id_key`(`error_exception_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `execution_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `language` VARCHAR(191) NOT NULL,
    `version` VARCHAR(191) NOT NULL,
    `execution_finish_time` DATETIME(3) NOT NULL,
    `error_exception_id` INTEGER NOT NULL,

    UNIQUE INDEX `execution_details_error_exception_id_key`(`error_exception_id`),
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
CREATE TABLE `environment_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `value` TEXT NOT NULL,
    `error_exception_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `extra_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `value` TEXT NOT NULL,
    `is_json` BOOLEAN NOT NULL,
    `error_exception_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `logs` ADD CONSTRAINT `logs_log_group_id_fkey` FOREIGN KEY (`log_group_id`) REFERENCES `log_groups`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `error_exceptions` ADD CONSTRAINT `error_exceptions_log_group_id_fkey` FOREIGN KEY (`log_group_id`) REFERENCES `log_groups`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stack` ADD CONSTRAINT `stack_error_exception_id_fkey` FOREIGN KEY (`error_exception_id`) REFERENCES `error_exceptions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stack_code_lines` ADD CONSTRAINT `stack_code_lines_stack_id_fkey` FOREIGN KEY (`stack_id`) REFERENCES `stack`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `system_details` ADD CONSTRAINT `system_details_error_exception_id_fkey` FOREIGN KEY (`error_exception_id`) REFERENCES `error_exceptions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `execution_details` ADD CONSTRAINT `execution_details_error_exception_id_fkey` FOREIGN KEY (`error_exception_id`) REFERENCES `error_exceptions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `execution_arguments` ADD CONSTRAINT `execution_arguments_execution_details_id_fkey` FOREIGN KEY (`execution_details_id`) REFERENCES `execution_details`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `environment_details` ADD CONSTRAINT `environment_details_error_exception_id_fkey` FOREIGN KEY (`error_exception_id`) REFERENCES `error_exceptions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `extra_details` ADD CONSTRAINT `extra_details_error_exception_id_fkey` FOREIGN KEY (`error_exception_id`) REFERENCES `error_exceptions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;