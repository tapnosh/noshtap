import { Controller, Get, Query } from '@nestjs/common';
import { CategoriesService } from '../../services/categories.service';
import { RestaurantCategory } from '@prisma/client';
import { Public } from 'src/decorators/public.decorator';
import { CategoryDto } from '../../dto/responses/category.dto';

@Controller('public_api/categories')
@Public()
export class PublicCategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Get()
  findAll(@Query('type') type?: string): Promise<CategoryDto[]> {
    return this.categoriesService.findAll(type);
  }
}
