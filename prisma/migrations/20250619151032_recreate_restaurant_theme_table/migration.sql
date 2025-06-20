/*
  Warnings:

  - Added the required column `ownerId` to the `RestaurantTheme` table without a default value. This is not possible if the table is not empty.

*/
-- Delete all existing rows from RestaurantTheme table
DELETE FROM "RestaurantTheme";

-- AlterTable
ALTER TABLE "RestaurantTheme" ADD COLUMN "ownerId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "RestaurantTheme_ownerId_idx" ON "RestaurantTheme"("ownerId");
