/*
  Warnings:

  - Added the required column `description` to the `student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `student` ADD COLUMN `description` VARCHAR(500) NOT NULL;
