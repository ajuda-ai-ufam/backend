-- CreateTable
CREATE TABLE `external_monitoring` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `student_id` INTEGER NULL,
    `student_name` VARCHAR(50) NOT NULL,
    `monitor_id` INTEGER NOT NULL,
    `start` DATETIME(3) NOT NULL,
    `end` DATETIME(3) NOT NULL,
    `professor_id` INTEGER NOT NULL,
    `description` VARCHAR(250) NULL,
    `schedule_topic_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `external_monitoring` ADD CONSTRAINT `external_monitoring_monitor_id_fkey` FOREIGN KEY (`monitor_id`) REFERENCES `monitor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `external_monitoring` ADD CONSTRAINT `external_monitoring_professor_id_fkey` FOREIGN KEY (`professor_id`) REFERENCES `teacher`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `external_monitoring` ADD CONSTRAINT `external_monitoring_schedule_topic_id_fkey` FOREIGN KEY (`schedule_topic_id`) REFERENCES `schedule_topics`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
