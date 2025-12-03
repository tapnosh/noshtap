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

        const anyGeoProvided = this.anyGeoProvided(lat, lng, radiusKm);

        const numericLat = this.parseNumberQueryParam(lat);
        const numericLng = this.parseNumberQueryParam(lng);
        const numericRadiusKm = this.parseNumberQueryParam(radiusKm);

        if (anyGeoProvided) {
            this.ensureValidGeoParams(numericLat, numericLng, numericRadiusKm);
        }

        const restaurants = anyGeoProvided
            ? await this.restaurantsService.findAllWithLocation(
                numericLat!,
                numericLng!,
                numericRadiusKm!,
            )
            : await this.restaurantsService.findAll();

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

    private anyGeoProvided(
        lat?: string,
        lng?: string,
        radiusKm?: string,
    ): boolean {
        return lat !== undefined || lng !== undefined || radiusKm !== undefined;
    }

    private parseNumberQueryParam(value?: string): number | undefined {
        if (value === undefined) {
            return undefined;
        }

        const num = Number(value);
        return Number.isNaN(num) ? undefined : num;
    }

    private ensureValidGeoParams(
        lat?: number,
        lng?: number,
        radiusKm?: number,
    ): void {
        const allProvided =
            lat !== undefined &&
            lng !== undefined &&
            radiusKm !== undefined;

        const noneProvided =
            lat === undefined &&
            lng === undefined &&
            radiusKm === undefined;

        if (allProvided || noneProvided) {
            return;
        }

        throw new BadRequestException('Please provide all arguments lat, lng and radiusKm or remove all.');
    }
}