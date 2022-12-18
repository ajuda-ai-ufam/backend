-- CreateTable
CREATE TABLE `available_times` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `week_day` INTEGER NOT NULL,
    `start` DATETIME(3) NOT NULL,
    `end` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `monitor_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `available_times` ADD CONSTRAINT `available_times_monitor_id_fkey` FOREIGN KEY (`monitor_id`) REFERENCES `monitor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
