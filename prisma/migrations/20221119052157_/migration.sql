/*
  Warnings:

  - You are about to drop the column `status` on the `monitor` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `schedule_monitoring` table. All the data in the column will be lost.
  - Added the required column `id_status` to the `schedule_monitoring` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `schedule_monitoring` DROP FOREIGN KEY `schedule_monitoring_monitor_id_fkey`;

-- AlterTable
ALTER TABLE `monitor` DROP COLUMN `status`,
    ADD COLUMN `id_status` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `schedule_monitoring` DROP COLUMN `status`,
    ADD COLUMN `id_status` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `status_monitoring` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `status_schedule_monitoring` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `monitor` ADD CONSTRAINT `monitor_id_status_fkey` FOREIGN KEY (`id_status`) REFERENCES `status_monitoring`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schedule_monitoring` ADD CONSTRAINT `schedule_monitoring_id_status_fkey` FOREIGN KEY (`id_status`) REFERENCES `status_schedule_monitoring`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schedule_monitoring` ADD CONSTRAINT `schedule_monitoring_monitor_id_fkey` FOREIGN KEY (`monitor_id`) REFERENCES `monitor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
