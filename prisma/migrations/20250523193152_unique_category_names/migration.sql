/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `RestaurantCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RestaurantCategory_name_key" ON "RestaurantCategory"("name");
