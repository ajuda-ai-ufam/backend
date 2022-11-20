/*
  Warnings:

  - You are about to drop the `Monitor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Monitor` DROP FOREIGN KEY `Monitor_responsible_professor_id_fkey`;

-- DropForeignKey
ALTER TABLE `Monitor` DROP FOREIGN KEY `Monitor_student_id_fkey`;

-- DropForeignKey
ALTER TABLE `Monitor` DROP FOREIGN KEY `Monitor_subject_id_fkey`;

-- DropForeignKey
ALTER TABLE `schedule_monitoring` DROP FOREIGN KEY `schedule_monitoring_monitor_id_fkey`;

-- DropTable
DROP TABLE `Monitor`;

-- CreateTable
CREATE TABLE `monitor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Aguardando aprovação do professor',
    `responsible_professor_id` INTEGER NOT NULL,
    `student_id` INTEGER NOT NULL,
    `subject_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `monitor` ADD CONSTRAINT `monitor_responsible_professor_id_fkey` FOREIGN KEY (`responsible_professor_id`) REFERENCES `teacher`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `monitor` ADD CONSTRAINT `monitor_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `student`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `monitor` ADD CONSTRAINT `monitor_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schedule_monitoring` ADD CONSTRAINT `schedule_monitoring_monitor_id_fkey` FOREIGN KEY (`monitor_id`) REFERENCES `monitor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
