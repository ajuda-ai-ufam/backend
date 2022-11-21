/*
  Warnings:

  - A unique constraint covering the columns `[student_id]` on the table `monitor` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `schedule_monitoring` DROP FOREIGN KEY `schedule_monitoring_monitor_id_fkey`;

-- CreateIndex
CREATE UNIQUE INDEX `monitor_student_id_key` ON `monitor`(`student_id`);

-- AddForeignKey
ALTER TABLE `schedule_monitoring` ADD CONSTRAINT `schedule_monitoring_monitor_id_fkey` FOREIGN KEY (`monitor_id`) REFERENCES `monitor`(`student_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
