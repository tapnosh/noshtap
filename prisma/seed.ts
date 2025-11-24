import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  // Allergens
  { name: 'allergen.gluten', description: 'Gluten', type: 'allergens' as const },
  { name: 'allergen.crustaceans', description: 'Crustaceans', type: 'allergens' as const },
  { name: 'allergen.eggs', description: 'Eggs', type: 'allergens' as const },
  { name: 'allergen.fish', description: 'Fish', type: 'allergens' as const },
  { name: 'allergen.peanuts', description: 'Peanuts', type: 'allergens' as const },
  { name: 'allergen.soybeans', description: 'Soybeans', type: 'allergens' as const },
  { name: 'allergen.milk', description: 'Milk', type: 'allergens' as const },
  { name: 'allergen.nuts', description: 'Tree Nuts', type: 'allergens' as const },
  { name: 'allergen.celery', description: 'Celery', type: 'allergens' as const },
  { name: 'allergen.mustard', description: 'Mustard', type: 'allergens' as const },
  { name: 'allergen.sesame', description: 'Sesame', type: 'allergens' as const },
  { name: 'allergen.sulphites', description: 'Sulphites', type: 'allergens' as const },
  { name: 'allergen.lupin', description: 'Lupin', type: 'allergens' as const },
  { name: 'allergen.molluscs', description: 'Molluscs', type: 'allergens' as const },
  { name: 'allergen.alcohol', description: 'Alcohol', type: 'allergens' as const },
  { name: 'allergen.caffeine', description: 'Caffeine', type: 'allergens' as const },
  { name: 'allergen.additives', description: 'Food Additives', type: 'allergens' as const },
  
  // Cuisine
  { name: 'cuisine.italian', description: 'Italian', type: 'cuisine' as const },
  { name: 'cuisine.french', description: 'French', type: 'cuisine' as const },
  { name: 'cuisine.spanish', description: 'Spanish', type: 'cuisine' as const },
  { name: 'cuisine.portuguese', description: 'Portuguese', type: 'cuisine' as const },
  { name: 'cuisine.greek', description: 'Greek', type: 'cuisine' as const },
  { name: 'cuisine.turkish', description: 'Turkish', type: 'cuisine' as const },
  { name: 'cuisine.polish', description: 'Polish', type: 'cuisine' as const },
  { name: 'cuisine.german', description: 'German', type: 'cuisine' as const },
  { name: 'cuisine.scandinavian', description: 'Scandinavian', type: 'cuisine' as const },
  { name: 'cuisine.british', description: 'British', type: 'cuisine' as const },
  { name: 'cuisine.hungarian', description: 'Hungarian', type: 'cuisine' as const },
  { name: 'cuisine.balkan', description: 'Balkan', type: 'cuisine' as const },
  { name: 'cuisine.chinese', description: 'Chinese', type: 'cuisine' as const },
  { name: 'cuisine.taiwanese', description: 'Taiwanese', type: 'cuisine' as const },
  { name: 'cuisine.japanese', description: 'Japanese', type: 'cuisine' as const },
  { name: 'cuisine.korean', description: 'Korean', type: 'cuisine' as const },
  { name: 'cuisine.thai', description: 'Thai', type: 'cuisine' as const },
  { name: 'cuisine.vietnamese', description: 'Vietnamese', type: 'cuisine' as const },
  { name: 'cuisine.indian', description: 'Indian', type: 'cuisine' as const },
  { name: 'cuisine.pakistani', description: 'Pakistani', type: 'cuisine' as const },
  { name: 'cuisine.bangladeshi', description: 'Bangladeshi', type: 'cuisine' as const },
  { name: 'cuisine.indonesian', description: 'Indonesian', type: 'cuisine' as const },
  { name: 'cuisine.malaysian', description: 'Malaysian', type: 'cuisine' as const },
  { name: 'cuisine.filipino', description: 'Filipino', type: 'cuisine' as const },
  { name: 'cuisine.singaporean', description: 'Singaporean', type: 'cuisine' as const },
  { name: 'cuisine.middle_eastern', description: 'Middle Eastern', type: 'cuisine' as const },
  { name: 'cuisine.persian', description: 'Persian', type: 'cuisine' as const },
  { name: 'cuisine.lebanese', description: 'Lebanese', type: 'cuisine' as const },
  { name: 'cuisine.american', description: 'American', type: 'cuisine' as const },
  { name: 'cuisine.mexican', description: 'Mexican', type: 'cuisine' as const },
  { name: 'cuisine.texmex', description: 'Tex-Mex', type: 'cuisine' as const },
  { name: 'cuisine.brazilian', description: 'Brazilian', type: 'cuisine' as const },
  { name: 'cuisine.argentinian', description: 'Argentinian', type: 'cuisine' as const },
  { name: 'cuisine.peruvian', description: 'Peruvian', type: 'cuisine' as const },
  { name: 'cuisine.caribbean', description: 'Caribbean', type: 'cuisine' as const },
  { name: 'cuisine.moroccan', description: 'Moroccan', type: 'cuisine' as const },
  { name: 'cuisine.tunisian', description: 'Tunisian', type: 'cuisine' as const },
  { name: 'cuisine.ethiopian', description: 'Ethiopian', type: 'cuisine' as const },
  { name: 'cuisine.south_african', description: 'South African', type: 'cuisine' as const },
  { name: 'cuisine.west_african', description: 'West African', type: 'cuisine' as const },
  { name: 'cuisine.egyptian', description: 'Egyptian', type: 'cuisine' as const },
  { name: 'cuisine.australian', description: 'Australian', type: 'cuisine' as const },
  { name: 'cuisine.new_zealand', description: 'New Zealand', type: 'cuisine' as const },
  { name: 'cuisine.fusion', description: 'Fusion', type: 'cuisine' as const },
  { name: 'cuisine.street_food', description: 'Street Food', type: 'cuisine' as const },
  { name: 'cuisine.fast_food', description: 'Fast Food', type: 'cuisine' as const },
  { name: 'cuisine.vegan', description: 'Vegan', type: 'cuisine' as const },
  { name: 'cuisine.vegetarian', description: 'Vegetarian', type: 'cuisine' as const },
  { name: 'cuisine.bbq', description: 'BBQ', type: 'cuisine' as const },
  { name: 'cuisine.seafood', description: 'Seafood', type: 'cuisine' as const },
  { name: 'cuisine.dessert', description: 'Dessert / Pastry', type: 'cuisine' as const },
  
  // Food Type
  { name: 'food_type.vegan', description: 'Vegan', type: 'food_type' as const },
  { name: 'food_type.vegetarian', description: 'Vegetarian', type: 'food_type' as const },
  { name: 'food_type.gluten_free', description: 'Gluten-Free', type: 'food_type' as const },
  { name: 'food_type.lactose_free', description: 'Lactose-Free', type: 'food_type' as const },
  { name: 'food_type.sugar_free', description: 'Sugar-Free', type: 'food_type' as const },
  { name: 'food_type.keto', description: 'Keto', type: 'food_type' as const },
  { name: 'food_type.low_carb', description: 'Low Carb', type: 'food_type' as const },
  { name: 'food_type.high_protein', description: 'High Protein', type: 'food_type' as const },
  { name: 'food_type.halal', description: 'Halal', type: 'food_type' as const },
  { name: 'food_type.kosher', description: 'Kosher', type: 'food_type' as const },
  { name: 'food_type.spicy', description: 'Spicy', type: 'food_type' as const },
  { name: 'food_type.mild', description: 'Mild', type: 'food_type' as const },
  { name: 'food_type.hot', description: 'Hot', type: 'food_type' as const },
  { name: 'food_type.raw', description: 'Raw', type: 'food_type' as const },
  { name: 'food_type.organic', description: 'Organic', type: 'food_type' as const },
  { name: 'food_type.local', description: 'Local', type: 'food_type' as const },
  { name: 'food_type.home_made', description: 'Home Made', type: 'food_type' as const },
];

async function main() {
  console.log('Seeding categories...');

  await prisma.restaurantCategory.createMany({
    data: categories,
    skipDuplicates: true,
  });

  console.log(`Seeded ${categories.length} categories`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

