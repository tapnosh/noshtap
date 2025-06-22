import { BadRequestException, Body, Controller, Get, Post, Put, Delete, Param, NotFoundException } from '@nestjs/common';
import { RestaurantsService } from '../services/restaurants.service';
import { CreateRestaurantDto } from '../dto/requests/create-restaurant.dto';
import { UpdateRestaurantDto } from '../dto/requests/update-restaurant.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from '@clerk/backend';
import { RestaurantDto } from '../dto/responses/restaurant.dto';
import { QrService } from 'src/modules/restaurants/services/qr.service';
import { QrDto } from '../dto/responses/qr.dto';

@Controller('restaurants')
export class RestaurantsController {
  constructor(
    private readonly restaurantsService: RestaurantsService,
    private readonly qrService: QrService,
  ) { }

  @Post()
  async create(@Body() createRestaurantDto: CreateRestaurantDto, @CurrentUser() user: User): Promise<RestaurantDto> {
    if (!createRestaurantDto.theme_id && !createRestaurantDto.theme) {
      throw new BadRequestException('You must provide either theme_id or theme');
    }

    const restaurant = await this.restaurantsService.create(createRestaurantDto, user.id);

    return RestaurantDto.fromPrisma(restaurant, user.id);
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

  @Get()
  async findAll(@CurrentUser() user: User): Promise<RestaurantDto[]> {
    const restaurants = await this.restaurantsService.findAllForUser(user.id);

    return restaurants.map(restaurant => RestaurantDto.fromPrisma(restaurant));
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: User): Promise<RestaurantDto> {
    const restaurant = await this.restaurantsService.findById(id, user.id);

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    return RestaurantDto.fromPrisma(restaurant);
  }

  @Get('slug/:slug')
  async findOneBySlug(@Param('slug') slug: string, @CurrentUser() user: User): Promise<RestaurantDto> {
    const restaurant = await this.restaurantsService.findBySlug(slug, user.id);

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    return RestaurantDto.fromPrisma(restaurant);
  }

  @Get(':id/generate_qr')
  async generateQR(@Param('id') id: string, @CurrentUser() user: User): Promise<QrDto> {
    const restaurant = await this.restaurantsService.findById(id, user.id);

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    const qrCode = await this.qrService.generateCode(restaurant.id, restaurant.slug);

    return { code: qrCode };
  }
}