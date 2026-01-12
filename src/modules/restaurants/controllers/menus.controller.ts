import { Body, Controller, Get, Post, Put, Delete, Param } from "@nestjs/common";
import { MenusService } from '../services/menus.service';
import { CreateMenuDto } from '../dto/requests/create-menu.dto';
import { UpdateMenuDto } from '../dto/requests/update-menu.dto';
import { DisableMenuItemDto } from '../dto/requests/disable-menu-item.dto';
import { CurrentUser } from "src/decorators/current-user.decorator";
import { User } from '@clerk/backend';
import { RestaurantMenu } from "@prisma/client";

@Controller('restaurants/:restaurantId/menu')
export class MenusController {
    constructor(private readonly menusService: MenusService) { }

    @Get()
    findAll(
        @Param('restaurantId') restaurantId: string,
        @CurrentUser() user: User,
    ) {
        return this.menusService.findAll(restaurantId, user.id);
    }

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

    @Post('disable-item')
    disableItem(
        @Body() disableMenuItemDto: DisableMenuItemDto,
        @CurrentUser() user: User,
    ) {
        return this.menusService.disableItem(disableMenuItemDto, user.id);
    }
}