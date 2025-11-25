-- Step 1: Remove duplicate categories, keeping the oldest one for each name
-- First, update all RestaurantCategoryRelation records to point to the oldest category
WITH duplicate_categories AS (
  SELECT 
    name,
    id,
    ROW_NUMBER() OVER (PARTITION BY name ORDER BY "createdAt" ASC, id ASC) as rn
  FROM "RestaurantCategory"
),
categories_to_keep AS (
  SELECT id, name
  FROM duplicate_categories
  WHERE rn = 1
),
categories_to_remove AS (
  SELECT id, name
  FROM duplicate_categories
  WHERE rn > 1
)
-- Update relations to point to the kept category
UPDATE "RestaurantCategoryRelation" rcr
SET category_id = ctk.id
FROM categories_to_remove ctr, categories_to_keep ctk
WHERE rcr.category_id = ctr.id
  AND ctr.name = ctk.name;

-- Step 2: Delete duplicate categories
WITH duplicate_categories AS (
  SELECT 
    name,
    id,
    ROW_NUMBER() OVER (PARTITION BY name ORDER BY "createdAt" ASC, id ASC) as rn
  FROM "RestaurantCategory"
)
DELETE FROM "RestaurantCategory"
WHERE id IN (
  SELECT id FROM duplicate_categories WHERE rn > 1
);

-- Step 3: Add unique constraint on name
-- Drop the index if it already exists (from previous migration attempt)
DROP INDEX IF EXISTS "RestaurantCategory_name_key";

-- Create unique constraint
CREATE UNIQUE INDEX "RestaurantCategory_name_key" ON "RestaurantCategory"("name");

