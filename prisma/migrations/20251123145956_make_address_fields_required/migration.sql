/*
  Warnings:

  - Made the column `city` on table `RestaurantAddress` required. This step will fail if there are existing NULL values in that column.
  - Made the column `country` on table `RestaurantAddress` required. This step will fail if there are existing NULL values in that column.
  - Made the column `postalCode` on table `RestaurantAddress` required. This step will fail if there are existing NULL values in that column.
  - Made the column `street` on table `RestaurantAddress` required. This step will fail if there are existing NULL values in that column.
  - Made the column `countryCode` on table `RestaurantAddress` required. This step will fail if there are existing NULL values in that column.
  - Made the column `state` on table `RestaurantAddress` required. This step will fail if there are existing NULL values in that column.
  - Made the column `stateCode` on table `RestaurantAddress` required. This step will fail if there are existing NULL values in that column.
  - Made the column `streetNumber` on table `RestaurantAddress` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
UPDATE "RestaurantAddress"
SET 
  "street" = COALESCE("street", '-'),
  "streetNumber" = COALESCE("streetNumber", '-'),
  "postalCode" = COALESCE("postalCode", '-'),
  "city" = COALESCE("city", '-'),
  "state" = COALESCE("state", '-'),
  "stateCode" = COALESCE("stateCode", '-'),
  "country" = COALESCE("country", '-'),
  "countryCode" = COALESCE("countryCode", '-');
ALTER TABLE "RestaurantAddress" ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "country" SET NOT NULL,
ALTER COLUMN "postalCode" SET NOT NULL,
ALTER COLUMN "street" SET NOT NULL,
ALTER COLUMN "countryCode" SET NOT NULL,
ALTER COLUMN "state" SET NOT NULL,
ALTER COLUMN "stateCode" SET NOT NULL,
ALTER COLUMN "streetNumber" SET NOT NULL;
