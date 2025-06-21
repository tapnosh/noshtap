/*
  Warnings:

  - A unique constraint covering the columns `[id,ownerId,is_deleted]` on the table `Restaurant` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Restaurant_is_deleted_idx";

-- DropIndex
DROP INDEX "Restaurant_ownerId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_id_ownerId_is_deleted_key" ON "Restaurant"("id", "ownerId", "is_deleted");
