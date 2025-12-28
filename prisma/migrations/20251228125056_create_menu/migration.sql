/*
  Warnings:

  - You are about to drop the column `schema` on the `RestaurantMenu` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "MenuHeaderType" AS ENUM ('text', 'heading');

-- AlterTable
ALTER TABLE "RestaurantMenu" DROP COLUMN "schema";

-- CreateTable
CREATE TABLE "MenuHeader" (
    "id" TEXT NOT NULL,
    "menu_id" TEXT NOT NULL,
    "version" VARCHAR(10) NOT NULL DEFAULT 'v1',
    "type" "MenuHeaderType" NOT NULL,
    "text" TEXT,
    "heading" TEXT,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenuHeader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuGroup" (
    "id" TEXT NOT NULL,
    "menu_id" TEXT NOT NULL,
    "version" VARCHAR(10) NOT NULL DEFAULT 'v1',
    "type" VARCHAR(20) NOT NULL DEFAULT 'menu-group',
    "name" VARCHAR(255) NOT NULL,
    "timeFrom" TIMESTAMP(3) NOT NULL,
    "timeTo" TIMESTAMP(3) NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenuGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuItem" (
    "id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "version" VARCHAR(10) NOT NULL DEFAULT 'v1',
    "item_id" TEXT NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "description" VARCHAR(200),
    "price_amount" DECIMAL(10,2) NOT NULL,
    "price_currency" VARCHAR(10) NOT NULL,
    "confirmed" BOOLEAN DEFAULT false,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuItemImage" (
    "id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "downloadUrl" TEXT,
    "pathname" VARCHAR(500),
    "contentType" VARCHAR(100),
    "contentDisposition" VARCHAR(200),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenuItemImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuItemAllergen" (
    "id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "allergen_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenuItemAllergen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuItemFoodType" (
    "id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "food_type_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenuItemFoodType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuItemIngredient" (
    "id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "ingredient" VARCHAR(255) NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenuItemIngredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuItemCategory" (
    "id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "category" VARCHAR(255) NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenuItemCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MenuHeader_menu_id_order_idx" ON "MenuHeader"("menu_id", "order");

-- CreateIndex
CREATE INDEX "MenuGroup_menu_id_order_idx" ON "MenuGroup"("menu_id", "order");

-- CreateIndex
CREATE INDEX "MenuItem_group_id_order_idx" ON "MenuItem"("group_id", "order");

-- CreateIndex
CREATE INDEX "MenuItem_item_id_idx" ON "MenuItem"("item_id");

-- CreateIndex
CREATE UNIQUE INDEX "MenuItemImage_item_id_key" ON "MenuItemImage"("item_id");

-- CreateIndex
CREATE INDEX "MenuItemAllergen_item_id_order_idx" ON "MenuItemAllergen"("item_id", "order");

-- CreateIndex
CREATE UNIQUE INDEX "MenuItemAllergen_item_id_allergen_id_key" ON "MenuItemAllergen"("item_id", "allergen_id");

-- CreateIndex
CREATE INDEX "MenuItemFoodType_item_id_order_idx" ON "MenuItemFoodType"("item_id", "order");

-- CreateIndex
CREATE UNIQUE INDEX "MenuItemFoodType_item_id_food_type_id_key" ON "MenuItemFoodType"("item_id", "food_type_id");

-- CreateIndex
CREATE INDEX "MenuItemIngredient_item_id_order_idx" ON "MenuItemIngredient"("item_id", "order");

-- CreateIndex
CREATE INDEX "MenuItemCategory_item_id_order_idx" ON "MenuItemCategory"("item_id", "order");

-- AddForeignKey
ALTER TABLE "MenuHeader" ADD CONSTRAINT "MenuHeader_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "RestaurantMenu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuGroup" ADD CONSTRAINT "MenuGroup_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "RestaurantMenu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "MenuGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItemImage" ADD CONSTRAINT "MenuItemImage_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "MenuItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItemAllergen" ADD CONSTRAINT "MenuItemAllergen_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "MenuItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItemFoodType" ADD CONSTRAINT "MenuItemFoodType_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "MenuItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItemIngredient" ADD CONSTRAINT "MenuItemIngredient_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "MenuItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItemCategory" ADD CONSTRAINT "MenuItemCategory_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "MenuItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
