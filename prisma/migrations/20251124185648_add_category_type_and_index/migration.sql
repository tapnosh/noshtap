-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('allergens', 'cuisine', 'food_type');

-- AlterTable
ALTER TABLE "RestaurantCategory" ADD COLUMN "type" "CategoryType" NOT NULL DEFAULT 'cuisine';

-- CreateIndex
CREATE INDEX "RestaurantCategory_type_idx" ON "RestaurantCategory"("type");

-- Update existing records based on name prefix
UPDATE "RestaurantCategory" SET "type" = 'allergens' WHERE "name" LIKE 'allergen.%';
UPDATE "RestaurantCategory" SET "type" = 'cuisine' WHERE "name" LIKE 'cuisine.%';
UPDATE "RestaurantCategory" SET "type" = 'food_type' WHERE "name" LIKE 'food_type.%';

