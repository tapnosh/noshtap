import { Body, Controller, Get, Post, Put, Delete, Param } from "@nestjs/common";
import { MenusService } from '../services/menus.service';
import { CreateMenuDto } from '../dto/requests/create-menu.dto';
import { UpdateMenuDto } from '../dto/requests/update-menu.dto';
import { CurrentUser } from "src/decorators/current-user.decorator";
import { User } from '@clerk/backend';
import { RestaurantMenu } from "@prisma/client";
import { Public } from "src/decorators/public.decorator";

@Controller('restaurants/:restaurantId/menu')
export class MenusController {
    constructor(private readonly menusService: MenusService) { }

    @Post()
    create(
        @Param('restaurantId') restaurantId: string,
        @Body() createMenuDto: CreateMenuDto,
        @CurrentUser() user: User,
    ): Promise<RestaurantMenu> {
        return this.menusService.create(restaurantId, createMenuDto, user.id);
    }


    @Put(':id')
    update(
        @Param('restaurantId') restaurantId: string,
        @Param('id') id: string,
        @Body() dto: UpdateMenuDto,
        @CurrentUser() user: User,
    ) {
        return this.menusService.update(id, restaurantId, dto, user.id);
    }

    @Delete(':id')
    async delete(
        @Param('restaurantId') restaurantId: string,
        @Param('id') id: string,
        @CurrentUser() user: User,
    ) {
        await this.menusService.delete(id, restaurantId, user.id);

        return {
            message: 'Menu deleted successfully',
        };
    }
}