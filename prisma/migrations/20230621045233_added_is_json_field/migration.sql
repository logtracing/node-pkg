/*
  Warnings:

  - Added the required column `is_json` to the `extra_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `extra_details` ADD COLUMN `is_json` BOOLEAN NOT NULL;
