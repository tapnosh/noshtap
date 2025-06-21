import { Body, Controller, Get, Post, Put, Delete, Param } from "@nestjs/common";
import { MenusService } from '../services/menus.service';
import { CreateMenuDto } from '../dto/create-menu.dto';
import { UpdateMenuDto } from '../dto/update-menu.dto';
import { Public } from 'src/decorators/public.decorator';
import { CurrentUser } from "src/decorators/current-user.decorator";
import { User } from '@clerk/backend';
import { RestaurantMenu } from "@prisma/client";

@Controller('menus')
export class MenusController {
    constructor(private readonly menusService: MenusService) {}

    @Post()
    create(
        @Body() CreateMenuDto: CreateMenuDto,
        @CurrentUser() user: User,
    ): Promise<RestaurantMenu> {
        return this.menusService.create(CreateMenuDto, user.id);
    }

    @Get()
    findAll(
        @CurrentUser() user: User,
    ): Promise<RestaurantMenu[]> {
        return this.menusService.findAll(user.id);
    }

    @Get(':id')
    findOne(
        @Param('id') id: string,
        @CurrentUser() user: User,
    ): Promise<RestaurantMenu> {
        return this.menusService.findOne(id, user.id);
    }

    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() dto: UpdateMenuDto,
        @CurrentUser() user: User,
    ) {
        return this.menusService.update(id, dto, user.id);
    }

    @Delete(':id')
    delete(
        @Param('id') id: string,
        @CurrentUser() user: User
    ) {
        return this.menusService.delete(id, user.id);
    }
}