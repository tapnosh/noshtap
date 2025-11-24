import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCategoryDto } from "../dto/requests/create-category.dto";
import { Prisma, RestaurantCategory, CategoryType } from "@prisma/client";
import { UpdateCategoryDto } from "../dto/requests/update-category.dto";
import { CategoryDto } from "../dto/responses/category.dto";

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
        let where: Prisma.RestaurantCategoryWhereInput = {};

        switch (type) {
            case 'allergens':
                where = { type: CategoryType.allergens };
                break;
            case 'cuisine':
                where = { type: CategoryType.cuisine };
                break;
            case 'food_type':
                where = { type: CategoryType.food_type };
                break;
            default:
                // Return all categories
                where = {};
        }

        const categories = await this.prisma.restaurantCategory.findMany({
            where,
            orderBy: { name: 'asc' },
        });

        return categories.map((category) => ({
            id: category.id,
            name: category.name,
            description: category.description,
        }));
    }
}
