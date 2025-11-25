import { Controller, Get, NotFoundException, Param, Query } from "@nestjs/common";
import { RestaurantsService } from "../../services/restaurants.service";
import { Public } from "src/decorators/public.decorator";
import { RestaurantDto } from "../../dto/responses/restaurant.dto";

@Controller('public_api/restaurants')
@Public()
export class PublicRestaurantsController {
    constructor(
        private readonly restaurantsService: RestaurantsService,
    ) { }

    @Get()
    async findAll(
        @Query('lat') lat?: string,
        @Query('lng') lng?: string,
        @Query('radiusKm') radiusKm?: string,
    ): Promise<RestaurantDto[]> {
        
        const numericLat = lat !== undefined ? Number(lat) : undefined;
        const numericLng = lng !== undefined ? Number(lng) : undefined;
        const numericRadiusKm = radiusKm !== undefined ? Number(radiusKm) : undefined;

        const restaurants = await this.restaurantsService.findAllWithLocation(
            numericLat,
            numericLng,
            numericRadiusKm,
        );

        return restaurants.map(restaurant => RestaurantDto.fromPrisma(restaurant));
    }

    @Get(':slug')
    async findOne(@Param('slug') slug: string): Promise<RestaurantDto> {
        const restaurant = await this.restaurantsService.findBySlug(slug);

        if (!restaurant) {
            throw new NotFoundException('Restaurant not found');
        }

        return RestaurantDto.fromPrisma(restaurant);
    }
}