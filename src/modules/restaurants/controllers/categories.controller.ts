import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto } from '../dto/requests/create-category.dto';
import { RestaurantCategory } from '@prisma/client';
import { UpdateCategoryDto } from '../dto/requests/update-category.dto';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto): Promise<RestaurantCategory> {
        return this.categoriesService.create(createCategoryDto);
    }

    @Post(':id')
    update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto): Promise<RestaurantCategory> {
        return this.categoriesService.update(id, updateCategoryDto);
    }

    @Delete(':id')
    delete(@Param('id') id: string): Promise<RestaurantCategory> {
        return this.categoriesService.delete(id);
    }

    @Get()
    findAll(): Promise<RestaurantCategory[]> {
        return this.categoriesService.findAll();
    }
}