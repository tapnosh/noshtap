-- Insert default restaurant theme
INSERT INTO "RestaurantTheme" ("id", "color", "updatedAt")
VALUES (
  gen_random_uuid(),
  '#3B82F6',
  CURRENT_TIMESTAMP
);

-- Update null descriptions to empty string in Restaurant table
UPDATE "Restaurant" SET "description" = 'No description' WHERE "description" IS NULL;

-- Get the ID of the default theme
DO $$
DECLARE
    default_theme_id TEXT;
BEGIN
    SELECT id INTO default_theme_id FROM "RestaurantTheme" LIMIT 1;
    
    -- Update all restaurants to use the default theme if theme_id is NULL
    UPDATE "Restaurant" 
    SET "theme_id" = default_theme_id,
        "updatedAt" = CURRENT_TIMESTAMP
    WHERE "theme_id" IS NULL;
    
    RAISE NOTICE 'Updated restaurants with NULL theme_id to use the default theme (ID: %)', default_theme_id;
END $$;
