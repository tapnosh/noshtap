-- CreateTable
CREATE TABLE "QrCode" (
    "id" TEXT NOT NULL,
    "restaurant_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "redirect_url" TEXT NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QrCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QrCode_code_key" ON "QrCode"("code");

-- CreateIndex
CREATE INDEX "QrCode_restaurant_id_is_deleted_idx" ON "QrCode"("restaurant_id", "is_deleted");

-- CreateIndex
CREATE UNIQUE INDEX "QrCode_code_is_deleted_key" ON "QrCode"("code", "is_deleted");

-- CreateIndex
CREATE UNIQUE INDEX "QrCode_code_restaurant_id_is_deleted_key" ON "QrCode"("code", "restaurant_id", "is_deleted");

-- AddForeignKey
ALTER TABLE "QrCode" ADD CONSTRAINT "QrCode_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
