/*
  Warnings:

  - You are about to drop the `type_user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `user_type_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `verification_code` DROP FOREIGN KEY `verification_code_type_id_fkey`;

-- DropTable
DROP TABLE `type_user`;

-- CreateTable
CREATE TABLE `type_code` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(15) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_type_user_id_fkey` FOREIGN KEY (`type_user_id`) REFERENCES `type_code`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `verification_code` ADD CONSTRAINT `verification_code_type_id_fkey` FOREIGN KEY (`type_id`) REFERENCES `type_code`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
