import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateMenuDto } from "../dto/create-menu.dto";
import { UpdateMenuDto } from "../dto/update-menu.dto";
import { RestaurantMenu } from "@prisma/client";

@Injectable()
export class MenusService {
    constructor(private prisma: PrismaService) {}

    async create(CreateMenuDto: CreateMenuDto, userId: string): Promise<RestaurantMenu> {
        return this.prisma.restaurantMenu.create({
            data: {
                name: CreateMenuDto.name,
                schema: CreateMenuDto.schema,
                UserId: userId,
                restaurant: { connect: { id: CreateMenuDto.restaurant_id } },
            },
        });
    }

    async findAll(userId: string): Promise<RestaurantMenu[]> {
        return this.prisma.restaurantMenu.findMany({
            where: { 
                UserId: userId,
                is_deleted: false,
            },
        });
    }

    async findOne(id: string, userId: string): Promise<RestaurantMenu> {
        const menu = await this.prisma.restaurantMenu.findUnique({ where: { id } });

        if (!menu) { // || menu.is_deleted - frontend needs access to deleted menus for data extraction
            throw new NotFoundException('Menu not found.');
        }

        if (menu.UserId !== userId) {
            throw new ForbiddenException('You do not have access to this menu.');
        }

        return menu;
    }

    async update(
        id: string,
        UpdateMenuDto: UpdateMenuDto,
        userId: string,
    ): Promise<RestaurantMenu> {
        const updated = await this.prisma.restaurantMenu.updateMany({
            where: {
                id,
                UserId: userId,
                is_deleted: false,
            },
            data: {
                name: UpdateMenuDto.name,
                schema: UpdateMenuDto.schema,
            },
        });

        if (updated.count == 0) {
            const menu = await this.prisma.restaurantMenu.findUnique({ where: { id } });

            if (!menu || menu.is_deleted) {
                throw new NotFoundException('Menu not found.');
            }

            throw new ForbiddenException('You do not have permission to edit this menu.');
        }

       const result = await this.prisma.restaurantMenu.findUnique({ where: { id } });

       if (!result) {
            throw new NotFoundException('Menu not found after update.');
       }

       return result;
    }

    async delete(
        id: string,
        userId: string,
    ): Promise<void> {
        const result = await this.prisma.restaurantMenu.updateMany({
            where: {
                id,
                UserId: userId,
                is_deleted: false,
            },
            data: {
                is_deleted: true,
            }
        });

        if (result.count == 0) {
            const menu = await this.prisma.restaurantMenu.findUnique({ where: { id } });

            if (!menu || menu.is_deleted) {
                throw new NotFoundException('Menu not found.');
            }

            throw new ForbiddenException('You do not have permission to delete this menu.');
        }
    }
}