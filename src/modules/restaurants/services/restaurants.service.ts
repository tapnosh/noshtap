import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateRestaurantDto } from "../dto/create-restaurant.dto";
import { Restaurant, Prisma } from "@prisma/client";

@Injectable()
export class RestaurantsService {
    constructor(private prisma: PrismaService) { }

    async create(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
        const data: Prisma.RestaurantCreateInput = {
            name: createRestaurantDto.name,
            description: createRestaurantDto.description,
            theme: { connect: { id: createRestaurantDto.theme_id } },
            address: createRestaurantDto.address ? {
                create: {
                    name: createRestaurantDto.address.name,
                    lat: createRestaurantDto.address.lat,
                    lng: createRestaurantDto.address.lng,
                }
            } : undefined,
            images: {
                createMany: {
                    data: createRestaurantDto.images.map(image => ({ image_url: image }))
                }
            },
            categories: {
                createMany: {
                    data: createRestaurantDto.category_ids.map(id => ({ category_id: id }))
                }
            },
        };

        return this.prisma.restaurant.create({
            data: data, include: {
                theme: true,
                address: true,
                images: true,
                categories: {
                    include: {
                        category: true,
                    }
                }
            }
        });
    }

    async findAll(): Promise<Restaurant[]> {
        return this.prisma.restaurant.findMany({
            include: {
                theme: true,
                address: true,
                images: true,
                categories: {
                    include: {
                        category: true,
                    }
                }
            }
        });
    }
}
