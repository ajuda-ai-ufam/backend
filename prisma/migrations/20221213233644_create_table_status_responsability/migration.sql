/*
  Warnings:

  - You are about to drop the column `status` on the `subject_responsability` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `subject_responsability` DROP COLUMN `status`,
    ADD COLUMN `id_status` INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE `status_responsability` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `subject_responsability` ADD CONSTRAINT `subject_responsability_id_status_fkey` FOREIGN KEY (`id_status`) REFERENCES `status_responsability`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
