-- AlterTable
ALTER TABLE `schedule_monitoring` ADD COLUMN `type_monitoring_id` INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE `type_monitoring` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(32) NOT NULL,

    UNIQUE INDEX `type_monitoring_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `schedule_monitoring` ADD CONSTRAINT `schedule_monitoring_type_monitoring_id_fkey` FOREIGN KEY (`type_monitoring_id`) REFERENCES `type_monitoring`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
