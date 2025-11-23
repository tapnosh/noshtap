import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCategoryDto } from "../dto/requests/create-category.dto";
import { Prisma, RestaurantCategory } from "@prisma/client";
import { UpdateCategoryDto } from "../dto/requests/update-category.dto";
import { CategoryDto } from "../dto/responses/category.dto";

export const kAllergen: CategoryDto[] = [
    { id: 'allergen.gluten', name: 'allergen.gluten', description: 'Gluten' },
    { id: 'allergen.crustaceans', name: 'allergen.crustaceans', description: 'Crustaceans' },
    { id: 'allergen.eggs', name: 'allergen.eggs', description: 'Eggs' },
    { id: 'allergen.fish', name: 'allergen.fish', description: 'Fish' },
    { id: 'allergen.peanuts', name: 'allergen.peanuts', description: 'Peanuts' },
    { id: 'allergen.soybeans', name: 'allergen.soybeans', description: 'Soybeans' },
    { id: 'allergen.milk', name: 'allergen.milk', description: 'Milk' },
    { id: 'allergen.nuts', name: 'allergen.nuts', description: 'Tree Nuts' },
    { id: 'allergen.celery', name: 'allergen.celery', description: 'Celery' },
    { id: 'allergen.mustard', name: 'allergen.mustard', description: 'Mustard' },
    { id: 'allergen.sesame', name: 'allergen.sesame', description: 'Sesame' },
    { id: 'allergen.sulphites', name: 'allergen.sulphites', description: 'Sulphites' },
    { id: 'allergen.lupin', name: 'allergen.lupin', description: 'Lupin' },
    { id: 'allergen.molluscs', name: 'allergen.molluscs', description: 'Molluscs' },
    { id: 'allergen.alcohol', name: 'allergen.alcohol', description: 'Alcohol' },
    { id: 'allergen.caffeine', name: 'allergen.caffeine', description: 'Caffeine' },
    { id: 'allergen.additives', name: 'allergen.additives', description: 'Food Additives' },
]

export const kCuisine: CategoryDto[] = [
    { id: 'cuisine.italian', name: 'cuisine.italian', description: 'Italian' },
    { id: 'cuisine.french', name: 'cuisine.french', description: 'French' },
    { id: 'cuisine.spanish', name: 'cuisine.spanish', description: 'Spanish' },
    { id: 'cuisine.portuguese', name: 'cuisine.portuguese', description: 'Portuguese' },
    { id: 'cuisine.greek', name: 'cuisine.greek', description: 'Greek' },
    { id: 'cuisine.turkish', name: 'cuisine.turkish', description: 'Turkish' },
    { id: 'cuisine.polish', name: 'cuisine.polish', description: 'Polish' },
    { id: 'cuisine.german', name: 'cuisine.german', description: 'German' },
    { id: 'cuisine.scandinavian', name: 'cuisine.scandinavian', description: 'Scandinavian' },
    { id: 'cuisine.british', name: 'cuisine.british', description: 'British' },
    { id: 'cuisine.hungarian', name: 'cuisine.hungarian', description: 'Hungarian' },
    { id: 'cuisine.balkan', name: 'cuisine.balkan', description: 'Balkan' },
    { id: 'cuisine.chinese', name: 'cuisine.chinese', description: 'Chinese' },
    { id: 'cuisine.taiwanese', name: 'cuisine.taiwanese', description: 'Taiwanese' },
    { id: 'cuisine.japanese', name: 'cuisine.japanese', description: 'Japanese' },
    { id: 'cuisine.korean', name: 'cuisine.korean', description: 'Korean' },
    { id: 'cuisine.thai', name: 'cuisine.thai', description: 'Thai' },
    { id: 'cuisine.vietnamese', name: 'cuisine.vietnamese', description: 'Vietnamese' },
    { id: 'cuisine.indian', name: 'cuisine.indian', description: 'Indian' },
    { id: 'cuisine.pakistani', name: 'cuisine.pakistani', description: 'Pakistani' },
    { id: 'cuisine.bangladeshi', name: 'cuisine.bangladeshi', description: 'Bangladeshi' },
    { id: 'cuisine.indonesian', name: 'cuisine.indonesian', description: 'Indonesian' },
    { id: 'cuisine.malaysian', name: 'cuisine.malaysian', description: 'Malaysian' },
    { id: 'cuisine.filipino', name: 'cuisine.filipino', description: 'Filipino' },
    { id: 'cuisine.singaporean', name: 'cuisine.singaporean', description: 'Singaporean' },
    { id: 'cuisine.middle_eastern', name: 'cuisine.middle_eastern', description: 'Middle Eastern' },
    { id: 'cuisine.persian', name: 'cuisine.persian', description: 'Persian' },
    { id: 'cuisine.lebanese', name: 'cuisine.lebanese', description: 'Lebanese' },
    { id: 'cuisine.american', name: 'cuisine.american', description: 'American' },
    { id: 'cuisine.mexican', name: 'cuisine.mexican', description: 'Mexican' },
    { id: 'cuisine.texmex', name: 'cuisine.texmex', description: 'Tex-Mex' },
    { id: 'cuisine.brazilian', name: 'cuisine.brazilian', description: 'Brazilian' },
    { id: 'cuisine.argentinian', name: 'cuisine.argentinian', description: 'Argentinian' },
    { id: 'cuisine.peruvian', name: 'cuisine.peruvian', description: 'Peruvian' },
    { id: 'cuisine.caribbean', name: 'cuisine.caribbean', description: 'Caribbean' },
    { id: 'cuisine.moroccan', name: 'cuisine.moroccan', description: 'Moroccan' },
    { id: 'cuisine.tunisian', name: 'cuisine.tunisian', description: 'Tunisian' },
    { id: 'cuisine.ethiopian', name: 'cuisine.ethiopian', description: 'Ethiopian' },
    { id: 'cuisine.south_african', name: 'cuisine.south_african', description: 'South African' },
    { id: 'cuisine.west_african', name: 'cuisine.west_african', description: 'West African' },
    { id: 'cuisine.egyptian', name: 'cuisine.egyptian', description: 'Egyptian' },
    { id: 'cuisine.australian', name: 'cuisine.australian', description: 'Australian' },
    { id: 'cuisine.new_zealand', name: 'cuisine.new_zealand', description: 'New Zealand' },
    { id: 'cuisine.fusion', name: 'cuisine.fusion', description: 'Fusion' },
    { id: 'cuisine.street_food', name: 'cuisine.street_food', description: 'Street Food' },
    { id: 'cuisine.fast_food', name: 'cuisine.fast_food', description: 'Fast Food' },
    { id: 'cuisine.vegan', name: 'cuisine.vegan', description: 'Vegan' },
    { id: 'cuisine.vegetarian', name: 'cuisine.vegetarian', description: 'Vegetarian' },
    { id: 'cuisine.bbq', name: 'cuisine.bbq', description: 'BBQ' },
    { id: 'cuisine.seafood', name: 'cuisine.seafood', description: 'Seafood' },
    { id: 'cuisine.dessert', name: 'cuisine.dessert', description: 'Dessert / Pastry' },
]

export const kFoodType: CategoryDto[] = [
    { id: 'food_type.vegan', name: 'food_type.vegan', description: 'Vegan' },
    { id: 'food_type.vegetarian', name: 'food_type.vegetarian', description: 'Vegetarian' },
    { id: 'food_type.gluten_free', name: 'food_type.gluten_free', description: 'Gluten-Free' },
    { id: 'food_type.lactose_free', name: 'food_type.lactose_free', description: 'Lactose-Free' },
    { id: 'food_type.sugar_free', name: 'food_type.sugar_free', description: 'Sugar-Free' },
    { id: 'food_type.keto', name: 'food_type.keto', description: 'Keto' },
    { id: 'food_type.low_carb', name: 'food_type.low_carb', description: 'Low Carb' },
    { id: 'food_type.high_protein', name: 'food_type.high_protein', description: 'High Protein' },
    { id: 'food_type.halal', name: 'food_type.halal', description: 'Halal' },
    { id: 'food_type.kosher', name: 'food_type.kosher', description: 'Kosher' },
    { id: 'food_type.spicy', name: 'food_type.spicy', description: 'Spicy' },
    { id: 'food_type.mild', name: 'food_type.mild', description: 'Mild' },
    { id: 'food_type.hot', name: 'food_type.hot', description: 'Hot' },
    { id: 'food_type.raw', name: 'food_type.raw', description: 'Raw' },
    { id: 'food_type.organic', name: 'food_type.organic', description: 'Organic' },
    { id: 'food_type.local', name: 'food_type.local', description: 'Local' },
    { id: 'food_type.home_made', name: 'food_type.home_made', description: 'Home Made' },
]

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) { }

    async create(createCategoryDto: CreateCategoryDto): Promise<RestaurantCategory> {
        return this.prisma.restaurantCategory.create({ data: createCategoryDto });
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<RestaurantCategory> {
        return this.prisma.restaurantCategory.update({ where: { id }, data: updateCategoryDto });
    }

    async delete(id: string): Promise<RestaurantCategory> {
        return this.prisma.restaurantCategory.delete({ where: { id } });
    }

    async findAll(type?: string): Promise<CategoryDto[]> {
        switch (type) {
            case 'allergens':
                return kAllergen;
            case 'cuisine':
                return kCuisine;
            case 'food_type':
                return kFoodType;
            default:
                return [...kAllergen, ...kCuisine, ...kFoodType];
        }
    }
}
