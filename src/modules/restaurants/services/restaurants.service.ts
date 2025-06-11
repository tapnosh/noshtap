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
        var data: Prisma.RestaurantCreateInput = {
            ownerId: userId,
            name: createRestaurantDto.name,
            description: createRestaurantDto.description,
            theme: this.getTheme(createRestaurantDto.theme_id, createRestaurantDto.theme),
            address: createRestaurantDto.address ? {
                create: {
                    name: createRestaurantDto.address.name,
                    lat: createRestaurantDto.address.lat,
                    lng: createRestaurantDto.address.lng,
                }
            } : undefined,
            images: {
                create: createRestaurantDto.images.map((image) => ({
                    image_url: image,
                })),
            },
            categories: {
                create: createRestaurantDto.category_ids.map((id) => ({
                    category: { connect: { id } },
                })),
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
            throw new NotFoundException('The restaurant does not exist.');
        }

        if (restaurant.ownerId !== userId) {
            throw new ForbiddenException('You do not have access to this restaurant.');
        }

        return this.prisma.restaurant.update({
            where: { id },
            data: {
                name: dto.name,
                description: dto.description,
                theme: { connect: { id: dto.theme_id } },
                images: {
                    disconnect: restaurant.images.map((img) => ({ id: img.id })),
                    create: dto.images.map((url) => ({
                        image_url: url,
                    })),
                },

                categories: {
                    disconnect: restaurant.categories.map((cat) => ({
                        id: cat.id,
                    })),
                    create: dto.category_ids.map((categoryId) => ({
                        category: {
                            connect: { id: categoryId },
                        },
                    })),
                },
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

    private getTheme(theme_id: string | undefined, theme: string | undefined): Prisma.RestaurantThemeCreateNestedOneWithoutRestaurantsInput {
        if (theme_id) {
            return { connect: { id: theme_id } };
        }

        return { create: { color: theme! } };
    }
}