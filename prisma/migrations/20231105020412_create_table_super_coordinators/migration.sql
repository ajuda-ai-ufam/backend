-- CreateTable
CREATE TABLE `super_coordinators` (
    `user_id` INTEGER NOT NULL,

    UNIQUE INDEX `super_coordinators_user_id_key`(`user_id`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `super_coordinators` ADD CONSTRAINT `super_coordinators_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
