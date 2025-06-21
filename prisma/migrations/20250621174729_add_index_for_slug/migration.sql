/*
  Warnings:

  - A unique constraint covering the columns `[slug,is_deleted]` on the table `Restaurant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_slug_is_deleted_key" ON "Restaurant"("slug", "is_deleted");
