-- DropIndex
DROP INDEX `user_type_user_id_fkey` ON `user`;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_type_user_id_fkey` FOREIGN KEY (`type_user_id`) REFERENCES `type_user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
