import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCategoryDto } from "../dto/requests/create-category.dto";
import { Prisma, RestaurantCategory } from "@prisma/client";

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) { }

    async create(createCategoryDto: CreateCategoryDto): Promise<RestaurantCategory> {
        return this.prisma.restaurantCategory.create({ data: createCategoryDto });
    }

    async findAll(): Promise<RestaurantCategory[]> {
        return this.prisma.restaurantCategory.findMany({
        });
    }
}
