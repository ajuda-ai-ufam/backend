-- AlterTable
ALTER TABLE `coordinators` ADD COLUMN `department_id` INTEGER NOT NULL DEFAULT 2;

-- AlterTable
ALTER TABLE `course` ADD COLUMN `department_id` INTEGER NOT NULL DEFAULT 2;

-- AlterTable
ALTER TABLE `subject` ADD COLUMN `department_id` INTEGER NOT NULL DEFAULT 2;

-- AlterTable
ALTER TABLE `teacher` ADD COLUMN `department_id` INTEGER NOT NULL DEFAULT 2;

-- AlterTable
ALTER TABLE `type_user` MODIFY `type` VARCHAR(32) NOT NULL;

-- AddForeignKey
ALTER TABLE `teacher` ADD CONSTRAINT `teacher_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `department`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subject` ADD CONSTRAINT `subject_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `department`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course` ADD CONSTRAINT `course_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `department`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `coordinators` ADD CONSTRAINT `coordinators_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `department`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
