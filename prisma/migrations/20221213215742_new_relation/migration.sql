-- DropForeignKey
ALTER TABLE `monitor` DROP FOREIGN KEY `monitor_student_id_fkey`;

-- AddForeignKey
ALTER TABLE `monitor` ADD CONSTRAINT `monitor_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
