import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateRestaurantDto } from "./dto/create-restaurant.dto";
import { Restaurant } from "@prisma/client";

@Injectable()
export class RestaurantsService {
    constructor(private prisma: PrismaService) { }

    async create(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
        return this.prisma.restaurant.create({
            data: {
                name: createRestaurantDto.name,
                description: createRestaurantDto.description,
                theme_id: createRestaurantDto.theme_id,
            },
        });
    }

    async findAll(): Promise<Restaurant[]> {
        return this.prisma.restaurant.findMany();
    }
}
