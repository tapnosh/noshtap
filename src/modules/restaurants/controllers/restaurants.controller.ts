import { BadRequestException, Body, Controller, Get, Post, Put, Param } from '@nestjs/common';
import { RestaurantsService } from '../services/restaurants.service';
import { CreateRestaurantDto } from '../dto/create-restaurant.dto';
import { UpdateRestaurantDto } from '../dto/update-restaurant.dto';
import { Restaurant } from '@prisma/client';
import { Public } from 'src/decorators/public.decorator';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from '@clerk/backend';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) { }

  @Post()
  create(@Body() createRestaurantDto: CreateRestaurantDto, @CurrentUser() user: User): Promise<Restaurant> {
    if (!createRestaurantDto.theme_id && !createRestaurantDto.theme) {
      throw new BadRequestException('You must provide either theme_id or theme');
    }

    return this.restaurantsService.create(createRestaurantDto, user.id);
  }

  @Get()
  @Public()
  findAll(): Promise<Restaurant[]> {
    return this.restaurantsService.findAll();
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateRestaurantDto,
    @CurrentUser() user: User,
  ) {
    return this.restaurantsService.update(id, dto, user.id);
  }
}