/*
  Warnings:

  - You are about to drop the column `owner_id` on the `RestaurantMenu` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RestaurantMenu" DROP COLUMN "owner_id";

-- CreateIndex
CREATE INDEX "RestaurantMenu_restaurant_id_is_deleted_idx" ON "RestaurantMenu"("restaurant_id", "is_deleted");

-- CreateIndex
CREATE INDEX "RestaurantTheme_ownerId_idx" ON "RestaurantTheme"("ownerId");
