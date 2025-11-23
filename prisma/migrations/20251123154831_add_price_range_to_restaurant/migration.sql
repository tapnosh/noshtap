-- CreateEnum
CREATE TYPE "PriceRange" AS ENUM ('low', 'mid', 'high');

-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "priceRange" "PriceRange";
