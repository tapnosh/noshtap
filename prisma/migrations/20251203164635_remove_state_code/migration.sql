/*
  Warnings:

  - You are about to drop the column `stateCode` on the `RestaurantAddress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RestaurantAddress" DROP COLUMN "stateCode";

-- AlterTable
ALTER TABLE "RestaurantCategory" ALTER COLUMN "type" DROP DEFAULT;
