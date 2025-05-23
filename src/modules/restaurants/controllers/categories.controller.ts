import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { RestaurantCategory } from '@prisma/client';


@Controller('restaurants/categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto): Promise<RestaurantCategory> {
        return this.categoriesService.create(createCategoryDto);
    }

    @Get()
    findAll(): Promise<RestaurantCategory[]> {
        return this.categoriesService.findAll();
    }
}