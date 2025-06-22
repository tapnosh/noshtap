import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCategoryDto } from "../dto/requests/create-category.dto";
import { Prisma, RestaurantCategory } from "@prisma/client";
import { UpdateCategoryDto } from "../dto/requests/update-category.dto";

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

    async findAll(): Promise<RestaurantCategory[]> {
        return this.prisma.restaurantCategory.findMany({});
    }
}
