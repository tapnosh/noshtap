import { BadRequestException, Body, Controller, Get, Post, Put, Delete, Param } from '@nestjs/common';
import { RestaurantsService } from '../services/restaurants.service';
import { CreateRestaurantDto } from '../dto/requests/create-restaurant.dto';
import { UpdateRestaurantDto } from '../dto/requests/update-restaurant.dto';
import { Public } from 'src/decorators/public.decorator';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from '@clerk/backend';
import { RestaurantDto } from '../dto/responses/restaurant.dto';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) { }

  @Post()
  async create(@Body() createRestaurantDto: CreateRestaurantDto, @CurrentUser() user: User): Promise<RestaurantDto> {
    if (!createRestaurantDto.theme_id && !createRestaurantDto.theme) {
      throw new BadRequestException('You must provide either theme_id or theme');
    }

    const restaurant = await this.restaurantsService.create(createRestaurantDto, user.id);

    return RestaurantDto.fromPrisma(restaurant, user.id);
  }

  @Get()
  @Public()
  async findAll(): Promise<RestaurantDto[]> {
    const restaurants = await this.restaurantsService.findAll();

    return restaurants.map(restaurant => RestaurantDto.fromPrisma(restaurant));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateRestaurantDto,
    @CurrentUser() user: User,
  ) {
    const restaurant = await this.restaurantsService.update(id, dto, user.id);

    return RestaurantDto.fromPrisma(restaurant, user.id);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    await this.restaurantsService.delete(id, user.id);

    return { message: 'Restaurant deleted successfully' };
  }
}