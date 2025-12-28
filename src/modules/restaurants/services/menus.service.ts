import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateMenuDto } from "../dto/requests/create-menu.dto";
import { UpdateMenuDto } from "../dto/requests/update-menu.dto";
import { RestaurantMenu } from "@prisma/client";
import { MenuMapper } from "../mappers/menu.mapper";
import { BuilderDto } from "../dto/requests/builder.dto";

@Injectable()
export class MenusService {
    constructor(
        private prisma: PrismaService,
    ) { }

    async create(restaurantId: string, createMenuDto: CreateMenuDto, userId: string): Promise<RestaurantMenu & { schema: BuilderDto }> {
        const restaurant = await this.prisma.restaurant.findUnique({
            where: {
                id: restaurantId,
                ownerId: userId,
                is_deleted: false
            }
        });

        if (!restaurant) {
            throw new NotFoundException('Restaurant not found.');
        }

        const mappedData = MenuMapper.mapToDbCreate(createMenuDto.schema as BuilderDto);

        const menu = await this.prisma.restaurantMenu.create({
            data: {
                name: createMenuDto.name || this.generateRandomName(),
                ...mappedData,
                restaurant: {
                    connect: {
                        id: restaurantId,
                    }
                },
            },
            include: {
                headers: true,
                groups: {
                    include: {
                        items: {
                            include: {
                                image: true,
                                allergens: true,
                                foodTypes: true,
                                ingredients: true,
                                categories: true
                            }
                        }
                    }
                }
            }
        });

        return {
            ...menu,
            schema: MenuMapper.mapFromDb(menu)
        };
    }

    async update(
        id: string,
        restaurantId: string,
        updateMenuDto: UpdateMenuDto,
        userId: string,
    ): Promise<RestaurantMenu & { schema: BuilderDto }> {
        const mappedData = updateMenuDto.schema ? MenuMapper.mapToDbUpdate(updateMenuDto.schema as BuilderDto) : {};

        const menu = await this.prisma.restaurantMenu.update({
            where: {
                id: id,
                is_deleted: false,
                restaurant: {
                    id: restaurantId,
                    ownerId: userId,
                    is_deleted: false,
                },
            },
            data: {
                name: updateMenuDto.name,
                ...mappedData,
            },
            include: {
                headers: true,
                groups: {
                    include: {
                        items: {
                            include: {
                                image: true,
                                allergens: true,
                                foodTypes: true,
                                ingredients: true,
                                categories: true
                            }
                        }
                    }
                }
            }
        });

        return {
            ...menu,
            schema: MenuMapper.mapFromDb(menu)
        };
    }

    async delete(
        id: string,
        restaurantId: string,
        userId: string,
    ): Promise<void> {
        const result = await this.prisma.restaurantMenu.update({
            where: {
                id,
                is_deleted: false,
                restaurant: {
                    id: restaurantId,
                    ownerId: userId,
                    is_deleted: false,
                },
            },
            data: {
                is_deleted: true,
            }
        });

        if (!result) {
            throw new NotFoundException('Menu not found.');
        }

        return;
    }

    async findAll(restaurantId: string, userId: string): Promise<(RestaurantMenu & { schema: BuilderDto })[]> {
        const menus = await this.prisma.restaurantMenu.findMany({
            where: {
                restaurant_id: restaurantId,
                is_deleted: false,
                restaurant: {
                    id: restaurantId,
                    ownerId: userId,
                    is_deleted: false,
                },
            },
            include: {
                headers: true,
                groups: {
                    include: {
                        items: {
                            include: {
                                image: true,
                                allergens: true,
                                foodTypes: true,
                                ingredients: true,
                                categories: true
                            }
                        }
                    }
                }
            }
        });

        return menus.map(menu => ({
            ...menu,
            schema: MenuMapper.mapFromDb(menu)
        }));
    }

    async findLatest(restaurantId: string): Promise<(RestaurantMenu & { schema: BuilderDto }) | null> {
        const menu = await this.prisma.restaurantMenu.findFirst({
            where: {
                restaurant_id: restaurantId,
                is_deleted: false,
                restaurant: {
                    id: restaurantId,
                    is_deleted: false,
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                headers: true,
                groups: {
                    include: {
                        items: {
                            include: {
                                image: true,
                                allergens: true,
                                foodTypes: true,
                                ingredients: true,
                                categories: true
                            }
                        }
                    }
                }
            }
        });

        if (!menu) return null;

        return {
            ...menu,
            schema: MenuMapper.mapFromDb(menu)
        };
    }

    private generateRandomName(): string {
        const adjectives = [
            'Delicious', 'Fresh', 'Seasonal', 'Chef\'s', 'Special', 'Premium', 'Signature',
            'Classic', 'Modern', 'Traditional', 'Gourmet', 'Artisan', 'House', 'Daily',
            'Weekly', 'Featured', 'Popular', 'Recommended', 'Exclusive', 'Limited'
        ];

        const menuTypes = [
            'Menu', 'Selection', 'Collection', 'Offerings', 'Specials', 'Favorites',
            'Choices', 'Options', 'Dishes', 'Cuisine', 'Delights', 'Treats',
            'Selections', 'Creations', 'Picks', 'Recommendations'
        ];

        const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomMenuType = menuTypes[Math.floor(Math.random() * menuTypes.length)];

        return `${randomAdjective} ${randomMenuType}`;
    }

}