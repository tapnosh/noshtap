/*
  Warnings:

  - Made the column `description` on table `Restaurant` required. This step will fail if there are existing NULL values in that column.
  - Made the column `theme_id` on table `Restaurant` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Restaurant" DROP CONSTRAINT "Restaurant_theme_id_fkey";

-- AlterTable
ALTER TABLE "Restaurant" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "theme_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Restaurant" ADD CONSTRAINT "Restaurant_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "RestaurantTheme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
