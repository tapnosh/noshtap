/*
  Warnings:

  - A unique constraint covering the columns `[id,is_deleted]` on the table `Restaurant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_id_is_deleted_key" ON "Restaurant"("id", "is_deleted");
