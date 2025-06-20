-- CreateIndex
CREATE INDEX "Restaurant_ownerId_idx" ON "Restaurant"("ownerId");

-- CreateIndex
CREATE INDEX "Restaurant_is_deleted_idx" ON "Restaurant"("is_deleted");

-- CreateIndex
CREATE INDEX "Restaurant_ownerId_is_deleted_idx" ON "Restaurant"("ownerId", "is_deleted");

-- CreateIndex
CREATE INDEX "RestaurantImages_restaurant_id_idx" ON "RestaurantImages"("restaurant_id");
