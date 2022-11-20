-- CreateTable
CREATE TABLE `Monitor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Aguardando aprovação do professor',
    `responsible_professor_id` INTEGER NOT NULL,
    `student_id` INTEGER NOT NULL,
    `subject_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `schedule_monitoring` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `start` DATETIME(3) NOT NULL,
    `end` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Aguardando confirmação do monitor',
    `student_id` INTEGER NOT NULL,
    `monitor_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Monitor` ADD CONSTRAINT `Monitor_responsible_professor_id_fkey` FOREIGN KEY (`responsible_professor_id`) REFERENCES `teacher`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Monitor` ADD CONSTRAINT `Monitor_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `student`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Monitor` ADD CONSTRAINT `Monitor_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schedule_monitoring` ADD CONSTRAINT `schedule_monitoring_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `student`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schedule_monitoring` ADD CONSTRAINT `schedule_monitoring_monitor_id_fkey` FOREIGN KEY (`monitor_id`) REFERENCES `Monitor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
