/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `type_user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `type_user_id_key` ON `type_user`(`id`);
