import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from '../../services/categories.service';
import { RestaurantCategory } from '@prisma/client';
import { Public } from 'src/decorators/public.decorator';


@Controller('public_api/categories')
@Public()
export class PublicCategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Get()
    findAll(): Promise<RestaurantCategory[]> {
        return this.categoriesService.findAll();
    }
}