import { Controller, Get, Param } from "@nestjs/common";
import { MenusService } from '../../services/menus.service';
import { RestaurantMenu } from "@prisma/client";
import { Public } from "src/decorators/public.decorator";

@Controller('public_api/restaurants/:restaurantId/menu')
@Public()
export class PublicMenusController {
    constructor(private readonly menusService: MenusService) { }

    @Get()
    findLatest(
        @Param('restaurantId') restaurantId: string,
    ): Promise<RestaurantMenu | null> {
        return this.menusService.findLatest(restaurantId);
    }
}