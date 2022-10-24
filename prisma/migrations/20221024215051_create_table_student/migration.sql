-- CreateTable
CREATE TABLE `student` (
    `user_id` INTEGER NOT NULL,
    `enrollment` VARCHAR(10) NOT NULL,
    `course_id` INTEGER NOT NULL,
    `contact_email` VARCHAR(50) NOT NULL,
    `whatsapp` VARCHAR(11) NULL,
    `linkedin` VARCHAR(100) NULL,

    UNIQUE INDEX `student_user_id_key`(`user_id`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `student` ADD CONSTRAINT `student_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student` ADD CONSTRAINT `student_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
