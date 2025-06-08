import { Body, Controller, Get, Post, Put, Param, Req, UseGuards } from '@nestjs/common';
import { RestaurantsService } from '../services/restaurants.service';
import { CreateRestaurantDto } from '../dto/create-restaurant.dto';
import { UpdateRestaurantDto } from '../dto/update-restaurant.dto';
import { Restaurant } from '@prisma/client';
import { Public } from 'src/decorators/public.decorator';
import { ClerkAuthGuard } from 'src/modules/auth/clerk-auth.guard';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) { }

  @Post()
  @UseGuards(ClerkAuthGuard)
  create(@Body() createRestaurantDto: CreateRestaurantDto, @Req() req: any,): Promise<Restaurant> {
    return this.restaurantsService.create(createRestaurantDto, req.auth.userId);
  }

  @Get()
  @Public()
  findAll(): Promise<Restaurant[]> {
    return this.restaurantsService.findAll();
  }

  @Put(':id')
  @UseGuards(ClerkAuthGuard)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateRestaurantDto,
    @Req() req: any,
  ){
    return this.restaurantsService.update(id, dto, req.auth.userId);
  }
}