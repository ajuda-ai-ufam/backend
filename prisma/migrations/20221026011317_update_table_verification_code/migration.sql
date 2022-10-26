/*
  Warnings:

  - You are about to drop the column `type` on the `verification_code` table. All the data in the column will be lost.
  - Added the required column `type_id` to the `verification_code` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `verification_code` DROP COLUMN `type`,
    ADD COLUMN `type_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `verification_code` ADD CONSTRAINT `verification_code_type_id_fkey` FOREIGN KEY (`type_id`) REFERENCES `type_user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
