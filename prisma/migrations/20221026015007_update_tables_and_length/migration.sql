-- AlterTable
ALTER TABLE `user` MODIFY `password` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `verification_code` MODIFY `updated_at` DATETIME(3) NULL;
