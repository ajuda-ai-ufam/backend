-- CreateTable
CREATE TABLE `subject_enrollment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `student_id` INTEGER NOT NULL,
    `subject_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `canceled_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `subject_enrollment` ADD CONSTRAINT `subject_enrollment_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `student`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subject_enrollment` ADD CONSTRAINT `subject_enrollment_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
