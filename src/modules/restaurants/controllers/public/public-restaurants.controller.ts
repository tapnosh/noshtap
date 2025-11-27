import { Controller, Get, NotFoundException, Param, Query, BadRequestException } from "@nestjs/common";
import { RestaurantsService } from "../../services/restaurants.service";
import { Public } from "src/decorators/public.decorator";
import { RestaurantDto } from "../../dto/responses/restaurant.dto";
import { ApiQuery } from '@nestjs/swagger';

@Controller('public_api/restaurants')
@Public()
export class PublicRestaurantsController {
    constructor(
        private readonly restaurantsService: RestaurantsService,
    ) { }

    @Get()
    @ApiQuery({
        name: 'lat',
        required: false,
        type: Number,
        description: 'Latitude in decimal degrees',
    })
    @ApiQuery({
        name: 'lng',
        required: false,
        type: Number,
        description: 'Longitude in decimal degrees',
    })
    @ApiQuery({
        name: 'radiusKm',
        required: false,
        type: Number,
        description: 'Radius in kilometers',
    })

    async findAll(
        @Query('lat') lat?: string,
        @Query('lng') lng?: string,
        @Query('radiusKm') radiusKm?: string,
    ): Promise<RestaurantDto[]> {
        
        const numericLat = lat !== undefined ? Number(lat) : undefined;
        const numericLng = lng !== undefined ? Number(lng) : undefined;
        const numericRadiusKm = radiusKm !== undefined ? Number(radiusKm) : undefined;

        const anyGeoProvided = lat !== undefined || lng !== undefined || radiusKm !== undefined;

        if (anyGeoProvided) {
            if (
            numericLat === undefined || Number.isNaN(numericLat) ||
            numericLng === undefined || Number.isNaN(numericLng) ||
            numericRadiusKm === undefined || Number.isNaN(numericRadiusKm)
            ) {
            throw new BadRequestException('lat, lng and radiusKm must be all-or-nothing numeric parameters');
            }
        }

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