-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `user_type_user_id_fkey`;

-- CreateTable
CREATE TABLE `type_user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(15) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
