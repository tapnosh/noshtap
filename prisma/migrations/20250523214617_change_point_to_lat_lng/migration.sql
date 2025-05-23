/*
  Warnings:

  - You are about to drop the column `location` on the `RestaurantAddress` table. All the data in the column will be lost.
  - Added the required column `lat` to the `RestaurantAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lng` to the `RestaurantAddress` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "RestaurantCategory_name_key";

-- AlterTable
ALTER TABLE "RestaurantAddress" DROP COLUMN "location",
ADD COLUMN     "lat" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "lng" DECIMAL(65,30) NOT NULL;
