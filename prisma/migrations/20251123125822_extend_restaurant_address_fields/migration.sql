-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "reservationUrl" TEXT;

-- AlterTable
ALTER TABLE "RestaurantAddress" ADD COLUMN     "countryCode" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "stateCode" TEXT,
ADD COLUMN     "streetNumber" TEXT;
