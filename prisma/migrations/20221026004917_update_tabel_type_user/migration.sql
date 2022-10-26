/*
  Warnings:

  - You are about to drop the `TypeUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `user_type_user_id_fkey`;

-- DropTable
DROP TABLE `TypeUser`;

-- CreateTable
CREATE TABLE `type_user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(15) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_type_user_id_fkey` FOREIGN KEY (`type_user_id`) REFERENCES `type_user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
