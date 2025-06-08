import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateRestaurantDto } from "../dto/create-restaurant.dto";
import { UpdateRestaurantDto } from "../dto/update-restaurant.dto";
import { Restaurant, Prisma } from "@prisma/client";
import { ForbiddenException, NotFoundException } from "@nestjs/common";

@Injectable()
export class RestaurantsService {
    constructor(private prisma: PrismaService) { }

    async create(createRestaurantDto: CreateRestaurantDto, userId: string): Promise<Restaurant> {
        const data: Prisma.RestaurantCreateInput = {
            name: createRestaurantDto.name,
            description: createRestaurantDto.description,
            ownerId: userId,
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

    async update(
        id: string, 
        dto: UpdateRestaurantDto,
        userId: string
    ): Promise<Restaurant> {
        const restaurant = await this.prisma.restaurant.findUnique({
            where: { id },
            include: { images: true, categories: true },
        });

        if (!restaurant) {
            throw new NotFoundException('Restauracja nie istnieje.');
        }
        
        if (restaurant.ownerId !== userId) {
            throw new ForbiddenException('Nie masz dostępu do tej restauracji.');
        }
        
        await this.prisma.restaurantImages.deleteMany( { where: { restaurant_id: id }});
        await this.prisma.restaurantCategoryRelation.deleteMany( { where: { restaurant_id: id }})

        await this.prisma.restaurantImages.createMany({
            data: dto.images.map((url) => ({
                restaurant_id: id,
                image_url: url,
            })),
        });

        await this.prisma.restaurantCategoryRelation.createMany({
            data: dto.category_ids.map((categoryId) => ({
                restaurant_id: id,
                category_id: categoryId,
            })),
        });

        return this.prisma.restaurant.update({
            where: { id },
            data: {
                name: dto.name,
                description: dto.description,
                theme: { connect: { id: dto.theme_id }},
            },
            include: {
                theme: true,
                address: true,
                images: true,
                categories: {
                    include: {
                        category: true,
                    },
                },
            },
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
