-- AlterTable
ALTER TABLE `schedule_monitoring` ADD COLUMN `schedule_topic_id` INTEGER NULL;

-- CreateTable
CREATE TABLE `schedule_topics` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `token` VARCHAR(100) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `schedule_topics_token_idx`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `schedule_monitoring` ADD CONSTRAINT `schedule_monitoring_schedule_topic_id_fkey` FOREIGN KEY (`schedule_topic_id`) REFERENCES `schedule_topics`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
