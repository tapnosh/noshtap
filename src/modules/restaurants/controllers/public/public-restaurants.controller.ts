import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { RestaurantsService } from "../../services/restaurants.service";
import { Public } from "src/decorators/public.decorator";
import { RestaurantDto } from "../../dto/responses/restaurant.dto";
import { CurrentUser } from "src/decorators/current-user.decorator";
import { User } from "@clerk/backend";

@Controller('public_api/restaurants')
@Public()
export class PublicRestaurantsController {
    constructor(
        private readonly restaurantsService: RestaurantsService,
    ) { }

    @Get()
    async findAll(@CurrentUser() user?: User): Promise<RestaurantDto[]> {
        const restaurants = await this.restaurantsService.findAll();

        return restaurants.map(restaurant => RestaurantDto.fromPrisma(restaurant, user?.id));
    }

    @Get(':slug')
    async findOne(@Param('slug') slug: string, @CurrentUser() user?: User): Promise<RestaurantDto> {
        const restaurant = await this.restaurantsService.findOne(slug);

        if (!restaurant) {
            throw new NotFoundException('Restaurant not found');
        }

        return RestaurantDto.fromPrisma(restaurant, user?.id);
    }
}