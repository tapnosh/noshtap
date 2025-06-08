import { Body, Controller, Get, Post } from '@nestjs/common';
import { ThemesService } from './themes.service';
import { CreateThemeDto } from './dto/create-theme.dto';
import { Public } from 'src/decorators/public.decorator';

@Controller('restaurant-theme')
export class ThemesController {
  constructor(private readonly themesService: ThemesService) {}

  @Get()
  @Public()
  getAllThemes() {
    return this.themesService.findAll();
  }

  @Post()
  createTheme(@Body() createThemeDto: CreateThemeDto) {
    return this.themesService.create(createThemeDto);
  }
}
