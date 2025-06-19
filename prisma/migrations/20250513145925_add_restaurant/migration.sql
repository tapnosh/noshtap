/*
  Warnings:

  - You are about to alter the column `name` on the `Restaurant` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "description" TEXT,
ADD COLUMN     "theme_id" TEXT,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);

-- CreateTable
CREATE TABLE "RestaurantAddress" (
    "id" TEXT NOT NULL,
    "restaurant_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" point NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestaurantAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestaurantImages" (
    "id" TEXT NOT NULL,
    "restaurant_id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestaurantImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestaurantTheme" (
    "id" TEXT NOT NULL,
    "color" CHAR(7) NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestaurantTheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestaurantCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestaurantCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestaurantCategoryRelation" (
    "id" TEXT NOT NULL,
    "restaurant_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestaurantCategoryRelation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantAddress_restaurant_id_key" ON "RestaurantAddress"("restaurant_id");

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantCategoryRelation_restaurant_id_category_id_key" ON "RestaurantCategoryRelation"("restaurant_id", "category_id");

-- AddForeignKey
ALTER TABLE "Restaurant" ADD CONSTRAINT "Restaurant_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "RestaurantTheme"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantAddress" ADD CONSTRAINT "RestaurantAddress_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantImages" ADD CONSTRAINT "RestaurantImages_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantCategoryRelation" ADD CONSTRAINT "RestaurantCategoryRelation_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantCategoryRelation" ADD CONSTRAINT "RestaurantCategoryRelation_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "RestaurantCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
