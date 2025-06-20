/*
  Warnings:

  - Added the required column `content_disposition` to the `RestaurantImages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content_type` to the `RestaurantImages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `download_url` to the `RestaurantImages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pathname` to the `RestaurantImages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RestaurantImages" 
ADD COLUMN     "content_disposition" TEXT NOT NULL,
ADD COLUMN     "content_type" TEXT NOT NULL,
ADD COLUMN     "download_url" TEXT NOT NULL,
ADD COLUMN     "pathname" TEXT NOT NULL;
