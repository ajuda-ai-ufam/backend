/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `subject` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `subject_code_key` ON `subject`(`code`);
