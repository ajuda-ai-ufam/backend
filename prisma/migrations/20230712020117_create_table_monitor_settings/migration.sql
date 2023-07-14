-- AlterTable
ALTER TABLE `schedule_monitoring` ADD COLUMN `monitor_settings_id` INTEGER NULL;

-- CreateTable
CREATE TABLE `monitor_settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `preferential_place` VARCHAR(60) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `monitor_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `schedule_monitoring` ADD CONSTRAINT `schedule_monitoring_monitor_settings_id_fkey` FOREIGN KEY (`monitor_settings_id`) REFERENCES `monitor_settings`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `monitor_settings` ADD CONSTRAINT `monitor_settings_monitor_id_fkey` FOREIGN KEY (`monitor_id`) REFERENCES `monitor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
